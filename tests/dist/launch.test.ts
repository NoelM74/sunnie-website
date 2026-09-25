import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { htmlFiles, rel } from './helpers';

describe('launch gate', () => {
  it('every in-stock product links to its own Etsy listing', () => {
    const bad = htmlFiles()
      .filter((f) => rel(f).startsWith('products/'))
      .filter((f) => {
        const h = readFileSync(f, 'utf8');
        return h.includes('btn btn-primary btn-block') && !/btn btn-primary btn-block" href="https:\/\/www\.etsy\.com\/listing\/\d+/.test(h);
      })
      .map(rel);
    expect(bad).toEqual([]);
  });

  it('no private shop data is in the repo or the build', () => {
    expect(execSync('git ls-files').toString()).not.toMatch(/shop_settings\.json/);
    // SHA-256 of private tokens (lower-cased) from the owner's Etsy account settings.
    // Stored as hashes so the values themselves never enter the repo.
    const PRIVATE = new Set([
      '7df22bde96c35f50f16eb0d941a5ab79bc7b55bc22e5373000292a448da9a0e1',
      'cedc30674aaf7154b9a5978e5dbda83f1b9febb69c73301f7a6c804d8c448772',
      'a5c1835f2f1f4d4d0db26a840ca90c1dc156e01cdc57b339bd11a4c68e9172f7',
      '7ba84b57db28dcd3757ae13ee1c5ad77a194ae45575e72491bdcd8118babe0f4',
      '27e47dae7bf675104f17a2d0149e3bd399f60e1ccae3bc91916cbfa782085c77',
    ]);
    const hash = (t: string) => createHash('sha256').update(t.toLowerCase()).digest('hex');
    for (const f of htmlFiles()) {
      const tokens = new Set(readFileSync(f, 'utf8').match(/[A-Za-z0-9]+/g) ?? []);
      const leaked = [...tokens].filter((t) => PRIVATE.has(hash(t)));
      expect(leaked, rel(f)).toEqual([]);
    }
  });
});
