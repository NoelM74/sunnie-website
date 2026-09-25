import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIST, htmlFiles, page, rel } from './helpers';

describe('every page', () => {
  const files = htmlFiles();

  it.each(files.map((f) => [rel(f), f]))('%s follows layout rules', (_name, file) => {
    const html = readFileSync(file, 'utf8');
    expect(html).toMatch(/<html lang="en"/);
    expect(html.match(/<h1[\s>]/g) ?? []).toHaveLength(1);
    expect(html).toContain('class="skip-link" href="#main"');
    expect(html).toMatch(/<link rel="canonical" href="https:\/\/sunniedesigns\.com\//);
    const scripts = html.match(/<script\b[^>]*>/g) ?? [];
    expect(scripts.every((s) => s.includes('application/ld+json'))).toBe(true);
    for (const img of html.match(/<img\b[^>]*>/g) ?? []) expect(img).toMatch(/\salt="/);
  });
});

describe('home page', () => {
  it('shows the logo and main nav', () => {
    const html = page('/');
    expect(html).toContain('aria-label="Sunnie Designs home"');
    for (const href of ['/shop/bags/', '/shop/coasters/', '/our-story/', '/shop/']) {
      expect(html).toContain(`href="${href}"`);
    }
  });
});

describe('crawl files', () => {
  it('publishes robots.txt and a sitemap', () => {
    expect(existsSync(join(DIST, 'robots.txt'))).toBe(true);
    expect(existsSync(join(DIST, 'sitemap-index.xml'))).toBe(true);
  });
});
