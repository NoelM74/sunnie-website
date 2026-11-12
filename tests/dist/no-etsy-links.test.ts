import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Owner, 2026-11-12: the shop never sends buyers to Etsy.
const root = join(process.cwd(), 'dist/client');
const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? files(p) : /\.(html|txt|xml|json|csv)$/.test(f) ? [p] : []; });

describe('no links to Etsy', () => {
  it('has no etsy.com link anywhere in the built site', () => {
    const hits = files(root).filter((f) => readFileSync(f, 'utf8').includes('etsy.com'));
    expect(hits).toEqual([]);
  });
});
