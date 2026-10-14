# 10 · Conversion and tracking

In our market the conversation happens on WhatsApp. The site's job is to start it with as much context as
possible, and to let us count honestly how many people it started it for.

---

## WhatsApp, done properly

- **A WhatsApp button on every screen, with a message already written for the page and the section it came from.**
  Someone arriving on the roofing page opens a chat that already says roofing; a button under the price table says
  which price. It is the highest-leverage thing on the whole site and it costs nothing. A different message per
  section also tells you which section sold.
- **Use `https://api.whatsapp.com/send?phone=<number>&text=<urlencoded>` when the text has emoji.** `wa.me` redirects
  to that address and the redirect turns every emoji into "�". Texts of 12,000 characters still pass.
- **A fixed bottom bar on phones** with WhatsApp and call, always on screen. A bar with its own height that the page
  pads for, never a floating circle over the content. A floating bubble once covered the "add" column of a product
  list on phones, and another covered a drawer's close button.
- **The bar must stay usable while typing in a form.** Since Chrome 108 the keyboard resizes only the visual
  viewport, so fixed bars get covered: hide the bar while a field has focus, or position it against the visual
  viewport.
- **One primary action per screen.** A second option is a text link, not a second button of equal weight.
- **The objective decides the CTA** ([02-strategy.md](02-strategy.md)). If the objective is a verified credential, the
  main button downloads the press kit and WhatsApp is secondary; if it is a store visit, the map, the hours and the
  phone go first.
- **`tel:` links** for every phone number, and a sentence about who answers and when for buyers over 45.
- **A routing selector** when visitors arrive in different situations (buying, trading in, selling): the choice changes
  the message. **An instrument** (quote builder, configurator, order builder) when the answer depends on inputs: the
  result becomes the message.
- **On demos**, a fixed "DEMO" badge in the corner opposite the WhatsApp button. A rotated ribbon ate the client's logo
  at some widths.

## Forms

- **A thank-you page with its own URL after every form**, so the conversion is measurable. "The form works, I think" is
  not a status.
- **Test the form end to end before launch:** it submits, the email arrives, it lands on the thank-you page. We have
  shipped forms that posted successfully into nothing.
- **Form mechanics:** labels above the fields, `autocomplete`, `inputmode`, `enterkeyhint`, required and optional both
  marked, inline validation, no account, the fewest fields that do the job.
- **On form length**, from research we did before building one: the conversational format (one question per screen)
  gains roughly 15 to 25% completion on surveys and 20 to 40% on forms of five to ten fields, and shows **no gain, or a
  loss**, on forms of one to three fields. Do not add a wizard to a three-field form.
- **The honest counterpoint:** the form is usually not the bottleneck; the ask is. A shorter form does not fix nobody
  wanting to fill it in.

---

## Tracking

### What gets installed
- **Google Analytics 4**, a property per site created by script (time zone, currency, the custom dimensions
  `wa_number`, `wa_message` and `button_location`, and `whatsapp_click` marked as a key event; `tel_click` too).
- **Microsoft Clarity** for heatmaps and session recordings, as a **Website** project. Its project ID (the one in the
  tag) and its data-export token (to read numbers by API) are different things: having one does not give you the other.
- **The Meta pixel only when the client sends their pixel or ad account.** Not before.
- **An uptime monitor** whose keyword is the site's WhatsApp number (a defaced or half-deployed page loses it).
- Every ID written down in one internal register.

### How it is installed
- **The tags live in the generator, never injected into the output by hand.**
- **They run only on the real host** (a hostname check in the snippet), so previews, demos and local builds never
  pollute the numbers.
- **Deferred** to the first interaction or about 3.5 s, never on `scroll` ([07-performance.md](07-performance.md)).
- **Do Not Track respected** when the privacy page promises it.
- **Events fire on clicks only** (WhatsApp, call, form send, builder send). **A conversion never fires on page load.**
- **No personal data in events.** Names, engraving texts, phone numbers typed by the visitor: masked or left out. On
  our own site, GA4's automatic "outbound clicks" leaked visitors' numbers from a link-generator tool into reports; we
  turned it off for good and send our own `button_click` events with an ID made of the page zone and the button text.
- **Our QA tooling blocks the tags** in every automated browser run, so an audit never lands in a client's analytics.
  The live tracking check is the one exception, run on purpose at launch.

### Who owns the accounts
We create and manage analytics, Search Console and session recordings under the agency, and share them only if the
client asks. The domain and the mailboxes are the client's, in their name. (Version 1 of this playbook said every
account goes in the client's name; we changed that: clients never logged in, and we are the ones who read the numbers
every month.)

### Measure the objective, honestly
- **WhatsApp counts people, not taps.** "6 people opened your WhatsApp" is true when 7 taps came from 6 people.
- **An order sent to WhatsApp is a lead with a cart, not a sale.** The browser reports `generate_lead`; a purchase is
  reported from the server only when the seller marks the order as sold.
- If the objective is a verified credential or staying in memory, measure the download or the save-the-contact, not
  only WhatsApp clicks, or you will report a failure that did not happen.
- Leave out taps that look like our own tests (our city, desktop, direct traffic, bursts within one hour) and say so.

### After launch: the monthly report
On the 3rd of each month a scheduled job pulls the previous month for every live client (analytics, Search Console,
session recordings, uptime) and drafts a short WhatsApp message for the client, which the agency owner rewrites and
sends. Rules: fewer than 14 days live in the month means no draft yet; a search named to the client needs at least 5
impressions, and "first page" means position 10 or better; a page missing from Google is diagnosed by script (Google's
state, last crawl, the live robots tag), never guessed. One report about a client's numbers turned into an upsell
conversation the same afternoon.

---

## Field notes from the log

**WhatsApp links and builders**
- **Build the WhatsApp URL inside the tap handler, with no `await` before navigating.** iOS hands off to the app only
  from a direct user gesture.
- **A message builder that works without JavaScript:** make every option chip a real `<a href="...wa link...">`. The
  script prevents the default, toggles the chip's state and `aria-pressed`, rewrites the message preview and every
  WhatsApp link on the page. An empty-value chip ("Other") marks but adds no text.
- Those chips inflated a key event, because the tracker listened to every `a[href]`. Mark wired chip lists with a data
  attribute and skip them in the tracker; without JavaScript the attribute never appears and real navigation still counts.
- **To hide a floating WhatsApp bubble while a builder is on screen, observe the builder card with threshold 0**, not the
  whole section at 25%: a section taller than four phone screens never reaches 25%.

**Analytics**
- **Make conversions easy to change:** one config object at the top of the tracking file mapping each trigger to an event
  (`whatsapp_click`, `tel_click`, `cta_click`, off), one capture-phase listener on links reading a `data-loc` attribute for
  `button_location`, and the tag injected from that same file so the ID lives in one place.
- Analytics directly, without a tag manager, is a deliberate choice: a container costs load time. One gtag.js serves both
  Analytics and Ads.
- Key events beyond the first can be created through the Admin API (`keyEvents` with `countingMethod:
  ONCE_PER_EVENT`).
- The realtime Data API refuses `eventName` and `activeUsers` in one request: query them separately. People summed across
  months double-count; totals since launch need a query with no date dimension.
- **Check a client's "N people wrote to me" against analytics:** `whatsapp_click` broken down by date, hour, country, city,
  device, page, source and `button_location` shows each tap. Analytics' channel list now includes an "AI assistant" source.
- **Our `whatsapp_click` sent the full pre-written message as a parameter**, and on one site that included what a visitor
  typed into a personalisation field (sometimes a name). Analytics' terms forbid personal data: drop or mask free-text
  lines, and grep every site for the parameter.

**Proving the tags work**
- **Without a dashboard:** `performance.getEntriesByType('resource')` in the page. Session-recording collect beacons show
  status 204; cross-origin scripts without `Timing-Allow-Origin` show 0, which is normal. Analytics hits sent from a
  headless browser are not shown in realtime.
- A brand-new session-recording export token answers with all-zero metrics for hours ("not processed yet", not broken),
  and the export API allows about ten calls a day per project. Its tag refuses `127.0.0.1`: verify on the live host.
- One privacy-focused browser serves an empty stub instead of the session-recording tag, so "no hit" there is the browser.
- **Content-Security-Policy:** session recording needs its script hosts in `script-src` and its collect hosts (plus Bing's)
  in `connect-src` and `img-src`. Cloudflare's own Web Analytics beacon is injected into every HTML page of a zone that
  has it on, panels included, so the CSP must allow it too.
- Session recording's terms require a privacy notice naming the provider and what it captures (behaviour, heatmaps,
  session replay, first- and third-party cookies) with a link to its privacy statement. Its exported archives keep click
  text per session but no coordinates: a real click heatmap needs the dashboard.
- **Live tests without polluting a client's numbers:** block the analytics, tag-manager, session-recording, Meta, Bing and
  Cloudflare Insights hosts with the DevTools protocol's `Network.setBlockedURLs` in every scripted run.
- The Meta Conversions API can be called from a Worker: a POST to the Graph API's `/<pixel>/events` with a system-user
  token.

**Forms**
- In our form tool every question is required by default; "not required" goes on the input or option block, not on the
  title. An "other" option gives free text. Help text goes in the placeholder or a text block before the title. On a
  single-page form the title block's button becomes the submit button. Some settings (meta title, partial submissions)
  need the paid tier.
- The privacy page must name every party that receives form data, an agency copy included, and say that email metadata
  (date, IP, user agent) is personal data.
- A rate-limit binding on the form endpoint works on Cloudflare's free plan.

---

## Checklist · conversion and tracking

- [ ] WhatsApp on every screen; a pre-written message per page and section; `api.whatsapp.com` when there is emoji.
- [ ] Fixed bottom bar on phones (WhatsApp + call), never over content, usable while typing.
- [ ] The objective's CTA in the first screen at 390 px and at 1440 px; one primary action.
- [ ] `tel:` links; map; hours; address with a verbal reference.
- [ ] Every form tested end to end; thank-you page with its own URL.
- [ ] GA4 with `whatsapp_click` (key event) and `tel_click`; Clarity Website project; IDs registered.
- [ ] Tags only on the real host, deferred, in the generator, Do Not Track when promised.
- [ ] Events on clicks only; no personal data in events.
- [ ] Meta pixel only if the client sent it.
- [ ] Live check at launch: the GA4 and Clarity collect requests seen on the real domain.
- [ ] Day +1: traffic and `whatsapp_click` visible in GA4.
- [ ] The client is in the monthly report from launch day.
