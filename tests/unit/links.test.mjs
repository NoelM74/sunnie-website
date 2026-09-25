import { describe, expect, it } from 'vitest';
import { extractHrefs, internalTarget } from '../../scripts/lib/links.mjs';

describe('extractHrefs', () => {
  it('pulls hrefs from anchors only and decodes &amp;', () => {
    const html = '<a class="x" href="/shop/">a</a><link href="/x.css"><a href="https://e.com/?a=1&amp;b=2">b</a>';
    expect(extractHrefs(html)).toEqual(['/shop/', 'https://e.com/?a=1&b=2']);
  });
});

describe('internalTarget', () => {
  it.each([
    ['/shop/', 'shop/index.html'],
    ['/', 'index.html'],
    ['/products/frog/#photo-2', 'products/frog/index.html'],
    ['/favicon.svg', 'favicon.svg'],
    ['#photo-1', null],
    ['mailto:hello@sunniedesigns.com', null],
    ['https://www.etsy.com/listing/1', null],
    ['//cdn.example.com/x', null],
  ])('%s → %s', (href, expected) => {
    expect(internalTarget(href)).toBe(expected);
  });
});
