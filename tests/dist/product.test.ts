import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIST, jsonLd, page, productCount, readCatalog } from './helpers';

const slugs = readdirSync(join(DIST, 'products'));
const catalog = readCatalog();

describe('product pages', () => {
  it('builds every product', () => expect(slugs).toHaveLength(productCount()));

  it.each(slugs)('%s has Product data, a price and a buy action', (slug) => {
    const html = page(`/products/${slug}/`);
    const product = jsonLd(html).find((d) => d['@type'] === 'Product');
    expect(product?.offers.priceCurrency).toBe('EUR');
    expect(product?.offers.url).toBe(`https://sunniedesigns.com/products/${slug}/`);
    expect(product).not.toHaveProperty('aggregateRating');
    expect(html).toMatch(/€\d+\.\d{2}/);
    if (catalog[slug]?.siteCheckout === false) {
      expect(html).toContain('Buy on Etsy');
      expect(html).not.toMatch(/action="\/bag\/add\/"/);
    } else {
      expect(html).toMatch(/<form[^>]*method="post"[^>]*action="\/bag\/add\/"|class="btn btn-disabled btn-block"/);
      expect(html).toContain('Free worldwide shipping on orders of €49 or more');
    }
    expect(html).toContain('Made by ');
    expect(html).toContain('property="og:type" content="product"');
  });

  it('marks the first gallery image as high priority', () => {
    const html = page(`/products/${slugs[0]}/`);
    expect(html).toMatch(/<img[^>]*fetchpriority="high"/);
  });

  it('frog page offers its colour choices as required radios', () => {
    const html = page('/products/frog-phone-crossbody/');
    for (const c of ['Pink', 'Blue', 'Brown']) expect(html).toMatch(new RegExp(`type="radio"[^>]*name="option"[^>]*value="${c}"`));
    expect(html).toMatch(/type="radio"[^>]*required/);
  });
});
