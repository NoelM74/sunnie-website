import { describe, expect, it } from 'vitest';
import { normalizeEnv, validateEnv } from '../../src/lib/env-validate';

const base = { PAYPAL_ENV: 'sandbox', BAG_SECRET: 'x'.repeat(32), ORDERS: {} };

describe('validateEnv', () => {
  it('accepts a fully configured env', () => {
    expect(() => validateEnv(base)).not.toThrow();
  });
  it('accepts PAYPAL_ENV live too', () => {
    expect(() => validateEnv({ ...base, PAYPAL_ENV: 'live' })).not.toThrow();
  });
  it('rejects a missing or wrong PAYPAL_ENV', () => {
    expect(() => validateEnv({ ...base, PAYPAL_ENV: undefined })).toThrow('Checkout is not configured: PAYPAL_ENV');
    expect(() => validateEnv({ ...base, PAYPAL_ENV: 'production' })).toThrow('Checkout is not configured: PAYPAL_ENV');
  });
  it('rejects a BAG_SECRET shorter than 32 characters', () => {
    expect(() => validateEnv({ ...base, BAG_SECRET: 'short' })).toThrow('Checkout is not configured: BAG_SECRET');
  });
  it('rejects a missing BAG_SECRET', () => {
    expect(() => validateEnv({ ...base, BAG_SECRET: undefined })).toThrow('Checkout is not configured: BAG_SECRET');
  });
  it('rejects a missing ORDERS binding', () => {
    expect(() => validateEnv({ ...base, ORDERS: undefined })).toThrow('Checkout is not configured: ORDERS');
  });
});

describe('normalizeEnv', () => {
  it('trims stray whitespace and case from secrets typed into a prompt', () => {
    const n = normalizeEnv({ ...base, PAYPAL_ENV: ' Sandbox\r\n', BAG_SECRET: '  ' + 'y'.repeat(40) + '\n', ORDER_FROM_EMAIL: ' Sunnie Designs <orders@sunniedesigns.com> ' });
    expect(n.PAYPAL_ENV).toBe('sandbox');
    expect(n.BAG_SECRET).toBe('y'.repeat(40));
    expect(n.ORDER_FROM_EMAIL).toBe('Sunnie Designs <orders@sunniedesigns.com>');
    expect(() => validateEnv(n)).not.toThrow();
  });
  it('keeps bindings as they are', () => {
    const orders = { prepare() {} };
    expect(normalizeEnv({ ...base, ORDERS: orders }).ORDERS).toBe(orders);
  });
});
