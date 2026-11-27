// Split a transcript into 4 children's-book scenes with a Groq chat model, then check the output.
// Usage: node --env-file=.env scenes.mjs <transcript.txt | story>... [--model id] [--prompt v1|v2|v3|v4] [--runs N]
//   A story name (e.g. "crush") runs references/crush.txt plus every results/crush.*.txt transcript.
import { existsSync, readFileSync } from 'node:fs';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { GROQ, RESULTS, REFERENCES, models, errorText, requireKey } from './config.mjs';

// Prompt versions. Add a new key to try a new prompt; old results stay comparable by name.
const PROMPTS = {
  // Original prompt, written for clean hand-typed text.
  v1: `You turn a grandparent's spoken story into a children's book for Grade 1-3
readers in the Philippines. The story is given as numbered sentences.
Split it into exactly 4 scenes, in the original order.
Rules:
- Use only events, people and places from the story. Never add new ones.
- Keep the storyteller's language (Tagalog, English or Taglish).
- Rewrite each scene in 1 to 3 short, simple sentences.
- Every sentence number belongs to exactly one scene.
"visual" is one English sentence describing what to draw.`,

  // Written for speech-to-text output: misheard words, missing periods, self-corrections.
  v2: `You turn a grandparent's spoken story into a children's book for Grade 1-3
readers in the Philippines. The story is given as numbered sentences taken from an
automatic speech-to-text transcript. It can contain misheard words, missing
punctuation and repeated words.

Split it into exactly 4 scenes, in the original order.
- A new scene starts when the time, the place or the main event changes.
- Every sentence number belongs to exactly one scene. Scene 1 starts at sentence 1,
  each scene starts right after the previous one ends, and scene 4 ends at the last sentence.

Write each scene:
- Use only events, people and places from the story. Never add new ones.
- If a word looks misheard, use the word the story clearly means. If it is not clear,
  leave it out. Never guess a name.
- If the storyteller corrects themselves ("hindi pala", "ay, mali"), use only the corrected version.
- Keep the storyteller's language (Tagalog, English or Taglish).
- Write 1 to 3 short, simple sentences.
"visual" is one English sentence describing what to draw, using only details from that scene.`,

  // Read-along: the child hears the original recording, so the text stays in the storyteller's words.
  v3: `You turn a grandparent's spoken story into a children's book for Grade 1-3
readers in the Philippines. The story is given as numbered sentences taken from an
automatic speech-to-text transcript. The child will read each scene while hearing
the grandparent's own recording, so the text must match what was said.

Split it into exactly 4 scenes, in the original order.
- A new scene starts when the time, the place or the main event changes.
- Every sentence number belongs to exactly one scene. Scene 1 starts at sentence 1,
  each scene starts right after the previous one ends, and scene 4 ends at the last sentence.

Write each scene's "text":
- Copy the storyteller's sentences in order, in their own words. Do not summarize or paraphrase.
- Never translate. Each word and phrase stays in the language it was spoken in.
- Change only these: fix a word that is clearly misheard, add missing punctuation,
  and remove fillers and accidental repeats.
- If it is not clear what a misheard word means, leave it out. Never guess a name.
- If the storyteller corrects themselves, keep only the corrected version.
- Never add events, people, places or feelings.
"visual" is one English sentence describing what to draw, using only details from that scene.`,

  // v3 plus: no translating, self-corrections kept, and "visual" written for an image model.
  v4: `You turn a grandparent's spoken story into a children's book for Grade 1-3
readers in the Philippines. The story is given as numbered sentences taken from an
automatic speech-to-text transcript. The child will read each scene while hearing
the grandparent's own recording, so the text must match what was said.

Split it into exactly 4 scenes, in the original order.
- A new scene starts when the time, the place or the main event changes.
- Every sentence number belongs to exactly one scene. Scene 1 starts at sentence 1,
  each scene starts right after the previous one ends, and scene 4 ends at the last sentence.
  Before answering, check that no number is skipped or used twice.

Write each scene's "text":
- Copy the storyteller's sentences in order, in their own words. Do not summarize or paraphrase.
- Never translate. An English phrase such as "last week" stays "last week", and a
  Tagalog phrase stays Tagalog.
- Change only these: fix a word that is clearly misheard, add missing punctuation,
  and remove fillers and accidental repeats.
- If it is not clear what a misheard word means, leave it out. Never guess a name.
- If the storyteller corrects themselves, keep the whole correction as it was said.
- Never add events, people, places or feelings.

Write each scene's "visual" in English, for an artist who has not read the story:
- Describe exactly one moment from that scene, in one or two sentences.
- The storyteller ("ako") is the grandparent, not the child listening. In past events,
  show them at the age they were then.
- Do not use names. Give each main person a short description (age, man or woman, hair,
  clothes) and repeat exactly the same words in every visual where they appear.
- Describe what a Filipino object, vehicle or flower looks like, not only its name.
- If the storyteller corrected a fact, draw only the corrected fact.
- Do not ask for any text, signs or lettering.`,
};

// Groq strict structured outputs: every field required, no extra fields.
const SCHEMA = {
  type: 'object', additionalProperties: false, required: ['title', 'scenes'],
  properties: {
    title: { type: 'string' },
    scenes: { type: 'array', items: {
      type: 'object', additionalProperties: false,
      required: ['position', 'sentence_start', 'sentence_end', 'text', 'visual'],
      properties: {
        position: { type: 'integer' }, sentence_start: { type: 'integer' }, sentence_end: { type: 'integer' },
        text: { type: 'string' }, visual: { type: 'string' },
      },
    } },
  },
};

// Silence (seconds) treated as a sentence end when Whisper left out the period.
// Picked from the jeep/crush recordings, where real sentence breaks had 0.7-1.4 s pauses.
const PAUSE = 0.6;

const args = process.argv.slice(2);
const flag = (name, fallback) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : fallback; };
const modelArg = flag('--model'), promptName = flag('--prompt', 'v1'), runs = Number(flag('--runs', '1'));
if (!args.length || !Number.isInteger(runs) || runs < 1 || !PROMPTS[promptName]) {
  console.error(`Usage: node --env-file=.env scenes.mjs <transcript.txt | story>... [--model id] [--prompt ${Object.keys(PROMPTS).join('|')}] [--runs N]`);
  process.exit(1);
}
requireKey();

// "crush" -> references/crush.txt + results/crush.*.txt
const resultFiles = await readdir(RESULTS);
const files = args.flatMap(a => existsSync(a) ? [a] : [
  ...(existsSync(`${REFERENCES}/${a}.txt`) ? [`${REFERENCES}/${a}.txt`] : []),
  ...resultFiles.filter(f => f.startsWith(`${a}.`) && f.endsWith('.txt')).map(f => `${RESULTS}/${f}`),
]);
if (!files.length) { console.error(`No transcripts found for: ${args.join(', ')}`); process.exit(1); }

// Sentences for the model. Whisper transcripts have a .json next to them with word timestamps:
// end a sentence at . ! ? or at a pause. Hand-typed references: split at . ! ? (also before a
// closing quote) and at blank lines. "times" holds each sentence's start/end second in the
// recording (null for hand-typed text, which has no timestamps).
const END = /[.!?]["”’']?$/;
function sentencesOf(file) {
  const json = file.replace(/\.txt$/, '.json');
  const words = existsSync(json) ? JSON.parse(readFileSync(json, 'utf8')).words : null;
  if (!Array.isArray(words) || !words.length)
    return { times: null,
      sentences: readFileSync(file, 'utf8').trim().split(/(?<=[.!?]["”’']?)\s+|\n\s*\n/).map(s => s.trim()).filter(Boolean) };
  const sentences = [], times = []; let cur = [];
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    if (!next || END.test(w.word.trim()) || next.start - w.end >= PAUSE) {
      sentences.push(cur.map(c => c.word.trim()).join(' '));
      times.push({ start: cur[0].start, end: w.end });
      cur = [];
    }
  });
  return { sentences, times };
}

// Returns a list of PASS/FAIL checks for the model output.
function validate(output, n) {
  const s = Array.isArray(output?.scenes) ? output.scenes : [];
  // Scenes must cover 1..n in order: each starts right after the previous one ends.
  let next = 1;
  const contiguous = s.length > 0 && s.every(sc => {
    const ok = sc.sentence_start === next && Number.isInteger(sc.sentence_end) && sc.sentence_end >= next;
    next = sc.sentence_end + 1;
    return ok;
  });
  const check = (name, pass) => ({ name, pass });
  return [
    check('valid JSON', output !== null && typeof output === 'object'),
    check('exactly 4 scenes', s.length === 4),
    check('positions 1-4 in order', s.length === 4 && s.every((sc, i) => sc.position === i + 1)),
    check('every sentence used exactly once', contiguous && next === n + 1),
  ];
}

// POST with one or two waits if Groq's free tier says "too many requests".
async function chat(body) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${GROQ}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.status !== 429 || attempt === 3) return res;
    const wait = Number(res.headers.get('retry-after')) || 10;
    console.log(`  rate limited, waiting ${wait}s`);
    await new Promise(r => setTimeout(r, wait * 1000));
  }
}

const OUT = `${RESULTS}/scenes`;
await mkdir(OUT, { recursive: true });
for (const file of files) {
  const { sentences, times } = sentencesOf(file);
  if (sentences.length < 4) { console.error(`${file}: need at least 4 sentences, found ${sentences.length}.`); continue; }
  const numbered = sentences.map((s, i) => `[${i + 1}] ${s}`).join('\n');
  const story = basename(file).split('.')[0];
  // "crush.whisper-large-v3.txt" -> "crush.whisper-large-v3"; "crush.txt" -> "crush.reference"
  const stem = basename(file, '.txt'), source = stem === story ? `${story}.reference` : stem;

  for (const model of modelArg ? [modelArg] : models.scenes) {
    for (let run = 1; run <= runs; run++) {
      const t0 = Date.now();
      const res = await chat({
        model, temperature: 0.2,
        response_format: { type: 'json_schema', json_schema: { name: 'scenes', strict: true, schema: SCHEMA } },
        messages: [{ role: 'system', content: PROMPTS[promptName] }, { role: 'user', content: numbered }],
      });
      const ms = Date.now() - t0;
      const path = `${OUT}/${source}.${model.replaceAll('/', '_')}.${promptName}.run${run}.scenes.json`;
      if (!res.ok) {
        const error = await errorText(res);
        console.error(`[${source} · ${model} · ${promptName} · run ${run}] HTTP ${res.status} - ${error}`);
        process.exitCode = 1;
        // 400 = the model could not produce schema-valid JSON. Save it as a failed run so
        // compare.mjs counts it. Other errors (key, blocked model, limits) are not the model's fault.
        if (res.status === 400) await writeFile(path, JSON.stringify({
          story, source, model, prompt: promptName, run, ms, error, sentences, checks: validate(null, sentences.length), output: null,
        }, null, 2));
        continue;
      }
      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content ?? '';
      let output = null;
      try { output = JSON.parse(raw); } catch {}
      const checks = validate(output, sentences.length);
      // Where each scene sits in the recording (the backend's scenes.audio_start / audio_end).
      if (times && checks.every(c => c.pass)) for (const sc of output.scenes) {
        sc.audio_start = times[sc.sentence_start - 1].start;
        sc.audio_end = times[sc.sentence_end - 1].end;
      }
      console.log(`[${source} · ${model} · ${promptName}] run ${run}/${runs}  ${checks.every(c => c.pass) ? 'PASS' : 'FAIL'}  ${ms} ms`);
      for (const c of checks.filter(c => !c.pass)) console.log(`  FAIL  ${c.name}`);
      await writeFile(path, JSON.stringify({
        story, source, model, prompt: promptName, run, ms, usage: data.usage, sentences, checks, output, raw,
      }, null, 2));
    }
  }
}
console.log(`\nSaved to ${OUT}. Next: node compare.mjs`);
