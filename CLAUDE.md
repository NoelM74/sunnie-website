# Sunnie Designs (sunniedesigns.com)

Astro static site with the Cloudflare adapter on Workers. The bag and checkout are server-rendered (`/bag/*`, `/checkout/*`), payments go through PayPal Orders v2, orders are stored in D1 `sunnie-orders`, and emails are sent with Resend. The owner sends product and copy updates in chat; Claude edits, tests and pushes.

## Compact instructions

When summarising this conversation, keep these and drop the rest:

- **Live state:** the live Worker version id, the current `main` commit, and what is deployed compared with what is only committed. Include anything half-done: uncommitted files, an un-deployed version, a running background agent and its id.
- **Owner decisions and facts, verbatim:** prices and option prices, shipping rules, returns, legal and VAT position, product facts (materials, sizes), and copy approvals. Never paraphrase a number or a policy.
- **Open asks:** questions waiting on the owner, steps the owner must do themselves, and exactly what was asked.
- **Blocked or denied actions:** what auto mode refused and why (for example writing secrets, bulk DB deletes, force-push), so they are not retried.
- **Errors and their fixes:** the error text, root cause and fix, so the same dead end is not repeated.
- **Hard rules:** never commit `brand/`, `.superpowers/`, `.playwright-mcp/`, `.dev.vars`, `.wrangler/`, `graphify-out/` or `shop_settings.json`; never log secrets or PII; secrets go in only with `wrangler versions secret bulk` from a file under `%TEMP%`; no invented claims in copy; kill only process ids Claude started.

Drop: full file contents, long tool output, test logs that passed, and the step-by-step narration of finished work. Point to file paths and commit hashes instead.

## Prices in euro, pounds and dollars

Prices are set in euro in the product files. Pound and dollar prices are worked out at build time from the ECB rate in `src/data/rates.json` (`src/lib/currency.ts`: rounded up to the next .95; free-shipping threshold rounded up to a whole number). `npm run build` runs `scripts/fetch-rates.mjs` first, so every build uses the latest ECB rate, and the pages and the checkout in one build always agree. The buyer's currency is the `sunnie_cur` cookie (set by the header switch, or guessed from the time zone), else Cloudflare's country header. PayPal is charged in that currency. `.github/workflows/daily-rates.yml` rebuilds and deploys each weekday at 16:00 UTC when the rate changed (needs the CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID repo secrets). Product structured data stays in euro.
