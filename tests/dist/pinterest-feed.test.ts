import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIST } from './helpers';

// Pinterest rejects the whole feed if a required column is missing or misformatted.
const csv = readFileSync(join(DIST, 'feeds', 'pinterest.csv'), 'utf8');
const lines = csv.trim().split(/\r\n/);
const rows = lines.slice(1).map((l) => l.slice(1, -1).split('","'));
const productCount = readdirSync(join(process.cwd(), 'src', 'content', 'products')).filter((f) => f.endsWith('.md')).length;

describe('Pinterest feed', () => {
  it('has the exact header Pinterest expects', () => {
    expect(lines[0]).toBe('id,title,description,link,image_link,price,availability,condition,brand,google_product_category,product_type,additional_image_link');
  });
  it('has one row per product with unique ids', () => {
    expect(rows).toHaveLength(productCount);
    expect(new Set(rows.map((r) => r[0])).size).toBe(productCount);
  });
  it('formats every row the way Pinterest requires', () => {
    for (const [id, title, description, link, image, price, availability, condition] of rows) {
      expect(id).toMatch(/^SD-[A-Z0-9-]+$/);
      expect(title.length).toBeGreaterThan(3);
      expect(description.length).toBeGreaterThan(40);
      expect(link).toMatch(/^https:\/\/sunniedesigns\.com\/products\/[a-z0-9-]+\/$/);
      expect(image).toMatch(/^https:\/\/sunniedesigns\.com\/.+\.jpg$/);
      expect(price).toMatch(/^\d+\.\d{2} EUR$/);
      expect(availability).toMatch(/^(in stock|out of stock)$/);
      expect(condition).toBe('new');
    }
  });
  it('lists at most 10 extra photos per product', () => {
    for (const r of rows) expect(r[11] ? r[11].split(',').length : 0).toBeLessThanOrEqual(10);
  });
});
