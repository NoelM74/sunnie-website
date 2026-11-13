import { site } from '../data/site';

export interface Address { name: string; line1: string; line2: string; city: string; region: string; postcode: string; country: string }
export interface CheckoutValues extends Address { email: string }
type Errors = Partial<Record<keyof CheckoutValues, string>>;

/** Only the countries we ship to (site.delivery). */
export const COUNTRY_CODES = site.delivery.flatMap((d) => d.countries);

const names = { en: new Intl.DisplayNames(['en'], { type: 'region' }), de: new Intl.DisplayNames(['de'], { type: 'region' }) };
export const countryName = (code: string, lang: 'en' | 'de' = 'en') => names[lang].of(code) ?? code;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS: Record<keyof CheckoutValues, number> = { email: 254, name: 300, line1: 300, line2: 300, city: 120, region: 300, postcode: 60, country: 2 };

export function validateCheckout(form: FormData) {
  const get = (k: keyof CheckoutValues) => String(form.get(k) ?? '').trim();
  const values: CheckoutValues = {
    email: get('email'), name: get('name'), line1: get('line1'), line2: get('line2'),
    city: get('city'), region: get('region'), postcode: get('postcode'), country: get('country').toUpperCase(),
  };
  const errors: Errors = {};
  if (!EMAIL.test(values.email)) errors.email = 'Enter a valid email address.';
  if (!values.name) errors.name = 'Enter your full name.';
  if (!values.line1) errors.line1 = 'Enter the first line of your address.';
  if (!values.city) errors.city = 'Enter your town or city.';
  if (!COUNTRY_CODES.includes(values.country)) errors.country = 'Choose your country.';
  for (const [k, max] of Object.entries(LIMITS) as [keyof CheckoutValues, number][]) {
    if (values[k].length > max && !errors[k]) errors[k] = 'This is too long.';
  }
  return Object.keys(errors).length ? { ok: false as const, values, errors } : { ok: true as const, values };
}

/** "Austria, Belgium, … and the United States": every country we ship to, for copy. */
export const shipToList = (() => {
  const n = COUNTRY_CODES.map((c) => countryName(c)).sort();
  return `${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}`;
})();
