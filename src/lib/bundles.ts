import type { CatalogItem } from './catalog';
import type { Currency } from './currency';
import { SHIPPING_FLAT } from './money';

// Bundle landers (/go/<slug>/) sell one product in packs of 1, 2 or 3, with a colour
// for each piece. The bag holds a pack as one line: a hidden catalogue item whose
// option is the whole pack, e.g. "2 cats: Black Cat + Brown Cat". The bag, PayPal, the
// order row and the emails all treat it like any other option.

export const BUNDLE_SIZES = [1, 2, 3] as const;
export type BundleSize = (typeof BUNDLE_SIZES)[number];

export type PriceBook = Record<Currency, Record<BundleSize, number>>;

/**
 * Owner-approved price lists, set per currency rather than converted (2026-11-12).
 * One piece pays the shop's flat shipping; a pack of two or more always ships free.
 * Checkout charges in the delivery country's currency, so these can't be mixed.
 */
export const BUNDLE_PRICES: Record<Currency, { packs: Record<BundleSize, number>; shipping: number }> = {
  EUR: { packs: { 1: 3995, 2: 6995, 3: 8995 }, shipping: SHIPPING_FLAT.EUR },
  GBP: { packs: { 1: 2995, 2: 4995, 3: 6495 }, shipping: SHIPPING_FLAT.GBP },
  USD: { packs: { 1: 3995, 2: 6995, 3: 8995 }, shipping: SHIPPING_FLAT.USD },
};
export const STANDARD_PRICES: PriceBook = { EUR: BUNDLE_PRICES.EUR.packs, GBP: BUNDLE_PRICES.GBP.packs, USD: BUNDLE_PRICES.USD.packs };

export interface BundleDef {
  /** URL slug of the lander, /go/<slug>/. */
  slug: string;
  /** Line name in the bag, e.g. "Miso the cat bag". */
  name: string;
  /** What one piece is called: ['cat', 'cats']. */
  noun: [string, string];
  /** Colour names, in picker order. For a lander with a shop product, these match its option values. */
  picks: string[];
  maker: string;
  /** This product's own price list. Default: STANDARD_PRICES. */
  prices?: PriceBook;
}

export const priceBook = (def: Pick<BundleDef, 'prices'>): PriceBook => def.prices ?? STANDARD_PRICES;

export const bundleSlug = (def: Pick<BundleDef, 'slug'>) => `${def.slug}-bundle`;

const nounFor = (def: BundleDef, n: number) => (n === 1 ? def.noun[0] : def.noun[1]);

/** "2 cats: Black Cat + Brown Cat". Picks sort into picker order, so either order is the same line. Null if a pick is unknown. */
export function bundleOption(def: BundleDef, picks: string[]): string | null {
  if (!BUNDLE_SIZES.includes(picks.length as BundleSize)) return null;
  const idx = picks.map((p) => def.picks.indexOf(p));
  if (idx.some((i) => i < 0)) return null;
  const sorted = idx.sort((a, b) => a - b).map((i) => def.picks[i]);
  return `${picks.length} ${nounFor(def, picks.length)}: ${sorted.join(' + ')}`;
}

/** Every pack the lander can send to the bag: each size, each mix of colours. */
export function bundleOptionValues(def: BundleDef): string[] {
  const out: string[] = [];
  const walk = (size: number, start: number, acc: number[]) => {
    if (acc.length === size) { out.push(bundleOption(def, acc.map((i) => def.picks[i]))!); return; }
    for (let i = start; i < def.picks.length; i++) walk(size, i, [...acc, i]);
  };
  for (const size of BUNDLE_SIZES) walk(size, 0, []);
  return out;
}

/** Catalogue price fields for a set of pack options, from BUNDLE_PRICES. */
export function packPricing(values: string[], sizeOf: (v: string) => BundleSize, prices: PriceBook = STANDARD_PRICES) {
  const book = (cur: Currency) => Object.fromEntries(values.map((v) => [v, prices[cur][sizeOf(v)]]));
  return {
    priceCents: prices.EUR[1],
    optionPriceCents: book('EUR'),
    localPrices: { GBP: book('GBP'), USD: book('USD') },
    /** Packs of two or more ship free whatever the basket total. */
    shipsFree: values.filter((v) => sizeOf(v) > 1),
  };
}

const sizeFromOption = (v: string) => Number(v.split(' ')[0]) as BundleSize;

export function bundleCatalogItem(def: BundleDef, thumb: string): CatalogItem {
  const values = bundleOptionValues(def);
  return {
    slug: bundleSlug(def),
    name: def.name,
    inStock: true,
    option: { name: 'Bundle', values },
    ...packPricing(values, sizeFromOption, priceBook(def)),
    siteCheckout: true,
    thumb,
    maker: def.maker,
    featured: null,
    href: `/go/${def.slug}/`,
  };
}
