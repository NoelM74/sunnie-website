# Deploy

Sunnie Designs is a static Astro site. It builds to `dist/` and deploys to Cloudflare Workers (not Pages) via Workers Builds.

## Cloudflare setup

1. **Workers & Pages → Create → Import a repository**, connect `NoelM74/sunnie-website`.
2. Name the Worker `sunnie-website` — it must match the `name` in `wrangler.jsonc`.
3. Build settings:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Non-production branch deploy command: `npx wrangler versions upload`
   - Root directory: leave empty
4. **Custom domains**: add `sunniedesigns.com` and `www.sunniedesigns.com`.
5. **Redirect rules**: add a 301 redirect from `www.sunniedesigns.com` to `sunniedesigns.com`, using the built-in "Redirect from WWW to root" template.
6. **Email Routing**: create `hello@sunniedesigns.com` and `hui@sunniedesigns.com`, forwarding both to the owner's inbox.
7. **Security → Bots → AI Crawl Control**: allow `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-User`, `PerplexityBot`, `Google-Extended` and `Applebot-Extended` — these are the crawlers that feed AI answer engines (ChatGPT, Perplexity, Google AI Overviews, Claude), and AI search visibility depends on them reaching the site and `/llms.txt`. Do not enable "Block AI bots".
8. **Analytics**: use the built-in dashboard analytics (server-side, no script). Do not enable Web Analytics — it injects a JS beacon, which breaks the "no scripts" claim on the privacy page.
9. First build can take up to about 15 minutes.
10. Confirm the sitemap (`/sitemap-index.xml`) and `/llms.txt` are reachable after each deploy.

## Manual fallback

If the dashboard build isn't available:

```
npx wrangler login
npm run deploy
```
