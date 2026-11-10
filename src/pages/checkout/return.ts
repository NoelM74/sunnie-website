import type { APIRoute } from 'astro';
import { getEnv } from '../../lib/env';
import { d1Orders } from '../../lib/orders';
import { paypalClient } from '../../lib/paypal';
import { resendMailer } from '../../lib/email';
import { handleReturn } from '../../lib/checkout-handlers';
import { BAG_COOKIE, COUNT_COOKIE, ORDER_COOKIE, decodeBag, signValue } from '../../lib/bag-cookie';
import { FINN_ORIGIN, isFinnOnly } from '../../lib/finn';

export const prerender = false;

// AMENDMENT (after the Task 8 payment fix): handleReturn can now return 'review' (PayPal
// capture is PENDING, e.g. an eCheck) in addition to 'complete', 'declined' and 'error'.
// 'review' clears the bag like a successful payment (the buyer is done, PayPal is still
// confirming) but flags the thank-you page so nothing implies the order has shipped.
export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const env = getEnv();
  const r = await handleReturn(url.searchParams.get('token'), {
    orders: d1Orders(env.ORDERS),
    paypal: paypalClient({ clientId: env.PAYPAL_CLIENT_ID, secret: env.PAYPAL_CLIENT_SECRET, env: env.PAYPAL_ENV }),
    mailer: resendMailer({ apiKey: env.RESEND_API_KEY, from: env.ORDER_FROM_EMAIL, replyTo: 'hello@sunniedesigns.com' }),
    notifyEmail: env.ORDER_NOTIFY_EMAIL || 'hello@sunniedesigns.com',
  });
  if (r.kind === 'complete' || r.kind === 'review') {
    const finnOnly = isFinnOnly(await decodeBag(cookies.get(BAG_COOKIE)?.value, env.BAG_SECRET));
    cookies.delete(BAG_COOKIE, { path: '/' });
    cookies.delete(COUNT_COOKIE, { path: '/' });
    cookies.set(ORDER_COOKIE, await signValue(r.ref, env.BAG_SECRET), { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 24 });
    const done = finnOnly
      ? `${FINN_ORIGIN}/thanks?ref=${encodeURIComponent(r.ref)}${r.kind === 'review' ? '&pending=1' : ''}`
      : r.kind === 'review' ? '/checkout/complete/?pending=1' : '/checkout/complete/';
    const res = redirect(done, 303);
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }
  if (r.kind === 'declined') {
    const res = redirect('/bag/?declined=1', 303);
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }
  const res = redirect(`/checkout/complete/?error=${r.code}`, 303);
  res.headers.set('Cache-Control', 'no-store');
  return res;
};
