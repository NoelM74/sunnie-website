import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIST } from './helpers';
import { LANDERS_DE } from '../../src/i18n/de/landers';
import { PRODUCTS_DE } from '../../src/i18n/de/products';

const slugs = Object.keys(LANDERS_DE);
const page = (p: string) => readFileSync(join(DIST, p, 'index.html'), 'utf8');

describe('German bundle pages', () => {
  it.each(slugs)('%s is German, links to its English page and back', (slug) => {
    const de = page(`de/go/${slug}`);
    const en = page(`go/${slug}`);
    expect(de).toMatch(/<html lang="de"/);
    for (const html of [de, en]) {
      expect(html).toContain(`hreflang="de" href="https://sunniedesigns.com/de/go/${slug}/"`);
      expect(html).toContain(`hreflang="en" href="https://sunniedesigns.com/go/${slug}/"`);
    }
    expect(de).toContain('<link rel="canonical" href="https://sunniedesigns.com/de/go/');
    expect(de).toContain('In den Warenkorb');
    expect(de).not.toMatch(/Add to basket|Free shipping on|Pick your/);
  });
  it.each(slugs)('%s only links to German pages that exist', (slug) => {
    for (const [, href] of page(`de/go/${slug}`).matchAll(/href="(\/de\/[^"#]*)/g)) {
      expect(existsSync(join(DIST, href, 'index.html')), href).toBe(true);
    }
  });
});

describe('German legal pages', () => {
  it.each(['de/versand', 'de/agb', 'de/impressum', 'de/kontakt'])('%s is built, in German, and its /de/ links exist', (p) => {
    const html = page(p);
    expect(html).toMatch(/<html lang="de"/);
    for (const [, href] of html.matchAll(/href="(\/de\/[^"#]*)/g)) expect(existsSync(join(DIST, href, 'index.html')), href).toBe(true);
  });
  it('names who represents the company in the Impressum', () => {
    expect(page('de/impressum')).toContain('Noel Murphy');
  });
});

describe('German home, shop and product pages', () => {
  const pages = ['de', 'de/shop/taschen', 'de/shop/untersetzer', 'de/pflege', 'de/ueber-uns', 'de/bewertungen', ...Object.keys(PRODUCTS_DE).map((s) => `de/produkte/${s}`)];
  it.each(pages)('%s is German and only links to German pages that exist', (p) => {
    const html = page(p);
    expect(html).toMatch(/<html lang="de"/);
    expect(html).toContain('hreflang="de"');
    for (const [, href] of html.matchAll(/href="(\/de\/[^"#]*)/g)) expect(existsSync(join(DIST, href, 'index.html')), href).toBe(true);
  });
  it.each(Object.keys(PRODUCTS_DE))('%s English page points to its German page', (slug) => {
    expect(page(`products/${slug}`)).toContain(`hreflang="de" href="https://sunniedesigns.com/de/produkte/${slug}/"`);
  });
});
