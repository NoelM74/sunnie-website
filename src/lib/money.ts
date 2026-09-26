export const SHIPPING_FLAT_CENTS = 500;
export const FREE_SHIPPING_THRESHOLD_CENTS = 4900;

export function shippingFor(subtotalCents: number): number {
  if (subtotalCents <= 0) return 0;
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS;
}

export function centsToAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}
