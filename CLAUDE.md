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
