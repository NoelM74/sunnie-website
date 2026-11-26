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
      expect(p.offers.map((o: { priceCurrency: string }) => o.priceCurrency), rel(f)).toEqual(['EUR', 'GBP', 'USD']);
      for (const o of p.offers) {
        expect(o.shippingDetails?.length, rel(f)).toBeGreaterThan(0);
        expect(o.hasMerchantReturnPolicy?.merchantReturnDays, rel(f)).toBeGreaterThanOrEqual(30);
        const rate = Number(o.shippingDetails[0].shippingRate.value);
        const price = Number(o.price ?? o.lowPrice);
        const [flat, free] = { EUR: [6, 50], GBP: [5, 45], USD: [6, 55] }[o.priceCurrency as 'EUR' | 'GBP' | 'USD'];
        expect(rate, rel(f)).toBe(price >= free ? 0 : flat);
      }
      // The pound and dollar offers carry the prices the page itself shows in pounds and dollars.
      const html = readFileSync(f, 'utf8');
      for (const o of p.offers.slice(1)) {
        const sym = o.priceCurrency === 'GBP' ? '£' : '$';
        expect(html, `${rel(f)} ${o.priceCurrency}`).toContain(`${sym}${o.price ?? o.lowPrice}`);
      }
    }
    expect(checked).toBeGreaterThan(40);
  });

  it.each(LANDERS.map((l) => l.slug))('%s lists one piece as a single Offer, with its photos', (slug) => {
    const p = productOf(page(`/go/${slug}/`));
    expect(p.offers[0]['@type']).toBe('Offer');
    expect(p.image.length).toBeGreaterThan(1);
    expect(p.material).toBeTruthy();
  });

  it('Fruit Bellies are coasters and Finn & the Shamrock has 60-day returns', () => {
    expect(productOf(page('/go/fruit-bellies/')).category).toBe('Coasters');
    expect(productOf(page('/go/finn-the-shamrock/')).offers[0].hasMerchantReturnPolicy.merchantReturnDays).toBe(60);
    expect(productOf(page('/go/star-frogs/')).offers[0].hasMerchantReturnPolicy.merchantReturnDays).toBe(30);
  });

  it('the home page Organization carries the return policy', () => {
    const org = jsonLd(page('/')).find((d) => d['@type'] === 'Organization');
    expect(org.hasMerchantReturnPolicy.merchantReturnDays).toBe(30);
    // Business identity for Google: legal name, registered address and a customer service contact.
    expect(org.legalName).toBe('Noel Murphy');
    expect(org.address.postalCode).toBe('V94 R2DX');
    expect(org.address.addressCountry).toBe('IE');
    expect(org.contactPoint.email).toBe('hello@sunniedesigns.com');
  });
});
