// Tells Bing (and other IndexNow search engines, which share submissions) which pages to recrawl,
// right after a deploy. Reads the page list from the built sitemap. Run by the deploy workflow on
// pushes to main. The key is public by design: IndexNow checks it at /<key>.txt on the site.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const KEY = '35f2738bff4acd950169d4699fa74d00';
const HOST = 'sunniedesigns.com';
const dir = existsDir('dist/client') ? 'dist/client' : 'dist';
const urls = readdirSync(dir)
  .filter((f) => /^sitemap-\d+\.xml$/.test(f))
  .flatMap((f) => [...readFileSync(join(dir, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));

function existsDir(p) {
  try { return readdirSync(p).length >= 0; } catch { return false; }
}

if (urls.length === 0) {
  console.error('IndexNow: no URLs found in the sitemap, nothing sent');
  process.exit(0);
}
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: sent ${urls.length} URLs, status ${res.status}`);
