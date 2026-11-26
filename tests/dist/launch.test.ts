import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { distTextFiles, findLeaks, gitTrackedTextFiles, htmlFiles, rel } from './helpers';

describe('launch gate', () => {
  // Site prices differ from Etsy, so product pages that sell here must not send buyers there.
  it('no product page that sells on site links out to Etsy', () => {
    const bad = htmlFiles()
      .filter((f) => rel(f).startsWith('products/'))
      .filter((f) => {
        const h = readFileSync(f, 'utf8');
        return h.includes('action="/bag/add/"') && h.includes('etsy.com/listing');
      })
      .map(rel);
    expect(bad).toEqual([]);
  });

  // Scanning every dist text file and every git-tracked text file for leaked
  // tokens is more work than the default 5s test timeout allows.
  it('no private shop data is in the repo or the build', () => {
    expect(execSync('git ls-files').toString()).not.toMatch(/shop_settings\.json/);
    // SHA-256 of private tokens (lower-cased) from the owner's Etsy account settings.
    // Stored as hashes so the values themselves never enter the repo. Checked both as
    // whole tokens and as separator-stripped joins of 2-4 adjacent tokens, so a value
    // like a phone number split across whitespace ("087 123 4567") is still caught.
    const PRIVATE = new Set([
      '7df22bde96c35f50f16eb0d941a5ab79bc7b55bc22e5373000292a448da9a0e1',
      'a5c1835f2f1f4d4d0db26a840ca90c1dc156e01cdc57b339bd11a4c68e9172f7',
      // 'springfield' removed: it is now the public company name (Springfield Tectop Limited).
      // Owner, 2026-11-26: the seller address (Clonlara, V94 R2DX) is now public on purpose, so those
      // two hashes were removed as well.
    ]);
    for (const f of distTextFiles()) {
      expect(findLeaks(readFileSync(f, 'utf8'), PRIVATE), rel(f)).toEqual([]);
    }
    for (const f of gitTrackedTextFiles()) {
      expect(findLeaks(readFileSync(f, 'utf8'), PRIVATE), f).toEqual([]);
    }
  }, 30_000);
});
