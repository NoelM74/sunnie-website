import { describe, expect, it } from 'vitest';
import { FINN_ITEM, FINN_ORIGIN, FINN_SLUG, isFinnOnly } from '../../src/lib/finn';
import { isSameOrigin } from '../../src/lib/request';
import { priceBag } from '../../src/lib/pricing';

const catalog = { [FINN_SLUG]: { ...FINN_ITEM, thumb: '/t.webp' } };

describe('Finn handoff', () => {
  it('prices the owner-set euro bundles', () => {
    const b = priceBag([{ slug: FINN_SLUG, option: '2 frogs', qty: 1 }], catalog, 'EUR');
    expect(b.subtotalCents).toBe(6195);
    expect(b.shippingCents).toBe(0);
    const one = priceBag([{ slug: FINN_SLUG, option: '1 frog', qty: 1 }], catalog, 'EUR');
    expect(one.subtotalCents).toBe(3495);
    expect(one.shippingCents).toBe(500);
  });
  it('accepts a form post from the Finn page only', () => {
    const req = (origin: string) => new Request('https://sunniedesigns.com/bag/add/', { method: 'POST', headers: { origin } });
    expect(isSameOrigin(req(FINN_ORIGIN), [FINN_ORIGIN])).toBe(true);
    expect(isSameOrigin(req('https://evil.example'), [FINN_ORIGIN])).toBe(false);
    expect(isSameOrigin(req(FINN_ORIGIN))).toBe(false);
  });
  it('sends Finn-only bags back to Finn', () => {
    expect(isFinnOnly([{ slug: FINN_SLUG }])).toBe(true);
    expect(isFinnOnly([{ slug: FINN_SLUG }, { slug: 'frog-phone-crossbody' }])).toBe(false);
    expect(isFinnOnly([])).toBe(false);
  });
});
