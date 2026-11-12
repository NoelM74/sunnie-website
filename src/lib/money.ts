import { formatMoney, toLocalCents, type Currency } from './currency';

export const SHIPPING_FLAT_CENTS = 500;
/**
 * Free shipping from €50, £45 or $55 (owner, 2026-11-12). Fixed per currency, like the
 * bundle price lists, so ads can quote it and it doesn't drift with the exchange rate.
 */
export const FREE_SHIPPING_FROM: Record<Currency, number> = { EUR: 5000, GBP: 4500, USD: 5500 };
export const FREE_SHIPPING_THRESHOLD_CENTS = FREE_SHIPPING_FROM.EUR;
export const FREE_SHIPPING_EUR = FREE_SHIPPING_THRESHOLD_CENTS / 100;

export const shippingFlatCents = (cur: Currency = 'EUR') => toLocalCents(SHIPPING_FLAT_CENTS, cur);
export const freeShippingThresholdCents = (cur: Currency = 'EUR') => FREE_SHIPPING_FROM[cur];
/** "€50 (£45 or $55)", for sentences where one price can't switch. */
export const freeShippingAll = () =>
  `${formatMoney(FREE_SHIPPING_FROM.EUR, 'EUR')} (${formatMoney(FREE_SHIPPING_FROM.GBP, 'GBP')} or ${formatMoney(FREE_SHIPPING_FROM.USD, 'USD')})`;

/** Subtotal and result are in `cur` cents. */
export function shippingFor(subtotalCents: number, cur: Currency = 'EUR'): number {
  if (subtotalCents <= 0) return 0;
  return subtotalCents >= freeShippingThresholdCents(cur) ? 0 : shippingFlatCents(cur);
}

export function centsToAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}
