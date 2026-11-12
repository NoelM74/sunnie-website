// "You might also like" on the thank-you page. Cards are built at deploy time
// (/recs.json, with optimised photos); the page picks four for each order here.

export interface RecCard {
  slug: string;
  name: string;
  href: string;
  img: string;
  category: string;
  group: string | null;
  isNew: boolean;
  featured: number | null;
  /** Shown price in each currency, formatted: { EUR: '€39.95', ... }. */
  price: { EUR: string; GBP: string; USD: string };
  /** Bag slugs that mean "already bought this" (the product, and its bundle item). */
  boughtAs: string[];
}

/** Pieces from the same family as what they bought first, then the shop's favourites and new pieces. Never what's already in the order. */
export function recommend(cards: RecCard[], boughtSlugs: string[], count = 4): RecCard[] {
  const bought = cards.filter((c) => c.boughtAs.some((s) => boughtSlugs.includes(s)));
  const groups = new Set(bought.map((c) => c.group).filter(Boolean));
  const categories = new Set(bought.map((c) => c.category));
  const score = (c: RecCard) =>
    (c.group && groups.has(c.group) ? 6 : 0) +
    (categories.has(c.category) ? 2 : 0) +
    (c.featured !== null ? 5 - c.featured : 0) +
    (c.isNew ? 1 : 0);
  return cards
    .map((c, i) => ({ c, i, s: score(c) }))
    .filter(({ c }) => !bought.includes(c))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, count)
    .map(({ c }) => c);
}
