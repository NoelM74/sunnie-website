import { describe, expect, it } from 'vitest';
import { buildCustomerEmail, buildShopEmail, resendMailer } from '../../src/lib/email';
import type { OrderRow } from '../../src/lib/orders';

const row: OrderRow = {
  ref: 'SUN-ABC123', email: 'a@b.ie', paypalEnv: 'live',
  address: { name: 'Aoife <script>', line1: '1 Main St', line2: '', city: 'Ennis', region: 'Clare', postcode: 'V95 X1Y2', country: 'IE' },
  lines: [{ slug: 'frog', name: 'Frog phone crossbody', option: 'Pink', qty: 2, unitCents: 2995, lineCents: 5990, thumb: '' }],
  subtotalCents: 5990, shippingCents: 0, totalCents: 5990,
  status: 'paid', paypalOrderId: 'PP-1', captureId: 'CAP-1', createdAt: '2026-10-01T10:00:00Z', paidAt: '2026-10-01T10:01:00Z',
  customerEmailed: false, shopEmailed: false, emailError: null,
};

describe('customer email', () => {
  const e = buildCustomerEmail(row);
  it('has the reference, items, totals and dispatch promise', () => {
    expect(e.subject).toBe('Your Sunnie Designs order SUN-ABC123');
    for (const s of ['SUN-ABC123', '2 × Frog phone crossbody (Pink)', '€59.90', 'Free', '3–5 days', '30 days', 'Springfield Tectop Limited', 'CRO 571256']) {
      expect(e.text).toContain(s);
      expect(e.html).toContain(s.replace('&', '&amp;'));
    }
  });
  it('escapes user input in HTML', () => {
    expect(e.html).not.toContain('<script>');
    expect(e.html).toContain('Aoife &lt;script&gt;');
  });
  it('has no em dashes, exclamation marks or emoji', () => {
    const htmlText = e.html.replace(/<!doctype[^>]*>/i, '').replace(/<[^>]+>/g, '');
    for (const field of [e.subject, e.text, htmlText]) {
      expect(field).not.toMatch(/—/);
      expect(field).not.toMatch(/!/);
    }
  });
});

describe('shop email', () => {
  it('gives a making list and the PayPal references', () => {
    const e = buildShopEmail(row);
    expect(e.subject).toBe('New order SUN-ABC123 · €59.90');
    for (const s of ['MAKE:', '2 × Frog phone crossbody (Pink)', 'a@b.ie', 'Ireland', 'PP-1', 'CAP-1']) expect(e.text).toContain(s);
  });

  it('prefixes the subject and body with a notice when given one', () => {
    const notice = 'PAYMENT PENDING AT PAYPAL (PENDING_REVIEW). Do not ship until PayPal shows this payment as Completed.';
    const e = buildShopEmail(row, notice);
    expect(e.subject).toBe('ACTION NEEDED: New order SUN-ABC123 · €59.90');
    expect(e.text.startsWith(notice)).toBe(true);
    expect(e.html).toContain(notice);
  });

  it('has no notice prefix when none is given', () => {
    const e = buildShopEmail(row);
    expect(e.subject).not.toContain('ACTION NEEDED');
  });
});

describe('resendMailer', () => {
  it('posts to Resend and throws on failure', async () => {
    const calls: any[] = [];
    const ok = resendMailer({ apiKey: 'k', from: 'Sunnie <orders@sunniedesigns.com>', replyTo: 'hello@sunniedesigns.com', fetch: (async (u: string, i: RequestInit) => { calls.push([u, JSON.parse(String(i.body))]); return new Response('{}', { status: 200 }); }) as any });
    await ok.send('a@b.ie', { subject: 's', html: 'h', text: 't' });
    expect(calls[0][0]).toBe('https://api.resend.com/emails');
    expect(calls[0][1]).toMatchObject({ to: ['a@b.ie'], reply_to: 'hello@sunniedesigns.com', subject: 's' });
    const bad = resendMailer({ apiKey: 'k', from: 'f', replyTo: 'r', fetch: (async () => new Response('{}', { status: 500 })) as any });
    await expect(bad.send('a@b.ie', { subject: 's', html: 'h', text: 't' })).rejects.toThrow();
  });
});
