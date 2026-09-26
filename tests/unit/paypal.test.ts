import { describe, expect, it } from 'vitest';
import { buildOrderPayload, paypalClient, PayPalError } from '../../src/lib/paypal';
import type { OrderInput } from '../../src/lib/orders';

const order: OrderInput = {
  ref: 'SUN-ABC123', email: 'a@b.ie', paypalEnv: 'sandbox',
  address: { name: 'Aoife Byrne', line1: '1 Main St', line2: 'Apt 2', city: 'Ennis', region: 'Clare', postcode: 'V95 X1Y2', country: 'IE' },
  lines: [
    { slug: 'frog', name: 'Frog phone crossbody', option: 'Pink', qty: 2, unitCents: 2995, lineCents: 5990, thumb: '' },
    { slug: 'coaster', name: 'Flower coaster', qty: 1, unitCents: 1695, lineCents: 1695, thumb: '' },
  ],
  subtotalCents: 7685, shippingCents: 0, totalCents: 7685,
};
const urls = { returnUrl: 'https://sunniedesigns.com/checkout/return/', cancelUrl: 'https://sunniedesigns.com/checkout/cancel/' };

describe('buildOrderPayload', () => {
  const p = buildOrderPayload(order, urls) as any;
  const unit = p.purchase_units[0];
  it('itemises lines with server prices and a matching breakdown', () => {
    expect(unit.amount).toEqual({ currency_code: 'EUR', value: '76.85', breakdown: { item_total: { currency_code: 'EUR', value: '76.85' }, shipping: { currency_code: 'EUR', value: '0.00' } } });
    expect(unit.items[0]).toEqual({ name: 'Frog phone crossbody (Pink)', quantity: '2', unit_amount: { currency_code: 'EUR', value: '29.95' }, category: 'PHYSICAL_GOODS', sku: 'frog' });
    const itemSum = unit.items.reduce((s: number, i: any) => s + Math.round(Number(i.unit_amount.value) * 100) * Number(i.quantity), 0);
    expect(itemSum).toBe(order.subtotalCents);
  });
  it('locks the typed address and sets the return flow', () => {
    expect(unit.shipping.address).toEqual({ address_line_1: '1 Main St', address_line_2: 'Apt 2', admin_area_2: 'Ennis', admin_area_1: 'Clare', postal_code: 'V95 X1Y2', country_code: 'IE' });
    expect(unit.custom_id).toBe('SUN-ABC123');
    expect(unit.invoice_id).toBe('SUN-ABC123');
    const ctx = p.payment_source.paypal.experience_context;
    expect(ctx).toMatchObject({ shipping_preference: 'SET_PROVIDED_ADDRESS', user_action: 'PAY_NOW', return_url: urls.returnUrl, cancel_url: urls.cancelUrl, brand_name: 'Sunnie Designs' });
  });
  it('omits empty optional address parts', () => {
    const q = buildOrderPayload({ ...order, address: { ...order.address, line2: '', region: '', postcode: '' } }, urls) as any;
    expect(q.purchase_units[0].shipping.address).toEqual({ address_line_1: '1 Main St', admin_area_2: 'Ennis', country_code: 'IE' });
  });
});

describe('paypalClient', () => {
  const token = { access_token: 'T' };
  const mk = (responses: Array<[number, unknown]>) => {
    const calls: { url: string; init: RequestInit }[] = [];
    const f = (async (url: string, init: RequestInit) => { calls.push({ url, init }); const [s, b] = responses.shift()!; return new Response(JSON.stringify(b), { status: s }); }) as unknown as typeof fetch;
    return { calls, client: paypalClient({ clientId: 'id', secret: 'sec', env: 'sandbox', fetch: f }) };
  };
  it('creates an order and returns the payer-action link', async () => {
    const { calls, client } = mk([[200, token], [200, { id: 'PP-1', links: [{ rel: 'payer-action', href: 'https://www.sandbox.paypal.com/checkoutnow?token=PP-1' }] }]]);
    expect(await client.createOrder(order, urls)).toEqual({ id: 'PP-1', approveUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=PP-1' });
    expect(calls[1].url).toBe('https://api-m.sandbox.paypal.com/v2/checkout/orders');
    expect((calls[1].init.headers as Record<string, string>)['PayPal-Request-Id']).toBe('create-SUN-ABC123');
  });
  it('maps capture outcomes', async () => {
    const ok = mk([[200, token], [201, { status: 'COMPLETED', payer: { email_address: 'p@x.ie' }, purchase_units: [{ payments: { captures: [{ id: 'CAP-1', status: 'COMPLETED' }] } }] }]]);
    expect(await ok.client.captureOrder('PP-1', 'SUN-ABC123')).toEqual({ status: 'COMPLETED', captureId: 'CAP-1', payerEmail: 'p@x.ie' });
    const dup = mk([[200, token], [422, { details: [{ issue: 'ORDER_ALREADY_CAPTURED' }] }]]);
    expect(await dup.client.captureOrder('PP-1', 'r')).toEqual({ status: 'ALREADY_CAPTURED' });
    const bad = mk([[200, token], [422, { details: [{ issue: 'INSTRUMENT_DECLINED' }] }]]);
    expect(await bad.client.captureOrder('PP-1', 'r')).toEqual({ status: 'FAILED', detail: 'INSTRUMENT_DECLINED' });
  });
  it('throws PayPalError with the issue on create failure', async () => {
    const { client } = mk([[200, token], [422, { details: [{ issue: 'SHIPPING_ADDRESS_INVALID' }] }]]);
    await expect(client.createOrder(order, urls)).rejects.toMatchObject({ name: 'PayPalError', status: 422, issue: 'SHIPPING_ADDRESS_INVALID' });
    expect(PayPalError).toBeDefined();
  });
});
