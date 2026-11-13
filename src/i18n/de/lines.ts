import { LANDERS } from '../../data/landers';
import { bundleSlug } from '../../lib/bundles';
import { LANDERS_DE } from './landers';
import { germanOption } from './localize';
import { PRODUCTS_DE } from './products';
import type { Lang } from '../lang';

/** A bag or order line's name and option in the shopper's language. Bundle packs from a German
 * page read in German; other pieces keep their English name until they have a German page. */
export function shownLine<T extends { slug: string; name: string; option?: string }>(l: T, lang: Lang): T {
  if (lang !== 'de') return l;
  const p = PRODUCTS_DE[l.slug];
  if (p) return { ...l, name: p.name, option: l.option ? p.option?.values[l.option] ?? l.option : l.option };
  const lander = LANDERS.find((x) => bundleSlug(x) === l.slug || x.cart?.slug === l.slug);
  const de = lander && LANDERS_DE[lander.slug];
  if (!lander || !de) return l;
  return { ...l, name: de.name, option: l.option ? germanOption(lander, de, l.option) : l.option };
}
