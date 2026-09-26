# Sunnie Designs Phase 2 (bag and PayPal checkout) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let buyers add products to a bag and pay on sunniedesigns.com through PayPal's hosted checkout (PayPal account or guest card), with order records in D1 and confirmation emails, while every existing page stays static and script-free.

**Architecture:**
- Astro 6 stays `output: 'static'`. The `@astrojs/cloudflare` adapter adds a few on-demand routes: the bag, checkout and the PayPal return.
- All business logic lives in pure TypeScript modules under `src/lib/` that take their dependencies as arguments (catalog, secret, orders repo, PayPal client, mailer). Vitest unit-tests them with in-memory fakes.
- Astro route files are thin wrappers that read `cloudflare:workers` env and cookies, call a handler, and turn the result into a response.
- Prices come only from a build-time `catalog.json` generated from the product collection.

**Tech Stack:**
- Astro 6.4
- `@astrojs/cloudflare` 13.7.0
- Wrangler 4
- Cloudflare D1
- PayPal Orders v2 REST (redirect flow)
- Resend REST API
- Vitest 4
- Web Crypto (HMAC-SHA256)

**Spec:** `docs/superpowers/specs/2026-09-26-sunnie-checkout-design.md`

## Global Constraints

**Branch and deploy**
- Work on branch `phase2-checkout`. `main` is live and must not change until the final task.

**Scripts and styling**
- **No client-side JavaScript on any page.** The only `<script>` tags allowed are `type="application/ld+json"`. Every interaction is an HTML form POST or a link.
- CSS goes only in `src/styles/global.css`, using the tokens in `src/styles/tokens.css`. No Tailwind, no UI framework.

**Money and business rules**
- Money is integer cents everywhere in code. It's formatted with the existing `formatPrice(eur)` only at render time: `formatPrice(cents / 100)`.
- Shipping is `500` cents flat. It's free when the item subtotal is `>= 4900` cents. The currency is EUR only.
- There are at most 5 of any one design per bag line and at most 20 lines per bag. `inStock: false` products can't be added.
- Every product has at most **one** option group (`options.length <= 1`). A bag line stores that option's chosen value as `option?: string`.

**Seller details**
- Seller identity, word for word: **Springfield Tectop Limited**, trading as **Sunnie Designs**, CRO **571256**, registered office **Clareview Car Sales, Ennis Road, Co. Limerick, V94 EA3A**, `hello@sunniedesigns.com`. Not VAT-registered, so show no VAT line.
- Returns: within **30 days of delivery**, the buyer pays return postage, and we refund the item price plus the original shipping within 14 days of receiving the return.
- Dispatch: "Ships within 3–5 days with tracking" (`site.shipsIn` = `'3–5 days'`).

**Copy**
- No em dashes, no exclamation marks, no emoji, no hype words. Use sentence case.
- Never state a country of manufacture. No gendered pronouns for Hui or Nollaig.
- Never link to eBay. Never render the "noel francis" review.

**Secrets and private data**
- Secrets come only from env: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV` (`sandbox` | `live`), `RESEND_API_KEY`, `BAG_SECRET`, `ORDER_NOTIFY_EMAIL`, `ORDER_FROM_EMAIL`. Never commit secrets. `.dev.vars` stays gitignored.
- Never commit `brand/`, `.superpowers/` or `shop_settings.json`.

**Commits**
- Every commit message ends with a blank line and `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## File structure

```
astro.config.mjs                  + cloudflare adapter (static output, node prerender, compile images, no sessions)
wrangler.jsonc                    + main entry (adapter default), D1 binding ORDERS
migrations/0001_orders.sql        orders table
src/lib/
  money.ts                        centsToAmount, SHIPPING_FLAT_CENTS, FREE_SHIPPING_THRESHOLD_CENTS, shippingFor
  catalog.ts                      Catalog types, loadCatalog(fetchAsset)
  pricing.ts                      BagLine/PricedBag types, priceBag(lines, catalog)
  bag-cookie.ts                   signValue/verifyValue (HMAC), encodeBag/decodeBag
  bag-actions.ts                  addToBag/updateLine/removeLine (pure list operations)
  checkout-form.ts                Address type, COUNTRY_CODES, validateCheckout(form)
  orders.ts                       OrderInput/OrderRow, OrdersRepo, memoryOrders(), d1Orders(db), newRef()
  paypal.ts                       buildOrderPayload(), paypalClient()
  email.ts                        buildCustomerEmail(), buildShopEmail(), resendMailer()
  checkout-handlers.ts            handlePay(), handleReturn()
  request.ts                      isSameOrigin(request)
  env.ts                          getEnv() typed accessor over cloudflare:workers env
src/pages/
  catalog.json.ts                 prerendered catalog (prices, options, thumbnails)
  bag/index.astro                 on-demand bag page
  bag/add.ts, bag/update.ts, bag/remove.ts   on-demand POST endpoints
  checkout/index.astro            on-demand checkout form (GET) + re-render on errors (POST)
  checkout/return.ts, checkout/cancel.ts      on-demand PayPal return/cancel
  checkout/complete.astro         on-demand thank-you page
  terms.astro                     terms of sale (static)
src/components/BuyBox.astro       add-to-bag form on product pages
tests/unit/*.test.ts              money, pricing, bag-cookie, bag-actions, checkout-form, orders, paypal, email, checkout-handlers, request
docs/checkout-setup.md            owner steps: D1, PayPal sandbox/live, Resend, secrets, preview testing
```

---

### Task 1: Cloudflare adapter integration (static pages unchanged)

**Files:**
- Modify: `package.json`, `astro.config.mjs`, `wrangler.jsonc`, `.gitignore`, `tests/dist/helpers.ts`, `scripts/check-links.mjs`, `tests/dist/launch.test.ts` (if it reads `dist/` paths directly)
- Create: `src/pages/checkout/ping.ts` (temporary, deleted in Step 8), `src/lib/env.ts`

**Interfaces:**
- Produces:
  - `getEnv(): SunnieEnv` from `src/lib/env.ts`. `SunnieEnv` is `{ ORDERS: D1Like; ASSETS: { fetch(req: Request): Promise<Response> }; PAYPAL_CLIENT_ID: string; PAYPAL_CLIENT_SECRET: string; PAYPAL_ENV: 'sandbox' | 'live'; RESEND_API_KEY: string; BAG_SECRET: string; ORDER_NOTIFY_EMAIL: string; ORDER_FROM_EMAIL: string }`.
  - `D1Like` is exported from `src/lib/orders.ts` in Task 7. For now, declare it in `env.ts` as `import type { D1Like } from './orders'` and create `src/lib/orders.ts` with only the type:

    ```ts
    export interface D1Like {
      prepare(sql: string): {
        bind(...v: unknown[]): {
          run(): Promise<unknown>;
          first<T = Record<string, unknown>>(): Promise<T | null>;
        };
      };
    }
    ```
  - The built static site directory is exported as `DIST` from `tests/dist/helpers.ts`. It must point at wherever the adapter writes the static files (`dist/client` with adapter 13, or `dist` if the build output stays flat). Detect at runtime: `existsSync('dist/client/index.html') ? 'dist/client' : 'dist'`.

- [ ] **Step 1: Record the baseline**

Run: `npm run build && npm run test:dist && find dist -name "*.html" | wc -l && du -sh dist`
Expected: 250 tests pass. Note the HTML count (63) and the size in the task report.

- [ ] **Step 2: Install the adapter**

Run: `npm install @astrojs/cloudflare@13.7.0`
Expected: installs without peer-dependency errors (its peers are astro ^6.3.0 and wrangler ^4.83.0).

- [ ] **Step 3: Configure Astro**

`astro.config.mjs`:
```js
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
    // Optimise images at build time only; no Cloudflare Images binding.
    imageService: 'compile',
  }),
  // We don't use Astro sessions. A no-op driver stops the adapter from requiring a SESSION KV binding.
  session: { driver: 'memory' },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') && !page.includes('/bag') && !page.includes('/checkout') })],
});
```
If Astro rejects `session: { driver: 'memory' }`, open `node_modules/astro/dist/core/session` to find the available drivers and use Astro 6's documented no-op or memory driver. Report what you used. The goal is that the built `wrangler.json` has **no** `kv_namespaces` entry.

- [ ] **Step 4: Configure Wrangler**

`wrangler.jsonc`:
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "sunnie-website",
  "compatibility_date": "2026-09-01",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@astrojs/cloudflare/entrypoints/server",
  "assets": {
    "binding": "ASSETS",
    "directory": "./dist",
    "not_found_handling": "404-page",
    "html_handling": "auto-trailing-slash"
  },
  "d1_databases": [
    // database_id is filled in by the owner in Task 12 (npx wrangler d1 create sunnie-orders).
    { "binding": "ORDERS", "database_name": "sunnie-orders", "database_id": "00000000-0000-0000-0000-000000000000", "migrations_dir": "migrations" }
  ],
  "observability": { "enabled": true }
}
```
After building, open the adapter-generated config (`dist/server/wrangler.json` or similar) and confirm three things: `assets.directory` points at the static client output, `main` points at the built server entry, and the D1 binding is present. The adapter's Vite plugin rewrites the paths, so trust the generated file. If `assets.directory` must differ in the source config for `wrangler dev` to work, set it to what the adapter expects and explain in the report.

- [ ] **Step 5: Temporary on-demand route to prove SSR works**

`src/pages/checkout/ping.ts`:
```ts
import type { APIRoute } from 'astro';
export const prerender = false;
export const GET: APIRoute = () => new Response('pong', { headers: { 'content-type': 'text/plain' } });
```

`src/lib/env.ts`:
```ts
import { env } from 'cloudflare:workers';
import type { D1Like } from './orders';

export interface SunnieEnv {
  ORDERS: D1Like;
  ASSETS: { fetch(req: Request): Promise<Response> };
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
  PAYPAL_ENV: 'sandbox' | 'live';
  RESEND_API_KEY: string;
  BAG_SECRET: string;
  ORDER_NOTIFY_EMAIL: string;
  ORDER_FROM_EMAIL: string;
}

export function getEnv(): SunnieEnv {
  return env as unknown as SunnieEnv;
}
```
Add `.dev.vars` to `.gitignore` if it's not already there.

- [ ] **Step 6: Point the dist tests and link checker at the static output**

In `tests/dist/helpers.ts`, change the `DIST` constant:
```ts
import { existsSync } from 'node:fs';
export const DIST = existsSync(join(process.cwd(), 'dist', 'client', 'index.html'))
  ? join(process.cwd(), 'dist', 'client')
  : join(process.cwd(), 'dist');
```
Apply the same detection in `scripts/check-links.mjs` (`const DIST = ...`) and anywhere else that hardcodes `dist/` (run `grep -rn "'dist'" tests scripts`).

- [ ] **Step 7: Verify nothing static changed and SSR responds**

Run:
```bash
npm run build
npm run test:dist
npm test
npm run check
```
Expected: all pass, with the same test counts as the baseline.

Then check the static output: the HTML file count is still 63 and no page gained a `<script>` other than ld+json (the existing test enforces this).

Then run `npx wrangler dev` (it uses the adapter's generated config; if the adapter documents `npx astro preview`, use that instead) in the background and run:
```bash
curl -s http://localhost:8787/checkout/ping/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8787/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8787/no-such-page/
```
Expected: `pong`, `200`, `404`. Stop the dev server, killing only its own process ID.

- [ ] **Step 8: Remove the ping route and commit**

Delete `src/pages/checkout/ping.ts`. Rebuild and rerun `npm run test:dist`.
```bash
git add -A
git commit -m "build: add Cloudflare adapter for on-demand routes; static pages unchanged

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Money, catalog and bag pricing

**Files:**
- Create: `src/lib/money.ts`, `src/lib/catalog.ts`, `src/lib/pricing.ts`, `src/pages/catalog.json.ts`, `tests/unit/pricing.test.ts`, `tests/dist/catalog.test.ts`
- Modify: `src/content.config.ts` (make `etsyUrl` optional, and allow at most 1 option group)

**Interfaces:**
- Produces:
  - `money.ts`: `SHIPPING_FLAT_CENTS = 500`, `FREE_SHIPPING_THRESHOLD_CENTS = 4900`, `shippingFor(subtotalCents: number): number`, `centsToAmount(cents: number): string` (e.g. `2495 → "24.95"`).
  - `catalog.ts`: `interface CatalogItem { slug: string; name: string; priceCents: number; inStock: boolean; option: { name: string; values: string[] } | null; thumb: string; maker: string; featured: number | null }`, `type Catalog = Record<string, CatalogItem>`, `loadCatalog(fetchAsset: (path: string) => Promise<Response>): Promise<Catalog>`, which caches the result per isolate.
  - `pricing.ts`: `interface BagLine { slug: string; option?: string; qty: number }`, `interface PricedLine { slug: string; name: string; option?: string; qty: number; unitCents: number; lineCents: number; thumb: string }`, `interface PricedBag { lines: PricedLine[]; subtotalCents: number; shippingCents: number; totalCents: number; freeShippingGapCents: number; dropped: string[] }`, `priceBag(lines: BagLine[], catalog: Catalog): PricedBag`.
  - `/catalog.json` is a prerendered static file with the `Catalog` shape.

- [ ] **Step 1: Write failing tests**

`tests/unit/pricing.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { centsToAmount, shippingFor } from '../../src/lib/money';
import { priceBag, type BagLine } from '../../src/lib/pricing';
import type { Catalog } from '../../src/lib/catalog';

const catalog: Catalog = {
  frog: { slug: 'frog', name: 'Frog phone crossbody', priceCents: 2995, inStock: true, option: { name: 'Colour', values: ['Pink', 'Blue'] }, thumb: '/t/frog.webp', maker: 'Hui', featured: 1 },
  coaster: { slug: 'coaster', name: 'Flower coaster', priceCents: 1695, inStock: true, option: null, thumb: '/t/c.webp', maker: 'Hui', featured: null },
  gone: { slug: 'gone', name: 'Old bag', priceCents: 2000, inStock: false, option: null, thumb: '/t/g.webp', maker: 'Hui', featured: null },
};

describe('money', () => {
  it('charges €5 below €49', () => expect(shippingFor(4899)).toBe(500));
  it('ships free at exactly €49', () => expect(shippingFor(4900)).toBe(0));
  it('ships free above €49', () => expect(shippingFor(4901)).toBe(0));
  it('charges nothing for an empty bag', () => expect(shippingFor(0)).toBe(0));
  it('formats cents for PayPal', () => {
    expect(centsToAmount(2495)).toBe('24.95');
    expect(centsToAmount(500)).toBe('5.00');
    expect(centsToAmount(0)).toBe('0.00');
  });
});

describe('priceBag', () => {
  it('prices lines from the catalog, never from input', () => {
    const lines: BagLine[] = [{ slug: 'frog', option: 'Pink', qty: 1 }];
    const p = priceBag(lines, catalog);
    expect(p.lines[0]).toMatchObject({ unitCents: 2995, lineCents: 2995, name: 'Frog phone crossbody', option: 'Pink' });
    expect(p).toMatchObject({ subtotalCents: 2995, shippingCents: 500, totalCents: 3495, freeShippingGapCents: 1905 });
  });
  it('ships free once the subtotal reaches €49', () => {
    const p = priceBag([{ slug: 'frog', option: 'Blue', qty: 1 }, { slug: 'coaster', qty: 2 }], catalog);
    expect(p).toMatchObject({ subtotalCents: 6385, shippingCents: 0, totalCents: 6385, freeShippingGapCents: 0 });
  });
  it('drops unknown, sold-out and invalid-option lines and reports them', () => {
    const p = priceBag(
      [
        { slug: 'nope', qty: 1 },
        { slug: 'gone', qty: 1 },
        { slug: 'frog', option: 'Green', qty: 1 },
        { slug: 'frog', qty: 1 },
        { slug: 'coaster', option: 'Red', qty: 1 },
      ],
      catalog,
    );
    expect(p.lines).toHaveLength(0);
    expect(p.dropped).toEqual(['nope', 'Old bag', 'Frog phone crossbody', 'Frog phone crossbody', 'Flower coaster']);
    expect(p.totalCents).toBe(0);
  });
  it('clamps quantity to 1..5', () => {
    const p = priceBag([{ slug: 'coaster', qty: 9 }, { slug: 'coaster', qty: 0 }], catalog);
    expect(p.lines.map((l) => l.qty)).toEqual([5, 1]);
  });
});
```

`tests/dist/catalog.test.ts`:
```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIST } from './helpers';

describe('catalog.json', () => {
  const cat = JSON.parse(readFileSync(join(DIST, 'catalog.json'), 'utf8'));
  it('lists every product with integer prices and a thumbnail', () => {
    const items = Object.values(cat) as Array<Record<string, unknown>>;
    expect(items.length).toBeGreaterThan(40);
    for (const i of items) {
      expect(Number.isInteger(i.priceCents)).toBe(true);
      expect(String(i.thumb)).toMatch(/^\/_astro\/.+\.webp$/);
    }
  });
  it('carries the frog colour option', () => {
    expect(cat['frog-phone-crossbody'].option).toEqual({ name: 'Colour', values: ['Pink', 'Blue', 'Brown'] });
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tests/unit/pricing.test.ts`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement**

`src/lib/money.ts`:
```ts
export const SHIPPING_FLAT_CENTS = 500;
export const FREE_SHIPPING_THRESHOLD_CENTS = 4900;

export function shippingFor(subtotalCents: number): number {
  if (subtotalCents <= 0) return 0;
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS;
}

export function centsToAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}
```

`src/lib/catalog.ts`:
```ts
export interface CatalogItem {
  slug: string;
  name: string;
  priceCents: number;
  inStock: boolean;
  option: { name: string; values: string[] } | null;
  thumb: string;
  maker: string;
  featured: number | null;
}
export type Catalog = Record<string, CatalogItem>;

let cached: Catalog | null = null;

export async function loadCatalog(fetchAsset: (path: string) => Promise<Response>): Promise<Catalog> {
  if (cached) return cached;
  const res = await fetchAsset('/catalog.json');
  if (!res.ok) throw new Error(`catalog.json returned ${res.status}`);
  cached = (await res.json()) as Catalog;
  return cached;
}
```

`src/lib/pricing.ts`:
```ts
import type { Catalog } from './catalog';
import { FREE_SHIPPING_THRESHOLD_CENTS, shippingFor } from './money';

export interface BagLine { slug: string; option?: string; qty: number }
export interface PricedLine { slug: string; name: string; option?: string; qty: number; unitCents: number; lineCents: number; thumb: string }
export interface PricedBag { lines: PricedLine[]; subtotalCents: number; shippingCents: number; totalCents: number; freeShippingGapCents: number; dropped: string[] }

const clampQty = (q: number) => Math.min(5, Math.max(1, Math.trunc(Number(q)) || 1));

export function priceBag(lines: BagLine[], catalog: Catalog): PricedBag {
  const priced: PricedLine[] = [];
  const dropped: string[] = [];
  for (const line of lines) {
    const item = catalog[line.slug];
    if (!item) { dropped.push(line.slug); continue; }
    const optionOk = item.option ? !!line.option && item.option.values.includes(line.option) : !line.option;
    if (!item.inStock || !optionOk) { dropped.push(item.name); continue; }
    const qty = clampQty(line.qty);
    priced.push({ slug: item.slug, name: item.name, option: item.option ? line.option : undefined, qty, unitCents: item.priceCents, lineCents: item.priceCents * qty, thumb: item.thumb });
  }
  const subtotalCents = priced.reduce((s, l) => s + l.lineCents, 0);
  const shippingCents = shippingFor(subtotalCents);
  return {
    lines: priced,
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
    freeShippingGapCents: subtotalCents > 0 && subtotalCents < FREE_SHIPPING_THRESHOLD_CENTS ? FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents : 0,
    dropped,
  };
}
```

`src/pages/catalog.json.ts`:
```ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import type { Catalog } from '../lib/catalog';

export const prerender = true;

export const GET: APIRoute = async () => {
  const products = await getCollection('products');
  const entries = await Promise.all(
    products.map(async (p) => {
      const thumb = await getImage({ src: p.data.images[0].src, width: 160, height: 160, fit: 'cover', format: 'webp' });
      const opt = p.data.options[0];
      return [p.id, {
        slug: p.id,
        name: p.data.name,
        priceCents: Math.round(p.data.price * 100),
        inStock: p.data.inStock,
        option: opt ? { name: opt.name, values: opt.values } : null,
        thumb: thumb.src,
        maker: p.data.maker,
        featured: p.data.featured ?? null,
      }] as const;
    }),
  );
  const catalog: Catalog = Object.fromEntries(entries);
  return new Response(JSON.stringify(catalog), { headers: { 'content-type': 'application/json' } });
};
```

In `src/content.config.ts`:
- change `etsyUrl: z.url(),` to `etsyUrl: z.url().optional(),`
- change the options line so it rejects more than one option group:
  `options: z.array(z.object({ name: z.string(), values: z.array(z.string()).min(1) })).max(1, 'Only one option group per product is supported by the bag').default([]),`

Fix any TypeScript errors this surfaces. The product page currently uses `d.etsyUrl` unguarded; Task 4 replaces that markup, but for now guard it with `{d.etsyUrl && (...)}` so `npm run check` passes.

- [ ] **Step 4: Run the tests**

Run: `npx vitest run tests/unit/pricing.test.ts && npm run build && npx vitest run tests/dist/catalog.test.ts && npm run check`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: server-side pricing, shipping rule and build-time catalog

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Signed bag cookie and bag list operations

**Files:**
- Create: `src/lib/bag-cookie.ts`, `src/lib/bag-actions.ts`, `src/lib/request.ts`, `tests/unit/bag-cookie.test.ts`, `tests/unit/bag-actions.test.ts`, `tests/unit/request.test.ts`

**Interfaces:**
- Consumes: `BagLine` from `src/lib/pricing.ts`.
- Produces:
  - `BAG_COOKIE = 'sunnie_bag'`, `ORDER_COOKIE = 'sunnie_order'`
  - `signValue(value: string, secret: string): Promise<string>` returns `value + '.' + base64url(hmac)`
  - `verifyValue(signed: string | undefined, secret: string): Promise<string | null>`
  - `encodeBag(lines: BagLine[], secret: string): Promise<string>`
  - `decodeBag(cookie: string | undefined, secret: string): Promise<BagLine[]>`, which returns `[]` on any problem
  - `bag-actions.ts`: `addLine(lines, {slug, option, qty})`, `updateLine(lines, index, qty)`, `removeLine(lines, index)`. All return a new `BagLine[]`, merge the same slug+option, cap qty at 5 and cap the list at 20 lines.
  - `request.ts`: `isSameOrigin(request: Request): boolean`

- [ ] **Step 1: Write failing tests**

`tests/unit/bag-cookie.test.ts`:
```ts
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
  it('drops malformed lines from a validly signed cookie', async () => {
    const signed = await signValue(Buffer.from(JSON.stringify([{ slug: 'ok', qty: 1 }, { slug: 5 }, { qty: 2 }])).toString('base64url'), S);
    expect(await decodeBag(signed, S)).toEqual([{ slug: 'ok', qty: 1 }]);
  });
});
```

`tests/unit/bag-actions.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { addLine, removeLine, updateLine } from '../../src/lib/bag-actions';

describe('bag actions', () => {
  it('adds and merges the same slug and option', () => {
    const a = addLine([], { slug: 'frog', option: 'Pink', qty: 1 });
    const b = addLine(a, { slug: 'frog', option: 'Pink', qty: 2 });
    expect(b).toEqual([{ slug: 'frog', option: 'Pink', qty: 3 }]);
    expect(addLine(b, { slug: 'frog', option: 'Blue', qty: 1 })).toHaveLength(2);
  });
  it('caps quantity at 5 and lines at 20', () => {
    expect(addLine([{ slug: 'a', qty: 4 }], { slug: 'a', qty: 4 })[0].qty).toBe(5);
    const twenty = Array.from({ length: 20 }, (_, i) => ({ slug: `p${i}`, qty: 1 }));
    expect(addLine(twenty, { slug: 'new', qty: 1 })).toEqual(twenty);
  });
  it('updates and removes by index, ignoring bad indexes', () => {
    const lines = [{ slug: 'a', qty: 1 }, { slug: 'b', qty: 1 }];
    expect(updateLine(lines, 1, 3)[1].qty).toBe(3);
    expect(updateLine(lines, 9, 3)).toEqual(lines);
    expect(removeLine(lines, 0)).toEqual([{ slug: 'b', qty: 1 }]);
    expect(removeLine(lines, -1)).toEqual(lines);
  });
});
```

`tests/unit/request.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { isSameOrigin } from '../../src/lib/request';

const req = (headers: Record<string, string>) => new Request('https://sunniedesigns.com/bag/add/', { method: 'POST', headers });

describe('isSameOrigin', () => {
  it('accepts a matching Origin', () => expect(isSameOrigin(req({ origin: 'https://sunniedesigns.com' }))).toBe(true));
  it('rejects a foreign Origin', () => expect(isSameOrigin(req({ origin: 'https://evil.example' }))).toBe(false));
  it('falls back to Sec-Fetch-Site', () => {
    expect(isSameOrigin(req({ 'sec-fetch-site': 'same-origin' }))).toBe(true);
    expect(isSameOrigin(req({ 'sec-fetch-site': 'cross-site' }))).toBe(false);
  });
  it('allows requests with neither header (old browsers)', () => expect(isSameOrigin(req({}))).toBe(true));
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tests/unit/bag-cookie.test.ts tests/unit/bag-actions.test.ts tests/unit/request.test.ts`
Expected: FAIL (modules missing).

- [ ] **Step 3: Implement**

`src/lib/bag-cookie.ts`:
```ts
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
```

`src/lib/bag-actions.ts`:
```ts
import type { BagLine } from './pricing';

const MAX_QTY = 5;
const MAX_LINES = 20;
const clamp = (q: number) => Math.min(MAX_QTY, Math.max(1, Math.trunc(q) || 1));

export function addLine(lines: BagLine[], add: BagLine): BagLine[] {
  const i = lines.findIndex((l) => l.slug === add.slug && (l.option ?? '') === (add.option ?? ''));
  if (i >= 0) return lines.map((l, k) => (k === i ? { ...l, qty: clamp(l.qty + add.qty) } : l));
  if (lines.length >= MAX_LINES) return lines;
  return [...lines, { ...add, qty: clamp(add.qty) }];
}

export function updateLine(lines: BagLine[], index: number, qty: number): BagLine[] {
  if (!Number.isInteger(index) || index < 0 || index >= lines.length) return lines;
  return lines.map((l, k) => (k === index ? { ...l, qty: clamp(qty) } : l));
}

export function removeLine(lines: BagLine[], index: number): BagLine[] {
  if (!Number.isInteger(index) || index < 0 || index >= lines.length) return lines;
  return lines.filter((_, k) => k !== index);
}
```

`src/lib/request.ts`:
```ts
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (origin) return origin === new URL(request.url).origin;
  const site = request.headers.get('sec-fetch-site');
  if (site) return site === 'same-origin' || site === 'none';
  return true;
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: signed bag cookie, bag list operations and same-origin check

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Buy box on product pages and the Bag link in the header

**Files:**
- Create: `src/components/BuyBox.astro`
- Modify: `src/pages/products/[slug].astro`, `src/components/Header.astro`, `src/styles/global.css`, `tests/dist/product.test.ts`, `tests/dist/launch.test.ts`

**Interfaces:**
- Consumes: the product entry (`d.options[0]`, `d.inStock`, `d.etsyUrl?`).
- Produces: `<BuyBox slug option inStock etsyUrl />`. It posts `slug`, `option` and `qty` to `/bag/add/`.

- [ ] **Step 1: Update the dist tests first**

In `tests/dist/product.test.ts`, replace the buy-action assertion with:
```ts
expect(html).toMatch(/<form[^>]*method="post"[^>]*action="\/bag\/add\/"|class="btn btn-disabled btn-block"/);
expect(html).toContain('Free worldwide shipping on orders over €49');
```
Add a test:
```ts
it('frog page offers its colour choices as required radios', () => {
  const html = page('/products/frog-phone-crossbody/');
  for (const c of ['Pink', 'Blue', 'Brown']) expect(html).toMatch(new RegExp(`type="radio"[^>]*name="option"[^>]*value="${c}"`));
  expect(html).toMatch(/type="radio"[^>]*required/);
});
```
In `tests/dist/launch.test.ts`, change the first launch-gate test so it passes when every product page that has an Etsy link points it at `/listing/<id>`. The Etsy link now has `class="etsy-link"`:
```ts
return /class="etsy-link"/.test(h) && !/class="etsy-link" href="https:\/\/www\.etsy\.com\/listing\/\d+/.test(h);
```
Add a test in `tests/dist/site.test.ts` that every page's header contains `href="/bag/"`.

Run `npm run build && npm run test:dist`. Expected: FAIL on the new assertions.

- [ ] **Step 2: Create `src/components/BuyBox.astro`**

```astro
---
interface Props {
  slug: string;
  option?: { name: string; values: string[] };
  inStock: boolean;
  etsyUrl?: string;
}
const { slug, option, inStock, etsyUrl } = Astro.props;
---
{inStock ? (
  <form class="buy-form" method="post" action="/bag/add/">
    <input type="hidden" name="slug" value={slug} />
    {option && (
      <fieldset class="choice">
        <legend>{option.name}</legend>
        <div class="choice-list">
          {option.values.map((v) => (
            <label class="choice-opt">
              <input type="radio" name="option" value={v} required checked={option.values.length === 1} />
              <span>{v}</span>
            </label>
          ))}
        </div>
      </fieldset>
    )}
    <label class="qty">
      <span>Quantity</span>
      <select name="qty">
        {[1, 2, 3, 4, 5].map((n) => <option value={n}>{n}</option>)}
      </select>
    </label>
    <button class="btn btn-primary btn-block" type="submit">Add to bag</button>
    <p class="small buy-note">Free worldwide shipping on orders over €49 · 30-day returns</p>
  </form>
) : (
  <span class="btn btn-disabled btn-block">Sold out</span>
)}
{etsyUrl && (
  <p class="small"><a class="etsy-link" href={etsyUrl} rel="noopener">Also available on our Etsy shop</a></p>
)}
```

- [ ] **Step 3: Use it on the product page**

In `src/pages/products/[slug].astro`, replace the whole `{d.inStock ? (…Buy on Etsy…) : (…Sold out…)}` block, and the options `<p class="product-option">` lines above it, with:
```astro
<BuyBox slug={product.id} option={d.options[0]} inStock={d.inStock} etsyUrl={d.etsyUrl} />
```
Import `BuyBox` at the top, and remove the now-unused `optionNames` constant.

- [ ] **Step 4: Add the Bag link to the header**

In `src/components/Header.astro`, after the desktop `<nav>` and before `<details class="menu">`, add:
```astro
<a class="bag-link" href="/bag/" aria-current={Astro.url.pathname === '/bag/' ? 'page' : undefined}>Bag</a>
```
Append to `src/styles/global.css`:
```css
/* Buy box */
.buy-form { display: grid; gap: 1rem; margin-top: 1rem; }
.choice { border: 0; margin: 0; padding: 0; }
.choice legend { font-weight: 700; margin-bottom: 0.5rem; }
.choice-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.choice-opt { position: relative; }
.choice-opt input { position: absolute; opacity: 0; inset: 0; margin: 0; cursor: pointer; }
.choice-opt span {
  display: inline-flex; align-items: center; min-height: 48px; padding: 0 1.1rem;
  border: 2px solid var(--border-strong); border-radius: 999px; background: var(--linen);
  font-weight: 700; transition: border-color var(--transition), background-color var(--transition);
}
.choice-opt input:checked + span { border-color: var(--terracotta); background: var(--sand); color: var(--terracotta-deep); }
.choice-opt input:focus-visible + span { outline: var(--focus-ring); outline-offset: 3px; }
.qty { display: inline-flex; align-items: center; gap: 0.75rem; font-weight: 700; }
.qty select { min-height: 48px; padding: 0 2rem 0 0.9rem; border: 2px solid var(--border-strong); border-radius: var(--radius-sm); background: var(--linen); color: var(--umber); font: inherit; }
.buy-note { margin: 0; color: var(--umber-muted); }
.etsy-link { color: var(--terracotta); }

/* Header bag link */
.header-inner { gap: 0.25rem 1.25rem; }
.bag-link {
  display: inline-flex; align-items: center; min-height: 48px; padding: 0 0.9rem;
  border: 2px solid var(--terracotta); border-radius: 999px;
  color: var(--terracotta-deep); font-weight: 700; text-decoration: none;
}
.bag-link:hover { background: var(--sand); color: var(--terracotta-deep); }
@media (max-width: 48rem) { .bag-link { margin-left: auto; min-height: 44px; padding: 0 0.8rem; } }
```
If the header's flex layout puts the Bag link in the wrong place, adjust with `order` or `margin-left: auto` so that desktop reads `logo … nav · Bag` and mobile reads `logo … Bag · Menu`. Keep the 48px targets.

- [ ] **Step 5: Build, test and look**

Run: `npm run build && npm run test:dist && npm run check`
Expected: PASS.

Serve the build (`npx wrangler dev`, or `npx astro preview` if Task 1 found that works) and screenshot `/products/frog-phone-crossbody/` at 390px and 1280px. Save both under `.superpowers/sdd/shots/` and describe them in the report. Stop only your own server process.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add-to-bag buy box with option choices; Bag link in header

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Bag page and bag endpoints

**Files:**
- Create: `src/pages/bag/index.astro`, `src/pages/bag/add.ts`, `src/pages/bag/update.ts`, `src/pages/bag/remove.ts`, `src/lib/bag-routes.ts`, `tests/unit/bag-routes.test.ts`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `loadCatalog`, `priceBag`, `decodeBag`/`encodeBag`, `addLine`/`updateLine`/`removeLine`, `isSameOrigin`, `getEnv`, `BAG_COOKIE`.
- Produces: `bag-routes.ts` with `handleBagPost(action: 'add' | 'update' | 'remove', form: FormData, bag: BagLine[], catalog: Catalog): { lines: BagLine[]; notice: 'added' | 'updated' | 'removed' | 'invalid' }`. The route files call it, then set the cookie and send a 303 redirect to `/bag/?n=<notice>`.

- [ ] **Step 1: Write failing tests**

`tests/unit/bag-routes.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { handleBagPost } from '../../src/lib/bag-routes';
import type { Catalog } from '../../src/lib/catalog';

const catalog: Catalog = {
  frog: { slug: 'frog', name: 'Frog', priceCents: 2995, inStock: true, option: { name: 'Colour', values: ['Pink', 'Blue'] }, thumb: '', maker: 'Hui', featured: 1 },
  coaster: { slug: 'coaster', name: 'Coaster', priceCents: 1695, inStock: true, option: null, thumb: '', maker: 'Hui', featured: null },
  gone: { slug: 'gone', name: 'Gone', priceCents: 1000, inStock: false, option: null, thumb: '', maker: 'Hui', featured: null },
};
const fd = (o: Record<string, string>) => { const f = new FormData(); for (const [k, v] of Object.entries(o)) f.set(k, v); return f; };

describe('handleBagPost', () => {
  it('adds a valid product with its option', () => {
    expect(handleBagPost('add', fd({ slug: 'frog', option: 'Pink', qty: '2' }), [], catalog)).toEqual({ lines: [{ slug: 'frog', option: 'Pink', qty: 2 }], notice: 'added' });
  });
  it('rejects unknown, sold-out, missing-option and bad-option adds', () => {
    for (const f of [{ slug: 'nope' }, { slug: 'gone' }, { slug: 'frog' }, { slug: 'frog', option: 'Green' }, { slug: 'coaster', option: 'Red' }]) {
      expect(handleBagPost('add', fd({ qty: '1', ...f }), [], catalog)).toEqual({ lines: [], notice: 'invalid' });
    }
  });
  it('updates and removes by index', () => {
    const bag = [{ slug: 'coaster', qty: 1 }];
    expect(handleBagPost('update', fd({ index: '0', qty: '4' }), bag, catalog)).toEqual({ lines: [{ slug: 'coaster', qty: 4 }], notice: 'updated' });
    expect(handleBagPost('remove', fd({ index: '0' }), bag, catalog)).toEqual({ lines: [], notice: 'removed' });
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tests/unit/bag-routes.test.ts`
Expected: FAIL (module missing).

- [ ] **Step 3: Implement `src/lib/bag-routes.ts`**

```ts
import type { Catalog } from './catalog';
import type { BagLine } from './pricing';
import { addLine, removeLine, updateLine } from './bag-actions';

type Notice = 'added' | 'updated' | 'removed' | 'invalid';

export function handleBagPost(action: 'add' | 'update' | 'remove', form: FormData, bag: BagLine[], catalog: Catalog): { lines: BagLine[]; notice: Notice } {
  const qty = Number(form.get('qty') ?? 1);
  if (action === 'add') {
    const slug = String(form.get('slug') ?? '');
    const option = form.get('option');
    const item = catalog[slug];
    if (!item || !item.inStock) return { lines: bag, notice: 'invalid' };
    const opt = typeof option === 'string' && option !== '' ? option : undefined;
    const optionOk = item.option ? !!opt && item.option.values.includes(opt) : !opt;
    if (!optionOk) return { lines: bag, notice: 'invalid' };
    return { lines: addLine(bag, opt ? { slug, option: opt, qty } : { slug, qty }), notice: 'added' };
  }
  const index = Number(form.get('index'));
  if (action === 'update') return { lines: updateLine(bag, index, qty), notice: 'updated' };
  return { lines: removeLine(bag, index), notice: 'removed' };
}
```

- [ ] **Step 4: Route files**

`src/pages/bag/add.ts` (repeat it for `update.ts` and `remove.ts`, changing only the action literal):
```ts
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
  return redirect(`/bag/?n=${notice}`, 303);
};
```
Check that the endpoints answer at `/bag/add/` (trailing slash) with `trailingSlash: 'always'`. If Astro serves endpoints without the slash, change the form `action`s to match what Astro serves, and say so in the report.

- [ ] **Step 5: Bag page `src/pages/bag/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getEnv } from '../../lib/env';
import { loadCatalog } from '../../lib/catalog';
import { BAG_COOKIE, decodeBag, encodeBag } from '../../lib/bag-cookie';
import { priceBag } from '../../lib/pricing';
import { formatPrice } from '../../lib/products';
import { pageTitle } from '../../lib/seo';

export const prerender = false;

const env = getEnv();
const catalog = await loadCatalog((p) => env.ASSETS.fetch(new Request(new URL(p, Astro.request.url))));
const bag = await decodeBag(Astro.cookies.get(BAG_COOKIE)?.value, env.BAG_SECRET);
const priced = priceBag(bag, catalog);
if (priced.dropped.length) {
  const kept = priced.lines.map((l) => (l.option ? { slug: l.slug, option: l.option, qty: l.qty } : { slug: l.slug, qty: l.qty }));
  Astro.cookies.set(BAG_COOKIE, await encodeBag(kept, env.BAG_SECRET), { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 });
}
const notice = Astro.url.searchParams.get('n');
const cancelled = Astro.url.searchParams.get('cancelled') === '1';
const euro = (c: number) => formatPrice(c / 100);
const suggestions = Object.values(catalog)
  .filter((i) => i.featured !== null && i.inStock && !priced.lines.some((l) => l.slug === i.slug))
  .sort((a, b) => (a.featured ?? 9) - (b.featured ?? 9))
  .slice(0, 4);
---
<BaseLayout title={pageTitle('Your bag')} description="Your Sunnie Designs bag." path="/bag/" noindex>
  <div class="container narrow-wide">
    <header class="page-head"><h1>Your bag</h1></header>
    {notice === 'added' && <p class="notice" role="status">Added to your bag.</p>}
    {notice === 'invalid' && <p class="notice notice-warn" role="status">That piece couldn't be added. Please choose an option and try again.</p>}
    {cancelled && <p class="notice" role="status">Payment cancelled. Your bag is just as you left it.</p>}
    {priced.dropped.length > 0 && <p class="notice notice-warn" role="status">Some items are no longer available and were removed: {priced.dropped.join(', ')}.</p>}
    {priced.lines.length === 0 ? (
      <div class="bag-empty">
        <p>Your bag is empty.</p>
        <p><a class="btn btn-primary" href="/shop/bags/">Find your bag</a> <a class="btn-ghost" href="/shop/">Shop all</a></p>
      </div>
    ) : (
      <div class="bag-grid">
        <ul class="bag-lines" role="list">
          {priced.lines.map((l, i) => (
            <li class="bag-line">
              <img src={l.thumb} alt="" width="80" height="80" loading="lazy" />
              <div class="bag-line-info">
                <a href={`/products/${l.slug}/`}>{l.name}</a>
                {l.option && <span class="small muted">{l.option}</span>}
                <span class="small">{euro(l.unitCents)} each</span>
              </div>
              <form method="post" action="/bag/update/" class="bag-qty">
                <input type="hidden" name="index" value={i} />
                <label><span class="visually-hidden">Quantity for {l.name}</span>
                  <select name="qty">{[1, 2, 3, 4, 5].map((n) => <option value={n} selected={n === l.qty}>{n}</option>)}</select>
                </label>
                <button type="submit" class="btn-ghost">Update</button>
              </form>
              <form method="post" action="/bag/remove/">
                <input type="hidden" name="index" value={i} />
                <button type="submit" class="btn-ghost">Remove</button>
              </form>
              <span class="bag-line-total">{euro(l.lineCents)}</span>
            </li>
          ))}
        </ul>
        <aside class="bag-summary" aria-label="Order summary">
          <dl>
            <div><dt>Subtotal</dt><dd>{euro(priced.subtotalCents)}</dd></div>
            <div><dt>Shipping</dt><dd>{priced.shippingCents === 0 ? 'Free' : euro(priced.shippingCents)}</dd></div>
            <div class="bag-total"><dt>Total</dt><dd>{euro(priced.totalCents)}</dd></div>
          </dl>
          {priced.freeShippingGapCents > 0 && <p class="small">Add {euro(priced.freeShippingGapCents)} more for free worldwide shipping.</p>}
          <a class="btn btn-primary btn-block" href="/checkout/">Checkout</a>
          <a class="btn-ghost" href="/shop/">Continue shopping</a>
        </aside>
      </div>
    )}
    {priced.freeShippingGapCents > 0 && suggestions.length > 0 && (
      <section class="section" aria-labelledby="suggest-h">
        <h2 id="suggest-h">Popular pieces</h2>
        <ul class="grid" role="list">
          {suggestions.map((s) => (
            <li><a class="card card-link" href={`/products/${s.slug}/`}><img src={s.thumb} alt="" width="160" height="160" loading="lazy" /><span class="card-title">{s.name}</span><span class="card-price">{euro(s.priceCents)}</span></a></li>
          ))}
        </ul>
      </section>
    )}
  </div>
</BaseLayout>
```
If `.visually-hidden` doesn't exist in `global.css`, add it (the standard clip pattern). Append the styles:
```css
/* Bag */
.narrow-wide { max-width: 60rem; }
.notice { background: var(--sand); border-left: 4px solid var(--olive); padding: 0.75rem 1rem; border-radius: var(--radius-sm); }
.notice-warn { border-left-color: var(--terracotta); }
.bag-grid { display: grid; gap: 2rem; }
@media (min-width: 56rem) { .bag-grid { grid-template-columns: 1.6fr 1fr; align-items: start; } }
.bag-lines { list-style: none; margin: 0; padding: 0; }
.bag-line { display: grid; grid-template-columns: 80px 1fr auto; gap: 0.5rem 1rem; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--border); max-width: none; }
.bag-line img { border-radius: var(--radius-sm); grid-row: span 2; }
.bag-line-info { display: flex; flex-direction: column; gap: 0.15rem; }
.bag-line-total { font-weight: 700; justify-self: end; }
.bag-qty { display: flex; align-items: center; gap: 0.5rem; }
.bag-qty select { min-height: 44px; border: 2px solid var(--border-strong); border-radius: var(--radius-sm); background: var(--linen); font: inherit; padding: 0 0.6rem; }
.bag-summary { background: var(--sand); border-radius: var(--radius); padding: 1.5rem; display: grid; gap: 1rem; }
.bag-summary dl { margin: 0; display: grid; gap: 0.5rem; }
.bag-summary dl div { display: flex; justify-content: space-between; }
.bag-summary dd { margin: 0; font-weight: 700; }
.bag-total { border-top: 1px solid var(--border-strong); padding-top: 0.5rem; font-size: var(--fs-body-lg); }
.bag-summary a:not(.btn) { color: var(--terracotta-deep); }
```
If `BaseLayout` doesn't accept `noindex`, check its props. It does since Phase 1 (`noindex?: boolean`).

- [ ] **Step 6: Verify locally**

Run `npm run build`, then serve with `npx wrangler dev` using a local `.dev.vars` containing `BAG_SECRET=local-test-secret-change-me`. Don't commit `.dev.vars`. Then:
```bash
# add a frog (Pink) and a coaster; follow redirects with a cookie jar
curl -s -c j.txt -b j.txt -X POST -H "Origin: http://localhost:8787" -d "slug=frog-phone-crossbody&option=Pink&qty=1" -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:8787/bag/add/
curl -s -b j.txt http://localhost:8787/bag/ | grep -oE "Frog phone crossbody|Add €[0-9.]+ more|Total" | sort -u
curl -s -c j.txt -b j.txt -X POST -H "Origin: https://evil.example" -d "slug=frog-phone-crossbody&option=Pink&qty=1" -o /dev/null -w "%{http_code}\n" http://localhost:8787/bag/add/
```
Expected: `303 …/bag/?n=added`; the bag shows the frog, the free-shipping nudge and a total; the cross-origin POST returns `403`. Screenshot `/bag/` at 390px and 1280px and save to `.superpowers/sdd/shots/`. Delete `j.txt`. Stop only your own server.

- [ ] **Step 7: Run all tests and commit**

Run: `npm test && npm run check && npm run test:dist`
```bash
git add -A
git commit -m "feat: bag page with update/remove, free-shipping nudge and suggestions

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Checkout form validation and checkout page

**Files:**
- Create: `src/lib/checkout-form.ts`, `tests/unit/checkout-form.test.ts`, `src/pages/checkout/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Produces:
  - `interface Address { name: string; line1: string; line2: string; city: string; region: string; postcode: string; country: string }`
  - `interface CheckoutValues extends Address { email: string }`
  - `validateCheckout(form: FormData): { ok: true; values: CheckoutValues } | { ok: false; values: CheckoutValues; errors: Partial<Record<keyof CheckoutValues, string>> }`
  - `COUNTRY_CODES: string[]` (ISO 3166-1 alpha-2)
  - `countryName(code: string): string`, using `Intl.DisplayNames(['en'], { type: 'region' })`

- [ ] **Step 1: Write failing tests**

`tests/unit/checkout-form.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { COUNTRY_CODES, countryName, validateCheckout } from '../../src/lib/checkout-form';

const fd = (o: Record<string, string>) => { const f = new FormData(); for (const [k, v] of Object.entries(o)) f.set(k, v); return f; };
const good = { email: 'a@b.ie', name: 'Aoife Byrne', line1: '1 Main St', line2: '', city: 'Ennis', region: 'Clare', postcode: 'V95 X1Y2', country: 'IE' };

describe('validateCheckout', () => {
  it('accepts a complete address and trims values', () => {
    const r = validateCheckout(fd({ ...good, name: '  Aoife Byrne  ' }));
    expect(r.ok).toBe(true);
    expect(r.values.name).toBe('Aoife Byrne');
  });
  it('requires email, name, line1, city and a known country', () => {
    const r = validateCheckout(fd({ ...good, email: 'nope', name: '', line1: '', city: '', country: 'XX' }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(['city', 'country', 'email', 'line1', 'name']);
  });
  it('limits lengths', () => {
    const r = validateCheckout(fd({ ...good, line1: 'x'.repeat(301) }));
    expect(r.ok).toBe(false);
  });
  it('knows common countries', () => {
    for (const c of ['IE', 'GB', 'DE', 'US', 'CA', 'AU', 'CN', 'JP']) expect(COUNTRY_CODES).toContain(c);
    expect(countryName('IE')).toBe('Ireland');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tests/unit/checkout-form.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `src/lib/checkout-form.ts`**

```ts
export interface Address { name: string; line1: string; line2: string; city: string; region: string; postcode: string; country: string }
export interface CheckoutValues extends Address { email: string }
type Errors = Partial<Record<keyof CheckoutValues, string>>;

export const COUNTRY_CODES = 'AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IO IQ IS IT JE JM JO JP KE KG KH KI KM KN KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RW SA SB SC SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');

const names = new Intl.DisplayNames(['en'], { type: 'region' });
export const countryName = (code: string) => names.of(code) ?? code;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS: Record<keyof CheckoutValues, number> = { email: 254, name: 300, line1: 300, line2: 300, city: 120, region: 300, postcode: 60, country: 2 };

export function validateCheckout(form: FormData) {
  const get = (k: keyof CheckoutValues) => String(form.get(k) ?? '').trim();
  const values: CheckoutValues = {
    email: get('email'), name: get('name'), line1: get('line1'), line2: get('line2'),
    city: get('city'), region: get('region'), postcode: get('postcode'), country: get('country').toUpperCase(),
  };
  const errors: Errors = {};
  if (!EMAIL.test(values.email)) errors.email = 'Enter a valid email address.';
  if (!values.name) errors.name = 'Enter your full name.';
  if (!values.line1) errors.line1 = 'Enter the first line of your address.';
  if (!values.city) errors.city = 'Enter your town or city.';
  if (!COUNTRY_CODES.includes(values.country)) errors.country = 'Choose your country.';
  for (const [k, max] of Object.entries(LIMITS) as [keyof CheckoutValues, number][]) {
    if (values[k].length > max && !errors[k]) errors[k] = 'This is too long.';
  }
  return Object.keys(errors).length ? { ok: false as const, values, errors } : { ok: true as const, values };
}
```

- [ ] **Step 4: Run the tests**

Run: `npx vitest run tests/unit/checkout-form.test.ts`
Expected: PASS.

- [ ] **Step 5: Checkout page `src/pages/checkout/index.astro`**

It renders the form (GET). When `/checkout/pay/` in Task 9 finds errors, it re-renders by passing values and errors through `Astro.locals`, so the page reads `Astro.locals.checkout` when present:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getEnv } from '../../lib/env';
import { loadCatalog } from '../../lib/catalog';
import { BAG_COOKIE, decodeBag } from '../../lib/bag-cookie';
import { priceBag } from '../../lib/pricing';
import { COUNTRY_CODES, countryName, type CheckoutValues } from '../../lib/checkout-form';
import { formatPrice } from '../../lib/products';
import { pageTitle } from '../../lib/seo';

export const prerender = false;

const env = getEnv();
const catalog = await loadCatalog((p) => env.ASSETS.fetch(new Request(new URL(p, Astro.request.url))));
const priced = priceBag(await decodeBag(Astro.cookies.get(BAG_COOKIE)?.value, env.BAG_SECRET), catalog);
if (priced.lines.length === 0) return Astro.redirect('/bag/', 303);

const state = (Astro.locals as { checkout?: { values: CheckoutValues; errors: Record<string, string>; payError?: string } }).checkout;
const v: CheckoutValues = state?.values ?? { email: '', name: '', line1: '', line2: '', city: '', region: '', postcode: '', country: 'IE' };
const e = state?.errors ?? {};
const euro = (c: number) => formatPrice(c / 100);
const countries = COUNTRY_CODES.map((c) => ({ code: c, name: countryName(c) })).sort((a, b) => a.name.localeCompare(b.name));
const field = (k: keyof CheckoutValues, label: string, opts: { type?: string; auto?: string; optional?: boolean } = {}) => ({ k, label, ...opts });
const fields = [
  field('email', 'Email', { type: 'email', auto: 'email' }),
  field('name', 'Full name', { auto: 'name' }),
  field('line1', 'Address line 1', { auto: 'address-line1' }),
  field('line2', 'Address line 2', { auto: 'address-line2', optional: true }),
  field('city', 'Town or city', { auto: 'address-level2' }),
  field('region', 'County, state or region', { auto: 'address-level1', optional: true }),
  field('postcode', 'Postcode or Eircode', { auto: 'postal-code', optional: true }),
];
---
<BaseLayout title={pageTitle('Checkout')} description="Pay securely with PayPal or card." path="/checkout/" noindex>
  <div class="container narrow-wide">
    <header class="page-head"><h1>Checkout</h1></header>
    {state?.payError && <p class="notice notice-warn" role="alert">{state.payError}</p>}
    <div class="bag-grid">
      <form class="checkout-form" method="post" action="/checkout/pay/" novalidate>
        <fieldset>
          <legend>Delivery details</legend>
          {fields.map((f) => (
            <div class="field">
              <label for={f.k}>{f.label}{f.optional && <span class="muted"> (optional)</span>}</label>
              <input id={f.k} name={f.k} type={f.type ?? 'text'} autocomplete={f.auto} value={v[f.k]} required={!f.optional} aria-invalid={e[f.k] ? 'true' : undefined} aria-describedby={e[f.k] ? `${f.k}-err` : undefined} />
              {e[f.k] && <p class="field-error" id={`${f.k}-err`}>{e[f.k]}</p>}
            </div>
          ))}
          <div class="field">
            <label for="country">Country</label>
            <select id="country" name="country" autocomplete="country" required aria-invalid={e.country ? 'true' : undefined}>
              {countries.map((c) => <option value={c.code} selected={c.code === v.country}>{c.name}</option>)}
            </select>
            {e.country && <p class="field-error">{e.country}</p>}
          </div>
        </fieldset>
        <p class="small">By paying you agree to our <a href="/terms/">terms of sale</a>. Ships within 3–5 days with tracking. Returns accepted within 30 days.</p>
        <button class="btn btn-primary btn-block" type="submit">Pay with PayPal or card</button>
        <p class="small muted">You'll pay on PayPal's secure page. You can pay by card without a PayPal account.</p>
      </form>
      <aside class="bag-summary" aria-label="Order summary">
        <ul class="summary-lines" role="list">
          {priced.lines.map((l) => <li><span>{l.qty} × {l.name}{l.option && ` (${l.option})`}</span><span>{euro(l.lineCents)}</span></li>)}
        </ul>
        <dl>
          <div><dt>Subtotal</dt><dd>{euro(priced.subtotalCents)}</dd></div>
          <div><dt>Shipping</dt><dd>{priced.shippingCents === 0 ? 'Free' : euro(priced.shippingCents)}</dd></div>
          <div class="bag-total"><dt>Total</dt><dd>{euro(priced.totalCents)}</dd></div>
        </dl>
        <a class="btn-ghost" href="/bag/">Edit bag</a>
      </aside>
    </div>
  </div>
</BaseLayout>
```
Append the styles:
```css
/* Checkout */
.checkout-form fieldset { border: 0; margin: 0; padding: 0; display: grid; gap: 1rem; }
.checkout-form legend { font-family: var(--font-heading); font-size: var(--fs-h3); color: var(--terracotta); margin-bottom: 0.5rem; }
.field { display: grid; gap: 0.35rem; }
.field label { font-weight: 700; }
.field input, .field select { min-height: 48px; padding: 0 0.9rem; border: 2px solid var(--border-strong); border-radius: var(--radius-sm); background: var(--white); color: var(--umber); font: inherit; }
.field input:focus, .field select:focus { border-color: var(--terracotta-hover); outline: var(--focus-ring); outline-offset: 2px; }
.field [aria-invalid='true'] { border-color: var(--terracotta); }
.field-error { margin: 0; color: var(--terracotta-deep); font-weight: 700; font-size: var(--fs-small); }
.summary-lines { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
.summary-lines li { display: flex; justify-content: space-between; gap: 1rem; max-width: none; }
```
If `Astro.locals` typing complains, declare `App.Locals` in `src/env.d.ts` with `checkout?: {…}` using the same shape.

- [ ] **Step 6: Build, check, commit**

Run: `npm run build && npm run check && npm test`. Serve locally with a bag cookie (reuse the Task 5 curl commands), GET `/checkout/`, and confirm the form and summary render. Screenshot at 390px and save to `.superpowers/sdd/shots/`.
```bash
git add -A
git commit -m "feat: checkout page and address validation

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Orders repository (D1 and in-memory) and migration

**Files:**
- Create: `migrations/0001_orders.sql`, `tests/unit/orders.test.ts`
- Modify: `src/lib/orders.ts` (it has only `D1Like` so far)

**Interfaces:**
- Consumes: `Address` from `checkout-form.ts`, `PricedLine` from `pricing.ts`.
- Produces:
  - `OrderInput = { ref: string; email: string; address: Address; lines: PricedLine[]; subtotalCents: number; shippingCents: number; totalCents: number; paypalEnv: 'sandbox' | 'live' }`
  - `OrderRow = OrderInput & { status: 'pending' | 'paid'; paypalOrderId: string | null; captureId: string | null; createdAt: string; paidAt: string | null; customerEmailed: boolean; shopEmailed: boolean; emailError: string | null }`
  - `interface OrdersRepo { insertPending(o: OrderInput): Promise<void>; setPaypalId(ref: string, id: string): Promise<void>; findByPaypalId(id: string): Promise<OrderRow | null>; findByRef(ref: string): Promise<OrderRow | null>; markPaid(ref: string, captureId: string, payerEmail?: string): Promise<void>; recordEmail(ref: string, r: { customer: boolean; shop: boolean; error?: string }): Promise<void> }`
  - `memoryOrders(): OrdersRepo`, `d1Orders(db: D1Like): OrdersRepo`
  - `newRef(random?: () => number): string` in the format `SUN-` + 6 characters from `[0-9A-Z]`

- [ ] **Step 1: Migration `migrations/0001_orders.sql`**

```sql
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  paypal_env TEXT NOT NULL CHECK (paypal_env IN ('sandbox', 'live')),
  paypal_order_id TEXT UNIQUE,
  capture_id TEXT,
  email TEXT NOT NULL,
  address_json TEXT NOT NULL,
  lines_json TEXT NOT NULL,
  subtotal_cents INTEGER NOT NULL,
  shipping_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  created_at TEXT NOT NULL,
  paid_at TEXT,
  customer_emailed INTEGER NOT NULL DEFAULT 0,
  shop_emailed INTEGER NOT NULL DEFAULT 0,
  email_error TEXT
);
CREATE INDEX IF NOT EXISTS orders_created_at ON orders (created_at);
```

- [ ] **Step 2: Write failing tests**

`tests/unit/orders.test.ts` runs the same contract against `memoryOrders()`, and against `d1Orders()` backed by a tiny SQLite-free fake. A fake D1 with SQL parsing would be a waste, so the D1 version is exercised end-to-end in Task 12 and unit-tested only through a recording stub:
```ts
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
});

describe('d1Orders', () => {
  it('writes parameterised SQL (no string interpolation of values)', async () => {
    const calls: { sql: string; args: unknown[] }[] = [];
    const db = { prepare: (sql: string) => ({ bind: (...args: unknown[]) => { calls.push({ sql, args }); return { run: async () => ({}), first: async () => null }; } }) };
    const repo = d1Orders(db);
    await repo.insertPending(input());
    await repo.markPaid('SUN-AAAAAA', 'CAP-1');
    for (const c of calls) {
      expect(c.sql).not.toContain('SUN-AAAAAA');
      expect(c.sql).toMatch(/\?/);
    }
    expect(calls[0].args).toContain('SUN-AAAAAA');
  });
});

describe('newRef', () => {
  it('makes SUN- plus 6 base36 characters', () => {
    expect(newRef()).toMatch(/^SUN-[0-9A-Z]{6}$/);
    expect(newRef(() => 0)).toBe('SUN-000000');
  });
});
```

- [ ] **Step 3: Run to verify failure**

Run: `npx vitest run tests/unit/orders.test.ts`
Expected: FAIL.

- [ ] **Step 4: Implement `src/lib/orders.ts`** (keep the existing `D1Like` export)

```ts
import type { Address } from './checkout-form';
import type { PricedLine } from './pricing';

export interface D1Like {
  prepare(sql: string): { bind(...v: unknown[]): { run(): Promise<unknown>; first<T = Record<string, unknown>>(): Promise<T | null> } };
}

export interface OrderInput {
  ref: string; email: string; address: Address; lines: PricedLine[];
  subtotalCents: number; shippingCents: number; totalCents: number; paypalEnv: 'sandbox' | 'live';
}
export interface OrderRow extends OrderInput {
  status: 'pending' | 'paid'; paypalOrderId: string | null; captureId: string | null;
  createdAt: string; paidAt: string | null; customerEmailed: boolean; shopEmailed: boolean; emailError: string | null;
}
export interface OrdersRepo {
  insertPending(o: OrderInput): Promise<void>;
  setPaypalId(ref: string, id: string): Promise<void>;
  findByPaypalId(id: string): Promise<OrderRow | null>;
  findByRef(ref: string): Promise<OrderRow | null>;
  markPaid(ref: string, captureId: string, payerEmail?: string): Promise<void>;
  recordEmail(ref: string, r: { customer: boolean; shop: boolean; error?: string }): Promise<void>;
}

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function newRef(random: () => number = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32): string {
  let s = '';
  for (let i = 0; i < 6; i++) s += ALPHABET[Math.floor(random() * 36)];
  return `SUN-${s}`;
}

export function memoryOrders(): OrdersRepo {
  const rows = new Map<string, OrderRow>();
  const byRef = (ref: string) => { const r = rows.get(ref); if (!r) throw new Error(`No order ${ref}`); return r; };
  return {
    async insertPending(o) {
      if (rows.has(o.ref)) throw new Error('duplicate ref');
      rows.set(o.ref, { ...o, status: 'pending', paypalOrderId: null, captureId: null, createdAt: new Date().toISOString(), paidAt: null, customerEmailed: false, shopEmailed: false, emailError: null });
    },
    async setPaypalId(ref, id) { byRef(ref).paypalOrderId = id; },
    async findByPaypalId(id) { return [...rows.values()].find((r) => r.paypalOrderId === id) ?? null; },
    async findByRef(ref) { return rows.get(ref) ?? null; },
    async markPaid(ref, captureId, payerEmail) {
      const r = byRef(ref);
      Object.assign(r, { status: 'paid', captureId, paidAt: new Date().toISOString() });
      if (payerEmail && !r.email) r.email = payerEmail;
    },
    async recordEmail(ref, e) { Object.assign(byRef(ref), { customerEmailed: e.customer, shopEmailed: e.shop, emailError: e.error ?? null }); },
  };
}

type Db = Record<string, unknown>;
function fromDb(r: Db): OrderRow {
  return {
    ref: String(r.ref), email: String(r.email), address: JSON.parse(String(r.address_json)), lines: JSON.parse(String(r.lines_json)),
    subtotalCents: Number(r.subtotal_cents), shippingCents: Number(r.shipping_cents), totalCents: Number(r.total_cents),
    paypalEnv: r.paypal_env as 'sandbox' | 'live', status: r.status as 'pending' | 'paid',
    paypalOrderId: (r.paypal_order_id as string) ?? null, captureId: (r.capture_id as string) ?? null,
    createdAt: String(r.created_at), paidAt: (r.paid_at as string) ?? null,
    customerEmailed: Number(r.customer_emailed) === 1, shopEmailed: Number(r.shop_emailed) === 1, emailError: (r.email_error as string) ?? null,
  };
}

export function d1Orders(db: D1Like): OrdersRepo {
  return {
    async insertPending(o) {
      await db.prepare(`INSERT INTO orders (ref, status, paypal_env, email, address_json, lines_json, subtotal_cents, shipping_cents, total_cents, currency, created_at)
        VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, 'EUR', ?)`)
        .bind(o.ref, o.paypalEnv, o.email, JSON.stringify(o.address), JSON.stringify(o.lines), o.subtotalCents, o.shippingCents, o.totalCents, new Date().toISOString()).run();
    },
    async setPaypalId(ref, id) { await db.prepare('UPDATE orders SET paypal_order_id = ? WHERE ref = ?').bind(id, ref).run(); },
    async findByPaypalId(id) { const r = await db.prepare('SELECT * FROM orders WHERE paypal_order_id = ?').bind(id).first<Db>(); return r ? fromDb(r) : null; },
    async findByRef(ref) { const r = await db.prepare('SELECT * FROM orders WHERE ref = ?').bind(ref).first<Db>(); return r ? fromDb(r) : null; },
    async markPaid(ref, captureId) {
      await db.prepare("UPDATE orders SET status = 'paid', capture_id = ?, paid_at = ? WHERE ref = ?").bind(captureId, new Date().toISOString(), ref).run();
    },
    async recordEmail(ref, e) {
      await db.prepare('UPDATE orders SET customer_emailed = ?, shop_emailed = ?, email_error = ? WHERE ref = ?').bind(e.customer ? 1 : 0, e.shop ? 1 : 0, e.error ?? null, ref).run();
    },
  };
}
```

- [ ] **Step 5: Run the tests and commit**

Run: `npm test && npm run check`
```bash
git add -A
git commit -m "feat: orders repository (D1 + in-memory) and orders migration

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: PayPal client

**Files:**
- Create: `src/lib/paypal.ts`, `tests/unit/paypal.test.ts`

**Interfaces:**
- Consumes: `PricedBag` (via `OrderInput`), `centsToAmount`, `Address`.
- Produces:
  - `buildOrderPayload(o: OrderInput, urls: { returnUrl: string; cancelUrl: string }): object`
  - `interface PayPalClient { createOrder(o: OrderInput, urls: { returnUrl: string; cancelUrl: string }): Promise<{ id: string; approveUrl: string }>; captureOrder(id: string, requestId: string): Promise<CaptureResult> }`
  - `type CaptureResult = { status: 'COMPLETED'; captureId: string; payerEmail?: string } | { status: 'ALREADY_CAPTURED' } | { status: 'FAILED'; detail: string }`
  - `class PayPalError extends Error { status: number; issue?: string }`
  - `paypalClient(cfg: { clientId: string; secret: string; env: 'sandbox' | 'live'; fetch?: typeof fetch }): PayPalClient`

- [ ] **Step 1: Write failing tests**

`tests/unit/paypal.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { buildOrderPayload, paypalClient, PayPalError } from '../../src/lib/paypal';
import type { OrderInput } from '../../src/lib/orders';

const order: OrderInput = {
  ref: 'SUN-ABC123', email: 'a@b.ie', paypalEnv: 'sandbox',
  address: { name: 'Aoife Byrne', line1: '1 Main St', line2: 'Apt 2', city: 'Ennis', region: 'Clare', postcode: 'V95 X1Y2', country: 'IE' },
  lines: [
    { slug: 'frog', name: 'Frog phone crossbody', option: 'Pink', qty: 2, unitCents: 2995, lineCents: 5990, thumb: '' },
    { slug: 'coaster', name: 'Flower coaster', qty: 1, unitCents: 1695, lineCents: 1695, thumb: '' },
  ],
  subtotalCents: 7685, shippingCents: 0, totalCents: 7685,
};
const urls = { returnUrl: 'https://sunniedesigns.com/checkout/return/', cancelUrl: 'https://sunniedesigns.com/checkout/cancel/' };

describe('buildOrderPayload', () => {
  const p = buildOrderPayload(order, urls) as any;
  const unit = p.purchase_units[0];
  it('itemises lines with server prices and a matching breakdown', () => {
    expect(unit.amount).toEqual({ currency_code: 'EUR', value: '76.85', breakdown: { item_total: { currency_code: 'EUR', value: '76.85' }, shipping: { currency_code: 'EUR', value: '0.00' } } });
    expect(unit.items[0]).toEqual({ name: 'Frog phone crossbody (Pink)', quantity: '2', unit_amount: { currency_code: 'EUR', value: '29.95' }, category: 'PHYSICAL_GOODS', sku: 'frog' });
    const itemSum = unit.items.reduce((s: number, i: any) => s + Math.round(Number(i.unit_amount.value) * 100) * Number(i.quantity), 0);
    expect(itemSum).toBe(order.subtotalCents);
  });
  it('locks the typed address and sets the return flow', () => {
    expect(unit.shipping.address).toEqual({ address_line_1: '1 Main St', address_line_2: 'Apt 2', admin_area_2: 'Ennis', admin_area_1: 'Clare', postal_code: 'V95 X1Y2', country_code: 'IE' });
    expect(unit.custom_id).toBe('SUN-ABC123');
    expect(unit.invoice_id).toBe('SUN-ABC123');
    const ctx = p.payment_source.paypal.experience_context;
    expect(ctx).toMatchObject({ shipping_preference: 'SET_PROVIDED_ADDRESS', user_action: 'PAY_NOW', return_url: urls.returnUrl, cancel_url: urls.cancelUrl, brand_name: 'Sunnie Designs' });
  });
  it('omits empty optional address parts', () => {
    const q = buildOrderPayload({ ...order, address: { ...order.address, line2: '', region: '', postcode: '' } }, urls) as any;
    expect(q.purchase_units[0].shipping.address).toEqual({ address_line_1: '1 Main St', admin_area_2: 'Ennis', country_code: 'IE' });
  });
});

describe('paypalClient', () => {
  const token = { access_token: 'T' };
  const mk = (responses: Array<[number, unknown]>) => {
    const calls: { url: string; init: RequestInit }[] = [];
    const f = (async (url: string, init: RequestInit) => { calls.push({ url, init }); const [s, b] = responses.shift()!; return new Response(JSON.stringify(b), { status: s }); }) as unknown as typeof fetch;
    return { calls, client: paypalClient({ clientId: 'id', secret: 'sec', env: 'sandbox', fetch: f }) };
  };
  it('creates an order and returns the payer-action link', async () => {
    const { calls, client } = mk([[200, token], [200, { id: 'PP-1', links: [{ rel: 'payer-action', href: 'https://www.sandbox.paypal.com/checkoutnow?token=PP-1' }] }]]);
    expect(await client.createOrder(order, urls)).toEqual({ id: 'PP-1', approveUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=PP-1' });
    expect(calls[1].url).toBe('https://api-m.sandbox.paypal.com/v2/checkout/orders');
    expect((calls[1].init.headers as Record<string, string>)['PayPal-Request-Id']).toBe('create-SUN-ABC123');
  });
  it('maps capture outcomes', async () => {
    const ok = mk([[200, token], [201, { status: 'COMPLETED', payer: { email_address: 'p@x.ie' }, purchase_units: [{ payments: { captures: [{ id: 'CAP-1', status: 'COMPLETED' }] } }] }]]);
    expect(await ok.client.captureOrder('PP-1', 'SUN-ABC123')).toEqual({ status: 'COMPLETED', captureId: 'CAP-1', payerEmail: 'p@x.ie' });
    const dup = mk([[200, token], [422, { details: [{ issue: 'ORDER_ALREADY_CAPTURED' }] }]]);
    expect(await dup.client.captureOrder('PP-1', 'r')).toEqual({ status: 'ALREADY_CAPTURED' });
    const bad = mk([[200, token], [422, { details: [{ issue: 'INSTRUMENT_DECLINED' }] }]]);
    expect(await bad.client.captureOrder('PP-1', 'r')).toEqual({ status: 'FAILED', detail: 'INSTRUMENT_DECLINED' });
  });
  it('throws PayPalError with the issue on create failure', async () => {
    const { client } = mk([[200, token], [422, { details: [{ issue: 'SHIPPING_ADDRESS_INVALID' }] }]]);
    await expect(client.createOrder(order, urls)).rejects.toMatchObject({ name: 'PayPalError', status: 422, issue: 'SHIPPING_ADDRESS_INVALID' });
    expect(PayPalError).toBeDefined();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tests/unit/paypal.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `src/lib/paypal.ts`**

```ts
import { centsToAmount } from './money';
import type { OrderInput } from './orders';

const API = { sandbox: 'https://api-m.sandbox.paypal.com', live: 'https://api-m.paypal.com' } as const;
const eur = (cents: number) => ({ currency_code: 'EUR', value: centsToAmount(cents) });

export class PayPalError extends Error {
  constructor(public status: number, public issue?: string) { super(`PayPal ${status}${issue ? ` ${issue}` : ''}`); this.name = 'PayPalError'; }
}

export type CaptureResult = { status: 'COMPLETED'; captureId: string; payerEmail?: string } | { status: 'ALREADY_CAPTURED' } | { status: 'FAILED'; detail: string };

export interface PayPalClient {
  createOrder(o: OrderInput, urls: { returnUrl: string; cancelUrl: string }): Promise<{ id: string; approveUrl: string }>;
  captureOrder(id: string, requestId: string): Promise<CaptureResult>;
}

export function buildOrderPayload(o: OrderInput, urls: { returnUrl: string; cancelUrl: string }) {
  const a = o.address;
  const address: Record<string, string> = { address_line_1: a.line1.slice(0, 300) };
  if (a.line2) address.address_line_2 = a.line2.slice(0, 300);
  address.admin_area_2 = a.city.slice(0, 120);
  if (a.region) address.admin_area_1 = a.region.slice(0, 300);
  if (a.postcode) address.postal_code = a.postcode.slice(0, 60);
  address.country_code = a.country;
  return {
    intent: 'CAPTURE',
    purchase_units: [{
      reference_id: o.ref,
      custom_id: o.ref,
      invoice_id: o.ref,
      description: `Sunnie Designs order ${o.ref}`,
      amount: { ...eur(o.totalCents), breakdown: { item_total: eur(o.subtotalCents), shipping: eur(o.shippingCents) } },
      items: o.lines.map((l) => ({
        name: `${l.name}${l.option ? ` (${l.option})` : ''}`.slice(0, 127),
        quantity: String(l.qty),
        unit_amount: eur(l.unitCents),
        category: 'PHYSICAL_GOODS',
        sku: l.slug.slice(0, 127),
      })),
      shipping: { name: { full_name: a.name.slice(0, 300) }, address },
    }],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: 'Sunnie Designs',
          shipping_preference: 'SET_PROVIDED_ADDRESS',
          user_action: 'PAY_NOW',
          landing_page: 'NO_PREFERENCE',
          return_url: urls.returnUrl,
          cancel_url: urls.cancelUrl,
        },
      },
    },
  };
}

export function paypalClient(cfg: { clientId: string; secret: string; env: 'sandbox' | 'live'; fetch?: typeof fetch }): PayPalClient {
  const base = API[cfg.env];
  const f = cfg.fetch ?? fetch;
  async function token(): Promise<string> {
    const res = await f(`${base}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: { Authorization: `Basic ${btoa(`${cfg.clientId}:${cfg.secret}`)}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    if (!res.ok) throw new PayPalError(res.status, 'AUTH_FAILED');
    return ((await res.json()) as { access_token: string }).access_token;
  }
  const issueOf = (b: any): string | undefined => b?.details?.[0]?.issue ?? b?.name;
  return {
    async createOrder(o, urls) {
      const res = await f(`${base}/v2/checkout/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await token()}`, 'PayPal-Request-Id': `create-${o.ref}` },
        body: JSON.stringify(buildOrderPayload(o, urls)),
      });
      const body: any = await res.json().catch(() => ({}));
      if (!res.ok) throw new PayPalError(res.status, issueOf(body));
      const link = (body.links ?? []).find((l: any) => l.rel === 'payer-action' || l.rel === 'approve');
      if (!body.id || !link) throw new PayPalError(502, 'NO_APPROVE_LINK');
      return { id: body.id, approveUrl: link.href };
    },
    async captureOrder(id, requestId) {
      const res = await f(`${base}/v2/checkout/orders/${encodeURIComponent(id)}/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await token()}`, 'PayPal-Request-Id': `capture-${requestId}` },
      });
      const body: any = await res.json().catch(() => ({}));
      if (res.ok && body.status === 'COMPLETED') {
        const cap = body.purchase_units?.[0]?.payments?.captures?.[0];
        return { status: 'COMPLETED', captureId: String(cap?.id ?? ''), payerEmail: body.payer?.email_address };
      }
      const issue = issueOf(body) ?? `HTTP_${res.status}`;
      if (issue === 'ORDER_ALREADY_CAPTURED') return { status: 'ALREADY_CAPTURED' };
      return { status: 'FAILED', detail: issue };
    },
  };
}
```

- [ ] **Step 4: Run the tests and commit**

Run: `npm test && npm run check`
```bash
git add -A
git commit -m "feat: PayPal Orders v2 client with itemised, server-priced payload

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Order emails (Resend)

Invoke `copywriting` and `stop-slop` for the email wording.

**Files:**
- Create: `src/lib/email.ts`, `tests/unit/email.test.ts`

**Interfaces:**
- Consumes: `OrderRow`, `formatPrice`, `countryName`, `site`.
- Produces:
  - `interface Email { subject: string; html: string; text: string }`
  - `buildCustomerEmail(o: OrderRow): Email`
  - `buildShopEmail(o: OrderRow): Email`
  - `interface Mailer { send(to: string, email: Email): Promise<void> }`
  - `resendMailer(cfg: { apiKey: string; from: string; replyTo: string; fetch?: typeof fetch }): Mailer`, which throws on a non-2xx response

- [ ] **Step 1: Write failing tests**

`tests/unit/email.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { buildCustomerEmail, buildShopEmail, resendMailer } from '../../src/lib/email';
import type { OrderRow } from '../../src/lib/orders';

const row: OrderRow = {
  ref: 'SUN-ABC123', email: 'a@b.ie', paypalEnv: 'live',
  address: { name: 'Aoife <script>', line1: '1 Main St', line2: '', city: 'Ennis', region: 'Clare', postcode: 'V95 X1Y2', country: 'IE' },
  lines: [{ slug: 'frog', name: 'Frog phone crossbody', option: 'Pink', qty: 2, unitCents: 2995, lineCents: 5990, thumb: '' }],
  subtotalCents: 5990, shippingCents: 0, totalCents: 5990,
  status: 'paid', paypalOrderId: 'PP-1', captureId: 'CAP-1', createdAt: '2026-10-01T10:00:00Z', paidAt: '2026-10-01T10:01:00Z',
  customerEmailed: false, shopEmailed: false, emailError: null,
};

describe('customer email', () => {
  const e = buildCustomerEmail(row);
  it('has the reference, items, totals and dispatch promise', () => {
    expect(e.subject).toBe('Your Sunnie Designs order SUN-ABC123');
    for (const s of ['SUN-ABC123', '2 × Frog phone crossbody (Pink)', '€59.90', 'Free', '3–5 days', '30 days', 'Springfield Tectop Limited', 'CRO 571256']) {
      expect(e.text).toContain(s);
      expect(e.html).toContain(s.replace('&', '&amp;'));
    }
  });
  it('escapes user input in HTML', () => {
    expect(e.html).not.toContain('<script>');
    expect(e.html).toContain('Aoife &lt;script&gt;');
  });
});

describe('shop email', () => {
  it('gives a making list and the PayPal references', () => {
    const e = buildShopEmail(row);
    expect(e.subject).toBe('New order SUN-ABC123 · €59.90');
    for (const s of ['MAKE:', '2 × Frog phone crossbody (Pink)', 'a@b.ie', 'Ireland', 'PP-1', 'CAP-1']) expect(e.text).toContain(s);
  });
});

describe('resendMailer', () => {
  it('posts to Resend and throws on failure', async () => {
    const calls: any[] = [];
    const ok = resendMailer({ apiKey: 'k', from: 'Sunnie <orders@sunniedesigns.com>', replyTo: 'hello@sunniedesigns.com', fetch: (async (u: string, i: RequestInit) => { calls.push([u, JSON.parse(String(i.body))]); return new Response('{}', { status: 200 }); }) as any });
    await ok.send('a@b.ie', { subject: 's', html: 'h', text: 't' });
    expect(calls[0][0]).toBe('https://api.resend.com/emails');
    expect(calls[0][1]).toMatchObject({ to: ['a@b.ie'], reply_to: 'hello@sunniedesigns.com', subject: 's' });
    const bad = resendMailer({ apiKey: 'k', from: 'f', replyTo: 'r', fetch: (async () => new Response('{}', { status: 500 })) as any });
    await expect(bad.send('a@b.ie', { subject: 's', html: 'h', text: 't' })).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tests/unit/email.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `src/lib/email.ts`**

```ts
import type { OrderRow } from './orders';
import { formatPrice } from './products';
import { countryName } from './checkout-form';
import { site } from '../data/site';

export interface Email { subject: string; html: string; text: string }
export interface Mailer { send(to: string, email: Email): Promise<void> }

const euro = (c: number) => formatPrice(c / 100);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const lineText = (o: OrderRow) => o.lines.map((l) => `${l.qty} × ${l.name}${l.option ? ` (${l.option})` : ''}  ${euro(l.lineCents)}`);
const addressLines = (o: OrderRow) => [o.address.name, o.address.line1, o.address.line2, o.address.city, o.address.region, o.address.postcode, countryName(o.address.country)].filter(Boolean);
const COMPANY = 'Springfield Tectop Limited, trading as Sunnie Designs. CRO 571256. Registered office: Clareview Car Sales, Ennis Road, Co. Limerick, V94 EA3A.';
const totals = (o: OrderRow) => [`Subtotal: ${euro(o.subtotalCents)}`, `Shipping: ${o.shippingCents === 0 ? 'Free' : euro(o.shippingCents)}`, `Total paid: ${euro(o.totalCents)}`];

const wrap = (inner: string) =>
  `<!doctype html><html><body style="margin:0;background:#FBF6EE;color:#4A3222;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6"><div style="max-width:560px;margin:0 auto;padding:24px">${inner}<p style="font-size:13px;color:#7A6855;border-top:1px solid #E5D5B8;padding-top:12px;margin-top:24px">${esc(COMPANY)}</p></div></body></html>`;
const list = (items: string[]) => `<p>${items.map(esc).join('<br>')}</p>`;

export function buildCustomerEmail(o: OrderRow): Email {
  const subject = `Your Sunnie Designs order ${o.ref}`;
  const intro = `Thank you for your order. ${site.makerLine} is getting your pieces ready, and your parcel ships within ${site.shipsIn} with tracking.`;
  const returns = `Changed your mind? You can return items within 30 days of delivery. Email ${site.email.hello} first. Return postage is paid by you, and we refund the item price and the original shipping within 14 days of receiving the return.`;
  const text = [subject, '', intro, '', `Order: ${o.ref}`, '', ...lineText(o), '', ...totals(o), '', 'Delivering to:', ...addressLines(o), '', returns, '', `Questions: ${site.email.hello}`, '', COMPANY].join('\n');
  const html = wrap(
    `<h1 style="font-family:Georgia,serif;color:#B04A24;font-weight:500">Thank you for your order</h1>` +
    `<p>${esc(intro)}</p><p><strong>Order ${esc(o.ref)}</strong></p>` + list(lineText(o)) + list(totals(o)) +
    `<p><strong>Delivering to</strong><br>${addressLines(o).map(esc).join('<br>')}</p><p>${esc(returns)}</p>` +
    `<p>Questions: <a href="mailto:${site.email.hello}" style="color:#9C3F1D">${site.email.hello}</a></p>`,
  );
  return { subject, html, text };
}

export function buildShopEmail(o: OrderRow): Email {
  const subject = `New order ${o.ref} · ${euro(o.totalCents)}`;
  const text = [
    subject, '', 'MAKE:', ...lineText(o), '', ...totals(o), '', 'Ship to:', ...addressLines(o), '',
    `Buyer email: ${o.email}`, `PayPal order: ${o.paypalOrderId ?? '-'}`, `PayPal capture: ${o.captureId ?? '-'}`, `Environment: ${o.paypalEnv}`, `Placed: ${o.paidAt ?? o.createdAt}`,
  ].join('\n');
  return { subject, html: wrap(`<pre style="font-family:Menlo,Consolas,monospace;font-size:14px;white-space:pre-wrap">${esc(text)}</pre>`), text };
}

export function resendMailer(cfg: { apiKey: string; from: string; replyTo: string; fetch?: typeof fetch }): Mailer {
  const f = cfg.fetch ?? fetch;
  return {
    async send(to, email) {
      const res = await f('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${cfg.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: cfg.from, to: [to], reply_to: cfg.replyTo, subject: email.subject, html: email.html, text: email.text }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}`);
    },
  };
}
```
`site.makerLine` is "Handmade by Hui". If the intro sentence reads badly with that value, rewrite it maker-neutrally ("Your pieces are being made by hand and ship within …"). Keep the tested strings.

- [ ] **Step 4: Run the tests and commit**

Run: `npm test && npm run check`
```bash
git add -A
git commit -m "feat: customer and shop order emails via Resend

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Pay, return, cancel and complete routes

**Files:**
- Create: `src/lib/checkout-handlers.ts`, `tests/unit/checkout-handlers.test.ts`, `src/pages/checkout/pay.ts`, `src/pages/checkout/return.ts`, `src/pages/checkout/cancel.ts`, `src/pages/checkout/complete.astro`
- Modify: `src/pages/checkout/index.astro` (accept POST re-render state; see below)

**Interfaces:**
- Consumes: everything from Tasks 2–9.
- Produces:
  - `handlePay(form: FormData, bag: BagLine[], deps: PayDeps): Promise<{ kind: 'redirect'; location: string } | { kind: 'invalid'; values: CheckoutValues; errors: Record<string, string> } | { kind: 'empty' } | { kind: 'payError'; values: CheckoutValues; message: string }>`
  - `handleReturn(paypalOrderId: string | null, deps: ReturnDeps): Promise<{ kind: 'complete'; ref: string } | { kind: 'error'; message: string }>`
  - `PayDeps = { catalog: Catalog; orders: OrdersRepo; paypal: PayPalClient; paypalEnv: 'sandbox' | 'live'; origin: string; newRef: () => string }`
  - `ReturnDeps = { orders: OrdersRepo; paypal: PayPalClient; mailer: Mailer; notifyEmail: string }`

- [ ] **Step 1: Write failing tests**

`tests/unit/checkout-handlers.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { handlePay, handleReturn } from '../../src/lib/checkout-handlers';
import { memoryOrders } from '../../src/lib/orders';
import type { Catalog } from '../../src/lib/catalog';
import type { PayPalClient, CaptureResult } from '../../src/lib/paypal';
import { PayPalError } from '../../src/lib/paypal';
import type { Mailer } from '../../src/lib/email';

const catalog: Catalog = { frog: { slug: 'frog', name: 'Frog', priceCents: 2995, inStock: true, option: { name: 'Colour', values: ['Pink'] }, thumb: '', maker: 'Hui', featured: 1 } };
const fd = (o: Record<string, string>) => { const f = new FormData(); for (const [k, v] of Object.entries(o)) f.set(k, v); return f; };
const address = { email: 'a@b.ie', name: 'Aoife', line1: '1 Main St', line2: '', city: 'Ennis', region: '', postcode: '', country: 'IE' };
const bag = [{ slug: 'frog', option: 'Pink', qty: 1 }];

function fakePaypal(capture: CaptureResult = { status: 'COMPLETED', captureId: 'CAP-1', payerEmail: 'p@x.ie' }) {
  const created: any[] = [];
  const captured: string[] = [];
  const pp: PayPalClient = {
    async createOrder(o, urls) { created.push({ o, urls }); return { id: 'PP-1', approveUrl: 'https://paypal.test/approve?token=PP-1' }; },
    async captureOrder(id) { captured.push(id); return capture; },
  };
  return { pp, created, captured };
}
const mailer = (fail = false) => { const sent: string[] = []; const m: Mailer = { async send(to) { if (fail) throw new Error('down'); sent.push(to); } }; return { m, sent }; };

describe('handlePay', () => {
  it('stores a pending order priced on the server and redirects to PayPal', async () => {
    const orders = memoryOrders();
    const { pp, created } = fakePaypal();
    const r = await handlePay(fd(address), bag, { catalog, orders, paypal: pp, paypalEnv: 'sandbox', origin: 'https://sunniedesigns.com', newRef: () => 'SUN-TEST01' });
    expect(r).toEqual({ kind: 'redirect', location: 'https://paypal.test/approve?token=PP-1' });
    expect(created[0].o).toMatchObject({ ref: 'SUN-TEST01', subtotalCents: 2995, shippingCents: 500, totalCents: 3495 });
    expect(created[0].urls).toEqual({ returnUrl: 'https://sunniedesigns.com/checkout/return/', cancelUrl: 'https://sunniedesigns.com/checkout/cancel/' });
    expect(await orders.findByPaypalId('PP-1')).toMatchObject({ ref: 'SUN-TEST01', status: 'pending' });
  });
  it('returns field errors without calling PayPal', async () => {
    const { pp, created } = fakePaypal();
    const r = await handlePay(fd({ ...address, email: 'bad' }), bag, { catalog, orders: memoryOrders(), paypal: pp, paypalEnv: 'sandbox', origin: 'https://x', newRef: () => 'SUN-X' });
    expect(r.kind).toBe('invalid');
    expect(created).toHaveLength(0);
  });
  it('refuses an empty bag', async () => {
    const r = await handlePay(fd(address), [], { catalog, orders: memoryOrders(), paypal: fakePaypal().pp, paypalEnv: 'sandbox', origin: 'https://x', newRef: () => 'SUN-X' });
    expect(r).toEqual({ kind: 'empty' });
  });
  it('turns an address rejection into a friendly message', async () => {
    const pp: PayPalClient = { async createOrder() { throw new PayPalError(422, 'SHIPPING_ADDRESS_INVALID'); }, async captureOrder() { return { status: 'FAILED', detail: '' }; } };
    const r = await handlePay(fd(address), bag, { catalog, orders: memoryOrders(), paypal: pp, paypalEnv: 'sandbox', origin: 'https://x', newRef: () => 'SUN-X' });
    expect(r.kind).toBe('payError');
    if (r.kind === 'payError') expect(r.message).toMatch(/address/i);
  });
});

describe('handleReturn', () => {
  async function pending() {
    const orders = memoryOrders();
    await orders.insertPending({ ref: 'SUN-TEST01', email: 'a@b.ie', address: { ...address }, lines: [{ slug: 'frog', name: 'Frog', option: 'Pink', qty: 1, unitCents: 2995, lineCents: 2995, thumb: '' }], subtotalCents: 2995, shippingCents: 500, totalCents: 3495, paypalEnv: 'sandbox' });
    await orders.setPaypalId('SUN-TEST01', 'PP-1');
    return orders;
  }
  it('captures, marks paid and emails buyer and shop', async () => {
    const orders = await pending();
    const { pp, captured } = fakePaypal();
    const { m, sent } = mailer();
    expect(await handleReturn('PP-1', { orders, paypal: pp, mailer: m, notifyEmail: 'hello@sunniedesigns.com' })).toEqual({ kind: 'complete', ref: 'SUN-TEST01' });
    expect(captured).toEqual(['PP-1']);
    expect(await orders.findByRef('SUN-TEST01')).toMatchObject({ status: 'paid', captureId: 'CAP-1', customerEmailed: true, shopEmailed: true });
    expect(sent).toEqual(['a@b.ie', 'hello@sunniedesigns.com']);
  });
  it('is idempotent: a second return does not capture or email again', async () => {
    const orders = await pending();
    const first = fakePaypal(); const { m, sent } = mailer();
    await handleReturn('PP-1', { orders, paypal: first.pp, mailer: m, notifyEmail: 'n@x' });
    const second = fakePaypal();
    expect(await handleReturn('PP-1', { orders, paypal: second.pp, mailer: m, notifyEmail: 'n@x' })).toEqual({ kind: 'complete', ref: 'SUN-TEST01' });
    expect(second.captured).toHaveLength(0);
    expect(sent).toHaveLength(2);
  });
  it('still completes when email fails, recording the error', async () => {
    const orders = await pending();
    const { m } = mailer(true);
    expect((await handleReturn('PP-1', { orders, paypal: fakePaypal().pp, mailer: m, notifyEmail: 'n@x' })).kind).toBe('complete');
    expect(await orders.findByRef('SUN-TEST01')).toMatchObject({ status: 'paid', customerEmailed: false, emailError: expect.stringContaining('down') });
  });
  it('treats ALREADY_CAPTURED as paid', async () => {
    const orders = await pending();
    const r = await handleReturn('PP-1', { orders, paypal: fakePaypal({ status: 'ALREADY_CAPTURED' }).pp, mailer: mailer().m, notifyEmail: 'n@x' });
    expect(r.kind).toBe('complete');
    expect((await orders.findByRef('SUN-TEST01'))?.status).toBe('paid');
  });
  it('reports a declined payment and leaves the order pending', async () => {
    const orders = await pending();
    const r = await handleReturn('PP-1', { orders, paypal: fakePaypal({ status: 'FAILED', detail: 'INSTRUMENT_DECLINED' }).pp, mailer: mailer().m, notifyEmail: 'n@x' });
    expect(r.kind).toBe('error');
    expect((await orders.findByRef('SUN-TEST01'))?.status).toBe('pending');
  });
  it('rejects unknown or missing tokens', async () => {
    const orders = await pending();
    expect((await handleReturn(null, { orders, paypal: fakePaypal().pp, mailer: mailer().m, notifyEmail: 'n@x' })).kind).toBe('error');
    expect((await handleReturn('PP-404', { orders, paypal: fakePaypal().pp, mailer: mailer().m, notifyEmail: 'n@x' })).kind).toBe('error');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tests/unit/checkout-handlers.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `src/lib/checkout-handlers.ts`**

```ts
import type { Catalog } from './catalog';
import type { BagLine } from './pricing';
import { priceBag } from './pricing';
import { validateCheckout, type CheckoutValues } from './checkout-form';
import type { OrdersRepo } from './orders';
import { PayPalError, type PayPalClient } from './paypal';
import { buildCustomerEmail, buildShopEmail, type Mailer } from './email';

export interface PayDeps { catalog: Catalog; orders: OrdersRepo; paypal: PayPalClient; paypalEnv: 'sandbox' | 'live'; origin: string; newRef: () => string }
export interface ReturnDeps { orders: OrdersRepo; paypal: PayPalClient; mailer: Mailer; notifyEmail: string }

type PayResult =
  | { kind: 'redirect'; location: string }
  | { kind: 'invalid'; values: CheckoutValues; errors: Record<string, string> }
  | { kind: 'empty' }
  | { kind: 'payError'; values: CheckoutValues; message: string };

export async function handlePay(form: FormData, bag: BagLine[], deps: PayDeps): Promise<PayResult> {
  const priced = priceBag(bag, deps.catalog);
  if (priced.lines.length === 0) return { kind: 'empty' };
  const v = validateCheckout(form);
  if (!v.ok) return { kind: 'invalid', values: v.values, errors: v.errors as Record<string, string> };
  const { email, ...address } = v.values;
  const input = { ref: deps.newRef(), email, address, lines: priced.lines, subtotalCents: priced.subtotalCents, shippingCents: priced.shippingCents, totalCents: priced.totalCents, paypalEnv: deps.paypalEnv };
  try {
    await deps.orders.insertPending(input);
  } catch {
    input.ref = deps.newRef();
    await deps.orders.insertPending(input);
  }
  try {
    const created = await deps.paypal.createOrder(input, { returnUrl: `${deps.origin}/checkout/return/`, cancelUrl: `${deps.origin}/checkout/cancel/` });
    await deps.orders.setPaypalId(input.ref, created.id);
    return { kind: 'redirect', location: created.approveUrl };
  } catch (err) {
    const issue = err instanceof PayPalError ? err.issue ?? '' : '';
    const message = /ADDRESS|POSTAL|STATE|CITY|COUNTRY/.test(issue)
      ? 'PayPal could not accept this delivery address. Please check the postcode and county or state, then try again.'
      : 'We could not reach PayPal just now. Your bag is saved, please try again in a minute.';
    return { kind: 'payError', values: v.values, message };
  }
}

export async function handleReturn(paypalOrderId: string | null, deps: ReturnDeps): Promise<{ kind: 'complete'; ref: string } | { kind: 'error'; message: string }> {
  const generic = 'We could not confirm your payment. You have not been charged twice. Please email hello@sunniedesigns.com and we will sort it out.';
  if (!paypalOrderId) return { kind: 'error', message: generic };
  const order = await deps.orders.findByPaypalId(paypalOrderId);
  if (!order) return { kind: 'error', message: generic };
  if (order.status === 'paid') return { kind: 'complete', ref: order.ref };

  const cap = await deps.paypal.captureOrder(paypalOrderId, order.ref);
  if (cap.status === 'FAILED') {
    return { kind: 'error', message: 'Your payment did not go through, so nothing was charged. Your bag is saved, please try again or use a different card.' };
  }
  await deps.orders.markPaid(order.ref, cap.status === 'COMPLETED' ? cap.captureId : 'ALREADY_CAPTURED', cap.status === 'COMPLETED' ? cap.payerEmail : undefined);
  const paid = (await deps.orders.findByRef(order.ref))!;

  let customer = false;
  let shop = false;
  const errors: string[] = [];
  try { await deps.mailer.send(paid.email, buildCustomerEmail(paid)); customer = true; } catch (e) { errors.push(`customer: ${(e as Error).message}`); }
  try { await deps.mailer.send(deps.notifyEmail, buildShopEmail(paid)); shop = true; } catch (e) { errors.push(`shop: ${(e as Error).message}`); }
  try { await deps.orders.recordEmail(order.ref, { customer, shop, error: errors.join('; ') || undefined }); } catch { /* never block the buyer */ }
  return { kind: 'complete', ref: order.ref };
}
```

- [ ] **Step 4: Run the tests**

Run: `npx vitest run tests/unit/checkout-handlers.test.ts`
Expected: PASS.

- [ ] **Step 5: Route files**

`src/pages/checkout/pay.ts`:
```ts
import type { APIRoute } from 'astro';
import { getEnv } from '../../lib/env';
import { loadCatalog } from '../../lib/catalog';
import { BAG_COOKIE, decodeBag } from '../../lib/bag-cookie';
import { d1Orders, newRef } from '../../lib/orders';
import { paypalClient } from '../../lib/paypal';
import { handlePay } from '../../lib/checkout-handlers';
import { isSameOrigin } from '../../lib/request';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect, rewrite, locals }) => {
  if (!isSameOrigin(request)) return new Response('Forbidden', { status: 403 });
  const env = getEnv();
  const origin = new URL(request.url).origin;
  const catalog = await loadCatalog((p) => env.ASSETS.fetch(new Request(new URL(p, origin))));
  const bag = await decodeBag(cookies.get(BAG_COOKIE)?.value, env.BAG_SECRET);
  const r = await handlePay(await request.formData(), bag, {
    catalog, orders: d1Orders(env.ORDERS),
    paypal: paypalClient({ clientId: env.PAYPAL_CLIENT_ID, secret: env.PAYPAL_CLIENT_SECRET, env: env.PAYPAL_ENV }),
    paypalEnv: env.PAYPAL_ENV, origin, newRef,
  });
  if (r.kind === 'redirect') return redirect(r.location, 303);
  if (r.kind === 'empty') return redirect('/bag/', 303);
  (locals as Record<string, unknown>).checkout = r.kind === 'invalid' ? { values: r.values, errors: r.errors } : { values: r.values, errors: {}, payError: r.message };
  return rewrite('/checkout/');
};
```
`rewrite('/checkout/')` renders the checkout page within the same POST request, with `locals` set. If Astro 6 won't rewrite a POST to a page that only reads (the page has no POST handler, but it renders on any method), check that `src/pages/checkout/index.astro` renders for POST as well. Astro pages render for every method by default. Otherwise, report NEEDS_CONTEXT with the error.

`src/pages/checkout/return.ts`:
```ts
import type { APIRoute } from 'astro';
import { getEnv } from '../../lib/env';
import { d1Orders } from '../../lib/orders';
import { paypalClient } from '../../lib/paypal';
import { resendMailer } from '../../lib/email';
import { handleReturn } from '../../lib/checkout-handlers';
import { BAG_COOKIE, ORDER_COOKIE, signValue } from '../../lib/bag-cookie';

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const env = getEnv();
  const r = await handleReturn(url.searchParams.get('token'), {
    orders: d1Orders(env.ORDERS),
    paypal: paypalClient({ clientId: env.PAYPAL_CLIENT_ID, secret: env.PAYPAL_CLIENT_SECRET, env: env.PAYPAL_ENV }),
    mailer: resendMailer({ apiKey: env.RESEND_API_KEY, from: env.ORDER_FROM_EMAIL, replyTo: 'hello@sunniedesigns.com' }),
    notifyEmail: env.ORDER_NOTIFY_EMAIL || 'hello@sunniedesigns.com',
  });
  if (r.kind === 'complete') {
    cookies.delete(BAG_COOKIE, { path: '/' });
    cookies.set(ORDER_COOKIE, await signValue(r.ref, env.BAG_SECRET), { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 24 });
    return redirect('/checkout/complete/', 303);
  }
  return redirect(`/checkout/complete/?error=${encodeURIComponent(r.message)}`, 303);
};
```

`src/pages/checkout/cancel.ts`:
```ts
import type { APIRoute } from 'astro';
export const prerender = false;
export const GET: APIRoute = ({ redirect }) => redirect('/bag/?cancelled=1', 303);
```

`src/pages/checkout/complete.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getEnv } from '../../lib/env';
import { ORDER_COOKIE, verifyValue } from '../../lib/bag-cookie';
import { d1Orders } from '../../lib/orders';
import { countryName } from '../../lib/checkout-form';
import { formatPrice } from '../../lib/products';
import { pageTitle } from '../../lib/seo';
import { site } from '../../data/site';

export const prerender = false;

const env = getEnv();
const error = Astro.url.searchParams.get('error');
const ref = error ? null : await verifyValue(Astro.cookies.get(ORDER_COOKIE)?.value, env.BAG_SECRET);
const order = ref ? await d1Orders(env.ORDERS).findByRef(ref) : null;
const euro = (c: number) => formatPrice(c / 100);
---
<BaseLayout title={pageTitle(error ? 'Payment problem' : 'Thank you')} description="Your Sunnie Designs order." path="/checkout/complete/" noindex>
  <div class="container narrow">
    {error ? (
      <header class="page-head"><h1>Payment problem</h1><p>{error}</p><p><a class="btn btn-primary" href="/bag/">Back to your bag</a></p></header>
    ) : (
      <>
        <header class="page-head">
          <h1>Thank you for your order</h1>
          {order && <p class="lead">Order <strong>{order.ref}</strong>. A confirmation is on its way to {order.email}.</p>}
          <p>Your pieces ship within {site.shipsIn} with tracking.</p>
        </header>
        {order && (
          <section class="bag-summary" aria-label="Order details">
            <ul class="summary-lines" role="list">
              {order.lines.map((l) => <li><span>{l.qty} × {l.name}{l.option && ` (${l.option})`}</span><span>{euro(l.lineCents)}</span></li>)}
            </ul>
            <dl>
              <div><dt>Shipping</dt><dd>{order.shippingCents === 0 ? 'Free' : euro(order.shippingCents)}</dd></div>
              <div class="bag-total"><dt>Total paid</dt><dd>{euro(order.totalCents)}</dd></div>
            </dl>
            <p class="small"><strong>Delivering to</strong><br />{[order.address.name, order.address.line1, order.address.line2, order.address.city, order.address.region, order.address.postcode, countryName(order.address.country)].filter(Boolean).join(', ')}</p>
          </section>
        )}
        <p>Questions about your order? Email <a href={`mailto:${site.email.hello}`}>{site.email.hello}</a>. See our <a href="/terms/">terms of sale</a> for returns.</p>
        <p><a class="btn-ghost" href="/shop/">Keep shopping</a></p>
      </>
    )}
  </div>
</BaseLayout>
```

- [ ] **Step 6: Local end-to-end with a local D1 and a PayPal stub**

Real PayPal isn't used locally. Verify the wiring with the local D1:
- `npx wrangler d1 migrations apply sunnie-orders --local`
- In `.dev.vars`, set `PAYPAL_ENV=sandbox`, `PAYPAL_CLIENT_ID=x`, `PAYPAL_CLIENT_SECRET=x`, `RESEND_API_KEY=x`, `ORDER_FROM_EMAIL=Sunnie Designs <orders@sunniedesigns.com>`, `ORDER_NOTIFY_EMAIL=hello@sunniedesigns.com` and `BAG_SECRET=local-test-secret-change-me`.
- POST `/checkout/pay/` with an invalid email and confirm the page re-renders with the error (HTTP 200, contains "Enter a valid email address").
- POST a valid form and confirm you get a friendly "could not reach PayPal" message (the fake credentials make the token call fail). Then check the local D1 has a `pending` row:
  `npx wrangler d1 execute sunnie-orders --local --command "SELECT ref,status,total_cents FROM orders"`
- `GET /checkout/cancel/` returns `303 → /bag/?cancelled=1`.
- `GET /checkout/return/?token=nope` returns `303 → /checkout/complete/?error=…`, and that page renders the problem message.

Stop only your own server.

- [ ] **Step 7: Run all tests and commit**

Run: `npm test && npm run check && npm run build && npm run test:dist`
```bash
git add -A
git commit -m "feat: PayPal pay/return/cancel routes with idempotent capture and thank-you page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Legal pages and site copy for direct checkout

Invoke `copywriting`, `copy-editing` and `stop-slop` for the wording. The legal facts below are fixed.

**Files:**
- Create: `src/pages/terms.astro`
- Modify: `src/pages/shipping.astro`, `src/pages/privacy.astro`, `src/pages/contact.astro`, `src/components/Footer.astro`, `src/components/TrustBar.astro`, `src/pages/index.astro` (homepage FAQ "where do I buy" answer), `src/data/category-faq.ts` (any "Buy on Etsy only" answers), `src/pages/llms.txt.ts` (key facts), `src/data/site.ts` (add `company` object), `tests/dist/launch.test.ts` (remove the "springfield" hash), `tests/dist/pages.test.ts`

**Interfaces:**
- Produces: `site.company = { legalName: 'Springfield Tectop Limited', tradingAs: 'Sunnie Designs', cro: '571256', registeredOffice: 'Clareview Car Sales, Ennis Road, Co. Limerick, V94 EA3A' }`, and `site.freeShippingFrom = '€49'`.

- [ ] **Step 1: Failing dist tests**

Append to `tests/dist/pages.test.ts`:
```ts
describe('seller identity', () => {
  it.each(['/terms/', '/contact/'])('%s shows the company details', (route) => {
    const html = page(route);
    for (const s of ['Springfield Tectop Limited', '571256', 'Clareview Car Sales, Ennis Road, Co. Limerick, V94 EA3A']) expect(html).toContain(s);
  });
  it('footer carries the company line on every page', () => {
    expect(page('/')).toMatch(/Springfield Tectop Limited[^<]*CRO 571256/);
  });
  it('terms cover cancellation and the model form', () => {
    const html = page('/terms/');
    for (const s of ['30 days', 'model cancellation form', 'return postage', '14 days', 'not registered for VAT']) expect(html).toContain(s);
  });
});
```
In `tests/dist/launch.test.ts`, remove the hash `7ba84b57db28dcd3757ae13ee1c5ad77a194ae45575e72491bdcd8118babe0f4` ("springfield") from the private token set, with a comment that it's now the public company name. Keep the other four.

Run `npm run build && npm run test:dist`. Expected: the new tests FAIL.

- [ ] **Step 2: `src/data/site.ts`**

Add inside the `site` object:
```ts
  company: {
    legalName: 'Springfield Tectop Limited',
    tradingAs: 'Sunnie Designs',
    cro: '571256',
    registeredOffice: 'Clareview Car Sales, Ennis Road, Co. Limerick, V94 EA3A',
  },
  freeShippingFrom: '€49',
```

- [ ] **Step 3: `src/pages/terms.astro`**

Write it with this structure and these facts, in plain English:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { site } from '../data/site';
import { pageTitle } from '../lib/seo';
const c = site.company;
---
<BaseLayout title={pageTitle('Terms of sale')} description="Terms of sale for orders placed on sunniedesigns.com: prices, delivery, 30-day returns and your right to cancel.">
  <article class="container narrow prose">
    <header class="page-head"><h1>Terms of sale</h1><p>Last updated: October 2026.</p></header>

    <h2>Who you're buying from</h2>
    <p>This website is run by {c.legalName}, trading as {c.tradingAs}. Company registration number (CRO) {c.cro}. Registered office: {c.registeredOffice}. Email: <a href={`mailto:${site.email.hello}`}>{site.email.hello}</a>.</p>

    <h2>Prices and payment</h2>
    <p>Prices are in euro. {c.legalName} is not registered for VAT, so no VAT is added. You pay through PayPal, by PayPal account or by debit or credit card. We never see your card details.</p>
    <p>Your contract with us starts when your payment goes through and we show your order number.</p>

    <h2>Delivery</h2>
    <p>Each piece is made by hand to order and ships within {site.shipsIn} with tracking. Shipping costs €5.00 per order, and it's free on orders of €49.00 or more. We ship worldwide. Buyers outside the EU may have to pay import charges set by their country.</p>

    <h2>Returns and your right to cancel</h2>
    <p>You can cancel and return any item within 30 days of delivery, for any reason. This is longer than the 14 days the law requires.</p>
    <ol>
      <li>Email <a href={`mailto:${site.email.hello}`}>{site.email.hello}</a> with your order number, or send us the model cancellation form below.</li>
      <li>Send the item back unused within 14 days of telling us. You pay the return postage.</li>
      <li>We refund the item price and the original standard shipping within 14 days of receiving the item, to the payment method you used.</li>
    </ol>

    <h2>Faulty or wrong items</h2>
    <p>If something arrives damaged, faulty or not as described, email us with a photo. We'll cover the return and send a replacement or a full refund. This doesn't affect your legal rights as a consumer.</p>

    <h2>Model cancellation form</h2>
    <p>(Complete and return this form only if you wish to cancel the contract.)</p>
    <p>To {c.legalName}, {c.registeredOffice}, {site.email.hello}:<br />
    I/We hereby give notice that I/We cancel my/our contract of sale of the following goods: ____<br />
    Ordered on / received on: ____<br />
    Order number: ____<br />
    Name of consumer(s): ____<br />
    Address of consumer(s): ____<br />
    Signature of consumer(s) (only if this form is notified on paper): ____<br />
    Date: ____</p>

    <h2>Complaints and governing law</h2>
    <p>If you're unhappy, email {site.email.hello} and we'll reply within 24 hours on working days. These terms are governed by Irish law, and nothing in them removes the rights you have as a consumer in your own country.</p>

    <h2>Orders on Etsy</h2>
    <p>Orders placed on our Etsy shop follow Etsy's checkout and the policies shown on each Etsy listing.</p>
  </article>
</BaseLayout>
```

- [ ] **Step 4: Other page updates**

- **`Footer.astro`:** add a "Terms" link under Help, and a company line in `.footer-legal`: `© {year} Sunnie Designs · {site.company.legalName}, CRO {site.company.cro}, {site.company.registeredOffice}`.
- **`contact.astro`:** add a "Company details" paragraph with `legalName`, `tradingAs`, CRO and registered office.
- **`shipping.astro`:** rewrite into three sections:
  - Buying on this website: €5 shipping, free on orders of €49 or more, ships in 3–5 days with tracking, worldwide.
  - Returns: 30 days, buyer pays postage, refund within 14 days of receipt, with a link to `/terms/`.
  - Buying on Etsy: keep the existing Etsy wording.
- **`privacy.astro`:**
  - When you order: we collect your name, email, delivery address and what you bought, to fulfil the order.
  - Processors: PayPal (payment), Resend (order emails), Cloudflare (hosting and order database).
  - We keep order records for 6 years to meet Irish tax rules.
  - Cookies: we use two strictly necessary cookies, one to remember your bag and one to show your order confirmation. No tracking cookies.
  - Keep the existing sections.
- **`TrustBar.astro`:** change the first item to `Free shipping over {site.freeShippingFrom}, ships in {site.shipsIn}`, keeping 4 items.
- **`index.astro` homepage FAQ:** answer "Where do I buy?" with "Right here: add pieces to your bag and pay with PayPal or any card, no account needed. Every piece is also on our Etsy shop if you prefer Etsy." Mention free shipping over €49 and 30-day returns.
- **`category-faq.ts`:** update any answer that says purchases happen only on Etsy, in the same way.
- **`llms.txt.ts` key facts:** replace "Orders are placed on Etsy" with "Buy directly on sunniedesigns.com with PayPal or card, or on Etsy". Add "Free worldwide shipping on orders of €49 or more (otherwise €5)" and "30-day returns".
- **`home.test.ts` trust bar strings:** update to the new first item.

- [ ] **Step 5: Build, test, commit**

Run: `npm run build && npm run test:dist && npm test && npm run check`
Expected: all pass.
```bash
git add -A
git commit -m "content: terms of sale, company details, checkout-ready shipping, privacy and FAQ copy

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Owner setup, sandbox end-to-end, and go-live

**Run this task in the main session (it needs the owner and the browser).**

**Files:**
- Create: `docs/checkout-setup.md`
- Modify: `wrangler.jsonc` (real `database_id`), `docs/deploy.md` (deploy command applies migrations)

- [ ] **Step 1: Write `docs/checkout-setup.md`** with numbered owner steps:

1. **D1:** run `npx wrangler login`, then `npx wrangler d1 create sunnie-orders`, and send Claude the printed `database_id`. Claude commits it.
2. **Deploy command:** in Cloudflare → Workers & Pages → sunnie-website → Settings → Builds, set the deploy command to `npx wrangler d1 migrations apply sunnie-orders --remote && npx wrangler deploy`. Leave the non-production branch command as `npx wrangler versions upload`.
3. **PayPal sandbox:**
   - Log in at developer.paypal.com with the PayPal Business login. Under Apps & Credentials → Sandbox, open "Default Application" and copy the Client ID and Secret.
   - Under Sandbox → Accounts, note the personal (buyer) test account email and password.
4. **Resend:**
   - Create an account and add the domain `sunniedesigns.com`. Add the DNS records Resend shows in Cloudflare DNS (SPF/DKIM TXT and MX on the `send` subdomain), then wait for "Verified".
   - Create an API key.
5. **Secrets:** in Cloudflare → sunnie-website → Settings → Variables and Secrets, add these as **Secret** type:
   - `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` (the sandbox values for now)
   - `PAYPAL_ENV` = `sandbox`
   - `RESEND_API_KEY`
   - `BAG_SECRET`: a long random string. Generate it with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
   - `ORDER_NOTIFY_EMAIL` = `hello@sunniedesigns.com`
   - `ORDER_FROM_EMAIL` = `Sunnie Designs <orders@sunniedesigns.com>`
6. **PayPal guest card payments:** in the live PayPal Business account settings, check that "PayPal account optional" (guest checkout) is on, so buyers can pay by card without an account.

- [ ] **Step 2: Commit the database ID** once the owner sends it

- [ ] **Step 3: Push the branch to get a preview**

Push `phase2-checkout`. Workers Builds uploads a preview version. Get its preview URL from the Cloudflare dashboard (Deployments → the version → Preview URL), or from the build log.

- [ ] **Step 4: Sandbox end-to-end** (Claude, in the built-in browser)

On the preview URL:
1. Add the frog in Pink and a coaster. Check the bag shows €5 shipping and the nudge.
2. Add another piece to pass €49. Check shipping shows Free.
3. Checkout with a test address. Check PayPal sandbox opens and you can log in with the sandbox buyer.
4. Pay. Check `/checkout/complete/` shows the ref and the bag is empty.
5. Check the order row: `npx wrangler d1 execute sunnie-orders --remote --command "SELECT ref,status,paypal_env,total_cents,customer_emailed,shop_emailed,email_error FROM orders ORDER BY id DESC LIMIT 3"`. Expected: `paid`, `sandbox`, both emailed `1`.
6. Confirm both emails arrived (ask the owner to check `hello@`).
7. Reload the complete URL, and replay `/checkout/return/?token=<same>`. Check there's no second capture and no second email (the `shop_emailed` count doesn't increase).
8. Cancel on PayPal. Check you're back at `/bag/` with the notice and the items intact.

Record the results in `docs/checkout-setup.md` under "Sandbox test log".

- [ ] **Step 5: Owner sandbox purchase and terms review**

The owner repeats Step 4 items 1–4 on the preview URL. The owner (or their solicitor or accountant) reviews `/terms/`.

- [ ] **Step 6: Go live**

1. The owner creates a **Live** app in developer.paypal.com and replaces `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` with the live values, then sets `PAYPAL_ENV` = `live`.
2. Merge `phase2-checkout` into `main` (fast-forward) and push. Workers Builds applies migrations and deploys.
3. Delete the sandbox test rows: `npx wrangler d1 execute sunnie-orders --remote --command "DELETE FROM orders WHERE paypal_env = 'sandbox'"`.
4. The owner places one real low-value order, for example a single coaster, and refunds it from PayPal. That confirms live capture and both emails.
5. Update `docs/deploy.md` with the new deploy command and link `docs/checkout-setup.md`.

Commit:
```bash
git add -A
git commit -m "docs: checkout setup, sandbox test log and go-live steps

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
