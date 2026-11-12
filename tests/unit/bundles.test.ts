import { describe, expect, it } from 'vitest';
import { BUNDLE_EUR_CENTS, bundleCatalogItem, bundleOption, bundleOptionValues, bundleSlug } from '../../src/lib/bundles';
import { LANDERS } from '../../src/data/landers';
import { priceBag } from '../../src/lib/pricing';
import { CURRENCIES, toLocalCents } from '../../src/lib/currency';
import { freeShippingThresholdCents, shippingFlatCents } from '../../src/lib/money';
import { handleBagPost } from '../../src/lib/bag-routes';
import reviews from '../../src/data/reviews.json';

const cat = LANDERS.find((l) => l.slug === 'miso-cat')!;

describe('bundle options', () => {
  it('sorts picks into picker order, so a mix is one line', () => {
    expect(bundleOption(cat, ['Brown', 'Black'])).toBe('2 cats: Black + Brown');
    expect(bundleOption(cat, ['Yellow'])).toBe('1 cat: Yellow');
  });
  it('rejects unknown colours and sizes outside 1 to 3', () => {
    expect(bundleOption(cat, ['Pink'])).toBeNull();
    expect(bundleOption(cat, [])).toBeNull();
    expect(bundleOption(cat, ['Black', 'Black', 'Black', 'Black'])).toBeNull();
  });
  it('lists every mix once: 3 colours give 3 + 6 + 10 packs', () => {
    const v = bundleOptionValues(cat);
    expect(v).toHaveLength(19);
    expect(new Set(v).size).toBe(19);
    expect(v).toContain('3 cats: Black + Black + Yellow');
  });
});

describe('bundles in the bag', () => {
  const catalog = Object.fromEntries(LANDERS.map((l) => [bundleSlug(l), bundleCatalogItem(l, '/t.webp')]));

  it('prices each pack size at the owner-set euro ladder, shipping free from two', () => {
    const one = priceBag([{ slug: 'miso-cat-bundle', option: '1 cat: Brown', qty: 1 }], catalog, 'EUR');
    expect(one.subtotalCents).toBe(BUNDLE_EUR_CENTS[1]);
    expect(one.shippingCents).toBe(500);
    const two = priceBag([{ slug: 'miso-cat-bundle', option: '2 cats: Black + Brown', qty: 1 }], catalog, 'EUR');
    expect(two.subtotalCents).toBe(6195);
    expect(two.shippingCents).toBe(0);
    const three = priceBag([{ slug: 'snout-and-about-bundle', option: '3 dogs: Grey schnauzer + Beige puppy + White terrier', qty: 1 }], catalog, 'EUR');
    expect(three.subtotalCents).toBe(BUNDLE_EUR_CENTS[3]);
  });

  it('adds a lander pack and refuses a made-up one', () => {
    const add = (option: string) => {
      const f = new FormData();
      f.set('slug', 'finn-in-the-hood-bundle');
      f.set('option', option);
      f.set('qty', '1');
      return handleBagPost('add', f, [], catalog);
    };
    expect(add('2 frogs: Yellow + Blue').notice).toBe('added');
    expect(add('2 frogs: Blue + Yellow').notice).toBe('invalid');
    expect(add('2 frogs: Yellow + Green').notice).toBe('invalid');
  });
});

describe('lander content', () => {
  it('quotes only reviews that exist, and starts every picker on a real colour', () => {
    for (const l of LANDERS) {
      const keys = [l.hero.proof, l.offer.proof, ...l.reviews];
      for (const k of keys) expect(reviews.some((r) => r.reviewer === k.reviewer && r.date === k.date), `${l.slug}: ${k.reviewer}`).toBe(true);
      for (const p of l.offer.defaults) expect(l.picks).toContain(p);
      expect(l.colours.cards.map((c) => c.pick)).toEqual(l.picks);
    }
  });
  it('shows no delivery times: those live on /shipping/', () => {
    const text = JSON.stringify(LANDERS);
    expect(text).not.toMatch(/working days/);
  });
});

describe('the price ladder', () => {
  it('always charges shipping on one piece and never on two, in every currency', () => {
    for (const cur of CURRENCIES) {
      expect(toLocalCents(BUNDLE_EUR_CENTS[1], cur), cur).toBeLessThan(freeShippingThresholdCents(cur));
      expect(toLocalCents(BUNDLE_EUR_CENTS[2], cur), cur).toBeGreaterThanOrEqual(freeShippingThresholdCents(cur));
    }
  });
  it('makes each extra piece cost no more than the one before, delivered', () => {
    for (const cur of CURRENCIES) {
      const p = (n: 1 | 2 | 3) => toLocalCents(BUNDLE_EUR_CENTS[n], cur);
      const second = p(2) - p(1) - shippingFlatCents(cur);
      const third = p(3) - p(2);
      expect(third, cur).toBeLessThanOrEqual(second + 100); // within one rounding step of .95 pricing
    }
  });
});
