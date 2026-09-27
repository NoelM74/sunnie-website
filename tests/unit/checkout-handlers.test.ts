import { describe, expect, it } from 'vitest';
import { handlePay, handleReturn } from '../../src/lib/checkout-handlers';
import { memoryOrders } from '../../src/lib/orders';
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

  it('reports a decline and leaves the order pending with no emails sent', async () => {
    const orders = await pending();
    const { m, sent } = mailer();
    const r = await handleReturn('PP-1', { orders, paypal: fakePaypal({ status: 'DECLINED', detail: 'INSTRUMENT_DECLINED' }).pp, mailer: m, notifyEmail: 'n@x' });
    expect(r.kind).toBe('declined');
    if (r.kind === 'declined') expect(r.message).toMatch(/did not go through/i);
    expect((await orders.findByRef('SUN-TEST01'))?.status).toBe('pending');
    expect(sent).toHaveLength(0);
  });

  it('on an unclear PayPal outcome, tells the buyer not to pay again, alerts the shop, and leaves the order pending', async () => {
    const orders = await pending();
    const { m, sent } = mailer();
    const r = await handleReturn('PP-1', { orders, paypal: fakePaypal(new PayPalError(503, 'NETWORK')).pp, mailer: m, notifyEmail: 'hello@sunniedesigns.com' });
    expect(r.kind).toBe('error');
    if (r.kind === 'error') expect(r.message).toMatch(/do not pay again/i);
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe('hello@sunniedesigns.com');
    expect(sent[0].email.subject).toMatch(/^ACTION NEEDED:/);
    expect((await orders.findByRef('SUN-TEST01'))?.status).toBe('pending');
  });

  it('rejects unknown or missing tokens', async () => {
    const orders = await pending();
    expect((await handleReturn(null, { orders, paypal: fakePaypal().pp, mailer: mailer().m, notifyEmail: 'n@x' })).kind).toBe('error');
    expect((await handleReturn('PP-404', { orders, paypal: fakePaypal().pp, mailer: mailer().m, notifyEmail: 'n@x' })).kind).toBe('error');
  });
});
