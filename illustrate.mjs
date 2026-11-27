// Draw one coloring page per scene with FLUX.1 schnell on Cloudflare Workers AI.
// Usage: node --env-file=.env illustrate.mjs <file.scenes.json>...
// Saves results/images/<scenes file name>/scene1-4.jpg and prompts.json.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { basename } from 'node:path';
import { RESULTS } from './config.mjs';

const MODEL = '@cf/black-forest-labs/flux-1-schnell';
// Same style for every picture, followed by the scene's "visual" sentence.
const STYLE = 'Coloring book page for a young child, thick black outlines, plain white background, no shading, no gray, no color, no text.';

const files = process.argv.slice(2);
const { CLOUDFLARE_ACCOUNT_ID: account, CLOUDFLARE_API_TOKEN: token } = process.env;
if (!files.length) { console.error('Usage: node --env-file=.env illustrate.mjs <file.scenes.json>...'); process.exit(1); }
if (!account || !token) { // The token is never printed.
  console.error('CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN is missing. Put them in .env and use --env-file=.env');
  process.exit(1);
}

for (const file of files) {
  const run = JSON.parse(await readFile(file, 'utf8'));
  if (!run.output || !run.checks.every(c => c.pass)) { console.error(`${file}: this run failed its checks, skipped.`); continue; }
  const dir = `${RESULTS}/images/${basename(file, '.scenes.json')}`;
  await mkdir(dir, { recursive: true });
  const prompts = [];

  for (const scene of run.output.scenes) {
    const prompt = `${STYLE} ${scene.visual}`.slice(0, 2048); // model limit: 2048 characters
    prompts.push({ position: scene.position, prompt });
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${MODEL}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }), // optional: steps (default 4, max 8)
    });
    const data = await res.json().catch(() => null);
    const image = data?.result?.image; // base64 JPEG
    if (!image) {
      const why = data?.errors?.map(e => e.message).join('; ') || res.statusText;
      console.error(`scene ${scene.position}: HTTP ${res.status} - ${why}`);
      process.exitCode = 1;
      continue;
    }
    await writeFile(`${dir}/scene${scene.position}.jpg`, Buffer.from(image, 'base64'));
    console.log(`saved ${dir}/scene${scene.position}.jpg`);
  }
  await writeFile(`${dir}/prompts.json`, JSON.stringify(prompts, null, 2));
}
