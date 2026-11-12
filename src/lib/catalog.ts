export interface CatalogItem {
  slug: string;
  name: string;
  priceCents: number;
  inStock: boolean;
  option: { name: string; values: string[] } | null;
  optionPriceCents: Record<string, number> | null;
  siteCheckout: boolean;
  thumb: string;
  maker: string;
  featured: number | null;
  /** Link for the bag line, when the item has no product page here. */
  href?: string;
  /** Fixed pound and dollar prices by option, instead of converting the euro price (bundle packs). */
  localPrices?: Partial<Record<'GBP' | 'USD', Record<string, number>>>;
  /** Flat shipping for this item when the order is under the free-shipping threshold, if above the shop's. */
  shipFlatCents?: Partial<Record<'EUR' | 'GBP' | 'USD', number>>;
}
export type Catalog = Record<string, CatalogItem>;

let cached: Catalog | null = null;

export async function loadCatalog(fetchAsset: (path: string) => Promise<Response>): Promise<Catalog> {
  if (cached) return cached;
  const res = await fetchAsset('/catalog.json');
  if (!res.ok) throw new Error(`catalog.json returned ${res.status}`);
  cached = (await res.json()) as Catalog;
  return cached;
}
