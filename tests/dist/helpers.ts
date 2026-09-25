import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

export const DIST = join(process.cwd(), 'dist');

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
