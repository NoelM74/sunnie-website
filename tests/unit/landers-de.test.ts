import { describe, expect, it } from 'vitest';
import { LANDERS } from '../../src/data/landers';
import { LANDERS_DE } from '../../src/i18n/de/landers';
import { germanOption, localizeLander } from '../../src/i18n/de/localize';
import { BUNDLE_SIZES, bundleOptionValues } from '../../src/lib/bundles';
import reviews from '../../src/data/reviews.json';

describe('German bundle pages', () => {
  const pairs = Object.entries(LANDERS_DE).map(([slug, de]) => [slug, LANDERS.find((l) => l.slug === slug)!, de] as const);
  it('each one is for a real English lander', () => {
    for (const [slug, l] of pairs) expect(l, slug).toBeDefined();
  });
  it.each(pairs)('%s lines up with the English page', (_slug, l, de) => {
    expect(() => localizeLander(l, de)).not.toThrow();
  });
  it.each(pairs)('%s shows every pack in German in the basket', (_slug, l, de) => {
    const options = l.sizes ? BUNDLE_SIZES.map((n) => l.sizes![n].option) : l.cart ? BUNDLE_SIZES.map((n) => l.cart!.options[n]) : bundleOptionValues(l);
    for (const o of options) {
      const g = germanOption(l, de, o);
      expect(g, o).not.toBe(o);
      // Every colour has a German name, so no English pick is left in the label.
      for (const p of l.picks) if (de.picks?.[p] && de.picks[p] !== p) expect(g.split(/[:+]/).map((x) => x.trim())).not.toContain(p);
    }
  });
  it.each(pairs)('%s has German for every review it shows', (_slug, l) => {
    for (const k of [...l.reviews, l.hero.proof, l.offer.proof]) {
      const r = (reviews as { reviewer: string; date: string; lang: string; de?: string }[]).find((x) => x.reviewer === k.reviewer && x.date === k.date)!;
      if (r.lang === 'en') expect(r.de, `${k.reviewer} ${k.date}`).toBeTruthy();
    }
  });
});
