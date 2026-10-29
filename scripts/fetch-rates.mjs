// Runs before every build. Reads the ECB daily reference rates and writes src/data/rates.json,
// so the static pages and the checkout in the same build always use the same rates.
// If the ECB is unreachable, the build keeps the last committed rates and says so.
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const FILE = new URL('../src/data/rates.json', import.meta.url);
const URL_ECB = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';
// Sanity bounds: a value outside these means a parse error, not a market move.
const BOUNDS = { GBP: [0.5, 1.3], USD: [0.7, 1.7] };

export function parseEcb(xml) {
  const asOf = /time=['"](\d{4}-\d{2}-\d{2})['"]/.exec(xml)?.[1];
  const rate = (cur) => Number(new RegExp(`currency=['"]${cur}['"]\\s+rate=['"]([\\d.]+)['"]`).exec(xml)?.[1]);
  const out = { asOf, GBP: rate('GBP'), USD: rate('USD') };
  for (const [cur, [lo, hi]] of Object.entries(BOUNDS)) {
    if (!(out[cur] >= lo && out[cur] <= hi)) throw new Error(`ECB ${cur} rate looks wrong: ${out[cur]}`);
  }
  if (!asOf) throw new Error('ECB file has no date');
  return out;
}

async function main() {
  const old = JSON.parse(await readFile(FILE, 'utf8'));
  try {
    const res = await fetch(URL_ECB, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) throw new Error(`ECB returned ${res.status}`);
    const rates = parseEcb(await res.text());
    if (rates.asOf < old.asOf) throw new Error(`ECB date ${rates.asOf} is older than ${old.asOf}`);
    await writeFile(FILE, JSON.stringify(rates, null, 2) + '\n');
    console.log(`rates: ECB ${rates.asOf} GBP ${rates.GBP} USD ${rates.USD}`);
  } catch (err) {
    console.warn(`rates: kept ${old.asOf} (${err.message})`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
