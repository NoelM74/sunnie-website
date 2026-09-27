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
