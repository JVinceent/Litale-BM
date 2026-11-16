// Split a transcript into 4 children's-book scenes with a Groq chat model, then check the output.
// Usage: node --env-file=.env scenes.mjs <transcript.txt> [model] [--runs N]
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { GROQ, RESULTS, models, errorText, requireKey } from './config.mjs';

const SYSTEM = `You turn a grandparent's spoken story into a children's book for Grade 1-3
readers in the Philippines. The story is given as numbered sentences.
Split it into exactly 4 scenes, in the original order.
Rules:
- Use only events, people and places from the story. Never add new ones.
- Keep the storyteller's language (Tagalog, English or Taglish).
- Rewrite each scene in 1 to 3 short, simple sentences.
- Every sentence number belongs to exactly one scene.
Return JSON only:
{"title": string, "scenes": [{"position": 1, "sentence_start": 1,
"sentence_end": 3, "text": string, "visual": string}]}
"visual" is one English sentence describing what to draw.`;

const args = process.argv.slice(2);
const r = args.indexOf('--runs'), runs = r >= 0 ? Number(args.splice(r, 2)[1]) : 1, [file, modelArg] = args;
if (!file || !Number.isInteger(runs) || runs < 1) {
  console.error('Usage: node --env-file=.env scenes.mjs <transcript.txt> [model] [--runs N]');
  process.exit(1);
}
requireKey();

// Split into sentences and number them [1], [2], ...
const sentences = (await readFile(file, 'utf8')).trim().split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
if (sentences.length < 4) { console.error(`Need at least 4 sentences, found ${sentences.length}.`); process.exit(1); }
const numbered = sentences.map((s, i) => `[${i + 1}] ${s}`).join('\n');
const story = basename(file).split('.')[0]; // "lola.whisper-large-v3.txt" -> "lola"

// Returns the parsed output and a list of PASS/FAIL checks.
function validate(raw, n) {
  let output = null;
  try { output = JSON.parse(raw); } catch {}
  const s = Array.isArray(output?.scenes) ? output.scenes : [];
  // Scenes must cover 1..n in order: each starts right after the previous one ends.
  let next = 1;
  const contiguous = s.length > 0 && s.every(sc => {
    const ok = sc.sentence_start === next && Number.isInteger(sc.sentence_end) && sc.sentence_end >= next;
    next = sc.sentence_end + 1;
    return ok;
  });
  const check = (name, pass) => ({ name, pass });
  return { output, checks: [
    check('valid JSON', output !== null && typeof output === 'object'),
    check('exactly 4 scenes', s.length === 4),
    check('positions 1-4 in order', s.length === 4 && s.every((sc, i) => sc.position === i + 1)),
    check('every sentence used exactly once', contiguous && next === n + 1),
  ] };
}

await mkdir(RESULTS, { recursive: true });
for (const model of modelArg ? [modelArg] : models.scenes) {
  for (let run = 1; run <= runs; run++) {
    const res = await fetch(`${GROQ}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model, temperature: 0.2, response_format: { type: 'json_object' }, // Groq JSON mode
        messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: numbered }],
      }),
    });
    if (!res.ok) {
      console.error(`[${model} run ${run}] Request failed: HTTP ${res.status} - ${await errorText(res)}`);
      process.exitCode = 1; continue;
    }
    const raw = (await res.json()).choices?.[0]?.message?.content ?? '';
    const { output, checks } = validate(raw, sentences.length);
    console.log(`\n[${model}] run ${run}/${runs}`);
    for (const c of checks) console.log(`  ${c.pass ? 'PASS' : 'FAIL'}  ${c.name}`);
    const suffix = runs > 1 ? `.run${run}` : '';
    const path = `${RESULTS}/${story}.${model.replaceAll('/', '_')}${suffix}.scenes.json`;
    await writeFile(path, JSON.stringify({ story, model, run, source: basename(file), sentences, checks, output, raw }, null, 2));
    console.log(`  saved ${path}`);
  }
}
