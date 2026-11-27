// Build one readable report per story: results/report/<story>.md
// Usage: node report.mjs [story]     (no story = every story in results/)
import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { RESULTS, REFERENCES } from './config.mjs';
import { wer } from './wer.mjs';

const only = process.argv[2], REPORTS = `${RESULTS}/report`;
await mkdir(REPORTS, { recursive: true });
const files = (await readdir(RESULTS)).filter(f => !only || f.split('.')[0] === only).sort();
const read = path => readFile(path, 'utf8');
const pct = x => `${(x * 100).toFixed(1)}%`;
const stories = {}; // story -> { stt: rows, details: sections, scenes: rows }
const get = story => (stories[story] ??= { stt: [], details: [], scenes: [] });

function table(head, rows) {
  if (!rows.length) return '_No results yet._';
  const line = cells => `| ${cells.join(' | ')} |`;
  return [line(head), line(head.map(() => '---')), ...rows.map(line)].join('\n');
}
// Count repeats: ['a', 'b', 'a'] -> [['a', 2], ['b', 1]]
const group = list => Object.entries(list.reduce((m, k) => ({ ...m, [k]: (m[k] ?? 0) + 1 }), {}));
const times = n => (n > 1 ? ` ×${n}` : '');
const wordList = (icon, list) => group(list).map(([w, n]) => `${icon} ${w}${times(n)}`).join(', ') || 'none';

// Task 1: speech-to-text. results/<story>.<model>.txt vs references/<story>.txt
for (const f of files.filter(f => f.endsWith('.txt'))) {
  const story = f.split('.')[0], model = f.slice(story.length + 1, -'.txt'.length);
  const refPath = `${REFERENCES}/${story}.txt`;
  if (!existsSync(refPath)) { get(story).stt.push([model, '-', '-', 'no reference']); continue; }
  const refText = await read(refPath), hypText = await read(`${RESULTS}/${f}`);
  const r = wer(refText, hypText);
  const accuracy = pct(Math.max(0, 1 - r.wer)); // 100% - WER, never below 0
  const errors = `${r.S + r.D + r.I} out of ${r.N} words (${r.S} wrong · ${r.D} missing · ${r.I} extra)`;
  get(story).stt.push([model, pct(r.wer), accuracy, errors]);

  const wrong = group(r.subs.map(([correct, heard]) => `${heard}|${correct}`))
    .map(([k, n]) => { const [heard, correct] = k.split('|'); return `| ❌ ${heard} | ✅ ${correct} | ${n} |`; });
  get(story).details.push(`### ${model}

**WER ${pct(r.wer)} · Accuracy ${accuracy}** · Errors: ${errors}

**Wrong words**

${wrong.length ? ['| Model wrote | Correct | Times |', '| --- | --- | --- |', ...wrong].join('\n') : 'none'}

**Missing words** (model skipped): ${wordList('➖', r.missing)}

**Extra words** (model added): ${wordList('➕', r.added)}

<details><summary>Reference / Transcript</summary>

**Reference:** ${refText.trim().replace(/\s+/g, ' ')}

**Transcript:** ${hypText.trim()}

</details>`);
}

// Task 2: scene division. Model/run are stored inside each file. Boundary/term scores: compare.mjs.
const SCENES = `${RESULTS}/scenes`;
const sceneFiles = existsSync(SCENES) ? (await readdir(SCENES)).filter(f => f.endsWith('.scenes.json')).sort() : [];
for (const f of sceneFiles.filter(f => !only || f.split('.')[0] === only)) {
  const { story, model, run, source, prompt, checks } = JSON.parse(await read(`${SCENES}/${f}`));
  const failed = checks.filter(c => !c.pass).map(c => `FAIL: ${c.name}`);
  const passed = `${checks.length - failed.length}/${checks.length}`;
  get(story).scenes.push([model, passed, [`run ${run}`, `prompt ${prompt}`, `from ${source}`, ...failed].join(', ')]);
}

// One file per story.
const legend = 'WER (Word Error Rate) = errors ÷ words in the correct transcript. Lower is better. Accuracy = 100% − WER.';
if (!Object.keys(stories).length) console.log(only ? `No results for "${only}".` : 'No results yet.');
for (const [story, s] of Object.entries(stories)) {
  const sttTable = table(['Model', 'WER', 'Accuracy', 'Errors'], s.stt);
  const sceneTable = table(['Model', 'Checks passed', 'Notes'], s.scenes);
  const md = `# ${story}: Litale experiment report\n\n## Speech-to-text\n\n${legend}\n\n${sttTable}\n\n`
    + `${s.details.join('\n\n')}\n\n## Scene division\n\n${sceneTable}\n`;
  await writeFile(`${REPORTS}/${story}.md`, md);
  console.log(`== ${story} ==\n\n${sttTable}\n\n${sceneTable}\n\nSaved ${REPORTS}/${story}.md\n`);
}
