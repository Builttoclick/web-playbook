# 07 · Performance: loading speed and runtime smoothness

Most of what we believed about our own performance was wrong until we measured properly. This file has the
measurement rules first, then what actually moved the numbers, then two checklists: **loading speed** (how
fast the first screen arrives and settles) and **runtime** (how smoothly the page behaves once it is there).

**The launch bar** for every client site: Lighthouse mobile, three runs, the median, on the home and two key
pages. **Performance 90 or more; Accessibility, Best Practices and SEO at 100.** Below that, no launch.

---

## The measurement rules come first

- **One Lighthouse run proves nothing.** Six runs of the identical build gave us 71, 69, 94, 92, 93 and 89, with
  LCP between 2.6 s and 6.5 s. The two bad ones were home-network noise, visible as a Speed Index of 5.7 s
  against 1.6 s. **Three runs minimum, take the median**, or read the structural audits, which do not move
  with the noise.
- **Run it with nothing else probing.** Parallel headless browser instances on the same machine dragged the
  Performance score down by 20 points or more.
- **PageSpeed Insights without an API key is unusable for automation**: sixteen consecutive attempts, all 429,
  across half an hour. Install Lighthouse locally and point `CHROME_PATH` at any Chromium you have. Same
  audits, no quota, and the JSON diffs between runs.
- **Localhost is fine for Total Blocking Time and structural audits, useless for FCP and LCP.** A simple local
  server does not compress and adds its own latency. Measure field-adjacent metrics against production.
- **Lighthouse can exit with a permissions error while the report is already written** (the launcher fails to
  delete its temp folder after saving). Check whether the output exists before calling the run lost.
- **The mobile screenshots are already inside the Lighthouse JSON**: the final screenshot and the filmstrip are
  base64 data URIs of the real mobile load, frame by frame with timings. Decode them instead of fighting a
  headless browser.
- **Read the LCP breakdown.** It names the element and splits the time. A *render delay* of seconds means an
  animation is sitting on content that is already on screen.
- **Time to first byte: five samples or more, the median.** A single cold sample includes DNS, TCP and TLS and
  lies (406 ms against a real median of 180 ms).
- **Google never measures iPhones.** The field data behind Core Web Vitals comes from Chrome on Android and
  desktop only, and Lighthouse emulates an Android. Design for the iPhone, gate on the Android emulation.

---

## What actually moved LCP for us

**The LCP element was not the image and not the H1.** We split an H1 into per-word spans for an entrance, so no
single span was a large block, and the LCP candidate silently became the hero paragraph. That paragraph had a
reveal, so it started at `opacity: 0`, and LCP does not register until the fade completes. Measured render
delay: 1,727 ms and 5,334 ms on two runs of the same page; LCP 2.2 s against 5.8 s; score 90 against 69.

The fix: the first section of each page is marked as the hero and its reveal elements are forced to
`opacity: 1`, keeping the staggered entrance on the transform only. **Above the fold gets painted, not
revealed.**

**On another site LCP was waiting for the IntersectionObserver callback.** The hero started hidden and turned on
when the observer answered; on a phone with 4x CPU throttling that arrived about three seconds after FCP. The
fix: anything already above the fold is never observed. Read all the bounding rectangles in one pass, reveal
those inside a single `requestAnimationFrame` (that frame is exactly what the CSS transition needs), and hand the
observer only what is below. Identical look. LCP went from swinging between 3.0 and 6.1 s to a stable 3.01 s.

**`font-display: optional` did not help.** LCP was unchanged and the score dropped a point or two. The font swap
was not the delay, the animation was. We stayed on `swap`, which shows the right typeface on the first visit.

**The HTML at the edge took 50 ms off every load.** Cloudflare does not cache HTML by default, not even in front
of a Pages site: assets come back `HIT` but every page is `DYNAMIC` and travels to the origin. One cache rule
scoped to the site's hostnames (details in [11-deploy-hosting-domains-email.md](11-deploy-hosting-domains-email.md))
took our median TTFB from 180 to 127 ms, and two client sites from about 160-190 to 107-115 ms and from about 170
to 130 ms. That is also why sites on Vercel "feel faster": their HTML lives at the edge. A Worker serving static
assets is already edge-cached (`HIT` with no rule), which is one reason new client sites run as Workers. The price
either way: every deploy must purge, or nobody sees it.

---

## Fonts

- **Self-host. Always.** A font CDN is a third-party origin in the critical path (extra DNS and TLS on a phone),
  and its CSS is a render-blocking round trip you cannot preload past.
- To extract the files, request the font CSS with a modern browser User-Agent (an old UA gets nothing usable) and
  copy the `unicode-range` blocks verbatim. A variable font is one file per subset covering every weight (about
  31 and 47 KB for the two families we use most).
- **`crossorigin` on `<link rel="preload" as="font">` is mandatory**, even for a file on your own domain.
- **What makes a variable font heavy is the axes, not the glyphs.** Subsetting glyphs on one family saved 2.7 KB;
  clamping the `wght` and `opsz` ranges to what the CSS actually uses saved 41 KB, and pinning the optical size on
  the italic (used at one size) saved another 39 KB. Read the real `font-size` and `font-weight` values in your CSS
  before you subset.
- **Text must not resize on load.** Three pieces together: self-host, preload the critical woff2, and a
  metric-compatible fallback face with `size-adjust`, `ascent-override` and `descent-override` computed as
  `metric / (unitsPerEm × sizeAdjust)`. **Never derive `size-adjust` from OS/2 `xAvgCharWidth`**: foundries average
  it on different bases and one came out at 138%. Measure the mean advance of a real sample string against the
  fallback. Safari applies `size-adjust` but, as of October 2026, not the ascent and descent overrides, so keep
  `line-height` explicit.
  A working example is in [`code/islands/css/fallback-fonts.example.css`](../code/islands/css/fallback-fonts.example.css).
- **Check your currency glyph in the font file** (we check the guaraní sign with fontTools). Inter does not have it.
- **Renaming font files means keeping the old ones on the server.** A returning visitor inside the CSS cache window
  requests the old names; delete them and they get a 404 and a system font until the cache expires.

## Images

- **WebP at three widths** (never upscaled), `srcset` and `sizes`, `width` and `height` declared, lazy below the
  fold, **the hero preloaded with the same `imagesrcset`** so the browser fetches the right width once.
- **`width`/`height` attributes plus a CSS width without `height: auto` render the image at the attribute height**:
  a distorted picture. It hit us four times in eight days, including a store's first deploy.
- `sizes` must describe the real rendered width. On a carousel where one card is larger, it is the largest card.
- **Pre-darken a hero that will sit under a dark overlay** before compressing it (288 KB to 142 KB, same look).
- **EXIF and GPS stripped** on everything published.
- **The social card (`og:image`) is exempt**: JPG or PNG, 1200x630, never WebP.
- `repeat(auto-fit, minmax(Npx, 1fr))` with N larger than the phone viewport minus padding overflows silently.
- **Video is never raw.** A local competitor's home weighs 98 MB, 90 of them three raw reels autoplaying in 396 px
  boxes. Testimonial videos go in as a facade (the thumbnail in a `padding-bottom: 56.25%` box, the iframe only on
  click): zero iframes on load. Self-hosted MP4s need a server that answers `Range` requests with 206, or Safari
  will not play them (a Worker's static assets answer 200 with the whole file; serve video from object storage).

## JavaScript and CSS

- **Zero third-party origins before first paint.** Effects, icons, libraries: compiled into files on your own domain.
- **Analytics deferred to the first real interaction**: `pointerdown`, `keydown`, `touchstart`, or a timer of a few
  seconds. **Not `scroll`**: browser scroll restoration fires it during load, so a "scroll-deferred" tag started at
  99 ms exactly as before. Verify by comparing the script's `startTime` in the resource timing entries with
  `loadEventStart`.
- Minify CSS and JS (esbuild) and **version every asset URL** (`site.css?v=<hash>`). `immutable` only on
  content-hashed URLs; an `immutable` file changed under the same URL never revalidates for anyone who has it.
- **Heavy effects follow the guardrails** in [06-premium-effects.md](06-premium-effects.md): poster first, WebGL after
  load and near the viewport, paused off-screen, DPR capped at 2.

## The network layer (Cloudflare)

- HTTP/3 and TLS 1.3 on; **Early Hints on** (the edge tells the browser to start on the font and the hero before the
  HTML is ready).
- **0-RTT left off on purpose**: Cloudflare only uses it for GETs without a query string, and ad and social clicks
  always carry one.
- **Tiered cache left off**: from our country a MISS on a static host costs only 10 to 20 ms more than a HIT.
- **The HTML cache rule** on Pages sites (24 h at the edge, browser TTL respecting origin, scoped to the site's
  hostnames, query string excluded from the cache key) **also caches 404s for the whole TTL**: add a status-code TTL of
  60 s for 400 to 599. Worker static-asset sites are edge-cached without a rule.

---

## Field notes from the log

**First bytes and critical CSS**
- The "H1 in the first 2,000 bytes" check counts UTF-8 bytes, not characters. Keep only `:root`, `body` and the H1 rules
  in the `<style>` in the `<head>`, and put a second `<style>` right after the hero. One single-file demo moved its H1
  from byte 10,000 to byte 3,550 this way.
- **A preloaded hero needs the same `imagesrcset` and `imagesizes` as its `<img srcset>`**, or a phone downloads two
  copies: the preload URL and the srcset pick.

**Fonts**
- **Subsetting a static font pays about eight to one**: a 15 KB latin plus 12 KB latin-ext pair became 11 KB with
  `pyftsubset --unicodes=<basic latin, accents, typographic punctuation, your currency sign> --flavor=woff2
  --layout-features=* --no-hinting`. A two-axis variable font of the same family was 88 KB.
- **Fix a missing glyph without touching the design:** a one-glyph fallback family (`pyftsubset src.woff2
  --unicodes=U+20B2 --flavor=woff2`, about 700 bytes) declared with `unicode-range: U+20B2` behind the family that lacks
  it. The browser only downloads it when a page uses the glyph.
- The guaraní sign (U+20B2) lives in the latin-ext subset, so serve both subsets. Checked with fontTools: present in
  Archivo, Archivo Narrow, Asap, IBM Plex Sans and Mono, Nunito, Nunito Sans, Oswald, Source Sans 3, Source Serif 4,
  Space Mono, Big Shoulders, and the system faces Segoe UI, Arial, Verdana and Roboto. Missing in Inter, Figtree, Public
  Sans, Urbanist, Manrope, JetBrains Mono, Fira Mono and Roboto Mono. Have the generator assert the glyph is never used
  with a font that lacks it.
- Google Fonts' CSS2 API, asked with a current Chrome User-Agent, returns one variable woff2 per subset covering every
  weight: deduplicate by URL, not by weight, and declare `font-weight: 400 700`. Families with a width axis
  (`wdth,wght@75..125,100..900`, declared with `font-stretch: 75% 125%`) give condensed headings and normal text from one
  file. `&text=` subsets a display face down to the letters of a logo.
- The CSS `font` shorthand resets `font-stretch`: declare the stretch after it.
- fontTools: subsetting right after instancing a variable font can fail on a lazily loaded table. Load with `lazy=False`,
  instance, save to memory, reload with `lazy=False`, then subset.
- Give a metric fallback face the same `unicode-range` as the web font, or it steals glyphs the web font lacks.

**Images**
- **Pick `srcset` widths from the source size.** Square 1080 px photos need only 1080, 720 and 360; a source narrower than
  your widest width needs its own set, never an upscale.
- `naturalWidth` on an image with a `w`-descriptor `srcset` is in CSS pixels (file width over the chosen density); read
  `currentSrc` to see which file loaded.
- **iPhone photos are Display P3.** Convert to sRGB with a colour-management step before saving a web JPG or WebP, or the
  colours go flat.
- A long-cached photo re-cropped under the same name never refreshes for returning visitors: append `?v=<hash>`. If the
  edge cache ignores the query string, purge the bare URL too.
- In-browser image compression on upload that works on phones: `createImageBitmap(file, {imageOrientation:
  'from-image'})`, a canvas with a white fill, `toBlob('image/webp', .8)`, and a retry as JPEG when the returned blob is
  not WebP (older Safari cannot encode WebP). HEIC fails in Chrome; say so in the interface.

**Measuring**
- **Deferring analytics moved Best Practices, not LCP:** session-recording scripts set third-party cookies inside the
  Lighthouse window (Best Practices 77, then 100 once they loaded after the first interaction). A footer `h4` changed to
  `h2` took Accessibility from 98 to 100.
- Never quote session-recording "web vitals" as load speed: one tab left open produced a 114-second average LCP.
- Time TTFB with several requests on one kept-alive `curl` call. The same host measured 2.1 s cold and 0.16 s minutes
  later. A direct `*.pages.dev` URL was slower than the proxied custom domain (310 vs 184 ms).
- Compare libraries minified and gzipped against minified and gzipped, never against the raw size of your own file. One
  component weighed 38.7 KB gzip, almost twice a whole home page.
- Workers static assets default to `max-age=0, must-revalidate` (unless `_headers` says otherwise): browsers revalidate
  by ETag, so a purge is enough. Our template gives `/assets/*` a year of immutable cache instead, which is exactly why
  every asset URL there carries a version.

---

## Checklist · loading speed

- [ ] Lighthouse mobile, 3 runs, median, home + 2 key pages: Performance ≥ 90, A11y / BP / SEO = 100.
- [ ] The LCP element identified per template, and it is painted on the first frame (no reveal, no observer).
- [ ] The H1 is in the first 2,000 bytes of the HTML (`curl -sL <url> | head -c 2000`).
- [ ] HTML under about 150 KB; the page under about 1.5 MB before lazy images load.
- [ ] No third-party request before first paint; afterwards only analytics, session recording and the map.
- [ ] Fonts self-hosted woff2, only the weights and axes in use, the critical file preloaded with `crossorigin`,
      metric-matched fallback, the currency glyph present, old font files kept after a rename.
- [ ] Content images WebP at 3 widths with `srcset` + `sizes`, `width`/`height` + `height:auto`, lazy below the
      fold, hero preloaded with `imagesrcset`, EXIF/GPS stripped.
- [ ] No raw video; video served with `Range` support; YouTube behind a facade.
- [ ] Analytics deferred to interaction (not scroll), only on the real host.
- [ ] CSS/JS minified; every asset URL versioned; `immutable` only on hashed URLs.
- [ ] HTML cached at the edge (Worker assets by default, a cache rule on Pages) with a purge on every deploy; 404s
      cached 60 s only; Early Hints on.
- [ ] TTFB measured with 5+ samples, median.

## Checklist · runtime smoothness

- [ ] CLS 0 on load, after scrolling every section, and on reload (fonts, counters, effects, images all reserve
      their boxes).
- [ ] No frozen page: every page answers a debugger ping and draws frames (see [12-qa.md](12-qa.md)).
- [ ] Console errors 0; no long tasks over 50 ms from our own code during scroll.
- [ ] Looping animations run only on screen and stop on a hidden tab; no transform loops on SVG off-screen.
- [ ] Heavy effects: one per section, paused off-screen, DPR ≤ 2, frame rate measured per section with a real GPU.
- [ ] `content-visibility: auto` on long below-the-fold graphic containers where it does not break anchors.
- [ ] `prefers-reduced-motion` honoured without hiding content.
