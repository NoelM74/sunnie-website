import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIST } from './helpers';

describe('catalog.json', () => {
  const cat = JSON.parse(readFileSync(join(DIST, 'catalog.json'), 'utf8'));
  it('lists every product with integer prices and a thumbnail', () => {
    const items = Object.values(cat) as Array<Record<string, unknown>>;
    expect(items.length).toBeGreaterThan(40);
    for (const i of items) {
      expect(Number.isInteger(i.priceCents)).toBe(true);
      expect(String(i.thumb)).toMatch(/^\/_astro\/.+\.webp$/);
      expect(typeof i.siteCheckout).toBe('boolean');
      expect(i.optionPriceCents === null || typeof i.optionPriceCents === 'object').toBe(true);
    }
  });
  it('carries per-option prices in cents', () => {
    const mandala = cat['flower-mandala-coaster'] as Record<string, unknown>;
    expect(mandala.siteCheckout).toBe(true);
    expect(mandala.priceCents).toBe(1695);
    expect(mandala.optionPriceCents).toEqual({
      '4 coasters + free basket': 1695,
      '6 coasters + free basket': 2295,
      '8 coasters + 2 free baskets': 2795,
    });
  });
  it('carries the frog colour option', () => {
    expect(cat['frog-phone-crossbody'].option).toEqual({ name: 'Colour', values: ['Pink', 'Blue', 'Brown'] });
  });
});
