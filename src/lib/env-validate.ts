/** Pure check used by getEnv, kept free of `cloudflare:workers` (a virtual module that
 * only resolves inside the Astro/Workers runtime) so it can be unit-tested directly.
 * Only routes call getEnv/validateEnv, so a missing or malformed secret fails loudly
 * at request time rather than silently letting a static page render, or a checkout
 * route run against a half-configured env. */
export function validateEnv(raw: Record<string, unknown>): void {
  if (raw.PAYPAL_ENV !== 'sandbox' && raw.PAYPAL_ENV !== 'live') {
    throw new Error('Checkout is not configured: PAYPAL_ENV must be "sandbox" or "live"');
  }
  if (typeof raw.BAG_SECRET !== 'string' || raw.BAG_SECRET.length < 32) {
    throw new Error('Checkout is not configured: BAG_SECRET must be at least 32 characters');
  }
  if (!raw.ORDERS) {
    throw new Error('Checkout is not configured: ORDERS (D1 database binding) is missing');
  }
}

const STRING_KEYS = ['PAYPAL_CLIENT_ID', 'PAYPAL_CLIENT_SECRET', 'PAYPAL_ENV', 'RESEND_API_KEY', 'BAG_SECRET', 'ORDER_NOTIFY_EMAIL', 'ORDER_FROM_EMAIL'] as const;

/** Secrets are typed or pasted into a terminal prompt, so stray spaces, line endings or a
 * capital letter can slip in unseen. Trim every string secret and lowercase PAYPAL_ENV;
 * bindings (ORDERS, ASSETS) pass through untouched. */
export function normalizeEnv<T extends Record<string, unknown>>(raw: T): T {
  const out: Record<string, unknown> = { ORDERS: raw.ORDERS, ASSETS: raw.ASSETS };
  for (const k of STRING_KEYS) {
    const v = raw[k];
    out[k] = typeof v === 'string' ? v.trim() : v;
  }
  if (typeof out.PAYPAL_ENV === 'string') out.PAYPAL_ENV = out.PAYPAL_ENV.toLowerCase();
  return out as T;
}
