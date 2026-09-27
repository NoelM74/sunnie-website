import { describe, expect, it } from 'vitest';
import { handleBagPost } from '../../src/lib/bag-routes';
import type { Catalog } from '../../src/lib/catalog';

const catalog: Catalog = {
  frog: { slug: 'frog', name: 'Frog', priceCents: 2995, inStock: true, option: { name: 'Colour', values: ['Pink', 'Blue'] }, optionPriceCents: null, siteCheckout: true, thumb: '', maker: 'Hui', featured: 1 },
  coaster: { slug: 'coaster', name: 'Coaster', priceCents: 1695, inStock: true, option: null, optionPriceCents: null, siteCheckout: true, thumb: '', maker: 'Hui', featured: null },
  gone: { slug: 'gone', name: 'Gone', priceCents: 1000, inStock: false, option: null, optionPriceCents: null, siteCheckout: true, thumb: '', maker: 'Hui', featured: null },
  etsyOnly: { slug: 'etsyOnly', name: 'Etsy only', priceCents: 1500, inStock: true, option: null, optionPriceCents: null, siteCheckout: false, thumb: '', maker: 'Hui', featured: null },
};
const fd = (o: Record<string, string | undefined>) => { const f = new FormData(); for (const [k, v] of Object.entries(o)) if (v !== undefined) f.set(k, v); return f; };

describe('handleBagPost', () => {
  it('adds a valid product with its option', () => {
    expect(handleBagPost('add', fd({ slug: 'frog', option: 'Pink', qty: '2' }), [], catalog)).toEqual({ lines: [{ slug: 'frog', option: 'Pink', qty: 2 }], notice: 'added' });
  });
  it('rejects unknown, sold-out, missing-option and bad-option adds', () => {
    for (const f of [{ slug: 'nope' }, { slug: 'gone' }, { slug: 'frog' }, { slug: 'frog', option: 'Green' }, { slug: 'coaster', option: 'Red' }]) {
      expect(handleBagPost('add', fd({ qty: '1', ...f }), [], catalog)).toEqual({ lines: [], notice: 'invalid' });
    }
  });
  it('rejects a siteCheckout: false item', () => {
    expect(handleBagPost('add', fd({ slug: 'etsyOnly', qty: '1' }), [], catalog)).toEqual({ lines: [], notice: 'invalid' });
  });
  it('updates and removes by index', () => {
    const bag = [{ slug: 'coaster', qty: 1 }];
    expect(handleBagPost('update', fd({ index: '0', qty: '4' }), bag, catalog)).toEqual({ lines: [{ slug: 'coaster', qty: 4 }], notice: 'updated' });
    expect(handleBagPost('remove', fd({ index: '0' }), bag, catalog)).toEqual({ lines: [], notice: 'removed' });
  });
});
