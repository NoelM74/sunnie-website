import { describe, expect, it } from 'vitest';
import { optionPricesKeysValid } from '../../src/lib/product-schema';

describe('optionPricesKeysValid', () => {
  it('accepts no optionPrices at all', () => {
    expect(optionPricesKeysValid(['Small', 'Large'])).toBe(true);
    expect(optionPricesKeysValid(['Small', 'Large'], undefined)).toBe(true);
  });
  it('accepts keys that all match an option value', () => {
    expect(optionPricesKeysValid(['Small', 'Large'], { Small: 10, Large: 15 })).toBe(true);
  });
  it('rejects a key that is not one of the option values', () => {
    expect(optionPricesKeysValid(['Small', 'Large'], { Small: 10, Medium: 12 })).toBe(false);
  });
  it('rejects any optionPrices when there are no option values', () => {
    expect(optionPricesKeysValid([], { Small: 10 })).toBe(false);
  });
});
