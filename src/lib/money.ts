import { formatMoney, type Currency } from './currency';

/**
 * One shipping rate for the whole shop, fixed per currency (owner, 2026-11-12): €6, £5 or $6
 * an order. Free from the thresholds below, and on any bundle pack of 2 or more.
 */
export const SHIPPING_FLAT: Record<Currency, number> = { EUR: 600, GBP: 500, USD: 600 };
export const SHIPPING_FLAT_CENTS = SHIPPING_FLAT.EUR;
/**
 * Free shipping from €50, £45 or $55 (owner, 2026-11-12). Fixed per currency, like the
 * bundle price lists, so ads can quote it and it doesn't drift with the exchange rate.
 */
export const FREE_SHIPPING_FROM: Record<Currency, number> = { EUR: 5000, GBP: 4500, USD: 5500 };
export const FREE_SHIPPING_THRESHOLD_CENTS = FREE_SHIPPING_FROM.EUR;
export const FREE_SHIPPING_EUR = FREE_SHIPPING_THRESHOLD_CENTS / 100;

export const shippingFlatCents = (cur: Currency = 'EUR') => SHIPPING_FLAT[cur];
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
