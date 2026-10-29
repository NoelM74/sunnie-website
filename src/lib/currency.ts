import rates from '../data/rates.json';

// Prices are set in euro. Pound and dollar prices come from the ECB rate in rates.json
// (refreshed by scripts/fetch-rates.mjs on every build), so a page and the checkout built
// together always agree on the price.
export type Currency = 'EUR' | 'GBP' | 'USD';
export const CURRENCIES: Currency[] = ['EUR', 'GBP', 'USD'];
export const CURRENCY_COOKIE = 'sunnie_cur';
export const RATES = rates as { asOf: string; GBP: number; USD: number };

const RATE: Record<Currency, number> = { EUR: 1, GBP: RATES.GBP, USD: RATES.USD };
export const CURRENCY_NAMES: Record<Currency, string> = { EUR: 'euro', GBP: 'pounds', USD: 'US dollars' };
const LOCALE: Record<Currency, string> = { EUR: 'en-IE', GBP: 'en-GB', USD: 'en-US' };

/** Euro cents to the price in `cur`, rounded up to the next .95 so it never undercuts the euro price. */
export function toLocalCents(eurCents: number, cur: Currency): number {
  if (cur === 'EUR') return eurCents;
  return Math.ceil((eurCents * RATE[cur] + 5) / 100) * 100 - 5;
}

/** Thresholds (free shipping) convert to a whole number, rounded up. */
export function toLocalWholeCents(eurCents: number, cur: Currency): number {
  if (cur === 'EUR') return eurCents;
  return Math.ceil((eurCents * RATE[cur]) / 100) * 100;
}

export function formatMoney(cents: number, cur: Currency): string {
  const whole = cents % 100 === 0;
  return new Intl.NumberFormat(LOCALE[cur], {
    style: 'currency',
    currency: cur,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(cents / 100);
}

/** "€49 (£42 or $56)": for sentences, where one price can't switch. */
export function formatAll(eurCents: number, opts: { whole?: boolean } = {}): string {
  const local = (c: Currency) => formatMoney(opts.whole ? toLocalWholeCents(eurCents, c) : toLocalCents(eurCents, c), c);
  return `${local('EUR')} (${local('GBP')} or ${local('USD')})`;
}

export function parseCurrency(v: string | null | undefined): Currency | null {
  return v === 'EUR' || v === 'GBP' || v === 'USD' ? v : null;
}

const GBP_COUNTRIES = new Set(['GB', 'IM', 'JE', 'GG']);
const USD_COUNTRIES = new Set(['US', 'PR', 'GU', 'VI', 'AS', 'MP']);
export function currencyForCountry(cc: string | null | undefined): Currency {
  const c = (cc ?? '').toUpperCase();
  return GBP_COUNTRIES.has(c) ? 'GBP' : USD_COUNTRIES.has(c) ? 'USD' : 'EUR';
}

/** The buyer's chosen currency (cookie), else a guess from Cloudflare's country header. */
export function currencyFromRequest(cookie: string | undefined, request: Request): Currency {
  return parseCurrency(cookie) ?? currencyForCountry(request.headers.get('cf-ipcountry'));
}
