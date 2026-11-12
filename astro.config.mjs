// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://sunniedesigns.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  output: 'static',
  adapter: cloudflare({
    // Prerender in Node so sharp image processing and content collections behave exactly as before.
    prerenderEnvironment: 'node',
    // 'compile' (as the brief suggested) routes build-time image processing through the
    // adapter's workerd-based image service instead of Astro's default sharp service: it
    // produces different bytes (different encoder, larger output - measured ~2.2x dist size)
    // for every optimized image, breaking byte-for-byte equivalence. 'custom' is the
    // adapter's escape hatch (see setImageConfig's `case "custom": return { ...config }`
    // in node_modules/@astrojs/cloudflare/dist/utils/image-config.js) that leaves
    // Astro's own image config - and therefore sharp - untouched. There is no runtime
    // Cloudflare Images binding, which is fine: every page is prerendered, so there is no
    // /_image endpoint to serve at request time.
    imageService: 'custom',
  }),
  // We don't use Astro sessions. `driver: 'memory'` (a plain string) resolves via Astro's
  // deprecated string-driver signature and logs a warning; the equivalent non-deprecated
  // form points straight at unstorage's in-memory driver entrypoint. Either way this is a
  // no-op in-memory driver, which stops the adapter from auto-provisioning a SESSION KV
  // binding (it only does that when `session.driver` is left unconfigured).
  session: { driver: { entrypoint: 'unstorage/drivers/memory' } },
  integrations: [
    sitemap({
      // Path-exact matching, not substring `.includes()`: the brief's original
      // `!page.includes('/bag')` also matched the existing `/shop/bags/` category page
      // (it contains the substring "/bag"), silently dropping a real, live page from the
      // sitemap. Compare against the parsed pathname instead so only the future cart page
      // (`/bag/`) and checkout routes (`/checkout/...`) are excluded.
      filter: (page) => {
        const path = new URL(page).pathname;
        return path !== '/404/' && path !== '/bag/' && !path.startsWith('/checkout/');
      },
    }),
  ],
});
