export const site = {
  name: 'Sunnie Designs',
  url: 'https://sunniedesigns.com',
  description:
    'Crochet phone bags, totes and coasters, each one made by hand by Hui. Rated 4.9 on Etsy. Ships in 3–5 days with tracking.',
  // Change these two lines when pieces from other makers join the shop.
  makerLine: 'Handmade by Hui',
  heroMakerClause: 'each one made by hand by Hui',
  email: {
    hello: 'hello@sunniedesigns.com',
    hui: 'hui@sunniedesigns.com',
  },
  etsyShopUrl: 'https://www.etsy.com/shop/SunnieDesignCo',
  /** Owner's pick for the homepage hero (2026-10-13). Remove to show the newest piece. */
  heroProduct: 'plush-dog-crossbody-phone-bag',
  shipsIn: '3–5 days',
  /** Owner-supplied, 2026-10-09. Working days after dispatch. */
  delivery: [
    { region: 'Ireland', carrier: 'An Post', days: '7–12' },
    { region: 'United Kingdom', carrier: 'Evri', days: '5–8' },
    { region: 'Rest of the EU', carrier: 'DHL Mail or La Poste', days: '6–14' },
    { region: 'United States and Canada', carrier: 'USPS (via Dragonfly)', days: '6–12' },
    { region: 'Rest of the world', carrier: 'YunExpress', days: '8–30' },
  ],
  replyTime: 'within 24 hours',
  company: {
    legalName: 'Springfield Tectop Limited',
    tradingAs: 'Sunnie Designs',
    cro: '571256',
    registeredOffice: 'Clareview Car Sales, Ennis Road, Co. Limerick, V94 EA3A',
  },
  freeShippingFrom: '€49',
  proof: {
    etsyRating: '4.9',
    ebayCount: '287',
    ebayPositive: '100%',
  },
} as const;
