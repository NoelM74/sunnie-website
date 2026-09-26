import { centsToAmount } from './money';
import type { OrderInput } from './orders';

const API = { sandbox: 'https://api-m.sandbox.paypal.com', live: 'https://api-m.paypal.com' } as const;
const eur = (cents: number) => ({ currency_code: 'EUR', value: centsToAmount(cents) });

export class PayPalError extends Error {
  constructor(public status: number, public issue?: string) { super(`PayPal ${status}${issue ? ` ${issue}` : ''}`); this.name = 'PayPalError'; }
}

export type CaptureResult =
  | { status: 'COMPLETED'; captureId: string; payerEmail?: string }
  | { status: 'PENDING'; captureId: string; reason: string }
  | { status: 'DECLINED'; detail: string };

const DEFINITE_DECLINES = ['INSTRUMENT_DECLINED', 'TRANSACTION_REFUSED', 'PAYER_ACTION_REQUIRED', 'ORDER_NOT_APPROVED', 'PAYER_CANNOT_PAY', 'MAX_NUMBER_OF_PAYMENT_ATTEMPTS_EXCEEDED'];

export interface PayPalClient {
  createOrder(o: OrderInput, urls: { returnUrl: string; cancelUrl: string }): Promise<{ id: string; approveUrl: string }>;
  captureOrder(id: string, requestId: string): Promise<CaptureResult>;
  getOrder(id: string): Promise<CaptureResult | { status: 'NOT_CAPTURED' }>;
}

function assertConsistentTotals(o: OrderInput) {
  const allInts = [o.subtotalCents, o.shippingCents, o.totalCents, ...o.lines.flatMap((l) => [l.unitCents, l.lineCents, l.qty])]
    .every((n) => Number.isInteger(n));
  const lineSum = o.lines.reduce((s, l) => s + l.unitCents * l.qty, 0);
  const linesMatch = o.lines.every((l) => l.lineCents === l.unitCents * l.qty);
  const ok = allInts && lineSum === o.subtotalCents && linesMatch && o.subtotalCents + o.shippingCents === o.totalCents;
  if (!ok) throw new Error('Order totals are inconsistent');
}

export function buildOrderPayload(o: OrderInput, urls: { returnUrl: string; cancelUrl: string }) {
  assertConsistentTotals(o);
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
  // Cached per client instance so a captureOrder -> getOrder fallback (ORDER_ALREADY_CAPTURED)
  // reuses the same bearer token instead of fetching a second one.
  let cachedToken: Promise<string> | null = null;
  async function token(): Promise<string> {
    if (!cachedToken) {
      cachedToken = (async () => {
        const res = await f(`${base}/v1/oauth2/token`, {
          method: 'POST',
          body: 'grant_type=client_credentials',
          headers: { Authorization: `Basic ${btoa(`${cfg.clientId}:${cfg.secret}`)}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        if (!res.ok) throw new PayPalError(res.status, 'AUTH_FAILED');
        return ((await res.json()) as { access_token: string }).access_token;
      })().catch((err) => { cachedToken = null; throw err; });
    }
    return cachedToken;
  }
  const issueOf = (b: any): string | undefined => b?.details?.[0]?.issue ?? b?.name;
  function captureToResult(cap: any, payerEmail?: string): CaptureResult {
    if (cap.status === 'COMPLETED') return { status: 'COMPLETED', captureId: String(cap.id), payerEmail };
    if (cap.status === 'PENDING') return { status: 'PENDING', captureId: String(cap.id), reason: cap.status_details?.reason ?? 'PENDING' };
    if (cap.status === 'DECLINED' || cap.status === 'FAILED') return { status: 'DECLINED', detail: `CAPTURE_${cap.status}` };
    throw new PayPalError(502, 'UNKNOWN_CAPTURE_STATUS');
  }

  const client: PayPalClient = {
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
      let res: Response;
      try {
        res = await f(`${base}/v2/checkout/orders/${encodeURIComponent(id)}/capture`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await token()}`, 'PayPal-Request-Id': `capture-${requestId}` },
        });
      } catch {
        throw new PayPalError(0, 'NETWORK');
      }
      const body: any = await res.json().catch(() => null);
      if (res.ok) {
        const cap = body?.purchase_units?.[0]?.payments?.captures?.[0];
        if (!cap?.id) throw new PayPalError(502, 'NO_CAPTURE');
        return captureToResult(cap, body?.payer?.email_address);
      }
      if (res.status === 422) {
        const issues: string[] = (body?.details ?? []).map((d: any) => d?.issue).filter(Boolean);
        if (issues.includes('ORDER_ALREADY_CAPTURED')) {
          const r = await client.getOrder(id);
          if (r.status === 'NOT_CAPTURED') throw new PayPalError(409, 'ALREADY_CAPTURED_UNREADABLE');
          return r;
        }
        const decline = issues.find((i) => DEFINITE_DECLINES.includes(i));
        if (decline) return { status: 'DECLINED', detail: decline };
        throw new PayPalError(422, issues[0] ?? 'UNKNOWN_422');
      }
      throw new PayPalError(res.status, issueOf(body) ?? 'NETWORK');
    },
    async getOrder(id) {
      let res: Response;
      try {
        res = await f(`${base}/v2/checkout/orders/${encodeURIComponent(id)}`, {
          headers: { Authorization: `Bearer ${await token()}` },
        });
      } catch {
        throw new PayPalError(0, 'NETWORK');
      }
      const body: any = await res.json().catch(() => null);
      if (!res.ok) throw new PayPalError(res.status, issueOf(body) ?? 'NETWORK');
      const cap = body?.purchase_units?.[0]?.payments?.captures?.[0];
      if (!cap) return { status: 'NOT_CAPTURED' };
      if (!cap.id) throw new PayPalError(502, 'NO_CAPTURE');
      return captureToResult(cap, body?.payer?.email_address);
    },
  };
  return client;
}
