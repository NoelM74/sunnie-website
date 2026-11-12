import { describe, expect, it } from 'vitest';
import { FINN_ITEM, FINN_SLUG, isFinnOnly } from '../../src/lib/finn';
import { priceBag } from '../../src/lib/pricing';

const catalog = { [FINN_SLUG]: { ...FINN_ITEM, thumb: '/t.webp' } };

describe('Finn handoff', () => {
  it('prices the owner-approved bundles', () => {
    const b = priceBag([{ slug: FINN_SLUG, option: '2 frogs', qty: 1 }], catalog, 'EUR');
    expect(b.subtotalCents).toBe(6995);
    expect(b.shippingCents).toBe(0);
    const one = priceBag([{ slug: FINN_SLUG, option: '1 frog', qty: 1 }], catalog, 'GBP');
    expect(one.subtotalCents).toBe(2995);
    expect(one.shippingCents).toBe(500);
  });
  it('sends Finn-only bags back to Finn', () => {
    expect(isFinnOnly([{ slug: FINN_SLUG }])).toBe(true);
    expect(isFinnOnly([{ slug: FINN_SLUG }, { slug: 'frog-phone-crossbody' }])).toBe(false);
    expect(isFinnOnly([])).toBe(false);
  });
});
