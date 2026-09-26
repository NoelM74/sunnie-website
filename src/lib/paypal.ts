import { centsToAmount } from './money';
import type { OrderInput } from './orders';

const API = { sandbox: 'https://api-m.sandbox.paypal.com', live: 'https://api-m.paypal.com' } as const;
const eur = (cents: number) => ({ currency_code: 'EUR', value: centsToAmount(cents) });

export class PayPalError extends Error {
  constructor(public status: number, public issue?: string) { super(`PayPal ${status}${issue ? ` ${issue}` : ''}`); this.name = 'PayPalError'; }
}

export type CaptureResult = { status: 'COMPLETED'; captureId: string; payerEmail?: string } | { status: 'ALREADY_CAPTURED' } | { status: 'FAILED'; detail: string };

export interface PayPalClient {
  createOrder(o: OrderInput, urls: { returnUrl: string; cancelUrl: string }): Promise<{ id: string; approveUrl: string }>;
  captureOrder(id: string, requestId: string): Promise<CaptureResult>;
}

export function buildOrderPayload(o: OrderInput, urls: { returnUrl: string; cancelUrl: string }) {
  const a = o.address;
  const address: Record<string, string> = { address_line_1: a.line1.slice(0, 300) };
  if (a.line2) address.address_line_2 = a.line2.slice(0, 300);
  address.admin_area_2 = a.city.slice(0, 120);
  if (a.region) address.admin_area_1 = a.region.slice(0, 300);
  if (a.postcode) address.postal_code = a.postcode.slice(0, 60);
  address.country_code = a.country;
  return {
    intent: 'CAPTURE',
    purchase_units: [{
      reference_id: o.ref,
      custom_id: o.ref,
      invoice_id: o.ref,
      description: `Sunnie Designs order ${o.ref}`,
      amount: { ...eur(o.totalCents), breakdown: { item_total: eur(o.subtotalCents), shipping: eur(o.shippingCents) } },
      items: o.lines.map((l) => ({
        name: `${l.name}${l.option ? ` (${l.option})` : ''}`.slice(0, 127),
        quantity: String(l.qty),
        unit_amount: eur(l.unitCents),
        category: 'PHYSICAL_GOODS',
        sku: l.slug.slice(0, 127),
      })),
      shipping: { name: { full_name: a.name.slice(0, 300) }, address },
    }],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: 'Sunnie Designs',
          shipping_preference: 'SET_PROVIDED_ADDRESS',
          user_action: 'PAY_NOW',
          landing_page: 'NO_PREFERENCE',
          return_url: urls.returnUrl,
          cancel_url: urls.cancelUrl,
        },
      },
    },
  };
}

export function paypalClient(cfg: { clientId: string; secret: string; env: 'sandbox' | 'live'; fetch?: typeof fetch }): PayPalClient {
  const base = API[cfg.env];
  const f = cfg.fetch ?? fetch;
  async function token(): Promise<string> {
    const res = await f(`${base}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: { Authorization: `Basic ${btoa(`${cfg.clientId}:${cfg.secret}`)}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    if (!res.ok) throw new PayPalError(res.status, 'AUTH_FAILED');
    return ((await res.json()) as { access_token: string }).access_token;
  }
  const issueOf = (b: any): string | undefined => b?.details?.[0]?.issue ?? b?.name;
  return {
    async createOrder(o, urls) {
      const res = await f(`${base}/v2/checkout/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await token()}`, 'PayPal-Request-Id': `create-${o.ref}` },
        body: JSON.stringify(buildOrderPayload(o, urls)),
      });
      const body: any = await res.json().catch(() => ({}));
      if (!res.ok) throw new PayPalError(res.status, issueOf(body));
      const link = (body.links ?? []).find((l: any) => l.rel === 'payer-action' || l.rel === 'approve');
      if (!body.id || !link) throw new PayPalError(502, 'NO_APPROVE_LINK');
      return { id: body.id, approveUrl: link.href };
    },
    async captureOrder(id, requestId) {
      const res = await f(`${base}/v2/checkout/orders/${encodeURIComponent(id)}/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await token()}`, 'PayPal-Request-Id': `capture-${requestId}` },
      });
      const body: any = await res.json().catch(() => ({}));
      if (res.ok && body.status === 'COMPLETED') {
        const cap = body.purchase_units?.[0]?.payments?.captures?.[0];
        return { status: 'COMPLETED', captureId: String(cap?.id ?? ''), payerEmail: body.payer?.email_address };
      }
      const issue = issueOf(body) ?? `HTTP_${res.status}`;
      if (issue === 'ORDER_ALREADY_CAPTURED') return { status: 'ALREADY_CAPTURED' };
      return { status: 'FAILED', detail: issue };
    },
  };
}
