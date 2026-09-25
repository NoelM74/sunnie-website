# Sunnie Designs Storefront (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and launch sunniedesigns.com: a fast, zero-JavaScript Astro catalog of 51 handmade crochet products, where every product page sends buyers to its Etsy listing.

**Architecture:** Astro 6 builds a fully static site (`dist/`). Cloudflare Workers serves it through static assets, and a push to `main` on GitHub triggers Workers Builds. Each product is a Markdown file in an Astro content collection that Zod validates, with photos in `src/assets/products/<slug>/`. A one-off Node script imports the Etsy CSV export. Pure logic (Etsy parsing, product sorting, SEO helpers, logo geometry, link extraction) lives in small modules with Vitest unit tests. A second Vitest suite asserts against the built HTML in `dist/`.

**Tech Stack:** Astro 6.4, TypeScript 5.9, Vitest 4.1, @astrojs/sitemap 3.7, sharp, csv-parse 6, opentype.js 1.3, @fontsource (Fraunces, Atkinson Hyperlegible), Wrangler 4, Cloudflare Workers Builds.

**Spec:** `docs/superpowers/specs/2026-09-25-sunnie-storefront-design.md`. Deviations from the spec, decided while planning:
- Product image frontmatter uses `src` instead of `file`, because Astro's `image()` resolves it.
- Display names drop the leading "Crochet". The full Etsy title stays in `seoTitle`.
- `size` is filled by hand in Task 13, because the Etsy descriptions state sizes in too many formats to parse.
- Gallery images after the first are WebP only, to keep the Workers Builds time down.

## Global Constraints

- Astro `^6.4.8`. Do not upgrade to Astro 7 in Phase 1. Node `>=22.12.0` (`.node-version` = `22`). TypeScript `5.9.x`, Vitest `4.1.x`.
- **No client-side JavaScript.** The only `<script>` tags allowed in built HTML are `type="application/ld+json"`.
- No Tailwind and no UI framework. All CSS lives in `src/styles/tokens.css` and `src/styles/global.css`.
- Colours come only from the tokens. **Terracotta text on sand always uses `--terracotta-deep` (`#9C3F1D`).** Nav text is umber; terracotta in the nav marks only the active page.
- Body text is at least 18px and at most `65ch` wide. Every interactive element gets a 3px `#96401E` focus ring with 3px offset. Inputs and buttons are at least 48px tall. Transitions are 150ms ease.
- Copy rules: sentence case, no exclamation marks, no em dashes, `stop-slop` applied to every sentence of site copy.
- **Never state where products are made.** Site-wide maker wording comes from `site.makerLine` / `site.heroMakerClause`. Each product shows its own `maker`.
- **Never render the review by "noel francis".** Never link to the eBay store (quoting the feedback count as text is fine).
- **Never commit `shop_settings.json`** or any phone number, address, card or bank detail from it.
- Image masters are 1400px max, JPEG quality 80. AVIF + WebP only for the hero, product cards and the first gallery slide; every other image is WebP only (this keeps build time down).
- All internal URLs end with `/`. Email addresses come only from `site.email`.
- Commits: repo-local author is already set. End every commit message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Etsy source data lives outside the repo at `E:\SUNNIE BUSINESS FILES AND PHOTOS\1. New ETSY Products\` (Git Bash path: `/e/SUNNIE BUSINESS FILES AND PHOTOS/1. New ETSY Products`).

## Skills to invoke during execution

| Task | Skills |
|---|---|
| 2 (logo) | `brand-visuals` |
| 4, 8, 9, 10, 11 (UI) | `frontend-design`, `make-interfaces-feel-better` |
| 3, 9 (SEO data) | `schema-markup` |
| 8, 10 (IA, conversion) | `site-architecture`, `page-cro` |
| 10, 11, 13 (copy) | `copywriting`, `ogilvy-copywriting`, `copy-editing`, `stop-slop` |
| 15 (deploy) | `cloudflare:wrangler`, `cloudflare:workers-best-practices` |
| 16 (QA) | `cloudflare:web-perf`, `design:accessibility-review`, `web-design-guidelines`, `seo-audit`, `design-review`, `qa`, `benchmark` |

## File structure

```
.node-version                     Node 22 for Workers Builds
package.json / astro.config.mjs / tsconfig.json / vitest.config.ts / wrangler.jsonc
public/robots.txt                 crawl rules + sitemap
public/favicon.svg, favicon-32.png, apple-touch-icon.png, og-default.png   (generated, Task 2)
scripts/
  lib/logo.mjs                    pure SVG builders for the logo set
  lib/etsy.mjs                    pure Etsy CSV → product conversion
  lib/links.mjs                   pure href extraction for the link checker
  build-logo.mjs                  writes brand SVGs + PNG icons
  import-etsy.mjs                 one-off importer (images, product .md, reviews.json)
  apply-etsy-urls.mjs             writes Etsy listing URLs into product files
  check-links.mjs                 checks internal + external links in dist/
  etsy-overrides.json             names/groups/featured flags keyed by Etsy title prefix
  review-translations.json        English translations of German reviews
data/etsy-urls.json               scraped Etsy listing titles → URLs (Task 12)
src/
  content.config.ts               products collection schema
  content/products/<slug>.md      51 products
  assets/products/<slug>/NN.jpg   photo masters
  assets/brand/logo-*.svg         logo set
  assets/story/hands.jpg          story photo (placeholder until the owner supplies one)
  data/site.ts                    brand name, maker line, emails, proof numbers
  data/reviews.json               filtered, translated reviews
  lib/products.ts                 sorting, filtering, featured, related, nav rule, price format
  lib/seo.ts                      titles, meta descriptions, JSON-LD builders
  styles/tokens.css, global.css
  layouts/BaseLayout.astro
  components/Seo.astro, JsonLd.astro, Header.astro, Footer.astro, Breadcrumbs.astro,
             ProductCard.astro, ProductGrid.astro, Gallery.astro, TrustBar.astro, ReviewQuote.astro
  pages/index.astro, 404.astro, our-story.astro, reviews.astro, shipping.astro, care.astro,
        contact.astro, privacy.astro, shop/index.astro, shop/bags.astro, shop/[category].astro,
        products/[slug].astro
tests/unit/*.test.{mjs,ts}        pure-module tests
tests/dist/*.test.ts              assertions on built HTML
docs/deploy.md                    Cloudflare setup steps for the owner
```

---

### Task 1: Project scaffold, build and test harness

**Files:**
- Create: `package.json`, `.node-version`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `wrangler.jsonc`, `src/pages/index.astro`, `tests/dist/helpers.ts`, `tests/dist/site.test.ts`
- Modify: `.gitignore`

**Interfaces:**
- Produces: npm scripts `build`, `check`, `test` (unit), `test:dist`, `verify`, `logo`, `import:etsy`, `etsy:urls`, `links`, `deploy`. `tests/dist/helpers.ts` exports `DIST`, `htmlFiles(dir?) → string[]`, `page(route) → string`, `jsonLd(html) → any[]`, `rel(file) → string`.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "sunnie-website",
  "type": "module",
  "private": true,
  "version": "0.1.0",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "check": "astro check",
    "test": "vitest run tests/unit",
    "test:dist": "vitest run tests/dist",
    "verify": "npm run check && npm test && npm run build && npm run test:dist",
    "logo": "node scripts/build-logo.mjs",
    "import:etsy": "node scripts/import-etsy.mjs",
    "etsy:urls": "node scripts/apply-etsy-urls.mjs",
    "links": "node scripts/check-links.mjs",
    "preview": "astro build && wrangler dev",
    "deploy": "astro build && wrangler deploy"
  }
}
```

- [ ] **Step 2: Install pinned dependencies**

Run:
```bash
npm install astro@6.4.8 @astrojs/sitemap@3.7.4 @fontsource-variable/fraunces@5.3.0 @fontsource/atkinson-hyperlegible@5.3.0
npm install -D typescript@5.9.3 @astrojs/check@0.9.10 vitest@4.1.11 wrangler@4.140.0 sharp@0.35.4 csv-parse@6.2.1 opentype.js@1.3.4 @fontsource/fraunces@5.3.0
```
Expected: both finish without `ERR!`. `package.json` now has `dependencies` and `devDependencies`.

- [ ] **Step 3: Write config files**

`.node-version`:
```
22
```

`astro.config.mjs`:
```js
// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sunniedesigns.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});
```

`tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules"]
}
```

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { environment: 'node' },
});
```

`wrangler.jsonc`:
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "sunnie-website",
  "compatibility_date": "2026-09-01",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page",
    "html_handling": "auto-trailing-slash"
  }
}
```

Append to `.gitignore`:
```
# Etsy raw exports stay outside the repo
EtsyListingsDownload.csv
```

- [ ] **Step 4: Write a placeholder home page**

`src/pages/index.astro`:
```astro
---
---
<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><title>Sunnie Designs</title></head>
  <body><h1>Sunnie Designs</h1></body>
</html>
```

- [ ] **Step 5: Write the dist test harness and a failing test**

`tests/dist/helpers.ts`:
```ts
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

export const DIST = join(process.cwd(), 'dist');

export function htmlFiles(dir = DIST): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...htmlFiles(p));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

export function page(route: string): string {
  const file = route === '/404/' ? join(DIST, '404.html') : join(DIST, route, 'index.html');
  if (!existsSync(file)) throw new Error(`Missing built page ${route} (${file})`);
  return readFileSync(file, 'utf8');
}

export function jsonLd(html: string): any[] {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1]),
  );
}

export const rel = (file: string) => relative(DIST, file).replaceAll('\\', '/');
```

`tests/dist/site.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { page } from './helpers';

describe('home page', () => {
  it('is built with lang="en"', () => {
    expect(page('/')).toMatch(/<html lang="en"/);
  });
});
```

- [ ] **Step 6: Run the dist test before building to confirm it fails**

Run: `npm run test:dist`
Expected: FAIL with `Missing built page /`.

- [ ] **Step 7: Build and rerun**

Run: `npm run build && npm run test:dist`
Expected: build prints `Complete!`; test PASS (1 test).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro 6 site with Workers config and dist test harness

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Logo set, favicon and social image

Invoke `brand-visuals` first and use it to check the generated mark against the spec (5–7 bold rays, reads in one colour, recognisable at 16px).

**Files:**
- Create: `scripts/lib/logo.mjs`, `scripts/build-logo.mjs`, `tests/unit/logo.test.mjs`
- Generated (committed): `src/assets/brand/logo-full.svg`, `src/assets/brand/logo-umber.svg`, `src/assets/brand/logo-terracotta.svg`, `public/favicon.svg`, `public/favicon-32.png`, `public/apple-touch-icon.png`, `public/og-default.png`

**Interfaces:**
- Produces: `COLORS`, `variantColors(variant: 'full'|'umber'|'terracotta')`, `rays(color, count=7) → string`, `sunMark(colors) → string`, `svgDoc({width,height,label,body}) → string` from `scripts/lib/logo.mjs`. The header (Task 4) imports `src/assets/brand/logo-full.svg?raw`.

- [ ] **Step 1: Write failing tests**

`tests/unit/logo.test.mjs`:
```js
import { describe, expect, it } from 'vitest';
import { COLORS, rays, sunMark, svgDoc, variantColors } from '../../scripts/lib/logo.mjs';

const hexes = (s) => new Set((s.match(/#[0-9A-F]{6}/gi) ?? []).map((h) => h.toUpperCase()));

describe('logo builders', () => {
  it('draws seven rays', () => {
    expect(rays('#000000').match(/<rect/g)).toHaveLength(7);
  });

  it('full colour sun uses terracotta rays and a butter centre', () => {
    const s = sunMark(variantColors('full'));
    expect(hexes(s)).toEqual(new Set([COLORS.terracotta, COLORS.butter]));
  });

  it('umber variant is strictly one colour', () => {
    expect(hexes(sunMark(variantColors('umber')))).toEqual(new Set([COLORS.umber]));
  });

  it('terracotta variant is strictly one colour', () => {
    expect(hexes(sunMark(variantColors('terracotta')))).toEqual(new Set([COLORS.terracotta]));
  });

  it('wraps content in an accessible svg document', () => {
    const doc = svgDoc({ width: 100, height: 50, label: 'Sunnie Designs', body: '<g/>' });
    expect(doc).toContain('viewBox="0 0 100 50"');
    expect(doc).toContain('role="img"');
    expect(doc).toContain('aria-label="Sunnie Designs"');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tests/unit/logo.test.mjs`
Expected: FAIL, cannot resolve `scripts/lib/logo.mjs`.

- [ ] **Step 3: Implement `scripts/lib/logo.mjs`**

```js
export const COLORS = {
  umber: '#4A3222',
  umberMuted: '#7A6855',
  terracotta: '#B04A24',
  butter: '#F0E2C4',
  linen: '#FBF6EE',
};

export function variantColors(variant) {
  switch (variant) {
    case 'full':
      return { ray: COLORS.terracotta, ring: COLORS.terracotta, center: COLORS.butter, word: COLORS.umber, sub: COLORS.umberMuted };
    case 'umber':
      return { ray: COLORS.umber, ring: COLORS.umber, center: null, word: COLORS.umber, sub: COLORS.umber };
    case 'terracotta':
      return { ray: COLORS.terracotta, ring: COLORS.terracotta, center: null, word: COLORS.terracotta, sub: COLORS.terracotta };
    default:
      throw new Error(`Unknown logo variant: ${variant}`);
  }
}

// Sun drawn in a 100×100 box centred on (50,50). Rays run from r=30 to r=46.
export function rays(color, count = 7) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const angle = ((360 / count) * i).toFixed(2);
    out.push(`<rect x="45.5" y="4" width="9" height="16" rx="4.5" fill="${color}" transform="rotate(${angle} 50 50)"/>`);
  }
  return out.join('');
}

// Ring spans r=17..24. With no centre colour the middle stays transparent (one-colour builds).
export function sunMark({ ray, ring, center }) {
  return `<g>${rays(ray)}<circle cx="50" cy="50" r="20.5" fill="${center ?? 'none'}" stroke="${ring}" stroke-width="7"/></g>`;
}

export function svgDoc({ width, height, label, body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${label}">${body}</svg>\n`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/unit/logo.test.mjs`
Expected: PASS (5 tests).

- [ ] **Step 5: Confirm the font files exist**

Run: `ls node_modules/@fontsource/fraunces/files | grep -E "latin-(500-normal|400-italic)\.woff$"`
Expected:
```
fraunces-latin-400-italic.woff
fraunces-latin-500-normal.woff
```
If the names differ, use the listed names in Step 6.

- [ ] **Step 6: Write `scripts/build-logo.mjs`**

```js
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import opentype from 'opentype.js';
import sharp from 'sharp';
import { COLORS, sunMark, svgDoc, variantColors } from './lib/logo.mjs';

const FONT_DIR = 'node_modules/@fontsource/fraunces/files';
const load = (file) => {
  const buf = readFileSync(`${FONT_DIR}/${file}`);
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const serif = load('fraunces-latin-500-normal.woff');
const italic = load('fraunces-latin-400-italic.woff');

// Wordmark outlines so the SVGs render without the font installed.
const sunnie = serif.getPath('Sunnie', 116, 62, 64);
const designs = italic.getPath('Designs', 118, 92, 26);
const width = Math.ceil(Math.max(sunnie.getBoundingBox().x2, designs.getBoundingBox().x2) + 4);
const height = 100;

function fullLogo(variant) {
  const c = variantColors(variant);
  const body =
    sunMark(c) +
    `<path d="${sunnie.toPathData(2)}" fill="${c.word}"/>` +
    `<path d="${designs.toPathData(2)}" fill="${c.sub}"/>`;
  return svgDoc({ width, height, label: 'Sunnie Designs', body });
}

mkdirSync('src/assets/brand', { recursive: true });
mkdirSync('public', { recursive: true });
for (const v of ['full', 'umber', 'terracotta']) {
  writeFileSync(`src/assets/brand/logo-${v}.svg`, fullLogo(v));
}

const favicon = svgDoc({ width: 100, height: 100, label: 'Sunnie Designs', body: sunMark(variantColors('full')) });
writeFileSync('public/favicon.svg', favicon);

await sharp(Buffer.from(favicon), { density: 300 }).resize(32, 32).png().toFile('public/favicon-32.png');

const touchSun = await sharp(Buffer.from(favicon), { density: 600 }).resize(132, 132).png().toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: COLORS.linen } })
  .composite([{ input: touchSun, gravity: 'centre' }])
  .png()
  .toFile('public/apple-touch-icon.png');

const logoPng = await sharp(Buffer.from(fullLogo('full')), { density: 600 }).resize({ width: 720 }).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: COLORS.linen } })
  .composite([{ input: logoPng, gravity: 'centre' }])
  .png()
  .toFile('public/og-default.png');

console.log(`Logo set written (wordmark width ${width}).`);
```

- [ ] **Step 7: Generate the set and inspect it**

Run: `npm run logo`
Expected: `Logo set written (wordmark width …).`
Then open `public/og-default.png`, `public/favicon-32.png` and `src/assets/brand/logo-full.svg` with the Read tool and check: the rays are evenly spaced, the wordmark sits beside the sun without overlapping, "Designs" doesn't clip, and the 32px favicon still reads as a sun. If anything clips, adjust the `getPath` coordinates or sizes in Step 6 and rerun.

- [ ] **Step 8: Commit**

```bash
git add scripts/lib/logo.mjs scripts/build-logo.mjs tests/unit/logo.test.mjs src/assets/brand public
git commit -m "feat: generate Sunnie Designs logo set, favicons and default social image

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Site settings and SEO helpers

Invoke `schema-markup` before writing the JSON-LD builders.

**Files:**
- Create: `src/data/site.ts`, `src/lib/seo.ts`, `tests/unit/seo.test.ts`

**Interfaces:**
- Produces: `site` (see code). From `src/lib/seo.ts`: `BRAND_SUFFIX`, `pageTitle(title) → string`, `productTitle(name) → string`, `metaDescription(text, max=155) → string`, `absoluteUrl(path) → string`, `productJsonLd(p: ProductLdInput) → object`, `organizationJsonLd() → object`, `websiteJsonLd() → object`, `breadcrumbJsonLd(items: {name:string; path:string}[]) → object`.

- [ ] **Step 1: Write `src/data/site.ts`**

```ts
export const site = {
  name: 'Sunnie Designs',
  url: 'https://sunniedesigns.com',
  description:
    'Crochet phone bags, totes and coasters, each one made by hand by Hui. Rated 4.9 on Etsy. Ships in 3–7 days.',
  // Change these two lines when pieces from other makers join the shop.
  makerLine: 'Handmade by Hui',
  heroMakerClause: 'each one made by hand by Hui',
  email: {
    hello: 'hello@sunniedesigns.com',
    hui: 'hui@sunniedesigns.com',
  },
  etsyShopUrl: 'https://www.etsy.com/shop/SunnieDesignCo',
  shipsIn: '3–7 days',
  replyTime: 'within 24 hours',
  proof: {
    etsyRating: '4.9',
    ebayCount: '250+',
    ebayPositive: '100%',
  },
} as const;
```

- [ ] **Step 2: Write failing tests**

`tests/unit/seo.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  metaDescription,
  organizationJsonLd,
  pageTitle,
  productJsonLd,
  productTitle,
} from '../../src/lib/seo';

describe('titles', () => {
  it('adds the brand suffix', () => {
    expect(pageTitle('Our story')).toBe('Our story | Sunnie Designs');
  });
  it('leaves the bare brand name alone', () => {
    expect(pageTitle('Sunnie Designs')).toBe('Sunnie Designs');
  });
  it('uses the long product form when it fits in 60 chars', () => {
    expect(productTitle('Poodle crossbody bag')).toBe('Poodle crossbody bag, handmade crochet | Sunnie Designs');
  });
  it('drops the qualifier when too long', () => {
    const t = productTitle('Blue stripe tote bag with removable flower');
    expect(t).toBe('Blue stripe tote bag with removable flower | Sunnie Designs');
    expect(t.length).toBeLessThanOrEqual(60);
  });
  it('truncates very long names with an ellipsis', () => {
    const t = productTitle('An extraordinarily long product name that keeps going and going');
    expect(t.length).toBeLessThanOrEqual(60);
    expect(t).toMatch(/…\s\|\sSunnie Designs$/);
  });
});

describe('metaDescription', () => {
  it('strips markdown and collapses whitespace', () => {
    expect(metaDescription('**Soft** bag.\n\n- Fits a phone\n- Hand-crocheted')).toBe('Soft bag. Fits a phone Hand-crocheted');
  });
  it('cuts on a word boundary with an ellipsis', () => {
    const d = metaDescription('word '.repeat(60));
    expect(d.length).toBeLessThanOrEqual(155);
    expect(d.endsWith('…')).toBe(true);
    expect(d).not.toMatch(/\s…$/);
  });
});

describe('JSON-LD', () => {
  it('builds a Product with a EUR offer', () => {
    const ld = productJsonLd({
      name: 'Frog bag',
      description: 'A frog.',
      url: 'https://sunniedesigns.com/products/frog/',
      images: ['https://sunniedesigns.com/a.jpg'],
      price: 24.95,
      inStock: false,
    });
    expect(ld['@type']).toBe('Product');
    expect(ld.brand.name).toBe('Sunnie Designs');
    expect(ld.offers).toMatchObject({
      priceCurrency: 'EUR',
      price: '24.95',
      availability: 'https://schema.org/SoldOut',
    });
    expect(ld).not.toHaveProperty('aggregateRating');
  });
  it('builds absolute breadcrumb URLs', () => {
    const ld = breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Bags', path: '/shop/bags/' }]);
    expect(ld.itemListElement[1]).toEqual({
      '@type': 'ListItem',
      position: 2,
      name: 'Bags',
      item: 'https://sunniedesigns.com/shop/bags/',
    });
  });
  it('links the organisation to Etsy', () => {
    expect(organizationJsonLd().sameAs).toContain('https://www.etsy.com/shop/SunnieDesignCo');
  });
  it('makes absolute URLs', () => {
    expect(absoluteUrl('/shop/')).toBe('https://sunniedesigns.com/shop/');
  });
});
```

- [ ] **Step 3: Run to verify failure**

Run: `npx vitest run tests/unit/seo.test.ts`
Expected: FAIL, cannot resolve `src/lib/seo`.

- [ ] **Step 4: Implement `src/lib/seo.ts`**

```ts
import { site } from '../data/site';

export const BRAND_SUFFIX = ` | ${site.name}`;
const MAX_TITLE = 60;

export function pageTitle(title: string): string {
  return title === site.name ? title : `${title}${BRAND_SUFFIX}`;
}

export function productTitle(name: string): string {
  const long = `${name}, handmade crochet${BRAND_SUFFIX}`;
  if (long.length <= MAX_TITLE) return long;
  const short = `${name}${BRAND_SUFFIX}`;
  if (short.length <= MAX_TITLE) return short;
  const room = MAX_TITLE - BRAND_SUFFIX.length - 1;
  return `${name.slice(0, room).trimEnd()}…${BRAND_SUFFIX}`;
}

export function metaDescription(text: string, max = 155): string {
  const plain = text
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/[*_#>`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${cut.slice(0, space > 0 ? space : cut.length).replace(/[,.;:]$/, '')}…`;
}

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).href;
}

export interface ProductLdInput {
  name: string;
  description: string;
  url: string;
  images: string[];
  price: number;
  inStock: boolean;
}

export function productJsonLd(p: ProductLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: p.images,
    url: p.url,
    brand: { '@type': 'Brand', name: site.name },
    offers: {
      '@type': 'Offer',
      url: p.url,
      priceCurrency: 'EUR',
      price: p.price.toFixed(2),
      availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    logo: absoluteUrl('/apple-touch-icon.png'),
    email: site.email.hello,
    sameAs: [site.etsyShopUrl],
  };
}

export function websiteJsonLd() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/unit/seo.test.ts`
Expected: PASS (11 tests).

- [ ] **Step 6: Commit**

```bash
git add src/data/site.ts src/lib/seo.ts tests/unit/seo.test.ts
git commit -m "feat: add site settings and SEO title, description and JSON-LD helpers

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Design tokens, base layout, header and footer

Invoke `frontend-design` and `make-interfaces-feel-better` before writing CSS. Follow the tokens exactly; use the skills for spacing, rhythm and interaction detail.

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/components/Seo.astro`, `src/components/JsonLd.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/layouts/BaseLayout.astro`, `public/robots.txt`
- Modify: `src/pages/index.astro`, `tests/dist/site.test.ts`

**Interfaces:**
- Consumes: `site` (Task 3), `absoluteUrl` (Task 3), `src/assets/brand/logo-full.svg` (Task 2).
- Produces: `BaseLayout` props `{ title: string; description: string; path?: string; image?: string; type?: 'website'|'product'; noindex?: boolean; jsonLd?: object[]; current?: 'bags'|'coasters'|'hats'|'story'|'shop' }`. `title` is the full `<title>` text (callers use `pageTitle`/`productTitle`). Header prop `current` uses the same keys.

- [ ] **Step 1: Add failing dist tests for layout rules**

Replace `tests/dist/site.test.ts` with:
```ts
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIST, htmlFiles, page, rel } from './helpers';

describe('every page', () => {
  const files = htmlFiles();

  it.each(files.map((f) => [rel(f), f]))('%s follows layout rules', (_name, file) => {
    const html = readFileSync(file, 'utf8');
    expect(html).toMatch(/<html lang="en"/);
    expect(html.match(/<h1[\s>]/g) ?? []).toHaveLength(1);
    expect(html).toContain('class="skip-link" href="#main"');
    expect(html).toMatch(/<link rel="canonical" href="https:\/\/sunniedesigns\.com\//);
    const scripts = html.match(/<script\b[^>]*>/g) ?? [];
    expect(scripts.every((s) => s.includes('application/ld+json'))).toBe(true);
    for (const img of html.match(/<img\b[^>]*>/g) ?? []) expect(img).toMatch(/\salt="/);
  });
});

describe('home page', () => {
  it('shows the logo and main nav', () => {
    const html = page('/');
    expect(html).toContain('aria-label="Sunnie Designs home"');
    for (const href of ['/shop/bags/', '/shop/coasters/', '/our-story/', '/shop/']) {
      expect(html).toContain(`href="${href}"`);
    }
  });
});

describe('crawl files', () => {
  it('publishes robots.txt and a sitemap', () => {
    expect(existsSync(join(DIST, 'robots.txt'))).toBe(true);
    expect(existsSync(join(DIST, 'sitemap-index.xml'))).toBe(true);
  });
});
```
- [ ] **Step 2: Build and run to verify failure**

Run: `npm run build && npm run test:dist`
Expected: FAIL (no skip link, no canonical, no robots.txt).

- [ ] **Step 3: Write `src/styles/tokens.css`**

```css
:root {
  /* Morning Sun palette */
  --linen: #fbf6ee;
  --sand: #f3e7d3;
  --sand-hover: #ead9bc;
  --butter: #f0e2c4;
  --umber: #4a3222;
  --umber-muted: #7a6855;
  --terracotta: #b04a24;
  --terracotta-hover: #96401e;
  --terracotta-active: #7e3517;
  --terracotta-deep: #9c3f1d; /* any terracotta text sitting on sand */
  --olive: #8a9a5b;
  --olive-deep: #6b6b1f;
  --border: #e5d5b8;
  --border-strong: #dcc9a6;
  --white: #ffffff;

  /* Type */
  --font-heading: 'Fraunces Variable', Georgia, 'Times New Roman', serif;
  --font-body: 'Atkinson Hyperlegible', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --fs-hero: clamp(2rem, 1.4rem + 2.4vw, 2.5rem); /* 40px on desktop */
  --fs-h1: clamp(1.75rem, 1.4rem + 1.4vw, 2.125rem); /* 34px */
  --fs-h2: 1.6875rem; /* 27px */
  --fs-h3: 1.375rem; /* 22px */
  --fs-body-lg: 1.1875rem; /* 19px */
  --fs-body: 1.125rem; /* 18px, the floor */
  --fs-small: 1rem; /* 16px */
  --measure: 65ch;

  /* Shape and motion */
  --radius: 14px;
  --radius-sm: 8px;
  --transition: 150ms ease;
  --container: 72rem;
  --focus-ring: 3px solid var(--terracotta-hover);
  --header-h: 5.5rem;
}
```

- [ ] **Step 4: Write `src/styles/global.css`**

```css
*,
*::before,
*::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; scroll-padding-top: calc(var(--header-h) + 1rem); }
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }

body {
  margin: 0;
  background: var(--linen);
  color: var(--umber);
  font-family: var(--font-body);
  font-size: var(--fs-body);
  line-height: 1.6;
  letter-spacing: 0.01em;
}

img, svg { display: block; max-width: 100%; height: auto; }

h1, h2, h3 {
  font-family: var(--font-heading);
  font-weight: 500;
  color: var(--terracotta);
  margin: 0 0 0.5em;
  text-wrap: balance;
  letter-spacing: 0;
}
h1 { font-size: var(--fs-h1); line-height: 1.2; }
h2 { font-size: var(--fs-h2); line-height: 1.25; }
h3 { font-size: var(--fs-h3); line-height: 1.3; }
p, li { max-width: var(--measure); }
p { margin: 0 0 1em; }

a { color: var(--terracotta); text-decoration: underline; text-underline-offset: 0.18em; transition: color var(--transition); }
a:hover { color: var(--terracotta-hover); }
:focus-visible { outline: var(--focus-ring); outline-offset: 3px; border-radius: 2px; }

.container { width: min(100% - 2rem, var(--container)); margin-inline: auto; }
.small { font-size: var(--fs-small); line-height: 1.55; }
.muted { color: var(--umber-muted); }
.lead { font-size: var(--fs-body-lg); }
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
.skip-link {
  position: absolute; left: 1rem; top: -10rem; z-index: 100;
  background: var(--umber); color: var(--white); padding: 0.75rem 1rem; border-radius: var(--radius-sm);
}
.skip-link:focus { top: 1rem; color: var(--white); }
main:focus { outline: none; }

/* Sections */
.section { padding-block: clamp(2.5rem, 2rem + 3vw, 4.5rem); }
.section-sand { background: var(--sand); }
.section-sand h2, .section-sand h3, .section-sand a { color: var(--terracotta-deep); }
.section-head { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 0.5rem 1.5rem; margin-bottom: 1.5rem; }
.section-head h2 { margin: 0; }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 48px; padding: 0.75rem 1.5rem;
  border-radius: var(--radius-sm); border: 2px solid transparent;
  font: 700 var(--fs-body) / 1.2 var(--font-body); letter-spacing: 0.01em;
  text-decoration: none; cursor: pointer;
  transition: background-color var(--transition), border-color var(--transition), color var(--transition);
}
.btn-primary { background: var(--terracotta); border-color: var(--terracotta); color: var(--white); }
.btn-primary:hover { background: var(--terracotta-hover); border-color: var(--terracotta-hover); color: var(--white); }
.btn-primary:active { background: var(--terracotta-active); border-color: var(--terracotta-active); }
.btn-secondary { background: var(--sand); border-color: var(--terracotta); color: var(--terracotta-deep); }
.btn-secondary:hover { background: var(--sand-hover); color: var(--terracotta-deep); }
.btn-secondary:active { background: var(--butter); }
.btn-disabled { background: var(--border); border-color: var(--border); color: var(--umber-muted); cursor: not-allowed; }
.btn-block { width: 100%; }
.btn-ghost {
  display: inline-flex; align-items: center; min-height: 48px; padding: 0.75rem 0.25rem;
  color: var(--terracotta); font-weight: 700; text-decoration: underline; text-underline-offset: 0.2em;
}

/* Badges and tags */
.badge {
  display: inline-block; background: var(--butter); color: var(--umber);
  font-size: var(--fs-small); font-weight: 700; line-height: 1.3;
  padding: 0.25rem 0.7rem; border-radius: 999px;
}
.tag { display: inline-block; border: 1.5px solid var(--olive); color: var(--olive-deep); font-size: var(--fs-small); padding: 0.15rem 0.6rem; border-radius: 999px; }

/* Header */
.site-header { position: sticky; top: 0; z-index: 50; background: var(--linen); border-bottom: 1px solid var(--border); }
.header-inner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.25rem 1.5rem; padding-block: 0.6rem; }
.brand { display: block; color: inherit; }
.brand svg { height: 52px; width: auto; }
.site-nav ul { display: flex; flex-wrap: wrap; gap: 0 1.25rem; list-style: none; margin: 0; padding: 0; }
.site-nav a {
  display: inline-flex; align-items: center; min-height: 48px; padding-inline: 0.1rem;
  color: var(--umber); font-weight: 700; text-decoration: none;
  border-bottom: 3px solid transparent; transition: border-color var(--transition);
}
.site-nav a:hover { color: var(--umber); border-bottom-color: var(--border-strong); }
.site-nav a[aria-current='page'] { color: var(--terracotta); border-bottom-color: var(--terracotta); }
@media (max-width: 40rem) {
  :root { --header-h: 7.5rem; }
  .brand svg { height: 44px; }
  .site-nav ul { gap: 0 1rem; }
}

/* Footer */
.site-footer { background: var(--sand); margin-top: 4rem; padding-block: 3rem 1.5rem; }
.site-footer a { color: var(--terracotta-deep); }
.footer-grid { display: grid; gap: 2rem; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); }
.footer-grid h2 { font-size: var(--fs-h3); color: var(--umber); margin-bottom: 0.5rem; }
.footer-grid ul { list-style: none; margin: 0; padding: 0; }
.footer-grid li a { display: inline-flex; min-height: 44px; align-items: center; }
.footer-brand { font-family: var(--font-heading); font-size: var(--fs-h3); margin-bottom: 0.5rem; }
.footer-legal { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-strong); font-size: var(--fs-small); color: var(--umber-muted); }

/* Page heading block */
.page-head { padding-block: 2rem 1rem; }
.page-head p { font-size: var(--fs-body-lg); }

/* Prose (markdown bodies and info pages) */
.prose > * + * { margin-top: 1em; }
.prose ul { padding-left: 1.25rem; }
.prose li + li { margin-top: 0.35em; }
.prose h2 { margin-top: 1.5em; }
```

- [ ] **Step 5: Write `src/components/Seo.astro`**

```astro
---
import { site } from '../data/site';
import { absoluteUrl } from '../lib/seo';

interface Props {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'product';
  noindex?: boolean;
}
const { title, description, path, image = absoluteUrl('/og-default.png'), type = 'website', noindex = false } = Astro.props;
const canonical = absoluteUrl(path);
---
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
{noindex && <meta name="robots" content="noindex" />}
<meta property="og:site_name" content={site.name} />
<meta property="og:type" content={type} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={image} />
<meta name="twitter:card" content="summary_large_image" />
```

- [ ] **Step 6: Write `src/components/JsonLd.astro`**

```astro
---
interface Props { data: object[] }
const { data } = Astro.props;
---
{data.map((d) => <script is:inline type="application/ld+json" set:html={JSON.stringify(d).replace(/</g, '\\u003c')} />)}
```

- [ ] **Step 7: Write `src/components/Header.astro`**

```astro
---
import logo from '../assets/brand/logo-full.svg?raw';

interface Props { current?: 'bags' | 'coasters' | 'hats' | 'story' | 'shop' }
const { current } = Astro.props;

const links = [
  { key: 'bags', href: '/shop/bags/', label: 'Bags' },
  { key: 'coasters', href: '/shop/coasters/', label: 'Coasters' },
  { key: 'story', href: '/our-story/', label: 'Our story' },
  { key: 'shop', href: '/shop/', label: 'Shop all' },
];
---
<header class="site-header">
  <div class="container header-inner">
    <a href="/" class="brand" aria-label="Sunnie Designs home"><Fragment set:html={logo} /></a>
    <nav class="site-nav" aria-label="Main">
      <ul>
        {links.map((l) => (
          <li><a href={l.href} aria-current={current === l.key ? 'page' : undefined}>{l.label}</a></li>
        ))}
      </ul>
    </nav>
  </div>
</header>
```

- [ ] **Step 8: Write `src/components/Footer.astro`**

```astro
---
import { site } from '../data/site';
const year = new Date().getFullYear();
---
<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <p class="footer-brand">{site.name}</p>
      <p>{site.makerLine}. Ships in {site.shipsIn}.</p>
      <p><a href={`mailto:${site.email.hello}`}>{site.email.hello}</a></p>
    </div>
    <nav aria-label="Shop">
      <h2>Shop</h2>
      <ul>
        <li><a href="/shop/bags/">Bags</a></li>
        <li><a href="/shop/coasters/">Coasters</a></li>
        <li><a href="/shop/">Shop all</a></li>
      </ul>
    </nav>
    <nav aria-label="Help">
      <h2>Help</h2>
      <ul>
        <li><a href="/shipping/">Shipping and returns</a></li>
        <li><a href="/care/">Care guide</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
    </nav>
    <nav aria-label="About">
      <h2>About</h2>
      <ul>
        <li><a href="/our-story/">Our story</a></li>
        <li><a href="/reviews/">Reviews</a></li>
        <li><a href="/privacy/">Privacy</a></li>
        <li><a href={site.etsyShopUrl} rel="noopener">Our Etsy shop</a></li>
      </ul>
    </nav>
  </div>
  <p class="container footer-legal">© {year} {site.name}</p>
</footer>
```

- [ ] **Step 9: Confirm the preload font file exists**

Run: `ls node_modules/@fontsource-variable/fraunces/files | grep "latin-wght-normal.woff2"`
Expected: `fraunces-latin-wght-normal.woff2`

- [ ] **Step 10: Write `src/layouts/BaseLayout.astro`**

```astro
---
import '@fontsource-variable/fraunces';
import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import frauncesWoff2 from '@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2?url';
import '../styles/tokens.css';
import '../styles/global.css';
import Seo from '../components/Seo.astro';
import JsonLd from '../components/JsonLd.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'product';
  noindex?: boolean;
  jsonLd?: object[];
  current?: 'bags' | 'coasters' | 'hats' | 'story' | 'shop';
}
const { jsonLd = [], current, path = Astro.url.pathname, ...seo } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preload" href={frauncesWoff2} as="font" type="font/woff2" crossorigin />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta name="theme-color" content="#FBF6EE" />
    <Seo path={path} {...seo} />
    {jsonLd.length > 0 && <JsonLd data={jsonLd} />}
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <Header current={current} />
    <main id="main" tabindex="-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 11: Write `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://sunniedesigns.com/sitemap-index.xml
```

- [ ] **Step 12: Put the placeholder home page on the layout**

`src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { site } from '../data/site';
---
<BaseLayout title={site.name} description={site.description}>
  <div class="container page-head"><h1>Sunnie Designs</h1></div>
</BaseLayout>
```

- [ ] **Step 13: Build and run all tests**

Run: `npm run build && npm test && npm run test:dist`
Expected: all PASS.

- [ ] **Step 14: Look at it**

Run `npm run dev`, open `http://localhost:4321/` in the built-in browser, and check: logo left with nav right on desktop, nav wrapping under the logo at 375px wide, Tab shows the skip link and then a visible focus ring on each nav link. Stop the dev server.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "feat: add Morning Sun tokens, base layout, header, footer and robots.txt

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Etsy import library

**Files:**
- Create: `scripts/lib/etsy.mjs`, `tests/unit/etsy.test.mjs`, `scripts/etsy-overrides.json`, `scripts/review-translations.json`

**Interfaces:**
- Produces from `scripts/lib/etsy.mjs`: `ETSY_SHOP_URL`, `EXCLUDED_REVIEWERS`, `shortName(title)`, `slugify(text)`, `uniqueSlug(base, taken:Set)`, `classify(title) → {category, group?}`, `cleanDescription(text)`, `parseMaterials(str)`, `normaliseOptionName(name)`, `parseOptions(row) → {name, values[]}[]`, `imageUrls(row) → string[]`, `imageAlt(name, i, total)`, `findOverride(title, overrides)`, `toProduct(row, override) → Product`, `toMarkdown(product, slug) → string`, `setFrontmatterField(md, key, value) → string`, `normaliseReviews(raw, translations) → Review[]`, `matchEtsyUrls(products:{slug,seoTitle}[], links:{title,url}[]) → {matched: Record<slug,url>, unmatched: slug[]}`.
- `Review` = `{ reviewer: string; date: 'YYYY-MM-DD'; rating: number; text: string; lang: 'en'|'de'; en?: string }`.

- [ ] **Step 1: Write failing tests**

`tests/unit/etsy.test.mjs`:
```js
import { describe, expect, it } from 'vitest';
import {
  ETSY_SHOP_URL, classify, cleanDescription, findOverride, imageAlt, matchEtsyUrls,
  normaliseReviews, parseMaterials, parseOptions, setFrontmatterField, shortName,
  slugify, toMarkdown, toProduct, uniqueSlug,
} from '../../scripts/lib/etsy.mjs';

const row = (over = {}) => ({
  TITLE: 'Crochet Poodle Crossbody Bag, Fluffy Plush Phone Purse, Kids Coin Pouch',
  DESCRIPTION: 'Fluffy poodle.\n\nBag details\n\ufffd Material: 100% polyester\n\u00a0\u00a0\ufffd Height: 15 cm\n**A note on sizing',
  PRICE: '26.95', CURRENCY_CODE: 'EUR', QUANTITY: '9', MATERIALS: 'Wool,Acrylic,Wool',
  IMAGE1: 'https://i.etsystatic.com/a.jpg', IMAGE2: 'https://i.etsystatic.com/b.jpg', IMAGE3: '',
  'VARIATION 1 TYPE': 'Colour', 'VARIATION 1 NAME': 'Primary colour', 'VARIATION 1 VALUES': 'White,Honey yellow,Caramel',
  'VARIATION 2 TYPE': '', 'VARIATION 2 NAME': '', 'VARIATION 2 VALUES': '',
  ...over,
});

describe('names and slugs', () => {
  it('shortens titles to a sentence-case display name without "Crochet"', () => {
    expect(shortName('Crochet Poodle Crossbody Bag, Fluffy Plush Phone Purse')).toBe('Poodle crossbody bag');
    expect(shortName('3D Flower Crochet Phone Bag, Sunflower Rose')).toBe('3D flower crochet phone bag');
    expect(shortName('Cable knit tote bag, Aran pattern')).toBe('Cable knit tote bag');
  });
  it('caps names at eight words', () => {
    expect(shortName('Crochet Animal Coasters Set of 3 Pig Bear Cat Fruit Design')).toBe('Animal coasters set of 3 pig bear cat');
  });
  it('slugifies', () => {
    expect(slugify('3D flower crochet phone bag')).toBe('3d-flower-crochet-phone-bag');
    expect(slugify('Ó Murchú & co')).toBe('o-murchu-and-co');
  });
  it('suffixes duplicate slugs', () => {
    const taken = new Set();
    expect(uniqueSlug('frog', taken)).toBe('frog');
    expect(uniqueSlug('frog', taken)).toBe('frog-2');
  });
});

describe('classify', () => {
  it.each([
    ['Crochet rose flower coaster with mini basket', { category: 'coasters' }],
    ['Crochet carnation mug rug that folds into a bouquet', { category: 'coasters' }],
    ['Rainbow Crochet Wizard Hat, Pointed Kids Winter', { category: 'hats' }],
    ['Crochet frog crossbody phone bag', { category: 'bags', group: 'characters' }],
    ['Crochet rainbow tote bag, open mesh', { category: 'bags', group: 'totes' }],
    ['Crochet Tulip Phone Bag, Sunflower Crossbody', { category: 'bags', group: 'flowers' }],
  ])('%s', (title, expected) => {
    expect(classify(title)).toEqual(expected);
  });
});

describe('cleanDescription', () => {
  it('turns broken bullets into markdown list items and removes stray bold markers', () => {
    expect(cleanDescription('Intro &lt;3\r\n\r\n\r\n\ufffd One\n\u00a0\u00a0\ufffd Two\n**A note')).toBe(
      'Intro <3\n\n- One\n- Two\nA note',
    );
  });
});

describe('fields', () => {
  it('dedupes materials', () => {
    expect(parseMaterials('Wool,Acrylic,Wool, ')).toEqual(['Wool', 'Acrylic']);
  });
  it('parses variations and normalises colour names', () => {
    expect(parseOptions(row())).toEqual([{ name: 'Colour', values: ['White', 'Honey yellow', 'Caramel'] }]);
  });
  it('writes alt text', () => {
    expect(imageAlt('Poodle bag', 0, 3)).toBe('Poodle bag');
    expect(imageAlt('Poodle bag', 1, 3)).toBe('Poodle bag, photo 2 of 3');
  });
  it('finds overrides by title prefix', () => {
    const o = [{ match: 'Crochet Poodle', isNew: true }];
    expect(findOverride('Crochet Poodle Crossbody Bag', o)).toEqual({ match: 'Crochet Poodle', isNew: true });
    expect(findOverride('Other', o)).toEqual({});
  });
});

describe('toProduct and toMarkdown', () => {
  it('converts a row with overrides', () => {
    const p = toProduct(row(), { isNew: true });
    expect(p).toMatchObject({
      name: 'Poodle crossbody bag', category: 'bags', group: 'characters', price: 26.95,
      inStock: true, etsyUrl: ETSY_SHOP_URL, maker: 'Hui', isNew: true,
      imageUrls: ['https://i.etsystatic.com/a.jpg', 'https://i.etsystatic.com/b.jpg'],
    });
    expect(p.body).toContain('- Height: 15 cm');
  });
  it('marks zero quantity as sold out', () => {
    expect(toProduct(row({ QUANTITY: '0' }), {}).inStock).toBe(false);
  });
  it('lets an override replace the name and group', () => {
    const p = toProduct(row({ TITLE: 'Crochet Palm Tree Phone Bag, Yellow' }), { name: 'Palm tree phone bag', group: 'characters' });
    expect(p).toMatchObject({ name: 'Palm tree phone bag', group: 'characters' });
  });
  it('renders YAML frontmatter with relative image paths', () => {
    const md = toMarkdown(toProduct(row(), { featured: 2 }), 'poodle-crossbody-bag');
    expect(md.startsWith('---\nname: "Poodle crossbody bag"\n')).toBe(true);
    expect(md).toContain('"src":"../../assets/products/poodle-crossbody-bag/01.jpg"');
    expect(md).toContain('featured: 2');
    expect(md).toContain('\n---\n\nFluffy poodle.');
  });
});

describe('setFrontmatterField', () => {
  it('replaces an existing field', () => {
    const md = '---\nname: "A"\netsyUrl: "x"\n---\n\nBody etsyUrl: "keep"\n';
    expect(setFrontmatterField(md, 'etsyUrl', 'https://e/1')).toBe('---\nname: "A"\netsyUrl: "https://e/1"\n---\n\nBody etsyUrl: "keep"\n');
  });
  it('adds a missing field', () => {
    expect(setFrontmatterField('---\nname: "A"\n---\nB', 'size', '5 cm')).toBe('---\nname: "A"\nsize: "5 cm"\n---\nB');
  });
});

describe('normaliseReviews', () => {
  const raw = [
    { reviewer: 'noel francis', date_reviewed: '04/17/2026', star_rating: 5, message: 'Friend' },
    { reviewer: 'Nicola', date_reviewed: '07/22/2026', star_rating: 5, message: 'Eine süße Frosch Tasche' },
    { reviewer: 'hexfeather', date_reviewed: '09/25/2026', star_rating: 5, message: 'sturdy\r\ntoo' },
  ];
  it('drops excluded reviewers, adds translations, sorts newest first', () => {
    const out = normaliseReviews(raw, { 'Nicola|2026-07-22': 'A sweet frog bag' });
    expect(out.map((r) => r.reviewer)).toEqual(['hexfeather', 'Nicola']);
    expect(out[0]).toEqual({ reviewer: 'hexfeather', date: '2026-09-25', rating: 5, text: 'sturdy\ntoo', lang: 'en' });
    expect(out[1]).toMatchObject({ lang: 'de', en: 'A sweet frog bag' });
  });
});

describe('matchEtsyUrls', () => {
  it('matches exact and truncated titles, strips query strings', () => {
    const r = matchEtsyUrls(
      [{ slug: 'poodle', seoTitle: 'Crochet Poodle Crossbody Bag, Fluffy' }, { slug: 'none', seoTitle: 'Missing' }],
      [{ title: 'Crochet Poodle Crossbody Bag…', url: 'https://www.etsy.com/listing/1/poodle?ref=shop' }],
    );
    expect(r).toEqual({ matched: { poodle: 'https://www.etsy.com/listing/1/poodle' }, unmatched: ['none'] });
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tests/unit/etsy.test.mjs`
Expected: FAIL, cannot resolve `scripts/lib/etsy.mjs`.

- [ ] **Step 3: Implement `scripts/lib/etsy.mjs`**

```js
export const ETSY_SHOP_URL = 'https://www.etsy.com/shop/SunnieDesignCo';
export const EXCLUDED_REVIEWERS = ['noel francis'];

const KEEP_CASE = /\d|^[A-Z]{2,}$/;

export function shortName(title) {
  const words = title.split(',')[0].trim().split(/\s+/).filter(Boolean);
  if (words.length > 1 && words[0].toLowerCase() === 'crochet') words.shift();
  return words
    .slice(0, 8)
    .map((w, i) => {
      if (KEEP_CASE.test(w)) return w;
      const lower = w.toLowerCase();
      return i === 0 ? lower[0].toUpperCase() + lower.slice(1) : lower;
    })
    .join(' ');
}

export function slugify(text) {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function uniqueSlug(base, taken) {
  let slug = base;
  let n = 2;
  while (taken.has(slug)) slug = `${base}-${n++}`;
  taken.add(slug);
  return slug;
}

const COASTER = /\b(coasters?|mug rugs?)\b/i;
const HAT = /\bhats?\b/i;
const CHARACTER = /\b(frog|poodle|dog|puppy|crab|monster|bear|panda|bunny|sheep|lamb|ostrich|giraffe|clown|girl|character|animal|mushroom|burger|overalls|lips|cat|pig)\b/i;
const TOTE = /\b(tote|backpack|cable knit|aran)\b/i;
const FLOWER = /\b(flower|floral|sunflower|rose|tulip|daisy|camellia|carnation)\b/i;

export function classify(title) {
  if (COASTER.test(title)) return { category: 'coasters' };
  if (HAT.test(title)) return { category: 'hats' };
  if (CHARACTER.test(title)) return { category: 'bags', group: 'characters' };
  if (TOTE.test(title)) return { category: 'bags', group: 'totes' };
  if (FLOWER.test(title)) return { category: 'bags', group: 'flowers' };
  return { category: 'bags', group: 'totes' };
}

const ENTITIES = { '&lt;': '<', '&gt;': '>', '&amp;': '&', '&quot;': '"', '&#39;': "'" };

export function cleanDescription(text) {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/&(lt|gt|amp|quot|#39);/g, (m) => ENTITIES[m])
    .replace(/\u00a0/g, ' ')
    .split('\n')
    .map((line) => {
      const t = line.trim().replace(/\*\*/g, '');
      const bullet = t.match(/^[\ufffd•·▪●◦]\s*(.*)$/);
      return bullet ? `- ${bullet[1].trim()}` : t;
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function parseMaterials(str) {
  return [...new Set(str.split(',').map((s) => s.trim()).filter(Boolean))];
}

export function normaliseOptionName(name) {
  if (/colou?r/i.test(name)) return 'Colour';
  const lower = name.trim().toLowerCase();
  return lower[0].toUpperCase() + lower.slice(1);
}

export function parseOptions(row) {
  const out = [];
  for (const i of [1, 2, 3]) {
    const name = (row[`VARIATION ${i} NAME`] || row[`VARIATION ${i} TYPE`] || '').trim();
    const values = (row[`VARIATION ${i} VALUES`] || '').split(',').map((v) => v.trim()).filter(Boolean);
    if (name && values.length) out.push({ name: normaliseOptionName(name), values });
  }
  return out;
}

export function imageUrls(row) {
  return Array.from({ length: 10 }, (_, i) => (row[`IMAGE${i + 1}`] || '').trim()).filter(Boolean);
}

export function imageAlt(name, i, total) {
  return i === 0 ? name : `${name}, photo ${i + 1} of ${total}`;
}

export function findOverride(title, overrides) {
  return overrides.find((o) => title.startsWith(o.match)) ?? {};
}

export function toProduct(row, override = {}) {
  const base = classify(row.TITLE);
  const category = base.category;
  const group = category === 'bags' ? override.group ?? base.group : undefined;
  return {
    name: override.name ?? shortName(row.TITLE),
    seoTitle: row.TITLE.trim(),
    category,
    ...(group ? { group } : {}),
    price: Number(row.PRICE),
    inStock: Number(row.QUANTITY) > 0,
    etsyUrl: ETSY_SHOP_URL,
    maker: 'Hui',
    options: parseOptions(row),
    materials: parseMaterials(row.MATERIALS ?? ''),
    ...(override.featured ? { featured: override.featured } : {}),
    ...(override.isNew ? { isNew: true } : {}),
    imageUrls: imageUrls(row),
    body: cleanDescription(row.DESCRIPTION ?? ''),
  };
}

export function toMarkdown(p, slug) {
  const images = p.imageUrls.map((_, i) => ({
    src: `../../assets/products/${slug}/${String(i + 1).padStart(2, '0')}.jpg`,
    alt: imageAlt(p.name, i, p.imageUrls.length),
  }));
  const fm = {
    name: p.name,
    seoTitle: p.seoTitle,
    category: p.category,
    ...(p.group ? { group: p.group } : {}),
    price: p.price,
    inStock: p.inStock,
    etsyUrl: p.etsyUrl,
    maker: p.maker,
    options: p.options,
    materials: p.materials,
    images,
    ...(p.featured ? { featured: p.featured } : {}),
    ...(p.isNew ? { isNew: true } : {}),
  };
  const lines = Object.entries(fm).map(([k, v]) => `${k}: ${JSON.stringify(v)}`);
  return `---\n${lines.join('\n')}\n---\n\n${p.body}\n`;
}

export function setFrontmatterField(md, key, value) {
  const end = md.indexOf('\n---', 3);
  const head = md.slice(0, end);
  const rest = md.slice(end);
  const line = `${key}: ${JSON.stringify(value)}`;
  const re = new RegExp(`^${key}: .*$`, 'm');
  return (re.test(head) ? head.replace(re, line) : `${head}\n${line}`) + rest;
}

export function normaliseReviews(raw, translations = {}) {
  return raw
    .filter((r) => !EXCLUDED_REVIEWERS.includes(r.reviewer.trim().toLowerCase()))
    .map((r) => {
      const [m, d, y] = r.date_reviewed.split('/');
      const date = `${y}-${m}-${d}`;
      const en = translations[`${r.reviewer}|${date}`];
      return {
        reviewer: r.reviewer,
        date,
        rating: r.star_rating,
        text: r.message.replace(/\r\n?/g, '\n').trim(),
        lang: en ? 'de' : 'en',
        ...(en ? { en } : {}),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

const norm = (s) =>
  s.toLowerCase().replace(/&amp;/g, '&').replace(/(…|\.\.\.)\s*$/, '').replace(/\s+/g, ' ').trim();

export function matchEtsyUrls(products, links) {
  const matched = {};
  const unmatched = [];
  for (const p of products) {
    const t = norm(p.seoTitle);
    const hit = links.find((l) => {
      const lt = norm(l.title);
      return lt.length > 10 && (lt === t || t.startsWith(lt) || lt.startsWith(t));
    });
    if (hit) matched[p.slug] = hit.url.split('?')[0];
    else unmatched.push(p.slug);
  }
  return { matched, unmatched };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/unit/etsy.test.mjs`
Expected: PASS (all tests). If a `classify` case fails, fix the regex, not the test.

- [ ] **Step 5: Write `scripts/etsy-overrides.json`**

```json
[
  { "match": "Crochet frog phone crossbody, kawaii", "featured": 1 },
  { "match": "Crochet sunflower drawstring backpack", "featured": 2 },
  { "match": "Crochet Animal Coasters Set of 3", "name": "Animal coasters, cat, pig and bear", "featured": 3 },
  { "match": "Crochet Crossbody Phone Bag with Tassel", "name": "Tassel crossbody phone bag", "featured": 4 },
  { "match": "Crochet Poodle Crossbody Bag", "isNew": true },
  { "match": "Crochet Flower Mandala Coaster", "name": "Flower mandala coaster" },
  { "match": "Crochet Palm Tree Phone Bag", "group": "characters" },
  { "match": "Crochet hot air balloon crossbody bag", "group": "characters" }
]
```

- [ ] **Step 6: Write `scripts/review-translations.json`**

```json
{
  "Denise|2026-08-24": "Thank you so much for the sweet bag and the heart. Great item, fast delivery, all top 👍 I'd happily order here again.",
  "Christina|2026-08-10": "Very beautiful backpack. It was a gift and the person who received it was delighted 😊",
  "Nicola|2026-07-22": "A sweet frog 🐸 bag, I'm thrilled.",
  "Antje-Susan|2026-06-02": "Very friendly seller, super-fast shipping and an absolutely unique, beautiful little bag. That was already my second purchase and I'm very happy again.",
  "Jacqueline|2026-05-31": "Really beautiful phone bag.",
  "Antje-Susan|2026-05-16": "Super cute frog at a very fair price. A special request was answered in a very friendly way and fulfilled right away. Shipping was faster than expected. I ordered a second one straight away."
}
```

- [ ] **Step 7: Commit**

```bash
git add scripts/lib/etsy.mjs tests/unit/etsy.test.mjs scripts/etsy-overrides.json scripts/review-translations.json
git commit -m "feat: add Etsy CSV conversion library with overrides and review translations

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Product collection schema and product helpers

**Files:**
- Create: `src/content.config.ts`, `src/lib/products.ts`, `tests/unit/products.test.ts`
- Modify: `src/components/Header.astro`

**Interfaces:**
- Consumes: frontmatter shape written by `toMarkdown` (Task 5).
- Produces: collection `products` (entry `id` = slug). From `src/lib/products.ts`: types `Category`, `Group`, `ProductLike`; constants `GROUP_LABELS`, `GROUP_ORDER`, `CATEGORY_LABELS`, `HATS_NAV_MIN`; functions `sortForGrid(items)`, `inCategory(items, cat)`, `inGroup(items, group)`, `featured(items)` (throws unless slots 1–4 are each filled once), `newest(items)`, `related(items, current, n=4)`, `showHatsInNav(items)`, `formatPrice(eur) → "€24.95"`.

- [ ] **Step 1: Write failing tests**

`tests/unit/products.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import {
  featured, formatPrice, inCategory, inGroup, newest, related, showHatsInNav, sortForGrid,
  type ProductLike,
} from '../../src/lib/products';

const p = (id: string, data: Partial<ProductLike['data']> = {}): ProductLike => ({
  id,
  data: { name: id, category: 'bags', group: 'characters', inStock: true, ...data },
});

describe('sortForGrid', () => {
  it('puts in-stock first, then new, then name', () => {
    const out = sortForGrid([p('b'), p('a', { inStock: false }), p('c', { isNew: true }), p('a2')]);
    expect(out.map((x) => x.id)).toEqual(['c', 'a2', 'b', 'a']);
  });
});

describe('filters', () => {
  const items = [p('frog'), p('rose', { group: 'flowers' }), p('coaster', { category: 'coasters', group: undefined })];
  it('filters by category', () => expect(inCategory(items, 'coasters').map((x) => x.id)).toEqual(['coaster']));
  it('filters bags by group', () => expect(inGroup(items, 'flowers').map((x) => x.id)).toEqual(['rose']));
});

describe('featured', () => {
  it('returns slots 1–4 in order', () => {
    const items = [p('d', { featured: 4 }), p('a', { featured: 1 }), p('c', { featured: 3 }), p('b', { featured: 2 }), p('x')];
    expect(featured(items).map((x) => x.id)).toEqual(['a', 'b', 'c', 'd']);
  });
  it('throws when a slot is missing or doubled', () => {
    expect(() => featured([p('a', { featured: 1 }), p('b', { featured: 1 })])).toThrow(/exactly 4/);
  });
});

describe('newest', () => {
  it('returns the first in-stock new product', () => {
    expect(newest([p('old'), p('gone', { isNew: true, inStock: false }), p('pup', { isNew: true })])?.id).toBe('pup');
  });
});

describe('related', () => {
  it('prefers the same group, then the same category, then others, excluding itself', () => {
    const cur = p('frog');
    const items = [cur, p('rose', { group: 'flowers' }), p('crab'), p('coaster', { category: 'coasters', group: undefined }), p('bear'), p('pig')];
    expect(related(items, cur, 4).map((x) => x.id)).toEqual(['bear', 'crab', 'pig', 'rose']);
  });
});

describe('nav rule', () => {
  it('shows hats only with 4+ in-stock hats', () => {
    const hats = (n: number) => Array.from({ length: n }, (_, i) => p(`h${i}`, { category: 'hats', group: undefined }));
    expect(showHatsInNav(hats(3))).toBe(false);
    expect(showHatsInNav(hats(4))).toBe(true);
  });
});

describe('formatPrice', () => {
  it('formats euros for Ireland', () => expect(formatPrice(24.95)).toBe('€24.95'));
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tests/unit/products.test.ts`
Expected: FAIL, cannot resolve `src/lib/products`.

- [ ] **Step 3: Implement `src/lib/products.ts`**

```ts
export type Category = 'bags' | 'coasters' | 'hats';
export type Group = 'characters' | 'flowers' | 'totes';

export interface ProductLike {
  id: string;
  data: {
    name: string;
    category: Category;
    group?: Group;
    inStock: boolean;
    featured?: 1 | 2 | 3 | 4;
    isNew?: boolean;
  };
}

export const CATEGORY_LABELS: Record<Category, string> = { bags: 'Bags', coasters: 'Coasters', hats: 'Hats' };
export const GROUP_LABELS: Record<Group, string> = {
  characters: 'Characters and animals',
  flowers: 'Flowers',
  totes: 'Totes and shoulder bags',
};
export const GROUP_ORDER: Group[] = ['characters', 'flowers', 'totes'];
export const HATS_NAV_MIN = 4;

export function sortForGrid<T extends ProductLike>(items: readonly T[]): T[] {
  return [...items].sort(
    (a, b) =>
      Number(b.data.inStock) - Number(a.data.inStock) ||
      Number(b.data.isNew ?? false) - Number(a.data.isNew ?? false) ||
      a.data.name.localeCompare(b.data.name),
  );
}

export function inCategory<T extends ProductLike>(items: readonly T[], category: Category): T[] {
  return sortForGrid(items.filter((p) => p.data.category === category));
}

export function inGroup<T extends ProductLike>(items: readonly T[], group: Group): T[] {
  return sortForGrid(items.filter((p) => p.data.category === 'bags' && p.data.group === group));
}

export function featured<T extends ProductLike>(items: readonly T[]): T[] {
  const f = items.filter((p) => p.data.featured !== undefined).sort((a, b) => a.data.featured! - b.data.featured!);
  const slots = new Set(f.map((p) => p.data.featured));
  if (f.length !== 4 || slots.size !== 4) {
    const found = f.map((p) => `${p.id}:${p.data.featured}`).join(', ') || 'none';
    throw new Error(`Expected exactly 4 featured products in slots 1–4, found ${found}`);
  }
  return f;
}

export function newest<T extends ProductLike>(items: readonly T[]): T | undefined {
  return sortForGrid(items).find((p) => p.data.isNew && p.data.inStock);
}

export function related<T extends ProductLike>(items: readonly T[], current: T, n = 4): T[] {
  const others = items.filter((p) => p.id !== current.id);
  const sameCat = others.filter((p) => p.data.category === current.data.category);
  const sameGroup = sortForGrid(sameCat.filter((p) => p.data.group === current.data.group));
  const restCat = sortForGrid(sameCat.filter((p) => p.data.group !== current.data.group));
  const rest = sortForGrid(others.filter((p) => p.data.category !== current.data.category));
  return [...sameGroup, ...restCat, ...rest].slice(0, n);
}

export function showHatsInNav(items: readonly ProductLike[]): boolean {
  return items.filter((p) => p.data.category === 'hats' && p.data.inStock).length >= HATS_NAV_MIN;
}

const EUR = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });
export function formatPrice(eur: number): string {
  return EUR.format(eur);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/unit/products.test.ts`
Expected: PASS.

- [ ] **Step 5: Write `src/content.config.ts`**

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const products = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z
      .object({
        name: z.string().min(3).max(60),
        seoTitle: z.string().min(3),
        category: z.enum(['bags', 'coasters', 'hats']),
        group: z.enum(['characters', 'flowers', 'totes']).optional(),
        price: z.number().positive(),
        inStock: z.boolean(),
        etsyUrl: z.url(),
        maker: z.string().min(1),
        options: z.array(z.object({ name: z.string(), values: z.array(z.string()).min(1) })).default([]),
        materials: z.array(z.string()).default([]),
        size: z.string().optional(),
        images: z.array(z.object({ src: image(), alt: z.string().min(3) })).min(1),
        featured: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
        isNew: z.boolean().default(false),
      })
      .refine((d) => d.category !== 'bags' || d.group !== undefined, {
        message: 'Bags need a group (characters, flowers or totes)',
        path: ['group'],
      }),
});

export const collections = { products };
```

- [ ] **Step 6: Add the hats nav rule to the header**

In `src/components/Header.astro`, replace the frontmatter with:
```astro
---
import { getCollection } from 'astro:content';
import logo from '../assets/brand/logo-full.svg?raw';
import { showHatsInNav } from '../lib/products';

interface Props { current?: 'bags' | 'coasters' | 'hats' | 'story' | 'shop' }
const { current } = Astro.props;

const products = await getCollection('products');
const links = [
  { key: 'bags', href: '/shop/bags/', label: 'Bags' },
  { key: 'coasters', href: '/shop/coasters/', label: 'Coasters' },
  ...(showHatsInNav(products) ? [{ key: 'hats', href: '/shop/hats/', label: 'Hats' }] : []),
  { key: 'story', href: '/our-story/', label: 'Our story' },
  { key: 'shop', href: '/shop/', label: 'Shop all' },
];
---
```

- [ ] **Step 7: Verify the build still passes with an empty collection**

Run: `mkdir -p src/content/products && npm run build`
Expected: build completes. An "empty collection" warning is fine.

- [ ] **Step 8: Commit**

```bash
git add src/content.config.ts src/lib/products.ts tests/unit/products.test.ts src/components/Header.astro
git commit -m "feat: add products collection schema and product helpers

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Import the 51 Etsy listings

**Files:**
- Create: `scripts/import-etsy.mjs`
- Generated (committed): `src/content/products/*.md`, `src/assets/products/*/NN.jpg`, `src/data/reviews.json`, `src/assets/story/hands.jpg` (placeholder)

**Interfaces:**
- Consumes: everything in `scripts/lib/etsy.mjs`, `scripts/etsy-overrides.json`, `scripts/review-translations.json`.
- Produces: 51 product entries that pass the Task 6 schema, plus `src/data/reviews.json` (array of `Review`, newest first, without "noel francis").

- [ ] **Step 1: Write `scripts/import-etsy.mjs`**

```js
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'csv-parse/sync';
import sharp from 'sharp';
import { findOverride, normaliseReviews, slugify, toMarkdown, toProduct, uniqueSlug } from './lib/etsy.mjs';

const args = process.argv.slice(2);
const srcAt = args.indexOf('--src');
const src = srcAt === -1 ? undefined : args[srcAt + 1];
const force = args.includes('--force');
if (!src) {
  console.error('Usage: npm run import:etsy -- --src "<folder with EtsyListingsDownload.csv and reviews.json>" [--force]');
  process.exit(1);
}

const overrides = JSON.parse(readFileSync('scripts/etsy-overrides.json', 'utf8'));
const translations = JSON.parse(readFileSync('scripts/review-translations.json', 'utf8'));
const rows = parse(readFileSync(join(src, 'EtsyListingsDownload.csv')), { columns: true, bom: true, skip_empty_lines: true });

mkdirSync('src/content/products', { recursive: true });
const taken = new Set();
const report = [];

for (const row of rows) {
  const product = toProduct(row, findOverride(row.TITLE, overrides));
  const slug = uniqueSlug(slugify(product.name), taken);
  const imgDir = join('src/assets/products', slug);
  mkdirSync(imgDir, { recursive: true });

  for (const [i, url] of product.imageUrls.entries()) {
    const out = join(imgDir, `${String(i + 1).padStart(2, '0')}.jpg`);
    if (existsSync(out) && !force) continue;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${slug}: image ${i + 1} failed with ${res.status} (${url})`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf)
      .rotate()
      .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(out);
  }

  const mdPath = join('src/content/products', `${slug}.md`);
  if (!existsSync(mdPath) || force) writeFileSync(mdPath, toMarkdown(product, slug));
  report.push(
    [slug.padEnd(50), product.category.padEnd(9), (product.group ?? '').padEnd(11), product.featured ?? '', product.isNew ? 'NEW' : '']
      .join(' ')
      .trimEnd(),
  );
}

const reviews = normaliseReviews(JSON.parse(readFileSync(join(src, 'reviews.json'), 'utf8')), translations);
mkdirSync('src/data', { recursive: true });
writeFileSync('src/data/reviews.json', `${JSON.stringify(reviews, null, 2)}\n`);

console.log(report.join('\n'));
console.log(`\n${rows.length} products, ${reviews.length} reviews written.`);
```

- [ ] **Step 2: Run the import**

Run:
```bash
npm run import:etsy -- --src "/e/SUNNIE BUSINESS FILES AND PHOTOS/1. New ETSY Products"
```
Expected: 51 report lines, then `51 products, 15 reviews written.` It takes a few minutes (about 500 downloads).

- [ ] **Step 3: Review the classification table**

Read the printed table. Check:
- exactly four rows show featured 1–4 (frog phone crossbody, sunflower backpack, animal coasters, tassel bag)
- one row shows NEW (poodle)
- 7 rows are `coasters`, 1 is `hats`, the rest are `bags` with a group

For any bag in the wrong group, add an override line with `"group"` to `scripts/etsy-overrides.json`. Then delete that product's `.md` and rerun Step 2 (images are skipped when already downloaded).

- [ ] **Step 4: Check the repo weight and the private-data guard**

Run:
```bash
du -sh src/assets/products
git status --porcelain | grep -i shop_settings || echo "no private files staged"
grep -ril "noel francis" src || echo "excluded review absent"
```
Expected: under 90M, `no private files staged`, `excluded review absent`. If assets are over 90M, lower the JPEG quality to 75 in Step 1 and rerun with `--force`.

- [ ] **Step 5: Add the story placeholder photo**

Run:
```bash
mkdir -p src/assets/story
cp src/assets/products/tassel-crossbody-phone-bag/02.jpg src/assets/story/hands.jpg
```
(The owner will replace this with a photo of Hui's hands at work. It's listed under Owner inputs.)

- [ ] **Step 6: Build to validate every product file against the schema**

Run: `npm run build`
Expected: build completes. If Zod reports a field error, fix the named `.md` file (or the importer, if every file has the same error) and rebuild.

- [ ] **Step 7: Commit**

```bash
git add scripts/import-etsy.mjs src/content src/assets src/data/reviews.json
git commit -m "feat: import 51 Etsy listings, photos and filtered reviews

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Product cards and shop pages

Invoke `site-architecture` (check category structure and internal links) and `frontend-design`.

**Files:**
- Create: `src/components/ProductCard.astro`, `src/components/ProductGrid.astro`, `src/components/Breadcrumbs.astro`, `src/pages/shop/index.astro`, `src/pages/shop/bags.astro`, `src/pages/shop/[category].astro`, `tests/dist/shop.test.ts`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `products` collection, `sortForGrid`, `inCategory`, `inGroup`, `GROUP_ORDER`, `GROUP_LABELS`, `CATEGORY_LABELS`, `formatPrice`, `pageTitle`, `breadcrumbJsonLd`.
- Produces: `<ProductCard product headingLevel? eager? />`, `<ProductGrid products headingLevel? eagerFirst? />`, `<Breadcrumbs items={{name, path}[]} />`. Cards link to `/products/<id>/`.

- [ ] **Step 1: Write failing dist tests**

`tests/dist/shop.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { jsonLd, page } from './helpers';

const cards = (html: string) => (html.match(/class="card"/g) ?? []).length;

describe('shop pages', () => {
  it('shop all lists all 51 products', () => {
    expect(cards(page('/shop/'))).toBe(51);
  });
  it('bags page has three group sections', () => {
    const html = page('/shop/bags/');
    for (const label of ['Characters and animals', 'Flowers', 'Totes and shoulder bags']) {
      expect(html).toContain(`>${label}</h2>`);
    }
    expect(cards(html)).toBeGreaterThan(40);
  });
  it('coasters and hats pages exist', () => {
    expect(cards(page('/shop/coasters/'))).toBe(7);
    expect(cards(page('/shop/hats/'))).toBeGreaterThanOrEqual(1);
  });
  it('category pages carry breadcrumbs', () => {
    const ld = jsonLd(page('/shop/coasters/'));
    expect(ld.some((d) => d['@type'] === 'BreadcrumbList')).toBe(true);
  });
  it('cards show a euro price and link to product pages', () => {
    const html = page('/shop/');
    expect(html).toMatch(/€\d+\.\d{2}/);
    expect(html).toMatch(/href="\/products\/[a-z0-9-]+\/"/);
  });
});
```

- [ ] **Step 2: Build and run to verify failure**

Run: `npm run build && npx vitest run tests/dist/shop.test.ts`
Expected: FAIL with `Missing built page /shop/`.

- [ ] **Step 3: Write `src/components/ProductCard.astro`**

```astro
---
import { Picture } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';
import { formatPrice } from '../lib/products';

interface Props {
  product: CollectionEntry<'products'>;
  headingLevel?: 'h2' | 'h3';
  eager?: boolean;
}
const { product, headingLevel = 'h3', eager = false } = Astro.props;
const { name, price, inStock, isNew, images } = product.data;
const Heading = headingLevel;
const badge = !inStock ? 'Sold out' : isNew ? 'New' : null;
---
<article class="card">
  <a class="card-link" href={`/products/${product.id}/`}>
    <div class="card-media">
      <Picture
        src={images[0].src}
        alt=""
        formats={['avif', 'webp']}
        widths={[300, 450, 600]}
        sizes="(min-width: 72rem) 270px, (min-width: 40rem) 30vw, 46vw"
        loading={eager ? 'eager' : 'lazy'}
      />
      {badge && <span class="badge card-badge">{badge}</span>}
    </div>
    <Heading class="card-title">{name}</Heading>
  </a>
  <p class="card-price">{formatPrice(price)}</p>
</article>
```

- [ ] **Step 4: Write `src/components/ProductGrid.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import ProductCard from './ProductCard.astro';

interface Props {
  products: CollectionEntry<'products'>[];
  headingLevel?: 'h2' | 'h3';
  eagerFirst?: number;
}
const { products, headingLevel = 'h3', eagerFirst = 0 } = Astro.props;
---
<ul class="grid" role="list">
  {products.map((p, i) => (
    <li><ProductCard product={p} headingLevel={headingLevel} eager={i < eagerFirst} /></li>
  ))}
</ul>
```

- [ ] **Step 5: Write `src/components/Breadcrumbs.astro`**

```astro
---
interface Props { items: { name: string; path: string }[] }
const { items } = Astro.props;
---
<nav aria-label="Breadcrumb" class="breadcrumbs">
  <ol>
    {items.map((c, i) => (
      <li>{i < items.length - 1 ? <a href={c.path}>{c.name}</a> : <span aria-current="page">{c.name}</span>}</li>
    ))}
  </ol>
</nav>
```

- [ ] **Step 6: Append card, grid and breadcrumb styles to `src/styles/global.css`**

```css
/* Product grid and cards */
.grid { list-style: none; margin: 0; padding: 0; display: grid; gap: 1.25rem; grid-template-columns: repeat(2, minmax(0, 1fr)); }
@media (min-width: 40rem) { .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; } }
@media (min-width: 64rem) { .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.grid > li { max-width: none; }
.card { background: var(--sand); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; height: 100%; display: flex; flex-direction: column; transition: background-color var(--transition); }
.card:hover { background: var(--sand-hover); }
.card-link { display: block; color: var(--terracotta-deep); text-decoration: none; }
.card-link:focus-visible { outline-offset: -3px; }
.card-media { position: relative; aspect-ratio: 1 / 1; background: var(--butter); }
.card-media img { width: 100%; height: 100%; object-fit: cover; }
.card-badge { position: absolute; top: 0.6rem; left: 0.6rem; }
.card-title { font-size: 1.125rem; line-height: 1.3; color: var(--terracotta-deep); margin: 0.85rem 0.9rem 0.25rem; }
.card-link:hover .card-title { text-decoration: underline; text-underline-offset: 0.18em; }
.card-price { margin: auto 0.9rem 0.9rem; font-weight: 700; color: var(--umber); }

/* Breadcrumbs */
.breadcrumbs ol { list-style: none; display: flex; flex-wrap: wrap; gap: 0.25rem; margin: 1.25rem 0 0; padding: 0; font-size: var(--fs-small); }
.breadcrumbs li + li::before { content: '›'; margin-right: 0.35rem; color: var(--umber-muted); }
.breadcrumbs a { display: inline-flex; min-height: 44px; align-items: center; }
.breadcrumbs [aria-current] { display: inline-flex; min-height: 44px; align-items: center; color: var(--umber-muted); }

/* Group jump links */
.jump { display: flex; flex-wrap: wrap; gap: 0.5rem 1.25rem; list-style: none; padding: 0; margin: 0 0 1rem; }
.jump a { display: inline-flex; min-height: 48px; align-items: center; font-weight: 700; }
.group + .group { margin-top: 3rem; }
```

- [ ] **Step 7: Write `src/pages/shop/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import ProductGrid from '../../components/ProductGrid.astro';
import { sortForGrid } from '../../lib/products';
import { breadcrumbJsonLd, pageTitle } from '../../lib/seo';

const products = sortForGrid(await getCollection('products'));
const crumbs = [{ name: 'Home', path: '/' }, { name: 'Shop all', path: '/shop/' }];
---
<BaseLayout
  title={pageTitle('Shop all handmade crochet bags and coasters')}
  description="Every crochet bag, coaster and hat in the Sunnie Designs shop, each one made by hand. In-stock pieces first."
  current="shop"
  jsonLd={[breadcrumbJsonLd(crumbs)]}
>
  <div class="container">
    <Breadcrumbs items={crumbs} />
    <header class="page-head">
      <h1>Shop all</h1>
      <p>Everything in the shop, with in-stock pieces first. Tap any piece for sizes, colours and more photos.</p>
    </header>
    <ProductGrid products={products} headingLevel="h2" eagerFirst={4} />
  </div>
</BaseLayout>
```

- [ ] **Step 8: Write `src/pages/shop/bags.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import ProductGrid from '../../components/ProductGrid.astro';
import { GROUP_LABELS, GROUP_ORDER, inGroup } from '../../lib/products';
import { breadcrumbJsonLd, pageTitle } from '../../lib/seo';

const all = await getCollection('products');
const groups = GROUP_ORDER.map((g) => ({ key: g, label: GROUP_LABELS[g], items: inGroup(all, g) })).filter((g) => g.items.length > 0);
const crumbs = [{ name: 'Home', path: '/' }, { name: 'Bags', path: '/shop/bags/' }];
---
<BaseLayout
  title={pageTitle('Handmade crochet bags and phone crossbodies')}
  description="Crochet phone bags, character crossbodies and totes. Frogs, poodles, sunflowers and more, each one made by hand. Ships in 3–7 days."
  current="bags"
  jsonLd={[breadcrumbJsonLd(crumbs)]}
>
  <div class="container">
    <Breadcrumbs items={crumbs} />
    <header class="page-head">
      <h1>Crochet bags</h1>
      <p>Frogs, poodles, sunflowers and totes, each one crocheted by hand. Tap any bag for its size, colours and more photos.</p>
      <ul class="jump" role="list">
        {groups.map((g) => <li><a href={`#${g.key}`}>{g.label}</a></li>)}
      </ul>
    </header>
    {groups.map((g, i) => (
      <section class="group" id={g.key} aria-labelledby={`${g.key}-h`}>
        <h2 id={`${g.key}-h`}>{g.label}</h2>
        <ProductGrid products={g.items} eagerFirst={i === 0 ? 4 : 0} />
      </section>
    ))}
  </div>
</BaseLayout>
```

- [ ] **Step 9: Write `src/pages/shop/[category].astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import ProductGrid from '../../components/ProductGrid.astro';
import { CATEGORY_LABELS, inCategory } from '../../lib/products';
import { breadcrumbJsonLd, pageTitle } from '../../lib/seo';

const COPY = {
  coasters: {
    title: 'Handmade crochet coasters and mug rugs',
    h1: 'Crochet coasters',
    intro: 'Coasters and mug rugs for your table, from rose baskets to cat, pig and bear sets. They make an easy gift.',
    description: 'Handmade crochet coasters and mug rugs: flower sets, rose baskets and animal designs. Ships in 3–7 days.',
  },
  hats: {
    title: 'Handmade crochet hats',
    h1: 'Crochet hats',
    intro: 'Crochet hats, made by hand. Tap a hat for sizes and more photos.',
    description: 'Handmade crochet hats from Sunnie Designs. Ships in 3–7 days.',
  },
} as const;

export function getStaticPaths() {
  return [{ params: { category: 'coasters' } }, { params: { category: 'hats' } }];
}

const category = Astro.params.category as keyof typeof COPY;
const copy = COPY[category];
const products = inCategory(await getCollection('products'), category);
const path = `/shop/${category}/`;
const crumbs = [{ name: 'Home', path: '/' }, { name: CATEGORY_LABELS[category], path }];
---
<BaseLayout title={pageTitle(copy.title)} description={copy.description} current={category} jsonLd={[breadcrumbJsonLd(crumbs)]}>
  <div class="container">
    <Breadcrumbs items={crumbs} />
    <header class="page-head">
      <h1>{copy.h1}</h1>
      <p>{copy.intro}</p>
    </header>
    <ProductGrid products={products} headingLevel="h2" eagerFirst={4} />
  </div>
</BaseLayout>
```

- [ ] **Step 10: Build and run tests**

Run: `npm run build && npm run test:dist`
Expected: PASS. (The `every page` layout test now covers the shop pages too.)

- [ ] **Step 11: Look at it**

`npm run dev`. Check `/shop/bags/` at 375px, 768px and 1280px in the built-in browser: two, three and four columns; the badge doesn't cover faces; card hover darkens to sand-hover. Stop the server.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: add product cards, shop all, bags, coasters and hats pages

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Product page with CSS-only gallery

Invoke `schema-markup` (Product rich result) and `make-interfaces-feel-better` (gallery feel).

**Files:**
- Create: `src/components/Gallery.astro`, `src/pages/products/[slug].astro`, `tests/dist/product.test.ts`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `related`, `formatPrice`, `CATEGORY_LABELS`, `productTitle`, `metaDescription`, `productJsonLd`, `breadcrumbJsonLd`, `absoluteUrl`, `site`, `ProductGrid`, `Breadcrumbs`.
- Produces: one page per product at `/products/<id>/`, with Buy button class `btn btn-primary btn-block` and `href` = `etsyUrl`.

- [ ] **Step 1: Write failing dist tests**

`tests/dist/product.test.ts`:
```ts
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIST, jsonLd, page } from './helpers';

const slugs = readdirSync(join(DIST, 'products'));

describe('product pages', () => {
  it('builds all 51', () => expect(slugs).toHaveLength(51));

  it.each(slugs)('%s has Product data, a price and a buy action', (slug) => {
    const html = page(`/products/${slug}/`);
    const product = jsonLd(html).find((d) => d['@type'] === 'Product');
    expect(product?.offers.priceCurrency).toBe('EUR');
    expect(product?.offers.url).toBe(`https://sunniedesigns.com/products/${slug}/`);
    expect(product).not.toHaveProperty('aggregateRating');
    expect(html).toMatch(/€\d+\.\d{2}/);
    expect(html).toMatch(/class="btn btn-primary btn-block" href="https:\/\/www\.etsy\.com\/|class="btn btn-disabled btn-block"/);
    expect(html).toContain('Made by ');
    expect(html).toContain('property="og:type" content="product"');
  });

  it('marks the first gallery image as high priority', () => {
    const html = page(`/products/${slugs[0]}/`);
    expect(html).toMatch(/<img[^>]*fetchpriority="high"/);
  });
});
```

- [ ] **Step 2: Build and run to verify failure**

Run: `npm run build && npx vitest run tests/dist/product.test.ts`
Expected: FAIL (no `dist/products`).

- [ ] **Step 3: Write `src/components/Gallery.astro`**

```astro
---
import { Picture } from 'astro:assets';

interface Props {
  images: { src: ImageMetadata; alt: string }[];
  name: string;
}
const { images, name } = Astro.props;
---
<div class="gallery">
  <ul class="gallery-main" role="list" aria-label={`Photos of ${name}`}>
    {images.map((img, i) => (
      <li class="gallery-slide" id={`photo-${i + 1}`}>
        <Picture
          src={img.src}
          alt={img.alt}
          formats={i === 0 ? ['avif', 'webp'] : ['webp']}
          widths={[480, 800, 1200]}
          sizes="(min-width: 56rem) 52vw, 100vw"
          loading={i === 0 ? 'eager' : 'lazy'}
          fetchpriority={i === 0 ? 'high' : undefined}
        />
      </li>
    ))}
  </ul>
  {images.length > 1 && (
    <ul class="gallery-thumbs" role="list">
      {images.map((img, i) => (
        <li>
          <a href={`#photo-${i + 1}`} aria-label={`Show photo ${i + 1} of ${images.length}`}>
            <Picture src={img.src} alt="" formats={['webp']} widths={[96, 192]} sizes="96px" loading="lazy" />
          </a>
        </li>
      ))}
    </ul>
  )}
</div>
```

- [ ] **Step 4: Write `src/pages/products/[slug].astro`**

```astro
---
import { getCollection, render, type CollectionEntry } from 'astro:content';
import { getImage } from 'astro:assets';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import Gallery from '../../components/Gallery.astro';
import ProductGrid from '../../components/ProductGrid.astro';
import { site } from '../../data/site';
import { CATEGORY_LABELS, formatPrice, related } from '../../lib/products';
import { absoluteUrl, breadcrumbJsonLd, metaDescription, productJsonLd, productTitle } from '../../lib/seo';

export async function getStaticPaths() {
  const products = await getCollection('products');
  return products.map((product) => ({ params: { slug: product.id }, props: { product, all: products } }));
}

interface Props {
  product: CollectionEntry<'products'>;
  all: CollectionEntry<'products'>[];
}
const { product, all } = Astro.props;
const d = product.data;
const { Content } = await render(product);

const path = `/products/${product.id}/`;
const crumbs = [
  { name: 'Home', path: '/' },
  { name: CATEGORY_LABELS[d.category], path: `/shop/${d.category}/` },
  { name: d.name, path },
];
const ldImages = await Promise.all(
  d.images.slice(0, 3).map(async (img) => absoluteUrl((await getImage({ src: img.src, width: 1200, format: 'jpg' })).src)),
);
const description = metaDescription(product.body ?? d.name);
const current = d.category;
const optionNames = d.options.map((o) => o.name.toLowerCase()).join(' and ');
---
<BaseLayout
  title={productTitle(d.name)}
  description={description}
  path={path}
  image={ldImages[0]}
  type="product"
  current={current}
  jsonLd={[
    productJsonLd({ name: d.name, description, url: absoluteUrl(path), images: ldImages, price: d.price, inStock: d.inStock }),
    breadcrumbJsonLd(crumbs),
  ]}
>
  <div class="container">
    <Breadcrumbs items={crumbs} />
    <div class="product">
      <Gallery images={d.images} name={d.name} />
      <div class="product-info">
        {d.isNew && d.inStock && <span class="badge">New</span>}
        <h1>{d.name}</h1>
        <p class="product-price">{formatPrice(d.price)}</p>
        <p class="product-maker">Made by {d.maker}</p>
        {d.options.map((o) => (
          <p class="product-option"><strong>{o.name}:</strong> {o.values.join(', ')}</p>
        ))}
        {d.inStock ? (
          <>
            <a class="btn btn-primary btn-block" href={d.etsyUrl} rel="noopener">Buy on Etsy</a>
            <p class="small muted buy-note">
              You'll check out on our Etsy shop{optionNames ? `, where you choose your ${optionNames}` : ''}. Etsy handles payment and buyer protection.
            </p>
          </>
        ) : (
          <span class="btn btn-disabled btn-block" aria-disabled="true">Sold out</span>
        )}
        <ul class="product-facts">
          {d.size && <li><strong>Size:</strong> {d.size}</li>}
          {d.materials.length > 0 && <li><strong>Materials:</strong> {d.materials.join(', ')}</li>}
          <li><strong>Ships in:</strong> {site.shipsIn}</li>
        </ul>
        <div class="prose product-body"><Content /></div>
      </div>
    </div>
    <section class="section related" aria-labelledby="related-h">
      <h2 id="related-h">You might also like</h2>
      <ProductGrid products={related(all, product)} />
    </section>
  </div>
</BaseLayout>
```

- [ ] **Step 5: Append product page styles to `src/styles/global.css`**

```css
/* Product page */
.product { display: grid; gap: 2rem; margin-top: 1rem; }
@media (min-width: 56rem) { .product { grid-template-columns: 1.15fr 1fr; gap: 3rem; align-items: start; } .product-info { position: sticky; top: calc(var(--header-h) + 1rem); } }
.product-info h1 { margin-top: 0.5rem; }
.product-price { font-size: var(--fs-h3); font-weight: 700; margin-bottom: 0.25rem; }
.product-maker { color: var(--umber-muted); }
.product-option { margin-bottom: 0.5rem; }
.buy-note { margin-top: 0.75rem; }
.product-info .btn-block { margin-top: 1rem; }
.product-facts { list-style: none; padding: 1rem 0; margin: 1.5rem 0; border-block: 1px solid var(--border); }
.product-facts li + li { margin-top: 0.35rem; }
.product-body { font-size: var(--fs-body-lg); }

/* Gallery: horizontal scroll-snap strip + anchor thumbnails, no JS */
.gallery-main {
  list-style: none; margin: 0; padding: 0;
  display: flex; overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-x: contain;
  border-radius: var(--radius); background: var(--sand);
  scrollbar-width: none;
}
.gallery-main::-webkit-scrollbar { display: none; }
.gallery-slide { flex: 0 0 100%; scroll-snap-align: start; aspect-ratio: 1 / 1; max-width: none; scroll-margin-top: calc(var(--header-h) + 1rem); }
.gallery-slide img { width: 100%; height: 100%; object-fit: contain; }
.gallery-thumbs { list-style: none; margin: 0.75rem 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; }
.gallery-thumbs a { display: block; width: 64px; height: 64px; border-radius: var(--radius-sm); overflow: hidden; border: 2px solid var(--border); transition: border-color var(--transition); }
.gallery-thumbs a:hover { border-color: var(--terracotta-hover); }
.gallery-thumbs img { width: 100%; height: 100%; object-fit: cover; }
.related { padding-bottom: 0; }
```

- [ ] **Step 6: Build and run tests**

Run: `npm run build && npm run test:dist`
Expected: PASS.

- [ ] **Step 7: Look at it**

`npm run dev` and open `/products/poodle-crossbody-bag/`:
- On mobile you can swipe through the photos.
- On desktop, tapping a thumbnail shows that photo without hiding it under the sticky header.
- Tab reaches every thumbnail with a visible ring.
- The buy note reads naturally. (Option names like "Animal" read oddly; Task 13 cleans those.)

Stop the server.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add product pages with CSS-only gallery, Etsy buy button and Product JSON-LD

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Homepage

Invoke `page-cro`, `copywriting`, `ogilvy-copywriting` and `stop-slop`. The approved headline, subhead and button text below are fixed. Use the skills to check the remaining section copy and hierarchy.

**Files:**
- Create: `src/components/TrustBar.astro`, `src/components/ReviewQuote.astro`, `tests/dist/home.test.ts`
- Modify: `src/pages/index.astro`, `src/styles/global.css`

**Interfaces:**
- Consumes: `featured`, `newest`, `showHatsInNav`, `formatPrice`, `site`, `organizationJsonLd`, `websiteJsonLd`, `src/data/reviews.json`, `src/assets/story/hands.jpg`.
- Produces: `<TrustBar />`, `<ReviewQuote review={Review} />`. `ReviewQuote` renders `en` text for German reviews with "Translated from German".

- [ ] **Step 1: Write failing dist tests**

`tests/dist/home.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { htmlFiles, jsonLd, page } from './helpers';
import { readFileSync } from 'node:fs';

describe('homepage', () => {
  const html = page('/');

  it('has the approved hero', () => {
    expect(html).toMatch(/<h1[^>]*>So cute you'll grin\. Sturdy enough to carry every day\.<\/h1>/);
    expect(html).toContain('Find your bag');
    expect(html).toContain('Meet Hui');
    expect(html).toMatch(/<img[^>]*fetchpriority="high"/);
  });

  it('shows the trust bar facts', () => {
    for (const t of ['Ships in 3–7 days', '4.9 on Etsy', 'Star Seller', '250+ eBay buyers', 'Handmade by Hui']) {
      expect(html).toContain(t);
    }
  });

  it('shows exactly four bestsellers', () => {
    const section = html.split('id="bestsellers"')[1].split('</section>')[0];
    expect((section.match(/class="card"/g) ?? []).length).toBe(4);
  });

  it('shows three review quotes including the translated repeat buyer', () => {
    expect((html.match(/class="quote"/g) ?? []).length).toBe(3);
    expect(html).toContain('That was already my second purchase');
    expect(html).toContain('Translated from German');
  });

  it('has Organization and WebSite JSON-LD', () => {
    const types = jsonLd(html).map((d) => d['@type']);
    expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite']));
  });

  it('title and description fit', () => {
    const title = html.match(/<title>([^<]+)<\/title>/)![1];
    expect(title.length).toBeLessThanOrEqual(60);
  });
});

describe('site-wide content rules', () => {
  it('never shows the excluded review or links eBay', () => {
    for (const f of htmlFiles()) {
      const h = readFileSync(f, 'utf8');
      expect(h.toLowerCase()).not.toContain('noel francis');
      expect(h).not.toMatch(/href="https?:\/\/(www\.)?ebay\./);
    }
  });
});
```

- [ ] **Step 2: Build and run to verify failure**

Run: `npm run build && npx vitest run tests/dist/home.test.ts`
Expected: FAIL on the hero test.

- [ ] **Step 3: Write `src/components/TrustBar.astro`**

```astro
---
import { site } from '../data/site';
---
<section class="trust" aria-label="Why buy from us">
  <ul class="container trust-list" role="list">
    <li>Ships in {site.shipsIn}</li>
    <li><span aria-hidden="true">★ </span>{site.proof.etsyRating} on Etsy · Star Seller</li>
    <li>{site.proof.ebayPositive} positive from {site.proof.ebayCount} eBay buyers</li>
    <li>{site.makerLine}</li>
  </ul>
</section>
```

- [ ] **Step 4: Write `src/components/ReviewQuote.astro`**

```astro
---
interface Review { reviewer: string; date: string; rating: number; text: string; lang: 'en' | 'de'; en?: string }
interface Props { review: Review; showOriginal?: boolean }
const { review, showOriginal = false } = Astro.props;
const translated = review.lang === 'de' && review.en;
const month = new Date(`${review.date}T00:00:00Z`).toLocaleDateString('en-IE', { month: 'long', year: 'numeric', timeZone: 'UTC' });
---
<figure class="quote">
  <p class="quote-stars" aria-label={`${review.rating} out of 5 stars`}><span aria-hidden="true">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></p>
  <blockquote>
    <p>{translated ? review.en : review.text}</p>
    {translated && showOriginal && <p class="small muted" lang="de">{review.text}</p>}
  </blockquote>
  <figcaption class="small">
    {review.reviewer}, {month}, Etsy{translated && <span class="muted"> · Translated from German</span>}
  </figcaption>
</figure>
```

- [ ] **Step 5: Write `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import { Picture } from 'astro:assets';
import BaseLayout from '../layouts/BaseLayout.astro';
import ProductGrid from '../components/ProductGrid.astro';
import TrustBar from '../components/TrustBar.astro';
import ReviewQuote from '../components/ReviewQuote.astro';
import reviews from '../data/reviews.json';
import storyPhoto from '../assets/story/hands.jpg';
import { site } from '../data/site';
import { featured, formatPrice, newest, showHatsInNav } from '../lib/products';
import { organizationJsonLd, websiteJsonLd } from '../lib/seo';

const all = await getCollection('products');
const best = featured(all);
const hero = newest(all) ?? best[0];
const coaster = best.find((p) => p.data.category === 'coasters') ?? best[2];

const HOME_REVIEWS = ['hexfeather|2026-09-25', 'Hannah|2026-06-04', 'Antje-Susan|2026-06-02'];
const quotes = HOME_REVIEWS.map((key) => {
  const r = reviews.find((x) => `${x.reviewer}|${x.date}` === key);
  if (!r) throw new Error(`Homepage review missing from reviews.json: ${key}`);
  return r as (typeof reviews)[number] & { lang: 'en' | 'de' };
});

const tiles = [
  { label: 'Bags', href: '/shop/bags/', img: best[0].data.images[0].src },
  { label: 'Coasters', href: '/shop/coasters/', img: coaster.data.images[0].src },
  ...(showHatsInNav(all)
    ? [{ label: 'Hats', href: '/shop/hats/', img: all.find((p) => p.data.category === 'hats')!.data.images[0].src }]
    : []),
];
---
<BaseLayout
  title="Sunnie Designs | Handmade crochet bags and coasters"
  description={site.description}
  path="/"
  jsonLd={[organizationJsonLd(), websiteJsonLd()]}
>
  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-copy">
        <h1 class="hero-title">So cute you'll grin. Sturdy enough to carry every day.</h1>
        <p class="hero-sub">
          Crochet phone bags, totes and coasters, {site.heroMakerClause}. Rated {site.proof.etsyRating} on Etsy and
          {site.proof.ebayPositive} positive by {site.proof.ebayCount} eBay buyers.
        </p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="/shop/bags/">Find your bag</a>
          <a class="btn-ghost" href="/our-story/">Meet Hui</a>
        </div>
      </div>
      <a class="hero-media" href={`/products/${hero.id}/`}>
        <Picture
          src={hero.data.images[0].src}
          alt={hero.data.images[0].alt}
          formats={['avif', 'webp']}
          widths={[480, 800, 1200]}
          sizes="(min-width: 56rem) 46vw, 100vw"
          loading="eager"
          fetchpriority="high"
        />
        <span class="hero-caption">{hero.data.isNew ? 'New: ' : ''}{hero.data.name}, {formatPrice(hero.data.price)}</span>
      </a>
    </div>
  </section>

  <TrustBar />

  <section class="section" id="bestsellers" aria-labelledby="best-h">
    <div class="container">
      <div class="section-head">
        <h2 id="best-h">Bestsellers</h2>
        <a href="/shop/">Shop all</a>
      </div>
      <ProductGrid products={best} />
    </div>
  </section>

  <section class="section section-sand" aria-labelledby="story-h">
    <div class="container story">
      <Picture src={storyPhoto} alt="Hui crocheting a bag by hand" formats={['avif', 'webp']} widths={[480, 800]} sizes="(min-width: 56rem) 40vw, 100vw" loading="lazy" class="story-img" />
      <div>
        <h2 id="story-h">Every bag starts with Hui and a crochet hook</h2>
        <p class="lead">
          Hui designs each piece and crochets it by hand. Hand-worked yarn means your bag can differ from the photos by a
          centimetre or two, and no two come out quite the same.
        </p>
        <p><a href="/our-story/">Read our story</a></p>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="cats-h">
    <div class="container">
      <h2 id="cats-h">Shop by type</h2>
      <ul class="tiles" role="list">
        {tiles.map((t) => (
          <li>
            <a class="tile" href={t.href}>
              <Picture src={t.img} alt="" formats={['avif', 'webp']} widths={[400, 800]} sizes="(min-width: 40rem) 33vw, 100vw" loading="lazy" />
              <span class="tile-label">{t.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>

  <section class="section section-sand" aria-labelledby="reviews-h">
    <div class="container">
      <div class="section-head">
        <h2 id="reviews-h">What buyers say</h2>
        <a href="/reviews/">Read all reviews</a>
      </div>
      <div class="quotes">
        {quotes.map((r) => <ReviewQuote review={r} />)}
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 6: Append homepage styles to `src/styles/global.css`**

```css
/* Hero */
.hero { padding-block: clamp(1.5rem, 1rem + 3vw, 3.5rem); }
.hero-inner { display: grid; gap: 2rem; align-items: center; }
@media (min-width: 56rem) { .hero-inner { grid-template-columns: 1fr 1fr; gap: 3.5rem; } }
.hero-title { font-size: var(--fs-hero); line-height: 1.15; margin-bottom: 0.6em; }
.hero-sub { font-size: var(--fs-body-lg); }
.hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem 1.5rem; margin-top: 1.5rem; }
.hero-media { position: relative; display: block; border-radius: var(--radius); overflow: hidden; background: var(--sand); aspect-ratio: 1 / 1; }
.hero-media img { width: 100%; height: 100%; object-fit: cover; }
.hero-caption {
  position: absolute; left: 0.75rem; bottom: 0.75rem; right: 0.75rem; width: fit-content;
  background: var(--sand); color: var(--terracotta-deep); font-weight: 700;
  padding: 0.4rem 0.8rem; border-radius: 999px; font-size: var(--fs-small);
}
.hero-media:hover .hero-caption { text-decoration: underline; }

/* Trust bar */
.trust { border-block: 1px solid var(--border); background: var(--linen); }
.trust-list { list-style: none; margin-block: 0; padding-block: 1rem; display: grid; gap: 0.5rem 1.5rem; grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); font-weight: 700; font-size: var(--fs-small); }
.trust-list li { display: flex; align-items: center; gap: 0.5rem; }
.trust-list li::before { content: ''; width: 0.5rem; height: 0.5rem; border-radius: 50%; background: var(--olive); flex: none; }

/* Story */
.story { display: grid; gap: 2rem; align-items: center; }
@media (min-width: 56rem) { .story { grid-template-columns: 0.9fr 1.1fr; gap: 3rem; } }
.story-img { width: 100%; border-radius: var(--radius); aspect-ratio: 4 / 3; object-fit: cover; }

/* Category tiles */
.tiles { list-style: none; margin: 0; padding: 0; display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); }
.tiles > li { max-width: none; }
.tile { position: relative; display: block; border-radius: var(--radius); overflow: hidden; aspect-ratio: 4 / 3; background: var(--sand); }
.tile img { width: 100%; height: 100%; object-fit: cover; }
.tile-label {
  position: absolute; left: 1rem; bottom: 1rem; background: var(--sand); color: var(--terracotta-deep);
  font-family: var(--font-heading); font-size: var(--fs-h3); padding: 0.35rem 1rem; border-radius: 999px;
}
.tile:hover .tile-label { background: var(--sand-hover); text-decoration: underline; }

/* Quotes */
.quotes { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); }
.quote { margin: 0; background: var(--linen); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; display: flex; flex-direction: column; }
.quote blockquote { margin: 0 0 1rem; font-size: var(--fs-body-lg); }
.quote figcaption { margin-top: auto; color: var(--umber); }
.quote-stars { color: var(--terracotta); letter-spacing: 0.1em; margin-bottom: 0.5rem; }
.section-sand .quote a { color: var(--terracotta); }
```

- [ ] **Step 7: Build and run tests**

Run: `npm run build && npm test && npm run test:dist`
Expected: PASS.

- [ ] **Step 8: Look at it**

`npm run dev` and check the homepage at 375px and 1280px:
- The hero text is readable before the image arrives.
- The four trust facts wrap cleanly.
- The Hannah quote (the Kindle one) doesn't overflow its card.

Stop the server.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: build homepage with hero, trust bar, bestsellers, story, categories and reviews

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Story, reviews, help and legal pages

Invoke `copywriting`, `copy-editing` and `stop-slop` to check every sentence below before committing. Keep every fact as written. Don't add claims about materials, timings or locations that aren't here.

**Files:**
- Create: `src/pages/our-story.astro`, `src/pages/reviews.astro`, `src/pages/shipping.astro`, `src/pages/care.astro`, `src/pages/contact.astro`, `src/pages/privacy.astro`, `src/pages/404.astro`, `tests/dist/pages.test.ts`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `BaseLayout`, `ReviewQuote`, `site`, `pageTitle`, `reviews.json`, `storyPhoto`.

- [ ] **Step 1: Write failing dist tests**

`tests/dist/pages.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import reviews from '../../src/data/reviews.json';
import { page } from './helpers';

describe('info pages', () => {
  it.each(['/our-story/', '/reviews/', '/shipping/', '/care/', '/contact/', '/privacy/', '/404/'])('%s builds', (route) => {
    expect(page(route)).toContain('<h1');
  });
  it('contact shows the hello address', () => {
    expect(page('/contact/')).toContain('mailto:hello@sunniedesigns.com');
  });
  it('our story shows the hui address', () => {
    expect(page('/our-story/')).toContain('mailto:hui@sunniedesigns.com');
  });
  it('reviews page lists every kept review and shows German originals', () => {
    const html = page('/reviews/');
    expect((html.match(/class="quote"/g) ?? []).length).toBe(reviews.length);
    expect(html).toContain('lang="de"');
    expect(html).toContain('250+');
  });
  it('404 is noindexed', () => {
    expect(page('/404/')).toContain('<meta name="robots" content="noindex"');
  });
  it('story page never names a country of manufacture', () => {
    expect(page('/our-story/')).not.toMatch(/made in (ireland|china)/i);
  });
});
```

- [ ] **Step 2: Build and run to verify failure**

Run: `npm run build && npx vitest run tests/dist/pages.test.ts`
Expected: FAIL with `Missing built page /our-story/`.

- [ ] **Step 3: Write `src/pages/our-story.astro`**

```astro
---
import { Picture } from 'astro:assets';
import BaseLayout from '../layouts/BaseLayout.astro';
import storyPhoto from '../assets/story/hands.jpg';
import { site } from '../data/site';
import { pageTitle } from '../lib/seo';
---
<BaseLayout
  title={pageTitle('Our story')}
  description="Meet Hui, who designs and crochets every Sunnie Designs bag by hand, and Nollaig, who runs the shop."
  current="story"
>
  <article class="container narrow">
    <header class="page-head">
      <h1>Meet Hui, who makes every bag</h1>
      <p>Sunnie Designs is two people: Hui, who designs and crochets each piece, and Nollaig, who runs the shop.</p>
    </header>
    <Picture src={storyPhoto} alt="Hui crocheting a bag by hand" formats={['avif', 'webp']} widths={[600, 1000]} sizes="(min-width: 48rem) 44rem, 100vw" class="story-img" loading="eager" />
    <div class="prose">
      <h2>Made by hand, one piece at a time</h2>
      <p>
        Hui designs every frog, poodle and sunflower you see here, then crochets it stitch by stitch. Hand-worked yarn
        means your piece can differ from the photos by a centimetre or two. We measure everything by hand and list the
        sizes on each product page.
      </p>
      <p>
        Our thank-you note says it best: small, intentional imperfections make your piece yours. You're carrying something
        a person made, and you're helping keep slow craft going.
      </p>
      <h2>The shop side</h2>
      <p>
        Nollaig takes the photos, packs your order and answers your messages, usually {site.replyTime}. Orders ship in
        {site.shipsIn}.
      </p>
      <h2>Say hello</h2>
      <p>
        Questions about an order: <a href={`mailto:${site.email.hello}`}>{site.email.hello}</a>. Custom colour or a special
        request: write to Hui at <a href={`mailto:${site.email.hui}`}>{site.email.hui}</a>.
      </p>
      <p><a class="btn btn-primary" href="/shop/bags/">Find your bag</a></p>
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 4: Write `src/pages/reviews.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ReviewQuote from '../components/ReviewQuote.astro';
import reviews from '../data/reviews.json';
import { site } from '../data/site';
import { pageTitle } from '../lib/seo';

const list = reviews as ((typeof reviews)[number] & { lang: 'en' | 'de' })[];
---
<BaseLayout
  title={pageTitle('Customer reviews')}
  description={`Reviews from Sunnie Designs buyers on Etsy, where we're a Star Seller rated ${site.proof.etsyRating}.`}
>
  <div class="container">
    <header class="page-head">
      <h1>What buyers say</h1>
      <p>
        We're rated {site.proof.etsyRating} out of 5 on Etsy, where we're a Star Seller, and {site.proof.ebayPositive}
        positive from {site.proof.ebayCount} buyers on eBay. These reviews come from our Etsy shop. German reviews show
        an English translation with the original underneath.
      </p>
    </header>
    <div class="quotes">
      {list.map((r) => <ReviewQuote review={r} showOriginal />)}
    </div>
    <p class="section"><a href={site.etsyShopUrl} rel="noopener">See our Etsy shop</a></p>
  </div>
</BaseLayout>
```

- [ ] **Step 5: Write `src/pages/shipping.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { site } from '../data/site';
import { pageTitle } from '../lib/seo';
---
<BaseLayout title={pageTitle('Shipping and returns')} description={`Orders ship in ${site.shipsIn}. Checkout, shipping costs and returns run through our Etsy shop.`}>
  <article class="container narrow prose">
    <header class="page-head"><h1>Shipping and returns</h1></header>
    <h2>How ordering works</h2>
    <p>
      Every "Buy on Etsy" button takes you to the same piece in our Etsy shop. You pay there, and Etsy shows the shipping
      cost for your country before you pay.
    </p>
    <h2>When your order ships</h2>
    <p>We pack and ship orders in {site.shipsIn}. Etsy sends you tracking details once your parcel is on its way.</p>
    <h2>Returns</h2>
    <p>
      Returns follow the policy shown on each Etsy listing. If something isn't right with your order, email
      <a href={`mailto:${site.email.hello}`}>{site.email.hello}</a> or message us on Etsy and we'll sort it out.
    </p>
  </article>
</BaseLayout>
```

- [ ] **Step 6: Write `src/pages/care.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { site } from '../data/site';
import { pageTitle } from '../lib/seo';
---
<BaseLayout title={pageTitle('Care guide')} description="How to wash, dry and store your crochet bag, hat or coasters so they keep their shape.">
  <article class="container narrow prose">
    <header class="page-head"><h1>Caring for your crochet</h1></header>
    <p>Crochet lasts for years with a little care. Check the materials on your product page, then follow these steps.</p>
    <h2>Washing</h2>
    <ul>
      <li>Hand wash in cool water with a mild detergent.</li>
      <li>Squeeze the water out gently. Twisting or wringing pulls the stitches out of shape.</li>
      <li>Spot clean pieces with pearls, metal chains or charms, and keep those parts dry.</li>
    </ul>
    <h2>Drying</h2>
    <ul>
      <li>Reshape the piece while damp and dry it flat on a towel, away from direct heat.</li>
      <li>Skip the tumble dryer.</li>
    </ul>
    <h2>Fluffy and plush yarns</h2>
    <p>Brush plush pieces like the poodle bag gently with a wide comb to lift the fur again.</p>
    <h2>Storing</h2>
    <p>Stuff bags with tissue paper so they hold their shape, and keep them out of strong sunlight to protect the colours.</p>
    <p>Not sure about a piece? Email <a href={`mailto:${site.email.hello}`}>{site.email.hello}</a>.</p>
  </article>
</BaseLayout>
```

- [ ] **Step 7: Write `src/pages/contact.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { site } from '../data/site';
import { pageTitle } from '../lib/seo';
---
<BaseLayout title={pageTitle('Contact')} description={`Email Sunnie Designs at ${site.email.hello}. We reply ${site.replyTime}.`}>
  <article class="container narrow prose">
    <header class="page-head"><h1>Contact us</h1></header>
    <p>Email us and a real person replies, usually {site.replyTime}.</p>
    <p><a class="btn btn-primary" href={`mailto:${site.email.hello}`}>Email {site.email.hello}</a></p>
    <p>Already ordered on Etsy? You can also message us through your Etsy order page.</p>
  </article>
</BaseLayout>
```

- [ ] **Step 8: Write `src/pages/privacy.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { site } from '../data/site';
import { pageTitle } from '../lib/seo';
---
<BaseLayout title={pageTitle('Privacy')} description="How Sunnie Designs handles your data: no cookies, no tracking, cookie-free visitor counts.">
  <article class="container narrow prose">
    <header class="page-head"><h1>Privacy notice</h1></header>
    <p>Last updated: September 2026.</p>
    <h2>Who we are</h2>
    <p>Sunnie Designs sells handmade crochet pieces. Contact us about privacy at <a href={`mailto:${site.email.hello}`}>{site.email.hello}</a>.</p>
    <h2>What this website collects</h2>
    <p>
      This site sets no cookies and runs no advertising or tracking scripts. We use Cloudflare Web Analytics, which counts
      page views without cookies and without identifying you.
    </p>
    <h2>Emails you send us</h2>
    <p>If you email us, we use your address and message only to reply, and we delete them when we no longer need them.</p>
    <h2>Orders</h2>
    <p>Purchases happen on Etsy, which handles your payment and delivery details under the Etsy privacy policy.</p>
    <h2>Your rights</h2>
    <p>
      Under the GDPR you can ask to see, correct or delete data we hold about you. Email us and we'll respond within a
      month. You can also complain to the Irish Data Protection Commission.
    </p>
  </article>
</BaseLayout>
```

- [ ] **Step 9: Write `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { pageTitle } from '../lib/seo';
---
<BaseLayout title={pageTitle('Page not found')} description="This page doesn't exist." path="/404/" noindex>
  <div class="container narrow page-head">
    <h1>We couldn't find that page</h1>
    <p>The piece may have sold out or moved. Try one of these instead.</p>
    <p class="hero-actions">
      <a class="btn btn-primary" href="/shop/">Shop all</a>
      <a class="btn-ghost" href="/">Go to the homepage</a>
    </p>
  </div>
</BaseLayout>
```

- [ ] **Step 10: Append the narrow container style to `src/styles/global.css`**

```css
.narrow { max-width: 44rem; }
.narrow .story-img { margin-bottom: 2rem; }
```

- [ ] **Step 11: Build and run all tests**

Run: `npm run build && npm test && npm run test:dist`
Expected: PASS.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: add our story, reviews, shipping, care, contact, privacy and 404 pages

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Etsy listing URLs

**Run this task in the main session, not a subagent. It needs the built-in browser.**

**Files:**
- Create: `data/etsy-urls.json`, `scripts/apply-etsy-urls.mjs`, `tests/dist/launch.test.ts`
- Modify: `src/content/products/*.md` (the `etsyUrl` line only)

**Interfaces:**
- Consumes: `matchEtsyUrls`, `setFrontmatterField` (Task 5).
- Produces: every product's `etsyUrl` points at `https://www.etsy.com/listing/<id>/...`.

- [ ] **Step 1: Write the launch-gate test (it fails until URLs are set)**

`tests/dist/launch.test.ts`:
```ts
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { htmlFiles, rel } from './helpers';

describe('launch gate', () => {
  it('every in-stock product links to its own Etsy listing', () => {
    const bad = htmlFiles()
      .filter((f) => rel(f).startsWith('products/'))
      .filter((f) => {
        const h = readFileSync(f, 'utf8');
        return h.includes('btn btn-primary btn-block') && !/btn btn-primary btn-block" href="https:\/\/www\.etsy\.com\/listing\/\d+/.test(h);
      })
      .map(rel);
    expect(bad).toEqual([]);
  });

  it('no private shop data is in the repo or the build', () => {
    expect(execSync('git ls-files').toString()).not.toMatch(/shop_settings\.json/);
    for (const f of htmlFiles()) {
      const h = readFileSync(f, 'utf8');
      for (const secret of PRIVATE_TOKENS) expect(h).not.toContain(secret);
    }
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run build && npx vitest run tests/dist/launch.test.ts`
Expected: FAIL. The first test lists every product page.

- [ ] **Step 3: Collect listing links from the public shop page**

Open `https://www.etsy.com/shop/SunnieDesignCo` with `mcp__Claude_Browser__navigate`. Decline any cookie banner (non-essential off). Run this with `mcp__Claude_Browser__javascript_tool`:
```js
[...new Map([...document.querySelectorAll('a[href*="/listing/"]')].map((a) => {
  const url = a.href.split('?')[0];
  const title = (a.getAttribute('title') || a.querySelector('h3, h2')?.textContent || a.textContent || '').trim().replace(/\s+/g, ' ');
  return [url, { title, url }];
})).values()].filter((l) => l.title.length > 10)
```
Scroll to the bottom and repeat on each results page (`?page=2`, etc.) until you have 51 listings. If Etsy shows a CAPTCHA or blocks the page, stop and ask the owner to copy the listing links from Shop Manager instead. Don't try to get around the block.

Save the combined array as `data/etsy-urls.json`.

- [ ] **Step 4: Write `scripts/apply-etsy-urls.mjs`**

```js
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { matchEtsyUrls, setFrontmatterField } from './lib/etsy.mjs';

const DIR = 'src/content/products';
const links = JSON.parse(readFileSync('data/etsy-urls.json', 'utf8'));
const files = readdirSync(DIR).filter((f) => f.endsWith('.md'));
const products = files.map((f) => {
  const md = readFileSync(join(DIR, f), 'utf8');
  const seoTitle = JSON.parse(md.match(/^seoTitle: (.*)$/m)[1]);
  return { slug: f.replace(/\.md$/, ''), seoTitle, md };
});

const { matched, unmatched } = matchEtsyUrls(products, links);
for (const p of products) {
  if (matched[p.slug]) writeFileSync(join(DIR, `${p.slug}.md`), setFrontmatterField(p.md, 'etsyUrl', matched[p.slug]));
}
console.log(`Matched ${Object.keys(matched).length} of ${products.length}.`);
if (unmatched.length) {
  console.log(`Unmatched:\n  ${unmatched.join('\n  ')}`);
  process.exitCode = 1;
}
```

- [ ] **Step 5: Apply and resolve leftovers**

Run: `npm run etsy:urls`
Expected: `Matched 51 of 51.` For each unmatched slug, find its listing in `data/etsy-urls.json` by eye and set its `etsyUrl` line by hand.

- [ ] **Step 6: Rebuild and run the launch gate**

Run: `npm run build && npx vitest run tests/dist/launch.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add data/etsy-urls.json scripts/apply-etsy-urls.mjs tests/dist/launch.test.ts src/content/products
git commit -m "feat: point every Buy on Etsy button at its listing and add launch gate test

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Product copy pass

Invoke `copy-editing`, `copywriting`, `ogilvy-copywriting` and `stop-slop` first.

**Files:**
- Modify: `src/content/products/*.md`
- Create: `docs/owner-questions.md`

- [ ] **Step 1: List listings that claim wool**

Run: `grep -l '"Wool"' src/content/products/*.md`
Write the result into `docs/owner-questions.md` under "Materials to confirm". (The only 3-star review said a "wool" bag was a wool/synthetic blend.) Don't change those materials lines until the owner answers.

- [ ] **Step 2: Tidy frontmatter on every product**

For each of the 51 files:
- **`size`:** set it from the description's measurements in the format `"W 17 × H 15 × D 1 cm, strap 110 cm"`. Leave it out if the description gives none.
- **`options[].name`:** rename unclear names. For example, `"Animal"` on the coaster set becomes `"Design"`. Use `"Colour"` for any colour option.
- **`images[0..2].alt`:** open the first three photos with the Read tool and write what each shows, e.g. `"Green frog bag with pink mouth, worn crossbody"`. Keep each under 125 characters and don't start with "Image of".

- [ ] **Step 3: Rewrite the five featured and new product bodies**

Rewrite the Markdown body of these five products: `frog-phone-crossbody`, `sunflower-drawstring-backpack`, `animal-coasters-cat-pig-and-bear`, `tassel-crossbody-phone-bag` and `poodle-crossbody-bag`. (Use the actual slug from the import table if one differs.)

Structure for each:
- **Opening sentence:** what it is and who it's for.
- **Second paragraph:** what fits inside or how it's used, using facts from the existing description only.
- **Details list:** material, size, strap, closure, colours.
- **Sizing note:** the 1–3 cm hand-made variation.

Rules:
- No new claims.
- Stop-slop rules apply.
- 120–220 words each.

- [ ] **Step 4: Light clean on the other 46**

In the remaining bodies:
- Remove keyword-stuffing sentences and repeated tag lists.
- Remove sentences that describe Etsy mechanics ("add to cart", "message me on Etsy", "favourite this shop").
- Keep all measurements and material facts.

- [ ] **Step 5: Build and run everything**

Run: `npm run verify`
Expected: all checks and tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/content/products docs/owner-questions.md
git commit -m "content: add sizes, clearer options, descriptive alt text and rewritten featured descriptions

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: Link checker

**Files:**
- Create: `scripts/lib/links.mjs`, `scripts/check-links.mjs`, `tests/unit/links.test.mjs`

**Interfaces:**
- Produces: `extractHrefs(html) → string[]`, `internalTarget(href) → string | null` (a `dist`-relative file path for internal links, `null` for external, `mailto:` and hash-only links).

- [ ] **Step 1: Write failing tests**

`tests/unit/links.test.mjs`:
```js
import { describe, expect, it } from 'vitest';
import { extractHrefs, internalTarget } from '../../scripts/lib/links.mjs';

describe('extractHrefs', () => {
  it('pulls hrefs from anchors only and decodes &amp;', () => {
    const html = '<a class="x" href="/shop/">a</a><link href="/x.css"><a href="https://e.com/?a=1&amp;b=2">b</a>';
    expect(extractHrefs(html)).toEqual(['/shop/', 'https://e.com/?a=1&b=2']);
  });
});

describe('internalTarget', () => {
  it.each([
    ['/shop/', 'shop/index.html'],
    ['/', 'index.html'],
    ['/products/frog/#photo-2', 'products/frog/index.html'],
    ['/favicon.svg', 'favicon.svg'],
    ['#photo-1', null],
    ['mailto:hello@sunniedesigns.com', null],
    ['https://www.etsy.com/listing/1', null],
    ['//cdn.example.com/x', null],
  ])('%s → %s', (href, expected) => {
    expect(internalTarget(href)).toBe(expected);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tests/unit/links.test.mjs`
Expected: FAIL, cannot resolve module.

- [ ] **Step 3: Implement `scripts/lib/links.mjs`**

```js
export function extractHrefs(html) {
  return [...html.matchAll(/<a\b[^>]*?\shref="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
}

export function internalTarget(href) {
  if (!href.startsWith('/') || href.startsWith('//')) return null;
  const path = href.split('#')[0].split('?')[0];
  if (path.endsWith('/')) return `${path.slice(1)}index.html`;
  return path.slice(1);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/unit/links.test.mjs`
Expected: PASS.

- [ ] **Step 5: Write `scripts/check-links.mjs`**

```js
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { extractHrefs, internalTarget } from './lib/links.mjs';

const DIST = 'dist';
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : [],
  );

const errors = [];
const warnings = [];
const external = new Map();

for (const file of walk(DIST)) {
  const from = relative(DIST, file).replaceAll('\\', '/');
  for (const href of extractHrefs(readFileSync(file, 'utf8'))) {
    const target = internalTarget(href);
    if (target !== null) {
      if (!existsSync(join(DIST, target))) errors.push(`${from}: broken internal link ${href}`);
    } else if (/^https?:\/\//.test(href)) {
      if (!external.has(href)) external.set(href, from);
    }
  }
}

for (const [url, from] of external) {
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (sunniedesigns link check)' } });
    if (res.status === 403 || res.status === 429) warnings.push(`${url} returned ${res.status}; check it by hand (from ${from})`);
    else if (res.status >= 400) errors.push(`${from}: ${url} returned ${res.status}`);
  } catch (err) {
    errors.push(`${from}: ${url} failed (${err.message})`);
  }
}

console.log(`Checked ${external.size} external links.`);
for (const w of warnings) console.warn(`WARN  ${w}`);
for (const e of errors) console.error(`ERROR ${e}`);
if (errors.length) process.exit(1);
console.log('No broken links.');
```

- [ ] **Step 6: Run it**

Run: `npm run build && npm run links`
Expected: `No broken links.` Warnings for Etsy URLs that return 403 are expected. Open three of them in the built-in browser to confirm they show the right listing.

- [ ] **Step 7: Commit**

```bash
git add scripts/lib/links.mjs scripts/check-links.mjs tests/unit/links.test.mjs
git commit -m "feat: add internal and external link checker

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 15: Deploy to Cloudflare Workers

Invoke `cloudflare:wrangler` and `cloudflare:workers-best-practices` first. The first-time dashboard steps are done **by the owner** unless the Cloudflare connectors have been authorised by then.

**Files:**
- Create: `docs/deploy.md`

- [ ] **Step 1: Write `docs/deploy.md`**

````markdown
# Deploying sunniedesigns.com

The site is static. Cloudflare Workers Builds rebuilds it on every push to `main`.

## One-time setup (Cloudflare dashboard)

1. Workers & Pages → Create → Import a repository → GitHub → pick `NoelM74/sunnie-website`.
2. Project name: `sunnie-website`. Build command: `npm run build`. Deploy command: `npx wrangler deploy`. Leave the root directory empty.
3. Save and Deploy. The first build downloads packages and converts every photo, so allow up to 15 minutes. Later builds are faster.
4. Open the `*.workers.dev` link and check the site.
5. Worker → Settings → Domains & Routes → Add → Custom domain → `sunniedesigns.com`. Repeat for `www.sunniedesigns.com`.
6. Rules → Redirect Rules → Create from template "Redirect from WWW to root", on `sunniedesigns.com`.
7. Analytics & Logs → Web Analytics → Add a site → `sunniedesigns.com` → Automatic setup.
8. Worker → Settings → Builds → Branch control: production branch `main`, and preview builds on for other branches.

## Everyday updates

Claude edits the files and pushes to `main`. The site is live about two minutes later.

## Manual deploy (fallback)

```bash
npx wrangler login
npm run deploy
```
````

- [ ] **Step 2: Push and hand over**

Run: `npm run verify && git add docs/deploy.md && git commit -m "docs: add Cloudflare deploy steps" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" && git push`
Then ask the owner to do steps 1–8 of `docs/deploy.md` and send the `workers.dev` link.

- [ ] **Step 3: Check the live deploy**

With the link from the owner, run:
```bash
curl -sI https://sunniedesigns.com/ | head -5
curl -sI https://www.sunniedesigns.com/ | grep -i location
curl -s -o /dev/null -w "%{http_code}\n" https://sunniedesigns.com/no-such-page/
```
Expected: `200`; a `location: https://sunniedesigns.com/` header; `404`.

---

### Task 16: Launch QA

Invoke `cloudflare:web-perf`, `design:accessibility-review`, `web-design-guidelines`, `seo-audit`, `design-review`, `qa` and `benchmark`. Record every result in `docs/launch-report.md` and fix failures before ticking a box. Each fix gets its own commit.

**Files:**
- Create: `docs/launch-report.md`

- [ ] **Step 1: Lighthouse on three page types, mobile and desktop**

Run for `/`, `/shop/bags/` and `/products/poodle-crossbody-bag/`:
```bash
npx -y lighthouse@12 https://sunniedesigns.com/ --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./lh-home-mobile.json --chrome-flags="--headless=new"
npx -y lighthouse@12 https://sunniedesigns.com/ --preset=desktop --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./lh-home-desktop.json --chrome-flags="--headless=new"
```
Expected: every category ≥ 95, LCP < 2.5 s (mobile), CLS < 0.05. Home total transfer (`total-byte-weight`) < 800 KB. Delete the JSON files after recording the numbers.

- [ ] **Step 2: Keyboard and zoom walkthrough**

In the built-in browser:
- Tab from Home to Bags, then to a product, then to Buy on Etsy, using only the keyboard. The focus ring should be visible at every step.
- Repeat the walk at 200% zoom and again at 320px wide. There should be no horizontal scroll.

- [ ] **Step 3: Structured data and previews**

- Run the Rich Results Test on one product URL and the homepage. There should be no errors; warnings about shipping and return policy are expected until Phase 2.
- Check the social preview for the homepage and one product with a link preview tool.

- [ ] **Step 4: Search Console and analytics**

Ask the owner to:
- Add `sunniedesigns.com` as a Domain property in Google Search Console. DNS verification is one click, since Cloudflare hosts the DNS.
- Submit `https://sunniedesigns.com/sitemap-index.xml`.
- Confirm Web Analytics shows visits.

- [ ] **Step 5: Final automated gate**

Run: `npm run verify && npm run links`
Expected: all PASS, and `No broken links.`

- [ ] **Step 6: Commit the report**

```bash
git add docs/launch-report.md
git commit -m "docs: record launch QA results

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push
```

---

## Owner inputs (collected during execution; none block the build)

| Item | Needed by | Fallback until then |
|---|---|---|
| Photo of Hui's hands at work | Task 10/11 | Tassel bag photo 2 |
| Confirm wool content on flagged listings | Task 13 | Materials left as on Etsy |
| Review Our story, Care and Privacy copy | Task 11 | Ship as written |
| `hello@` and `hui@` mailboxes working | Launch | Addresses show but bounce |
| Cloudflare dashboard steps in `docs/deploy.md` | Task 15 | — |
| Search Console verification | Task 16 | — |
| Etsy listing links, if Etsy blocks the shop page | Task 12 | — |
| Instagram / Pinterest links for the footer | After launch | Footer links Etsy only |
