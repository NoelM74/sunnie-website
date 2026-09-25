import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { matchEtsyUrls, setFrontmatterField } from './lib/etsy.mjs';

const DIR = 'src/content/products';
const links = JSON.parse(readFileSync('data/etsy-urls.json', 'utf8'));
const files = readdirSync(DIR).filter((f) => f.endsWith('.md'));
const products = files.map((f) => {
  const md = readFileSync(join(DIR, f), 'utf8');
  const seoTitle = JSON.parse(md.match(/^seoTitle: (.*)$/m)[1]);
  return { slug: f.replace(/\.md$/, ''), seoTitle, md };
});

const { matched, unmatched } = matchEtsyUrls(products, links);
for (const p of products) {
  if (matched[p.slug]) writeFileSync(join(DIR, `${p.slug}.md`), setFrontmatterField(p.md, 'etsyUrl', matched[p.slug]));
}
console.log(`Matched ${Object.keys(matched).length} of ${products.length}.`);
if (unmatched.length) {
  console.log(`Unmatched:\n  ${unmatched.join('\n  ')}`);
  process.exitCode = 1;
}
