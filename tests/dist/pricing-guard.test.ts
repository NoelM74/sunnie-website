import { describe, expect, it } from 'vitest';
import { page, productFrontmatters, readCatalog } from './helpers';

// Owner-supplied per-option prices (2026-10-03) for products whose option
// values are packs or sizes. The site must charge these, never one flat price.
const OPTION_PRICES: Record<string, Record<string, number>> = {
  'animal-coasters-cat-pig-and-bear': { Cat: 1795, Pig: 1795, Bear: 1795, 'Set Of 3': 3995 },
  'carnation-mug-rug-that-folds-into-a-mini': { 'Set Of Two': 1995, 'Set Of Four': 2995 },
  'fat-lips-girl-crossbody-phone-bag-with-daisy': { 'Large 28 x 11 cm': 2495, 'Small 20 x 10 cm': 1995 },
  'flower-mandala-coaster': { '4 coasters + free basket': 1695, '6 coasters + free basket': 2295, '8 coasters + 2 free baskets': 2795 },
  'flower-shoulder-bag-with-flower-charm': { 'Pink Large': 2995, 'Yellow Large': 2995, 'Blue Large': 2995, 'Pink Small': 2495, 'Yellow Small': 2495, 'Blue Small': 2495 },
  'panda-crossbody-bag': { 'Mini Tote Bag': 2395, 'Crossbody Sling Bag': 2695 },
  'rainbow-crochet-wizard-hat': { '2–5 years -48cm brim': 2295, '5–9 years -58cm brim': 2495 },
  'rose-flower-coaster-with-mini-basket': { '2 Coasters and Pots': 1995, '4 Coasters and Pots': 2995, '6 coasters and Pots': 3995 },
};
const SLUGS = Object.keys(OPTION_PRICES);

const SUSPECT_NAME = /^(set|pack|size|style)$/i;
const SUSPECT_VALUE = /set of|coasters|large|small|years|tote|sling/i;

describe('per-option pricing guard', () => {
  it.each(SLUGS)('%s sells on site and shows each option price', (slug) => {
    const html = page(`/products/${slug}/`);
    expect(html).toContain('action="/bag/add/"');
    for (const cents of new Set(Object.values(OPTION_PRICES[slug]))) {
      expect(html).toContain(`€${(cents / 100).toFixed(2)}`);
    }
  });

  it('the catalog carries the owner prices for all 8 pack/size products', () => {
    const cat = readCatalog();
    for (const slug of SLUGS) {
      expect(cat[slug]?.siteCheckout, slug).toBe(true);
      expect(cat[slug]?.optionPriceCents, slug).toEqual(OPTION_PRICES[slug]);
    }
  });

  it('a pack/size-like option group always has optionPrices or is off site checkout', () => {
    const bad = productFrontmatters()
      .filter((p) => {
        const opt = p.options[0];
        if (!opt) return false;
        const suspect = SUSPECT_NAME.test(opt.name) || opt.values.some((v) => SUSPECT_VALUE.test(v));
        return suspect && !p.optionPrices && p.siteCheckout !== false;
      })
      .map((p) => p.slug);
    expect(bad).toEqual([]);
  });
});
