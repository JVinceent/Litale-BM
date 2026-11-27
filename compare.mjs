// Compare scene-division results: which speech-to-text + scene model + prompt gives the best scenes?
// Usage: node compare.mjs [story]   (reads results/scenes/, writes results/report/<story>.scenes.md)
//
// Scores, per source transcript · scene model · prompt (averaged over runs):
//   - Checks:     runs where the output passed all 4 structure checks in scenes.mjs.
//   - Boundaries: where each scene break landed vs the correct break, in reference words.
//                 The correct breaks are the 4 paragraphs of references/<story>.txt.
//   - Terms:      names/places/facts from references/<story>.terms.txt found in the scenes,
//                 and misheard words ("!word" lines) that leaked into the scenes.
//   - Changed:    how much each scene's text differs from the sentences it was made from.
import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { RESULTS, REFERENCES } from './config.mjs';
import { wer, normalize } from './wer.mjs';

const only = process.argv[2], SCENES = `${RESULTS}/scenes`, REPORTS = `${RESULTS}/report`;
if (!existsSync(SCENES)) { console.log('No scene results yet. Run scenes.mjs first.'); process.exit(); }
await mkdir(REPORTS, { recursive: true });
const read = path => readFile(path, 'utf8');
const words = text => normalize(text).join(' ');
const avg = list => list.length ? list.reduce((a, b) => a + b, 0) / list.length : null;
const fmt = (x, digits = 1) => (x === null ? '-' : x.toFixed(digits));

// Correct scene breaks: reference-word index where scenes 2, 3 and 4 start.
function goldBreaks(refText) {
  const paragraphs = refText.trim().split(/\n\s*\n/);
  if (paragraphs.length !== 4) return { note: `references has ${paragraphs.length} paragraphs, need 4 to score breaks` };
  let total = 0;
  return { breaks: paragraphs.slice(0, 3).map(p => (total += normalize(p).length)) };
}

// references/<story>.terms.txt: one term per line, "a | b" = either counts, "!word" = must NOT appear.
async function loadTerms(story) {
  const path = `${REFERENCES}/${story}.terms.txt`;
  if (!existsSync(path)) return null;
  const lines = (await read(path)).split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  return {
    want: lines.filter(l => !l.startsWith('!')).map(l => l.split('|').map(t => t.trim())),
    banned: lines.filter(l => l.startsWith('!')).map(l => l.slice(1).trim()),
  };
}
// Wanted terms may sit inside a longer word (Tagalog affixes: "harana" in "nagharana").
// Banned words must match a whole word, so "!sis" does not fire on "masisira".
const contains = (hay, term) => hay.includes(words(term));
const hasWord = (hay, term) => ` ${hay} `.includes(` ${words(term)} `);

// Score one run.
function scoreRun(r, refText, gold, terms) {
  const pass = r.checks.every(c => c.pass), result = { pass };
  if (pass && gold.breaks) {
    // Map each break (after sentence_end of scenes 1-3) to a reference-word position.
    const { refAt } = wer(refText, r.sentences.join(' '));
    result.splits = r.output.scenes.slice(0, 3).map(s => s.sentence_end);
    result.offsets = result.splits.map((end, k) =>
      refAt[normalize(r.sentences.slice(0, end).join(' ')).length] - gold.breaks[k]);
  }
  if (pass) {
    // Scene text vs what the storyteller said in those sentences (catches translating and inventing).
    const diffs = r.output.scenes.map(s => wer(r.sentences.slice(s.sentence_start - 1, s.sentence_end).join(' '), s.text));
    const total = key => diffs.reduce((n, d) => n + d[key], 0);
    result.changed = 100 * (total('S') + total('D') + total('I')) / total('N');
    result.newWords = diffs.flatMap(d => [...d.subs.map(([, heard]) => heard), ...d.added]);
  }
  if (pass && terms) {
    const out = r.output, hay = words([out.title, ...out.scenes.flatMap(s => [s.text, s.visual])].join(' '));
    result.missing = terms.want.filter(alts => !alts.some(t => contains(hay, t))).map(alts => alts.join(' | '));
    result.found = terms.want.length - result.missing.length;
    result.leaked = terms.banned.filter(t => hasWord(hay, t));
  }
  return result;
}

const files = (await readdir(SCENES)).filter(f => f.endsWith('.scenes.json') && (!only || f.split('.')[0] === only)).sort();
const byStory = {};
for (const f of files) {
  const r = JSON.parse(await read(`${SCENES}/${f}`));
  ((byStory[r.story] ??= {})[`${r.source}|${r.model}|${r.prompt}`] ??= []).push(r);
}
if (!Object.keys(byStory).length) console.log(only ? `No scene results for "${only}".` : 'No scene results yet.');

for (const [story, groups] of Object.entries(byStory)) {
  const refPath = `${REFERENCES}/${story}.txt`;
  if (!existsSync(refPath)) { console.log(`${story}: no reference transcript, skipped.`); continue; }
  const refText = await read(refPath), gold = goldBreaks(refText), terms = await loadTerms(story);

  const rows = [], notes = [], texts = [];
  for (const [key, runs] of Object.entries(groups)) {
    const [source, model, prompt] = key.split('|');
    const scored = runs.map(r => ({ ...scoreRun(r, refText, gold, terms), ms: r.ms }));
    const ok = scored.filter(s => s.pass);
    const offsets = ok.flatMap(s => s.offsets ?? []);
    const exact = offsets.filter(o => o === 0).length;
    const sameSplit = ok.length > 1 ? (new Set(ok.map(s => String(s.splits))).size === 1 ? 'yes' : 'no') : '-';
    const termPct = terms && ok.length ? `${fmt(100 * avg(ok.map(s => s.found)) / terms.want.length, 0)}%` : '-';
    const leaked = [...new Set(ok.flatMap(s => s.leaked ?? []))];
    const missing = [...new Set(ok.flatMap(s => s.missing ?? []))];
    rows.push([source, model, prompt, `${ok.length}/${runs.length}`,
      gold.breaks && ok.length ? `${exact}/${offsets.length}` : '-',
      gold.breaks && ok.length ? fmt(avg(offsets.map(Math.abs))) : '-',
      sameSplit, ok.length ? `${fmt(avg(ok.map(s => s.changed)))}%` : '-', termPct, leaked.join(', ') || (terms && ok.length ? 'none' : '-'),
      fmt(avg(scored.map(s => s.ms).filter(Boolean)), 0)]);
    const newWords = [...new Set(ok.flatMap(s => s.newWords ?? []))];
    if (newWords.length) notes.push(`- **${source} · ${model} · ${prompt}** new words (not said in those sentences): ${newWords.join(', ')}`);
    if (missing.length) notes.push(`- **${source} · ${model} · ${prompt}** missed: ${missing.join(', ')}`);
    for (const [i, s] of scored.entries())
      if (s.offsets?.some(o => o !== 0)) notes.push(`- ${source} · ${model} · ${prompt} run ${runs[i].run}: breaks off by ${s.offsets.join(', ')} words`);
    // Scene text of the first passing run, for a human to read: the numbers miss meaning changes.
    const first = runs.find(r => r.checks.every(c => c.pass));
    if (first) texts.push(`<details><summary>${source} · ${model} · ${prompt} (run ${first.run})</summary>\n\n`
      + first.output.scenes.map(s => `${s.position}. [${s.sentence_start}-${s.sentence_end}] ${s.text}`).join('\n') + '\n\n</details>');
  }

  const head = ['Source transcript', 'Scene model', 'Prompt', 'Checks passed', 'Exact breaks', 'Avg break offset (words)',
    'Same split every run', 'Words changed', 'Key terms found', 'Misheard words leaked', 'Avg ms'];
  const line = cells => `| ${cells.join(' | ')} |`;
  const table = [line(head), line(head.map(() => '---')), ...rows.map(line)].join('\n');
  const legend = [
    `Correct breaks: ${gold.breaks ? `after reference words ${gold.breaks.join(', ')} (the 4 paragraphs of references/${story}.txt)` : gold.note}.`,
    terms ? `Key terms: references/${story}.terms.txt (${terms.want.length} terms, ${terms.banned.length} misheard words).` : `No references/${story}.terms.txt, so terms are not scored.`,
    'Words changed = how much the scene text differs from the sentences it came from (replaced, dropped or added words). Lower = closer to the recording.',
    'Break offset 0 = the scene starts at the same word as in the reference. "reference" rows show the scene model on a perfect transcript (the upper bound).',
  ].map(l => `- ${l}`).join('\n');
  const md = `# ${story}: scene division comparison\n\n${legend}\n\n${table}\n\n${notes.length ? `## Details\n\n${notes.join('\n')}\n\n` : ''}`
    + `## Scene text (read these: numbers do not catch changed meaning)\n\n${texts.join('\n\n')}\n`;
  await writeFile(`${REPORTS}/${story}.scenes.md`, md);
  console.log(`== ${story} ==\n\n${table}\n\nSaved ${REPORTS}/${story}.scenes.md\n`);
}
