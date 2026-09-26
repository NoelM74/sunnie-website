# Sunnie Designs Phase 2: bag and PayPal checkout (design spec)

Date: 2026-09-26. Builds on the Phase 1 storefront (`2026-09-25-sunnie-storefront-design.md`), which is live at sunniedesigns.com.

## 1. Goal and scope

Let buyers buy directly on sunniedesigns.com with PayPal or a card through PayPal, while keeping the Etsy shop running in parallel.

**In scope**
- the bag (cart)
- checkout and payment (PayPal)
- shipping pricing
- the order record
- the customer and shop emails
- the terms of sale page
- updates to shipping, privacy, contact and footer
- products that aren't on Etsy
- the copy changes the new checkout needs

**Out of scope (possible later phases)**
- stock counting and Etsy sync
- discount codes
- customer accounts
- multi-currency
- per-product reviews
- newsletter
- an admin orders UI

## 2. Business rules (owner decisions)

| Rule | Value |
|---|---|
| Seller | **Springfield Tectop Limited** trading as **Sunnie Designs**, CRO **571256**, registered office **Clareview Car Sales, Ennis Road, Co. Limerick, V94 EA3A**, email `hello@sunniedesigns.com` |
| VAT | Not VAT-registered. Prices are final and no VAT line is shown. |
| Currency | EUR only |
| Shipping | €5.00 flat, worldwide. Free when the item subtotal is **€49.00 or more**. |
| Dispatch | Made to order. Ships within 3–5 days with tracking. |
| Stock | Not counted. Every in-stock product can be bought in any quantity from 1 to 5 per line. `inStock: false` blocks adding the product to the bag. |
| Returns | Within **30 days of delivery**. Buyer pays return postage. We refund the item price plus the original standard shipping within 14 days of receiving the item back. Faulty or wrong items: we cover the cost. |
| Custom orders | None. Standard designs only, so the right of withdrawal always applies. |
| Etsy | Stays live. Product pages keep a secondary "Also available on Etsy" link where `etsyUrl` exists. |

## 3. Buyer experience

### Product page
- **Option choice:** when the product has `options`, each option renders as a radio group (large targets, 48 px or more). A choice is required.
- **Quantity select:** 1–5.
- **Primary button:** **"Add to bag"**. It's a `<form method="post" action="/bag/add/">` and needs no JS.
- **Under the button:** "Free worldwide shipping on orders over €49 · 30-day returns".
- **Etsy link:** a secondary "Also available on Etsy" link when `etsyUrl` is set.
- **Sold out:** unchanged, a non-interactive "Sold out" state.

### Header
Add a **"Bag"** link to `/bag/`, on desktop and mobile. It shows no count, because the pages are static. Adding an item redirects the buyer to `/bag/`.

### `/bag/` (server-rendered)
- **Each line:** thumbnail, name, chosen option, unit price, a quantity select with an "Update" button, and "Remove". Updating and removing are POST forms.
- **Totals:** subtotal, shipping line (`€5.00` or `Free`) and total.
- **Free-shipping nudge:** under €49 the page says "Add €X more for free shipping" and shows the 4 featured products as a small grid.
- **Actions:** "Checkout" (primary) and "Continue shopping".
- **Empty bag:** a friendly empty state with links to the shop.
- **Changed items:** any line dropped because the product was removed or marked sold out shows a notice.

### `/checkout/` (server-rendered)
- **Form:** email, full name, address line 1, address line 2 (optional), city, county/state/region, postcode, country (select, ISO-2, default IE).
- **Order summary:** the items and totals.
- **Terms:** "By paying you agree to our [terms of sale](/terms/)", plus a line with the returns summary.
- **Pay button:** **"Pay with PayPal or card"**, a POST form.
- **Validation errors:** the page re-renders with inline messages and keeps the entered values.

### PayPal
The buyer approves the payment on PayPal's hosted page (PayPal account or guest card). Cancelling returns them to `/bag/` with a notice, and the bag is unchanged.

### `/checkout/complete/` (server-rendered)
- **Content:** "Thank you", the order reference (`SUN-` plus 6 base36 characters, uppercase), the items, the total, the delivery address, "Ships within 3–5 days with tracking" and a link to the terms.
- **Bag:** cleared.

### Emails
- **Customer confirmation:** reference, items, totals, shipping address, dispatch promise, returns summary, company details footer.
- **Shop notification** (to the orders inbox, `hello@`):
  - buyer name and email
  - address
  - a **making list** (quantity × name — option)
  - totals
  - the PayPal order and capture IDs

### Site-wide copy
- Trust bar: add "Free shipping over €49".
- Homepage FAQ "Where do I buy": buy here with PayPal or card, or on Etsy.
- Replace the "Buy on Etsy" wording everywhere with the new buy box.
- `llms.txt` key facts: mention direct checkout, the shipping rule and returns.

## 4. Architecture

- **Rendering:** Astro stays in `output: 'static'` with the `@astrojs/cloudflare` adapter. Every existing page stays prerendered. These routes set `export const prerender = false`: `/bag/`, `/bag/add/`, `/bag/update/`, `/bag/remove/`, `/checkout/`, `/checkout/pay/`, `/checkout/return/`, `/checkout/cancel/` and `/checkout/complete/`.
- **Worker:** one Worker (`sunnie-website`) serves the static assets and the dynamic routes. Workers Builds (build `npm run build`, deploy `npx wrangler deploy`) is unchanged apart from the new `wrangler.jsonc` fields: `main`, `assets.binding` and the D1 binding.

### Modules

Each module has one responsibility and gets unit tests.

| Module | Responsibility |
|---|---|
| `src/lib/pricing.ts` | `SHIPPING_FLAT_CENTS = 500`, `FREE_SHIPPING_THRESHOLD_CENTS = 4900`. `priceBag(lines, catalog) → {lines, subtotalCents, shippingCents, totalCents, dropped}`. Integer cents throughout. |
| `src/lib/bag.ts` | Bag line type `{slug, option?: string, qty: 1–5}`, at most 20 lines, merging duplicate slug+option. `encodeBag` / `decodeBag` as signed cookie values (HMAC-SHA256 via Web Crypto with secret `BAG_SECRET`). A tampered or invalid cookie decodes to an empty bag. |
| `src/lib/catalog.ts` | Builds the server-side catalogue from the `products` collection: `{slug → {name, priceCents, inStock, options, image, maker}}`. Validates each option against the product's allowed values. |
| `src/lib/checkout-form.ts` | Parses and validates checkout form data. Returns `{ok, values, errors}`. Countries come from a fixed ISO-2 list. |
| `src/lib/paypal.ts` | Token fetch, `createOrder(priced, address, email, ref, urls)`, `captureOrder(id)`. The environment comes from `PAYPAL_ENV` (`sandbox` or `live`). The order carries an itemised `items[]` with an `amount.breakdown` (item_total, shipping), `shipping_preference: SET_PROVIDED_ADDRESS`, `user_action: PAY_NOW`, `return_url`, `cancel_url` and `custom_id` set to the order ref. |
| `src/lib/orders.ts` | D1 access. `insertPending`, `markPaid`, `findByPaypalId`, `findByRef`. |
| `src/lib/email.ts` | Builds the customer and shop emails (HTML and text) and sends them through the Resend API. It never throws into the payment flow; failures are logged and recorded on the order row. |

### Payment flow

1. **`POST /checkout/pay/`**
   - Decode and price the bag. If it's empty, redirect to `/bag/`.
   - Validate the form. If it's invalid, re-render `/checkout/` with errors.
   - Generate the reference and insert a `pending` order in D1 with the priced snapshot.
   - Create the PayPal order, store its `paypal_order_id`, and redirect (303) to PayPal's `payer-action`/`approve` link.
2. **`GET /checkout/return/?token=<paypal_order_id>`**
   - Look up the order. If it's already `paid`, redirect to complete.
   - Otherwise capture. On `COMPLETED`: `markPaid` (capture ID, payer email), send the emails, clear the bag cookie, set a short-lived signed `last_order` cookie (the ref), and redirect to `/checkout/complete/`.
   - If the capture fails, show a friendly error page, keep the bag, and leave the order `pending`.
   - If the capture response says the order is already captured, treat it as paid.
3. **`GET /checkout/cancel/`:** redirect to `/bag/?cancelled=1`.
4. **`/checkout/complete/`:** reads `last_order`, loads the order by ref and renders it. Without a valid cookie, it shows a generic thank-you with no personal details.

### Data (D1 `orders` table)

- **Columns:**
  - `id` (integer primary key)
  - `ref` (text, unique)
  - `status` (`pending` | `paid`)
  - `paypal_order_id` (text, unique)
  - `capture_id`
  - `email`, `name`
  - `address_json`, `items_json`
  - `subtotal_cents`, `shipping_cents`, `total_cents`
  - `currency`
  - `created_at`, `paid_at`
  - `customer_emailed`, `shop_emailed` (0/1)
  - `email_error` (text)
- **Migrations:** kept in `migrations/`.
- **Retention:** 6 years (Irish revenue record-keeping). No automatic deletion in this phase.

### Secrets

Set in Cloudflare with `wrangler secret`, never committed: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV`, `RESEND_API_KEY`, `BAG_SECRET`, `ORDER_NOTIFY_EMAIL` (default `hello@sunniedesigns.com`), `ORDER_FROM_EMAIL` (`Sunnie Designs <orders@sunniedesigns.com>`).

### Security

- Prices and shipping are computed only on the server.
- The bag cookie is signed, `HttpOnly`, `Secure` and `SameSite=Lax`, with a 30-day max age.
- All POST routes check that the `Origin` header matches the site origin (CSRF protection).
- All input is length-limited and escaped in emails and HTML.
- No card data ever touches the site.

## 5. Content and legal

- **New `/terms/` page (terms of sale):** seller identity (§2), prices and VAT status, payment, contract formation on successful payment, delivery, returns, the right to cancel with the EU model withdrawal form, faulty goods and statutory rights, complaints to `hello@`, governing law (Ireland). The footer and checkout link to it. It's noted for owner or solicitor review before live launch.
- **`/shipping/`:** covers site orders (the €5 / free-over-€49 rule and dispatch), returns (30 days) and Etsy orders.
- **`/privacy/`:**
  - adds the order data (name, email, address, items)
  - adds the processors: PayPal (payment), Resend (email) and Cloudflare (hosting and database)
  - adds the 6-year retention period
  - adds the strictly necessary cookies: the bag cookie and the order-confirmation cookie. There are still no tracking cookies, so no consent banner is needed.
- **`/contact/` and footer:** company line with name, CRO number and registered office.
- **Products:** `etsyUrl` becomes optional in the schema, so products that aren't on Etsy can be sold.
- **Privacy test:** remove "Springfield" from the hashed private-token list. It's now the public company name. The home-address tokens, phone, Eircode and bank stay protected.

## 6. Testing

- **Unit (Vitest):**
  - pricing at the boundaries: €48.99 is charged shipping; €49.00 and €49.01 ship free
  - bag encode/decode, including tamper, expiry, over-limit and merge cases
  - checkout-form validation
  - catalog option validation
  - email builders: escaping and content
  - PayPal payload builder: the totals and breakdown match the priced bag
- **Dist tests:**
  - static pages still contain no client JS
  - product pages render the add-to-bag form with option radios
  - `/terms/` contains the company name, CRO and registered office
  - the footer contains the company line
- **Route tests:** run the dynamic routes against a local Wrangler/Miniflare dev server with D1 and a mocked PayPal API (fetch interception). They cover add, update and remove, pay-redirect, return (success, duplicate and failure), and cancel.
- **End-to-end:** a PayPal **Sandbox** purchase on a Workers preview URL, checking the order row, both emails and the complete page. The owner then does one sandbox purchase. Only after that are the `live` credentials set.

## 7. Owner inputs needed during the build

1. A PayPal Business account and a live REST app (client ID and secret). Claude supplies step-by-step instructions and uses sandbox credentials first.
2. A Resend account, with its domain DNS records (SPF/DKIM for `sunniedesigns.com`) added in Cloudflare.
3. Solicitor or accountant review of `/terms/` before switching PayPal to live (recommended).
