export const site = {
  name: 'Sunnie Designs',
  url: 'https://sunniedesigns.com',
  description:
    'Crochet phone bags, totes and coasters, each one made by hand by Hui. Rated 4.9 by our buyers. Ships in 3–5 days with tracking.',
  // Change these two lines when pieces from other makers join the shop.
  makerLine: 'Handmade by Hui',
  heroMakerClause: 'each one made by hand by Hui',
  email: {
    hello: 'hello@sunniedesigns.com',
    hui: 'hui@sunniedesigns.com',
  },
  etsyShopUrl: 'https://www.etsy.com/shop/SunnieDesignCo',
  pinterestUrl: 'https://www.pinterest.com/Sunnie_Designs/',
  facebookUrl: 'https://www.facebook.com/sunniedesigns',
  shipsIn: '3–5 days',
  /** Carriers and days owner-supplied 2026-10-09 (working days after dispatch). The countries are
   * the owner's list of 2026-11-13, the only ones the checkout and Google Shopping offer.
   * Norway keeps the old "rest of the world" days; owner: don't name YunExpress, we use various companies. */
  delivery: [
    { region: 'Ireland', countries: ['IE'], carrier: 'An Post', days: '7–12' },
    { region: 'United Kingdom', countries: ['GB'], carrier: 'Evri', days: '5–8' },
    { region: 'EU', countries: ['AT', 'BE', 'DK', 'FI', 'FR', 'DE', 'NL', 'PL', 'PT', 'ES', 'SE'], carrier: 'DHL Mail or La Poste', days: '6–14' },
    { region: 'United States and Canada', countries: ['US', 'CA'], carrier: 'USPS (via Dragonfly)', days: '6–12' },
    { region: 'Norway', countries: ['NO'], carrier: 'Tracked post', days: '8–30' },
  ],
  replyTime: 'within 24 hours',
  company: {
    legalName: 'Springfield Tectop Limited',
    tradingAs: 'Sunnie Designs',
    cro: '571256',
    registeredOffice: 'Clareview Car Sales, Ennis Road, Co. Limerick, V94 EA3A',
  },
  proof: {
    etsyRating: '4.9',
    ebayCount: '287',
    ebayPositive: '100%',
  },
} as const;
