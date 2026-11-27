// Models to test per task. Add a second model to a list, rerun the script
// without a [model] argument, and every model in the list runs on the same file.
import { fileURLToPath } from 'node:url';

export const GROQ = 'https://api.groq.com/openai/v1';

export const models = {
  stt: ['whisper-large-v3', 'whisper-large-v3-turbo'],
  // The spec's llama-3.3-70b-versatile is no longer on Groq (checked 2026-11-16).
  // All three support strict json_schema on Groq (docs checked 2026-11-25).
  scenes: ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'],
};

// Folders, resolved next to this file so scripts work from any directory.
export const RESULTS = fileURLToPath(new URL('./results', import.meta.url));
export const REFERENCES = fileURLToPath(new URL('./references', import.meta.url));

// Short error text from a failed API response (never includes request headers).
export async function errorText(res) {
  const body = await res.text();
  try { return JSON.parse(body).error?.message ?? body; } catch { return body; }
}

// Stop early if the key is missing. The key itself is never printed.
export function requireKey() {
  if (!process.env.GROQ_API_KEY) {
    console.error('GROQ_API_KEY is missing. Put it in .env and run with: node --env-file=.env ...');
    process.exit(1);
  }
}
