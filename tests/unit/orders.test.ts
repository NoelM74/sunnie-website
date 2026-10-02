import { describe, expect, it, vi } from 'vitest';
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
    expect(await repo.markPaid('SUN-AAAAAA', 'CAP-1', 'payer@x.ie')).toBe(true);
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
    expect(await repo.markReview('SUN-AAAAAA', 'CAP-9', 'PENDING_REVIEW')).toBe(true);
    const row = await repo.findByRef('SUN-AAAAAA');
    expect(row).toMatchObject({ status: 'review', captureId: 'CAP-9' });
    expect(row?.emailError).toBe('PAYPAL_PENDING: PENDING_REVIEW');
  });
  it('only the request that wins the race moves a pending order: markPaid/markReview return false on a non-pending row', async () => {
    const repo = memoryOrders();
    await repo.insertPending(input());
    expect(await repo.markPaid('SUN-AAAAAA', 'CAP-1')).toBe(true);
    expect(await repo.markPaid('SUN-AAAAAA', 'CAP-2')).toBe(false);
    expect((await repo.findByRef('SUN-AAAAAA'))?.captureId).toBe('CAP-1');

    const repo2 = memoryOrders();
    await repo2.insertPending(input('SUN-BBBBBB'));
    expect(await repo2.markReview('SUN-BBBBBB', 'CAP-9', 'ECHECK')).toBe(true);
    expect(await repo2.markReview('SUN-BBBBBB', 'CAP-10', 'ECHECK')).toBe(false);
    expect(await repo2.markPaid('SUN-BBBBBB', 'CAP-11')).toBe(false);
  });
});

describe('d1Orders', () => {
  it('writes parameterised SQL (no string interpolation of values), guards markPaid/markReview to pending rows, and reports whether the row moved', async () => {
    const calls: { sql: string; args: unknown[] }[] = [];
    let changes = 1;
    const db = {
      prepare: (sql: string) => ({
        bind: (...args: unknown[]) => { calls.push({ sql, args }); return { run: async () => ({ meta: { changes } }), first: async () => null }; },
      }),
    };
    const repo = d1Orders(db);
    await repo.insertPending(input());
    expect(await repo.markPaid('SUN-AAAAAA', 'CAP-1')).toBe(true);
    changes = 0;
    expect(await repo.markPaid('SUN-AAAAAA', 'CAP-1b')).toBe(false);
    changes = 1;
    expect(await repo.markReview('SUN-AAAAAA', 'CAP-2', 'PENDING_REVIEW')).toBe(true);
    for (const c of calls) {
      expect(c.sql).not.toContain('SUN-AAAAAA');
      expect(c.sql).toMatch(/\?/);
    }
    expect(calls[0].args).toContain('SUN-AAAAAA');
    const markPaidCalls = calls.filter((c) => c.sql.includes("status = 'paid'"));
    for (const c of markPaidCalls) expect(c.sql).toMatch(/WHERE ref = \? AND status = 'pending'/);
    const reviewCall = calls[calls.length - 1];
    expect(reviewCall.sql).toMatch(/status = 'review'/);
    expect(reviewCall.sql).toMatch(/WHERE ref = \? AND status = 'pending'/);
    expect(reviewCall.args).toContain('CAP-2');
    expect(reviewCall.args).toContain('PAYPAL_PENDING: PENDING_REVIEW');
  });
});

describe('newRef', () => {
  it('makes SUN- plus 6 base36 characters', () => {
    expect(newRef()).toMatch(/^SUN-[0-9A-Z]{6}$/);
    expect(newRef(() => 0)).toBe('SUN-000000');
  });
});

describe('d1Orders changed-row reporting', () => {
  it('fails loudly when D1 returns no meta.changes', async () => {
    const db = { prepare: () => ({ bind: () => ({ run: async () => ({}), first: async () => null }) }) };
    await expect(d1Orders(db).markPaid('SUN-AAAAAA', 'CAP-1')).rejects.toThrow('meta.changes');
  });
});

describe('deleteStalePending', () => {
  it('memory: deletes only pending orders older than the cutoff and returns the count', async () => {
    const repo = memoryOrders();
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
      await repo.insertPending(input('SUN-OLDPND'));
      await repo.insertPending(input('SUN-OLDPAD'));
      await repo.markPaid('SUN-OLDPAD', 'CAP-1');
      vi.setSystemTime(new Date('2026-05-01T00:00:00Z'));
      await repo.insertPending(input('SUN-NEWPND'));
      expect(await repo.deleteStalePending(90)).toBe(1);
      expect(await repo.findByRef('SUN-OLDPND')).toBeNull();
      expect(await repo.findByRef('SUN-OLDPAD')).not.toBeNull();
      expect(await repo.findByRef('SUN-NEWPND')).not.toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
  it('d1: runs a parameterised DELETE of pending rows and returns meta.changes', async () => {
    const calls: { sql: string; args: unknown[] }[] = [];
    const db = {
      prepare: (sql: string) => ({
        bind: (...args: unknown[]) => { calls.push({ sql, args }); return { run: async () => ({ meta: { changes: 3 } }), first: async () => null }; },
      }),
    };
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2026-06-01T00:00:00Z'));
      expect(await d1Orders(db).deleteStalePending(90)).toBe(3);
    } finally {
      vi.useRealTimers();
    }
    expect(calls[0].sql).toBe("DELETE FROM orders WHERE status = 'pending' AND created_at < ?");
    expect(calls[0].args).toEqual(['2026-03-03T00:00:00.000Z']);
  });
});
