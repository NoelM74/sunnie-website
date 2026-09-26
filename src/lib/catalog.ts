export interface CatalogItem {
  slug: string;
  name: string;
  priceCents: number;
  inStock: boolean;
  option: { name: string; values: string[] } | null;
  thumb: string;
  maker: string;
  featured: number | null;
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
