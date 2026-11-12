import type { CatalogItem } from './catalog';

// Bundle landers (/go/<slug>/) sell one product in packs of 1, 2 or 3, with a colour
// for each piece. The bag holds a bundle as one line: a hidden catalogue item whose
// option is the whole pack, e.g. "2 cats: Black + Brown". The bag, PayPal, the order
// row and the emails all treat it like any other option, so none of them change.

/** Owner-set euro prices, the same ladder as Finn & the Shamrock (2026-11-12). */
export const BUNDLE_EUR_CENTS: Record<1 | 2 | 3, number> = { 1: 3495, 2: 6195, 3: 8595 };
export const BUNDLE_SIZES = [1, 2, 3] as const;
export type BundleSize = (typeof BUNDLE_SIZES)[number];

export interface BundleDef {
  /** URL slug of the lander, /go/<slug>/. */
  slug: string;
  /** Line name in the bag, e.g. "Miso the cat bag". */
  name: string;
  /** What one piece is called: ['cat', 'cats']. */
  noun: [string, string];
  /** Short colour labels, in the order the picker shows them. */
  picks: string[];
  maker: string;
}

export const bundleSlug = (def: Pick<BundleDef, 'slug'>) => `${def.slug}-bundle`;

const nounFor = (def: BundleDef, n: number) => (n === 1 ? def.noun[0] : def.noun[1]);

/** "2 cats: Black + Brown". Picks sort into picker order, so Brown + Black is the same line. Null if a pick is unknown. */
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

export function bundleCatalogItem(def: BundleDef, thumb: string): CatalogItem {
  const values = bundleOptionValues(def);
  const size = (v: string) => Number(v.split(' ')[0]) as BundleSize;
  return {
    slug: bundleSlug(def),
    name: def.name,
    priceCents: BUNDLE_EUR_CENTS[1],
    inStock: true,
    option: { name: 'Bundle', values },
    optionPriceCents: Object.fromEntries(values.map((v) => [v, BUNDLE_EUR_CENTS[size(v)]])),
    siteCheckout: true,
    thumb,
    maker: def.maker,
    featured: null,
    href: `/go/${def.slug}/`,
  };
}
