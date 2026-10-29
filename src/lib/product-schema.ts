/** Pure validation used by the content collection schema's refine, kept free of
 * astro:content so it can be unit-tested directly. `optionPrices`, when present,
 * must only key values that actually exist on the product's single option group. */
export function optionPricesKeysValid(values: string[], optionPrices?: Record<string, number> | null): boolean {
  if (!optionPrices) return true;
  return Object.keys(optionPrices).every((k) => values.includes(k));
}

const STOP = new Set(['with', 'and', 'the', 'a', 'of', 'set', 'style', 'regular', 'free']);
const words = (s: string) => (s.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((w) => !STOP.has(w));
const has = (alt: string, w: string) => new RegExp(`\\b${w}`).test(alt);

/** Which photo (0-based) to show when a buyer picks `value`. `photos` (1-based, from the
 *  product file) wins; else the first photo whose alt text names every word of the value,
 *  preferring one that names no other value (so a group shot of all colours is skipped). */
export function optionPhoto(value: string, values: string[], alts: string[], photos?: Record<string, number>): number | null {
  if (photos?.[value]) return photos[value] - 1 < alts.length ? photos[value] - 1 : null;
  const mine = words(value);
  if (mine.length === 0) return null;
  const others = values.filter((v) => v !== value).flatMap(words).filter((w) => !mine.includes(w));
  const lower = alts.map((a) => a.toLowerCase());
  const hits = lower.map((a, i) => [a, i] as const).filter(([a]) => mine.every((w) => has(a, w)));
  const clean = hits.find(([a]) => !others.some((w) => has(a, w)));
  return (clean ?? hits[0])?.[1] ?? null;
}
