import { describe, expect, it } from 'vitest';
import {
  featured, formatPrice, inCategory, inGroup, newest, related, showHatsInNav, sortForGrid,
  type ProductLike,
} from '../../src/lib/products';

const p = (id: string, data: Partial<ProductLike['data']> = {}): ProductLike => ({
  id,
  data: { name: id, category: 'bags', group: 'characters', inStock: true, ...data },
});

describe('sortForGrid', () => {
  it('puts in-stock first, then new, then name', () => {
    const out = sortForGrid([p('b'), p('a', { inStock: false }), p('c', { isNew: true }), p('a2')]);
    expect(out.map((x) => x.id)).toEqual(['c', 'a2', 'b', 'a']);
  });
});

describe('filters', () => {
  const items = [p('frog'), p('rose', { group: 'flowers' }), p('coaster', { category: 'coasters', group: undefined })];
  it('filters by category', () => expect(inCategory(items, 'coasters').map((x) => x.id)).toEqual(['coaster']));
  it('filters bags by group', () => expect(inGroup(items, 'flowers').map((x) => x.id)).toEqual(['rose']));
});

describe('featured', () => {
  it('returns slots 1–4 in order', () => {
    const items = [p('d', { featured: 4 }), p('a', { featured: 1 }), p('c', { featured: 3 }), p('b', { featured: 2 }), p('x')];
    expect(featured(items).map((x) => x.id)).toEqual(['a', 'b', 'c', 'd']);
  });
  it('throws when a slot is missing or doubled', () => {
    expect(() => featured([p('a', { featured: 1 }), p('b', { featured: 1 })])).toThrow(/exactly 4/);
  });
});

describe('newest', () => {
  it('returns the first in-stock new product', () => {
    expect(newest([p('old'), p('gone', { isNew: true, inStock: false }), p('pup', { isNew: true })])?.id).toBe('pup');
  });
});

describe('related', () => {
  it('prefers the same group, then the same category, then others, excluding itself', () => {
    const cur = p('frog');
    const items = [cur, p('rose', { group: 'flowers' }), p('crab'), p('coaster', { category: 'coasters', group: undefined }), p('bear'), p('pig')];
    expect(related(items, cur, 4).map((x) => x.id)).toEqual(['bear', 'crab', 'pig', 'rose']);
  });
});

describe('nav rule', () => {
  it('shows hats only with 4+ in-stock hats', () => {
    const hats = (n: number) => Array.from({ length: n }, (_, i) => p(`h${i}`, { category: 'hats', group: undefined }));
    expect(showHatsInNav(hats(3))).toBe(false);
    expect(showHatsInNav(hats(4))).toBe(true);
  });
});

describe('formatPrice', () => {
  it('formats euros for Ireland', () => expect(formatPrice(24.95)).toBe('€24.95'));
});
