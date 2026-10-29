import { describe, expect, it } from 'vitest';
import { optionPhoto, optionPricesKeysValid } from '../../src/lib/product-schema';

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

describe('optionPhoto', () => {
  const values = ['Grey Schnauzer', 'Beige Puppy', 'White Terrier'];
  const alts = ['Three dogs: grey schnauzer, beige puppy and white terrier', 'Grey schnauzer plush bag', 'Beige puppy plush bag', 'White terrier plush bag'];
  it('skips the group photo and finds the photo naming only this choice', () => {
    expect(values.map((v) => optionPhoto(v, values, alts))).toEqual([1, 2, 3]);
  });
  it('uses the photo number from the product file first (1 = first photo)', () => {
    expect(optionPhoto('Beige Puppy', values, alts, { 'Beige Puppy': 1 })).toBe(0);
  });
  it('returns null when no photo names the choice', () => expect(optionPhoto('Large', ['Small', 'Large'], alts)).toBeNull());
});
