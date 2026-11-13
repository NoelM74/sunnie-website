import { LANDER_PRODUCT_SLUGS } from '../../src/lib/lander-products';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIST, jsonLd, page, productCount, readCatalog } from './helpers';
import { formatMoney, toLocalCents } from '../../src/lib/currency';
import { reviewsFor } from '../../src/lib/product-reviews';

const slugs = readdirSync(join(DIST, 'products'));
const catalog = readCatalog();

describe('product pages', () => {
  // Products with a bundle lander live at /go/<slug>/ instead (public/_redirects).
  it('builds every product', () => expect(slugs).toHaveLength(productCount() - LANDER_PRODUCT_SLUGS.length));

  it.each(slugs)('%s has Product data, a price and a buy action', (slug) => {
    const html = page(`/products/${slug}/`);
    const product = jsonLd(html).find((d) => d['@type'] === 'Product');
    expect(product?.offers.priceCurrency).toBe('EUR');
    expect(product?.offers.url).toBe(`https://sunniedesigns.com/products/${slug}/`);
    // Stars only for products with their own reviews (src/data/product-reviews.json), never shop-wide ones.
    if (reviewsFor(slug).length === 0) expect(product).not.toHaveProperty('aggregateRating');
    expect(html).toMatch(/€\d+\.\d{2}/);
    if (catalog[slug]?.siteCheckout === false) {
      expect(html).toContain('Buy on Etsy');
      expect(html).not.toMatch(/action="\/bag\/add\/"/);
    } else {
      expect(html).toMatch(/<form[^>]*method="post"[^>]*action="\/bag\/add\/"|class="btn btn-disabled btn-block"/);
      if (!html.includes('class="btn btn-disabled btn-block"')) expect(html).toMatch(/Free shipping from <span class="money" data-gbp="£|Free shipping on 2 or more<\/a>/);
    }
    expect(html).toContain('Made by ');
    expect(html).toContain('property="og:type" content="product"');
  });

  it.each(slugs)('%s shows the same pound and dollar price the checkout charges', (slug) => {
    const html = page(`/products/${slug}/`);
    // Pages for products with a bundle lander sell its single pack (a fixed price list), so check the item the form posts.
    const sold = html.match(/name="slug" value="([^"]+)"/)?.[1] ?? slug;
    const item = catalog[sold] as { priceCents: number; optionPriceCents: Record<string, number> | null; localPrices?: Record<'GBP' | 'USD', Record<string, number>> };
    const eurCents = item.optionPriceCents ? Math.min(...Object.values(item.optionPriceCents)) : item.priceCents;
    const local = (cur: 'GBP' | 'USD') => item.localPrices?.[cur] ? Math.min(...Object.values(item.localPrices[cur])) : toLocalCents(eurCents, cur);
    const price = html.split('class="product-price"')[1].split('</p>')[0];
    expect(price).toContain(`data-gbp="${formatMoney(local('GBP'), 'GBP')}" data-usd="${formatMoney(local('USD'), 'USD')}">${formatMoney(eurCents, 'EUR')}</span>`);
  });

  it('marks the first gallery image as high priority', () => {
    const html = page(`/products/${slugs[0]}/`);
    expect(html).toMatch(/<img[^>]*fetchpriority="high"/);
  });

  it('a product page offers its colour choices as required radios', () => {
    const html = page('/products/cable-knit-tote-bag/');
    for (const c of ['Cream', 'Khaki', 'Terracotta']) expect(html).toMatch(new RegExp(`type="radio"[^>]*name="option"[^>]*value="${c}"`));
    expect(html).toMatch(/type="radio"[^>]*required/);
  });
});
