import { toLocalCents, toLocalWholeCents, type Currency } from './currency';

export const SHIPPING_FLAT_CENTS = 500;
export const FREE_SHIPPING_THRESHOLD_CENTS = 4000;
export const FREE_SHIPPING_EUR = FREE_SHIPPING_THRESHOLD_CENTS / 100;

export const shippingFlatCents = (cur: Currency = 'EUR') => toLocalCents(SHIPPING_FLAT_CENTS, cur);
export const freeShippingThresholdCents = (cur: Currency = 'EUR') => toLocalWholeCents(FREE_SHIPPING_THRESHOLD_CENTS, cur);

/** Subtotal and result are in `cur` cents. */
export function shippingFor(subtotalCents: number, cur: Currency = 'EUR'): number {
  if (subtotalCents <= 0) return 0;
  return subtotalCents >= freeShippingThresholdCents(cur) ? 0 : shippingFlatCents(cur);
}

export function centsToAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}
