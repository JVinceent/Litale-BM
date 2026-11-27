// Word Error Rate (WER) between a hand-typed reference and a model transcript.
// Usage: node wer.mjs <reference.txt> <result.txt>
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// Lowercase, remove punctuation, split into words. "mag-aral" stays one word.
export function normalize(text) {
  return text.normalize('NFC').toLowerCase()
    .replace(/[-‐‑'‘’]/g, '')               // join hyphenated/apostrophe words
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')   // other punctuation -> space
    .split(/\s+/).filter(Boolean);
}

// How different two words look: 0 = same, 1 = nothing alike ("sampagita" vs "sampaguita" ≈ 0.1).
function charDiff(a, b) {
  let prev = [...Array(b.length + 1).keys()];
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++)
      cur[j] = Math.min(prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1), prev[j] + 1, cur[j - 1] + 1);
    prev = cur;
  }
  return prev[b.length] / Math.max(a.length, b.length);
}

export function wer(refText, hypText) {
  const r = normalize(refText), h = normalize(hypText);
  // cell[i][j] = best [errors, tieBreak, move] for the first i reference words and first j model words.
  // Fewest errors always wins (standard WER). On a tie, prefer pairing look-alike words,
  // so we report "sampaguita -> sampagita" instead of "sa -> sampagita".
  const cell = Array.from({ length: r.length + 1 }, () => []);
  cell[0][0] = [0, 0, null];
  for (let i = 0; i <= r.length; i++)
    for (let j = 0; j <= h.length; j++) {
      if (!i && !j) continue;
      const opts = [];
      if (i && j) {
        const same = r[i - 1] === h[j - 1], [e, t] = cell[i - 1][j - 1];
        opts.push([e + (same ? 0 : 1), t + (same ? 0 : charDiff(r[i - 1], h[j - 1])), 'sub']);
      }
      if (i) opts.push([cell[i - 1][j][0] + 1, cell[i - 1][j][1] + 0.5, 'del']);
      if (j) opts.push([cell[i][j - 1][0] + 1, cell[i][j - 1][1] + 0.5, 'ins']);
      cell[i][j] = opts.reduce((a, b) => (b[0] < a[0] || (b[0] === a[0] && b[1] < a[1]) ? b : a));
    }

  // Walk back through the table to list each error.
  // refAt[j] = how many reference words line up with the first j model words.
  const subs = [], missing = [], added = [], refAt = [];
  for (let i = r.length, j = h.length; ; ) {
    refAt[j] = i; // walking backwards, so the last write per j is the smallest i
    if (!i && !j) break;
    const move = cell[i][j][2];
    if (move === 'sub') { if (r[i - 1] !== h[j - 1]) subs.unshift([r[i - 1], h[j - 1]]); i--; j--; }
    else if (move === 'del') missing.unshift(r[--i]);
    else added.unshift(h[--j]);
  }
  const N = r.length, errors = subs.length + missing.length + added.length;
  return { wer: N ? errors / N : 0, S: subs.length, D: missing.length, I: added.length, N, subs, missing, added, refAt };
}

// Command-line use (skipped when report.mjs imports this file).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [refPath, hypPath] = process.argv.slice(2);
  if (!refPath || !hypPath) {
    console.error('Usage: node wer.mjs <reference.txt> <result.txt>');
    process.exit(1);
  }
  const res = wer(readFileSync(refPath, 'utf8'), readFileSync(hypPath, 'utf8'));
  console.log(`WER: ${(res.wer * 100).toFixed(1)}%  (S=${res.S} D=${res.D} I=${res.I}, N=${res.N} reference words)`);
  console.log(`Substituted (reference -> model): ${res.subs.map(([a, b]) => `${a} -> ${b}`).join(', ') || '-'}`);
  console.log(`Missing (in reference, not in model): ${res.missing.join(', ') || '-'}`);
  console.log(`Added (in model, not in reference): ${res.added.join(', ') || '-'}`);
}
