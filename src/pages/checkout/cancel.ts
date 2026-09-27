import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ redirect }) => {
  const res = redirect('/bag/?cancelled=1', 303);
  res.headers.set('Cache-Control', 'no-store');
  return res;
};
