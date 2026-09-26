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
    }
  });
  it('carries the frog colour option', () => {
    expect(cat['frog-phone-crossbody'].option).toEqual({ name: 'Colour', values: ['Pink', 'Blue', 'Brown'] });
  });
});
