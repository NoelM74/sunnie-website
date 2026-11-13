import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIST } from './helpers';

const csv = readFileSync(join(DIST, 'feeds', 'google.csv'), 'utf8');
const lines = csv.trim().split(/\r\n/);
const rows = lines.slice(1).map((l) => l.slice(1, -1).split('","'));
const pinterest = readFileSync(join(DIST, 'feeds', 'pinterest.csv'), 'utf8').trim().split(/\r\n/);

describe('Google Merchant Center feed', () => {
  it('is the Pinterest feed plus no-barcode and shipping columns', () => {
    expect(lines[0]).toBe(`${pinterest[0]},identifier_exists,shipping`);
    expect(rows).toHaveLength(pinterest.length - 1);
  });
  it('says every item has no barcode and ships to Ireland, the UK, the EU, the US and Canada', () => {
    for (const r of rows) {
      expect(r[12]).toBe('no');
      const groups = r[13].split(',');
      for (const c of ['IE', 'GB', 'DE', 'FR', 'US', 'CA']) expect(groups.some((g) => g.startsWith(`${c}:::`))).toBe(true);
      for (const g of groups) expect(g).toMatch(/^[A-Z]{2}:::\d+\.\d{2} EUR:\d+:\d+:\d+:\d+$/);
    }
  });
  it('charges €6 shipping under €50 and nothing from €50', () => {
    for (const r of rows) {
      const price = Number(r[5].split(' ')[0]);
      expect(r[13].split(',')[0].split(':')[3]).toBe(price >= 50 ? '0.00 EUR' : '6.00 EUR');
    }
  });
});
