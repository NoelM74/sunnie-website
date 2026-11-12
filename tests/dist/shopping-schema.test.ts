import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { htmlFiles, jsonLd, page, rel } from './helpers';
import { LANDERS } from '../../src/data/landers';

// Google Shopping (free listings, AI Mode product cards) needs shipping and returns on every offer,
// matching the shipping page: €6, free from €50, 30-day returns (60 for Finn & the Shamrock).
const productOf = (html: string) => jsonLd(html).find((d) => d['@type'] === 'Product');

describe('shopping-ready product data', () => {
  it('every Product offer carries shipping details and the return policy', () => {
    const files = htmlFiles().filter((f) => /^(products|go)\//.test(rel(f)));
    let checked = 0;
    for (const f of files) {
      const p = productOf(readFileSync(f, 'utf8'));
      if (!p) continue;
      checked++;
      expect(p.offers.shippingDetails?.length, rel(f)).toBeGreaterThan(0);
      expect(p.offers.hasMerchantReturnPolicy?.merchantReturnDays, rel(f)).toBeGreaterThanOrEqual(30);
      const rate = Number(p.offers.shippingDetails[0].shippingRate.value);
      const price = Number(p.offers.price ?? p.offers.lowPrice);
      expect(rate, rel(f)).toBe(price >= 50 ? 0 : 6);
    }
    expect(checked).toBeGreaterThan(40);
  });

  it.each(LANDERS.map((l) => l.slug))('%s lists one piece as a single Offer, with its photos', (slug) => {
    const p = productOf(page(`/go/${slug}/`));
    expect(p.offers['@type']).toBe('Offer');
    expect(p.image.length).toBeGreaterThan(1);
    expect(p.material).toBeTruthy();
  });

  it('Fruit Bellies are coasters and Finn & the Shamrock has 60-day returns', () => {
    expect(productOf(page('/go/fruit-bellies/')).category).toBe('Coasters');
    expect(productOf(page('/go/finn-the-shamrock/')).offers.hasMerchantReturnPolicy.merchantReturnDays).toBe(60);
    expect(productOf(page('/go/star-frogs/')).offers.hasMerchantReturnPolicy.merchantReturnDays).toBe(30);
  });

  it('the home page Organization carries the return policy', () => {
    const org = jsonLd(page('/')).find((d) => d['@type'] === 'Organization');
    expect(org.hasMerchantReturnPolicy.merchantReturnDays).toBe(30);
  });
});
