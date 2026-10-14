# 01 · The process, end to end

From the first message of a prospect to the monthly report a year later. Two products live in here and
they must never be confused:

- **The demo** is a sketch that sells. It illustrates a pitch for about fifteen seconds of a video.
- **The site** is what the client paid for. It gets the time it needs and it is not done until every
  gate of its stage is green.

Two words used throughout: **the agency owner** is the person who sells, signs off and talks to the
client (in our case Joaquín). **The build session** is whoever builds. In our agency most of the
building is done by AI coding sessions that follow this exact procedure; the gates exist so that a
human signs off everything that leaves the building.

---

## Part A · Before the sale: the lead demo

### Gate zero: the lead has to have given something

Building is cheap, recording is expensive. The dossier and the demo are built by the session; the
personalized video is recorded by the agency owner, whose time is the scarce resource. A video sent to
someone who never asked for it lands cold and does not come back.

Warm signals that open the gate: the lead answered a direct question, named the business in words,
said what they sell, asked something back, or agreed to receive the video. **Two social handles after
two weeks of silence are not a warm signal.** If a build is already under way, finish it and deliver it
on hold: the recording waits until the lead asks, not until the demo is ready.

### The stopwatch

Write down T0 (the time of the request, not the time you start) and T1 (the demo live and verified),
with the time per phase. The breakdown matters more than the total: it says which phase ran away.
Our sequential baseline was 43 minutes; the target with parallel work is 20.

### The dependency graph

| Needs | Unlocks |
|---|---|
| the slug (known in about 2 minutes) | all the publishing infrastructure |
| the identity phase | the local proof sheet, photos, press, context |
| proof sheet + press | the strategic analysis |
| the strategic analysis | the angle, the structure and the conversion objective |
| angle + objective + photos | copy and HTML |
| HTML | QA |

**Publishing depends on nothing but the slug, so it goes first, not last.** A new subdomain answers
522 for its first minute or two while routing and certificates propagate; by the time the HTML exists
the host is warm.

### Phase 0 · Identity (about 2 minutes, sequential)

1. **Recall first.** Search the work log for the business. If it came through before, do not
   re-derive anything.
2. **The public profile.** A bot user agent returns follower and post counts from an Instagram profile
   without logging in: `curl -s -A "facebookexternalhit/1.1" https://www.instagram.com/<handle>/`
   and read `og:description`. The full bio and its link need a real (logged-out) browser.
3. **Resolve the bio link without loading it:** `curl -s -o /dev/null -w "%{redirect_url}" <url>`.
   Link pages and WhatsApp shorteners give away the real public phone number and the Google Maps pin;
   the pin's coordinates give the city.
4. **The ad library, here and not at the end.** If the business is paying for ads today, that is the
   angle and it beats everything else: "you have been paying for these clicks for six days and they
   land nowhere" is their money leaving this week, and it is on screen in ten seconds. **Open each ad's
   page and read its destination with your eyes**: the API does not return the call to action, and a
   wrong claim here collapses live in front of the prospect.
5. **Two public phone numbers is the norm, not the exception.** It happened on four leads in a row.
   Always ask which one sells.
6. **If the name does not say the trade and the recon comes back empty, ask before writing HTML.** We
   once built a whole trades demo for a business that turned out to be an importer. A photo of the
   packaging is the best input that exists: it carries the phone, the address and copy written by the
   owner.
7. **Never `dig` or `curl` the new subdomain before it exists.** Many resolvers and home routers cache
   the NXDOMAIN for up to 30 minutes, and then your own QA cannot reach a site that is already live.
   Check availability against `1.1.1.1` or the DNS API.

### Phase 1 · The wave (8 to 10 minutes, four jobs in parallel)

| Job | What it does | Traps |
|---|---|---|
| **Infra** | creates the subdomain and deploys a one-line page, polls until 200 | a fresh subdomain answers 522 for about a minute; that is propagation |
| **Local proof sheet** | 4 to 6 searches of the trade in Google Maps from the client's coordinates (their city and the capital), 3 or 4 national organic searches, and the business profile itself (claimed?, category, rating, review count, hours, photos) | **one task per API request**: our SERP API rejects batches but runs the first task and silently drops the rest. `claimed: true` does not mean the profile is fine |
| **Photos** | the business's best images, 12 maximum, converted once to WebP, whole demo under 700 KB | look at the **Google profile photos first**: their URL size suffix is a parameter, so `=w1600-h1600-k-no` returns the large original. Never use an image with a play button burned in |
| **Context** | press notes, the Facebook "about" page (often years of experience and a different description), local directories, the ad library, **the text of the reviews** | the angle is usually here |

**Do not pre-build a skeleton while the wave runs.** Choosing the structure before knowing what the
business sells is exactly what made every demo look the same. What can be prepared: the empty file
with the demo badge, the bar, `noindex`, blank colour tokens, and a reference design system from a
real brand whose world resembles the client's, so you build in that language instead of the default.

### Phase 2 · Judgement (about 12 minutes, one person, never parallel, never cut)

1. **The strategic analysis, before the angle** ([02-strategy.md](02-strategy.md)): what they really
   sell, who pays and who decides, how much the buyer knows, the conversion objective, and why nobody
   believes them today.
2. **The angle**: the tension between what they really sell and what can be verified about them today.
   Real examples: an unclaimed profile in a town where no competitor has a site; personalised work as
   the only thing nobody can copy; the buyer's objection is lead time, not price; the profile says
   "carpenter" while the Instagram sells engraved corporate gifts; a world title that no event
   organiser can verify.
3. **The structure**, with the four-minute selection procedure ([03-structure.md](03-structure.md)).
4. **The HTML.**

### The demo is a sketch

Our rule since a demo took 34 minutes, seven redeploys and a brand-new comparison mechanism:

- **Four to six sections**: the opening with the proof, the section the angle asks for, the CTA of the
  objective, where they are, the footer.
- **One interactive moment**, reskinned from a proven mechanism, never invented for the occasion (the
  six are below).
- **No extras**: no counters, no share buttons, no vCard, no custom animation. A scroll reveal with a
  safety net (`setTimeout(revealAll, 2200)`, not tied to `load`) is the only motion floor.
- **One QA pass** (a scripted check plus one desktop and one phone capture). Fix what is broken, not what
  could be polished. **Two redeploys maximum.**
- **What is never cut:** the strategic analysis, the angle and the dossier. Those sell; the demo only
  illustrates them.

Every demo carries: a fixed "DEMO" badge in the corner opposite the WhatsApp button (a rotated ribbon
ate the client's logo at some widths), `noindex`, real hours, prices and reviews taken from their own
flyers and profile, every CTA as a WhatsApp link with the message already written, a different message
per section (so you can tell which section sold), the map, and **the CTA the objective asks for**, not
the default. If the objective is a verified credential, the main button is the downloadable press kit
and WhatsApp is secondary.

### The six demo mechanisms

A demo gets one interactive moment. Reuse the scaffold, keep the idea specific to the business.

| # | Mechanism | For a business that... | Maintenance |
|---|---|---|---|
| 1 | **Structured quote builder**: pick what, how many, for when, and the message writes itself | sells made-to-order or by quantity | none |
| 2 | **Convenience calculator**: how much to buy for N people, or the reseller's profit per pack | sells wholesale or to resellers | none |
| 3 | **Live previewer**: the engraving, embroidery or initials drawn on the product photo | personalises the product | none |
| 4 | **Before / after**: two images of the same place | sells a visible transformation | none |
| 5 | **Deadline or availability calculator** | faces "how long" as the real objection | none |
| 6 | **Filterable gallery** | has few, fixed families (sizes, colours, types) | **careful**: over products with price or stock it becomes a catalog nobody updates |

How to choose in 30 seconds: the objection is time → 5. Price by quantity → 1 or 2. The product is
personalised → 3. The work is visible → 4. None of these and clear families → 6, with the warning.

Legibility trick from the previewer: to make text readable over a dark photo, **draw the surface under
it** (a plaque with its own gradient, an inset border, a drop shadow), never lower the text's opacity.

### Delivery in two times

As soon as the wave closes, **before writing HTML**, hand over the dossier, the analysis, the angle and
the video script. The person recording needs the dossier to rehearse, not the site; the site is only
for screen sharing. Rehearsal starts at minute 12 while the demo is still being built.

### The dossier

Who they are, the offer, **the strategic analysis (mandatory, above the angle)**, the angle, the
audience, numbers per network, the state of their Google profile (rating, reviews, claimed or not, the
pains in the one-star reviews), their current web presence, a clear web recommendation and the upsells.

**The Links section is mandatory.** The video is recorded with these open:
- every social network with its URL, or "does not have one" written explicitly (a finding, not an
  omission);
- **the exact URL of every search we ran**, so the prospect can watch "you search this and you are not
  there". It is the most persuasive asset in the whole dossier;
- their profile, the review link, their site (or the dead domain, said as such) and the domain we would
  propose, every directory found, the competitors that beat them, and the demo.

A short terms file goes with it: the business name as it is spelled, brands, the owner's name with its
real spelling, the city. It feeds the automatic captions of the video so they come out right.

### The personalized video

About 45 to 55 seconds: greeting → what they do → the diagnosis while showing the demo ("from this to
this") → the proposal → the close. Recorded by the agency owner, sent by them, followed up by them.
Every demo then goes into our public gallery of work. **Once the video is recorded, it is the source of truth**:
the written proposal matches what was said on camera.

### What the standard website package includes

The proposal never trims it and never inflates it. Cutting the package to fit a template lowers the perceived value
of a price that is already fixed.

- Up to eight custom pages, plus the legal pages and the 404.
- **The copy written by us** after collecting the client's information.
- Every image optimised one by one.
- The client's own domain, hosting, and **two professional mailboxes**, with the first year included.
- SEO setup, Search Console and the sitemap included.
- Measurement: analytics, session recordings, WhatsApp click measurement, and the ad pixel when they send it.
- The WhatsApp button across the whole site.
- **Three design proposals** (the design sheets) to choose from, always, whether or not they were mentioned on camera.
- Delivery in 14 days, counted from the day the client has paid and sent the information.
- A yearly renewal from the second year covering domain, hosting and mailboxes, the same amount whatever the number
  of languages.
- An honest line that fighting for the first position on Google is separate monthly work.

Proposals describe the result, never the machinery.

---

## Part B · After the sale: the paid site in ten phases

### Rules that apply to every phase

- **Which path.** A new client with no site → the ten phases. A new page or landing on a site we built
  → Path P. A change on a live site → Path C. A prospect → Part A, not this. A store with a cart → the
  store standard ([14-stores.md](14-stores.md)).
- **Recall, then claim the site.** Read the client's notes, the per-site checklist, the dossier and
  **the proposal that was actually sent**. Scope and price come from the paper and the video, never from
  memory: one video said a higher price than the deal that closed.
- **One builder per site.** Before touching the generator, check that nobody else is working on that
  client. Before any deploy, diff the new build against what is live: three sites shipped someone
  else's draft or lost a change this way.
- **Build and deploy from the machine that has the photos and can render.** A grid change built on a
  server with no browser broke a phone layout.
- **The checklist is the definition of done.** Copied on day 1, every item marked with evidence on the
  line (a timestamp, a command and its result, a URL), never ticked from memory. ✅ done with evidence,
  ❌ open with who it waits on, N/A with the reason.
- **Nobody says "done", "live" or "delivered" while a gate of that stage is open.** Say which gates are
  open and who they wait on. That sentence is the job, not a failure.
- **What only the agency owner does:** anything that leaves for the client (messages, the form link,
  the calendar, the delivery document), approving copy, creating the session-recording project, pressing
  "Request indexing", the word to index, invoices. **Prepare each of these so it costs a minute**: the
  exact text as a draft in their voice, the link, the button, batched in one message.
- **Quality is decided on the phone.** The owner judges a site from an iPhone first. Every page is
  looked at at 390 px before anyone else sees it: the H1 on two lines or fewer, the primary action
  visible, nothing sideways, nothing cut, text readable on its background. Desktop at 1440 second.
- **The copy rules travel with every word** ([13-copy-and-content.md](13-copy-and-content.md)).

### Phase 1 · Close and admin (the day it closes)

**The 14 days do not start at the close.** Day 1 is the day the client has paid **and** sent the
information. The project ends the day the agency owner sends the official delivery document.

1. Record the payment in the books and check that the books, the narrative ledger and the CRM agree.
2. The invoice is filed and read back (tax ID, legal name, email): there is a short window to cancel a
   wrong one.
3. The lead folder becomes a client folder (check the target does not exist first: a move onto an
   existing folder nests one inside the other).
4. CRM card at client stage, billing data, key dates.
5. **The client file:** who decides, which phone sells, the scope sold (read from the proposal PDF and
   the video), the payment plan. **Scope is only what the paper or the video says:** Google profile
   work, a photo session or extra landings exist only if they were sold or promised on camera.
6. **The onboarding file:** done / waiting on us / needed from the client / build order.
7. The client appears in our gallery as "in construction"; the lead's demo leaves the demo grid.
8. The per-site checklist exists with its header filled. Ask for the session-recording project on day 1
   so it exists when the build needs it.

**Exit gate:** payment recorded everywhere.

### Phase 2 · Domain, zone, mailboxes (from the close, in parallel with Phase 3)

1. **A new domain** is registered in the client's name ([11-deploy-hosting-domains-email.md](11-deploy-hosting-domains-email.md)).
   **An existing domain elsewhere:** find the registrar (RDAP), back up the old site before touching
   anything (pages, media originals, sitemaps, screenshots), list its URLs that rank or are linked for
   301s, replicate every DNS record into the new Cloudflare zone by API **before** the nameserver change
   (the automatic import usually finds nothing), keep email alive through the move.
2. Zone settings from day one: always HTTPS, minimum TLS 1.2. A new zone answers plain http with 200
   until you switch it.
3. **A branded "site under construction" placeholder** while the site does not exist: noindex,
   WhatsApp and Instagram, served with a single-page fallback so every old link lands on it. Never the
   sales demo on the client's domain: it carries the demo badge and lead copy.
4. **Two mailboxes** with the names the client wrote in the form, domain verified, MX + SPF + DKIM +
   DMARC, a webmail redirect at `email.<domain>`. Credentials go to the agency owner as a ready-to-send
   message; the session never sends them.
5. The domain's expiry date goes in the client file.

**Exit gate:** domain registered or moved under our DNS; mailboxes created.

### Phase 3 · Intake (from the close until the client's answers are in)

The intake **is a form**. An interview replaces it only when the agency owner decides it is easier for
that client.

1. **Write down what is already known** (dossier, analysis, video, proposal, domain form, chat) as a
   "known, do not ask again" line. Half of every early form re-asked things we had.
2. **The conversion objective** goes in the header. It decides the length of the pages, the main CTA and
   the event we measure.
3. **A missing-information file**: the base questions still unanswered plus this business's own,
   grouped, each with where it lands on the site and the exact question.
4. **The agency owner records a voice note over it**: what to ask, what not, what was assumed wrong.
   **The form is built only after that**, even when asked to "prepare everything for the form".
5. **The form, in the house format**: one page, no intro, no progress bar, no file uploads (photos and
   documents go by WhatsApp; free form tools cap uploads and lock files inside a submission), blockers
   required, everything else optional, conditional questions for branches, a thank-you page, the brand
   colour. Sent together with the **photo guide** ([13-copy-and-content.md](13-copy-and-content.md) has
   both).
6. **Brand kit:** the logo in vector (vectorise a raster if that is all there is), lockups, favicons,
   palette with measured contrast.
7. **Research for the copy:** competitors' sites, one search keyword per page with real volume, the
   market facts the buyer asks about.
8. **When the answers arrive:** saved verbatim with what each one changes. Form and chat disagree → the
   form wins (it is the later, written source). **Only blockers go back to the client:** material the
   page physically cannot exist without (photos, a logo, a lab analysis). Everything else gets a
   sensible default and one line to the agency owner so they can flip it.
9. **Day 1** = paid **and** answers in. Generate the 14-day calendar that day.

**Exit gate:** form sent to move on; answers in and calendar out before the build.

### The 14-day calendar

| Days | Stage |
|---|---|
| 1 to 3 | intake (much of it already done by the analysis) |
| 4 to 5 | design and layout |
| 6 to 11 | adjustments with feedback |
| 12 to 14 | polish and publish |

Rules: weekends are not worked but that is never written in the document; if day 14 falls on a weekend,
move the start. **The document only says what we do** ("we send you the form", "we pass you the photo
guide"), never a column of client tasks. **Overdelivery is never written in the calendar**: pages beyond
the ones sold, animated scenes, 24 h monitoring are shown only at delivery.

### Phase 4 · Design sheets and structure (in parallel with the intake)

1. **A design folder per client**: a short prompt, the brand files, the photos (originals, descriptive
   names), and an empty delivery folder.
2. **Three design sheets built at once by a design tool**, published behind a chooser, checked against
   our house rules before they go out, picked and refined by the client. Details in
   [04-design.md](04-design.md).
3. **The structure is declared before any HTML** ([03-structure.md](03-structure.md)): objective → what
   the client has → spine → opening → sections by job → navigation, type, colour, rhythm, motion. Two
   active clients never share a spine.
4. **The page map**: every page sold, plus legal pages and the 404, each with its slug, the search it
   targets and its job. Pages beyond the ones sold are noted as overdelivery.

**Exit gate:** the client's pick recorded and applied; the structure declared.

### Phase 5 · Build (days 1 to 5)

**The build waits for the client's answers.** Only the agency owner's explicit word starts it without
them. One site was built blind and pulled back the next day.

1. **The generator.** One script per site writes the whole output folder; nobody edits the output by
   hand. Start from the closest existing generator (a catalogue-and-order site, or a services site with
   a builder) and read that site's notes first: its traps come with it. Start it with the shared
   constants block ([`templates/generator_constants.py`](../templates/generator_constants.py)).
2. **The sheet becomes code:** tokens and component styles read from the chosen sheet, icons extracted
   verbatim, the sheet's own fonts self-hosted. CSS hygiene from line one: `[hidden]{display:none
   !important}`, and state classes (`in`, `on`, `open`, `play`) never share a name with a component.
3. **The copy:** from the answers, the research and the analysis. A "decisions I took for you" list goes
   on top of the copy document, one line each, so the agency owner can flip any of them.
4. **The photos:** cropped one by one, WebP at three widths with `srcset`, EXIF and GPS stripped,
   product and work photos filling their box without bars and never cut. Missing photos are marked boxes
   during review and become drawings in the site's own visual language at launch.
5. **Conversion:** WhatsApp on every screen with a message per page and section, a fixed bottom bar on
   phones, the objective's CTA in the first screen, `tel:` links, the map.
6. **SEO built in, not added later**: every per-page item of the checklist comes out of the generator.
7. **Legal pages** written for this client, noindex, out of the sitemap and `llms.txt`, disallowed in
   every robots group.
8. **Tracking:** the analytics property created by script, the session-recording ID from the agency
   owner, both as constants in the generator, deferred, only on the real host. Events on clicks only.
   The ad pixel goes in only when the client sends it.
9. **Share cards:** one 1200x630 JPG per page.
10. **The copy document:** generated from the built HTML, uploaded as a shared document, regenerated
    at the same URL after every round.
11. **Deploy to the client's real domain in noindex** with the deploy command (audit, deploy, purge, live
    checks). A noindex link on the real domain is safe to share.

**Exit gate:** every per-page item and every site-wide item that is not launch-only is green on the
live noindex site.

### Phase 6 · QA, before every deploy (not once)

The audit exits 0 (every page's SEO, links, copy rules, sideways scroll at 360/375/390/430, frozen
pages, console errors, contrast and tap targets measured at 390, in about a minute and a half), real-
viewport captures at 1440 and 390 of every changed page **looked at**, every form and builder exercised,
after a hard fact changes every variant grepped across the whole build, then the deploy command, which
refuses on a failing gate and checks status + content type + size = the build. Details in
[12-qa.md](12-qa.md).

### Phase 7 · Review rounds (days 6 to 11)

1. **The agency owner first:** they read the copy document and the live site. Pull their edits from the
   document with a normalised diff (shared documents join paragraphs and rewrap lines: one raw diff
   showed 43 blocks for 7 real edits), apply them in the generator, rebuild, regenerate the document at
   the same URL, QA, deploy.
2. **Then the client**, through the noindex link. **Their texts ship word for word.** Keep a file with
   each message verbatim and what it changed. **Open every image they send:** clients write corrections
   on screenshots.
3. **Cut before the agency owner has to:** second sentences that add nothing, visible "missing" notes,
   staff names, claims the client never made, long lists that want to be grids, anything that will
   confuse.
4. A log entry and the checklist updated after every round.

### Phase 8 · Launch (days 12 to 14, on the agency owner's word only)

1. Final QA. Placeholders replaced by drawings or removed. In noindex mode the audit's last line says
   whether the site is ready to index; only a human decides.
2. On their word (the toolkit never flips it): `INDEXABLE = True`, `lastmod` updated, their words and
   the timestamp in the checklist header, rebuild. Sitemap with only indexable pages, robots with the
   Sitemap line, no `X-Robots-Tag` on the canonical host, preview hosts 301 or stay noindex.
3. Zone rules: HTTPS and TLS 1.2, www → apex 301 keeping path and query, the HTML edge-cache rule.
4. The launch command: strict audit, deploy, purge (pages, sitemap, robots, 404, old URLs), verify live,
   then the Search Console property and the sitemap **after** the purge, IndexNow, and the "Request
   indexing" links handed over.
5. Uptime monitor (keyword = the site's WhatsApp number) and the IDs register.
6. Live tracking check (the analytics and session-recording collect hits seen on the real domain),
   Search Console clean, Lighthouse mobile three runs median on the home and two key pages:
   **Performance 90+, the other three at 100, or no launch.**
7. The robots check for legal pages passes, and URL Inspection shows no legal URL indexed.

### Phase 9 · Delivery (day 14)

1. **Delivery audit:** the proposal PDF, the calendar and the checklist checked against the **live**
   site, by curl and by eye. One delivery audit found nine gaps nobody had seen. Fix ours before writing
   a line of the document.
2. **The "site delivered" document**, built from a template, as a shared document the agency owner
   edits; the final PDF is exported from it. **Overdelivery is named here and only here.** "In your
   name" only for what really is (the domain and the mailboxes). Payment rows without an agreed date say
   "to be agreed", never an invented date.
3. **Accesses:** mailbox credentials if not delivered yet. Analytics, Search Console and session
   recordings stay managed by the agency; shared only if the client asks.
4. The second invoice goes with the delivery document.
5. Renewal reminders in the agency calendar for next year: one month before, and on the day.
6. The client moves to "live" in our gallery.
7. Notes for whoever touches the site next: the generator, the copy document, the deploy command, the
   traps. The log entry lists every file.

### Phase 10 · After

1. Day +1: analytics shows traffic and `whatsapp_click`.
2. Day +7: Search Console's Pages report and URL Inspection of the sitemap; pages "discovered, not
   indexed" get their inbound links counted.
3. The mailboxes were opened (last login is not empty); if not, a nudge drafted.
4. **The monthly report:** the client enters the monthly routine the day the site goes live. On the 3rd
   of every month a scheduled job pulls the previous month (analytics, Search Console, session
   recordings, uptime) and sends the agency owner the numbers plus a WhatsApp draft for the client. The
   draft is theirs to rewrite and send. Rules that came out of the first runs: WhatsApp counts **people**,
   never taps ("N people opened your WhatsApp"); a search named to a client needs 5+ impressions and
   "first page" needs position ≤ 10; taps that look like our own tests are left out; a page missing from
   Google is diagnosed by script (Google's state, last crawl, live robots tag), never guessed. Fewer than
   14 days live in the month = no draft.
5. The review link handed to the client.

### Path P · A new page or landing on an existing site

1. Read the site's notes, its checklist, and check nobody else is working on it.
2. **The page goes into the generator**, never as a hand-written file next to the output.
3. Its search target and its job are written before the copy. A landing for ads: one offer, no
   navigation, its own WhatsApp message, noindex unless the agency owner wants it ranking.
4. Every per-page item, plus at least two internal links pointing to it (the home and its parent), a
   place in the sitemap with `lastmod` if indexable, its own share card.
5. QA, deploy, IndexNow for the new URL, sitemap resubmitted after the purge, copy document regenerated,
   log entry.

### Path C · A change on a live site

The client's words verbatim; the hard-fact grep across the whole build; QA; deploy; tell the agency
owner afterwards with the version and the live check. **Clean QA means deploy without asking**; a failed
QA means no deploy and a report of why. If the change touches a phone number, the uptime monitor keyword
changes in the same step.

### If your builder is an AI coding session

Most of our builds run this way. The rules that came out of it:

- **One session per site.** Before touching a generator, check whether another session is working on that client;
  agree who builds and who deploys before either does.
- **Patches that contain backslashes go through a file-editing tool, never through a shell heredoc**: the shell eats
  `\n` and `\s`, and it broke three generators.
- **Never open a file for writing before the new content exists**: opening in write mode truncates it, and a crash in
  between leaves an empty file.
- **Subagents are expensive and fallible.** Few, small, each in its own scratch folder (never the folder of the
  deliverable: one deleted a demo's assets while the main session was building there), and every number they report is
  re-run by hand before it reaches a client.
- **The session runs every phase it can and stops only at a human gate**, reporting as below.
- **Everything is logged as it happens**, with the exact files touched and every non-obvious fix in a dedicated field,
  so the next session never re-solves the same problem. Most of this playbook was distilled from that field.

### When the build session stops, what it reports

It runs every phase it can and stops only at a human gate. Each stop reports, in this order:
1. **What is live:** the URL, noindex or indexable, the deploy version.
2. **The checklist count** per area (✅ / ❌ / N/A) and the open gates by name.
3. **What waits on whom:** the agency owner (each item with its text, link or button ready) and the client.

Never "it's all done" with an open gate. Never a list of what was done without what is still open.

### The client folder, when the build is done

```
<CLIENT>/
  CLIENT.md  ONBOARDING.md  CHECKLIST.md  MISSING-INFO.md
  FORM-ANSWERS-<date>.md  TEXTS-<date>.md  SITE-COPY.md
  calendar script + the calendar PDF
  INVOICES/  LEGAL/LEGAL.md  RESEARCH/  MEDIA/
  _DESIGN/{PROMPT.md, BRAND/, PHOTOS/, DELIVERY/, README.md}
  SITE-TOOLS/   the generator and its data
  SITE/         the output, never edited by hand
  PLACEHOLDER/  worker.js  wrangler.jsonc
  DELIVERY/     the delivery document builder, docx and PDF
```

---

## Why it is built this way

Almost every failure on the first nine sites was **silent**: the site answered 200 and looked fine,
and the problem was caught by the agency owner, a later audit or the client. Built before the form;
two sessions on one site; CSS class collisions; http and www not redirecting; the purge missing the
sitemap; claims the client never made; one mailbox instead of two; delivery documents only when someone
asked. Each phase gate is one of those, made impossible to skip.
