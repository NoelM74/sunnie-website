import { describe, expect, it } from 'vitest';
import { decodeBag, encodeBag, signValue, verifyValue } from '../../src/lib/bag-cookie';

const S = 'test-secret-0123456789';

describe('signed values', () => {
  it('round-trips', async () => {
    expect(await verifyValue(await signValue('SUN-ABC123', S), S)).toBe('SUN-ABC123');
  });
  it('rejects tampering and wrong secrets', async () => {
    const signed = await signValue('SUN-ABC123', S);
    expect(await verifyValue(signed.replace('ABC', 'XYZ'), S)).toBeNull();
    expect(await verifyValue(signed, 'other-secret')).toBeNull();
    expect(await verifyValue(undefined, S)).toBeNull();
    expect(await verifyValue('garbage', S)).toBeNull();
  });
});

describe('bag cookie', () => {
  it('round-trips bag lines', async () => {
    const lines = [{ slug: 'frog', option: 'Pink', qty: 2 }, { slug: 'coaster', qty: 1 }];
    expect(await decodeBag(await encodeBag(lines, S), S)).toEqual(lines);
  });
  it('returns an empty bag for bad input', async () => {
    expect(await decodeBag(undefined, S)).toEqual([]);
    expect(await decodeBag('x.y', S)).toEqual([]);
    const forged = Buffer.from(JSON.stringify([{ slug: 'frog', qty: 1 }])).toString('base64url') + '.AAAA';
    expect(await decodeBag(forged, S)).toEqual([]);
  });
  it('clamps quantities from a validly signed cookie to 1..5', async () => {
    const signed = await signValue(Buffer.from(JSON.stringify([{ slug: 'a', qty: 99 }, { slug: 'b', qty: -3 }, { slug: 'c', qty: 2.7 }])).toString('base64url'), S);
    expect((await decodeBag(signed, S)).map((l) => l.qty)).toEqual([5, 1, 2]);
  });
  it('drops malformed lines from a validly signed cookie', async () => {
    const signed = await signValue(Buffer.from(JSON.stringify([{ slug: 'ok', qty: 1 }, { slug: 5 }, { qty: 2 }])).toString('base64url'), S);
    expect(await decodeBag(signed, S)).toEqual([{ slug: 'ok', qty: 1 }]);
  });
});
