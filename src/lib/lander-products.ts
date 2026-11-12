import { LANDERS } from '../data/landers';
import { bundleOption, bundleSlug, priceBook } from './bundles';
import { SHIPPING_FLAT } from './money';

/**
 * A shop product that has a bundle lander sells the lander's single pack, so one bag
 * costs the same (price and shipping, in every currency) wherever it's bought.
 */
export function packFor(productSlug: string) {
  const l = LANDERS.find((x) => x.productSlug === productSlug);
  if (!l) return null;
  return {
    lander: l,
    slug: l.cart?.slug ?? bundleSlug(l),
    /** Product option value → the single-pack option the bag takes ('' for a product with no options). */
    optionFor: (l.cart
      ? Object.fromEntries([...l.picks, ''].map((p) => [p, l.cart!.options[1]]))
      : Object.fromEntries(l.picks.map((p) => [p, bundleOption(l, [p])!]))) as Record<string, string>,
    price: { eur: priceBook(l).EUR[1], gbp: priceBook(l).GBP[1], usd: priceBook(l).USD[1] },
    shipping: { eur: SHIPPING_FLAT.EUR, gbp: SHIPPING_FLAT.GBP, usd: SHIPPING_FLAT.USD },
  };
}

/**
 * A product with a bundle lander has one page: the lander. Its old /products/ page
 * 301-redirects there (public/_redirects), and every link goes straight to it.
 */
export const productHref = (productSlug: string) => {
  const l = LANDERS.find((x) => x.productSlug === productSlug);
  return l ? `/go/${l.slug}/` : `/products/${productSlug}/`;
};
export const LANDER_PRODUCT_SLUGS = LANDERS.flatMap((l) => (l.productSlug ? [l.productSlug] : []));
