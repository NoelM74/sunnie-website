import { describe, expect, it } from 'vitest';
import { page, productFrontmatters, readCatalog } from './helpers';

// These 8 products have option values that are really packs or sizes with
// different prices, which the owner has not supplied yet. Until they do,
// the products must stay off site checkout so we never charge one flat
// price for a pack that costs more.
const OFF_SITE_CHECKOUT_SLUGS = [
  'animal-coasters-cat-pig-and-bear',
  'carnation-mug-rug-that-folds-into-a-mini',
  'fat-lips-girl-crossbody-phone-bag-with-daisy',
  'flower-mandala-coaster',
  'flower-shoulder-bag-with-flower-charm',
  'panda-crossbody-bag',
  'rainbow-crochet-wizard-hat',
  'rose-flower-coaster-with-mini-basket',
];

const SUSPECT_NAME = /^(set|pack|size|style)$/i;
const SUSPECT_VALUE = /set of|coasters|large|small|years|tote|sling/i;

describe('per-option pricing guard', () => {
  it.each(OFF_SITE_CHECKOUT_SLUGS)('%s shows Buy on Etsy and no bag form', (slug) => {
    const html = page(`/products/${slug}/`);
    expect(html).toContain('Buy on Etsy');
    expect(html).not.toMatch(/action="\/bag\/add\/"/);
  });

  it('the catalog marks all 8 pending-price products as siteCheckout: false', () => {
    const cat = readCatalog();
    for (const slug of OFF_SITE_CHECKOUT_SLUGS) expect(cat[slug]?.siteCheckout, slug).toBe(false);
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
