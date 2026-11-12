import type { APIRoute } from 'astro';
import { FINN_ITEM } from '../lib/finn';
import { CURRENCIES } from '../lib/currency';
import { freeShippingThresholdCents } from '../lib/money';
import { priceBag } from '../lib/pricing';

export const prerender = true;

// The old finn.sunniedesigns.com page read this. It now redirects to /go/finn-the-shamrock/,
// but the feed stays correct (priced by the bag itself) for any copy still cached.
export const GET: APIRoute = () => {
  const catalog = { [FINN_ITEM.slug]: { ...FINN_ITEM, thumb: '' } };
  const out = Object.fromEntries(
    CURRENCIES.map((cur) => {
      const one = (option: string) => priceBag([{ slug: FINN_ITEM.slug, option, qty: 1 }], catalog, cur);
      return [cur, {
        bundles: Object.fromEntries(FINN_ITEM.option.values.map((v) => [v, one(v).subtotalCents])),
        shippingCents: one(FINN_ITEM.option.values[0]).shippingCents,
        freeFromCents: freeShippingThresholdCents(cur),
      }];
    }),
  );
  return new Response(JSON.stringify(out), { headers: { 'content-type': 'application/json' } });
};
