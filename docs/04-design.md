# 04 · Design: sheets, tokens, brand and photos

How a paying client chooses the look of their site, how that choice becomes code, and how we handle the
brand files and the photos.

---

## We never propose a page. We propose a design language.

When a client has to choose a look, we send **three design sheets**. A sheet is not a page, not a home,
not a hero, not even one section. It is the **raw material** of a design: tokens, colour, typography,
shapes, graphic devices, every kind of element they will meet on the finished site, and **real, running
animations**. The client picks one and refines it. Only after that does anyone build a page.

**Why a sheet beats a page:** a page makes the client read. They comment on the headline, the order of the
sections and the photo of the kitchen, and they never look at the design. A sheet has nothing to read, so
the only thing left to judge is the thing we are actually asking about. (It replaced two earlier formats:
three full pages, and three phone mockups.)

### What goes on a sheet

One self-contained HTML page per direction. Everything below, once each, labelled:

| Block | What it shows |
|---|---|
| Name and idea | one word and one line |
| Tokens | the `:root` block, visible: colour, type scale, spacing, radii, shadows, easing |
| Colour | every token as a swatch with its hex and its **measured** contrast against the text that sits on it |
| Typography | display, H1, H2, body, small, numbers; the currency glyph verified |
| Shapes | radii, borders, dividers, grain or texture; three radii maximum |
| Buttons | primary, secondary, ghost, WhatsApp; rest, hover, pressed, focus ring, disabled |
| Small elements | chips, badges, tags, stamps, counters, icon treatment, list markers |
| Cards | generic, photo, quote |
| Forms | input, textarea, select, checkbox, radio, error, success. Most of our sites convert here, so this is never skipped |
| Image treatment | two or three real client photos with the direction's crop, ratio, overlay, frame or duotone |
| Motion | the three mechanics, running, each labelled with what it is and its exact values |

**Not on a sheet:** headlines, paragraphs, section order, navigation bars, heroes, footers, anything that
looks like a page. Labels only; any word that appears is a placeholder.

### The three must differ on real axes

Not "blue, dark blue, light blue". Each sheet takes a different value on four axes from the structures
library ([03-structure.md](03-structure.md)): **type system** (T1 to T6), **colour mechanic** (C1 to C6),
**corner and edge** (0 px, small, generous), and **the motion mechanic that is not the reveal**. Each one
answers a concrete promise of that business, written on the sheet in one line.

### Hard rules we check the sheets against when they come back

- **Motion budget:** three mechanics, one of them is the reveal. Easing `cubic-bezier(0.22, 1, 0.36, 1)`,
  travel 26 px, stagger 70 to 80 ms capped at three items, `unobserve()` after the first run.
  `prefers-reduced-motion` kills all of it.
- **Token discipline:** three radii, two shadows, every colour a token. A raw hex outside `:root` means the
  system broke. (The worst "AI look" in a 13-site audit we ran had 21 radii, 18 shadows and 54 hex values
  against 7 declared tokens.)
- **No glow.** If there is a shadow: `spread ≈ -(blur × 0.6)`. Better than a shadow: a one-pixel inner light
  edge, `inset 0 1px 0 rgba(255,255,255,.16)`. That is what makes a button read solid instead of shiny. A
  shadow tinted with the button's own colour is the specific defect behind "juicy" buttons.
- **Contrast measured, not guessed**, on every pair. WhatsApp green always carries dark text.
- **The logo is never redrawn by the design tool.** It leaves a slot; the real logo is placed by hand.
- **Fonts self-hosted woff2**, no third-party requests, the currency glyph verified in the font file.
- **Safe at 390 px.** No sideways scroll on the published sheets either.
- Nothing the client would have to maintain.

---

## The pipeline

1. **We prepare the material**: the logo (the client's file, or vectorised from a raster), fonts if they
   have any, the photos the sheets may use (originals, renamed descriptively), and the business's promise
   from the strategic analysis.
2. **A design tool builds the sheets.** We use Claude Design (now a canvas inside Claude). **The prompt is
   short and open, about 150 words, in the client's language** (so the labels come back in that language):
   who the client is, what the site has to achieve, what a design sheet is, and "build the three now, at
   once, clearly different from each other". **No typefaces, no palette, no corners, no motion, no banned
   list, no measured numbers in the prompt.** The tool knows more about design than our prompt does; if we
   dictate the decisions it executes instead of designing. Everything in "hard rules" above is our
   checklist for what comes back, never part of the prompt. If one sheet comes back thin, ask for that one
   again in the same chat, never all three.
3. **Export** into the client's design folder.
4. **Publish** behind a chooser page on our proposals subdomain, with QA at 1440 and 390 px.
5. **The client picks one and refines it.** Their notes are on the language, not on a layout. Record the
   pick and the refinements, apply them to the sheet.
6. **Only then** choose the spine and build the page.

### Gotchas when publishing design-tool exports

- **"Bundled" HTML exports** are a few MB each and show "Unpacking..." when opened: the real markup is a JSON
  template inside a `<script type="__bundler/template">` tag and the fonts and scripts are base64 in a
  manifest script. Stripping tags from the outer file returns nothing useful. We unpack them offline into
  normal files (fonts, assets, a support script, a vendored React and a resources map so the runtime never
  fetches React from a CDN), same pixels.
- **Sheets overflow sideways on phones.** Their sections are grids with an `auto` column, so an inner
  `repeat(auto-fit, minmax(200px, 1fr))` measures four columns. Fix without touching desktop:
  `section{grid-template-columns:minmax(0,1fr)}` and side padding as `clamp(18px, 5vw, 40px)`.
- **Canvas-mode exports** carry a fixed inline width per block. Fit them with `body{width:1600px;margin:0
  auto}` plus `document.body.style.zoom = clientWidth / 1600`. Never `<meta name=viewport width=1600>`:
  Chrome will not scale below 0.25 and phones cut 100 px.
- **Three sheets built in one message come back as one canvas** with one block per option. Split them per
  option for the chooser, and read each card's width off the export (it changes per export).
- Some exports stamp copied images with content credentials (same pixels, a few KB larger): publish your
  originals under the export's names.
- `innerText` returns uppercase for elements styled `text-transform:uppercase`, so a lowercase text search
  reports "not rendered" falsely.
- Sparklines drawn with stroke dashes over `vector-effect: non-scaling-stroke` render cut; when porting,
  reveal them with `clip-path` instead.

### More export gotchas from the log

- A design chat cannot open a local folder: the handoff is dragging up to about twenty flat files with descriptive names
  into the chat.
- **An export ZIP includes an `uploads/` folder with everything that was attached to the chat: never deploy the ZIP
  whole.** Sheets link to each other by their export file names, so rename to slugs and rewrite the links, or the live
  navigation 404s. Icons referenced by a name built at runtime (`'icon-' + name + '.svg'`) need every icon copied.
- The native export runtime fetches React from a public CDN, with subresource integrity, on every visit, unless an inline
  resources map points those URLs at local vendor files: a "zero third-party requests" claim can be false.
- Before choosing how to publish an export, check whether it is fixed-width or fluid: grep for `width:1[0-9]{3}px`. Only
  max-widths means fluid, which needs nothing more than `overflow-x: clip`. The type ladder, colours, corner cuts and
  keyframes of an export come out with greps over `clip-path:`, `box-shadow:`, `font:` and `@keyframes`.
- One headless mode dropped the DevTools connection on bundled exports; the other worked. Try both before debugging.

### How the chosen sheet becomes code

The generator reads the sheet: tokens and component styles from its inline styles (parsed, not retyped),
icons extracted verbatim (one export wrote `sc-camel-view-box` where SVG needs `viewBox`; fix it in the
extractor, keep the keyframes), and the sheet's own woff2 files self-hosted. CSS hygiene from line one:
`[hidden]{display:none!important}`, and state classes (`in`, `on`, `open`, `play`) never share a name with
a component or a section modifier.

---

## Graphic pieces are designed by the design tool, not by the builder

A rule the agency owner set after a build session rendered three Instagram graphics nobody asked for: **the
builder never designs a published graphic.** It prepares **one shared folder** (a brief with the brand, the
palette with measured contrasts, the hard rules, each piece's copy verbatim, a photo index; the brand files;
the original photos; an empty delivery folder) and **a prompt of three or four lines** that only says which
piece. The detail lives in the brief, never in the prompt. One piece per session.

Renders that are not design are still fine to make: maps, data charts, contrast-check mockups, QA captures.

For video overlays and animated pieces, ask the design tool to animate in its own timeline and export from
there; never ask it to "write code that produces the video" or to measure the file (measure it yourself
when it arrives). When it hands back a code bundle instead of a video, render that bundle locally with a
real alpha channel: better than any exported MP4.

---

## The brand kit

- **The logo in vector.** If only a raster exists, vectorise it. A reverse image search (Yandex Images works
  well) often finds a higher-resolution copy of a client's blurry logo or photo.
- Lockups (horizontal, stacked, icon only), on light and dark.
- **The full favicon set**: `favicon.ico` at the root, a 32 px PNG, a 180 px apple-touch-icon, 192 px for
  Android. RealFaviconGenerator covers every device.
- **The palette with measured contrast** for every text and background pair you will use.
- **Check a logo at the size it will be seen.** A profile avatar is a circle of about 88 px: paste the logo at
  that size with an elliptical mask before choosing. Three versions looked fine at 2048 px; only the white on
  black one survived the circle.

Free sources we use: Fontshare (Satoshi, Clash Display, General Sans, Cabinet Grotesk), Google Fonts (always
self-hosted), Coolors for palettes, Texturelabs for grain and paper textures.

**Recovering a logo that only exists as a raster:** identify the typeface by overlaying candidates and scoring the
overlap, fit the scale by least squares over the letter boxes, take the advances from the font itself, and trace the
glyph outlines from the font file (fontTools pens, with its kerning) for a crisp SVG. Low-contrast edges in a JPEG (cream
on white) are read on luminance, not colour: JPEG keeps colour at half resolution.

**Reusing a client's own watermark on new photos:** with two exports of the same template, the mark's alpha is one minus
the photo over the background (rebuild the background under the mark by inpainting). A sticker burned onto a flat surface
comes off better with seamless cloning from the surface next to it than with plain inpainting, which leaves a halo.

---

## Photos

### Where they come from
The client takes them, guided by a one-page **photo guide** sent with the intake form (the guide is in
[13-copy-and-content.md](13-copy-and-content.md)). We do not run photo sessions unless one was sold. Before
asking, look at what exists: **the Google Business Profile photos come out at 1600 px** by changing the URL's
size suffix (`=w1600-h1600-k-no`), and they usually beat Instagram's.

### How they are processed
- **Look at every photo before placing it.** One client sent 79 photos; reading them one by one identified
  three truck models by their badges.
- **WebP at three widths** (for example 480, 960 and 1600 px, never upscaled) with `srcset` and `sizes`,
  width and height declared, lazy below the fold, the hero preloaded with the same `imagesrcset`.
- **EXIF and GPS stripped** from everything published. The client's location data stays on our disk only.
- **Product and work photos fill their box without bars and are never cut.** Both rules at once, so it is a
  per-photo decision: `object-fit: cover` with `object-position` centered on the piece wherever the piece
  stays whole with a little air, `contain` only where the piece takes the whole photo. We keep each piece's
  bounding box per photo and compute the crop for each box ratio at build time, then look at every box. (A
  global `cover` cut a client's products; a global `contain` put black bars on every 9:16 studio photo in a
  3:4 card.)
- **Missing photos** are marked boxes during review, and at launch they become drawings in the site's own
  visual language. A placeholder never ships.
- **Pre-darken a hero that sits under a dark overlay** before compressing it: dark regions compress better
  (one hero went from 288 KB to 142 KB at the same visual result).
- Instagram images come at 360 to 640 px; for a profile upload, enlarge to 900 px on the long side with
  Lanczos plus an unsharp mask, 1.6x maximum.

## The social card (`og:image`)

The preview people see when a link is shared on WhatsApp, Facebook or in a DM comes from `og:image`, and it is seen
at about 300 px wide inside a chat.

- **JPG or PNG, 1200x630, never WebP**: WhatsApp and Facebook do not render a WebP card, so a site can have the tag and
  show nothing. Always the full block: `og:image`, `og:image:secure_url`, `og:image:type`, `og:image:width`,
  `og:image:height`, `og:image:alt`, `twitter:image` and `twitter:card=summary_large_image`.
- **A raw photo is not a card.** The card carries the brand: the primary colour as background, the wordmark, a short
  headline on two lines, service pills and the domain. No small text.
- **The photo goes on the side the subject faces.** If the truck faces left, the photo goes left and the text right, so
  the gradient covers the tail and not the front; mirror the layout when it faces the other way.
- **Two-line headline, two sizes**: the first line larger in white, the accent line slightly smaller in the brand colour,
  instead of shrinking everything to fit.
- **One card per page** (home, each service, each model), generated from one table by the same script, not one
  generic card for the whole site.
- **To break scraper caches, change the file name.** With `immutable` cache headers on assets there is no other way.
  Regenerate the card when the H1, the phone or the address changes.
- **When patching meta tags in existing HTML, delete every old line and insert one single block**; inserting without
  deleting duplicates the tags the moment the file is regenerated in between.

### Audit contrast before showing anything
Before showing any mockup, render or screen, check **every** text against the background it actually falls
on. On dark fills light text; on light fills the dark brand colour; never a mid tone on a mid tone. Squint
test: if a line does not read with your eyes half closed, it is wrong. The automated version measures
contrast at 390 px against what is actually painted under the text ([12-qa.md](12-qa.md)).
