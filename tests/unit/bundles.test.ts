import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BUNDLE_PRICES, bundleCatalogItem, bundleOption, bundleOptionValues, bundleSlug } from '../../src/lib/bundles';
import { LANDERS } from '../../src/data/landers';
import { priceBag } from '../../src/lib/pricing';
import { handleBagPost } from '../../src/lib/bag-routes';
import { FINN_ITEM } from '../../src/lib/finn';
import { CURRENCIES } from '../../src/lib/currency';
import { packFor } from '../../src/lib/lander-products';
import reviews from '../../src/data/reviews.json';

const cat = LANDERS.find((l) => l.slug === 'miso-cat')!;
const catalog = {
  ...Object.fromEntries(LANDERS.filter((l) => !l.cart).map((l) => [bundleSlug(l), bundleCatalogItem(l, '/t.webp')])),
  [FINN_ITEM.slug]: { ...FINN_ITEM, thumb: '/t.webp' },
};

describe('bundle options', () => {
  it('sorts picks into picker order, so a mix is one line', () => {
    expect(bundleOption(cat, ['Brown Cat', 'Black Cat'])).toBe('2 cats: Black Cat + Brown Cat');
    expect(bundleOption(cat, ['Yellow Cat'])).toBe('1 cat: Yellow Cat');
  });
  it('rejects unknown colours and sizes outside 1 to 3', () => {
    expect(bundleOption(cat, ['Pink'])).toBeNull();
    expect(bundleOption(cat, [])).toBeNull();
    expect(bundleOption(cat, ['Black Cat', 'Black Cat', 'Black Cat', 'Black Cat'])).toBeNull();
  });
  it('lists every mix once: 3 colours give 3 + 6 + 10 packs', () => {
    const v = bundleOptionValues(cat);
    expect(v).toHaveLength(19);
    expect(new Set(v).size).toBe(19);
    expect(v).toContain('3 cats: Black Cat + Black Cat + Yellow Cat');
  });
});

describe('the approved price lists', () => {
  // Owner-approved 2026-11-12. Change these only with the owner.
  const APPROVED = {
    EUR: { 1: 3995, 2: 6995, 3: 8995, ship: 600 },
    GBP: { 1: 2995, 2: 4995, 3: 6495, ship: 500 },
    USD: { 1: 3995, 2: 6995, 3: 8995, ship: 600 },
  } as const;

  for (const [slug, option] of [['miso-cat-bundle', (n: number) => bundleOption(cat, ['Black Cat', 'Brown Cat', 'Yellow Cat'].slice(0, n))!], [FINN_ITEM.slug, (n: number) => `${n} ${n === 1 ? 'frog' : 'frogs'}`]] as const) {
    it(`${slug}: the bag charges exactly the listed price and shipping in every currency`, () => {
      for (const cur of CURRENCIES) {
        const a = APPROVED[cur];
        for (const n of [1, 2, 3] as const) {
          const b = priceBag([{ slug, option: option(n), qty: 1 }], catalog, cur);
          expect(b.subtotalCents, `${cur} ${n}`).toBe(a[n]);
          expect(b.shippingCents, `${cur} ${n} shipping`).toBe(n === 1 ? a.ship : 0);
        }
      }
    });
  }

  it('matches BUNDLE_PRICES', () => {
    for (const cur of CURRENCIES) {
      expect(BUNDLE_PRICES[cur].packs).toEqual({ 1: APPROVED[cur][1], 2: APPROVED[cur][2], 3: APPROVED[cur][3] });
      expect(BUNDLE_PRICES[cur].shipping).toBe(APPROVED[cur].ship);
    }
  });

  it('leaves other products on the shop rate: a pack plus a coaster ships free over the threshold', () => {
    const mixed = priceBag([{ slug: 'miso-cat-bundle', option: '1 cat: Black Cat', qty: 1 }, { slug: 'miso-cat-bundle', option: '1 cat: Brown Cat', qty: 1 }], catalog, 'EUR');
    expect(mixed.shippingCents).toBe(0);
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

describe('shop product pages with a lander', () => {
  it('sell the single pack, one per colour the product offers', () => {
    for (const l of LANDERS.filter((x) => x.productSlug)) {
      const md = readFileSync(join(process.cwd(), 'src/content/products', `${l.productSlug}.md`), 'utf8');
      const values: string[] = JSON.parse(md.match(/^options:\s*(.+)$/m)![1])[0].values;
      expect([...values].sort(), l.slug).toEqual([...l.picks].sort());
      expect(md, l.slug).toMatch(/^price: 39\.95$/m);
      const pack = packFor(l.productSlug!)!;
      for (const v of values) expect(catalog[pack.slug].option!.values).toContain(pack.optionFor[v]);
    }
  });
});

describe('lander content', () => {
  it('quotes only reviews that exist, and starts every picker on a real colour', () => {
    for (const l of LANDERS) {
      if (l.cart) for (const n of [1, 2, 3] as const) expect(l.cart.options[n]).toBeTruthy();
      const keys = [l.hero.proof, l.offer.proof, ...l.reviews];
      for (const k of keys) expect(reviews.some((r) => r.reviewer === k.reviewer && r.date === k.date), `${l.slug}: ${k.reviewer}`).toBe(true);
      for (const p of l.offer.defaults) expect(l.picks).toContain(p);
      if (l.colours) expect(l.colours.cards.map((c) => c.pick)).toEqual(l.picks);
      else expect(l.picks).toHaveLength(1);
    }
  });
  it('shows no delivery times: those live on /shipping/', () => {
    expect(JSON.stringify(LANDERS)).not.toMatch(/\d+\s*(–|-|to)\s*\d+ working days/);
  });
  it('Finn sells through his existing bag item', () => {
    const finn = LANDERS.find((l) => l.slug === 'finn-the-shamrock')!;
    expect(finn.cart!.slug).toBe(FINN_ITEM.slug);
    for (const n of [1, 2, 3] as const) expect(FINN_ITEM.option.values).toContain(finn.cart!.options[n]);
    expect(FINN_ITEM.href).toBe('/go/finn-the-shamrock/');
  });
});

describe('lander marks', () => {
  it('every lander has its character logo', () => {
    for (const l of LANDERS) expect(() => readFileSync(join(process.cwd(), 'public/go', `${l.slug}-mark.svg`)), l.slug).not.toThrow();
  });
});
