import type { BagLine } from './pricing';

export const BAG_COOKIE = 'sunnie_bag';
export const ORDER_COOKIE = 'sunnie_order';

const enc = new TextEncoder();
const b64url = (bytes: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const toB64url = (s: string) => b64url(enc.encode(s).buffer as ArrayBuffer);
const fromB64url = (s: string) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)));

async function hmac(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(value)));
}

export async function signValue(value: string, secret: string): Promise<string> {
  return `${value}.${await hmac(value, secret)}`;
}

export async function verifyValue(signed: string | undefined, secret: string): Promise<string | null> {
  if (!signed) return null;
  const i = signed.lastIndexOf('.');
  if (i <= 0) return null;
  const value = signed.slice(0, i);
  const expected = await hmac(value, secret);
  const given = signed.slice(i + 1);
  if (given.length !== expected.length) return null;
  let diff = 0;
  for (let k = 0; k < given.length; k++) diff |= given.charCodeAt(k) ^ expected.charCodeAt(k);
  return diff === 0 ? value : null;
}

export async function encodeBag(lines: BagLine[], secret: string): Promise<string> {
  return signValue(toB64url(JSON.stringify(lines)), secret);
}

export async function decodeBag(cookie: string | undefined, secret: string): Promise<BagLine[]> {
  const payload = await verifyValue(cookie, secret);
  if (!payload) return [];
  try {
    const raw = JSON.parse(fromB64url(payload));
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((l) => l && typeof l.slug === 'string' && Number.isFinite(l.qty))
      .slice(0, 20)
      .map((l) => (typeof l.option === 'string' ? { slug: l.slug, option: l.option, qty: l.qty } : { slug: l.slug, qty: l.qty }));
  } catch {
    return [];
  }
}
