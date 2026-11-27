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

# 3. Split into 4 scenes. A story name runs the reference AND every Whisper transcript of it.
node --env-file=.env scenes.mjs references/sample.txt
node --env-file=.env scenes.mjs crush --prompt v2 --runs 5
node --env-file=.env scenes.mjs results/lola.whisper-large-v3.txt --model openai/gpt-oss-20b

# 4. Speech-to-text report per story → results/report/<story>.md
node report.mjs
node report.mjs crush

# 5. Scene comparison per story → results/report/<story>.scenes.md
node compare.mjs crush
```

What each script saves in `results/`:

| Script | Files |
|---|---|
| transcribe.mjs | `<story>.<model>.json` (full response), `<story>.<model>.txt` (text only) |
| scenes.mjs | `scenes/<source>.<scene model>.<prompt>.run<N>.scenes.json` (source = `crush.reference` or `crush.whisper-large-v3`) |
| report.mjs | `report/<story>.md` (Word Error Rate per model) |
| compare.mjs | `report/<story>.scenes.md` (scene quality per transcript · scene model · prompt) |

`transcribe.mjs --prompt` gives Whisper spelling hints for names and places (224 tokens max).
`scenes.mjs --prompt v1|v2|v3|v4` picks a scene prompt (all are in `scenes.mjs`; add `v5` there to try a new one).
v3 keeps the storyteller's own words, for reading along with the recording.
v4 is v3 with a stricter no-translation rule, self-corrections kept, and drawing descriptions for the image model.
`--runs N` runs the same input N times so you can see whether the model gives consistent results.

For Whisper transcripts, each scene also gets `audio_start` and `audio_end` (seconds in the recording).

## How scenes are scored (compare.mjs)

The question is not "which Whisper has the lowest WER" but "which transcript gives the best scenes".
Each story is split from the hand-typed reference (best case) and from every Whisper transcript.

- **Checks passed**: runs with valid JSON, exactly 4 scenes, every sentence used once.
  A run where Groq returns "Failed to generate JSON" (HTTP 400) counts as failed.
- **Exact breaks / break offset**: the correct scene breaks are the **4 paragraphs** of
  `references/<story>.txt` (blank line between paragraphs). The model's breaks are mapped onto the
  reference words, so transcripts with different wording can be compared. 0 = same place.
  A story whose reference does not have exactly 4 paragraphs is not scored on breaks.
- **Words changed**: how much each scene's text differs from the sentences it came from. Lower is
  closer to the recording. The report lists the new words, which shows translations and inventions.
- **Key terms**: `references/<story>.terms.txt` lists names, places and facts the scenes must keep
  (`a | b` = either counts) and misheard words that must not appear (`!apple`). Optional.
- **Scene text**: the report shows the scenes. Read them; the numbers do not catch changed meaning.

Sentences: for Whisper transcripts, `scenes.mjs` ends a sentence at `. ! ?` **or** at a pause of
0.6 s or more (from the word timestamps in the `.json`), because Whisper often drops periods.

## Add a second model to compare

Edit `config.mjs`:

```js
export const models = {
  stt: ['whisper-large-v3', 'whisper-large-v3-turbo'],
  scenes: ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'],
};
```

`qwen/qwen3.8-27b` returns HTTP 403 until an org admin enables it in Groq's console
(Settings → Limits). Until then, run the others with `--model`.

Note: the original plan used `llama-3.3-70b-versatile` for scenes, but Groq no longer offers it
(checked 2026-11-16), so the default is `openai/gpt-oss-120b`.

Rerun the script **without** a model argument and every model in the list runs on the same file.
Then run `node report.mjs` to see them side by side. Use model IDs from Groq's current model list.
A model from a different provider would need its own URL and API key in the script.

## Try it before real recordings exist

- `node wer.mjs references/sample.txt references/sample.txt` should print 0.0%.
- `node --env-file=.env scenes.mjs references/sample.txt` should print 4 PASS lines.
- Record someone reading `references/sample.txt`, save it as `audio/sample.m4a`, then transcribe it.

## Coloring pages (illustrate.mjs)

Draws one outline picture per scene with FLUX.1 schnell on Cloudflare Workers AI. Add to `.env`:

```
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...
```

```bash
node --env-file=.env scenes.mjs results/crush.whisper-large-v3.txt --model openai/gpt-oss-120b --prompt v4
node --env-file=.env illustrate.mjs results/scenes/crush.whisper-large-v3.openai_gpt-oss-120b.v4.run1.scenes.json
```

Images and the prompts used are saved in `results/images/<scenes file name>/`. Running again overwrites them.
The free plan has a daily limit. Check every picture by eye before a child sees it.
