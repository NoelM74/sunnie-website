import type { APIRoute } from 'astro';
import { FINN_ITEM } from '../lib/finn';
import { CURRENCIES, toLocalCents } from '../lib/currency';
import { freeShippingThresholdCents, shippingFlatCents } from '../lib/money';

export const prerender = true;

// The Finn page reads this, so it shows the same prices this build's checkout charges.
export const GET: APIRoute = () => {
  const out = Object.fromEntries(
    CURRENCIES.map((cur) => [cur, {
      bundles: Object.fromEntries(Object.entries(FINN_ITEM.optionPriceCents).map(([k, v]) => [k, toLocalCents(v, cur)])),
      shippingCents: shippingFlatCents(cur),
      freeFromCents: freeShippingThresholdCents(cur),
    }]),
  );
  return new Response(JSON.stringify(out), { headers: { 'content-type': 'application/json' } });
};
