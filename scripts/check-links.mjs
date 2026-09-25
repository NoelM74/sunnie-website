import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { extractHrefs, internalTarget } from './lib/links.mjs';

const DIST = 'dist';
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : [],
  );

const errors = [];
const warnings = [];
const external = new Map();

for (const file of walk(DIST)) {
  const from = relative(DIST, file).replaceAll('\\', '/');
  for (const href of extractHrefs(readFileSync(file, 'utf8'))) {
    const target = internalTarget(href);
    if (target !== null) {
      if (!existsSync(join(DIST, target))) errors.push(`${from}: broken internal link ${href}`);
    } else if (/^https?:\/\//.test(href)) {
      if (!external.has(href)) external.set(href, from);
    }
  }
}

for (const [url, from] of external) {
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (sunniedesigns link check)' } });
    if (res.status === 403 || res.status === 429) warnings.push(`${url} returned ${res.status}; check it by hand (from ${from})`);
    else if (res.status >= 400) errors.push(`${from}: ${url} returned ${res.status}`);
  } catch (err) {
    errors.push(`${from}: ${url} failed (${err.message})`);
  }
}

console.log(`Checked ${external.size} external links.`);
for (const w of warnings) console.warn(`WARN  ${w}`);
for (const e of errors) console.error(`ERROR ${e}`);
if (errors.length) process.exit(1);
console.log('No broken links.');
