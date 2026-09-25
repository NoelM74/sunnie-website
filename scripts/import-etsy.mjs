import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'csv-parse/sync';
import sharp from 'sharp';
import { findOverride, normaliseReviews, slugify, toMarkdown, toProduct, uniqueSlug } from './lib/etsy.mjs';

const args = process.argv.slice(2);
const srcAt = args.indexOf('--src');
const src = srcAt === -1 ? undefined : args[srcAt + 1];
const force = args.includes('--force');
if (!src) {
  console.error('Usage: npm run import:etsy -- --src "<folder with EtsyListingsDownload.csv and reviews.json>" [--force]');
  process.exit(1);
}

const overrides = JSON.parse(readFileSync('scripts/etsy-overrides.json', 'utf8'));
const translations = JSON.parse(readFileSync('scripts/review-translations.json', 'utf8'));
const rows = parse(readFileSync(join(src, 'EtsyListingsDownload.csv')), { columns: true, bom: true, skip_empty_lines: true });

mkdirSync('src/content/products', { recursive: true });
const taken = new Set();
const report = [];

for (const row of rows) {
  const product = toProduct(row, findOverride(row.TITLE, overrides));
  const slug = uniqueSlug(slugify(product.name), taken);
  const imgDir = join('src/assets/products', slug);
  mkdirSync(imgDir, { recursive: true });

  for (const [i, url] of product.imageUrls.entries()) {
    const out = join(imgDir, `${String(i + 1).padStart(2, '0')}.jpg`);
    if (existsSync(out) && !force) continue;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${slug}: image ${i + 1} failed with ${res.status} (${url})`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf)
      .rotate()
      .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 75, mozjpeg: true })
      .toFile(out);
  }

  const mdPath = join('src/content/products', `${slug}.md`);
  if (!existsSync(mdPath) || force) writeFileSync(mdPath, toMarkdown(product, slug));
  report.push(
    [slug.padEnd(50), product.category.padEnd(9), (product.group ?? '').padEnd(11), product.featured ?? '', product.isNew ? 'NEW' : '']
      .join(' ')
      .trimEnd(),
  );
}

const reviews = normaliseReviews(JSON.parse(readFileSync(join(src, 'reviews.json'), 'utf8')), translations);
mkdirSync('src/data', { recursive: true });
writeFileSync('src/data/reviews.json', `${JSON.stringify(reviews, null, 2)}\n`);

console.log(report.join('\n'));
console.log(`\n${rows.length} products, ${reviews.length} reviews written.`);
