import { packPricing, type BundleSize } from './bundles';
// Finn & the Shamrock sells from his lander at /go/finn-the-shamrock/ (moved from
// finn.sunniedesigns.com on 2026-11-12; that domain now redirects there). He is not a
// product page: he lives only in the catalogue, so the bag and PayPal checkout can take
// him, and the shop grids never list him. FINN_ORIGIN stays allowed for old handoff links.
export const FINN_SLUG = 'finn-the-shamrock';
export const FINN_ORIGIN = 'https://finn.sunniedesigns.com';
const FINN_PACKS = ['1 frog', '2 frogs', '3 frogs'];
/** Same price lists as the other bundle landers (src/lib/bundles.ts), approved 2026-11-12. */
export const FINN_ITEM = {
  slug: FINN_SLUG,
  name: 'Finn & the Shamrock frog bag',
  inStock: true,
  option: { name: 'Bundle', values: FINN_PACKS },
  ...packPricing(FINN_PACKS, (v) => Number(v[0]) as BundleSize),
  siteCheckout: true,
  maker: 'Sunnie Designs',
  featured: null,
  href: '/go/finn-the-shamrock/',
};

/** True when every line in the bag is Finn, so the buyer goes back to Finn's thank-you page. */
export const isFinnOnly = (lines: { slug: string }[]) => lines.length > 0 && lines.every((l) => l.slug === FINN_SLUG);
