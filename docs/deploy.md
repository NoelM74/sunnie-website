# Deploy

Sunnie Designs is an Astro site using the Cloudflare adapter. It deploys to Cloudflare Workers (not Pages) via Workers Builds.

- Static pages and assets are built to `dist/client`, and Cloudflare serves them directly.
- The Worker (`dist/server`) handles the on-demand routes only: `/bag/*` and `/checkout/*` (see `run_worker_first` in `wrangler.jsonc`).
- Orders are stored in a D1 database, `sunnie-orders` (binding `ORDERS`). Migrations live in `migrations/`.

Checkout needs one-off owner setup (D1, PayPal, Resend, secrets). Follow [checkout-setup.md](./checkout-setup.md) first.

## Cloudflare setup

1. **Workers & Pages → Create → Import a repository**, connect `NoelM74/sunnie-website`.
2. Name the Worker `sunnie-website`. It must match the `name` in `wrangler.jsonc`.
3. Build settings:
   - Build command: `npm run build`
   - Deploy command (production): `npx wrangler d1 migrations apply sunnie-orders --remote && npx wrangler deploy`
   - Non-production branch deploy command: `npx wrangler versions upload`
   - Root directory: leave empty
4. **Variables and Secrets**: add every checkout value as type **Secret**, not plain text. The list is in [checkout-setup.md](./checkout-setup.md). `wrangler.jsonc` sets `keep_vars: true`, so a deploy never wipes values set in the dashboard.
5. **Custom domains**: add `sunniedesigns.com` and `www.sunniedesigns.com`.
6. **Redirect rules**: add a 301 redirect from `www.sunniedesigns.com` to `sunniedesigns.com`, using the built-in "Redirect from WWW to root" template.
7. **Email Routing**: create `hello@sunniedesigns.com` and `hui@sunniedesigns.com`, forwarding both to the owner's inbox.
8. **Security → Bots → AI Crawl Control**: allow `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-User`, `PerplexityBot`, `Google-Extended` and `Applebot-Extended`. These crawlers feed AI answer engines (ChatGPT, Perplexity, Google AI Overviews, Claude), and AI search visibility depends on them reaching the site and `/llms.txt`. Do not enable "Block AI bots".
9. **Analytics**: use the built-in dashboard analytics (server-side, no script). Do not enable Web Analytics: it injects a JS beacon, which breaks the "no scripts" claim on the privacy page.
10. First build can take up to about 15 minutes.
11. Confirm the sitemap (`/sitemap-index.xml`) and `/llms.txt` are reachable after each deploy.

## Things to know

- The real `database_id` in `wrangler.jsonc` must be committed before the first push of a branch. Otherwise the preview upload fails.
- After go-live, every preview version shares the live PayPal secrets and the production database. Do not take test payments on preview URLs after launch.
- Unpaid orders older than 90 days are deleted automatically, whenever a payment completes.

## Manual fallback

If the dashboard build isn't available:

```
npx wrangler login
npx wrangler d1 migrations apply sunnie-orders --remote
npm run deploy
```
