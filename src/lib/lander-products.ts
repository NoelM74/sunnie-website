import { LANDERS } from '../data/landers';
import { BUNDLE_PRICES, bundleOption, bundleSlug } from './bundles';

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
    price: { eur: BUNDLE_PRICES.EUR.packs[1], gbp: BUNDLE_PRICES.GBP.packs[1], usd: BUNDLE_PRICES.USD.packs[1] },
    shipping: { eur: BUNDLE_PRICES.EUR.shipping, gbp: BUNDLE_PRICES.GBP.shipping, usd: BUNDLE_PRICES.USD.shipping },
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
