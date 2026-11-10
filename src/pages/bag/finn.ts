import type { APIRoute } from 'astro';
import { getEnv } from '../../lib/env';
import { loadCatalog } from '../../lib/catalog';
import { BAG_COOKIE, decodeBag, saveBag } from '../../lib/bag-cookie';
import { handleBagPost } from '../../lib/bag-routes';
import { FINN_SLUG } from '../../lib/finn';

export const prerender = false;

// The Finn page (finn.sunniedesigns.com) sends buyers here with a plain link.
// Astro refuses form posts from another site, so this is a GET that can only
// add one Finn bundle, then shows the bag.
export const GET: APIRoute = async ({ request, url, cookies, redirect }) => {
  const env = getEnv();
  const catalog = await loadCatalog((p) => env.ASSETS.fetch(new Request(new URL(p, request.url))));
  const bag = await decodeBag(cookies.get(BAG_COOKIE)?.value, env.BAG_SECRET);
  const form = new FormData();
  form.set('slug', FINN_SLUG);
  form.set('option', url.searchParams.get('option') ?? '');
  form.set('qty', '1');
  const { lines, notice } = handleBagPost('add', form, bag, catalog);
  await saveBag(cookies, lines, env.BAG_SECRET);
  const res = redirect(`/bag/?n=${notice}`, 303);
  res.headers.set('Cache-Control', 'no-store');
  res.headers.set('X-Robots-Tag', 'noindex');
  return res;
};
