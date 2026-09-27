/** Pure validation used by the content collection schema's refine, kept free of
 * astro:content so it can be unit-tested directly. `optionPrices`, when present,
 * must only key values that actually exist on the product's single option group. */
export function optionPricesKeysValid(values: string[], optionPrices?: Record<string, number> | null): boolean {
  if (!optionPrices) return true;
  return Object.keys(optionPrices).every((k) => values.includes(k));
}
