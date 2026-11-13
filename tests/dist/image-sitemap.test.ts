import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIST } from './helpers';

const xml = readFileSync(join(DIST, 'sitemap-images.xml'), 'utf8');
const entries = [...xml.matchAll(/<url><loc>https:\/\/sunniedesigns\.com(\/[^<]+)<\/loc>(.*?)<\/url>/g)].map(([, path, rest]) => ({
  path,
  images: [...rest.matchAll(/<image:loc>https:\/\/sunniedesigns\.com(\/[^<]+)<\/image:loc>/g)].map((m) => m[1]),
}));

describe('image sitemap', () => {
  it('lists product and bundle pages with their photos', () => {
    expect(entries.length).toBeGreaterThan(50);
    expect(entries.filter((e) => e.path.startsWith('/go/')).length).toBeGreaterThan(15);
    for (const e of entries) expect(e.images.length, e.path).toBeGreaterThan(0);
  });
  it('lists only photos the page itself shows, with descriptive names', () => {
    for (const e of entries) {
      const html = readFileSync(join(DIST, e.path, 'index.html'), 'utf8');
      for (const img of e.images) {
        expect(html, `${e.path} ${img}`).toContain(img);
        expect(img).toMatch(/^\/_astro\/[a-z0-9-]+-[^/]+\.webp$/);
      }
    }
  });
  it('is in robots.txt', () => {
    expect(readFileSync(join(DIST, 'robots.txt'), 'utf8')).toContain('Sitemap: https://sunniedesigns.com/sitemap-images.xml');
  });
});
