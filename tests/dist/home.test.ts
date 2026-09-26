import { describe, expect, it } from 'vitest';
import { htmlFiles, jsonLd, page } from './helpers';
import { readFileSync } from 'node:fs';

describe('homepage', () => {
  const html = page('/');

  it('has the approved hero', () => {
    expect(html).toMatch(/<h1[^>]*>So cute you'll grin\. Sturdy enough to carry every day\.<\/h1>/);
    expect(html).toContain('Find your bag');
    expect(html).toContain('Meet Hui');
    expect(html).toMatch(/<img[^>]*fetchpriority="high"/);
  });

  it('shows the trust bar facts', () => {
    for (const t of ['Ships in 3–5 days', '4.9 on Etsy', 'Star Seller', '287 eBay ratings', 'Handmade by Hui']) {
      expect(html).toContain(t);
    }
  });

  it('shows exactly four bestsellers', () => {
    const section = html.split('id="bestsellers"')[1].split('</section>')[0];
    expect((section.match(/class="card"/g) ?? []).length).toBe(4);
  });

  it('shows three review quotes including the translated repeat buyer', () => {
    expect((html.match(/class="quote"/g) ?? []).length).toBe(3);
    expect(html).toContain('That was already my second purchase');
    expect(html).toContain('Translated from German');
  });

  it('has Organization and WebSite JSON-LD', () => {
    const types = jsonLd(html).map((d) => d['@type']);
    expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite']));
  });

  it('title and description fit', () => {
    const title = html.match(/<title>([^<]+)<\/title>/)![1];
    expect(title.length).toBeLessThanOrEqual(60);
    const description = html.match(/<meta name="description" content="([^"]*)"/)![1];
    expect(description.length).toBeLessThanOrEqual(155);
  });
});

describe('site-wide content rules', () => {
  it('never shows the excluded review or links eBay', () => {
    for (const f of htmlFiles()) {
      const h = readFileSync(f, 'utf8');
      expect(h.toLowerCase()).not.toContain('noel francis');
      expect(h).not.toMatch(/href="https?:\/\/(www\.)?ebay\./);
    }
  });
});
