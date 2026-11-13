import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIST, page } from './helpers';
import { GIFT_GUIDES } from '../../src/data/gift-guides';
import { GIFT_GUIDES_DE } from '../../src/i18n/de/gift-guides';

describe('gift guides', () => {
  it('has an index linking every guide', () => {
    const html = page('/gifts/');
    for (const g of GIFT_GUIDES) expect(html).toContain(`href="/gifts/${g.slug}/"`);
  });
  it.each(GIFT_GUIDES.map((g) => g.slug))('%s lists products that exist, with prices', (slug) => {
    const html = page(`/gifts/${slug}/`);
    const links = [...html.matchAll(/class="card-link" href="([^"]+)"/g)].map((m) => m[1]);
    expect(links.length).toBeGreaterThan(3);
    for (const l of links) expect(existsSync(join(DIST, l, 'index.html')), l).toBe(true);
    expect(html).toMatch(/€\d+\.\d{2}/);
  });
  it('lists only pieces under €40 in the under-€40 guide', () => {
    const prices = [...page('/gifts/handmade-gifts-under-40/').matchAll(/class="card-price"><span class="money"[^>]*>€([\d.]+)</g)].map((m) => Number(m[1]));
    expect(prices.length).toBeGreaterThan(10);
    for (const p of prices) expect(p).toBeLessThan(40);
  });
  it.each(GIFT_GUIDES.map((g) => g.slug))('%s has a German version linked both ways', (slug) => {
    const deSlug = GIFT_GUIDES_DE[slug].slug;
    const de = page(`/de/geschenke/${deSlug}/`);
    expect(de).toMatch(/<html lang="de"/);
    expect(page(`/gifts/${slug}/`)).toContain(`hreflang="de" href="https://sunniedesigns.com/de/geschenke/${deSlug}/"`);
    for (const [, href] of de.matchAll(/class="card-link" href="([^"]+)"/g)) expect(href, href).toMatch(/^\/de\//);
  });
});
