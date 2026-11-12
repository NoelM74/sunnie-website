import { describe, expect, it } from 'vitest';
import { lineLabel, packSize, unitLabel } from '../../src/lib/line-label';

describe('bag line wording', () => {
  it('prices a pack as the pack, never "each"', () => {
    expect(unitLabel({ option: '2 dogs: Grey Schnauzer + Beige Puppy' }, '€69.95')).toBe('2 for €69.95');
    expect(unitLabel({ option: '3 frogs' }, '€89.95')).toBe('3 for €89.95');
    expect(unitLabel({ option: '1 cat: Black Cat' }, '€39.95')).toBe('€39.95');
    expect(unitLabel({ option: 'Pink' }, '€34.95')).toBe('€34.95 each');
    expect(unitLabel({}, '€19.95')).toBe('€19.95 each');
  });
  it('names a pack without "1 ×"', () => {
    expect(lineLabel({ qty: 1, name: 'Snout & About dog phone bag', option: '2 dogs: Grey Schnauzer + Beige Puppy' })).toBe('Snout & About dog phone bag, 2 dogs: Grey Schnauzer + Beige Puppy');
    expect(lineLabel({ qty: 2, name: 'Finn & the Shamrock frog bag', option: '2 frogs' })).toBe('2 × Finn & the Shamrock frog bag, 2 frogs');
    expect(lineLabel({ qty: 1, name: 'Frog bag', option: 'Pink' })).toBe('1 × Frog bag (Pink)');
  });
  it('leaves ordinary options that start with a number alone', () => {
    expect(packSize('4 coasters + free basket')).toBeNull();
    expect(packSize('Set Of Two')).toBeNull();
  });
});
