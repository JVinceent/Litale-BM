// Transcribe one Tagalog/Taglish recording with a Groq Whisper model.
// Usage: node --env-file=.env transcribe.mjs <audio file> [model] [--prompt "Lola Nena, Batangas"]
import { openAsBlob, existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { GROQ, RESULTS, models, errorText, requireKey } from './config.mjs';

const args = process.argv.slice(2);
const p = args.indexOf('--prompt');
const prompt = p >= 0 ? args.splice(p, 2)[1] : null;
const [audioPath, modelArg] = args;
if (!audioPath) {
  console.error('Usage: node --env-file=.env transcribe.mjs <audio file> [model] [--prompt "names, places"]');
  process.exit(1);
}
if (!existsSync(audioPath)) { console.error(`Audio file not found: ${audioPath}`); process.exit(1); }
requireKey();

const story = basename(audioPath).split('.')[0]; // "lola.m4a" -> "lola"
await mkdir(RESULTS, { recursive: true });

for (const model of modelArg ? [modelArg] : models.stt) {
  const form = new FormData();
  form.append('file', await openAsBlob(audioPath), basename(audioPath)); // Groq free tier: max 25 MB
  form.append('model', model);
  form.append('language', 'tl'); // Tagalog
  form.append('response_format', 'verbose_json');
  // Word-level timestamps. Groq documents this option (needs verbose_json).
  // If Groq ever rejects it, delete this one line.
  form.append('timestamp_granularities[]', 'word');
  // Optional spelling hints for names/places. Groq limits the prompt to about 224 tokens.
  if (prompt) form.append('prompt', prompt);

  const res = await fetch(`${GROQ}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: form,
  });
  if (!res.ok) {
    console.error(`[${model}] Request failed: HTTP ${res.status} - ${await errorText(res)}`);
    process.exitCode = 1;
    continue;
  }

  const data = await res.json();
  const out = `${RESULTS}/${story}.${model.replaceAll('/', '_')}`;
  await writeFile(`${out}.json`, JSON.stringify(data, null, 2)); // full response
  await writeFile(`${out}.txt`, data.text.trim() + '\n');        // text only
  console.log(`[${model}] saved ${out}.json and ${out}.txt`);
}
