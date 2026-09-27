import { describe, expect, it } from 'vitest';
import { validateEnv } from '../../src/lib/env-validate';

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
