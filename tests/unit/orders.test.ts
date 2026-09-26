import { describe, expect, it } from 'vitest';
import { d1Orders, memoryOrders, newRef, type OrderInput } from '../../src/lib/orders';

const input = (ref = 'SUN-AAAAAA'): OrderInput => ({
  ref, email: 'a@b.ie',
  address: { name: 'Aoife', line1: '1 Main St', line2: '', city: 'Ennis', region: '', postcode: '', country: 'IE' },
  lines: [{ slug: 'frog', name: 'Frog', option: 'Pink', qty: 1, unitCents: 2995, lineCents: 2995, thumb: '' }],
  subtotalCents: 2995, shippingCents: 500, totalCents: 3495, paypalEnv: 'sandbox',
});

describe('memoryOrders', () => {
  it('runs the pending → paid lifecycle', async () => {
    const repo = memoryOrders();
    await repo.insertPending(input());
    await repo.setPaypalId('SUN-AAAAAA', 'PP-1');
    expect((await repo.findByPaypalId('PP-1'))?.status).toBe('pending');
    await repo.markPaid('SUN-AAAAAA', 'CAP-1', 'payer@x.ie');
    const row = await repo.findByRef('SUN-AAAAAA');
    expect(row).toMatchObject({ status: 'paid', captureId: 'CAP-1', paypalOrderId: 'PP-1' });
    expect(row?.paidAt).toBeTruthy();
    await repo.recordEmail('SUN-AAAAAA', { customer: true, shop: false, error: 'boom' });
    expect(await repo.findByRef('SUN-AAAAAA')).toMatchObject({ customerEmailed: true, shopEmailed: false, emailError: 'boom' });
  });
  it('rejects duplicate refs', async () => {
    const repo = memoryOrders();
    await repo.insertPending(input());
    await expect(repo.insertPending(input())).rejects.toThrow();
  });
  it('marks an order for review when the capture is pending at PayPal', async () => {
    const repo = memoryOrders();
    await repo.insertPending(input());
    await repo.markReview('SUN-AAAAAA', 'CAP-9', 'PENDING_REVIEW');
    const row = await repo.findByRef('SUN-AAAAAA');
    expect(row).toMatchObject({ status: 'review', captureId: 'CAP-9' });
    expect(row?.emailError).toMatch(/^PAYPAL_PENDING:/);
  });
});

describe('d1Orders', () => {
  it('writes parameterised SQL (no string interpolation of values)', async () => {
    const calls: { sql: string; args: unknown[] }[] = [];
    const db = { prepare: (sql: string) => ({ bind: (...args: unknown[]) => { calls.push({ sql, args }); return { run: async () => ({}), first: async () => null }; } }) };
    const repo = d1Orders(db);
    await repo.insertPending(input());
    await repo.markPaid('SUN-AAAAAA', 'CAP-1');
    await repo.markReview('SUN-AAAAAA', 'CAP-2', 'PENDING_REVIEW');
    for (const c of calls) {
      expect(c.sql).not.toContain('SUN-AAAAAA');
      expect(c.sql).toMatch(/\?/);
    }
    expect(calls[0].args).toContain('SUN-AAAAAA');
    const reviewCall = calls[calls.length - 1];
    expect(reviewCall.sql).toMatch(/status = 'review'/);
    expect(reviewCall.args).toContain('CAP-2');
    expect(reviewCall.args).toContain('PAYPAL_PENDING:PENDING_REVIEW');
  });
});

describe('newRef', () => {
  it('makes SUN- plus 6 base36 characters', () => {
    expect(newRef()).toMatch(/^SUN-[0-9A-Z]{6}$/);
    expect(newRef(() => 0)).toBe('SUN-000000');
  });
});
