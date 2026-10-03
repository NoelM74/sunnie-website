# Checkout setup

One-off owner steps to switch on checkout on sunniedesigns.com. Deploy settings are in [deploy.md](./deploy.md).

## Steps

1. **D1 database.**
   - Run `npx wrangler login`, then `npx wrangler d1 create sunnie-orders`.
   - Send Claude the printed `database_id`. Claude commits it to `wrangler.jsonc`.
   - Then run `npx wrangler d1 migrations apply sunnie-orders --remote` once by hand, so preview versions have the `orders` table.
   - The real `database_id` must be committed **before** the first push of the branch. Otherwise the preview upload fails.
2. **Deploy command.** In Cloudflare → Workers & Pages → sunnie-website → Settings → Builds, set the deploy command to `npx wrangler d1 migrations apply sunnie-orders --remote && npx wrangler deploy`. Leave the non-production branch command as `npx wrangler versions upload`.
3. **PayPal sandbox.**
   - Log in at developer.paypal.com with the PayPal Business login. Under Apps & Credentials → Sandbox, open "Default Application" and copy the Client ID and Secret.
   - Under Sandbox → Accounts, note the personal (buyer) test account email and password.
4. **Resend (order emails).**
   - Create an account and add the domain `sunniedesigns.com`.
   - Add the DNS records Resend shows in Cloudflare DNS for `sunniedesigns.com` (SPF and DKIM TXT records, and MX on the `send` subdomain). Wait for the status to show "Verified".
   - Create an API key.
5. **Secrets.** In Cloudflare → sunnie-website → Settings → Variables and Secrets, add these as type **Secret**:
   - `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` (the sandbox values for now)
   - `PAYPAL_ENV` = `sandbox`
   - `RESEND_API_KEY`
   - `BAG_SECRET`: a long random string, at least 32 characters. Generate it with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
   - `ORDER_NOTIFY_EMAIL` = `hello@sunniedesigns.com`
   - `ORDER_FROM_EMAIL` = `Sunnie Designs <orders@sunniedesigns.com>`

   **How to enter them (learned 2026-10-03):**
   - While production is still the static-only Phase 1 Worker, the dashboard refuses variables ("cannot be added to a Worker that only has static assets"). Upload a code version first (
╭──────────────────────────────────────────╮
│ Did you mean "wrangler versions upload"? │
╰──────────────────────────────────────────╯

wrangler versions

🫧 List, view, upload and deploy Versions of your Worker to Cloudflare

COMMANDS
  wrangler versions view <version-id>         View the details of a specific version of your Worker
  wrangler versions list                      List the 10 most recent Versions of your Worker
  wrangler versions upload [path]             Uploads your Worker code and config as a new Version
  wrangler versions deploy [version-specs..]  Safely roll out new Versions of your Worker by splitting traffic between multiple Versions
  wrangler versions secret                    Generate a secret that can be referenced in a Worker

GLOBAL FLAGS
  -c, --config          Path to Wrangler configuration file  [string]
      --cwd             Run as if Wrangler was started in the specified directory instead of the current working directory  [string]
  -e, --env             Environment to use for operations, and for selecting .env and .dev.vars files  [string]
      --env-file        Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files  [array]
  -h, --help            Show help  [boolean]
      --install-skills  Install Cloudflare skills for detected AI coding agents before running the command  [boolean] [default: false]
      --profile         Use a specific auth profile  [string]
  -v, --version         Show version number  [boolean]), then add secrets with . Each secret change creates a new preview version that inherits the code and the other secrets.
   - Don't paste values into the hidden wrangler secret

🤫 Generate a secret that can be referenced in a Worker

COMMANDS
  wrangler secret put <key>     Create or update a secret for a Worker
  wrangler secret delete <key>  Delete a secret from a Worker
  wrangler secret list          List all secrets for a Worker
  wrangler secret bulk [file]   Upload multiple secrets for a Worker at once

GLOBAL FLAGS
  -c, --config    Path to Wrangler configuration file  [string]
      --cwd       Run as if Wrangler was started in the specified directory instead of the current working directory  [string]
  -e, --env       Environment to use for operations, and for selecting .env and .dev.vars files  [string]
      --env-file  Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files  [array]
  -h, --help      Show help  [boolean]
  -v, --version   Show version number  [boolean] prompt in PowerShell: pastes arrived truncated (BAG_SECRET too short, PayPal 401 AUTH_FAILED, Resend 422). Put  lines in a file under  (quote values with spaces), check names and lengths, run , then delete the file.
   - If a key is wrong, bag and checkout pages return 503 with an  header naming the key (never its value). A failed PayPal create is saved on the unpaid order as .

   The site refuses to run checkout if `PAYPAL_ENV` is not `sandbox` or `live`, `BAG_SECRET` is shorter than 32 characters, or the database binding is missing.
6. **PayPal guest checkout.** In the live PayPal Business account settings, check that "PayPal account optional" (guest checkout) is on, so buyers can pay by card without a PayPal account.

## Sandbox end-to-end test

Claude runs this on the preview URL (Cloudflare → Deployments → the version → Preview URL).

1. Add the frog in Pink and a coaster. Check the bag shows €5 shipping and the free-shipping nudge.
2. Add another piece to pass €49. Check shipping shows Free.
3. Check out with a test address. Check PayPal sandbox opens and you can log in with the sandbox buyer.
4. Pay. Check `/checkout/complete/` shows the order ref and the bag is empty.
5. Check the order row: `npx wrangler d1 execute sunnie-orders --remote --command "SELECT ref,status,paypal_env,total_cents,customer_emailed,shop_emailed,email_error FROM orders ORDER BY id DESC LIMIT 3"`. Expected: `paid`, `sandbox`, both emailed `1`.
6. Confirm both emails arrived (ask the owner to check `hello@`).
7. Reload the complete URL, and replay `/checkout/return/?token=<same>`. Check there is no second capture and no second email.
8. Cancel on PayPal. Check you are back at `/bag/` with the notice and the items intact.

The owner repeats items 1 to 4 on the preview URL, and has `/terms/` and `/privacy/` reviewed.

## Go live

1. Create a **Live** app in developer.paypal.com. Replace `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` with the live values, then set `PAYPAL_ENV` = `live`.
2. Merge `phase2-checkout` into `main` (fast-forward) and push. Workers Builds applies migrations and deploys.
3. Delete the sandbox test rows: `npx wrangler d1 execute sunnie-orders --remote --command "DELETE FROM orders WHERE paypal_env = 'sandbox'"`.
4. Place one real low-value order, for example a single coaster, and refund it from PayPal. That confirms live capture and both emails.

**Warning:** after go-live, every preview version shares the live PayPal secrets and the production database. Do not take test payments on preview URLs after launch.

## Sandbox test log

| Step | Date | Result | Notes |
| --- | --- | --- | --- |
| Bag, option price, shipping nudge | 2026-10-03 | Pass | Panda sling €26.95 + €5.00 = €31.95, "add €22.05 more" shown |
| PayPal create order | 2026-10-03 | Fail, then pass | 401 AUTH_FAILED from truncated pasted keys; re-entered via bulk file |
| Pay as sandbox buyer (SUN-LE2HVU) | 2026-10-03 | Pass | Order paid, capture id stored, complete page correct. Emails failed: Resend 422 (mangled ORDER_FROM_EMAIL) |
| Re-test emails (SUN-Y5NC0F) | 2026-10-03 | Pass | Paid; customer_emailed 1, shop_emailed 1, no email_error. Owner paid it as the buyer |
