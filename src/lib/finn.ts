// Finn & the Shamrock sells from its own funnel page at finn.sunniedesigns.com.
// It is not a product page here: it lives only in the catalogue, so the bag and
// PayPal checkout can take it, and the shop grids never list it.
export const FINN_SLUG = 'finn-the-shamrock';
export const FINN_ORIGIN = 'https://finn.sunniedesigns.com';
export const FINN_ITEM = {
  slug: FINN_SLUG,
  name: 'Finn & the Shamrock frog bag',
  priceCents: 3495,
  inStock: true,
  option: { name: 'Bundle', values: ['1 frog', '2 frogs', '3 frogs'] },
  optionPriceCents: { '1 frog': 3495, '2 frogs': 6195, '3 frogs': 8595 },
  siteCheckout: true,
  maker: 'Sunnie Designs',
  featured: null,
  href: FINN_ORIGIN + '/',
};

/** True when every line in the bag is Finn, so the buyer goes back to Finn's thank-you page. */
export const isFinnOnly = (lines: { slug: string }[]) => lines.length > 0 && lines.every((l) => l.slug === FINN_SLUG);
