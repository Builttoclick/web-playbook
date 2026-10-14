# 11 · Deploy, hosting, domains and email

How a site gets from the generator to the client's domain, what the edge does with it, and how we set up domains
and mailboxes. The deploy templates are in [`templates/`](../templates/).

---

## The architecture

```
SITE-TOOLS/generator.py  ──writes──▶  SITE/  (HTML, assets, _headers, robots.txt, sitemap.xml, 404.html)
                                          │
                     deploy command  ─────┤  audit → diff vs live → upload → wait → purge → verify
                                          ▼
              Cloudflare Worker with static assets (or Pages)  ◀── the client's domain, DNS on Cloudflare
```

- **The generator writes everything.** Nobody edits `SITE/` by hand, ever. A text change is an edit to the
  generator's data and a rebuild.
- **Client sites run as a Cloudflare Worker serving static assets** ([`templates/wrangler.jsonc`](../templates/wrangler.jsonc)):
  `auto-trailing-slash`, a real `404-page`, and a tiny [`worker.js`](../templates/worker.js) in front that 301s every
  host except the canonical domain. Some older sites run on Cloudflare Pages, deployed directly or from a GitHub repo.
- **Our own agency site** is a GitHub repo connected to Pages; its deploy script pushes, waits for the build of that
  exact commit, purges and verifies.
- **Free tiers throughout.** Hosting, DNS, CDN and edge cache cost nothing at our scale.

---

## The deploy command, step by step

One command for every client site. It never ships a site with a failing gate.

1. **Audit** in the mode the generator declares (noindex or indexable). **A failing gate refuses the deploy.**
2. **Diff against live**: which pages change. Before deploying, also check nobody else is working on that site:
   three sites shipped someone else's draft or lost a change this way.
3. **Upload.** Worker: `npx wrangler@4 deploy` from the client folder. Pages: `npx wrangler@4 pages deploy .
   --project-name=<project> --branch=main --commit-dirty=true` from the output folder.
4. **Wait until every new or changed file answers 200** with a cache-buster. Fresh static assets can answer 404 from
   some edge locations for about 20 seconds.
5. **Purge**, in batches of 30 URLs (the Free plan limit per call): every page, `sitemap.xml`, `robots.txt`, the 404,
   the favicon, root `.txt` files, old URLs that redirect, internal links that carry a query string (the query string
   is part of the cache key, so `?utm_` links from social bios are separate cache entries), and removed URLs that must
   now answer 404.
6. **Verify live = build**, page by page: status, content type and size, without a cache-buster. Re-purge the
   stragglers (Pages moves the custom domain a few seconds after "Deployment complete"). Then the live gates. Print the
   version and keep a deploy history.

**The launch command** is the same plus, only if the live verification is clean: the Search Console domain property
(DNS TXT) if missing, the sitemap submitted **after** the purge, the IndexNow ping, and the "Request indexing" links
for a human to press. It never flips the site to indexable on its own: that is a constant the agency owner's word
changes in the generator.

**Clean QA means deploy without asking.** The default after a finished change with a clean audit is to deploy and
report afterwards, with the version and the live check. A failed QA means no deploy and a report of why.

---

## Zone settings (Cloudflare), set once per client zone

- **Always use HTTPS** and **minimum TLS 1.2** from the day the zone exists (a new zone answers plain http with 200).
- **HTTP/3** and **Early Hints** on. **0-RTT** off (only used for GETs without a query string, and ad clicks carry one).
- **www → apex, 301, path and query preserved.** On Pages, domain lines in `_redirects` are silently ignored: use a zone
  **Single Redirect** rule (`http_request_dynamic_redirect` phase, target `concat("https://example.com",
  http.request.uri.path)`, preserve the query string). A Worker site does it in `worker.js`. When the phase already has
  an entrypoint ruleset, **append** the rule (`POST .../rulesets/<id>/rules`); a `PUT` to the entrypoint replaces every
  rule in the phase. When a platform gotcha like this shows up on one site, sweep every client zone the same day: we
  found it on our own domain and two client sites still answered 200 on www a month later.
- **On Pages sites, the HTML edge-cache rule.** (A Worker serving static assets already answers `cf-cache-status: HIT`
  with no rule at all, so Worker sites skip this step; they still need the purge.) The rule
  (`http_request_cache_settings` phase): `cache: true`, edge TTL override 86,400 s,
  **browser TTL "respect origin"** (the browser keeps revalidating, so a purge is visible at once), **scoped to the
  site's hostnames** (never the whole zone: subdomains running apps with state must not cache HTML), and
  `cache_key.custom_key.query_string.exclude.all: true` so `?gclid=` and `?utm_` share the clean page's copy and one
  purge clears every variant. Add a status-code TTL of 60 s for 400 to 599, or 404s stay cached for a day. Rules take 30
  to 40 s to propagate.
- **The price of the edge cache: a plain upload is invisible until you purge.** Purge by hostname is an Enterprise
  feature; on Free you purge by URL, 30 per call, which is why the deploy builds the list from the build itself. For a
  git-connected Pages site, **purge only after the build of that exact commit is live**: right after `git push` the
  newest deployment is still the previous one, and purging then re-caches the OLD HTML for 24 hours. Wait for the
  deployment whose commit hash equals `git rev-parse HEAD`.

---

## Things the platform does that will fool you

- **A brand-new subdomain answers 522 for about a minute** with a 16-byte body: certificates and routing propagating.
  Verify by size (more than a few KB), never by status code.
- **The first 200 lies.** We have had a 200 while the HTML was still the previous page and an image returned 522.
  **Check the title plus one asset, the content type and the size**, not the status.
- **Deploys are not atomic across files.** We saw the new JS live with the old HTML for about 30 seconds. A fresh Pages
  project can serve `index.html` **as a 200 fallback** for assets it cannot find yet: your CSS and photos come back as
  HTML with a success status. If something "does not work" right after a deploy, wait 30 seconds and look again before
  touching code.
- **Pages answers unknown routes with `index.html` and status 200** unless a `404.html` exists. Any code doing
  `fetch(...).then(r => r.json())` against Pages must check the content type.
- **Pages serves assets with `max-age=14400`** (four hours) by default. For an app-like site you need three things
  together: a `_headers` file with `no-cache, must-revalidate` for the HTML and the manifest, a content hash in every
  asset URL inside the HTML, and the HTML served network-first by the service worker. Pages ignores `_headers` for
  `sw.js`; register it with `updateViaCache: "none"`.
- **`immutable` on a file changed under the same URL** means browsers that have it never revalidate. Ever. Immutable
  requires a content hash in the URL.
- **Deleting a file from a Pages deploy does not take it off the internet.** It kept serving 200 with the real content
  for hours: `cf-cache-status: DYNAMIC` with an `Age` header that kept growing (Pages assets carry `s-maxage=604800`,
  seven days), while the same URL with a random query string returned the fallback. Neither purge by URL nor purge
  everything released it. What works: a zone **WAF custom rule** that blocks the path (it runs before the cache). The
  `PUT` to that phase's entrypoint replaces all its rules, so read them first and send them back with the new one, and
  do not send `kind` or `phase` in the body. Remove the rule when the stale copy expires.
- **Cloudflare rewrites email addresses** in HTML (`/cdn-cgi/l/email-protection`) and strips `<!--email_off-->`
  comments: a byte comparison of live against the build lies unless you normalise that.
- **`_headers` on Pages accepts absolute-URL rules, and `! Header` detaches a header**: `/*` with `X-Robots-Tag:
  noindex` plus `https://example.com/*` with `! X-Robots-Tag` makes only the canonical host indexable.
- **Project and domain limits.** An account holds 100 Pages projects; when full, `wrangler pages project create` does
  not fail: it silently creates a Worker instead, and the next `pages deploy` says "project not found". A zone holds 100
  Workers custom domains; past that, deploy with a zone **route** (`"routes": [{"pattern": "demo.example.com/*",
  "zone_id": "..."}]`) plus a proxied `AAAA 100::` DNS record created before the deploy (a route creates no DNS). If a
  custom-domain attach fails mid-deploy (error 10013), the Worker is uploaded and an `AAAA 100::` record is left behind
  answering 522: attach it with `PUT /accounts/<id>/workers/domains` instead of deleting the record. To delete a Pages
  project: remove its custom domains first, then the project, then the CNAME (check its target: not always
  `<name>.pages.dev`).
- **Video on a Worker's static assets:** `Range` requests get 200 and the whole file, so Safari will not play the MP4.
  Serve video from object storage (R2) behind a custom domain, which answers 206.
- **Your own resolver can lie.** Querying a subdomain before it exists makes many home routers cache the NXDOMAIN for up
  to 30 minutes; the site is live and your machine cannot reach it. Check with `dig @1.1.1.1`, and if it already
  happened use `curl --resolve host:443:<ip>` or Chromium's `--host-resolver-rules="MAP host ip"`. The same router
  dropped parallel lookups (a browser sends several at once), so when the agency owner reported "DNS problems" on a live
  site, the fix was on his side (1.1.1.1 on the device or the router), not on the site.
- **Python to Cloudflare can stall on IPv6.** On one network the IPv6 route dropped SYNs now and then, and Python tries
  address families in order with the full timeout each: a 0.2 s call took 1 to 45 s. curl races the families and never
  shows it. In scripts, race them (RFC 8305) or force IPv4. A brand-new domain can even resolve as IPv6-only for an hour
  on a router that cached an empty A answer.
- **Python's default `urllib` User-Agent gets 403 "error code: 1010"** from Cloudflare, which looks like an auth problem.
  Send your own User-Agent; for live checks use `curl` with DNS over HTTPS.

## Credentials, and the machine you deploy from

- **Never put a token on a command line or print it.** Our scripts pass the Cloudflare token to curl through a header
  file deleted after the call.
- **Environment variables belong to whoever starts the process.** A credential exported in your agent's shell is
  invisible to a tool someone launches by double-clicking. One helper resolves credentials from the environment first,
  then from a local secrets file, and every code path goes through it.
- **Build and deploy from the machine that has the photos and can render.** A synced workspace that skips media will
  publish a folder without images, and the live site loses them (it happened to a store's app icons). Compare the
  images the live site serves with the local folder before deploying from a new machine.
- **Repository folders synced between machines can arrive without `.git`.** Re-attach with `git clone --no-checkout
  <repo> tmp && mv tmp/.git <folder>/.git`, then `git status`.

---

## Domains

### A new country-code domain, registered for the client
Our registry (`.com.py`) wants the nameservers in the registration form, has no customer panel (three contacts
manage the domain through forms), and puts a captcha on its availability check. What we learned:

1. **Create the Cloudflare zone first.** Cloudflare accepts a zone for a domain that does not exist yet (status
   `pending`) and returns its nameserver pair. **The pair is per zone, not per account**: always read
   `name_servers` from that zone's response, never copy another domain's pair.
2. Fill the registry form with those nameservers. When the nameservers live outside the domain (always, with
   Cloudflare), the form disables the IP fields: they are not optional, they cannot be sent.
3. **The registrant organisation is the client** (legal name and tax ID): that is what makes the domain theirs.
4. **The billing contact decides who the receipt is made out to**, not who pays. If the domain is included in your
   package and you pay it, put yourself as billing contact when you file, or you pay a receipt you cannot deduct. We
   made this mistake three times in a row before writing it down. Ask to be the technical contact too.
5. Timeline: the registry's own pages promise a technical check within 24 h, a confirmation email to answer within 8
   days, approval in 24 to 48 h and payment within 15 days. **In practice five new domains delegated 8 to 24 minutes
   after payment and confirmation (17 on average).** Put your own address as the responsible email and you answer the
   confirmation yourself; the client never has to. Cloudflare's `activated_on` for the zone is the source of truth.
6. **Availability: NXDOMAIN does not mean free.** A domain registered "with DNS later" answers NXDOMAIN while the
   registry says "not available" (it may even be the client's own). Ask the registry. Its home-page availability form
   has no captcha (only a one-use hidden token and randomised field names, so a script can re-fetch the page per query
   and keep cookies); the captcha sits on the owner and expiry lookups.
7. The `.py` zone is rebuilt every 30 minutes (at :00 and :30; the SOA serial is that Unix time, readable from any
   NXDOMAIN's authority section), so a change can only appear at the next build. Read delegation straight from a
   registry server (`dig +norec NS <domain> @<registry server>`), not a resolver. A domain registered with DNS later
   sits on placeholder nameservers once active.
8. Changes after registration go through the registry's modification form: a DNS-only change applied in about 20
   minutes, while a combined contacts + DNS change waited for the 24 to 48 h approval (send DNS on its own). Only the
   administrative contact changes the holder; the technical contact changes technical data, DNS included.
9. **A domain the client already owns needs almost nothing:** file the registry's modification form with the email
   the domain was registered with, the registry mails the client a link, they forward it, you enter the nameservers.
   Moving ownership itself is done by the administrative contact (a company that lost its contacts can use a signed
   letter); if the agency itself is the registrant, the registry will not mediate a dispute.
10. In a hurry: a `.com` from Cloudflare Registrar is live in minutes at cost, and can redirect to the country domain
    later.

### An existing domain somewhere else
- **Find the registrar without WHOIS:** RDAP (`https://rdap.verisign.com/com/v1/domain/<domain>` for `.com`, with your
  own User-Agent) gives the registrar, dates and nameservers; its `related` link leads to the registrar's own RDAP and
  the registrant. "Knock Knock WHOIS Not There, LLC" is WordPress.com's privacy proxy, not a company the client hired.
  `client transfer prohibited` is only the registrar's default lock.
- **On WordPress.com:** nameservers under Domains → the domain → Settings → Name servers (turn off its own nameservers);
  "Transfer to another user" moves it to the client's account for free; transferring out to another registrar needs
  the auth code, which goes to the domain contact's email, and is locked for 60 days after registration or a registrant
  change.
- **Claim the zone in Cloudflare by API** (`POST /zones` with `type: full`). **The automatic import found zero records**:
  replicate the current DNS by hand (`proxied: false`) **before** asking for the nameserver change, so the change moves
  nothing (web or mail), and the cut-over to the new site is a separate, reversible record change.
- **Inventory a domain's DNS you do not control:** zone transfers (AXFR) are almost always refused. Ask the
  authoritative nameserver directly for A, MX, TXT, NS, SOA, CAA and DS, plus the usual names (www, mail, ftp, smtp,
  webmail, autodiscover, `_dmarc`, DKIM selectors), and read **crt.sh** for every subdomain that ever had a certificate.
- **Back up the old site before touching anything**: pages, media originals, sitemaps, screenshots. List its ranking and
  linked URLs for 301s.
- While the new site does not exist, a branded **"site under construction" placeholder** (noindex, WhatsApp, Instagram)
  with a single-page fallback, so every old link lands somewhere useful. Never the sales demo.

---

## Email

Two professional mailboxes are part of our package, on the client's domain.

- **Zoho Mail** on our organisation: check available seats before promising, add and verify the domain, then **MX, SPF,
  DKIM and DMARC** in the Cloudflare zone, and a webmail shortcut at `email.<domain>` (a redirect).
- **The client names the mailboxes in the intake form** (last block, with an example like `sales@<domain>`), so nobody
  has to ask on WhatsApp.
- **The credentials message is fixed.** It goes to the agency owner as a plain code block (so it copies in one click),
  formatted for WhatsApp (bold with asterisks), no emojis, labels bold and values plain, one block per mailbox with the
  purpose the client gave it, the webmail link, the iPhone and Android app links, and the note that the first login
  forces a password change. The build never sends it to the client directly.
- Zoho can open in English for some users: language is a user preference, not an organisation setting.
- **After delivery, check the mailboxes were actually opened** (last login not empty) and draft a nudge if not.

---

## Field notes from the log

Smaller lessons, each one paid for once.

**Workers with static assets**
- Assets are served before the Worker script runs. `html_handling: "auto-trailing-slash"` answers `/p/x` with a redirect
  to `/p/x/` and `/page.html` to `/page`; `.mjs` is served as `text/javascript`; `_headers` is read as configuration and,
  like dotfiles, is not served itself; `.well-known/` is served. With `run_worker_first: ["/api/*"]` the script runs only
  on the API paths, so the 404 page, `html_handling` and `_headers` keep working everywhere else.
- Wrangler can leave its own config and a `.wrangler/` folder inside the deploy folder: add an `.assetsignore` with
  `.wrangler`. Files over 25 MiB are refused with no useful message (shrink image-heavy PDFs first). A file deleted
  locally answers 404 after the next deploy.
- A Worker custom domain creates its own DNS record (an existing record blocks it), and **it attaches even while the zone
  is still pending**: attach the placeholder the day the client pays, and it serves the moment the registry delegates.
- A Worker with routes has no `workers.dev` URL. To test it before the domain resolves, enable its subdomain through the
  API, test, and disable it again (it takes about a minute to go away).
- **Move a hostname between Workers without a DNS gap:** deploy the new Worker with the hostname in its routes (wrangler
  reassigns it), then remove it from the old one. Never detach first: deleting a custom domain deletes its DNS record and
  resolvers cache the NXDOMAIN.
- **Park a site without losing it:** point the same Worker's `assets.directory` at a placeholder with
  `not_found_handling: "single-page-application"`. One production Worker per domain; the sales demo stays a separate
  Worker.

**Pages**
- `/x.html` answers 308 to the extensionless path (query kept): `curl` without `-L` shows 0 bytes while Python follows
  silently.
- `_redirects` wins over a static file, works with and without the trailing slash, and cannot redirect by domain.
  Merging pages is three acts: the data, the `_redirects` line, deleting the old folders; then purge the old URLs.
- **The per-deployment URL that wrangler prints (`https://<hash>.<project>.pages.dev`) is the reliable QA target.** The
  branch and production aliases served the previous build for about a minute.

**Deploy mechanics**
- **Poll for a string from the new HTML, not for a 200.** A new Worker domain served the placeholder for 40 to 60 s.
- **A purge right after deploy can race:** one edge kept the previous HTML (one byte different) after a four-second wait,
  and a second purge fixed it. Compare the downloaded size on the apex and on www.
- **Deploy scripts that push git commits ship what is committed, not the working tree.** Commit the new files by name,
  or the script says "nothing to push", purges, and nothing changes. Check `git status` for other people's uncommitted
  pages first, because the deploy ships the whole folder.
- **Long deploys:** a background deploy dies with its session, and its log lies because Python buffers stdout when it
  writes to a file: run `PYTHONUNBUFFERED=1 python -u`. Never pipe a deploy through `tail` (it cuts the error lines). A
  script that reports "0 pages change" because the live fetch failed is lying; rerun it. On Windows, printing wrangler's
  emoji crashes Python's console encoding: reconfigure stdout to UTF-8.
- In a shell, a heredoc that fails followed by `cd ... && deploy` on the next line still deploys. Keep the `&&` on the
  heredoc's own line.
- A fresh zone has Always Use HTTPS off, and Workers custom domains also answer plain http (Safari shows "Not secure" and
  Google indexes `http://` copies within a day). Check `curl -s -o /dev/null -w "%{http_code} %{redirect_url}"
  http://<host>/` on every launch: it must be a 301 to https.
- When a page leaves the sitemap (legal pages, removed pages), a purge list built from the sitemap stops purging it, and
  the edge keeps it for a day: purge those URLs by hand after any change.
- A cache rule keyed on the host caches `sitemap.xml`, `robots.txt` and the 404 too. Judge a rule on the third request
  (about one URL in four misses twice). Unique click ids (`fbclid`) are harmless misses.
- A Cloudflare API token can return 401 on the "verify token" endpoint and still work on every real endpoint: test a
  token on an endpoint you actually use. The API allows about 1,200 calls per five minutes per token.

**DNS**
- Verify DNS against two independent sources: the zone's authoritative nameservers (no cache) and a public resolver, not
  the API that wrote the record. A new DKIM record may take a while to resolve publicly. A long DKIM value is served as
  several strings of 255 characters or less, as it should be.
- Plain `nslookup` with no server can lie about free domains (some ISP routers answer every name). Use `nslookup <domain>
  8.8.8.8`, and for a `.com` confirm with RDAP (404 means unregistered).
- **Moving a domain between Cloudflare accounts with no downtime:** add it as a new pending zone in the second account,
  fill it, then change the nameservers at the registrar. The old zone keeps answering until the registry's NS TTL
  expires, so do not delete it before that. An activation check call activated the zone about a minute after the switch.
- **Creating a zone for a live domain:** the automatic import found nothing. Read the live records from the old
  authoritative servers (NS, A, MX, TXT, www and the usual subdomains), include a random name to detect wildcards, mirror
  everything as DNS-only, and compare record by record against the pending zone's nameservers before anyone switches.
- To know whether a `.com` nameserver change was saved, ask the registry (`nslookup -type=NS <domain>
  a.gtld-servers.net`) and read RDAP's "last changed".

**Email**
- **SPF `~all` plus DMARC `p=none` cannot break anything**, so it is the safe first step on a live domain; harden only
  after reading the reports. `sp=reject` is free hardening once no subdomain sends mail. A DMARC `rua` pointing to another
  domain needs an authorisation record on the receiving side (`<domain>._report._dmarc.<receiving-domain>` with
  `v=DMARC1`), or the big providers silently drop the reports.
- **Google Workspace DKIM cannot be created from DNS alone**: generate the key in the admin console first. Without custom
  DKIM, Workspace signs with its own unaligned domain, so mail passes DMARC only through SPF and forwarded mail fails.
- DMARC reports: Google's cover the UTC day and arrive zipped, Microsoft's gzipped; the same report ID can arrive several
  times (count by ID); zero reports with correct records usually just means no mail was seen.
- Prove where an email really came from with a DKIM verification library, and check the signature has no `l=` tag.
  Blocklist lookups flap: try three times per list.
- Mail API habits: an attachment adds about 37% in transit (base64); "last login: never" means the mailbox was never
  opened, which is the nudge you send after delivery.

---

## Checklist · deploy and domain

- [ ] Domain registered in the client's name (or the existing registrar identified), zone on Cloudflare.
- [ ] Old site backed up and its ranking URLs listed for 301s (if there was one).
- [ ] DNS replicated by API before any nameserver change; mail kept alive.
- [ ] Always HTTPS, TLS 1.2 minimum, HTTP/3, Early Hints.
- [ ] Placeholder on the domain until the site exists (noindex), never the demo.
- [ ] Two mailboxes with SPF, DKIM, DMARC; webmail redirect; credentials message drafted.
- [ ] Worker or Pages config from the templates; preview hosts 301 to the domain.
- [ ] Every deploy through the deploy command: audit, diff, upload, wait, purge, verify live = build, `HIT` after.
- [ ] Launch: www and http 301 to https apex with path and query; on Pages, the HTML cache rule scoped to the host,
      query string out of the key, 404s cached 60 s; purge list complete.
- [ ] Domain expiry date recorded; renewal reminders set.
