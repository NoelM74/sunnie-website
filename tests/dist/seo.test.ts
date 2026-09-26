import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIST, htmlFiles, jsonLd, page, rel } from './helpers';

const productSlugs = readdirSync(join(DIST, 'products'));

describe('product page structured data', () => {
  it.each(productSlugs)('%s has Product JSON-LD with a sku', (slug) => {
    const html = page(`/products/${slug}/`);
    const product = jsonLd(html).find((d) => d['@type'] === 'Product');
    expect(product?.sku).toBe(slug);
  });

  it.each(productSlugs)('%s FAQPage question count matches its <dt> count, when it has FAQs', (slug) => {
    const html = page(`/products/${slug}/`);
    const faq = jsonLd(html).find((d) => d['@type'] === 'FAQPage');
    const dtCount = (html.match(/<dt[ >]/g) ?? []).length;
    if (faq) {
      expect(faq.mainEntity).toHaveLength(dtCount);
    } else {
      expect(dtCount).toBe(0);
    }
  });
});

describe('category page structured data', () => {
  it('bags page has a CollectionPage/ItemList whose count matches its cards', () => {
    const html = page('/shop/bags/');
    const list = jsonLd(html).find((d) => d['@type'] === 'CollectionPage');
    const cardCount = (html.match(/class="card"/g) ?? []).length;
    expect(list?.mainEntity['@type']).toBe('ItemList');
    expect(list?.mainEntity.itemListElement).toHaveLength(cardCount);
  });
});

describe('FAQPage uniqueness', () => {
  it('no page has more than one FAQPage block', () => {
    for (const f of htmlFiles()) {
      const html = readFileSync(f, 'utf8');
      const count = jsonLd(html).filter((d) => d['@type'] === 'FAQPage').length;
      expect(count, rel(f)).toBeLessThanOrEqual(1);
    }
  });
});

describe('llms.txt', () => {
  const text = readFileSync(join(DIST, 'llms.txt'), 'utf8');

  it('exists and lists every product URL', () => {
    for (const slug of productSlugs) {
      expect(text).toContain(`https://sunniedesigns.com/products/${slug}/`);
    }
  });

  it('never mentions wool except in "no animal wool"', () => {
    const withoutApprovedPhrase = text.replace(/no animal wool/gi, '');
    expect(withoutApprovedPhrase.toLowerCase()).not.toContain('wool');
  });
});
