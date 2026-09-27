import type { OrderRow } from './orders';
import { formatPrice } from './products';
import { countryName } from './checkout-form';
import { site } from '../data/site';

export interface Email { subject: string; html: string; text: string }
export interface Mailer { send(to: string, email: Email): Promise<void> }

const euro = (c: number) => formatPrice(c / 100);
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const lineText = (o: OrderRow) =>
  o.lines.map((l) => `${l.qty} × ${l.name}${l.option ? ` (${l.option})` : ''}  ${euro(l.lineCents)}`);
const addressLines = (o: OrderRow) =>
  [o.address.name, o.address.line1, o.address.line2, o.address.city, o.address.region, o.address.postcode, countryName(o.address.country)].filter(
    Boolean,
  );
const COMPANY =
  'Springfield Tectop Limited, trading as Sunnie Designs. CRO 571256. Registered office: Clareview Car Sales, Ennis Road, Co. Limerick, V94 EA3A.';
const totals = (o: OrderRow) => [
  `Subtotal: ${euro(o.subtotalCents)}`,
  `Shipping: ${o.shippingCents === 0 ? 'Free' : euro(o.shippingCents)}`,
  `Total paid: ${euro(o.totalCents)}`,
];

const wrap = (inner: string) =>
  `<!doctype html><html><body style="margin:0;background:#FBF6EE;color:#4A3222;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6"><div style="max-width:560px;margin:0 auto;padding:24px">${inner}<p style="font-size:13px;color:#7A6855;border-top:1px solid #E5D5B8;padding-top:12px;margin-top:24px">${esc(COMPANY)}</p></div></body></html>`;
const list = (items: string[]) => `<p>${items.map(esc).join('<br>')}</p>`;

export function buildCustomerEmail(o: OrderRow): Email {
  const subject = `Your Sunnie Designs order ${o.ref}`;
  const intro = `Thank you for your order. We make each piece by hand, and your parcel ships within ${site.shipsIn} with tracking.`;
  const returns = `You can return an item within 30 days of delivery. Email ${site.email.hello} to start a return. You pay the return postage, and we refund the item price and the original shipping within 14 days of receiving it back, or of you sending us proof of postage if that comes first.`;
  const text = [
    subject,
    '',
    intro,
    '',
    `Order: ${o.ref}`,
    '',
    ...lineText(o),
    '',
    ...totals(o),
    '',
    'Delivering to:',
    ...addressLines(o),
    '',
    returns,
    '',
    `Questions: ${site.email.hello}`,
    '',
    COMPANY,
  ].join('\n');
  const html = wrap(
    `<h1 style="font-family:Georgia,serif;color:#B04A24;font-weight:500">Thank you for your order</h1>` +
      `<p>${esc(intro)}</p><p><strong>Order ${esc(o.ref)}</strong></p>` +
      list(lineText(o)) +
      list(totals(o)) +
      `<p><strong>Delivering to</strong><br>${addressLines(o).map(esc).join('<br>')}</p><p>${esc(returns)}</p>` +
      `<p>Questions: <a href="mailto:${site.email.hello}" style="color:#9C3F1D">${site.email.hello}</a></p>`,
  );
  return { subject, html, text };
}

export function buildShopEmail(o: OrderRow, notice?: string): Email {
  const subject = `${notice ? 'ACTION NEEDED: ' : ''}New order ${o.ref} · ${euro(o.totalCents)}`;
  const body = [
    'MAKE:',
    ...lineText(o),
    '',
    ...totals(o),
    '',
    'Ship to:',
    ...addressLines(o),
    '',
    `Buyer email: ${o.email}`,
    `PayPal order: ${o.paypalOrderId ?? '-'}`,
    `PayPal capture: ${o.captureId ?? '-'}`,
    `Environment: ${o.paypalEnv}`,
    `Placed: ${o.paidAt ?? o.createdAt}`,
  ];
  const text = (notice ? [notice, ''] : []).concat(subject, '', body).join('\n');
  const html = wrap(
    (notice ? `<p><strong>${esc(notice)}</strong></p>` : '') +
      `<pre style="font-family:Menlo,Consolas,monospace;font-size:14px;white-space:pre-wrap">${esc([subject, '', ...body].join('\n'))}</pre>`,
  );
  return { subject, html, text };
}

export function resendMailer(cfg: { apiKey: string; from: string; replyTo: string; fetch?: typeof fetch }): Mailer {
  const f = cfg.fetch ?? fetch;
  return {
    async send(to, email) {
      const res = await f('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${cfg.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: cfg.from, to: [to], reply_to: cfg.replyTo, subject: email.subject, html: email.html, text: email.text }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}`);
    },
  };
}
