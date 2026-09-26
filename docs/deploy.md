# Deploy

Sunnie Designs is a static Astro site. It builds to `dist/` and deploys to Cloudflare.

## Cloudflare setup

1. Connect the repository in the Cloudflare dashboard (Workers & Pages → Create → Pages → connect to Git), branch `main`, build command `npm run build`, output directory `dist`.
2. Set the production domain (`sunniedesigns.com`) under Custom domains.
3. Turn on Cloudflare Web Analytics (no cookies, matches the privacy page).
4. Check **Security → Bots → AI Crawl Control**. Cloudflare can block AI crawlers by default. Make sure `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-User`, `PerplexityBot`, `Google-Extended` and `Applebot-Extended` are allowed to reach the site — these are the crawlers that feed AI answer engines (ChatGPT, Perplexity, Google AI Overviews, Claude) and AI search visibility depends on them being able to fetch pages and `/llms.txt`. Do not enable "Block AI bots".
5. Confirm the sitemap (`/sitemap-index.xml`) and `/llms.txt` are reachable after each deploy.
