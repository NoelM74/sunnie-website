import { describe, expect, it } from 'vitest';
import { recommend, type RecCard } from '../../src/lib/recommend';

const card = (slug: string, o: Partial<RecCard> = {}): RecCard => ({
  slug, name: slug, href: `/products/${slug}/`, img: '', category: 'bags', group: 'characters', isNew: false, featured: null,
  price: { EUR: '€1', GBP: '£1', USD: '$1' }, boughtAs: [slug], ...o,
});

describe('thank-you recommendations', () => {
  const cards = [
    card('miso', { boughtAs: ['miso', 'miso-cat-bundle'] }),
    card('tote', { group: 'totes' , featured: 1 }),
    card('coaster', { category: 'coasters', group: null, featured: 2 }),
    card('dog'),
    card('frog', { isNew: true }),
    card('flower', { group: 'flowers' }),
  ];
  it('never shows what was just bought, even when it was bought as a bundle', () => {
    expect(recommend(cards, ['miso-cat-bundle']).map((c) => c.slug)).not.toContain('miso');
  });
  it('puts the same family first: a cat buyer sees the other character bags', () => {
    expect(recommend(cards, ['miso-cat-bundle']).slice(0, 2).map((c) => c.slug)).toEqual(['frog', 'dog']);
  });
  it('falls back to the shop favourites with no order', () => {
    expect(recommend(cards, [])[0].slug).toBe('tote');
    expect(recommend(cards, [])).toHaveLength(4);
  });
});
