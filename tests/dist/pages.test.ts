import { describe, expect, it } from 'vitest';
import reviews from '../../src/data/reviews.json';
import { page } from './helpers';

describe('info pages', () => {
  it.each(['/our-story/', '/reviews/', '/shipping/', '/care/', '/contact/', '/privacy/', '/404/'])('%s builds', (route) => {
    expect(page(route)).toContain('<h1');
  });
  it('contact shows the hello address', () => {
    expect(page('/contact/')).toContain('mailto:hello@sunniedesigns.com');
  });
  it('our story shows the hui address', () => {
    expect(page('/our-story/')).toContain('mailto:hui@sunniedesigns.com');
  });
  it('reviews page lists every kept review and shows German originals', () => {
    const html = page('/reviews/');
    expect((html.match(/class="quote"/g) ?? []).length).toBe(reviews.length);
    expect(html).toContain('lang="de"');
    expect(html).toContain('287 ratings on eBay');
  });
  it('404 is noindexed', () => {
    expect(page('/404/')).toContain('<meta name="robots" content="noindex"');
  });
  it('story page never names a country of manufacture', () => {
    expect(page('/our-story/')).not.toMatch(/made in (ireland|china)/i);
  });
});
