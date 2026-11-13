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

describe('pairs of coasters', () => {
  it('says pairs, so a set of four never reads as two coasters', () => {
    expect(unitLabel({ option: '2 pairs: Pink + Mixed' }, '€44.95')).toBe('2 pairs for €44.95');
    expect(unitLabel({ option: '1 pair: Mixed' }, '€24.95')).toBe('1 pair for €24.95');
    expect(unitLabel({ option: '2 dogs: Grey Schnauzer + Beige Puppy' }, '€69.95')).toBe('2 for €69.95');
  });
});

describe('German basket labels', () => {
  it('reads packs and single pieces in German', async () => {
    const { unitLabel, lineLabel } = await import('../../src/lib/line-label');
    expect(unitLabel({ option: '2 frogs: Pink + Blue' }, '69,95 €', 'de')).toBe('2 für 69,95 €');
    expect(unitLabel({ option: '2 pairs: Pink + Pink' }, '44,95 €', 'de')).toBe('2 Paare für 44,95 €');
    expect(unitLabel({}, '34,95 €', 'de')).toBe('34,95 € pro Stück');
    expect(lineLabel({ qty: 1, name: 'x', option: '2 frogs: Pink + Blue' }, { name: 'Frosch', option: '2 Frösche: Rosa + Blau' })).toBe('Frosch, 2 Frösche: Rosa + Blau');
  });
  it('shows bundle packs from a German page in German', async () => {
    const { shownLine } = await import('../../src/i18n/de/lines');
    const l = shownLine({ slug: 'star-frogs-bundle', name: 'The Star Frogs frog phone bag', option: '3 frogs: Pink + Blue + Brown', qty: 1 }, 'de');
    expect(l.name).toBe('The Star Frogs Frosch-Handytasche');
    expect(l.option).toBe('3 Frösche: Rosa + Blau + Braun');
    expect(shownLine({ slug: 'finn-the-shamrock', name: 'Finn', option: '2 frogs', qty: 1 }, 'de').option).toBe('2 Frösche');
    expect(shownLine({ slug: 'giraffe-crossbody-bag-for-kids', name: 'Giraffe bag', qty: 1 }, 'de').name).toBe('Giraffe bag');
    const tote = shownLine({ slug: 'rainbow-tote-bag', name: 'Rainbow tote', option: 'warm rainbow', qty: 1 }, 'de');
    expect([tote.name, tote.option]).toEqual(['Regenbogen-Netztasche mit Herz-Geldbörse', 'Warmer Regenbogen']);
  });
});
