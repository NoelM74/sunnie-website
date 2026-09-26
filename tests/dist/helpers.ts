import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

export const DIST = join(process.cwd(), 'dist');
const PRODUCTS_DIR = join(process.cwd(), 'src/content/products');

/** Counts products per category by parsing the `category:` frontmatter line
 * of every product content file, so tests never hardcode totals that drift
 * as products are added or removed. */
export function productCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const f of readdirSync(PRODUCTS_DIR)) {
    if (!f.endsWith('.md')) continue;
    const text = readFileSync(join(PRODUCTS_DIR, f), 'utf8');
    const m = text.match(/^category:\s*"?([a-z]+)"?/m);
    if (!m) continue;
    counts[m[1]] = (counts[m[1]] ?? 0) + 1;
  }
  return counts;
}

export function productCount(): number {
  return Object.values(productCategoryCounts()).reduce((a, b) => a + b, 0);
}

export function htmlFiles(dir = DIST): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...htmlFiles(p));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

export function page(route: string): string {
  const file = route === '/404/' ? join(DIST, '404.html') : join(DIST, route, 'index.html');
  if (!existsSync(file)) throw new Error(`Missing built page ${route} (${file})`);
  return readFileSync(file, 'utf8');
}

export function jsonLd(html: string): any[] {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1]),
  );
}

export const rel = (file: string) => relative(DIST, file).replaceAll('\\', '/');

/** Every built text file that could carry leaked prose or data: html, plus
 * the plain-text/structured formats (llms.txt, sitemap.xml, manifests). */
export function distTextFiles(dir = DIST): string[] {
  const exts = new Set(['.html', '.txt', '.xml', '.json']);
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...distTextFiles(p));
    else if (exts.has(extname(e.name))) out.push(p);
  }
  return out;
}

/** True if the first bytes of the file look like binary data (a NUL byte,
 * the standard heuristic git/file(1) use) rather than text. */
function looksBinary(path: string): boolean {
  const fd = readFileSync(path);
  const probeLen = Math.min(fd.length, 8000);
  for (let i = 0; i < probeLen; i++) if (fd[i] === 0) return true;
  return false;
}

/** Every git-tracked file under `maxBytes` that isn't binary (product photos,
 * fonts, etc.), read as text. Used to scan the repo itself (docs, data files,
 * scripts) for leaked private values, not just the built site. */
export function gitTrackedTextFiles(maxBytes = 2_000_000): string[] {
  const root = process.cwd();
  const files = execSync('git ls-files', { cwd: root }).toString().split('\n').filter(Boolean);
  const out: string[] = [];
  for (const f of files) {
    const p = join(root, f);
    if (!existsSync(p) || statSync(p).size > maxBytes || looksBinary(p)) continue;
    out.push(p);
  }
  return out;
}

/** Every individual alphanumeric token in `text`, plus every separator-stripped
 * join of 2 to 4 adjacent tokens — so a value split across whitespace or
 * punctuation (e.g. a phone number written "087 123 4567") is still caught
 * by a hash of its joined digits. */
export function tokenCandidates(text: string): string[] {
  const tokens = text.match(/[A-Za-z0-9]+/g) ?? [];
  const out = new Set<string>(tokens);
  for (let n = 2; n <= 4; n++) {
    for (let i = 0; i + n <= tokens.length; i++) out.add(tokens.slice(i, i + n).join(''));
  }
  return [...out];
}

/** Returns any candidate token (see `tokenCandidates`) whose lower-cased
 * SHA-256 hash is in `hashSet`. */
export function findLeaks(text: string, hashSet: Set<string>): string[] {
  const hash = (t: string) => createHash('sha256').update(t.toLowerCase()).digest('hex');
  return tokenCandidates(text).filter((t) => hashSet.has(hash(t)));
}
