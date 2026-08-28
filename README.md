# Web Playbook

Everything we know about building small-business websites that rank and convert.

This is the working knowledge of [Built to Click](https://builttoclick.com), a one-person
agency in Paraguay that builds sites and does local SEO for carpenters, glaziers, truck
dealers, builders and restaurants. It is not a tutorial and it is not theory. It is the
set of things we had to learn by breaking a production site, plus the checklist we run
before anything goes live.

Written down because the same problems kept costing us the same hours.

**Take any of it.** No attribution needed. See [LICENSE](LICENSE).

---

## What is in here

| File | What it is |
|---|---|
| [`CHECKLIST.md`](CHECKLIST.md) | The pre-launch checklist. Copy it, tick it, ship. |
| This file | Why each of those lines exists, plus everything that is not a checkbox. |

---

## Contents

1. [How we think about these sites](#1-how-we-think-about-these-sites)
2. [Structure: how not to look like a template](#2-structure-how-not-to-look-like-a-template)
3. [Motion](#3-motion)
4. [Performance](#4-performance)
5. [Technical SEO and indexing](#5-technical-seo-and-indexing)
6. [Local SEO and Google Business Profile](#6-local-seo-and-google-business-profile)
7. [Conversion and contact](#7-conversion-and-contact)
8. [Deploy and hosting](#8-deploy-and-hosting)
9. [QA: how to verify without lying to yourself](#9-qa-how-to-verify-without-lying-to-yourself)
10. [The expensive mistakes](#10-the-expensive-mistakes)
11. [Tools and what they cost](#11-tools-and-what-they-cost)

---

## 1. How we think about these sites

The client is a local business with between one and forty employees. Nobody there is going
to log into a CMS. The site has to do three things: show up in Google when somebody nearby
searches for the service, be believable in ten seconds, and get the visit onto WhatsApp or
the phone.

Everything below follows from that. A few positions we hold that are not obvious:

**Static beats a CMS.** Almost every site we build is flat HTML or Astro output on a CDN.
No database, no admin panel, no update treadmill, no plugin that breaks in eight months.
When the client needs a text change they message us and we deploy in five minutes. That is
a better deal for both sides than a CMS nobody logs into.

**We do not ship anything the client has to maintain.** No stock lookup, no live catalog,
no booking system, unless the business already has someone who will actually keep it fed.
An empty catalog is worse than no catalog. Prices and models go in prose and the
conversation closes on WhatsApp.

**Every account goes in the client's name.** Domain, hosting, analytics, Search Console,
the Google profile. We hold access, they hold ownership. This costs us leverage and it is
still the right call, and it removes the single ugliest conversation in this business.

**Copy is written for the buyer, not for the algorithm.** The FAQ is written from what
people actually ask on WhatsApp. If we cannot name a real person who asked the question,
it does not go in.

**Never say what you do not do.** No "we do not handle X", "we do not have Y", "that is not
available". Every limit gets reframed as what does happen. Negation in sales copy limits
the sale on the reader's behalf.

---

## 2. Structure: how not to look like a template

We pulled the markup of four of our own live homepages and put the section sequences side
by side. All four were the same site. Not similar: the same.

Every section was a full-width horizontal band, same vertical padding, content centered in
a 1120px container. Colors, type and copy changed. The architecture was identical, and
architecture is what a visitor perceives before they read a word.

If you build more than three sites a year you will land here too. What fixed it for us was
making the shape an explicit decision instead of a default.

### Pick an architecture before writing HTML

The order of the blocks decides what kind of site it is. These are the eight we rotate
through. Two live clients never get the same one.

| # | Archetype | Shape | Use it for |
|---|---|---|---|
| 1 | **Proof first** | work rail, then who did it, then how we work, then areas, then close | Businesses where the photo sells: construction, architecture, food, events |
| 2 | **Objection first** | a number as the hero, then an editorial comparison, then how, then proof | Markets where the buyer already has a competing quote in hand |
| 3 | **Editorial document** | manifesto, sticky index, long-form body, fees, questions | Services the buyer researches before contacting: legal, immigration, accounting, health |
| 4 | **Dense catalog** | split hero, long service list, typographic areas | Many services, user is hunting one. Glass, parts, hardware, technical service |
| 5 | **Guided scroll** | curtain hero, sticky split, sticky stack, proof | Products that must be explained in order. Uses two scroll effects, so it gets no others |
| 6 | **Trust first** | face-and-name hero, review strip, process rail, price | When the purchase is the person: solo professionals, clinics, small firms |
| 7 | **Price up front** | split-color hero, what is included, price, objections | Closed, publishable pricing. Converts fewer people, better qualified, and kills dead quotes |
| 8 | **Place led** | full-bleed hero, image accordion, gallery rhythm, availability | When you are selling being somewhere: inn, venue, showroom |

Then pick a **vertical rhythm** (the padding and max-width system) and stick to it, and pick
**at most three motion effects** for the whole site. Keep a rotation table of what each
active client got. If the table is not updated the system is worthless.

### The tells that make a site read as generated

These are the ones we were guilty of on all four sites:

- **A small uppercase eyebrow label above every section.** One per three sections, maximum.
  This alone produces the template rhythm.
- **Numbering sections** (`01 · Services`, `02 · Process`). Position on the page already
  categorizes. The number adds nothing and signals a kit.
- **Grids of three or four identical cards.** The default. There is almost always a better
  shape for that content.
- **Everything centered at the same width with the same padding.** Vary the rhythm.
- **Em dashes.** House rule, and separately a reliable tell of generated text.
- **Glow, and juicy buttons.** If there is a shadow, `spread = -(blur × 0.6)`. Buttons get
  `inset 0 1px 0 rgba(255,255,255,.16)`, a one-pixel edge of light inside the top border.
  That is what makes a button read solid instead of shiny.

### Two CSS traps that bit us here

**`position:sticky` dies silently if any ancestor has `overflow:hidden`.** No error, no
warning, the element just scrolls normally. This is the most common layout bug we hit and
it costs twenty minutes every time because there is nothing to debug.

**A new generic class name in a large stylesheet is a silent collision.** We added a
`.tabla` class for a wood slab graphic on a site that already had a `.tabla`. Grep before
naming, or namespace everything.

**Specificity ties are won by whatever is lower in the file.** We had
`.tabla-l td:last-child{text-align:left}` on line 289 and `.tabla td:last-child{text-align:right}`
on line 310. Same specificity, so every single-column list table rendered right-aligned for
months. Fix was `.tabla.tabla-l td:last-child`. The symptom throws no console error, so you
only find it by looking.

---

## 3. Motion

We run a scroll-animation system with no library and no build step: one CSS file, one JS
file, and `data-*` attributes in the markup. About 21 KB unminified.

### The three numbers that do all the work

If you take one thing from this document, take these. It is not the code, it is the values.

**1. One easing curve across the entire site: `cubic-bezier(0.16, 1, 0.3, 1)`**

That curve covers 96% of the distance in the first 350 ms of 700 ms. The eye reads
*"it was already there"* instead of *"it is arriving"*. That is the whole effect. Swap it
for `ease-in-out` and the site feels cheap and you will not be able to say why.

**2. Elements travel 13 px on entry. Not 60, not 100.**

AOS and the other scroll libraries default to 60 to 100 px. That distance is exactly why
you can tell at a glance that a site is using one.

**3. Graphics fire at 89% of the viewport height, not 100%.**

This is what makes the visitor feel the animation *started when they arrived*. Fire earlier
and it finished before they got there, so it reads as a static image. Fire later and you
see the jump.

Everything else is plumbing around those three numbers.

**The rule that is not in the code:** if you notice an animation, it is mis-calibrated.

### The motion traps, ordered by how much they hurt

**1. A paused element with no one to un-pause it stays paused forever.**

Our CSS pauses everything carrying `data-anim`, and the JS only releases elements inside a
`[data-widget]` container. An orphan `data-anim` is never released by anyone.

What makes it severe: if the element is an SVG stroke with `stroke-dashoffset:1` inline, it
is not *still*, it is **invisible**. The section renders empty. And the HTML is correct, the
CSS is correct, the keyframe is correct. There is nothing to debug.

It hit us once with 63 elements at the same time: checkmarks, crosses and icons across two
grids that simply did not exist in the real browser.

The fix is one attribute. The prevention is a static linter you run after touching any
graphic, exiting non-zero so it works as a pre-commit hook. Visual QA does not catch this,
for the reason in trap 3.

**2. With `prefers-reduced-motion` on, SVG strokes disappear.**

Killing the animation with `animation: none` freezes the inline `stroke-dashoffset: 1`.
Offset 1 means the stroke is fully run out, which means an invisible path. This affects real
users, and "reduce motion" is common on iOS.

```css
@media (prefers-reduced-motion: reduce){
  [data-widget] [stroke-dasharray]{ stroke-dashoffset: 0 !important; }
}
```

**3. If the JS fails to load, the page is blank.**

Reveal elements start at `opacity: 0`. If the script does not run (network error, blocker, a
typo throwing before the observer is attached) nothing ever reveals. That is not "no
animation", that is invisible content, and Google sees an empty page.

The net is a class on `<html>` that the script removes as its first statement:

```html
<html class="no-js">
```
```css
.no-js [data-reveal]{ opacity:1 !important; transform:none !important; }
.no-js [data-anim]{ animation-play-state: running !important; }
```
```js
document.documentElement.classList.remove('no-js');  // first line
```

Worst case becomes "appears without animation" instead of "does not appear". Always take
that trade.

**4. If entry animations hang off a `js` class, set the class inline in the `<head>`.**

Never from a deferred script. A deferred script runs after first paint, so you get a flash
of unstyled or unrevealed content.

**5. A safety animation with `forwards` kills your scroll reveals.**

We added a CSS fallback that revealed everything after N seconds in case the observer never
fired. The `forwards` fill then shows every element at N seconds regardless of scroll
position, which silently disables the entire scroll system. The safety net has to be a class
toggle, not a timed animation.

**6. Never put a scroll reveal on a `position:fixed` element at the bottom edge.**

If the reveal uses a negative bottom `rootMargin`, a fixed bottom bar sits permanently
outside the trigger zone and never appears.

**7. `loading="lazy"` and a reveal class on the same image fight each other.**

The browser's lazy fade-in overrides your reveal transition. Pick one per image.

**8. Two copies of the same looping widget breathe in sync.**

A float animation with the same duration on two graphics on one page makes them move in
unison, which reads as robotic instantly even if the viewer cannot name what is wrong. Use
durations that are mutually prime per page. Ours ended at 7.4s, 7.6s, 8s, 8.2s, 8.4s, 8.6s,
8.8s. Easy to break when you copy a widget between pages.

**9. Everything runs once.** Our observers `unobserve()` on fire. Scroll back up and nothing
repeats. That is deliberate (repeating feels cheap and costs CPU forever) but it is a
decision, not a law.

**10. Accordion panels measured with `scrollHeight` get cut off.** If the panel holds an
image without declared `width`/`height`, or a font that changes the height when it loads,
the measurement is taken before the content settles. Re-measure on resize, or accept a
`max-height` large enough to never clip.

**11. Splitting a headline into per-word spans breaks anything that touches those nodes.**
Fine in static HTML. In React it must run after render and survive reconciliation.

**12. Horizontal carousel plus vertical reveal equals a phantom scrollbar.** `overflow-x:auto`
drags `overflow-y` to `auto`, so any positive `translateY` on a child creates a vertical bar
and the block reads like an embedded iframe. Hiding the bar is not enough: give the rail
`padding-bottom` greater than or equal to the translate distance, or the cards sit clipped
while the entry animation runs.

**13. Hiding a scrollbar and keeping the element draggable is three declarations, not one.**
`scrollbar-width:none`, `-ms-overflow-style:none`, and
`::-webkit-scrollbar{width:0;height:0;display:none}`. Setting `::-webkit-scrollbar{height:6px}`
leaves the bar alive, and on Windows it renders thick and with arrows.

**14. Cost on old phones is real and we have not fully paid it.** Several hundred animated
nodes and dozens of keyframes, with infinite loops running off-screen forever. Two
mitigations worth doing: `content-visibility: auto` on graphic containers, and stopping
infinite animations when the widget leaves the viewport.

---

## 4. Performance

Most of what we believed about our own performance was wrong until we measured properly.

### The measurement rules come first

**One Lighthouse run proves nothing.** Six runs of the identical build gave us 71, 69, 94,
92, 93, 89, with LCP between 2.6 s and 6.5 s. The two bad ones were home-network
degradation, visible as Speed Index of 5.7 s against 1.6 s. **Three runs minimum, take the
median**, or read the structural audits, which do not move with the noise.

**PageSpeed Insights without an API key is unusable.** Sixteen consecutive attempts, all
429, across half an hour. Install Lighthouse locally and point `CHROME_PATH` at whatever
Chromium you have. Same audits, no quota, and the JSON diffs between runs.

**Measuring against localhost is fine for Total Blocking Time and structural audits, and
useless for FCP and LCP.** Python's `http.server` does not compress and adds its own
latency. Field-adjacent metrics get measured against production.

**Lighthouse can exit with a permissions error while the report is already written.** The
failure is the launcher deleting its temp folder after saving the JSON. Check whether the
output file exists before calling the run lost.

**Mobile screenshots are already inside the Lighthouse JSON.** The final screenshot and the
filmstrip thumbnails are base64 data URIs of the real mobile load, frame by frame with
timings. Decode them instead of fighting a headless browser.

### What actually moved LCP for us

**The LCP element was not the image and not the H1.** On one site we split the H1 into
per-word spans, so no single span was a large block, and the LCP candidate silently became
the hero paragraph. That paragraph carried a reveal, so it started at `opacity: 0`, and LCP
does not register until the fade completes. Measured render delay of 1727 ms and 5334 ms on
two runs of the same page. LCP 2.2 s against 5.8 s, score 90 against 69.

The fix: mark the first section of each page as the hero and force its reveal elements to
`opacity: 1`, keeping the staggered entrance on the transform only. **Above the fold gets
painted, not revealed.**

**On another site the LCP was waiting for the IntersectionObserver callback.** The hero
started hidden and turned on when the observer answered. On a phone with 4x CPU throttling
that callback arrived about three seconds after FCP. The fix is that anything already above
the fold is never observed: read all the bounding rects in one pass, reveal inside a single
`requestAnimationFrame` (that frame is exactly what the CSS transition needs), and hand the
observer only what is below. Animation looks pixel-identical. LCP went from oscillating
between 3.0 s and 6.1 s to a stable 3.01 s.

**`font-display: optional` did not help.** We tested it, LCP was unchanged and the score
dropped a point or two. The font swap was not the delay, the animation was. We stayed on
`swap`, which shows the right typeface on the first visit.

### Fonts

**Self-host. Always.** It kills a two-origin connection chain, and Google Fonts' CSS is a
render-blocking round trip you cannot preload past.

To extract the files, request the `css2` URL with a modern browser User-Agent. With an old
UA it returns nothing usable. Copy the `unicode-range` blocks verbatim. A variable font is
one file per subset covering every weight: roughly 31 KB and 47 KB for the two families we
use most. `crossorigin` on `<link rel=preload as=font>` is mandatory even when the file is
on your own domain.

**What makes a variable font heavy is the axes, not the glyphs.** Subsetting glyphs on one
family saved 2.7 KB. Clamping the `wght` and `opsz` ranges to what the CSS actually uses
saved 41 KB, and pinning the optical size on the italic (used at one size) saved another 39
KB. Look at the real `font-size` and `font-weight` values in your CSS before you subset.

**The full fix for text resizing on load is three pieces together**, not one: self-host,
preload the critical woff2, and a metric-compatible fallback using `size-adjust`,
`ascent-override` and `descent-override`. Compute the overrides as `metric / (upm × sizeAdjust)`.
Never derive `size-adjust` from the OS/2 `xAvgCharWidth`: every foundry averages it on a
different basis and one of ours came out at 138%, which is absurd. Measure the real mean
advance of a sample string against your fallback font.

**Renaming font files means keeping the old ones on the server.** If the CSS is cached for
four hours, a returning visitor inside that window requests the old filenames with their
cached CSS. Delete them and they get a 404 and a system-font fallback until the cache
expires.

### Images

**Pre-darken a hero that is going to sit under a dark overlay.** Encoding one hero at 0.75
brightness before compression took it from 288 KB to 142 KB at the same quality, because
dark regions compress better. The CSS then compensates with a lighter filter. Identical
final look, half the bytes.

**`repeat(auto-fit, minmax(Npx, 1fr))` is the classic cause of mobile horizontal scroll.**
When `N` exceeds the viewport minus padding, the track overflows and there is no warning.

**Lazy images must be measured after a scroll sweep, not before.** Otherwise every one of
them reports as broken or zero-sized.

**Analytics deferred on `scroll` is not deferred.** Browser scroll restoration fires the
event by itself during load, so the tag started at 99 ms exactly as before. Use
`pointerdown`, `keydown` and `touchstart` only. You can verify it by comparing the script's
`startTime` in the resource timing entries against `loadEventStart`.

---

## 5. Technical SEO and indexing

### "The sitemap is healthy" and "the page is indexed" are different facts

Our own crawl returned 201 of 201 URLs OK across five client sites, and Google still had
dozens of those URLs unindexed. The crawl measures the site. Only the index measures the
index. An audit that reports the first and implies the second is lying.

The Search Console **URL Inspection API** gives you the real per-URL status. The
**Indexing API does not apply to normal pages**: it officially covers only job postings and
broadcast events, and using it for anything else is out of policy and ignored. The "Request
indexing" button is UI only and a human has to press it. What you *can* automate, and what
actually moves the needle, is submitting the sitemap by API.

### The diagnosis for "Discovered, currently not indexed" is internal links

Not content quality, not crawl budget, not anything exotic. Download every page in the
sitemap, extract the hrefs, normalize, and count inbound links per URL.

On one site it fell out immediately: the three city pages had exactly one inbound link each
and all three were unindexed, against 36 inbound links for the pages that were indexed.
That is cheaper and far more conclusive than reading the coverage report.

Watch the normalization when you do this. Filtering with `path.split('/')[-1] != parent`
hid a legitimately-linked child page whose slug repeated its parent's, and reported a false
orphan.

### Search Console gotchas

- **The emails are a snapshot of an old crawl, not today's state.** Two URLs flagged as
  "excluded by noindex" had `lastCrawlTime` values from the morning *before* the noindex was
  removed. The site had been clean for days. Always compare `lastCrawlTime` against the date
  of your fix before touching anything.
- **Duplicate properties send duplicate emails for the same site.** Several of ours had both
  a domain property and a URL-prefix property. One also had a live `www` property with no
  sitemap submitted while all `www` traffic 301s to the apex.
- **Different credentials see different properties.** Our service account listed seven
  properties, and the owner's OAuth token listed nine, including the two we were looking for.
  To find out whether a property exists, ask with the account that created it.
- **A domain property can be created and verified without a browser** in four API calls:
  request a verification token, write the DNS TXT record, call verify (with retries, DNS is
  slow), then add the site. Expect the first verification attempt to fail and the second to
  pass.
- **Google's own notification emails may not land where you expect.** Ours went to the Zoho
  mailbox tied to the Google account that verified the property, not to any Gmail inbox.

### `noindex` hides in more places than the HTML

**Check the HTTP header too.** Grepping the HTML for `noindex` is not enough: `X-Robots-Tag`
lives in the response headers, and on Cloudflare Pages it is set from a `_headers` file, not
from a meta tag. Check with `curl -sI`.

**And it survives in the edge cache after you remove it.** Both the `noindex` header and a
stale `robots.txt` outlived their source files by long enough to send us hunting for a bug
that no longer existed. Purge the cache, then re-check.

**Cloudflare Pages adds `x-robots-tag: noindex` to branch preview deploys only**, not to a
production project on a custom domain. Good to know before you panic, and good to know if
you were relying on preview URLs staying private (they are noindexed, not protected).

### A cross-domain canonical is not enough to hide a staging mirror

We serve client demos and mirrors on subdomains of our agency domain. One of them served an
entire live client site with a correct canonical pointing at the client's real domain on
every page, and Google indexed it anyway. **A canonical is a hint, not an instruction.**

The mirrors that stayed out of the index were the ones using a real `X-Robots-Tag: noindex`
or a meta robots tag. Rule: a mirror of a site that is already live gets a genuine
`noindex`, or a 301 to the client's domain. Nothing softer works.

Related: `site:yourdomain.com` includes every subdomain, so a raw count from that operator
is meaningless if you host demos. Read the URLs one by one.

And a canonical pointing at a URL that itself 301s is a broken signal. Point it at the final
destination.

### Schema

**Single source for the FAQ.** Generate the visible `<details>` markup and the `FAQPage`
JSON-LD from one list. We have 32 questions in two languages. Maintaining that by hand
guarantees drift, and a `FAQPage` that does not match the visible page is a manual action
waiting to happen.

**An `AggregateOffer` without `lowPrice` is reported as invalid, not incomplete.** Google
flags it as a critical error and disables the whole feature. And since price is precisely
what the rich result displays, marking up a product with no price gains you nothing anyway.
**If there is no real price, do not mark up the product.** This applies to every catalog
that says "call for price".

**Schema markup does not cause "limited ads" in Google Ads.** Those are separate systems.
We had to verify this for a client who had been told otherwise.

### Redirects

To audit redirects you need the raw 301/308 without following it. In Python, subclass the
redirect handler to return `None`. Send your own User-Agent, because Cloudflare returns 403
error 1010 to the default `urllib` agent.

Also: `urllib` against Cloudflare takes about 15 seconds per request where `curl` takes 0.6,
same URL, same UA. A 37-page crawl becomes nine minutes. For crawling, use `curl` or
`requests`.

---

## 6. Local SEO and Google Business Profile

The site is half the job. For a local business the profile is usually the half that pays.

**What moves the profile:** the primary category, the link to the site, review volume and
recency, and photo volume. That is most of it.

**What does not:** geotagging photos. Google strips EXIF from every photo uploaded to a
business profile. The geotag never reaches the server and is not a ranking signal. You can
do it anyway because it breaks nothing, but do not sell it to a client as a lever.

**`is_claimed: true` does not mean the profile is fine.** Claimed profiles routinely have no
hours, no description, one Street View photo and the wrong category. Claimed is the floor,
not the finish.

**Claiming versus accidentally creating a duplicate, told apart on screen:** in the address
step, if the city and postal code come **pre-filled**, the flow is reading an existing
profile and you are claiming. If you had to type the business name from scratch, it is a new
listing and you should back out. A duplicate orphans the original with its photos and its
age, and merging afterwards means fighting support.

**Transferring primary ownership does not remove you.** The transferring account drops to
Owner, not Manager: still edits everything, uploads photos, replies to reviews. The only
thing lost is the ability to remove the primary owner. The new primary can remove you,
though, so understand the relationship before you do it.

**Verify a photo upload from the public view, no dashboard needed.** Once owner photos
exist, the photo block starts showing the "Today" and "By owner" filters. No owner photos,
no filters. Cheap proof that a bulk upload landed.

**Re-read a profile you are actively working on before every version of a client document.**
Ours changed the business name and gained photo filters inside a 50-minute window. Writing
the new version from what you read an hour ago ships stale facts.

**Write client reports in two blocks: "loaded" and "prepared".** Category, website, phone and
hours are verifiable from the public view, so you can state them as done. Description,
services, products and photos are not, so they go in a separate "prepared and uploading"
block. Splitting it is how you avoid overclaiming when half the work is visible and half is
not.

### NAP consistency, and where the wrong numbers come from

Name, address and phone identical on the site, the profile and every directory. No variants.
This is dull and it is real.

The discipline is finding the variants. Four leads in a row had more than one phone number
in public circulation, and one had four: one on WhatsApp, one on the profile and Facebook,
one under a related company, and two more legible **on the photo of the shop's own sign**.
The storefront sign is a source of stale phone numbers that we had been ignoring completely.

Also watch for two businesses trading under the same name with different owners. We nearly
merged two same-named entities into one profile in a client document. Different addresses,
different phones, and two people with the same surname and different middle names. Do not
assume a relationship you cannot prove.

**Google may normalize the address into something you did not write.** One client's address
resolved to a route code plus kilometer marker rather than the avenue name. Whatever the
profile settles on becomes the canonical NAP, and the site has to match that, not your
preference.

---

## 7. Conversion and contact

**WhatsApp button on every screen, with a pre-filled message that differs per page.** A
visitor arriving on the roofing page should open a thread that already says roofing. This
is the single highest-leverage thing on the whole site in our market, and it costs nothing.

**Fixed bottom bar on mobile** with WhatsApp and call, always visible. Not a floating bubble
that covers content.

**A thank-you page with its own URL after every form.** Without it you cannot measure a
conversion, and "the form works, I think" is not a status.

**Test the form end to end before launch.** Submit it, confirm the email arrives, confirm the
redirect lands. We have shipped forms that posted successfully into nothing.

**On form length**, from the research we ran before building an internal one: the
conversational format (one question per screen) gains roughly 15 to 25% completion on
surveys and 20 to 40% on forms of five to ten fields, and shows **no gain, or a loss**, on
forms of one to three fields. Do not add a wizard to a three-field form.

The honest counterpoint we gave ourselves and would give anyone: the form is usually not the
bottleneck. The ask is. A shorter form does not fix nobody wanting to fill it in.

**A dedicated demo badge, not a rotated ribbon.** For sales demos we mark the site as a demo
with a fixed pill in the corner opposite the WhatsApp button. The rotated corner ribbon we
used before ate the client's logo at certain widths.

---

## 8. Deploy and hosting

We deploy static output to a CDN (Cloudflare Pages, mostly) and point a custom domain at it.
The recipe is boring and reliable. These are the parts that are not.

**A new subdomain returns 522 for its first minute or two.** Every time. It is not broken,
the certificate and routing are propagating. Wait 60 to 90 seconds before debugging.

**The first 200 lies.** We have had `curl` return 200 while the HTML was still the previous
page and an image asset was returning 522. **Verify with the title plus one asset, never
with the status code alone.**

**Deploys are not atomic across files.** Twice we had the new JS live while the HTML was
still the old one, for about 30 seconds. Worse, a freshly deployed project can serve the
`index.html` **as a 200 fallback** for assets it cannot find yet, so your CSS and your photo
return HTML with a success status. **Check content-type and size, not just status.** If
something "does not work" right after a deploy, wait 30 seconds and look again before you
touch code.

**The default cache header will strand your users on the old version.** Cloudflare Pages
serves everything with `max-age=14400`. Without changing that, a returning visitor sits on
the four-hour-old build. For an app-like site you need three things together: a `_headers`
file, a version stamp in the asset URLs, and the HTML served network-first.

**And the opposite mistake, which is worse.** Setting `Cache-Control: immutable, max-age=1 year`
on `/assets/*` while changing `site.css` and `site.js` **under the same URL** means browsers
that already have them will never revalidate. Ever. Immutable requires a content hash in the
filename. Immutable plus a stable filename is a permanent bug.

**Version your assets or lose an hour.** `motion.css?v=3`. The classic loop is: you ship the
fix, the client reloads, "still broken". The site is fine, the browser is holding the old
file, and a normal reload does not always clear it.

**Diagnostic rule:** when the client says it is broken and `curl` says it is fine, render the
live URL headless before you touch a line of code.

**Changing a phone number on a client site can break its uptime monitor.** Our monitors use
the WhatsApp number as the keyword to detect a defaced or half-deployed page. A deploy that
changes the number leaves the monitor searching for text that no longer exists, which fires
a false outage on a site returning 200. **Changing the number and changing the monitor
keyword are one step, not two.**

**A number that appears in one place appears in four.** When a hard fact changes (a phone, a
material, a measurement, an origin), grep every variant across the whole build, not just the
place where you noticed it. One correction turned out to be four paragraphs across two pages
plus a spec table.

**If the headline is baked into the social card image, changing an H1 changes the image.**
Regenerate the `og:image` after touching a headline, a phone number or an address.

**Registry and domain paperwork:** the invoice for a country-code domain is issued to the
domain's registered billing contact, not to whoever paid. If you want the expense on your
books, put yourself as billing contact when you file the request, not after.

---

## 9. QA: how to verify without lying to yourself

This section exists because our QA passed while the site was broken.

**A check that cannot fail is not a check.**

To render a long page headless you generally have to force reduced motion. But that CSS
branch is exactly the one that forces stroke offsets to zero and reveals everything. So the
screenshot comes out perfect while the real site is broken. The static linter catches what
the visual pass structurally cannot. **You need both, not one.**

**Headless browsers do not fire `IntersectionObserver` below the fold.** With a virtual time
budget they do not composite frames the way a real scroll does, so everything below the fold
renders at `opacity: 0` and the page looks truncated. This is the render, not the site. We
chased it as a bug before working that out.

Two ways out, depending on what you are testing:

- To see the static state (and incidentally validate the reduced-motion path), force reduced
  motion.
- To see the system actually firing, put the page in a very tall iframe inside a QA wrapper:
  `<iframe src="page.html" width="1440" height="18000" scrolling="no">`. The iframe has a
  real, enormous viewport, the observer considers everything in view, and you get the whole
  page revealed and animated.

**The same iframe trick fixes mobile QA.** Edge headless ignores `--window-size` for layout
width: it renders at roughly 500 px and then crops the screenshot to the width you asked for.
The mobile layout is correct but arrives clipped, which looks exactly like site overflow. It
is not overflow. We lost two rounds chasing a bug that did not exist. Use a 375 px iframe.

**Under a virtual time budget, `setTimeout` fires but CSS transitions do not resolve.** So
anything gated on a transition end never completes in that environment.

**Reading a headless render to verify it can fool you.** Copy the output file to a new name
and read that copy, otherwise you cannot tell whether you are looking at the real file or a
cached one. In our case the file was genuinely stale, and the copy is what proved it.

**Some browser-automation panes report `innerWidth/innerHeight` as 0 when hidden**, do not
fire intersection observers, do not repaint, and carry buffered console messages from the
previous page. Open a fresh tab per check, and prefer reading the DOM over screenshots when
the pane is not visible.

**`naturalWidth === 0` does not mean the image is broken.** We flagged a valid WebP that the
server was returning with a 200 as broken. It was a transient state on the pane's first
render. Before hunting the bug: load the file manually with `new Image()` and a cache-buster,
and reload. On reload it was fine and we changed nothing.

**Removing a component means sweeping three layers**: the markup, its CSS, and its JS. Grep
for every identifier the component used, and run the grep against the deployed HTML as well
as the source.

**Strip the query string before resolving links against disk.** An offline link check with
cache-busting `?v=hash` in the URLs reports every asset as missing.

**The CSSOM is the cheap way to rule out "my CSS is not being applied."** Read the computed
rule rather than guessing from the source file.

**To confirm a mobile fix did not touch desktop, compare the resolved value, not the CSS.**

**Check horizontal overflow programmatically**, comparing `scrollWidth` against
`clientWidth`, rather than by eyeballing screenshots. And know your false positives: a
deliberately horizontal-scrolling rail will always report elements off-screen, and that is
correct.

---

## 10. The expensive mistakes

The greatest hits, in the order we would warn a new person about them.

1. **The animation trap that renders sections invisible while the code looks perfect.**
   Costs an hour every time until you have the linter. Section 3, trap 1.
2. **Concluding from one Lighthouse run.** Our A/B tests were noise for weeks.
3. **Believing a canonical would keep a staging mirror out of the index.** It will not.
4. **Trusting the visual QA that structurally cannot fail.**
5. **Assuming the LCP element is the hero image.** Twice it was neither the image nor the
   headline, and both times an animation was the actual cost.
6. **A `noindex` in an HTTP header, invisible to a grep of the HTML.**
7. **`immutable` cache headers on filenames without a content hash.** Unrecoverable for
   anyone who already loaded the page.
8. **Chasing a headless rendering artifact as if it were a site bug.** Twice, two rounds each.
9. **Reporting sitemap health as if it were index coverage.**
10. **Changing a client's phone number without updating the uptime monitor keyword.**
11. **Reusing the same page architecture on every client** until four sites were visibly one
    site.
12. **Marking up products with no price**, which produces Search Console errors and zero
    rich results.

A pattern worth naming: **most of these are silent.** No console error, no failed build, no
red status code. The site returns 200 and looks fine, and the thing that is broken is
invisible by construction. That is why the checklist exists, and why the two rules we would
keep above all others are:

- **Verify with a second, independent signal.** Status plus content type. Crawl plus index.
  Visual pass plus static lint.
- **When something works differently in production than locally, look at production before
  changing code.**

---

## 11. Tools and what they cost

We run on free tiers wherever a free tier is honest, because the agency is one person.

| Job | What we use | Cost |
|---|---|---|
| Hosting and CDN | Cloudflare Pages | Free |
| DNS | Cloudflare | Free |
| Analytics | Google Analytics 4 | Free |
| Heatmaps and session replay | Microsoft Clarity | Free, with a low API export rate limit |
| Index and coverage | Google Search Console | Free |
| Performance | Lighthouse, installed locally | Free |
| Uptime monitoring | HetrixTools | Free tier permits commercial use, which is why we are not on the better-known alternative |
| Local rank data | DataForSEO | Pay per call, fractions of a cent |
| Forms | Whatever is free and lets you own the data | Free |

A note on rank tracking: for local results outside the United States, general web search
APIs are not usable. English-language search tools default to US results, and querying
Google directly from a script gets you a captcha. A SERP API with an explicit location
parameter is the only reliable way to know what a search actually returns in a given city,
which matters enormously when you are about to tell a prospect they do not appear.

Two things that come out of that data and are worth knowing anywhere:

- **In a small market, the number that persuades is not the client's position, it is how many
  listings Google returns at all** for that query in that place. "Google shows five results
  for this and you are not one of them" lands harder than a rank number.
- **A "no results" code from a SERP API is not an error.** It frequently means Google builds
  no local pack for that phrase, for anybody. Reporting that as "you do not appear" is
  technically true and materially dishonest. Separate the two cases.

---

## Sources

Everything here came out of our own work log between June and August 2026, mostly from the
field we keep for non-obvious fixes. The design section owes its framing to publicly
available design-system and interface-guideline write-ups that we read and then argued with.

Corrections and disagreements are welcome in the issues.

*Built to Click · Joaquín Caballero · [builttoclick.com](https://builttoclick.com)*
