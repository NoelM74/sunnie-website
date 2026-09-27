import type { Catalog } from './catalog';
import type { BagLine } from './pricing';
import { priceBag } from './pricing';
import { validateCheckout, type CheckoutValues } from './checkout-form';
import type { OrdersRepo } from './orders';
import { PayPalError, type PayPalClient } from './paypal';
import { buildCustomerEmail, buildShopEmail, type Mailer } from './email';

export interface PayDeps { catalog: Catalog; orders: OrdersRepo; paypal: PayPalClient; paypalEnv: 'sandbox' | 'live'; origin: string; newRef: () => string }
export interface ReturnDeps { orders: OrdersRepo; paypal: PayPalClient; mailer: Mailer; notifyEmail: string }

type PayResult =
  | { kind: 'redirect'; location: string }
  | { kind: 'invalid'; values: CheckoutValues; errors: Record<string, string> }
  | { kind: 'empty' }
  | { kind: 'payError'; values: CheckoutValues; message: string };

export async function handlePay(form: FormData, bag: BagLine[], deps: PayDeps): Promise<PayResult> {
  const priced = priceBag(bag, deps.catalog);
  if (priced.lines.length === 0) return { kind: 'empty' };
  const v = validateCheckout(form);
  if (!v.ok) return { kind: 'invalid', values: v.values, errors: v.errors as Record<string, string> };
  const { email, ...address } = v.values;
  const input = { ref: deps.newRef(), email, address, lines: priced.lines, subtotalCents: priced.subtotalCents, shippingCents: priced.shippingCents, totalCents: priced.totalCents, paypalEnv: deps.paypalEnv };
  try {
    await deps.orders.insertPending(input);
  } catch {
    input.ref = deps.newRef();
    await deps.orders.insertPending(input);
  }
  try {
    const created = await deps.paypal.createOrder(input, { returnUrl: `${deps.origin}/checkout/return/`, cancelUrl: `${deps.origin}/checkout/cancel/` });
    await deps.orders.setPaypalId(input.ref, created.id);
    return { kind: 'redirect', location: created.approveUrl };
  } catch (err) {
    const issue = err instanceof PayPalError ? err.issue ?? '' : '';
    const message = /ADDRESS|POSTAL|STATE|CITY|COUNTRY/.test(issue)
      ? 'PayPal could not accept this delivery address. Please check the postcode and county or state, then try again.'
      : 'We could not reach PayPal just now. Your bag is saved, please try again in a minute.';
    return { kind: 'payError', values: v.values, message };
  }
}

// AMENDMENT (after the Task 8 payment fix): this supersedes the original handleReturn
// design. captureOrder now throws PayPalError when the outcome is unknown (5xx, network,
// unreadable body). Never assume unknown means paid or unpaid: leave the order pending,
// alert the shop to check manually, and tell the buyer not to pay again.
type ReturnResult =
  | { kind: 'complete'; ref: string }
  | { kind: 'review'; ref: string }
  | { kind: 'declined'; message: string }
  | { kind: 'error'; message: string };

const NOT_FOUND_MESSAGE =
  'We could not find this payment. If money left your account, email hello@sunniedesigns.com with the time you paid and we will sort it out.';
const UNCONFIRMED_MESSAGE =
  'We could not confirm your payment with PayPal just now. Please do not pay again. We will check your payment and email you within 24 hours.';
const DECLINED_MESSAGE =
  'Your payment did not go through, so nothing was charged. Your bag is saved: please try again or choose another card.';

export async function handleReturn(paypalOrderId: string | null, deps: ReturnDeps): Promise<ReturnResult> {
  if (!paypalOrderId) return { kind: 'error', message: NOT_FOUND_MESSAGE };
  const order = await deps.orders.findByPaypalId(paypalOrderId);
  if (!order) return { kind: 'error', message: NOT_FOUND_MESSAGE };
  // Idempotent: a paid or review order never captures or emails again.
  if (order.status === 'paid') return { kind: 'complete', ref: order.ref };
  if (order.status === 'review') return { kind: 'review', ref: order.ref };

  let cap;
  try {
    cap = await deps.paypal.captureOrder(paypalOrderId, order.ref);
  } catch (err) {
    const issue = err instanceof PayPalError ? err.issue ?? String(err.status) : (err as Error).message;
    try {
      await deps.mailer.send(
        deps.notifyEmail,
        buildShopEmail(order, `PAYMENT NOT CONFIRMED: PayPal did not give a clear answer for PayPal order ${paypalOrderId}. Check PayPal before shipping or refunding.`),
      );
    } catch {
      /* best effort: never let an email failure hide a payment-safety issue */
    }
    try {
      await deps.orders.recordEmail(order.ref, { customer: false, shop: true, error: `PAYPAL_UNCONFIRMED: ${issue}` });
    } catch {
      /* best effort */
    }
    return { kind: 'error', message: UNCONFIRMED_MESSAGE };
  }

  if (cap.status === 'DECLINED') {
    return { kind: 'declined', message: DECLINED_MESSAGE };
  }

  if (cap.status === 'PENDING') {
    await deps.orders.markReview(order.ref, cap.captureId, cap.reason);
    const reviewOrder = (await deps.orders.findByRef(order.ref))!;
    try {
      await deps.mailer.send(
        deps.notifyEmail,
        buildShopEmail(reviewOrder, `PAYMENT PENDING AT PAYPAL (${cap.reason}). Do not ship until PayPal shows this payment as Completed.`),
      );
    } catch {
      /* best effort */
    }
    try {
      // recordEmail overwrites email_error, so re-assert the PAYPAL_PENDING reason markReview just stored.
      await deps.orders.recordEmail(order.ref, { customer: false, shop: true, error: `PAYPAL_PENDING: ${cap.reason}` });
    } catch {
      /* best effort */
    }
    return { kind: 'review', ref: order.ref };
  }

  // COMPLETED
  await deps.orders.markPaid(order.ref, cap.captureId, cap.payerEmail);
  const paid = (await deps.orders.findByRef(order.ref))!;
  let customer = false;
  let shop = false;
  const errors: string[] = [];
  try {
    await deps.mailer.send(paid.email, buildCustomerEmail(paid));
    customer = true;
  } catch (e) {
    errors.push(`customer: ${(e as Error).message}`);
  }
  try {
    await deps.mailer.send(deps.notifyEmail, buildShopEmail(paid));
    shop = true;
  } catch (e) {
    errors.push(`shop: ${(e as Error).message}`);
  }
  try {
    await deps.orders.recordEmail(order.ref, { customer, shop, error: errors.join('; ') || undefined });
  } catch {
    /* never block the buyer on an accounting write */
  }
  return { kind: 'complete', ref: order.ref };
}
