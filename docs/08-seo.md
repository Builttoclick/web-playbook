# 08 · Technical SEO and indexing

What every page and every site carries, how a site goes from invisible to indexed, and the facts about Google
that cost us time to learn. Local map results and the Google Business Profile are in
[09-local-seo.md](09-local-seo.md).

---

## The launch model: noindex on the real domain until the word is given

A client site goes live on its **real domain from the first deploy, in noindex mode**, so the client and the
agency can share the link safely while Google ignores it. Only the agency owner says "index it". On that word
the generator flips `INDEXABLE = True`, and the launch command does the rest. The toolkit never flips it on its own.

| | Noindex mode (building, review) | Indexable mode (after the go) |
|---|---|---|
| Robots meta on pages | `noindex, nofollow` everywhere | `index, follow`, except the 404 and legal pages |
| `X-Robots-Tag` header | `noindex` on every host | detached for the canonical domain only (`! X-Robots-Tag`), kept on every preview host |
| `robots.txt` | `Allow: /`, legal paths disallowed, **no Sitemap line** | the same plus the `Sitemap:` line |
| `sitemap.xml` | not generated | only indexable pages, each with `<lastmod>` |
| Preview hosts (agency subdomain, `*.pages.dev`, `*.workers.dev`) | noindex | **301 to the domain** (or noindex forever) |

Why the page stays crawlable in noindex mode: **Google only obeys a noindex it can read.** A `Disallow` hides the
noindex itself.

The templates for all of this are in [`templates/`](../templates/).

---

## Every page

| | Rule |
|---|---|
| Title | unique, 60 characters or fewer (62 hard max), the service and the city where it applies |
| Meta description | unique, 158 characters or fewer, never empty |
| H1 | exactly one, and it is the first heading. On the home and service pages: what they sell + the USP, as a statement, never a price; buyer questions go in H2s |
| Headings | in order, no jumps, **footer included** (no h2 → h4) |
| Canonical | the final URL: https, apex (or www, one only), the site's trailing-slash rule. **Never a URL that redirects**: that is a broken signal |
| Language and basics | `<html lang>` with region where it matters (`es-PY`; `en` on English pages), viewport, charset, theme-color |
| Social card | the full Open Graph + Twitter block; `og:image` absolute, JPG or PNG, 1200x630, **never WebP** (WhatsApp and Facebook do not render it), one card per page, regenerated when the H1, phone or address changes, with a new file name (scrapers cache by URL) |
| Breadcrumbs | visible on every page that is not the home, plus `BreadcrumbList` with the same names |
| Structured data | JSON-LD that parses and fits the page; `FAQPage` only mirrors questions visible on the page; no `Product` or `Offer` without a real price |
| Images | descriptive alt text (not keyword stuffing), width and height declared |
| Links | every internal link resolves; `target=_blank` carries `rel=noopener`; **at least two internal links point to every page** |
| Copy | the house copy rules ([13-copy-and-content.md](13-copy-and-content.md)); no visible placeholder, "missing", lorem or "demo" text after launch |

## The whole site

- **A real 404**: status 404, branded, a way home and WhatsApp. **Unknown routes never answer 200 with the home.**
  (Cloudflare Pages does exactly that when no `404.html` exists; a Worker needs `not_found_handling: "404-page"`.)
- **`robots.txt` right for the mode**, with the legal paths disallowed in **every** user-agent group: a bot with its
  own group ignores the `*` group, so a site that welcomes AI crawlers by name must repeat the `Disallow` lines there.
- **`sitemap.xml` only when indexable**: only indexable pages, `<lastmod>` on each (the only freshness signal Google
  reads for recrawling, and many generators omit it), every `<loc>` returning 200 with redirects disabled.
- **Favicon set**: `favicon.ico` at the root, a 32 px PNG, an apple-touch-icon.
- **Headers**: `X-Content-Type-Options: nosniff`, a referrer policy, `immutable` only on content-hashed asset URLs.
- **`LocalBusiness`** (or its most specific subtype) with the same name, address and phone as the visible contact
  block and the Google profile, plus `geo`, opening hours and `sameAs` (profile and social links).
- **At least five FAQs**, written from what people really ask on WhatsApp. The visible markup and the `FAQPage`
  JSON-LD come from **one source**: maintaining 32 questions in two languages by hand guarantees drift, and a
  `FAQPage` that does not match the page is a manual action waiting to happen.
- **Legal pages** (privacy and terms) written for this client, `noindex`, out of the sitemap and out of `llms.txt`,
  disallowed in every robots group, linked from every footer.
- **Two languages:** `hreflang` cross-referenced, reciprocal, with `x-default`, and every target must exist. A page
  with no translation gets no `hreflang` at all (a template bug once printed `https://example.comNone`).

---

## Indexing: what we know for sure

### "The sitemap is healthy" and "the page is indexed" are different facts
Our own crawl returned 201 of 201 URLs OK across five client sites while Google still had dozens of them unindexed.
The crawl measures the site; only the index measures the index. An audit that reports the first and implies the
second is lying.

- The Search Console **URL Inspection API** gives the real per-URL state (`coverageState`, last crawl time).
- The **Indexing API does not apply to normal pages**: officially it covers job postings and livestream events,
  and using it for anything else is out of policy and ignored.
- **"Request indexing" is UI only**: a human presses it. We hand the agency owner ready links for the home and the
  three key pages.
- What you **can** automate: submitting the sitemap by API, and IndexNow (a key file at the root, a ping that
  answers 202) for Bing and the engines that share it.
- **Submit the sitemap after the purge**, never before: otherwise the crawler can fetch the old cached `robots.txt`
  or sitemap from the edge.

### "Discovered, currently not indexed" is almost always internal links
Not content quality, not crawl budget. Download every page in the sitemap, extract the hrefs, normalise them, and
count inbound links per URL. On one site the three city pages had exactly one inbound link each and all three were
unindexed, against 36 inbound links for the pages that were indexed. That is cheaper and more conclusive than
reading the coverage report. Watch the normalisation: filtering out links whose last path segment equals the
parent's hid a legitimately linked child page whose slug repeated its parent's, and reported a false orphan.

### Search Console gotchas
- **Its emails are a snapshot of an old crawl.** Two URLs flagged "excluded by noindex" had last-crawl times from
  the morning *before* the noindex came off. Compare `lastCrawlTime` with the date of your fix before touching
  anything. A page missing from Google after launch is usually just stale and needs "Request indexing".
- **Duplicate properties send duplicate emails.** Several sites had both a domain property and a URL-prefix
  property, one also a live `www` property with no sitemap while all `www` traffic 301s to the apex.
- **Different credentials see different properties.** A service account listed seven, the owner's OAuth token
  listed nine including the two we were looking for. Ask with the account that created the property.
- **A domain property can be created and verified without a browser** in four API calls: request a verification
  token, write the DNS TXT record, call verify (with retries: the first attempt usually fails, the second passes),
  add the site.
- **Google's notification emails go to the mailbox tied to the verifying account**, which may not be the inbox you
  watch. Search broadly by sender domain, not by one specific sender address, before saying nothing arrived.

### `noindex` hides in more places than the HTML
- **Check the HTTP header too.** `X-Robots-Tag` lives in the response headers (on Cloudflare, from the `_headers`
  file), invisible to a grep of the HTML. `curl -sI <url>`.
- **It survives in the edge cache after you remove it**, and so does a stale `robots.txt`. Purge, then re-check.
- **Cloudflare Pages adds `x-robots-tag: noindex` to branch preview deploys only**, not to production on a custom
  domain. Preview URLs are noindexed, not protected.

### A cross-domain canonical is not enough to hide a staging copy
We serve demos and mirrors on subdomains of our agency domain. One mirror of a live client site had a correct
canonical to the client's domain on every page, and Google indexed it anyway. **A canonical is a hint, not an
instruction.** The mirrors that stayed out used a real `X-Robots-Tag: noindex` or a robots meta. Rule: a copy of a
live site gets a real noindex or a 301 to the client's domain. Also: `site:yourdomain.com` includes every
subdomain, so its raw count is meaningless if you host demos.

### Legal pages: the gap in "never crawlable"
Our rule keeps legal pages away from every crawler, AI included (`Disallow` in every group plus noindex). The gap:
a legal URL that Google indexed **before** the `Disallow` stays indexed, because Google can no longer read the
noindex behind it. Check with URL Inspection, not by reading robots.txt. An indexed one leaves through Search
Console's Removals tool (a click, no API, about six months), never by lifting the `Disallow`. Re-inspect when the
removal expires.

### Schema facts
- **An `AggregateOffer` without `lowPrice` is reported as invalid, not incomplete**, and Google disables the whole
  feature. Price is what the rich result displays, so marking up a product with no price gains nothing anyway. **No
  real price, no product markup.** This applies to every "call for price" catalogue.
- **Schema markup does not cause "limited ads" in Google Ads.** Separate systems; a client had been told otherwise.
- Public validators can start serving captchas after a couple of runs. Never solve them: check the live JSON-LD
  against the schema.org vocabulary offline instead.

### Redirects
- **www → apex and http → https, both 301, keeping path and query.** On Cloudflare Pages, domain-level lines in
  `_redirects` are silently ignored: use a zone redirect rule, or a Worker that 301s every non-canonical host
  ([`templates/worker.js`](../templates/worker.js)).
- To audit a redirect you need the raw 301 without following it (in Python, a redirect handler that returns
  `None`), and your own User-Agent: Cloudflare answers the default `urllib` agent with 403 error 1010. Better: use
  `curl`, which was 0.6 s per request where `urllib` took 15 s on the same URL (a 37-page crawl became nine
  minutes).
- A new zone answers plain `http://` with 200 until "always use HTTPS" is switched on.
- When a site replaces an old one: back up the old site first, list its URLs that rank or are linked, and 301 each
  to its closest new page. URLs removed on purpose must answer 404 and be purged.

---

## Pages built for search, beyond the core site

- **Hub and spoke** (structure Spine 14): a short home that routes, deep subpages per service or zone. Our own site
  has generated pages per department of the country, guides, and a full English mirror under `/en/`: the copy lives
  in data files, the generator writes the pages, the sitemap and the cards follow on their own.
- **Authority pages** for a client: service pages and area pages of 1,000 to 2,500 words that are genuinely local
  and read human. A hub with three thin spokes is worse than one good page.
- **Phrase pages** for a personal brand: one page per exact phrase you want to own ("the most punctual web
  designer in ..."), with the phrase in the title, the H1, the URL and the meta description, 300 to 500 words of
  proof, a photo whose file name and alt carry the phrase, `Person` + `ProfilePage` + `FAQPage` schema, and
  interlinking: each page links three siblings and its hub, the hubs link every page in both languages, and every
  footer links the hub. Capture the "before" state of each search first.
- **Checking ranks:** use a SERP API with an explicit location (coordinates of the client's city); general search
  tools default to US results and scripted Google searches get a captcha. Never loop Google searches in an
  automation browser. In a small market the persuasive number is often **how many listings Google shows at all**,
  and **"no results" from a SERP API frequently means Google builds no local pack for that phrase for anybody**:
  report that honestly, never as "you do not appear". Prefer "you are position 32" over "you do not appear": it is
  verifiable on screen and lands just as hard.

---

## Checklist · SEO before launch

- [ ] Every page: unique title ≤ 60, unique description ≤ 158, one H1 first, no heading jumps (footer too).
- [ ] Every page: canonical = final https URL, never a redirect; `lang`, viewport, charset, theme-color.
- [ ] Every page: full OG + Twitter block, JPG/PNG 1200x630 card, one per page, new file name on change.
- [ ] Every page but the home: visible breadcrumbs + `BreadcrumbList` with the same names.
- [ ] JSON-LD parses; `FAQPage` mirrors visible questions; no `Product`/`Offer` without a real price.
- [ ] Alt text and dimensions on every image; every internal link resolves; `_blank` + `noopener`.
- [ ] Every page has at least two internal links pointing to it.
- [ ] Real 404 with status 404; unknown routes never 200.
- [ ] `robots.txt` right for the mode; legal paths disallowed in every group; Sitemap line only when indexable.
- [ ] `sitemap.xml` only indexable pages, `lastmod`, every `<loc>` 200 without redirects.
- [ ] `LocalBusiness` with the same NAP, geo, hours and `sameAs` as the visible contact and the profile.
- [ ] Five or more real FAQs from one source.
- [ ] Legal pages noindex, out of sitemap and `llms.txt`, disallowed everywhere.
- [ ] `hreflang` reciprocal with `x-default` on bilingual sites; none on single-language pages.
- [ ] Launch: `INDEXABLE` flipped only on the word; no `X-Robots-Tag` on the canonical host; preview hosts 301 or
      noindex; www and http 301 to https apex with path and query.
- [ ] Launch: purge, then the Search Console domain property (DNS TXT) and the sitemap submitted, 0 errors;
      IndexNow key live and pinged (202); "Request indexing" links pressed for the home and three key pages.
- [ ] Day +7: the Pages report and URL Inspection of every sitemap URL; inbound links counted for anything
      "discovered, not indexed"; no legal URL indexed.
