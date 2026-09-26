import { describe, expect, it } from 'vitest';
import { centsToAmount, shippingFor } from '../../src/lib/money';
import { priceBag, type BagLine } from '../../src/lib/pricing';
import type { Catalog } from '../../src/lib/catalog';

const catalog: Catalog = {
  frog: { slug: 'frog', name: 'Frog phone crossbody', priceCents: 2995, inStock: true, option: { name: 'Colour', values: ['Pink', 'Blue'] }, thumb: '/t/frog.webp', maker: 'Hui', featured: 1 },
  coaster: { slug: 'coaster', name: 'Flower coaster', priceCents: 1695, inStock: true, option: null, thumb: '/t/c.webp', maker: 'Hui', featured: null },
  gone: { slug: 'gone', name: 'Old bag', priceCents: 2000, inStock: false, option: null, thumb: '/t/g.webp', maker: 'Hui', featured: null },
};

describe('money', () => {
  it('charges €5 below €49', () => expect(shippingFor(4899)).toBe(500));
  it('ships free at exactly €49', () => expect(shippingFor(4900)).toBe(0));
  it('ships free above €49', () => expect(shippingFor(4901)).toBe(0));
  it('charges nothing for an empty bag', () => expect(shippingFor(0)).toBe(0));
  it('formats cents for PayPal', () => {
    expect(centsToAmount(2495)).toBe('24.95');
    expect(centsToAmount(500)).toBe('5.00');
    expect(centsToAmount(0)).toBe('0.00');
  });
});

describe('priceBag', () => {
  it('prices lines from the catalog, never from input', () => {
    const lines: BagLine[] = [{ slug: 'frog', option: 'Pink', qty: 1 }];
    const p = priceBag(lines, catalog);
    expect(p.lines[0]).toMatchObject({ unitCents: 2995, lineCents: 2995, name: 'Frog phone crossbody', option: 'Pink' });
    expect(p).toMatchObject({ subtotalCents: 2995, shippingCents: 500, totalCents: 3495, freeShippingGapCents: 1905 });
  });
  it('ships free once the subtotal reaches €49', () => {
    const p = priceBag([{ slug: 'frog', option: 'Blue', qty: 1 }, { slug: 'coaster', qty: 2 }], catalog);
    expect(p).toMatchObject({ subtotalCents: 6385, shippingCents: 0, totalCents: 6385, freeShippingGapCents: 0 });
  });
  it('drops unknown, sold-out and invalid-option lines and reports them', () => {
    const p = priceBag(
      [
        { slug: 'nope', qty: 1 },
        { slug: 'gone', qty: 1 },
        { slug: 'frog', option: 'Green', qty: 1 },
        { slug: 'frog', qty: 1 },
        { slug: 'coaster', option: 'Red', qty: 1 },
      ],
      catalog,
    );
    expect(p.lines).toHaveLength(0);
    expect(p.dropped).toEqual(['nope', 'Old bag', 'Frog phone crossbody', 'Frog phone crossbody', 'Flower coaster']);
    expect(p.totalCents).toBe(0);
  });
  it('clamps quantity to 1..5', () => {
    const p = priceBag([{ slug: 'coaster', qty: 9 }, { slug: 'coaster', qty: 0 }], catalog);
    expect(p.lines.map((l) => l.qty)).toEqual([5, 1]);
  });
});
