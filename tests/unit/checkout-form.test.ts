import { describe, expect, it } from 'vitest';
import { COUNTRY_CODES, countryName, validateCheckout } from '../../src/lib/checkout-form';

const fd = (o: Record<string, string>) => { const f = new FormData(); for (const [k, v] of Object.entries(o)) f.set(k, v); return f; };
const good = { email: 'a@b.ie', name: 'Aoife Byrne', line1: '1 Main St', line2: '', city: 'Ennis', region: 'Clare', postcode: 'V95 X1Y2', country: 'IE' };

describe('validateCheckout', () => {
  it('accepts a complete address and trims values', () => {
    const r = validateCheckout(fd({ ...good, name: '  Aoife Byrne  ' }));
    expect(r.ok).toBe(true);
    expect(r.values.name).toBe('Aoife Byrne');
  });
  it('requires email, name, line1, city and a known country', () => {
    const r = validateCheckout(fd({ ...good, email: 'nope', name: '', line1: '', city: '', country: 'XX' }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(['city', 'country', 'email', 'line1', 'name']);
  });
  it('limits lengths', () => {
    const r = validateCheckout(fd({ ...good, line1: 'x'.repeat(301) }));
    expect(r.ok).toBe(false);
  });
  it('knows common countries', () => {
    for (const c of ['IE', 'GB', 'DE', 'US', 'CA', 'AU', 'CN', 'JP']) expect(COUNTRY_CODES).toContain(c);
    expect(countryName('IE')).toBe('Ireland');
  });
});
