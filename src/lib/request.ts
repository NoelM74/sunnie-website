export function isSameOrigin(request: Request, alsoAllow: string[] = []): boolean {
  const origin = request.headers.get('origin');
  if (origin) return origin === new URL(request.url).origin || alsoAllow.includes(origin);
  const site = request.headers.get('sec-fetch-site');
  if (site) return site === 'same-origin' || site === 'none';
  return true;
}
