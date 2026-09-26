export interface Address { name: string; line1: string; line2: string; city: string; region: string; postcode: string; country: string }
export interface CheckoutValues extends Address { email: string }
type Errors = Partial<Record<keyof CheckoutValues, string>>;

export const COUNTRY_CODES = 'AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IO IQ IS IT JE JM JO JP KE KG KH KI KM KN KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RW SA SB SC SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');

const names = new Intl.DisplayNames(['en'], { type: 'region' });
export const countryName = (code: string) => names.of(code) ?? code;

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
