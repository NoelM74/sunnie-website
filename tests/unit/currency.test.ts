import { describe, expect, it } from 'vitest';
import { RATES, currencyForCountry, currencyFromRequest, formatAll, formatMoney, parseCurrency, toLocalCents, toLocalWholeCents } from '../../src/lib/currency';
import { freeShippingThresholdCents, shippingFor, shippingFlatCents } from '../../src/lib/money';
import { priceBag } from '../../src/lib/pricing';
import { buildOrderPayload } from '../../src/lib/paypal';
import type { Catalog } from '../../src/lib/catalog';
import { parseEcb } from '../../scripts/fetch-rates.mjs';

describe('toLocalCents', () => {
  it('leaves euro alone', () => expect(toLocalCents(2995, 'EUR')).toBe(2995));
  it('always ends in .95 and never undercuts the converted price', () => {
    for (const eur of [500, 1695, 1795, 2395, 2995, 3995, 4900]) {
      for (const cur of ['GBP', 'USD'] as const) {
        const local = toLocalCents(eur, cur);
        expect(local % 100, `${eur} ${cur}`).toBe(95);
        expect(local).toBeGreaterThanOrEqual(eur * RATES[cur]);
        expect(local - eur * RATES[cur]).toBeLessThanOrEqual(100);
      }
    }
  });
  it('whole-number thresholds round up', () => {
    expect(toLocalWholeCents(4900, 'EUR')).toBe(4900);
    const gbp = toLocalWholeCents(4900, 'GBP');
    expect(gbp % 100).toBe(0);
    expect(gbp).toBeGreaterThanOrEqual(4900 * RATES.GBP);
  });
});

describe('formatMoney', () => {
  it('formats each currency the local way', () => {
    expect(formatMoney(2995, 'EUR')).toBe('€29.95');
    expect(formatMoney(2595, 'GBP')).toBe('£25.95');
    expect(formatMoney(3395, 'USD')).toBe('$33.95');
    expect(formatMoney(4900, 'EUR')).toBe('€49');
  });
  it('formatAll lists all three', () => expect(formatAll(4900, { whole: true })).toMatch(/^€49 \(£\d+ or \$\d+\)$/));
});

describe('currency choice', () => {
  it('reads only known cookie values', () => {
    expect(parseCurrency('GBP')).toBe('GBP');
    expect(parseCurrency('gbp')).toBeNull();
    expect(parseCurrency(undefined)).toBeNull();
  });
  it('guesses from the country', () => {
    expect(currencyForCountry('GB')).toBe('GBP');
    expect(currencyForCountry('US')).toBe('USD');
    expect(currencyForCountry('IE')).toBe('EUR');
    expect(currencyForCountry('CA')).toBe('EUR');
    expect(currencyForCountry(null)).toBe('EUR');
  });
  it('the cookie beats the country', () => {
    const req = new Request('https://x/', { headers: { 'cf-ipcountry': 'US' } });
    expect(currencyFromRequest('GBP', req)).toBe('GBP');
    expect(currencyFromRequest(undefined, req)).toBe('USD');
  });
});

describe('shipping and the bag in pounds', () => {
  const catalog: Catalog = {
    frog: { slug: 'frog', name: 'Frog', priceCents: 2995, inStock: true, option: null, optionPriceCents: null, siteCheckout: true, thumb: '', maker: 'Hui', featured: null },
  };
  it('charges local flat shipping below the local threshold', () => {
    expect(shippingFor(100, 'GBP')).toBe(shippingFlatCents('GBP'));
    expect(shippingFor(freeShippingThresholdCents('GBP'), 'GBP')).toBe(0);
  });
  it('prices lines in the chosen currency, matching the product page', () => {
    const p = priceBag([{ slug: 'frog', qty: 2 }], catalog, 'GBP');
    const unit = toLocalCents(2995, 'GBP');
    expect(p).toMatchObject({ currency: 'GBP', subtotalCents: unit * 2 });
    expect(p.lines[0]).toMatchObject({ unitCents: unit, lineCents: unit * 2 });
    expect(p.totalCents).toBe(p.subtotalCents + p.shippingCents);
  });
  it('sends PayPal the same currency on every amount', () => {
    const p = priceBag([{ slug: 'frog', qty: 1 }], catalog, 'USD');
    const payload = buildOrderPayload(
      {
        ref: 'SUN-USD001', email: 'a@b.com', paypalEnv: 'sandbox', currency: p.currency,
        address: { name: 'A B', line1: '1 Main St', line2: '', city: 'Austin', region: 'TX', postcode: '78701', country: 'US' },
        lines: p.lines, subtotalCents: p.subtotalCents, shippingCents: p.shippingCents, totalCents: p.totalCents,
      },
      { returnUrl: 'https://x/r', cancelUrl: 'https://x/c' },
    ) as any;
    const unit = payload.purchase_units[0];
    const codes = [unit.amount, unit.amount.breakdown.item_total, unit.amount.breakdown.shipping, ...unit.items.map((i: any) => i.unit_amount)].map((a) => a.currency_code);
    expect(new Set(codes)).toEqual(new Set(['USD']));
  });
});

describe('parseEcb', () => {
  const xml = `<Cube time='2026-10-28'><Cube currency='USD' rate='1.1133'/><Cube currency='JPY' rate='160.1'/><Cube currency='GBP' rate='0.83785'/></Cube>`;
  it('reads the date and the two rates', () => expect(parseEcb(xml)).toEqual({ asOf: '2026-10-28', GBP: 0.83785, USD: 1.1133 }));
  it('refuses a rate outside sane bounds', () => expect(() => parseEcb(xml.replace('0.83785', '83.785'))).toThrow(/GBP/));
});
