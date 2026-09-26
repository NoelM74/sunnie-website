import { describe, expect, it } from 'vitest';
import { jsonLd, page, productCategoryCounts, productCount } from './helpers';

const cards = (html: string) => (html.match(/class="card"/g) ?? []).length;

describe('shop pages', () => {
  it('shop all lists every product', () => {
    expect(cards(page('/shop/'))).toBe(productCount());
  });
  it('bags page has three group sections', () => {
    const html = page('/shop/bags/');
    for (const label of ['Characters and animals', 'Flowers', 'Totes and shoulder bags']) {
      expect(html).toContain(`>${label}</h2>`);
    }
    expect(cards(html)).toBeGreaterThan(40);
  });
  it('coasters and hats pages exist', () => {
    const counts = productCategoryCounts();
    expect(cards(page('/shop/coasters/'))).toBe(counts.coasters);
    expect(cards(page('/shop/hats/'))).toBeGreaterThanOrEqual(1);
  });
  it('category pages carry breadcrumbs', () => {
    const ld = jsonLd(page('/shop/coasters/'));
    expect(ld.some((d) => d['@type'] === 'BreadcrumbList')).toBe(true);
  });
  it('cards show a euro price and link to product pages', () => {
    const html = page('/shop/');
    expect(html).toMatch(/€\d+\.\d{2}/);
    expect(html).toMatch(/href="\/products\/[a-z0-9-]+\/"/);
  });
});
