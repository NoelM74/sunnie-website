import type { Catalog } from './catalog';
import type { BagLine } from './pricing';
import { priceBag } from './pricing';
import { validateCheckout, type CheckoutValues } from './checkout-form';
import type { OrderRow, OrdersRepo } from './orders';
import { PayPalError, type PayPalClient } from './paypal';
import { buildCustomerEmail, buildShopEmail, type Mailer } from './email';

export interface PayDeps { catalog: Catalog; orders: OrdersRepo; paypal: PayPalClient; paypalEnv: 'sandbox' | 'live'; origin: string; newRef: () => string }
export interface ReturnDeps { orders: OrdersRepo; paypal: PayPalClient; mailer: Mailer; notifyEmail: string }

type PayResult =
  | { kind: 'redirect'; location: string }
  | { kind: 'invalid'; values: CheckoutValues; errors: Record<string, string> }
  | { kind: 'empty' }
  | { kind: 'payError'; values: CheckoutValues; message: string };

const GENERIC_PAY_ERROR = 'We could not reach PayPal just now. Your bag is saved, please try again in a minute.';
const ADDRESS_ISSUE = /^(SHIPPING_ADDRESS_INVALID|POSTAL_CODE_REQUIRED|CITY_REQUIRED|INVALID_POSTAL_CODE|INVALID_COUNTRY_CODE|STATE_REQUIRED|INVALID_STATE)$|ADDRESS/;

export async function handlePay(form: FormData, bag: BagLine[], deps: PayDeps): Promise<PayResult> {
  const priced = priceBag(bag, deps.catalog);
  if (priced.lines.length === 0) return { kind: 'empty' };
  const v = validateCheckout(form);
  if (!v.ok) return { kind: 'invalid', values: v.values, errors: v.errors as Record<string, string> };
  const { email, ...address } = v.values;
  const input = { ref: deps.newRef(), email, address, lines: priced.lines, subtotalCents: priced.subtotalCents, shippingCents: priced.shippingCents, totalCents: priced.totalCents, paypalEnv: deps.paypalEnv };

  try {
    await deps.orders.insertPending(input);
  } catch (err) {
    const e = err as Error;
    console.error('insertPending failed, retrying with a new ref', e.name, e.message, input.ref);
    input.ref = deps.newRef();
    try {
      await deps.orders.insertPending(input);
    } catch (err2) {
      const e2 = err2 as Error;
      console.error('insertPending failed twice, giving up', e2.name, e2.message, input.ref);
      return { kind: 'payError', values: v.values, message: GENERIC_PAY_ERROR };
    }
  }

  try {
    const created = await deps.paypal.createOrder(input, { returnUrl: `${deps.origin}/checkout/return/`, cancelUrl: `${deps.origin}/checkout/cancel/` });
    await deps.orders.setPaypalId(input.ref, created.id);
    return { kind: 'redirect', location: created.approveUrl };
  } catch (err) {
    const e = err as Error;
    console.error('paypal create failed', e.name, e.message, input.ref);
    const issue = err instanceof PayPalError ? err.issue ?? '' : '';
    // Keep the reason on the unpaid row (status and issue code only, no buyer data) so a
    // failed checkout can be diagnosed from the database without access to the logs.
    const reason = err instanceof PayPalError ? `${err.status} ${issue}`.trim() : e.name;
    try {
      await deps.orders.recordEmail(input.ref, { customer: false, shop: false, error: `PAYPAL_CREATE_FAILED: ${reason}` });
    } catch (e2) {
      console.error('recordEmail failed (paypal create)', (e2 as Error).name, (e2 as Error).message, input.ref);
    }
    const message = ADDRESS_ISSUE.test(issue)
      ? 'PayPal could not accept this delivery address. Please check the postcode and county or state, then try again.'
      : GENERIC_PAY_ERROR;
    return { kind: 'payError', values: v.values, message };
  }
}

// AMENDMENT (after the Task 8 payment fix): this supersedes the original handleReturn
// design. captureOrder now throws PayPalError when the outcome is unknown (5xx, network,
// unreadable body). Never assume unknown means paid or unpaid: leave the order pending,
// alert the shop to check manually, and tell the buyer not to pay again.
//
// Review-fix amendment: markPaid/markReview now report whether they actually moved the
// row from 'pending' (single-writer semantics), so a concurrent duplicate return never
// re-emails or re-alerts; a storage failure after a successful PayPal capture is reported
// to the shop rather than silently discarded; and error results carry a fixed `code`
// instead of free text, so return.ts never puts attacker-influenced text in a URL that a
// page then renders.
type ReturnResult =
  | { kind: 'complete'; ref: string }
  | { kind: 'review'; ref: string }
  | { kind: 'declined'; message: string }
  | { kind: 'error'; message: string; code: 'notfound' | 'unconfirmed' };

export const RETURN_MESSAGES: Record<'notfound' | 'unconfirmed', string> = {
  notfound: 'We could not find this payment. If money left your account, email hello@sunniedesigns.com with the time you paid and we will sort it out.',
  unconfirmed: 'We could not confirm your payment with PayPal just now. Please do not pay again. We will check your payment and email you within 24 hours.',
};
const DECLINED_MESSAGE =
  'Your payment did not go through, so nothing was charged. Your bag is saved: please try again or choose another card.';

/** Best-effort shop alert + recordEmail for a captured payment that PayPal confirmed but
 *  this handler could not save (markPaid/markReview or the read after it threw). Built
 *  from the order snapshot taken before the capture, patched in memory with the status
 *  and capture id we know are now true at PayPal. */
async function reportCaptureNotSaved(
  deps: ReturnDeps,
  order: OrderRow,
  captureId: string,
  status: 'paid' | 'review',
  paypalOrderId: string,
): Promise<ReturnResult> {
  const patched: OrderRow = { ...order, status, captureId };
  try {
    await deps.mailer.send(
      deps.notifyEmail,
      buildShopEmail(
        patched,
        `PAYMENT CAPTURED BUT NOT SAVED: PayPal capture ${captureId} for PayPal order ${paypalOrderId} succeeded. The website could not record it. Record this order by hand and do not refund unless asked.`,
      ),
    );
  } catch (err) {
    const e = err as Error;
    console.error('shop alert mail failed (capture not saved)', e.name, e.message, order.ref);
  }
  return { kind: 'error', message: RETURN_MESSAGES.unconfirmed, code: 'unconfirmed' };
}

/** Opportunistic, best-effort cleanup of unpaid orders older than 90 days. Never blocks the buyer. */
async function cleanupStalePending(deps: ReturnDeps): Promise<void> {
  try {
    await deps.orders.deleteStalePending(90);
  } catch (err) {
    const e = err as Error;
    console.error('deleteStalePending failed', e.name, e.message);
  }
}

export async function handleReturn(paypalOrderId: string | null, deps: ReturnDeps): Promise<ReturnResult> {
  if (!paypalOrderId) return { kind: 'error', message: RETURN_MESSAGES.notfound, code: 'notfound' };
  const order = await deps.orders.findByPaypalId(paypalOrderId);
  if (!order) return { kind: 'error', message: RETURN_MESSAGES.notfound, code: 'notfound' };
  // Idempotent: a paid or review order never captures or emails again.
  if (order.status === 'paid') return { kind: 'complete', ref: order.ref };
  if (order.status === 'review') return { kind: 'review', ref: order.ref };

  let cap;
  try {
    cap = await deps.paypal.captureOrder(paypalOrderId, order.ref);
  } catch (err) {
    // Another request may have already captured and moved this order on while this one
    // was in flight. Re-read before alerting: an unclear outcome here is not necessarily
    // an unclear outcome overall.
    let current: OrderRow | null = null;
    try {
      current = await deps.orders.findByRef(order.ref);
    } catch {
      /* fall through and treat as still pending */
    }
    if (current?.status === 'paid') return { kind: 'complete', ref: order.ref };
    if (current?.status === 'review') return { kind: 'review', ref: order.ref };

    const issue = err instanceof PayPalError ? err.issue ?? String(err.status) : (err as Error).message;
    const base = current ?? order;
    let shop = false;
    const mailErrors: string[] = [];
    try {
      await deps.mailer.send(
        deps.notifyEmail,
        buildShopEmail(base, `PAYMENT NOT CONFIRMED: PayPal did not give a clear answer for PayPal order ${paypalOrderId}. Check PayPal before shipping or refunding.`),
      );
      shop = true;
    } catch (e) {
      const me = e as Error;
      console.error('shop alert mail failed (payment unconfirmed)', me.name, me.message, order.ref);
      mailErrors.push(`shop: ${me.message}`);
    }
    try {
      await deps.orders.recordEmail(order.ref, { customer: false, shop, error: [`PAYPAL_UNCONFIRMED: ${issue}`, ...mailErrors].join('; ') });
    } catch (err2) {
      const e2 = err2 as Error;
      console.error('recordEmail failed (payment unconfirmed)', e2.name, e2.message, order.ref);
    }
    return { kind: 'error', message: RETURN_MESSAGES.unconfirmed, code: 'unconfirmed' };
  }

  if (cap.status === 'DECLINED') {
    return { kind: 'declined', message: DECLINED_MESSAGE };
  }

  if (cap.status === 'PENDING') {
    try {
      const moved = await deps.orders.markReview(order.ref, cap.captureId, cap.reason);
      if (!moved) {
        const current = await deps.orders.findByRef(order.ref);
        return current?.status === 'paid' ? { kind: 'complete', ref: order.ref } : { kind: 'review', ref: order.ref };
      }
      const reviewOrder = await deps.orders.findByRef(order.ref);
      if (!reviewOrder) throw new Error('order vanished after markReview');
      let shop = false;
      const mailErrors: string[] = [];
      try {
        await deps.mailer.send(
          deps.notifyEmail,
          buildShopEmail(reviewOrder, `PAYMENT PENDING AT PAYPAL (${cap.reason}). Do not ship until PayPal shows this payment as Completed, then email the buyer to confirm.`),
        );
        shop = true;
      } catch (e) {
        const me = e as Error;
        console.error('shop alert mail failed (payment pending)', me.name, me.message, order.ref);
        mailErrors.push(`shop: ${me.message}`);
      }
      try {
        // recordEmail overwrites email_error, so re-assert the PAYPAL_PENDING reason
        // markReview just stored (plus any mail error) rather than losing it.
        await deps.orders.recordEmail(order.ref, { customer: false, shop, error: [`PAYPAL_PENDING: ${cap.reason}`, ...mailErrors].join('; ') });
      } catch (err2) {
        const e2 = err2 as Error;
        console.error('recordEmail failed (payment pending)', e2.name, e2.message, order.ref);
      }
      return { kind: 'review', ref: order.ref };
    } catch {
      return reportCaptureNotSaved(deps, order, cap.captureId, 'review', paypalOrderId);
    }
  }

  // COMPLETED
  try {
    const moved = await deps.orders.markPaid(order.ref, cap.captureId, cap.payerEmail);
    if (!moved) {
      const current = await deps.orders.findByRef(order.ref);
      return current?.status === 'review' ? { kind: 'review', ref: order.ref } : { kind: 'complete', ref: order.ref };
    }
    const paid = await deps.orders.findByRef(order.ref);
    if (!paid) throw new Error('order vanished after markPaid');
    let customer = false;
    let shop = false;
    const errors: string[] = [];
    try {
      await deps.mailer.send(paid.email, buildCustomerEmail(paid));
      customer = true;
    } catch (e) {
      const ce = e as Error;
      console.error('customer email failed (order paid)', ce.name, ce.message, order.ref);
      errors.push(`customer: ${ce.message}`);
    }
    try {
      await deps.mailer.send(deps.notifyEmail, buildShopEmail(paid));
      shop = true;
    } catch (e) {
      const se = e as Error;
      console.error('shop email failed (order paid)', se.name, se.message, order.ref);
      errors.push(`shop: ${se.message}`);
    }
    try {
      await deps.orders.recordEmail(order.ref, { customer, shop, error: errors.join('; ') || undefined });
    } catch (err2) {
      const e2 = err2 as Error;
      console.error('recordEmail failed (order paid)', e2.name, e2.message, order.ref);
    }
    await cleanupStalePending(deps);
    return { kind: 'complete', ref: order.ref };
  } catch {
    return reportCaptureNotSaved(deps, order, cap.captureId, 'paid', paypalOrderId);
  }
}
