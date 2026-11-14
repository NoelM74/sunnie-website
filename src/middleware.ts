import { defineMiddleware } from 'astro:middleware';
import { site } from './data/site';

/** Bag and checkout routes throw if a secret is missing or malformed (see getEnv).
 * Without this, the buyer sees a blank 500. Instead: log the cause, show a short
 * "briefly unavailable" page, and for config errors name the failing key (never its
 * value) in a header so a misconfigured deploy can be diagnosed with curl. */
const SECURITY_HEADERS: [string, string][] = [
  ['Strict-Transport-Security', 'max-age=31536000'],
  ['X-Content-Type-Options', 'nosniff'],
  ['X-Frame-Options', 'DENY'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()'],
  ['Content-Security-Policy', "frame-ancestors 'none'; base-uri 'self'; object-src 'none'"],
];

export const onRequest = defineMiddleware(async (ctx, next) => {
  try {
    // Astro turns a throw inside a page into its own blank 500, so check config up front.
    if (!ctx.isPrerendered && /^\/(bag|checkout)\//.test(ctx.url.pathname) && ctx.url.pathname !== '/checkout/cancel/') {
      // Loaded lazily: lib/env imports cloudflare:workers, which the Node prerender step can't load.
      const { getEnv } = await import('./lib/env');
      getEnv();
    }
    const res = await next();
    // Pages served by the Worker (bag, checkout) get the same security headers as the
    // static pages, which take theirs from public/_headers.
    if (!ctx.isPrerendered) for (const [k, v] of SECURITY_HEADERS) if (!res.headers.has(k)) res.headers.set(k, v);
    return res;
  } catch (err) {
    const e = err as Error;
    console.error('route failed', ctx.url.pathname, e?.name, e?.message);
    const config = /^Checkout is not configured: (\w+)/.exec(e?.message ?? '');
    const headers: Record<string, string> = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' };
    if (config) headers['x-sunnie-config'] = config[1];
    const body = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Checkout is briefly unavailable | Sunnie Designs</title></head><body style="font-family:system-ui,sans-serif;max-width:36rem;margin:3rem auto;padding:0 1rem;line-height:1.5"><h1>Checkout is briefly unavailable</h1><p>Sorry, something went wrong on our side and nothing has been charged. Please try again in a few minutes, or email <a href="mailto:${site.email.hello}">${site.email.hello}</a> and we'll help.</p><p><a href="/shop/">Back to the shop</a></p></body></html>`;
    return new Response(body, { status: 503, headers });
  }
});
