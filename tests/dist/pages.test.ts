import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import reviews from '../../src/data/reviews.json';
import { htmlFiles, page } from './helpers';

describe('info pages', () => {
  it.each(['/our-story/', '/reviews/', '/shipping/', '/care/', '/contact/', '/privacy/', '/404/'])('%s builds', (route) => {
    expect(page(route)).toContain('<h1');
  });
  it('contact shows the hello address', () => {
    expect(page('/contact/')).toContain('mailto:hello@sunniedesigns.com');
  });
  it('our story shows the hui address', () => {
    expect(page('/our-story/')).toContain('mailto:hui@sunniedesigns.com');
  });
  it('reviews page lists every kept review and shows German originals', () => {
    const html = page('/reviews/');
    expect((html.match(/class="quote"/g) ?? []).length).toBe(reviews.length);
    expect(html).toContain('lang="de"');
    expect(html).not.toMatch(/eBay/);
  });
  it('404 is noindexed', () => {
    expect(page('/404/')).toContain('<meta name="robots" content="noindex"');
  });
  it('no built page ever names a country of manufacture', () => {
    for (const f of htmlFiles()) {
      expect(readFileSync(f, 'utf8')).not.toMatch(/made in (ireland|china)/i);
    }
  });
});

describe('seller identity', () => {
  // Owner, 2026-11-26: the seller is Noel Murphy, sole trader, matching Merchant Center and PayPal.
  it.each(['/terms/', '/contact/', '/privacy/', '/de/impressum/', '/de/agb/', '/de/kontakt/', '/de/datenschutz/'])('%s shows the seller details', (route) => {
    const html = page(route);
    for (const s of ['Noel Murphy', 'Springfield, Clonlara, Co. Clare, V94 R2DX']) expect(html).toContain(s);
    for (const s of ['Springfield Tectop', '571256', 'Clareview']) expect(html).not.toContain(s);
  });
  it('footer carries the seller line on every page', () => {
    expect(page('/')).toMatch(/Sunnie Designs, the trading name of Noel Murphy, Ireland/);
    expect(page('/de/')).toMatch(/Sunnie Designs, Handelsname von Noel Murphy, Irland/);
    expect(page('/go/star-frogs/')).toMatch(/Sunnie Designs is the trading name of Noel Murphy, Ireland/);
    // Owner, 2026-11-26: the home address is on the contact, terms, privacy and Impressum pages, not every footer.
    // (The home page's hidden Organization data keeps the address, so Google can match it to Merchant Center.)
    const visible = (h: string) => h.replace(/<script[\s\S]*?<\/script>/g, '');
    for (const p of ['/', '/de/', '/go/star-frogs/', '/shop/bags/']) expect(visible(page(p))).not.toContain('Clonlara');
  });
  it('terms cover cancellation and the model form', () => {
    const html = page('/terms/');
    for (const s of ['30 days', 'model cancellation form', 'return postage', '14 days', 'not registered for VAT']) expect(html).toContain(s);
  });
});
