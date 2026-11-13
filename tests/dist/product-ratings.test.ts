import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIST } from './helpers';
import data from '../../src/data/product-reviews.json';

const productOf = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
    .flatMap((m) => [JSON.parse(m[1])].flat())
    .find((x) => x['@type'] === 'Product');

// Pages per product slug: its bundle page if it has one, else its product page, in English and German.
const PAGES: Record<string, string[]> = {
  'frog-phone-crossbody': ['go/star-frogs', 'de/go/star-frogs'],
  'fuzzy-monster-phone-bag': ['go/big-mouth-monsters', 'de/go/big-mouth-monsters'],
  'cable-knit-tote-bag': ['products/cable-knit-tote-bag', 'de/produkte/cable-knit-tote-bag'],
  'sheep-crossbody-bag': ['products/sheep-crossbody-bag', 'de/produkte/sheep-crossbody-bag'],
  '3d-flower-crochet-phone-bag': ['products/3d-flower-crochet-phone-bag', 'de/produkte/3d-flower-crochet-phone-bag'],
};

describe('product star ratings', () => {
  const reviews = data as unknown as Record<string, { rating: number }[]>;
  it('covers every product with reviews', () => {
    expect(Object.keys(reviews).filter((k) => !k.startsWith('_')).sort()).toEqual(Object.keys(PAGES).sort());
  });
  it.each(Object.entries(PAGES))('%s shows the same rating it sends to Google', (slug, pages) => {
    const list = reviews[slug];
    for (const p of pages) {
      const html = readFileSync(join(DIST, p, 'index.html'), 'utf8');
      const ld = productOf(html);
      expect(ld.aggregateRating.reviewCount, p).toBe(list.length);
      expect(ld.review, p).toHaveLength(list.length);
      expect(html, p).toContain('id="product-reviews"');
      expect(html, p).toMatch(new RegExp(`(from|aus) ${list.length} (review|Bewertung)`));
    }
  });
  it('no other product claims a rating', () => {
    const html = readFileSync(join(DIST, 'go/miso-cat/index.html'), 'utf8');
    expect(productOf(html).aggregateRating).toBeUndefined();
  });
});
