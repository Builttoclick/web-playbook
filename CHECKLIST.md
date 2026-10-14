# The checklist: definition of done for a client site

Copy this file into the client's folder on day 1 and keep it current until the delivery document goes out. **It is
the definition of done.** Not a feeling, not "it looks good", not the last deploy succeeding. Every line exists because
it was missed at least once on a site we delivered. The reasoning behind each line is in [`docs/`](docs/).

113 items in eleven stages, plus a twelfth block for sites with premium effects.

---

## How to mark an item

- `✅` done, **with the evidence on the same line**: a timestamp, the command and its result, or the URL. Never ticked
  from memory.
- `❌` open, with who it waits on (us / the agency owner / the client) and since when.
- `N/A` only where the item allows it, with the reason.
- **GATE** items block their stage. Nobody says "done", "live" or "delivered" while a gate of that stage is open: say
  which gates are open and who they wait on.
- `auto` = the audit command checks it, before every deploy and live after it ([docs/12-qa.md](docs/12-qa.md) lists how).
  `look` = a person has to look at a render, a capture or a live page.
- Topic tags so you can filter: **[SEO]** search and indexing · **[SPEED]** loading speed and runtime · **[QUALITY]**
  design, copy and craft · **[CONV]** conversion and tracking · **[OPS]** domain, hosting, admin.

## Header (fill on day 1)

| | |
|---|---|
| Client · slug | |
| Domain | |
| Closed · day 1 (paid + answers in) · day 14 | |
| Scope sold (read from the proposal PDF and the video) | |
| Conversion objective (A to G) · secondary | |
| Spine · opening · design sheet chosen | |
| Generator · deploy command | |
| Copy document | |
| Analytics · session recording · Search Console · uptime monitor | |
| Mailboxes | |
| Indexing go (timestamp + the agency owner's words) | |

---

## K · Close and admin (the day it closes)

- [ ] **K1** · **GATE** · [OPS] Payment 1 recorded, and the books, the ledger and the CRM agree.
- [ ] **K2** · [OPS] Invoice filed and read back (tax ID, legal name, email); anything wrong reported inside the cancel window.
- [ ] **K3** · [OPS] Lead folder moved to the client folder without nesting (target checked first) and with nobody else writing in it.
- [ ] **K4** · [OPS] CRM card at client stage with billing data and key dates.
- [ ] **K5** · [OPS] Client file (who decides, which phone sells, scope sold from the PDF and the video, payment plan) and onboarding file (done / waiting on us / needed from the client / build order). Profile work, a photo session or extra landings are scope only if the paper or the video says so.
- [ ] **K6** · [OPS] The client listed as "in construction" in our gallery; the lead's demo leaves the demo grid.
- [ ] **K7** · [OPS] This file exists with the header filled; the session-recording project requested.

## D · Domain, zone, mailboxes (from the close)

- [ ] **D1** · **GATE** · [OPS] Domain registered in the client's name (billing contact = whoever pays), or the existing registrar identified and the DNS moved under our Cloudflare.
- [ ] **D2** · [SEO] Old site (if any) backed up before anything is touched (pages, media, sitemaps, screenshots), and its ranking or linked URLs listed for 301s. `N/A` if there was no site.
- [ ] **D3** · [OPS] Zone active; existing records (mail first) replicated by API **before** the nameserver change.
- [ ] **D4** · [SEO] Always HTTPS and minimum TLS 1.2 from the day the zone exists.
- [ ] **D5** · [QUALITY] While the site is not up, a branded "under construction" placeholder (noindex, WhatsApp + Instagram), never the sales demo.
- [ ] **D6** · **GATE** · [OPS] Two mailboxes with the names the client wrote in the form: domain verified, MX + SPF + DKIM + DMARC, webmail redirect at `email.<domain>`, seats checked.
- [ ] **D7** · [OPS] Mailbox credentials drafted in the fixed message format for the agency owner to send. We never send them.
- [ ] **D8** · [OPS] Domain expiry date recorded.

## R · Intake (from the close until the answers are in)

- [ ] **R1** · [OPS] Scope sold, read from the proposal PDF and the video transcript (what was said on camera wins): pages, extras, payment plan.
- [ ] **R2** · [OPS] Known facts gathered (dossier, analysis, domain form, chat); the "known, do not ask again" line written.
- [ ] **R3** · [CONV] Conversion objective (A to G) and at most one secondary, in the header.
- [ ] **R4** · [OPS] Missing-information file: base questions still unanswered + this business's own, each with where it lands and the exact question.
- [ ] **R5** · **GATE** · [OPS] The agency owner's voice note over the missing-information file received; then the form published in the house format (one page, no intro, no progress bar, no uploads) and sent with the photo guide.
- [ ] **R6** · [OPS] Answers saved verbatim with what each one changes. Form and chat disagree → the form wins. Only blockers go back to the client.
- [ ] **R7** · [QUALITY] Brand kit: logo in vector, lockups, favicons, palette with measured contrast.
- [ ] **R8** · [SEO] Research for the copy: competitors' sites, one search keyword per page with real volume, the market facts the buyer asks about.
- [ ] **R9** · [CONV] The phone that sells confirmed (two public numbers is the norm).
- [ ] **R10** · [SEO] Address with its verbal reference, pin and hours confirmed by the client, written the same way everywhere.
- [ ] **R11** · **GATE** · [OPS] Day 1 = paid **and** answers in: the 14-day calendar generated, day 14 on a weekday, handed to the agency owner. No build before this without their word.

## V · Design and structure (in parallel with the intake)

- [ ] **V1** · [QUALITY] Design folder with a short open prompt (about 150 words, builds the three sheets at once), brand files, photos, an empty delivery folder.
- [ ] **V2** · [QUALITY] The three sheets came back and were checked against the house rules: every colour a token, 3 radii, 2 shadows, no glow, contrast measured, motion budget.
- [ ] **V3** · [QUALITY] Published behind a chooser, no sideways scroll at 390 px.
- [ ] **V4** · **GATE** · [QUALITY] The client's pick and refinements recorded and applied.
- [ ] **V5** · **GATE** · [QUALITY] Structure declared before any HTML (objective, bucket, spine, opening, sections by job, navigation, type, colour, rhythm, motion); spine not shared with another active client, or the collision declared.
- [ ] **V6** · [SEO] Page map: every page sold + legal + 404, each with slug, target search and job. Extra pages noted as overdelivery and kept out of client documents until delivery.

## P · Every page (runs on each page, every deploy)

- [ ] **P1** · `auto` · [SEO] Unique `<title>`, 60 characters or fewer (62 hard max), the service and the city where it applies.
- [ ] **P2** · `auto` · [SEO] Unique meta description, 158 characters or fewer.
- [ ] **P3** · `auto` + `look` · [SEO] Exactly one H1, first. On the home and service pages: what they sell + the USP, as a statement, never a price; buyer questions in H2s.
- [ ] **P4** · `auto` · [SEO] Headings in order without jumps (footer included).
- [ ] **P5** · `auto` · [SEO] Canonical = the final URL (https, apex, the trailing-slash rule), never a URL that redirects.
- [ ] **P6** · `auto` · [SEO] `lang` with region (or `en` on English pages), viewport, charset, theme-color.
- [ ] **P7** · `auto` · [SEO] Full Open Graph + Twitter block; `og:image` JPG or PNG 1200x630 (never WebP), one per page, regenerated when the H1, phone or address changes, with a new file name.
- [ ] **P8** · `auto` · [SEO] Visible breadcrumbs + `BreadcrumbList` on every page but the home, same names in both.
- [ ] **P9** · `auto` · [SEO] JSON-LD parses and fits the page; `FAQPage` only mirrors visible questions; no `Product`/`Offer` without a real price.
- [ ] **P10** · `auto` · [SEO] Every image has descriptive alt text and declared width and height.
- [ ] **P11** · `auto` · [SEO] Internal links resolve; `target=_blank` carries `rel=noopener`; at least two internal links point to every page.
- [ ] **P12** · `look` · [CONV] The primary action is visible in the first screen, at 390 px and on desktop.
- [ ] **P13** · `auto` + `look` · [CONV] WhatsApp links carry a pre-written message specific to the page or section (`api.whatsapp.com/send` when the text has emoji).
- [ ] **P14** · `auto` · [QUALITY] Copy rules: zero em or en dashes, no hashtags, no "we don't do / we don't have", no struck-through value anchoring.
- [ ] **P15** · `auto` · [QUALITY] No visible placeholder, "missing", "pending", lorem or "demo" text on anything public after launch.
- [ ] **P16** · `look` · [QUALITY] Every claim, number, price, term, guarantee and promise traces back to the client, or is on the "decisions I took for you" list.
- [ ] **P17** · `look` · [QUALITY] No employee names unless asked; brands, never distributors; no names of the client's customers unless given.
- [ ] **P18** · `auto` · [SPEED] Page weight inside budget (HTML ≤ 150 KB, page ≤ 1.5 MB before lazy images); no third-party requests beyond analytics, session recording and the map.
- [ ] **P19** · `look` · [QUALITY] The copy is a draft until the agency owner writes over it; their edits came from the copy document, not from memory.

## S · The whole site

- [ ] **S1** · **GATE** · `auto` · [SEO] Real 404: status 404, branded, a way home and WhatsApp; unknown routes never answer 200 with the home.
- [ ] **S2** · `auto` · [SEO] `robots.txt` right for the mode (noindex: `Allow: /`, no Sitemap line; indexable: + Sitemap); legal paths disallowed in **every** user-agent group.
- [ ] **S3** · `auto` · [SEO] `sitemap.xml` only in indexable mode, only indexable pages, with `lastmod`, every `<loc>` 200.
- [ ] **S4** · `auto` · [SEO] `favicon.ico` at the root, a 32 px PNG, an apple-touch-icon.
- [ ] **S5** · `auto` · [SPEED] Headers: nosniff and a referrer policy; `immutable` only on content-hashed names, every other asset URL versioned.
- [ ] **S6** · **GATE** · `look` · [CONV] WhatsApp on every screen and a fixed bottom bar on phones (WhatsApp + call), never a bubble over content, usable while typing in a form.
- [ ] **S7** · **GATE** · `look` · [CONV] Contact: address with a verbal reference, hours, map or directions, phone, WhatsApp, social links; name, address and phone written identically in the footer, the contact page and the schema.
- [ ] **S8** · `auto` · [SEO] `LocalBusiness` (or its subtype) JSON-LD with the same NAP, geo, hours and `sameAs` as the visible contact.
- [ ] **S9** · `auto` · [SEO] At least five FAQs from what people really ask on WhatsApp; visible markup and `FAQPage` from one source.
- [ ] **S10** · `look` · [QUALITY] Reviews real and verbatim (the profile's reviews, or the client's screenshots as sent); never one written by the business.
- [ ] **S11** · **GATE** · `auto` + `look` · [SEO] Privacy and terms written for this client, naming only the site's providers; footer link on every page; noindex, out of the sitemap and `llms.txt`, disallowed in every robots group.
- [ ] **S12** · [QUALITY] Cookie mechanism as the law requires (inform and offer a simple refusal). `N/A` until decided, with the date.
- [ ] **S13** · [CONV] Offer landings only if the client asked: one offer, no navigation, own WhatsApp message, noindex. Otherwise `N/A`.
- [ ] **S14** · `look` · [QUALITY] No loading screen, no custom cursor, no autoplaying raw video, no dark-for-its-own-sake site.
- [ ] **S15** · **GATE** · `auto` · [QUALITY] No sideways scroll on phones: probed at 360, 375, 390 and 430 px with menus and accordions open; widest document = the viewport.
- [ ] **S16** · `look` · [SPEED] Above the fold is painted, not revealed (H1, first text and hero image on the first frame); reveal safety net; no-JS net; reduced-motion path with SVG strokes visible.
- [ ] **S17** · `look` · [QUALITY] Motion: three mechanics at most, one of them the reveal, one easing, nothing re-animates, no glow, loops only on screen.
- [ ] **S18** · `auto` · [SPEED] Fonts self-hosted woff2, only the weights and axes in use, critical file preloaded with `crossorigin`, metric-matched fallback, the currency glyph present.
- [ ] **S19** · `auto` · [SPEED] Content images WebP at three widths with `srcset` and `sizes`, lazy below the fold, the hero preloaded with the same `imagesrcset`; EXIF and GPS stripped. The `og:image` is exempt.
- [ ] **S20** · `look` · [QUALITY] Product and work photos fill their box without bars and never cut the piece (per-photo framing).
- [ ] **S21** · `auto` + `look` · [QUALITY] Contrast AA measured on every text and background pair (WhatsApp green carries dark text); tap targets 44 px; icon-only buttons have `aria-label`; a `<main>`; visible keyboard focus.
- [ ] **S22** · `auto` · [QUALITY] CSS hygiene: `[hidden]{display:none!important}`; state classes (`in`, `on`, `open`, `play`) and modifiers never share a name with a component.
- [ ] **S23** · `auto` · [SPEED] No frozen page: every probed page answers the debugger and draws frames.
- [ ] **S24** · `look` · [QUALITY] Nothing the client has to maintain beyond what was sold (no stock lists, live catalogues or bookings).
- [ ] **S25** · `look` · [QUALITY] Anti-generic fingerprint 3 or under; the swap test and the blocker test pass.

## T · Tracking

- [ ] **T1** · **GATE** · [CONV] Analytics property created by script (local time zone and currency, dimensions `wa_number` / `wa_message` / `button_location`, `whatsapp_click` as key event, `tel_click` too).
- [ ] **T2** · **GATE** · [CONV] Session recording: a Website project, its ID in the generator, its export token stored for the monthly report.
- [ ] **T3** · `auto` · [CONV] Tags live in the generator, never injected into the output; only on the real host; deferred (first interaction or 3.5 s); Do Not Track respected when the privacy page promises it.
- [ ] **T4** · `look` · [CONV] Events fire on clicks only (WhatsApp, call, form or builder send). A conversion never fires on page load.
- [ ] **T5** · `look` · [CONV] No personal data in events (names, typed texts, phone numbers): masked.
- [ ] **T6** · [CONV] IDs in the internal register. Ad pixel only when the client sends theirs (otherwise `N/A`).

## QA · Before every deploy, not once

- [ ] **QA1** · [QUALITY] The audit exits 0 (no gate open); failing non-gate items listed with who they wait on.
- [ ] **QA2** · [QUALITY] The audit ran **with** the browser pass (sideways scroll, measured contrast, frozen pages, console), never skipped before a deploy.
- [ ] **QA3** · [QUALITY] Real-viewport captures at 1440 and 390 of every changed page, **looked at**.
- [ ] **QA4** · [QUALITY] Console errors 0; link crawl 0 broken; every form and builder exercised end to end.
- [ ] **QA5** · [QUALITY] After any change of a hard fact (phone, address, hours, price, material, origin): every variant grepped across the generator and the output, schema and share cards included; the uptime keyword changed in the same step if it was the phone.
- [ ] **QA6** · [OPS] Nobody else is working on this site (or build and deploy were agreed); the new build diffed against live.
- [ ] **QA7** · [OPS] After the deploy: status + content type + size on the changed URLs (the first 200 lies), purge done, `HIT` after.

## L · Launch (only on the agency owner's explicit word)

- [ ] **L1** · **GATE** · [SEO] The agency owner said to index this site; their words and the timestamp are in the header.
- [ ] **L2** · **GATE** · [SEO] `INDEXABLE = True`, `lastmod` updated; `index` on every page except 404 and legal; no `X-Robots-Tag` on the canonical host; preview hosts 301 to the domain or stay noindex.
- [ ] **L3** · **GATE** · [SEO] www → apex and http → https, both 301, keeping path and query.
- [ ] **L4** · [SPEED] HTML edge-cache rule (24 h, scoped to the host, query string out of the key, 404s 60 s) and a deploy that purges pages + sitemap + robots + 404 + old redirect URLs; `MISS` then `HIT` verified.
- [ ] **L5** · **GATE** · [SEO] Search Console domain property (DNS TXT) owned and verified; sitemap submitted **after** the purge; 0 errors.
- [ ] **L6** · [SEO] "Request indexing" for the home and the three key pages, handed over and pressed.
- [ ] **L7** · [SEO] IndexNow key file at the root and a ping (202).
- [ ] **L8** · **GATE** · [OPS] Uptime monitor: keyword = the site's WhatsApp number, every minute, four locations, SSL / domain / nameserver alerts.
- [ ] **L9** · **GATE** · [CONV] Analytics and session-recording collect requests seen live on the real domain.
- [ ] **L10** · **GATE** · [SPEED] Lighthouse mobile, three runs, median: Performance 90+, Accessibility 100, Best Practices 100, SEO 100, on the home and two key pages. Raw numbers recorded.
- [ ] **L11** · [SEO] The robots check for legal pages passes with this site included, and URL Inspection shows no legal URL in Google (an indexed one goes out through Removals, never by lifting the `Disallow`).
- [ ] **L12** · [SEO] Google Business Profile: not touched and never listed as pending unless the proposal or the video promised it. `N/A` otherwise.

## E · Delivery (day 14)

- [ ] **E1** · **GATE** · [QUALITY] Delivery audit: the proposal PDF + the calendar + this file, checked against the **live** site. Every finding fixed or listed.
- [ ] **E2** · **GATE** · [OPS] "Site delivered" document built from the template, as a shared document the agency owner edits; the final PDF exported from it. Overdelivery named here and only here.
- [ ] **E3** · **GATE** · [OPS] Accesses: mailbox credentials delivered. Analytics, Search Console and session recordings stay managed by the agency, shared only if asked. "In your name" only for the domain and the mailboxes.
- [ ] **E4** · **GATE** · [OPS] Invoice 2 goes with the delivery document; the payment recorded everywhere.
- [ ] **E5** · [OPS] Renewal reminders for next year: one month before, and on the day.
- [ ] **E6** · [OPS] The client marked "live" in our gallery, captures updated, our site redeployed.
- [ ] **E7** · [OPS] Notes for the next person (generator, copy document, deploy command, traps); client and onboarding files closed; the log entry lists every file.

## A · After delivery

- [ ] **A1** · [CONV] Day +1: analytics shows traffic and `whatsapp_click`.
- [ ] **A2** · [SEO] Day +7: the Pages report and URL Inspection of the sitemap; pages "discovered, not indexed" get their inbound links counted.
- [ ] **A3** · [OPS] The mailboxes were opened (last login not empty); if not, a nudge drafted.
- [ ] **A4** · `auto` · [CONV] The client is in the monthly report from launch day, and every source (analytics, Search Console, session recording, uptime) answers.
- [ ] **A5** · [CONV] The review link handed to the client.

---

## FX · Sites with premium effects (since October 2026)

For pages that use React Bits or other heavy effects ([docs/06-premium-effects.md](docs/06-premium-effects.md)). Not yet
in the automated audit; each item is checked with the probes described there.

- [ ] **FX1** · [SPEED] Every effect is an island on our own HTML; the H1 and all copy are in the HTML without JavaScript.
- [ ] **FX2** · [SPEED] Zero third-party origins before first paint (effects, fonts, icons compiled onto our domain).
- [ ] **FX3** · [QUALITY] Every island's poster is its exact first frame: poster vs live 0 px at 390, 834 and 1440.
- [ ] **FX4** · [QUALITY] CLS 0 on load, after scrolling every section, and during two reloads (nothing moves while an effect fades in).
- [ ] **FX5** · [QUALITY] Entrances never replay on something already on screen; anchors and restored scroll leave everything visible.
- [ ] **FX6** · [SPEED] One heavy (WebGL) effect per section; each pauses off-screen and on a hidden tab; DPR capped at 2.
- [ ] **FX7** · [SPEED] Without WebGL2, with reduced motion, and without JavaScript, the poster stays and everything clickable works.
- [ ] **FX8** · [SPEED] Frame rate measured per section with a real GPU (target 60 on desktop); no long tasks from our islands during scroll.
- [ ] **FX9** · [QUALITY] Hover-only effects have a resting state that looks finished on a phone; touch gets click or tap triggers.
- [ ] **FX10** · [QUALITY] Scroll-linked effects: identical matrices on the CSS path and the JavaScript path at 0, 25, 50, 75 and 100%.
- [ ] **FX11** · [SPEED] The Lighthouse gate (L10) still passes with every effect live.
- [ ] **FX12** · [QUALITY] Looked at on a real iPhone in Safari (the glass fallback, WebGL2 on iOS 15+, Low Power Mode at 30 fps).

---

## Deliberately not on this list

- **Case studies.** Depends on the client, decided case by case.
- **A promised response time.** We do not publish one.
- **A team photo.** Only if the client wants it and has decent material.
- **Profile (Google Business) work, a photo session, extra landings.** Only when sold or promised on camera.
