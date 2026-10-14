# 16 · Tools, and what they cost

We run on free tiers wherever a free tier is honest. Before adding anything, check which of three cost models it
belongs to: a runtime library costs **kilobytes** on every visit, an AI agent skill costs **tokens** when you use it,
and a generation service costs **money on every build**. "Free and open source" can hide any of the three.

## Building

| Job | What we use | Cost |
|---|---|---|
| Writing the sites | one Python generator per site (plain HTML, CSS and JS out, no framework) | free |
| Building and QA work | AI coding sessions (Claude Code) following the procedure in this repo | subscription |
| Design sheets and graphic pieces | Claude Design (a design canvas inside Claude) | subscription |
| Bundling, minifying | esbuild | free |
| Effects | React Bits (free tier), compiled on Preact; GSAP when a scrub is needed | free |
| Component and look references | 21st.dev (free tier: browse everything, two copies a day), Godly, Awwwards, the galleries in [03-structure.md](03-structure.md) | free |
| Fonts | Google Fonts and Fontshare, always self-hosted; fontTools to subset, compute fallback metrics and check glyphs | free |
| Images | Pillow (WebP at three widths, EXIF/GPS stripped), a per-photo framing script | free |
| Icons and favicons | RealFaviconGenerator | free |
| Palettes, textures | Coolors, Texturelabs | free |
| Finding a better copy of a client's image | Yandex reverse image search | free |
| Forms | Tally (free plan caps uploads, so files go by WhatsApp) | free |

## Hosting and delivery

| Job | What we use | Cost |
|---|---|---|
| Hosting and CDN | Cloudflare Workers static assets, and Pages | free |
| DNS, redirects, edge cache, WAF rules | Cloudflare (Free plan: purge by URL, 30 per call) | free |
| Video files | Cloudflare R2 behind a custom domain (answers `Range` with 206) | free at our volume |
| Domains | the national registry for `.com.py`; Cloudflare Registrar for a `.com` at cost | registry fees |
| Email | Zoho Mail, with SPF, DKIM and DMARC on Cloudflare | per seat |
| Deploy from the terminal | `npx wrangler@4` | free |

## Measuring

| Job | What we use | Cost |
|---|---|---|
| Analytics | Google Analytics 4, a property per site created by script | free |
| Heatmaps and session replay | Microsoft Clarity | free, with a low rate limit on its data export API |
| Index and coverage | Google Search Console (URL Inspection and sitemaps by API) | free |
| Bing and friends | IndexNow | free |
| Performance | Lighthouse installed locally, three runs, median | free |
| Rendering and probes | headless Chromium (Edge, Chrome or Brave) driven over the DevTools protocol | free |
| Uptime | HetrixTools, keyword monitoring every minute from four locations | free tier, which permits commercial use; the best-known alternative's free tier does not. **Log in at least every 90 days or the account deactivates and monitoring stops silently** |
| Local rank and SERP data | DataForSEO: Maps and organic results from given coordinates, business profile data, SERP screenshots | pay per call, fractions of a cent; **one task per request** (a batch runs only the first task and silently drops the rest) |
| Profile categories per country | PlePer's public category list | free |
| Registrar and DNS forensics | RDAP, crt.sh, direct queries to authoritative nameservers | free |
| Schema checks | the public validators, and an offline vocabulary check when they start serving captchas | free |
| Edge analytics alternative | Cloudflare Zaraz, to move tags off the page | free up to 1,000,000 events a month |

## Notes

- **For local results outside the US, general web search APIs are not usable.** English-language tools default to US
  results, and querying Google from a script gets a captcha. A SERP API with an explicit location parameter is the only
  reliable way to know what a search returns in a given city.
- **PageSpeed Insights without an API key** answers 429 almost every time when automated. Run Lighthouse locally.
- **HetrixTools API:** the newer API version reads, the older one writes (creating and editing monitors goes through the
  old endpoint with the key in the path); Python's default User-Agent gets a 403 (send a curl-like one); the monitoring
  locations are an object of booleans, not an array, and the error for the wrong shape misleadingly says "select at least
  3 monitoring locations"; contact lists can only be edited in the panel.
- **Monthly uptime from HetrixTools:** its report endpoint ignores date parameters (the free plan returns the last seven
  days), so compute a month's uptime from each downtime record's overlap with the month, clipped to the monitor's creation
  date.
- **Clarity's project ID and its data-export token are different things.** The tag needs the first; reading numbers by
  API needs the second, which has a low daily limit, so archive the numbers daily.
- **Instagram scraping tools** that worked in mid-2026 stopped working (401 without login). What still works without
  logging in: the public profile meta with a bot user agent, the logged-out grid in a real browser, and
  `instagram.com/p/<code>/media/?size=l` for one image by its code.
- Every tool here was chosen so the agency keeps working if one account disappears: the sites are static files, the
  generators are ours, and nothing on a client site depends on a service we do not control, except analytics.
