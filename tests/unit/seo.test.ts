import { describe, expect, it } from 'vitest';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  metaDescription,
  organizationJsonLd,
  pageTitle,
  productJsonLd,
  productTitle,
} from '../../src/lib/seo';

describe('titles', () => {
  it('adds the brand suffix', () => {
    expect(pageTitle('Our story')).toBe('Our story | Sunnie Designs');
  });
  it('leaves the bare brand name alone', () => {
    expect(pageTitle('Sunnie Designs')).toBe('Sunnie Designs');
  });
  it('uses the long product form when it fits in 60 chars', () => {
    expect(productTitle('Poodle crossbody bag')).toBe('Poodle crossbody bag, handmade crochet | Sunnie Designs');
  });
  it('drops the qualifier when too long', () => {
    const t = productTitle('Blue stripe tote bag with removable flower');
    expect(t).toBe('Blue stripe tote bag with removable flower | Sunnie Designs');
    expect(t.length).toBeLessThanOrEqual(60);
  });
  it('truncates very long names with an ellipsis', () => {
    const t = productTitle('An extraordinarily long product name that keeps going and going');
    expect(t.length).toBeLessThanOrEqual(60);
    expect(t).toMatch(/…\s\|\sSunnie Designs$/);
  });
});

describe('metaDescription', () => {
  it('strips markdown and collapses whitespace', () => {
    expect(metaDescription('**Soft** bag.\n\n- Fits a phone\n- Hand-crocheted')).toBe('Soft bag. Fits a phone Hand-crocheted');
  });
  it('cuts on a word boundary with an ellipsis', () => {
    const d = metaDescription('word '.repeat(60));
    expect(d.length).toBeLessThanOrEqual(155);
    expect(d.endsWith('…')).toBe(true);
    expect(d).not.toMatch(/\s…$/);
  });
});

describe('JSON-LD', () => {
  it('builds a Product with a EUR offer', () => {
    const ld = productJsonLd({
      name: 'Frog bag',
      description: 'A frog.',
      url: 'https://sunniedesigns.com/products/frog/',
      images: ['https://sunniedesigns.com/a.jpg'],
      price: 24.95,
      inStock: false,
    });
    expect(ld['@type']).toBe('Product');
    expect(ld.brand.name).toBe('Sunnie Designs');
    expect(ld.offers).toMatchObject({
      priceCurrency: 'EUR',
      price: '24.95',
      availability: 'https://schema.org/SoldOut',
    });
    expect(ld).not.toHaveProperty('aggregateRating');
  });
  it('builds absolute breadcrumb URLs', () => {
    const ld = breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Bags', path: '/shop/bags/' }]);
    expect(ld.itemListElement[1]).toEqual({
      '@type': 'ListItem',
      position: 2,
      name: 'Bags',
      item: 'https://sunniedesigns.com/shop/bags/',
    });
  });
  it('links the organisation to Etsy', () => {
    expect(organizationJsonLd().sameAs).toContain('https://www.etsy.com/shop/SunnieDesignCo');
  });
  it('makes absolute URLs', () => {
    expect(absoluteUrl('/shop/')).toBe('https://sunniedesigns.com/shop/');
  });
});
