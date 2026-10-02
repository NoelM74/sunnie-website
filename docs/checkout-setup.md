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

<!-- Left empty for the controller to fill in during the sandbox run. -->

| Step | Date | Result | Notes |
| --- | --- | --- | --- |
|  |  |  |  |
