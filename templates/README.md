# Templates

The files every new client site starts from. Replace `example.com`, `example-site` and
`example.your-agency.com` with the real values.

| File | Goes to | What it does |
|---|---|---|
| `worker.js` | the client folder | 301s every host except the canonical domain (www, the agency preview host, workers.dev) to the same path and query on the domain; serves the static assets otherwise |
| `wrangler.jsonc` | the client folder | Cloudflare Worker with static assets: `SITE/` as the assets directory, `auto-trailing-slash`, a real `404-page`, the three routes. Includes the placeholder variant in a comment |
| `_headers` | written by the generator into `SITE/` | security headers, noindex on every host until launch and then only on preview hosts, a year of immutable cache on versioned assets |
| `generator_constants.py` | the top of the site's generator | the constants the toolkit reads without running the generator: domain, `INDEXABLE`, `LASTMOD`, tracking IDs, host guard, IndexNow key, share card, what the toolkit cannot detect |
| `robots.noindex-mode.txt` / `robots.indexable-mode.txt` | written by the generator into `SITE/robots.txt` | the two shapes robots.txt takes, with legal paths disallowed in every group |

Why each line exists is in [`docs/11-deploy-hosting-domains-email.md`](../docs/11-deploy-hosting-domains-email.md)
and [`docs/08-seo.md`](../docs/08-seo.md).
