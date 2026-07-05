// Regenerate models.json + models.csv from the live ModelFit dataset endpoint.
// Usage: node generate.mjs   (then commit the changes)
// The canonical source is https://modelfit.io/api/dataset/ (CC BY 4.0).
import { writeFileSync } from 'node:fs';

const SRC = 'https://modelfit.io/api/dataset/';
const UA = 'modelfit-hardware-dataset/1.0 (+https://modelfit.io/data/)';

const res = await fetch(SRC, { headers: { 'user-agent': UA, accept: 'application/json' } });
if (!res.ok) {
  console.error(`Fetch failed: HTTP ${res.status}`);
  process.exit(1);
}
const data = await res.json();

writeFileSync('models.json', JSON.stringify(data, null, 2) + '\n');

const cols = ['model', 'family', 'params', 'quantization', 'minRamGb', 'estimatedLoadGb', 'runsLocally', 'openWeights', 'ggufDiy', 'runtimes', 'bestFor', 'ollamaCommand'];
const esc = (v) => {
  if (Array.isArray(v)) v = v.join('|');
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = [cols.join(',')]
  .concat(data.models.map((r) => cols.map((c) => esc(r[c])).join(',')))
  .join('\n');
writeFileSync('models.csv', csv + '\n');

console.log(`Wrote ${data.models.length} models (updated ${data.updated}) to models.json + models.csv`);
