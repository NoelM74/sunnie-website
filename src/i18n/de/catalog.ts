import { LANDERS } from '../../data/landers';
import { LANDERS_DE } from './landers';
import { PRODUCTS_DE } from './products';

// Which shop products have a German page, and where: a German product page (/de/produkte/),
// or the German bundle page of the product's lander (/de/go/).
const landerFor = (id: string) => LANDERS.find((l) => l.productSlug === id && LANDERS_DE[l.slug]);

export const germanHref = (id: string): string | null =>
  PRODUCTS_DE[id] ? `/de/produkte/${id}/` : landerFor(id) ? `/de/go/${landerFor(id)!.slug}/` : null;
export const hasGerman = (id: string) => germanHref(id) !== null;
export const germanName = (id: string, english: string) => PRODUCTS_DE[id]?.name ?? (landerFor(id) ? LANDERS_DE[landerFor(id)!.slug].name : english);

export const CATEGORY_DE: Record<string, { label: string; path: string }> = {
  bags: { label: 'Taschen', path: '/de/shop/taschen/' },
  coasters: { label: 'Untersetzer', path: '/de/shop/untersetzer/' },
  hats: { label: 'Mützen', path: '/shop/hats/' },
};
