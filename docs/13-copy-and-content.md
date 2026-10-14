# 13 · Copy and content

The rules every word on a client site follows, how we collect the client's information, and the legal pages.
Most of our client copy is in Spanish for Paraguay; the rules are written so they apply in any language, with the
market-specific ones marked.

---

## Rule zero: copy written by a model is a draft

**Nothing a model writes is published as it is.** Not page copy, not captions, not ad text. The agency owner reads
it, rewrites it and approves it, every time, for every client. Brand voice and commercial judgement are a person's;
generated copy sounds generated, and in a small market that burns credibility. In practice:

- Everything we write is marked as a draft, never as ready to publish.
- Prefer handing over **raw material** (facts, specs, angles, structure, verified data) for a human to write, rather
  than finished text.
- When a deliverable needs text to move forward (a layout, a carousel), use provisional text and say clearly that
  the final version waits for the approved copy.
- On top of every copy document goes a **"decisions I took for you"** list, one line each, so any of them can be
  flipped in seconds.
- Before handing copy over, run a review pass for generated-text tells: tourism-brochure promotional language ("in
  the heart of"), piles of gerunds, vague authority claims, rule-of-three padding, filler phrases, robotic formality,
  and dashes used as separators.

---

## The headline: what they sell + what nobody else can say

The H1 of a client page carries **two things and only two**: the category of what they sell, and what makes them
different. **Never the price**, however good the number: a price headline answers "how much", which is the third
question, and boxes the business in as the cheap one. If the price is a differentiator, it goes in a supporting
block on the first screen, not in the H1.

**The USP is not the brand.** "Natural products with our name on the bottle" solves nothing for anybody. Find it with
three questions, in order:

1. **What problem do they solve?** Not the category, the problem. For a natural-remedies shop it was not "getting
   natural products", it was "being sure what arrives is genuine and not an adulterated version".
2. **Are they original or verifiable?** Look for the proof on the client's own packaging: sanitary registration,
   origin seal, production date, extraction method, declared origin.
3. **Do they produce it, pack it to their own standard, or resell a sealed product?** It changes completely what can
   be claimed.

The H1 that shipped, written by the agency owner, was two short sentences, one per job: the products people search for
(which also serves SEO) and **nationwide delivery**. **Between two true USPs, the concrete one wins.** Traceability was
deeper but abstract; delivery answers "will it reach me?" instantly for someone in the interior. The deeper one moves to
the subtitle and the proof section.

More lessons from real headlines:

- **An institution speaks institutionally.** For a university campus, "Study Law, Notary and Computer Science with a
  degree from <University>" beat the version with the city at the end: the decider's verb goes first, and the city
  shrinks an institution (it moves to the eyebrow and the subtitle). Section titles in formal register too ("Degree
  issued by the University" rather than "The university gives you the degree"). For a local trade, coverage can lead.
- **The H1 states; it never asks.** Even on a question-first page: "Are you blacklisted? You can still drive away"
  became "We finance your car even if you are blacklisted". The buyer's questions go in the H2s; a question can sit
  above the H1 as an eyebrow, never in its place.
- On a phone the H1 fits in **two lines or fewer** at 390 px.

---

## The hard rules

**No em dashes and no en dashes as separators**, anywhere: page text, alt text, meta descriptions, JSON-LD, share
cards, graphics. They read as generated. Use a period, a comma, a colon or a middle dot (·), or restructure the sentence.

**No hashtags.** In captions, briefs or anywhere else.

**Never write what the business does not do, have or offer.** An explicit negation limits the client on the reader's
behalf and kills the sale before the conversation exists. When the source is a limitation, publish only the positive
half and make it sound like a decision, not a lack:

| The client said | What goes on the site |
|---|---|
| "We don't work with iron" | "We build the structure in aluminium, which is light and does not rust" (+ "we replace the panels on the structure you already have") |
| "The compact type isn't available here" | do not mention it: "We work with the multiwall type, the one that performs best in this climate" |
| "No custom colours" | "Available in black, white, natural aluminium and wood effect" |
| "Not everything is done with tempered glass" | "When tempered goes in, and when laminated does" |
| "We have no branch in <town>" | "Do you serve <town>? From our workshop in <nearby city>" |

Pocket rule: if a sentence can be answered with "fine, so what DO you do?", it is badly written. The exception is
scope inside a quote or contract ("does not include plastering or paint"): that document defines what was paid for.
A website is sales.

**No value anchoring in our local market.** "Worth X, free this week" reads as an infomercial here and generates
distrust. Free things are presented by their concrete usefulness ("a free analysis to see which kind of website suits
your business"). In the US market anchoring is normal and allowed; the rule is local.

**Every claim traces back to the client**: a number, a price, a term, a warranty, a promise. It comes from the form,
the chat or their documents, or it is on the "decisions I took for you" list. A number you cannot defend is worse than
no number.

**No employee names** unless the client asked. **Brands, never distributors.** No names of the client's customers, or
their cities, unless the client gave them.

**Data that changes goes in prose, not in a database.** Instead of a searchable list of sixty phone models, four lines
("iPhone · from 11 to 16 Pro Max", "Samsung Galaxy · A and S lines") and a WhatsApp button to ask about a specific
model. Same information, zero maintenance, and the conversation ends where it should. Same for prices, special hours,
promotions and long lists. Hours that cannot be maintained are written as a rule ("weekdays, Saturdays until noon").

**FAQs come from what people actually ask on WhatsApp.** If we cannot name a real person who asked it, it does not go in.

**What the agency owner cuts on review, so cut it first:** second sentences that add nothing, visible "missing" notes,
staff names, claims the client never made, long lists that want to be a grid, anything that "will confuse".

**Proposals describe the result, never the machinery.** The client buys what the site will do for them, not how we
build it.

**Field notes:**
- **The owner's own words win.** A slogan printed on the shop front and repeated in their Facebook bio is their copy: it
  stays as the H1.
- **The rules apply to invisible strings too.** Three em dashes survived in an `aria-label` and a map `title`.
- "Never say what we don't do" bites legal copy as well: "We only start work you have approved" keeps the legal effect
  of a limitation and reads as a promise.
- A question-first page can carry a whole site: a services page that asks the buyer's question per category ("Do you
  repair washing machines?"), an about page that opens with "Who will come into my home?". The `FAQPage` schema then
  comes from the question headings. The H1 still states.
- **Second language without hand-pasting fragments:** render both languages from the same template, split both outputs
  on tags, assert the tag sequences are identical, and pair the text pieces into a translation dictionary that the build
  applies. A translated piece after a tag must keep the original's leading space.

---

## The copy document and the review rounds

- The copy document is **generated from the built HTML** (every page's text, every WhatsApp message, every placeholder
  box), with the decisions list on top, uploaded as a shared document, and **regenerated at the same URL** after each
  round.
- The agency owner edits the document. Their edits are pulled back with a **normalised diff**: shared documents join
  paragraphs and rewrap lines (one raw diff showed 43 changed blocks for 7 real edits). Then the generator, a rebuild,
  QA, deploy.
- **The client's texts ship word for word.** Keep each of their messages verbatim with what it changed, and **open
  every image they send**: clients write corrections on screenshots.
- **Bilingual sites:** when a hand-written page changes in one language, the other does not follow on its own. Extract,
  translate, rebuild.

---

## Collecting the client's information: the intake form

**What we already know is never asked again** (dossier, analysis, video, proposal, domain form, chat). Then a
missing-information file, grouped, each item with **where it lands on the site** and the exact question; the agency
owner records a voice note over it (what to ask, what not, what was assumed wrong), and only then the form is built.

**Rules for the questions:**

- One fact per question, with where it lands. If it lands nowhere on the site, it is not asked (staff count, production
  capacity in tons, the YouTube channel).
- **Ask for the longest term, not the best case:** "From confirmation, how long does it take **at most** to receive the
  product or the finished work?"
- **Ask neutrally:** "What are your opening hours?", never "Are the hours on Google correct?" (the second drags the answer).
- When two public phone numbers exist (the norm), ask which one sells, as options.

**The base questions every site needs** (unless already known):

| # | Question (draft) | Type | Lands in |
|---|---|---|---|
| 1 | Which WhatsApp number should the site's messages go to? | options with the numbers we know + other | every button, the uptime keyword |
| 2 | Which days and hours do you attend? | open | contact, schema |
| 3 | The exact address, with a reference to find it ("between X and Y street") | open | contact, schema, map |
| 4 | Which products or services must be on the site? | checkboxes with what we know + other | the page map |
| 5 | Do we publish prices, or "ask us"? | publish / ask / some yes, some no | copy, schema |
| 6 | Which payment methods do you accept? Do you always invoice? | checkboxes + yes / on request | FAQ, terms |
| 7 | From confirmation, how long at most until the customer receives it? | open | FAQ, terms |
| 8 | How far do you reach? (delivery, visits, zones) | open, optional | coverage, area pages, `areaServed` |
| 9 | What warranty do you give, and for how long? | open, optional | terms, FAQ |
| 10 | Since which year have you been working? | open | proof, `foundingDate` |
| 11 | Do you have messages from happy customers we can show? Send the screenshots by WhatsApp | yes, I'll send / not yet | reviews |
| 12 | What should the N mailboxes be called? (e.g. sales@<domain>, <name>@<domain>) | open, required | the mailboxes |
| · | Anything else you want on the site? | open, optional, always last | |

**Form format:** one page, no intro, no progress bar, straight down from the title. **No file uploads**: photos, logos,
PDFs and audio go by WhatsApp (free form tools cap file size and lock the files inside a submission), and the form says
so where the upload would have been. The brand colour on the button. Blockers required, everything else optional, so
nothing stops the send; conditional questions for branches. A thank-you page. Our best one, 17 questions, was answered
in 14 minutes.

**When the answers arrive:** saved verbatim with what each one changes. Form and chat disagree → the form wins. **Only
blockers go back to the client** (material the page cannot exist without); everything else gets a sensible default and
one line to the agency owner.

## The photo guide (draft, sent with the form)

> **How to take the photos for your website**
>
> A phone is enough. What matters most:
> - In daylight, natural light, no flash and no filters. Clean the lens first.
> - Of each thing, one horizontal photo and one vertical.
> - Tidy up before shooting. Real photos beat any photo from the internet.
> - If people appear, they should agree to it. With minors, only with their parents' permission.
> - **Send them by WhatsApp as documents**, so they keep their quality.
>
> What we need:
> 1. The front, as a visitor sees it: one from afar and one close, with the sign.
> 2. Inside: the whole place, and the corners where the work happens.
> 3. You working, not posing. And one of the owner looking at the camera.
> 4. The products: one per photo, from the front, on a plain background. And some in use.
> 5. Finished work. If you have the before and after of the same place from the same angle, even better.
> 6. The process: hands at work, the machines, the materials.
> 7. The delivery: the vehicle, the package, the customer receiving it (with permission).
> 8. What proves the quality: labels, certificates, close-ups of the finish.

Per business, swap in what sells it: the silo with a person next to it for scale, the truck cabin and the odometer, the
kitchen before and after, the bus and the office front. Eight shots is plenty.

---

## Legal pages, written for each client

Every site carries a privacy policy and terms of use, written **from that client's own business**: what they sell, how
they deliver, warrant and get paid. The same section skeleton is fine; copying another client's text is not.

- **Name only the site's providers**: the host and the tools that run on the site (analytics, session recording, maps,
  the ad pixel). Never the business's working tools (their email provider, WhatsApp as a provider, the agency's stack).
  Contact channels stay.
- **No invented commitments.** Anything the client has not stated (a warranty term, a payment split) is written as
  "as stated in the quote".
- A sole trader: name the owner, do not publish their tax ID (it is their national ID). A company: publish the tax ID.
- Sites with session recording carry the disclosure its terms require (a link to the provider's privacy statement).
- The agency owner approves each site's text before deploy.
- **Away from every crawler, AI included:** `Disallow` in every robots group, noindex, out of the sitemap and
  `llms.txt`, linked from every footer for humans ([08-seo.md](08-seo.md) has the indexing gap and how to close it).

What our local law asks of a site that sells at a distance (Paraguay; WhatsApp sales count), as an example of how we map
a law onto pages:

| Law | What the site must carry |
|---|---|
| E-commerce law (Ley 4868/2013), art. 7 | legal name, address, owner, email and phones, reachable from every page (a footer link); a privacy policy; a copy of the contract (the accepted quote or chat summary plus the invoice); licences and the controlling authority when the activity needs one; delivery, warranty, returns, price, currency, payment and freight; how to contract and how to cancel, before contracting; the applicable consumer law and the authority's website |
| same law, art. 17, 22, 30, 31 | refund when not received as promised, with a claim window; opt-out of promotional use of data at collection and in every message; withdrawal within 5 business days of receipt (except custom-made or personalised goods); **cookies: inform use and purpose and offer a simple, free way to refuse** |
| Consumer protection law (Ley 1334/98) | rights cannot be waived and abusive clauses are void ("no returns accepted" is one); a published offer binds; prices in local currency with taxes included; written warranty with its minimum content; off-premises sales carry a 7-day withdrawal right |
| Personal data law (Ley 7593/2025, in force from November 2027) | identity, purposes and legal basis, recipients, international transfers, retention, rights answered within 30 days, breach notice, minors |
| Do-not-contact law (Ley 5830/2017) | check the national do-not-contact registry before any commercial call or message to a mobile (exceptions: existing clients, express authorisation) |

We verified each article against the official legal database in October 2026, before writing the first drafts. Two
details worth knowing: the 7-day withdrawal for off-premises contracts matters to any business that measures or quotes
at the client's home, and an exclusive-jurisdiction clause in a contract the client cannot negotiate is abusive. A
cookie mechanism is the one item still pending a decision on our sites. Laws change: re-check the current text before
relying on this table.

**One text source per site, many renderers.** Each client's legal text lives in one Markdown file (`#` page, `##`
section, `-` list items, bold, links) parsed by a small module that feeds every kind of site we run: the Python
generators, an Astro component through a JSON export, and bilingual pages with one file per language and the same
structure. The agency owner edits the Markdown, never the HTML.
