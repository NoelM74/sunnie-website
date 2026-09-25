# Sunnie Designs storefront — design spec (Phase 1)

Date: 2026-09-25
Domain: sunniedesigns.com (Cloudflare DNS)
Repo: github.com/NoelM74/sunnie-website (public)

## 1. Scope

The whole project is three sub-projects, built in order:

1. **Storefront (this spec).** Catalog site: every product has its own page with a "Buy on Etsy" button.
2. **Cart + PayPal checkout.** Replaces the Etsy buttons with add to cart. Separate spec. Also covers shipping rates, terms of sale, EU 14-day withdrawal right, order emails, stock sync with Etsy.
3. **Extras.** Newsletter, per-product reviews, gift cards. Separate spec.

Out of scope for Phase 1: cart, payments, newsletter signup, contact form backend, any login or admin UI.

## 2. Brand

- Name: **Sunnie Designs**. Etsy shop is SunnieDesignCo.
- People: Hui (maker, designer) and Nollaig (runs the shop). Maker line everywhere: **"Handmade by Hui"**. Never state a country of manufacture.
- Palette, type scale, button states, focus rings and component styles follow the "Morning Sun" spec supplied by the owner. Key tokens:
  - Linen `#FBF6EE` (page), Sand `#F3E7D3` (cards), Sand-hover `#EAD9BC`, Butter `#F0E2C4` (badges)
  - Umber `#4A3222` (body text), Umber-muted `#7A6855` (meta)
  - Terracotta `#B04A24` (headings, links, primary button on linen), hover `#96401E`, active `#7E3517`, deep `#9C3F1D` (any terracotta text on sand)
  - Olive `#8A9A5B` / Olive-deep `#6B6B1F`, Border `#E5D5B8` / Border-strong `#DCC9A6`
  - Fraunces 500 for headings (Hero 40 / H1 34 / H2 27 / H3 22 px), Atkinson Hyperlegible for body (19 / 18 / 16 px), body line length ≤ 65ch
  - 3px `#96401E` focus ring with 3px offset on every interactive element; 48px minimum input height; 150ms ease transitions
- Logo, drawn as SVG by us from the spec's description: umber "Sunnie" wordmark, "Designs" subtitle in umber-muted Fraunces italic, sun mark with 5–7 bold terracotta rays and a butter centre. Deliverables:
  - `logo-full.svg`, `logo-umber.svg`, `logo-terracotta.svg`
  - `favicon.svg` (sun only) + `favicon-32.png`, `apple-touch-icon.png` (180px)
  - `og-default.png` 1200×630
  - The owner may send an existing logo instead; if so we build these from it.

## 3. Pages and navigation

Header nav: **Bags · Coasters · Our story · Shop all**, with the logo on the left. Terracotta in the nav marks only the active page. Hats appears in the nav automatically once there are 4 or more in-stock hats.

| Page | URL | Content |
|---|---|---|
| Home | `/` | Sections below |
| Shop all | `/shop/` | Every product in a grid, in-stock first |
| Bags | `/shop/bags/` | Three headed groups on one page: Characters & animals, Flowers, Totes & shoulder bags |
| Coasters | `/shop/coasters/` | Grid |
| Hats | `/shop/hats/` | Grid (not in nav yet) |
| Product | `/products/<slug>/` | Gallery, name, price, options, description, materials, size, Buy on Etsy button, 4 related products from the same category/group |
| Our story | `/our-story/` | Hui and Nollaig, how pieces are made |
| Reviews | `/reviews/` | All Etsy reviews; German ones shown with an English translation underneath |
| Shipping & returns | `/shipping/` | Ships in 3–7 days; returns handled via Etsy while orders go through Etsy |
| Care guide | `/care/` | Washing and care for crochet pieces |
| Contact | `/contact/` | Email link only |
| Privacy | `/privacy/` | GDPR privacy notice (cookieless analytics, no tracking) |
| 404 | `/404.html` | Friendly not-found with links to shop and home |

### Homepage sections

1. Sticky header
2. Hero: headline "Made by hand. Made to keep.", one sentence, primary button "Shop bags", ghost link "Our story". Hero photo is the **Poodle crossbody bag**. This image is the LCP element.
3. Trust bar: "Ships in 3–7 days" · "★ 4.9 from Etsy buyers" · "Etsy Star Seller" · "Handmade by Hui"
4. Bestsellers, exactly four, no carousel, in this order:
   1. Frog phone crossbody, kawaii green character bag (Pink / Blue / Brown)
   2. Crochet sunflower drawstring backpack (Regular / Dark green)
   3. Crochet animal coasters: cat, pig, bear, set of 3
   4. Crochet crossbody phone bag with tassel (Off white / Khaki)
5. Story: hands-at-work photo and three sentences
6. Categories: tiles for Bags and Coasters. A Hats tile appears once there are 4+ hats.
7. Reviews: three quotes chosen for durability and gifting, e.g. hexfeather, Hannah, and noel francis
8. Newsletter: **omitted in Phase 1**
9. Footer on sand: page links, Etsy shop link, social links, © line

### Badges

- **New** (butter badge): Poodle crossbody bag at launch. Set per product.
- **Sold out**: shown when `inStock: false`. The Buy on Etsy button is then replaced by a disabled "Sold out" button and the product drops to the end of grids.

## 4. Product data

One Markdown file per product at `src/content/products/<slug>.md`, validated by an Astro content collection schema (Zod). A missing field or invalid value fails the build.

```yaml
name: string                 # short display name
seoTitle: string             # original Etsy title, used for <title>
category: bags | coasters | hats
group: characters | flowers | totes   # required when category is bags
price: number                # EUR
inStock: boolean
etsyUrl: url
options?: [{ name: string, values: string[] }]
materials: string[]
size?: string
images: [{ file: string, alt: string }]   # first image is the card and OG image
featured?: 1 | 2 | 3 | 4     # homepage bestseller slot
isNew?: boolean
```

The body is the product description as Markdown.

### Import from Etsy (one-off script, `scripts/import-etsy.mjs`)

- Source: `EtsyListingsDownload.csv` (51 listings) and `reviews.json`, copied into `data/etsy/`. **`shop_settings.json` must never be committed** because it contains a phone number, address and card/bank details. `.gitignore` lists it.
- For each row:
  - Generate a slug from a shortened name.
  - Copy price, quantity (`inStock = quantity > 0`), materials and variations into options.
  - Download IMAGE1–IMAGE10 and resize to 1600px JPEG masters under `src/assets/products/<slug>/`.
  - Write alt text from the product name plus view (front, side, worn).
  - Extract the size from the description where it's stated.
  - Assign category and group from title keywords, then review by hand.
- Descriptions: clean all 51 (strip keyword lists and emoji runs, keep paragraphs). Fully rewrite the five featured/new products so they aren't duplicates of the Etsy copy. Rewrite the rest a few at a time after launch.
- Materials wording: check every listing that says "wool" against what the piece actually contains. The only 3-star review was about this.
- Etsy listing URLs are not in the CSV. Collect them from the public shop page (etsy.com/shop/SunnieDesignCo) and match them by title. Fallback: the owner pastes them from Shop Manager.

Reviews go in `src/data/reviews.json`, adding an `en` translation field for German entries.

### Updating after launch

The owner describes changes in chat ("frog bag sold out", "new bunny bag, photos attached"). Claude edits the product files, commits and pushes. The live site updates on the next build.

## 5. Tech stack and build

- **Astro** (current stable), `output: 'static'`, TypeScript, no UI framework, no client JavaScript on any page.
- CSS: one token file (`src/styles/tokens.css`) plus component styles scoped in `.astro` files. No Tailwind, to keep the token system as written.
- Images: `astro:assets` `<Picture>` generates AVIF + WebP with a JPEG fallback. Widths: 400/600/800 for cards and 800/1200/1600 for the product main image. Explicit width and height on every image. The hero gets `fetchpriority="high"`; everything below the fold uses `loading="lazy"`.
- Gallery: a CSS-only main image plus thumbnails (anchor targets / scroll-snap), swipeable on mobile.
- Fonts: self-hosted via `@fontsource` (Fraunces variable, Atkinson Hyperlegible), latin + latin-ext subsets, `font-display: swap`, heading font preloaded.
- Sitemap via `@astrojs/sitemap`. `robots.txt` in `public/`.

## 6. Hosting and deploy

- Cloudflare Workers with static assets. `wrangler.jsonc` has `assets.directory = "./dist"`, `not_found_handling = "404-page"`, and no Worker script in Phase 1.
- Workers Builds is connected to the GitHub repo:
  - Push to `main` builds and deploys to production.
  - Other branches get preview URLs.
  - Build command: `npm run build`.
- Custom domains: `sunniedesigns.com` is primary, and `www.sunniedesigns.com` 301-redirects to it via a Cloudflare redirect rule.
- The first-time GitHub ↔ Cloudflare connection is done by the owner in the dashboard, following written steps, unless the Cloudflare connectors have been authorised for Claude by then.
- Analytics: Cloudflare Web Analytics, cookieless, so no consent banner.

## 7. SEO

- `<title>`:
  - Products: short product name + "handmade crochet | Sunnie Designs", ≤ 60 chars.
  - Other pages: hand-written.
- Meta description: hand-written or the first sentence of the product description, ≤ 155 chars.
- Canonical URL, Open Graph and Twitter card tags on every page. Product OG image is its first photo.
- JSON-LD:
  - Home: `Organization` + `WebSite`.
  - Products: `Product` with `offers` (price, `priceCurrency: EUR`, availability, URL of our product page) and `brand`.
  - Everywhere: `BreadcrumbList`.
- **No `AggregateRating` or `Review` markup.** The Etsy reviews are shop-level, not per product, and Google disallows marking them up on products.
- English only; no hreflang.

## 8. Accessibility

- Skip link, landmark regions, one H1 per page, logical heading order
- Alt text on every image, visible focus ring everywhere, keyboard-operable gallery
- Layout works at 200% zoom, collapsing to a single column; no horizontal scroll at 320px
- Colour pairs only as listed in the token spec; terracotta text on sand always uses `#9C3F1D`
- Links underlined; state never shown by colour alone

## 9. Launch checklist

- [ ] Lighthouse ≥ 95 in all four categories, mobile and desktop, on home, a category page and a product page
- [ ] Home total transfer < 800KB; LCP < 2.5s on a throttled mid-range mobile profile; CLS < 0.05
- [ ] Keyboard-only walkthrough of home → category → product → Etsy
- [ ] 200% zoom and 320px width checks
- [ ] Every Buy on Etsy link returns 200 and opens the matching listing
- [ ] No `shop_settings.json` or other private data in the repo
- [ ] Favicon, apple-touch icon and OG preview verified
- [ ] Search Console domain verified, sitemap submitted
- [ ] Web Analytics recording

## 10. Testing

- The build is the main test: schema validation catches bad product data.
- `scripts/check-links.mjs` checks every `etsyUrl` and internal link. Run before launch and on demand.
- Lighthouse CI run locally before launch.
