# 03 · Structure: where the sections come from

How a page gets its shape, so that two of our sites never share a skeleton. This is our structures
library: fourteen page spines, twelve openings, sixty sections catalogued by the job they do, ten
navigation models, the visual vocabulary, rhythm, a four-minute selection procedure and the check
before delivery.

---

## Why this exists: our first four homes were the same site

We pulled the markup of our first four live homepages and put the section sequences side by side:

| Site | Section sequence |
|---|---|
| A residence-permit consultancy | hero · essentials · why · process · price · who · cases · FAQ · CTA |
| A container-building company | hero · services · works · reel · myths · uses · process · comparison · why · warranty · team · zones · plant · FAQ · CTA |
| A glazier | hero · services · projects · team · zones · about · CTA |
| A construction company | hero · strip · services · featured · why · works · zones · CTA |

Not similar: the same. **Every section was a full-width horizontal band, same vertical padding, content
centered in a 1120 px container.** Colours, type and copy changed. The architecture was identical, and
architecture is what a visitor perceives before they read a word.

Then the rotation ledger ran out of pool in three weeks: twenty demos over eight archetypes, collisions
recorded by the third week. And the block library itself was varied (asymmetric grids, sticky columns,
measures from 12 to 62 characters), but the blocks were stacked as a uniform sequence of bands, so the
variety never reached the page. A visitor never perceives a block. They perceive the beat of bands going
past at a constant interval, and that beat was never a decision because it had no name.

That missing name is **the spine**. And the deeper cause: the structure was chosen by rotation ("which
one have we not used lately") instead of by what the business needs. **The business chooses the
structure; rotation only breaks ties.**

### The axes we never varied

| Axis | Did we vary it | Effect on perceived sameness |
|---|---|---|
| Blocks inside the band | yes | low: nobody sees the block, they see the page |
| Vertical padding | yes, between clients | medium |
| Hero | yes | medium, but only the first screen |
| Effects | yes | low, and the wrong lever |
| **Page spine** | **no, always stacked bands** | **highest** |
| **Navigation model** | **no, always a sticky top bar** | high |
| **Type system** | barely | high |
| **Image treatment** | no, always full-bleed or card | high |
| **Density inside a page** | no, uniform top to bottom | high |
| **Colour mechanic** | palette only | medium |

The five we never touched are the five a visitor registers in the first two seconds.

### Effects are not the differentiator

Adding a tenth effect does not make a page distinct, it makes it louder. The agency owner's verdict on
reference sites was the design brief: "the buttons look juicy, too attractive, and that makes it obvious
it was made with AI", against a site he admired for "very clean animations, clean text on a light
background, not much shadow, no glow, perfectly designed buttons". Distinctness comes from structure.
Motion is a finishing pass with a budget ([05-motion.md](05-motion.md)).

---

## 1 · The spine (fourteen options)

The spine is **how the page is organised before any content exists**: the underlying mechanic that
decides how a visitor moves through it. Two pages with different blocks and the same spine feel like
the same site. **Rule: two active clients may not share a spine.**

| # | Spine | Mechanic | Serves | Needs | Breaks when |
|---|---|---|---|---|---|
| 1 | **Stacked bands** | every section a full-width band, uniform padding, centered container | a set of independent claims read in any order | nothing, which is why it is the default | the content has an argument: a band stack cannot say "this follows from that" |
| 2 | **Document** | one text column of 60 to 75 characters, no bands, headings do all the structuring | verified credential, staying in memory; any purchase researched before writing | real writing: no photo can carry a weak paragraph | the client has nothing to say and the copy is filler |
| 3 | **Editorial with margin** | asymmetric grid: main column plus a persistent narrow margin with notes, dates, captions, sources, the phone | verified credential; high-ticket technical work | a second layer of content (dates, sources, footnotes, credentials) | the margin is filled with decoration |
| 4 | **Index first** | the complete list of everything first, dense, above anything persuasive; no hero | orders; visitors who know what they want | a real inventory, 12+ items, categorised | there are four products: a list then looks like a shortage |
| 5 | **Fixed split** | the viewport permanently divided: one half fixed (map, product, video, contact), the other scrolls | store visits (the map never leaves), bookings, lookbooks | one asset good enough to look at for the whole visit | any ancestor has `overflow:hidden` (sticky dies silently); viewports under 700 px tall: collapse to stacked |
| 6 | **Horizontal rail** | the page advances sideways (scroll-snap) | memory; portfolio, lookbook | 6 to 12 strong images and no 14th next month | there is text to read; visitors do not realise it moves sideways (always show a partial item at the edge) |
| 7 | **Datasheet** | a specification table: attribute and value rows, tabular numerals, minimal prose | qualified message and orders in technical categories | real numbers: measures, capacities, warranties, lead times | numbers are invented or rounded to look nice |
| 8 | **Timeline** | the spine is time: works by year, milestones | credential and memory, where the argument is longevity | 6+ dated events with something verifiable attached | the business is two years old |
| 9 | **Place anchored** | geography organises the page: a structural map, zones, branches, travel time | store visits; "do you come to my zone" | real addresses and real coverage | it becomes an embedded map at the bottom (that is Spine 1 wearing a map) |
| 10 | **Question first** | a sequence of the buyer's own questions, in the order they occur, each answered at once; no section named after a department | qualified message and booking in anxious purchases (health, legal, money, used vehicles) | to have actually listened to the buyer | there is no strategic analysis behind it |
| 11 | **Instrument** | the page is a tool that produces an answer, and the answer becomes the message | qualified message and orders | a real variable structure: the answer must depend on the inputs | the tool promises maintenance (a calculator whose inputs go stale) |
| 12 | **Wall** | a wall of images; structure comes from varying cell sizes | memory and credential for arts, food, works, clothing, events | 20+ consistent photographs (the hardest asset bar) | photo quality is mixed: a wall exposes the worst photo |
| 13 | **Menu** | a price list read top to bottom, prices aligned right, sections by category | store visits and orders with closed prices | prices the client will keep updated and agrees to publish | prices change weekly and nobody updates them |
| 14 | **Hub and spoke** | a short home that routes; the substance lives in deep subpages per service or zone | memory; any build where SEO subpages are part of the offer | a commitment to write the subpages | it is sold as a one-page site |

Measured references worth opening (measured with a small script that fetches a page and returns its
section sequence, dominant paddings and widths, so a reference is measured instead of opined):

- **Document:** `basecamp.com` contains zero `<section>` elements in 52.8 KB of HTML; its H2 sequence is
  a conversation ("Tell me if this sounds about right."). `monospacedfont.com`: a 960 px column, three
  headings, and it sells a typeface.
- **Editorial with margin:** `noma.dk` runs `writing-mode` fourteen times and CSS multi-column four times.
- **Index first:** `mcmaster.com` (dominant paddings of 10 to 20 px, category H2s, zero persuasion copy),
  `craigslist.org` in 3.1 KB of CSS, `gov.uk` with the search above everything.
- **Wall:** `finisterre.com` declares `repeat()` grids at 1, 2, 3, 4, 5, 6, 8 and 9 columns on one page.
  The lesson: **the variation of cell width is the design**; a uniform grid of equal cards is Spine 1.

```css
/* Editorial with margin, the whole trick */
.page { display: grid; grid-template-columns: minmax(0, 68ch) 18rem; gap: 3rem; }
.note { grid-column: 2; font-size: .8125rem; }
/* on phones the margin items fold in below their anchor */
```

**Choosing, in one screen:**

| The visitor is... | Spine |
|---|---|
| Scanning five unrelated services | 1 Stacked bands |
| Researching before writing, alone, reading | 2 Document |
| Verifying credentials to forward to someone else | 3 Editorial with margin |
| Looking for one item among many | 4 Index first |
| Deciding whether to physically go | 9 Place anchored, or 5 Fixed split with the map |
| Comparing quotes on a technical purchase | 7 Datasheet |
| Anxious and full of unspoken questions | 10 Question first |
| Judging longevity | 8 Timeline |
| Buying with their eyes | 12 Wall, or 6 Horizontal |
| Reading a price list | 13 Menu |
| Configuring something before asking | 11 Instrument |
| Arriving from a search for one zone or service | 14 Hub and spoke |

Spines combine (Spine 10 with a Spine 11 middle, Spine 4 with a Spine 13 section). What a page cannot be
is Spine 1 with the others painted on.

---

## 2 · The opening (twelve options)

Not "the hero": the hero is a shape. This is what the first screen has to **do**. A visitor lands cold
and in three seconds must be able to answer: **what is this, is it for me, what happens next.** A
full-viewport photo with a centered sentence answers the first badly and the other two not at all, which
is why it is the default and why it is weak.

Second rule: the opening must be visible without waiting. The fastest site in a 13-site audit we ran had
a time to first byte of 157 ms for one reason: **its first screen had no image at all**, just text,
inline SVG and CSS.

| # | Opening | Use for | Needs |
|---|---|---|---|
| O1 | **Claim**: a typographic statement, no image | credential, memory, professional services, no photos | one sentence that is true, specific and not sayable by a competitor |
| O2 | **Proof**: the work itself, immediately | visual businesses | one outstanding photo, or six good ones |
| O3 | **Question**: the visitor's own question as the headline | anxious purchases | the strategic analysis (see the H1 rule below) |
| O4 | **Fact**: a number or one word that is the whole argument | measurable objections (lead time, distance, years) | a verifiable number. A parts importer won with one word: **TODAY** |
| O5 | **Price**: up front, above everything | publishing price is the differentiator | a closed price the client will honour; never as a discount anchor, and never in the H1 itself |
| O6 | **Index**: the list is the first screen | orders, visits | pairs with Spine 4 |
| O7 | **Place**: address, map, how to get there, the front door | store visits | the photo of the front door, the most useful image a local business can give and the one we almost never ask for |
| O8 | **Face**: the person, named, looking at the camera | bookings; when the purchase is the professional | one decent real photograph, not stock |
| O9 | **Instrument**: the tool starts on the first screen | Spine 11 | a tool useful in under 15 seconds |
| O10 | **Document header**: title, subtitle, date, author, nothing else | credential | it signals "this is a record", not "this is an ad" |
| O11 | **State**: what is true right now (open until 22:00, delivery today) | visits, bookings, orders | to be true; a frozen "open now" is a lie with a timestamp |
| O12 | **Silence**: name, one line, one link | an already-known business whose positioning is restraint | `berkshirehathaway.com` ships 1.6 KB of HTML and no stylesheet; for an unknown business this reads as unfinished |

**What the opening must not do:** cover itself with a loading screen; start dark (rejected on four sites,
treat light as a rule unless asked); carry a heavy raw video (a local competitor weighed 98 MB, 90 of them
three raw reels autoplaying in 396 px boxes); offer two buttons of equal weight (one primary action, a
second option is a text link); push the answer below the fold.

**The ten-second audit, usable in front of a client:**

```bash
curl -sL https://example.com | head -c 2000
```

If the `<h1>` is not in the first 2,000 bytes of the HTML, the page is badly built.

**The H1 rule overrides the opening.** Even with Spine 10 and opening O3, the H1 is a statement: what they
sell + the USP. The question goes above it as an eyebrow, or into the H2s. ("Are you blacklisted? You can
still drive away" became "We finance your car even if you are blacklisted".)

**Asset reality decides more than taste:**

| What the client has | Openings available |
|---|---|
| Nothing at all | O1, O3, O4, O5, O10, O12 |
| Only a logo | O1, O4, O10 |
| Uneven phone photos | O3, O4, O7 with the door photo, O11 |
| A decent Instagram grid | O2, O8 |
| Twenty or more good photos | O2, and Spine 12 |
| Real numbers and dates | O4, O10 |
| A published price | O5 |

---

## 3 · Sections, catalogued by the job they do (sixty)

The question stops being "which block have we not used" and becomes **"what does this page still have to
prove"**. From the analysis you have the objective and the blocker; walk the ten jobs, ask whether the page
still needs each one, and pick the section that does it with the assets the client actually has.

**Six to nine sections is a page. Fourteen is a brochure.** (`★` = we already built it.)

### Job 1 · Orient: say what this is and who it is for
- **S01 One-line definition** ★: the business in one sentence a stranger could repeat. Wins when the
  category is unfamiliar or the name gives nothing away.
- **S02 Qualifier in the negative space**: who it is for, described by the situation, never as "we do
  not work with X".
- **S03 Service list as a typographic index**: dense, two or three columns, no icons, sized by importance.
  A 3-card grid with six services lies about the catalog.
- **S04 The one thing** ★: one line elevated above the rest when 80% of revenue comes from it. Most of our
  clients, and we kept flattening it.
- **S05 What they are and are not**: two columns against the adjacent thing people confuse them with.
- **S06 Vocabulary**: four to eight trade terms defined. Reads as expertise and is real SEO surface.

### Job 2 · Prove: evidence that this is real and competent
- **S07 Work with context** ★: finished work captioned with where, when, for whom, how long. The caption is
  the proof; the photo only carries it.
- **S08 Before and after** ★: when the transformation is the product.
- **S09 The wall**: 20+ consistent images, irregular cells, minimal text.
- **S10 Named client list**: names when logos do not exist; a typographic list of institutions beats five
  blurry PNGs.
- **S11 Press with links and dates**: the section that makes a page forwardable.
- **S12 Numbers that can be checked**: years, units delivered, square metres. Never a rounded number
  nobody can verify.
- **S13 Reviews quoted verbatim with source**: name and date, linked to the listing. Costs nothing,
  underused.
- **S14 The process photographed, not described**: when the fear is "is anybody actually there".
- **S15 Certifications and registrations**, with numbers: when informality is the norm and formality is
  the differentiator.

### Job 3 · Disarm: remove the specific thing that stops the purchase
- **S16 The objection, named and answered** ★: the blocker in the buyer's words as a heading, answered in
  two paragraphs. Stronger than a "myths" block, which makes the visitor wrong.
- **S17 What goes wrong with the cheap option**: concretely, when the buyer already has a lower quote.
- **S18 What is included and what is quoted apart**: framed as scope, never as refusal. The strongest
  trust section available because nobody else does it.
- **S19 Delivery time, committed**: a number with a condition, not "to be agreed".
- **S20 The comparison table** ★: against a category (doing it yourself, importing alone, the cheap
  neighbour), never a named competitor.
- **S21 Answered publicly**: real WhatsApp questions, pasted and answered. Fifteen minutes of screenshots
  with the client; the cheapest section in the library.
- **S22 Why it costs what it costs**: materials, hours, transport, warranty.

### Job 4 · Explain: how this actually works
- **S23 Steps with what the client does at each one** ★, and how long they wait.
- **S24 Timeline with real durations**: when the wait is the anxiety.
- **S25 The mechanism explained once**, with a diagram or a photo.
- **S26 What you need to bring**: documents, measurements, decisions. Turns a visitor into someone preparing.
- **S27 Sizes, measures, compatibility**: the table that answers "does this fit my case".
- **S28 Where the work happens**: plant, workshop, clinic, or "we come to you".

### Job 5 · Frame the cost
- **S29 Closed price** ★. **S30 Range with the variables that move it** ("from X to Y, and A, B, C move
  it"), far better than a fake "from". **S31 The variables only**, when the client will not publish
  numbers. **S32 Price per unit of value** (per m², per person, per month of use). **S33 Payment terms**
  (instalments, deposit, transfer, card, invoice): a real objection almost never on the page. **S34 What
  the first step costs** (the visit, the diagnosis, the first session).

### Job 6 · Reduce risk
- **S35 Written warranty** ★. **S36 What happens if it goes wrong**: the remediation procedure, named.
  **S37 Who is responsible**: a named person with a face and a direct contact, the most under-used section
  we have. **S38 Cancellation and rescheduling**. **S39 The trial**: a small first purchase. **S40 After
  sales**: service, spares, support.

### Job 7 · The next step
- **S41 Pre-written WhatsApp** ★: the message already composed with the context of the section it fired
  from. Never a bare "Contact us".
- **S42 Routing selector** ★: the visitor picks their situation and the message changes (buying / trading
  in / selling).
- **S43 The instrument that outputs the message** ★: quote builder, configurator, order builder.
- **S44 Calendar**: real availability, booked on the page.
- **S45 Call, with who answers and when**: for buyers over 45.
- **S46 Location handoff**: map + the verbal reference of how to get there + the front door photo. In our
  market the verbal reference beats the pin.
- **S47 Persistent mobile action bar** ★: a bar with its own height, never a blob over the content.

### Job 8 · Stay in memory (when the sale is not today)
- **S48 One memorable asset**, deliberately overexposed. **S49 The category stated plainly**, large, once.
  **S50 Save the contact** (a vCard or a QR). **S51 The useful thing, free** (a guide, a size chart), sold
  by usefulness, never as "worth X, free today". **S52 A seasonal reason to come back.**

### Job 9 · Enable the forward (a stranger sends the page to someone else)
- **S53 Downloadable dossier**: press kit, datasheet, portfolio. For objective E this download IS the
  conversion. **S54 The formal one-paragraph description** an institution can paste into its own document.
  **S55 The credentials block in English.** **S56 Institutional data**: legal name, tax ID, founding year,
  fiscal address. **S57 Named team with roles.**

### Job 10 · Logistics
- **S58 Hours that are true today** ★: if they cannot be maintained, write the rule ("weekdays, Saturdays
  until noon") instead of a table that goes stale. **S59 Coverage zones as a typographic list** ★ (real SEO
  surface). **S60 Parking, access, what to expect on arrival.**

**Two rules for all sixty:** a section that does no job comes out (that test alone cuts a fourteen-section
page to eight), and the same job twice in a row is one section too many.

---

## 4 · Navigation (ten models)

The question before the pattern: **how many pages does this site actually have, and does the visitor need
to choose?** Most of our sites are one long page, and a one-page site with a five-link top bar is wearing
navigation it does not have.

| # | Model | Right when |
|---|---|---|
| N1 | Sticky top bar | five or more real destinations the visitor switches between |
| N2 | No navigation: logo and one action | one page, one objective (visits, bookings); fastest to build, never breaks on mobile |
| N3 | Sticky index in the margin | long documents, Spines 2 and 3 (sticky dies under `overflow:hidden`) |
| N4 | Reading progress | one long argument where the question is "how much more is there" |
| N5 | Bottom action bar on mobile | objectives A to D on phones, which is most of our traffic |
| N6 | Full-screen overlay | visual sites with short navigation |
| N7 | Footer as the sitemap | Spines 2 and 12: whoever reaches the footer wants more |
| N8 | The page is the navigation | Spine 14, an SEO build with real subpages |
| N9 | Inline, inside the prose | Spines 2 and 10 |
| N10 | Search first | Spine 4 with more than fifty items (below fifty a filter beats a search) |

**The mobile rule:** the action must be reachable from any scroll position without going back to the top.
A bar with its own height that the page pads for; failing that, the action repeats inside the page every
two or three sections, phrased differently. **No floating circle that covers content, and no widget that
reopens on every load** (if you build one, it remembers it was closed). Two details that read as craft: the
logo links home (and scrolls to top on a one-page site), and any navigation with more than three items marks
the current one.

---

## 5 · Visual vocabulary

### Type systems
| # | System | Says | For |
|---|---|---|---|
| T1 | Neutral grotesque (Inter, Geist, Manrope, Archivo) | modern, safe, software | the default of every generated page: if used, the spine must do all the differentiating. **Check your currency glyph**: Inter lacks the guaraní sign |
| T2 | Editorial serif (Instrument Serif, Fraunces, Newsreader, Source Serif) | established, written by a person | credential, memory, professional services, food, arts. Serif for headings, sans for body, never the reverse |
| T3 | Condensed industrial (Archivo Narrow, Oswald, Barlow Condensed) | work, machinery, capacity | construction, transport, parts, agro |
| T4 | Technical monospace (JetBrains Mono, IBM Plex Mono) | precision | only where numbers live: specs, part numbers. A whole page in mono reads as a joke |
| T5 | Humanist warm (Work Sans, Karla, Public Sans, Nunito Sans) | a person, care | health, education, personal services |
| T6 | Display + neutral | an identity | one expressive face at most three times on the page |

House rules: two families maximum (plus mono only for numbers); body never below 16 px, 18 px for business
owners over fifty; measure 60 to 75 characters.

### Colour mechanics (the palette is not the mechanic)
- **C1 One accent, held back**: everything neutral, the accent only on the action.
- **C2 Tinted paper**: the background is a very low-chroma tint of the brand colour, not white.
- **C3 Split field**: the viewport divided into two colour fields.
- **C4 Colour as punctuation**: one full-colour band, once, where the argument matters.
- **C5 Monochrome plus one photograph** that carries all the colour.
- **C6 Inverted footer only**: the depth of a dark site without a dark site.

**Measure contrast, never guess it.** Our own brand amber `#F5A83C` is 1.99:1 against white in both
directions: it is a fill, never text. An amber button carries navy text (8.30:1). If amber must be text,
darken it: `#B8730E` is 3.82:1 (large text only), `#A56A00` is 4.51:1 (body). WhatsApp green always
carries dark text.

### Image treatment, by what the client actually has
| Bucket | What exists | Treatment |
|---|---|---|
| 0 | nothing usable | type carries the page: large headings, colour fields, one inline SVG diagram, zero raster images. A demo shipped at 32 KB this way after four accounts produced nothing usable |
| 1 | a logo only | the logo becomes a graphic element (enlarged, cropped, a shape or texture), never floated in a white hero |
| 2 | uneven phone photos | unify by force: one ratio, one duotone or desaturation level, a strong crop. Never a good photo next to a bad one at the same size. The front door and the workshop are almost always usable because they are documentary |
| 3 | a decent Instagram grid | a wall at grid resolution, square crops; never upscale one into a hero. **Check the Google profile photos first**: they come at 1600 px and usually beat Instagram |
| 4 | twenty or more consistent photos | Spine 12; two thirds of the design is which photo gets the big cell |
| 5 | screenshots, documents, certificates | framed as evidence (thin border, a dated caption, aligned in a grid), never as decoration |

**What reads as stock:** people in an office looking at a laptop, a handshake, anyone who does not work at
the business, a blurred skyline behind the hero. **If there is no honest photograph, use no photograph.**

---

## 6 · Rhythm

Our density scales varied padding **between clients**, and every page used the same padding **inside
itself**: the metronome effect. **A page needs at least three different vertical intervals, and the
change must mean something.**

| Passage | Interval | Why |
|---|---|---|
| Opening | large | it is the only thing on screen |
| Argument | small, tight | consecutive ideas read as one thought |
| Proof | large again | an image needs silence around it to be believed |
| Detail, price, specs | very small | density says "information, not a pitch" |
| Close | large | the last thing has nowhere to go |

| # | Scale | Section padding | Max width | For |
|---|---|---|---|---|
| R1 | Operational dense | 40 to 56 px | 1240 px | catalogues, price lists, datasheets |
| R2 | Agency standard | 80 to 96 px | 1120 px | the one everyone uses: use it on purpose or not at all |
| R3 | Gallery | 120 to 160 px | 1440 px | photography |
| R4 | Asymmetric editorial | varies by section | 1320 px, content 68ch | Spines 2 and 3 |
| R5 | Document | 28 to 40 px between blocks | 68ch, no bands | Spine 2: vertical space comes from line height |
| R6 | Poster | 200 px plus | full bleed | one-idea pages, the arts |

Measure: body 60 to 75 characters per line (above 90 is unreadable, the most common defect on a wide hero
paragraph); headings above 32 px want a shorter measure than the body; headline blocks capped at 20 words;
line height 1.5 to 1.65 for body, 1.05 to 1.2 for large headings.

---

## 7 · The selection procedure: four minutes, six decisions

```
1. Conversion objective   (A to G, from 02-strategy.md)
2. Asset bucket           (0 to 5, what the client actually has)
3. SPINE                  (1 to 14)
4. Opening                (O1 to O12)
5. Sections, by job       (6 to 9 on a paid site, 4 to 6 on a demo)
6. Navigation, type, colour, rhythm, motion
   ↳ rotation breaks ties inside 3, 4 and 6, and never overrides 1 or 2
```

**Step 1, objective to spine:**

| Objective | First choice | Second | Never |
|---|---|---|---|
| A · Qualified message | 10 Question first | 7 Datasheet, 11 Instrument | 12 Wall, 6 Horizontal |
| B · Store visit | 9 Place anchored | 5 Fixed split with map, 13 Menu | 2, 3, 14 |
| C · Booking | 10 Question first | 2 Document | 4, 6 |
| D · Order | 4 Index first | 13 Menu, 11 Instrument | 2, 8 |
| E · Verified credential | 3 Editorial with margin | 2 Document, 8 Timeline | 1, 13 |
| F · Staying in memory | 12 Wall | 6, 2, 14 | 4 |
| G · Recruiting | 2 Document | 10 Question first | 12 |

**Stacked bands is not a first choice for any objective.**

**Step 2, the asset bucket vetoes before anything aesthetic** (half the old collisions came from choosing a
hero by rotation and discovering there was no photo):

| Bucket | Spines available | Vetoed |
|---|---|---|
| 0 nothing usable | 2, 7, 10, 11, 13 | 12, 6, 5, 9 |
| 1 logo only | 2, 7, 10, 13 | 12, 6, 5 |
| 2 uneven phone photos | 1, 4, 7, 9, 10, 13 | 12, 6 |
| 3 Instagram grid | 1, 5, 9, 12 partial, 4 | 6 unless twelve are strong |
| 4 twenty plus good photos | everything | none |
| 5 documents and certificates | 3, 8, 2 | 12 |

**Step 3, the section each objective cannot live without:**

| Objective | Mandatory jobs | The deciding section |
|---|---|---|
| A | prove, disarm, explain, price, next step | S41 pre-written WhatsApp |
| B | logistics, prove, next step | S46 location handoff with the verbal reference |
| C | explain, price, risk, next step | S44 calendar (an inquiry form where a calendar belongs loses the booking) |
| D | orient, price, logistics, next step | S27 sizes and compatibility, then S43 |
| E | prove, forward, orient | S53 downloadable dossier |
| F | memory, prove | S48 one memorable asset, S50 save the contact |
| G | explain, price, next step | what working there is like and how they pay |

**Step 4, tiebreakers in order:** ticket and cycle (high and long → Spines 2, 3, 8; low and same day → 4, 9,
13) · buyer awareness (unaware → Job 1 and Spine 2 or 10; comparing quotes → Spine 7 and Job 3) · who
forwards the page (a stranger → Spine 3 and Job 9, no exceptions) · only then rotation (the least recently
used option among the survivors).

**Step 5, declare it before writing any HTML**, in a shared ledger:

```
Client:
Primary objective / secondary:
The buyer's real blocker:
Asset bucket (0-5):
SPINE (1-14) + why the business chose it:
Opening (O1-O12):
Sections, by job (6 to 9, each with its job):
Navigation (N1-N10) · Type (T1-T6) · Colour (C1-C6):
Rhythm (R1-R6) + the three intervals used inside the page:
Motion (3 maximum):
Declared collision (with which client, on which axis, and why it was accepted):
```

The collision line is not optional. A collision written down is a decision; one not written down is why
everything looks the same.

**Worked example, reconstructed:** a heavy-machinery parts importer whose buyers never object on price, only
on lead time, and whose own graphics say "immediate delivery" four times. We built Spine 1 dressed as
"objection first" with a sticky top bar. The library says: objective A, bucket 2, **Spine 7 Datasheet** (the
buyer compares quotes on parts specified by measurement), opening O4 with the word TODAY (correct, the best
call of that build), sections S19 committed delivery time, S27 sizes and compatibility, S43 configurator, S30
price range with variables, navigation N5 (bottom bar, no top bar), type T4 for specs with T3 for headings.
The opening was right, the spine was wrong, and the spine is what the visitor felt.

---

## 8 · The anti-generic check, before delivery

### The ten-point fingerprint
Score the page. **Seven or more is a template**, whatever the palette. Our first four homes scored 8 to 10.
**Target: 3 or under.**

1. Sticky top bar, four to six links, coloured button on the right.
2. Full-viewport hero, centered text over one photo, two buttons of equal weight.
3. An uppercase eyebrow above every section.
4. A row of three or four identical cards with icon, title, two lines.
5. The same vertical padding on every section.
6. Numbered steps in a row of four.
7. A stat row of three big numbers.
8. FAQ accordion near the bottom.
9. Full-width coloured CTA band before the footer.
10. Everything centered in one fixed container.

### Hard rules
- **Structure:** spines never shared between active clients; at least three vertical intervals; six to nine
  sections each mapped to a job; the same job never twice in a row.
- **Opening:** no loading screen, no dark site, no autoplaying raw video; the H1 in the first 2,000 bytes;
  one primary action.
- **Navigation:** no five-link bar on a one-page site; the mobile action reachable from anywhere as a bar;
  the current item marked.
- **Type:** two families maximum; body 16 px minimum; measure 60 to 75 characters.
- **Colour:** every colour a token; three radii and two shadows maximum; contrast measured; one accent.
- **Motion:** three mechanics maximum, one is the reveal; one easing; no glow; nothing re-animates.
- **The tells:** one uppercase eyebrow per three sections at most; no numbered sections (`01 · Services`:
  position already categorises); no default grids of identical cards; no em dashes in visible text.

### The three questions checklists miss
1. **Swap test:** could this layout be sold to a business in another industry by changing only the logo and
   the photos? If yes, the structure is doing no work.
2. **Blocker test:** point at the section that removes the buyer's actual objection. If you cannot, the page
   is decorated, not designed.
3. **Forward test** (objective E): if a stranger sent this link to their director, what exactly would the
   director open? If the answer is "the home", there is no dossier and the page fails.

**When the check fails, do not add. Remove and re-decide.** A high fingerprint is a spine problem, not a
block problem. If the page feels empty after cutting, the client gave us nothing and nobody asked for what
was missing: ask for the front door photo, the workshop, the WhatsApp screenshots, the price list, the tax
ID, three client names.

---

## 9 · The block library, one floor down

Once the spine is chosen, blocks fill it. We keep working, self-contained demos (each block's styles inside
its own page, so it copies without dependencies): seven hero families, nine section families, nine effect
mechanics (parallax, reveal, counter, mask, accordion, grain, clip-path, progress), and four rhythm systems
compared. Plus 74 real brands' design systems broken down into tokens (palette, type scale, radii, shadows):
open one whose world resembles the client's and build in that language instead of the default.

The old "eight archetypes" from version 1 of this playbook (proof first, objection first, editorial
document, dense catalog, guided scroll, trust first, price up front, place led) still exist as block
orderings, but they operated one level too shallow. Spines replaced them.

### Two CSS traps that keep biting
- **`position:sticky` dies silently if any ancestor has `overflow:hidden`.** Check the whole ancestor chain
  before debugging anything else.
- **A new generic class name in a large stylesheet is a silent collision**, and specificity ties are won by
  whatever comes later in the file. We had `.tabla-l td:last-child{text-align:left}` on one line and
  `.tabla td:last-child{text-align:right}` twenty lines below: every single-column table rendered
  right-aligned for months. Fix: `.tabla.tabla-l td:last-child`, and grep before naming anything.

---

## 10 · Where we look for references

- **By section:** Unsection, SupaHero (heroes), Navbar Gallery, Footer Design, CTA Gallery, Bento Grids (the
  most template-worn shape right now, use with care).
- **By structural extreme:** Dead Simple Sites (the best source for Spines 2 and 12), Brutalist Websites (as a
  corrective), Minimal Gallery, Siiimple, One Page Love.
- **Craft details:** Design Spells, 60fps.design, Checklist Design, Epic Easing.
- **Broad:** Land-book, siteInspire, Godly (now recent.design), Awwwards, Lapa Ninja, Httpster, A1 Gallery
  (filterable by stack, font, colour and type).
- **Typography:** Typewolf, Fonts In Use, Fontshare (check your currency glyph before committing), Free Faces.

A reference site is a reference: rebuild its look with your own code, never lift its code, photos or text.
