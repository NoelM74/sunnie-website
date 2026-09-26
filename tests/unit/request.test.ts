import { describe, expect, it } from 'vitest';
import { isSameOrigin } from '../../src/lib/request';

const req = (headers: Record<string, string>) => new Request('https://sunniedesigns.com/bag/add/', { method: 'POST', headers });

describe('isSameOrigin', () => {
  it('accepts a matching Origin', () => expect(isSameOrigin(req({ origin: 'https://sunniedesigns.com' }))).toBe(true));
  it('rejects a foreign Origin', () => expect(isSameOrigin(req({ origin: 'https://evil.example' }))).toBe(false));
  it('falls back to Sec-Fetch-Site', () => {
    expect(isSameOrigin(req({ 'sec-fetch-site': 'same-origin' }))).toBe(true);
    expect(isSameOrigin(req({ 'sec-fetch-site': 'cross-site' }))).toBe(false);
  });
  it('allows requests with neither header (old browsers)', () => expect(isSameOrigin(req({}))).toBe(true));
});
