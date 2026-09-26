import type { Address } from './checkout-form';
import type { PricedLine } from './pricing';

export interface D1Like {
  prepare(sql: string): {
    bind(...v: unknown[]): {
      run(): Promise<unknown>;
      first<T = Record<string, unknown>>(): Promise<T | null>;
    };
  };
}

export interface OrderInput {
  ref: string; email: string; address: Address; lines: PricedLine[];
  subtotalCents: number; shippingCents: number; totalCents: number; paypalEnv: 'sandbox' | 'live';
}
export interface OrderRow extends OrderInput {
  status: 'pending' | 'paid'; paypalOrderId: string | null; captureId: string | null;
  createdAt: string; paidAt: string | null; customerEmailed: boolean; shopEmailed: boolean; emailError: string | null;
}
export interface OrdersRepo {
  insertPending(o: OrderInput): Promise<void>;
  setPaypalId(ref: string, id: string): Promise<void>;
  findByPaypalId(id: string): Promise<OrderRow | null>;
  findByRef(ref: string): Promise<OrderRow | null>;
  markPaid(ref: string, captureId: string, payerEmail?: string): Promise<void>;
  recordEmail(ref: string, r: { customer: boolean; shop: boolean; error?: string }): Promise<void>;
}

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function newRef(random: () => number = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32): string {
  let s = '';
  for (let i = 0; i < 6; i++) s += ALPHABET[Math.floor(random() * 36)];
  return `SUN-${s}`;
}

export function memoryOrders(): OrdersRepo {
  const rows = new Map<string, OrderRow>();
  const byRef = (ref: string) => { const r = rows.get(ref); if (!r) throw new Error(`No order ${ref}`); return r; };
  return {
    async insertPending(o) {
      if (rows.has(o.ref)) throw new Error('duplicate ref');
      rows.set(o.ref, { ...o, status: 'pending', paypalOrderId: null, captureId: null, createdAt: new Date().toISOString(), paidAt: null, customerEmailed: false, shopEmailed: false, emailError: null });
    },
    async setPaypalId(ref, id) { byRef(ref).paypalOrderId = id; },
    async findByPaypalId(id) { return [...rows.values()].find((r) => r.paypalOrderId === id) ?? null; },
    async findByRef(ref) { return rows.get(ref) ?? null; },
    async markPaid(ref, captureId, payerEmail) {
      const r = byRef(ref);
      Object.assign(r, { status: 'paid', captureId, paidAt: new Date().toISOString() });
      if (payerEmail && !r.email) r.email = payerEmail;
    },
    async recordEmail(ref, e) { Object.assign(byRef(ref), { customerEmailed: e.customer, shopEmailed: e.shop, emailError: e.error ?? null }); },
  };
}

type Db = Record<string, unknown>;
function fromDb(r: Db): OrderRow {
  return {
    ref: String(r.ref), email: String(r.email), address: JSON.parse(String(r.address_json)), lines: JSON.parse(String(r.lines_json)),
    subtotalCents: Number(r.subtotal_cents), shippingCents: Number(r.shipping_cents), totalCents: Number(r.total_cents),
    paypalEnv: r.paypal_env as 'sandbox' | 'live', status: r.status as 'pending' | 'paid',
    paypalOrderId: (r.paypal_order_id as string) ?? null, captureId: (r.capture_id as string) ?? null,
    createdAt: String(r.created_at), paidAt: (r.paid_at as string) ?? null,
    customerEmailed: Number(r.customer_emailed) === 1, shopEmailed: Number(r.shop_emailed) === 1, emailError: (r.email_error as string) ?? null,
  };
}

export function d1Orders(db: D1Like): OrdersRepo {
  return {
    async insertPending(o) {
      await db.prepare(`INSERT INTO orders (ref, status, paypal_env, email, address_json, lines_json, subtotal_cents, shipping_cents, total_cents, currency, created_at)
        VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, 'EUR', ?)`)
        .bind(o.ref, o.paypalEnv, o.email, JSON.stringify(o.address), JSON.stringify(o.lines), o.subtotalCents, o.shippingCents, o.totalCents, new Date().toISOString()).run();
    },
    async setPaypalId(ref, id) { await db.prepare('UPDATE orders SET paypal_order_id = ? WHERE ref = ?').bind(id, ref).run(); },
    async findByPaypalId(id) { const r = await db.prepare('SELECT * FROM orders WHERE paypal_order_id = ?').bind(id).first<Db>(); return r ? fromDb(r) : null; },
    async findByRef(ref) { const r = await db.prepare('SELECT * FROM orders WHERE ref = ?').bind(ref).first<Db>(); return r ? fromDb(r) : null; },
    async markPaid(ref, captureId) {
      await db.prepare("UPDATE orders SET status = 'paid', capture_id = ?, paid_at = ? WHERE ref = ?").bind(captureId, new Date().toISOString(), ref).run();
    },
    async recordEmail(ref, e) {
      await db.prepare('UPDATE orders SET customer_emailed = ?, shop_emailed = ?, email_error = ? WHERE ref = ?').bind(e.customer ? 1 : 0, e.shop ? 1 : 0, e.error ?? null, ref).run();
    },
  };
}
