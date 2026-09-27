import type { APIRoute } from 'astro';
import { getEnv } from '../../lib/env';
import { loadCatalog } from '../../lib/catalog';
import { BAG_COOKIE, decodeBag } from '../../lib/bag-cookie';
import { d1Orders, newRef } from '../../lib/orders';
import { paypalClient } from '../../lib/paypal';
import { handlePay } from '../../lib/checkout-handlers';
import { isSameOrigin } from '../../lib/request';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect, rewrite, locals }) => {
  if (!isSameOrigin(request)) return new Response('Forbidden', { status: 403 });
  const env = getEnv();
  const origin = new URL(request.url).origin;
  const catalog = await loadCatalog((p) => env.ASSETS.fetch(new Request(new URL(p, origin))));
  const bag = await decodeBag(cookies.get(BAG_COOKIE)?.value, env.BAG_SECRET);
  // Read the form data from a clone: Astro.rewrite() re-sends the original request, and it
  // throws RewriteWithBodyUsed if that request's body has already been consumed here.
  const r = await handlePay(await request.clone().formData(), bag, {
    catalog,
    orders: d1Orders(env.ORDERS),
    paypal: paypalClient({ clientId: env.PAYPAL_CLIENT_ID, secret: env.PAYPAL_CLIENT_SECRET, env: env.PAYPAL_ENV }),
    paypalEnv: env.PAYPAL_ENV,
    origin,
    newRef,
  });
  if (r.kind === 'redirect') {
    const res = redirect(r.location, 303);
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }
  if (r.kind === 'empty') {
    const res = redirect('/bag/', 303);
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }
  (locals as unknown as Record<string, unknown>).checkout = r.kind === 'invalid' ? { values: r.values, errors: r.errors } : { values: r.values, errors: {}, payError: r.message };
  const res = await rewrite('/checkout/');
  res.headers.set('Cache-Control', 'no-store');
  return res;
};
