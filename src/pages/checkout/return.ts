import type { APIRoute } from 'astro';
import { getEnv } from '../../lib/env';
import { d1Orders } from '../../lib/orders';
import { paypalClient } from '../../lib/paypal';
import { resendMailer } from '../../lib/email';
import { handleReturn } from '../../lib/checkout-handlers';
import { BAG_COOKIE, ORDER_COOKIE, signValue } from '../../lib/bag-cookie';

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
    cookies.delete(BAG_COOKIE, { path: '/' });
    cookies.set(ORDER_COOKIE, await signValue(r.ref, env.BAG_SECRET), { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 24 });
    return redirect(r.kind === 'review' ? '/checkout/complete/?pending=1' : '/checkout/complete/', 303);
  }
  if (r.kind === 'declined') return redirect('/bag/?declined=1', 303);
  return redirect(`/checkout/complete/?error=${encodeURIComponent(r.message)}`, 303);
};
