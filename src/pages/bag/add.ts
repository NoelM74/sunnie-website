import type { APIRoute } from 'astro';
import { getEnv } from '../../lib/env';
import { loadCatalog } from '../../lib/catalog';
import { BAG_COOKIE, decodeBag, encodeBag } from '../../lib/bag-cookie';
import { handleBagPost } from '../../lib/bag-routes';
import { isSameOrigin } from '../../lib/request';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!isSameOrigin(request)) return new Response('Forbidden', { status: 403 });
  const env = getEnv();
  const catalog = await loadCatalog((p) => env.ASSETS.fetch(new Request(new URL(p, request.url))));
  const bag = await decodeBag(cookies.get(BAG_COOKIE)?.value, env.BAG_SECRET);
  const { lines, notice } = handleBagPost('add', await request.formData(), bag, catalog);
  cookies.set(BAG_COOKIE, await encodeBag(lines, env.BAG_SECRET), { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 });
  const res = redirect(`/bag/?n=${notice}`, 303);
  res.headers.set('Cache-Control', 'no-store');
  return res;
};
