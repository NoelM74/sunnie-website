import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIST, readCatalog } from './helpers';

const read = (f: string) => {
  const lines = readFileSync(join(DIST, 'feeds', f), 'utf8').trim().split(/\r\n/);
  return { header: lines[0], rows: lines.slice(1).map((l) => l.slice(1, -1).split('","')) };
};
const pinterest = read('pinterest.csv');
const FEEDS = [
  { file: 'google.csv', cur: 'EUR', ship: 6, free: 50, countries: ['IE', 'DE', 'FR', 'CA', 'NO'], not: ['GB', 'US', 'IT', 'AU', 'KR'] },
  { file: 'google-uk.csv', cur: 'GBP', ship: 5, free: 45, countries: ['GB'], not: ['IE', 'US'] },
  { file: 'google-us.csv', cur: 'USD', ship: 6, free: 55, countries: ['US'], not: ['GB', 'CA'] },
];

describe.each(FEEDS)('Google feed $file', ({ file, cur, ship, free, countries, not }) => {
  const { header, rows } = read(file);
  it('is the Pinterest feed plus no-barcode and shipping columns', () => {
    expect(header).toBe(`${pinterest.header},identifier_exists,shipping`);
    expect(rows).toHaveLength(pinterest.rows.length);
  });
  it(`prices in ${cur} and says there is no barcode`, () => {
    for (const r of rows) {
      expect(r[5]).toMatch(new RegExp(`^\\d+\\.95 ${cur}$`));
      expect(r[12]).toBe('no');
    }
  });
  it('ships only to the right countries, at the right cost', () => {
    for (const r of rows) {
      const groups = r[13].split(',');
      const codes = groups.map((g) => g.split(':')[0]);
      for (const c of countries) expect(codes).toContain(c);
      for (const c of not) expect(codes).not.toContain(c);
      const price = Number(r[5].split(' ')[0]);
      for (const g of groups) {
        expect(g).toMatch(new RegExp(`^[A-Z]{2}:::\\d+\\.\\d{2} ${cur}:\\d+:\\d+:\\d+:\\d+$`));
        expect(g.split(':')[3]).toBe(`${(price >= free ? 0 : ship).toFixed(2)} ${cur}`);
      }
    }
  });
});

describe('UK and US feed prices match what the checkout charges', () => {
  const catalog = readCatalog() as Record<string, { priceCents: number; localPrices?: Record<string, Record<string, number>> }>;
  it('uses the bundle page price for products with one', () => {
    const uk = read('google-uk.csv').rows;
    const us = read('google-us.csv').rows;
    let checked = 0;
    for (const [i, r] of uk.entries()) {
      const slug = r[0].replace(/^SD-/, '').toLowerCase();
      const lp = catalog[slug]?.localPrices;
      if (!lp) continue;
      expect(Math.round(Number(r[5].split(' ')[0]) * 100)).toBe(Math.min(...Object.values(lp.GBP)));
      expect(Math.round(Number(us[i][5].split(' ')[0]) * 100)).toBe(Math.min(...Object.values(lp.USD)));
      checked++;
    }
    expect(checked).toBeGreaterThan(5);
  });
});
