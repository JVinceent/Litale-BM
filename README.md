# Litale model experiments

Small Node.js scripts to compare AI models for Litale:

1. **Speech-to-text**: how well a model transcribes Tagalog/Taglish recordings (measured as Word Error Rate).
2. **Scene division**: whether a model splits a transcript into exactly 4 valid scenes.

No npm install, server or database is needed.

## Setup

1. Install **Node.js 20.6 or newer** (`node --version`).
2. Copy `.env.example` to `.env` and paste your Groq API key:
   ```
   GROQ_API_KEY=gsk_...
   ```
   `.env` is in `.gitignore`. Never commit or share it.
3. Put recordings in `audio/` (`.m4a`, `.mp3`, `.wav`, max 25 MB on the Groq free tier).
4. For each recording, type the correct transcript into `references/` using the **same name**:
   `audio/lola.m4a` → `references/lola.txt`.

**File names:** the story name is everything before the first dot, so use names like
`lola-nena.m4a`, not `lola.nena.m4a`.

## Run each script (from this folder)

```bash
# 1. Transcribe (all speech-to-text models in config.mjs, or just one)
node --env-file=.env transcribe.mjs audio/lola.m4a
node --env-file=.env transcribe.mjs audio/lola.m4a whisper-large-v3 --prompt "Lola Nena, Batangas, kalabaw"

# 2. Word Error Rate for one transcript
node wer.mjs references/lola.txt results/lola.whisper-large-v3.txt

# 3. Split into 4 scenes (from a reference or from a model transcript)
node --env-file=.env scenes.mjs references/sample.txt
node --env-file=.env scenes.mjs results/lola.whisper-large-v3.txt --runs 5

# 4. Report per story → results/report/<story>.md (add a story name to rebuild just that one)
node report.mjs
node report.mjs crush
```

What each script saves in `results/`:

| Script | Files |
|---|---|
| transcribe.mjs | `<story>.<model>.json` (full response), `<story>.<model>.txt` (text only) |
| scenes.mjs | `<story>.<model>.scenes.json`, or `<story>.<model>.run<N>.scenes.json` with `--runs` |
| report.mjs | `report/<story>.md` (one readable report per story) |

`--prompt` gives Whisper spelling hints for names and places (about 224 tokens max).
`--runs N` runs the same input N times so you can see whether the model gives consistent results.

## Add a second model to compare

Edit `config.mjs`:

```js
export const models = {
  stt: ['whisper-large-v3', 'whisper-large-v3-turbo'],
  scenes: ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b'],
};
```

Note: the original plan used `llama-3.3-70b-versatile` for scenes, but Groq no longer offers it
(checked 2026-11-16), so the default is `openai/gpt-oss-120b`.

Rerun the script **without** a model argument and every model in the list runs on the same file.
Then run `node report.mjs` to see them side by side. Use model IDs from Groq's current model list.
A model from a different provider would need its own URL and API key in the script.

## Try it before real recordings exist

- `node wer.mjs references/sample.txt references/sample.txt` should print 0.0%.
- `node --env-file=.env scenes.mjs references/sample.txt` should print 4 PASS lines.
- Record someone reading `references/sample.txt`, save it as `audio/sample.m4a`, then transcribe it.
