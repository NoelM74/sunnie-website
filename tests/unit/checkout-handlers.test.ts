import { describe, expect, it, vi } from 'vitest';
import { handlePay, handleReturn, RETURN_MESSAGES } from '../../src/lib/checkout-handlers';
import { memoryOrders } from '../../src/lib/orders';
import type { OrdersRepo } from '../../src/lib/orders';
import type { Catalog } from '../../src/lib/catalog';
import type { PayPalClient, CaptureResult } from '../../src/lib/paypal';
import { PayPalError } from '../../src/lib/paypal';
import type { Mailer, Email } from '../../src/lib/email';

const catalog: Catalog = { frog: { slug: 'frog', name: 'Frog', priceCents: 2995, inStock: true, option: { name: 'Colour', values: ['Pink'] }, thumb: '', maker: 'Hui', featured: 1 } };
const fd = (o: Record<string, string>) => { const f = new FormData(); for (const [k, v] of Object.entries(o)) f.set(k, v); return f; };
const address = { email: 'a@b.ie', name: 'Aoife', line1: '1 Main St', line2: '', city: 'Ennis', region: '', postcode: '', country: 'IE' };
const bag = [{ slug: 'frog', option: 'Pink', qty: 1 }];

function fakePaypal(capture: CaptureResult | Error = { status: 'COMPLETED', captureId: 'CAP-1', payerEmail: 'p@x.ie' }) {
  const created: any[] = [];
  const captured: string[] = [];
  const pp: PayPalClient = {
    async createOrder(o, urls) { created.push({ o, urls }); return { id: 'PP-1', approveUrl: 'https://paypal.test/approve?token=PP-1' }; },
    async captureOrder(id) {
      captured.push(id);
      if (capture instanceof Error) throw capture;
      return capture;
    },
    async getOrder() { throw new Error('not used in these tests'); },
  };
  return { pp, created, captured };
}
const mailer = (fail = false) => {
  const sent: { to: string; email: Email }[] = [];
  const m: Mailer = { async send(to, email) { if (fail) throw new Error('down'); sent.push({ to, email }); } };
  return { m, sent };
};

describe('handlePay', () => {
  it('stores a pending order priced on the server and redirects to PayPal', async () => {
    const orders = memoryOrders();
    const { pp, created } = fakePaypal();
    const r = await handlePay(fd(address), bag, { catalog, orders, paypal: pp, paypalEnv: 'sandbox', origin: 'https://sunniedesigns.com', newRef: () => 'SUN-TEST01' });
    expect(r).toEqual({ kind: 'redirect', location: 'https://paypal.test/approve?token=PP-1' });
    expect(created[0].o).toMatchObject({ ref: 'SUN-TEST01', subtotalCents: 2995, shippingCents: 500, totalCents: 3495 });
    expect(created[0].urls).toEqual({ returnUrl: 'https://sunniedesigns.com/checkout/return/', cancelUrl: 'https://sunniedesigns.com/checkout/cancel/' });
    expect(await orders.findByPaypalId('PP-1')).toMatchObject({ ref: 'SUN-TEST01', status: 'pending' });
  });
  it('returns field errors without calling PayPal', async () => {
    const { pp, created } = fakePaypal();
    const r = await handlePay(fd({ ...address, email: 'bad' }), bag, { catalog, orders: memoryOrders(), paypal: pp, paypalEnv: 'sandbox', origin: 'https://x', newRef: () => 'SUN-X' });
    expect(r.kind).toBe('invalid');
    expect(created).toHaveLength(0);
  });
  it('refuses an empty bag', async () => {
    const r = await handlePay(fd(address), [], { catalog, orders: memoryOrders(), paypal: fakePaypal().pp, paypalEnv: 'sandbox', origin: 'https://x', newRef: () => 'SUN-X' });
    expect(r).toEqual({ kind: 'empty' });
  });
  it('turns an address rejection into a friendly message', async () => {
    const pp: PayPalClient = {
      async createOrder() { throw new PayPalError(422, 'SHIPPING_ADDRESS_INVALID'); },
      async captureOrder() { return { status: 'DECLINED', detail: '' }; },
      async getOrder() { throw new Error('not used'); },
    };
    const r = await handlePay(fd(address), bag, { catalog, orders: memoryOrders(), paypal: pp, paypalEnv: 'sandbox', origin: 'https://x', newRef: () => 'SUN-X' });
    expect(r.kind).toBe('payError');
    if (r.kind === 'payError') expect(r.message).toMatch(/address/i);
  });
  it('does not misclassify an unrelated issue that merely contains "STATE" as an address problem', async () => {
    const pp: PayPalClient = {
      async createOrder() { throw new PayPalError(500, 'RANDOM_STATE_ERROR'); },
      async captureOrder() { return { status: 'DECLINED', detail: '' }; },
      async getOrder() { throw new Error('not used'); },
    };
    const r = await handlePay(fd(address), bag, { catalog, orders: memoryOrders(), paypal: pp, paypalEnv: 'sandbox', origin: 'https://x', newRef: () => 'SUN-X2' });
    expect(r.kind).toBe('payError');
    if (r.kind === 'payError') expect(r.message).toMatch(/could not reach PayPal/i);
  });
  it('logs only the status and issue for a PayPalError on create, never the body', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const pp: PayPalClient = {
      async createOrder() { throw new PayPalError(422, 'SHIPPING_ADDRESS_INVALID'); },
      async captureOrder() { return { status: 'DECLINED', detail: '' }; },
      async getOrder() { throw new Error('not used'); },
    };
    await handlePay(fd(address), bag, { catalog, orders: memoryOrders(), paypal: pp, paypalEnv: 'sandbox', origin: 'https://x', newRef: () => 'SUN-LOG01' });
    expect(errSpy).toHaveBeenCalledWith('paypal create failed', 422, 'SHIPPING_ADDRESS_INVALID');
    errSpy.mockRestore();
  });
  it('leaves the pending row in place when createOrder fails', async () => {
    const orders = memoryOrders();
    const pp: PayPalClient = {
      async createOrder() { throw new PayPalError(500, 'SERVER_ERROR'); },
      async captureOrder() { return { status: 'DECLINED', detail: '' }; },
      async getOrder() { throw new Error('not used'); },
    };
    const r = await handlePay(fd(address), bag, { catalog, orders, paypal: pp, paypalEnv: 'sandbox', origin: 'https://x', newRef: () => 'SUN-SURVIVE' });
    expect(r.kind).toBe('payError');
    expect(await orders.findByRef('SUN-SURVIVE')).toMatchObject({ status: 'pending' });
  });
  it('retries the pending insert once on a ref collision, then succeeds', async () => {
    const orders = memoryOrders();
    await orders.insertPending({ ref: 'SUN-DUP01', email: 'x@y.ie', address: { ...address }, lines: [], subtotalCents: 0, shippingCents: 500, totalCents: 500, paypalEnv: 'sandbox' });
    const refs = ['SUN-DUP01', 'SUN-OK002'];
    let call = 0;
    const { pp } = fakePaypal();
    const r = await handlePay(fd(address), bag, { catalog, orders, paypal: pp, paypalEnv: 'sandbox', origin: 'https://x', newRef: () => refs[call++] });
    expect(r.kind).toBe('redirect');
    expect(await orders.findByRef('SUN-OK002')).toMatchObject({ status: 'pending' });
  });
  it('returns a generic payError when both the original and retried ref collide', async () => {
    const orders = memoryOrders();
    await orders.insertPending({ ref: 'SUN-DUP01', email: 'x@y.ie', address: { ...address }, lines: [], subtotalCents: 0, shippingCents: 500, totalCents: 500, paypalEnv: 'sandbox' });
    await orders.insertPending({ ref: 'SUN-DUP02', email: 'x@y.ie', address: { ...address }, lines: [], subtotalCents: 0, shippingCents: 500, totalCents: 500, paypalEnv: 'sandbox' });
    const refs = ['SUN-DUP01', 'SUN-DUP02'];
    let call = 0;
    const { pp, created } = fakePaypal();
    const r = await handlePay(fd(address), bag, { catalog, orders, paypal: pp, paypalEnv: 'sandbox', origin: 'https://x', newRef: () => refs[call++] });
    expect(r.kind).toBe('payError');
    if (r.kind === 'payError') expect(r.message).toMatch(/could not reach PayPal|try again/i);
    expect(created).toHaveLength(0);
  });
});

describe('handleReturn', () => {
  async function pending() {
    const orders = memoryOrders();
    await orders.insertPending({ ref: 'SUN-TEST01', email: 'a@b.ie', address: { ...address }, lines: [{ slug: 'frog', name: 'Frog', option: 'Pink', qty: 1, unitCents: 2995, lineCents: 2995, thumb: '' }], subtotalCents: 2995, shippingCents: 500, totalCents: 3495, paypalEnv: 'sandbox' });
    await orders.setPaypalId('SUN-TEST01', 'PP-1');
    return orders;
  }

  it('captures, marks paid and emails buyer then shop', async () => {
    const orders = await pending();
    const { pp, captured } = fakePaypal();
    const { m, sent } = mailer();
    expect(await handleReturn('PP-1', { orders, paypal: pp, mailer: m, notifyEmail: 'hello@sunniedesigns.com' })).toEqual({ kind: 'complete', ref: 'SUN-TEST01' });
    expect(captured).toEqual(['PP-1']);
    expect(await orders.findByRef('SUN-TEST01')).toMatchObject({ status: 'paid', captureId: 'CAP-1', customerEmailed: true, shopEmailed: true });
    expect(sent.map((s) => s.to)).toEqual(['a@b.ie', 'hello@sunniedesigns.com']);
  });

  it('is idempotent: a second return after paid does not capture or email again', async () => {
    const orders = await pending();
    const first = fakePaypal();
    const { m, sent } = mailer();
    await handleReturn('PP-1', { orders, paypal: first.pp, mailer: m, notifyEmail: 'n@x' });
    const second = fakePaypal();
    expect(await handleReturn('PP-1', { orders, paypal: second.pp, mailer: m, notifyEmail: 'n@x' })).toEqual({ kind: 'complete', ref: 'SUN-TEST01' });
    expect(second.captured).toHaveLength(0);
    expect(sent).toHaveLength(2);
  });

  it('still completes when email fails, recording the error', async () => {
    const orders = await pending();
    const { m } = mailer(true);
    expect((await handleReturn('PP-1', { orders, paypal: fakePaypal().pp, mailer: m, notifyEmail: 'n@x' })).kind).toBe('complete');
    expect(await orders.findByRef('SUN-TEST01')).toMatchObject({ status: 'paid', customerEmailed: false, emailError: expect.stringContaining('down') });
  });

  it('treats PENDING as review: only the shop is emailed with an ACTION NEEDED subject, and stays idempotent', async () => {
    const orders = await pending();
    const first = fakePaypal({ status: 'PENDING', captureId: 'CAP-2', reason: 'ECHECK' });
    const { m, sent } = mailer();
    const r = await handleReturn('PP-1', { orders, paypal: first.pp, mailer: m, notifyEmail: 'hello@sunniedesigns.com' });
    expect(r).toEqual({ kind: 'review', ref: 'SUN-TEST01' });
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe('hello@sunniedesigns.com');
    expect(sent[0].email.subject).toMatch(/^ACTION NEEDED:/);
    const row = await orders.findByRef('SUN-TEST01');
    expect(row).toMatchObject({ status: 'review', captureId: 'CAP-2', customerEmailed: false, shopEmailed: true });
    expect(row?.emailError).toMatch(/^PAYPAL_PENDING:/);

    const second = fakePaypal({ status: 'PENDING', captureId: 'CAP-3', reason: 'ECHECK' });
    const r2 = await handleReturn('PP-1', { orders, paypal: second.pp, mailer: m, notifyEmail: 'hello@sunniedesigns.com' });
    expect(r2).toEqual({ kind: 'review', ref: 'SUN-TEST01' });
    expect(second.captured).toHaveLength(0);
    expect(sent).toHaveLength(1);
  });

  it('records a truthful shopEmailed:false (with the mail error) when the PENDING alert mail fails', async () => {
    const orders = await pending();
    const { m } = mailer(true);
    const r = await handleReturn('PP-1', { orders, paypal: fakePaypal({ status: 'PENDING', captureId: 'CAP-2', reason: 'ECHECK' }).pp, mailer: m, notifyEmail: 'hello@sunniedesigns.com' });
    expect(r).toEqual({ kind: 'review', ref: 'SUN-TEST01' });
    const row = await orders.findByRef('SUN-TEST01');
    expect(row).toMatchObject({ status: 'review', shopEmailed: false });
    expect(row?.emailError).toMatch(/^PAYPAL_PENDING:/);
    expect(row?.emailError).toMatch(/down/);
  });

  it('reports a decline and leaves the order pending with no emails sent', async () => {
    const orders = await pending();
    const { m, sent } = mailer();
    const r = await handleReturn('PP-1', { orders, paypal: fakePaypal({ status: 'DECLINED', detail: 'INSTRUMENT_DECLINED' }).pp, mailer: m, notifyEmail: 'n@x' });
    expect(r.kind).toBe('declined');
    if (r.kind === 'declined') expect(r.message).toMatch(/did not go through/i);
    expect((await orders.findByRef('SUN-TEST01'))?.status).toBe('pending');
    expect(sent).toHaveLength(0);
  });

  it('on an unclear PayPal outcome, tells the buyer not to pay again, alerts the shop, leaves the order pending, and records the stored error', async () => {
    const orders = await pending();
    const { m, sent } = mailer();
    const r = await handleReturn('PP-1', { orders, paypal: fakePaypal(new PayPalError(503, 'NETWORK')).pp, mailer: m, notifyEmail: 'hello@sunniedesigns.com' });
    expect(r.kind).toBe('error');
    if (r.kind === 'error') { expect(r.message).toMatch(/do not pay again/i); expect(r.code).toBe('unconfirmed'); }
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe('hello@sunniedesigns.com');
    expect(sent[0].email.subject).toMatch(/^ACTION NEEDED:/);
    const row = await orders.findByRef('SUN-TEST01');
    expect(row?.status).toBe('pending');
    expect(row?.emailError).toMatch(/^PAYPAL_UNCONFIRMED:/);
  });

  it('records a truthful shopEmailed:false (with the mail error) when the unconfirmed alert mail fails', async () => {
    const orders = await pending();
    const { m } = mailer(true);
    const r = await handleReturn('PP-1', { orders, paypal: fakePaypal(new PayPalError(503, 'NETWORK')).pp, mailer: m, notifyEmail: 'hello@sunniedesigns.com' });
    expect(r.kind).toBe('error');
    const row = await orders.findByRef('SUN-TEST01');
    expect(row).toMatchObject({ status: 'pending', shopEmailed: false });
    expect(row?.emailError).toMatch(/^PAYPAL_UNCONFIRMED:/);
    expect(row?.emailError).toMatch(/down/);
  });

  it('rejects unknown or missing tokens with a notfound code', async () => {
    const orders = await pending();
    const missing = await handleReturn(null, { orders, paypal: fakePaypal().pp, mailer: mailer().m, notifyEmail: 'n@x' });
    expect(missing).toMatchObject({ kind: 'error', code: 'notfound' });
    const unknown = await handleReturn('PP-404', { orders, paypal: fakePaypal().pp, mailer: mailer().m, notifyEmail: 'n@x' });
    expect(unknown).toMatchObject({ kind: 'error', code: 'notfound' });
  });

  it('RETURN_MESSAGES has fixed copy for both error codes', () => {
    expect(Object.keys(RETURN_MESSAGES).sort()).toEqual(['notfound', 'unconfirmed']);
    expect(RETURN_MESSAGES.notfound.length).toBeGreaterThan(0);
    expect(RETURN_MESSAGES.unconfirmed).toMatch(/do not pay again/i);
  });

  it('a concurrent return that loses the capture race does not email or capture again', async () => {
    const orders = await pending();
    const staleSnapshot = (await orders.findByPaypalId('PP-1'))!;
    const { m, sent } = mailer();
    // First request wins: captures and emails normally.
    await handleReturn('PP-1', { orders, paypal: fakePaypal().pp, mailer: m, notifyEmail: 'hello@sunniedesigns.com' });
    expect(sent).toHaveLength(2);
    // Second request "sees" a stale pending snapshot (as a racing read might), but all
    // writes still land on the real repo, so markPaid must report it lost the race.
    const racedOrders: OrdersRepo = { ...orders, findByPaypalId: async () => staleSnapshot };
    const second = fakePaypal();
    const r = await handleReturn('PP-1', { orders: racedOrders, paypal: second.pp, mailer: m, notifyEmail: 'hello@sunniedesigns.com' });
    expect(r).toEqual({ kind: 'complete', ref: 'SUN-TEST01' });
    expect(sent).toHaveLength(2);
  });

  it('a thrown capture error on an order already moved to paid (raced) returns complete with no alert email', async () => {
    const orders = await pending();
    const staleSnapshot = (await orders.findByPaypalId('PP-1'))!;
    await handleReturn('PP-1', { orders, paypal: fakePaypal().pp, mailer: mailer().m, notifyEmail: 'hello@sunniedesigns.com' });
    expect((await orders.findByRef('SUN-TEST01'))?.status).toBe('paid');
    const racedOrders: OrdersRepo = { ...orders, findByPaypalId: async () => staleSnapshot };
    const { m, sent } = mailer();
    const r = await handleReturn('PP-1', { orders: racedOrders, paypal: fakePaypal(new PayPalError(503, 'NETWORK')).pp, mailer: m, notifyEmail: 'hello@sunniedesigns.com' });
    expect(r).toEqual({ kind: 'complete', ref: 'SUN-TEST01' });
    expect(sent).toHaveLength(0);
  });

  it('reports a storage failure after a successful capture instead of silently losing the order', async () => {
    const orders = await pending();
    const brokenOrders: OrdersRepo = {
      ...orders,
      async markPaid() { throw new Error('D1 down'); },
    };
    const { m, sent } = mailer();
    const r = await handleReturn('PP-1', { orders: brokenOrders, paypal: fakePaypal().pp, mailer: m, notifyEmail: 'hello@sunniedesigns.com' });
    expect(r.kind).toBe('error');
    if (r.kind === 'error') { expect(r.message).toMatch(/do not pay again/i); expect(r.code).toBe('unconfirmed'); }
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe('hello@sunniedesigns.com');
    expect(sent[0].email.subject).toMatch(/^ACTION NEEDED:/);
    expect(sent[0].email.text).toMatch(/CAPTURED BUT NOT SAVED/);
    expect(sent[0].email.text).toMatch(/CAP-1/);
  });

  it('reports a storage failure after a PENDING capture too', async () => {
    const orders = await pending();
    const brokenOrders: OrdersRepo = {
      ...orders,
      async markReview() { throw new Error('D1 down'); },
    };
    const { m, sent } = mailer();
    const r = await handleReturn('PP-1', { orders: brokenOrders, paypal: fakePaypal({ status: 'PENDING', captureId: 'CAP-2', reason: 'ECHECK' }).pp, mailer: m, notifyEmail: 'hello@sunniedesigns.com' });
    expect(r.kind).toBe('error');
    if (r.kind === 'error') expect(r.message).toMatch(/do not pay again/i);
    expect(sent).toHaveLength(1);
    expect(sent[0].email.subject).toMatch(/^ACTION NEEDED:/);
    expect(sent[0].email.text).toMatch(/CAPTURED BUT NOT SAVED/);
  });
});
