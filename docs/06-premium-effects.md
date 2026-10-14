# 06 · Premium effects: React Bits on a fast static site

In October 2026 we started selling more expensive sites to an audience that browses on iPhones, with
real effects: WebGL backgrounds, 3D card stacks, glass, light that follows the pointer, scroll-linked
scenes. The constraint from day one: **"we won't kill the speed"**. This file is how we did it, what we
measured, and every rule the first build taught us. The reusable code is in [`code/islands/`](../code/islands/).

Our effects library is [React Bits](https://reactbits.dev) (free, MIT + Commons Clause, a couple of hundred
components, 3D included). Our sites are static HTML written by a Python generator, not React apps. We
rejected translating components to plain HTML by hand (detail is lost and every update is a redo) and we
looked past adopting a framework. The answer was smaller than both.

---

## 1 · What actually makes a site slow or invisible to Google

The host is not the problem. Where the HTML gets made is. We checked three sites live, reading the raw HTML
an iPhone receives before any JavaScript runs:

| Site | Host | Built with | Words in the raw HTML | H1 in the HTML |
|---|---|---|---|---|
| React Bits Pro | Vercel | Next.js, server-rendered | 1,966 | yes |
| reactbits.dev | Cloudflare | Vite SPA with a prerendered shell | 79 | yes |
| a competitor's flashy portfolio | Netlify | Vite SPA, client-only | 32 | **no** |

Vercel serves full HTML when the framework renders on the server. The sites that "load weird with no HTML"
are **client-only React apps**: the browser gets an empty `<div id="root">`, downloads React plus the whole
app, and only then paints. That costs first paint and SEO wherever it is hosted.

**An effect carries no SEO.** A background, a tilt card, a particle field: there is nothing for Google to
read. Only text effects touch SEO (the H1, a headline). So if the page itself is HTML, SEO is solved by
construction, and the only questions left are how much the effects weigh and when they load.

## 2 · What React Bits is made of

We analysed 182 of the component sources:

| Technology inside | Count | What React does in it |
|---|---|---|
| Raw WebGL, no library | 65 | a wrapper: create the canvas, start the loop, clean up |
| `ogl` (tiny WebGL library) | 21 | same |
| `three` (no React layer) | 7 | same |
| `@react-three/fiber` | 3 | a real dependency (needs real React) |
| `gsap` | 20 | a wrapper |
| `motion` | 13 | the animation engine itself is React-bound |
| DOM, CSS, canvas 2D only | about 50 | small state plus JSX |

Worked example, the **Aurora** background: 481 lines, of which the React part is 66 (props, `useRef`,
`useEffect`, four lines of JSX). The other 415 (the GLSL shader, colour maths, render loop, pause-off-screen
logic) are plain JavaScript that does not know React exists. **The look of a 3D effect lives in the shader,
not in React.** WebGL share by category, measured: Backgrounds 57 of 62, Animations 22 of 39, Components 16
of 48, Text 2 of 33.

## 3 · The bench: the same effect three ways

Bundled with esbuild, minified, sizes gzipped:

| | React 19 | **Preact (compat)** | Plain JS custom element |
|---|---|---|---|
| Runtime alone | 67.5 KB | **6.6 KB** | 0 |
| Aurora (raw WebGL) | 72.3 KB | **11.6 KB** | 4.8 KB |
| LightRays (ogl) | 83.0 KB | **22.3 KB** | about 15.5 KB |
| Hyperspeed (three.js) | 210.6 KB | 149.2 KB | about 143 KB (three.js is the weight) |
| BlurText (motion) | 115.6 KB | 54.8 KB | n/a |
| SplitText (gsap) | 117.0 KB | 56.1 KB | n/a |
| TiltedCard (motion) | 117.1 KB | 56.3 KB | n/a |

**Quality:** Aurora rendered at a fixed frame in all three versions at 360x240 and read back pixel by pixel:
React vs Preact, **0 differing bytes of 345,600**; React vs plain JS, 0 of 345,600. Identical.

**Compatibility:** all six ran unchanged under Preact with zero console errors, including three.js, GSAP with
`@gsap/react`, and motion. The only known exceptions are the three `@react-three/fiber` components.

**Rendered to HTML at build time:** SplitText gives a real, visible `<h1>`: good for a headline. **BlurText
gives a `<p>` with every word at `opacity:0`**: Google reads the words, but the phone shows nothing until
JavaScript runs, and since invisible text does not count as painted, a hero like that pushes LCP to the end
of the animation. Never on the H1 without a patch (start from blur, not from invisible). Aurora gives an empty
canvas: decoration, nothing to index.

## 4 · The options, compared

| Option | SEO | Speed | Quality vs original | Our code, our server | Cost to us |
|---|---|---|---|---|---|
| Full React SPA | weak | slow first paint | 100% | yes | low |
| Next.js on Vercel | good | heavy (React + Next runtime, whole page hydrates) | 100% | partly | a new stack |
| Astro islands | good | good | 100% | yes | replaces our generator and toolkit wiring |
| Hand translation to HTML/CSS/JS | good | best | **loses detail**, redone on every update | yes | high, forever |
| **Our own islands on Preact** | good | very good | **100%, pixel-identical** | **yes, 100%** | one build step |
| Mechanical plain-JS port (on top) | good | best | 100% (proven on Aurora) | yes | small, per effect |

A "mechanical port" is not translation: a script copies the shader and logic byte for byte and only the
66-line wrapper changes. Worth it only where 6 KB matters (a home hero). The default is Preact.

We also built the first lab page in Astro the same morning. It was replaced that day: its wall of images
jumped on load. The framework was not the cause; the poster geometry was (rule 2 below). That is why the
recipe below puts all its care into the first frame.

---

## 5 · The recipe: HTML first, effects as islands, nothing third party

1. **The page stays ours.** The generator writes every word, the H1, the images, the meta and the schema
   into the HTML, exactly as before. That is why the sites score well, and it does not change.
2. **React Bits files are copied untouched** into a pinned folder (the upstream commit written down), so an
   update is a copy. Every adaptation lives in our own wrappers, never inside their files.
3. **One build step** (esbuild, about one second) compiles each effect into its own small file with React
   aliased to Preact, content-hashed (`fx/aurora.3f9a.js`), shared parts split into common chunks, served
   from our own Cloudflare with a one-year immutable cache. **No CDN, no npm at runtime, no request leaves our
   domain.** React itself is never installed, so if the alias ever breaks the build fails instead of
   silently shipping React.
4. **Every effect has a poster that IS its first frame.** The same components are rendered to HTML at build
   time (Node, `preact-render-to-string`, the same props) and then **hydrated in place** in the browser, so
   nothing is redrawn. Where a component positions things in an effect at runtime (a wall of images, a 3D
   card stack), the generator paints the poster itself with the component's exact geometry.
5. **A loader of about 1 KB, inline in the HTML**, mounts hero islands right after first paint and the rest
   when they come within 700 px of the screen. With `prefers-reduced-motion`, only islands marked "quiet"
   mount (things that need a click to work: glass navigation, the WhatsApp button, chips, flip cards), so
   nothing interactive is dead and nothing decorative moves.
6. **Text effects:** the words are in the HTML at build time and the H1 starts visible. Fine as they are:
   SplitText, scramble, letter-spacing reveals. Patch: BlurText must start from blur, not from invisible.
7. **The three components that need real React** (`@react-three/fiber`) get real React for that island only,
   loaded lazily on that page, or are skipped.

### The markup contract

```html
<!-- in the HTML the generator writes: the poster is real HTML, already painted -->
<span class="fx" data-fx="shiny" data-props='{"text":"Websites that sell","speed":3}'>
  <span class="shiny-text">Websites that sell</span>
</span>

<!-- a hero island mounts right after first paint -->
<div class="hero__wall" data-fx="wall" data-fx-when="now">…poster tiles…</div>

<!-- a quiet island still mounts with reduced motion -->
<button class="cta" data-fx="specular" data-fx-quiet>Message us on WhatsApp</button>
```

Island types we ended up with:

| Type | How it mounts | Examples |
|---|---|---|
| **Hydrate** | the build painted the component; the island hydrates it with the same props | text effects, cards, counters, chips |
| **Render over the poster, then fade** | a layer on top renders the live component; when its first frame is drawn (and its images decoded) the layer fades in and the poster hides | WebGL backgrounds, the image wall |
| **Our own engine** | adopts the first frame the generator wrote and animates from there | the 3D card wheel |
| **Scroll-linked** | CSS on the compositor where supported, a tiny fallback elsewhere | the results frame |

---

## 6 · The quality bar: "no weird resize"

The agency owner set it after seeing a wall of images re-centre on reload: **nothing on the page may move
because an effect arrived.** In practice:

- Every effect's poster is its **exact** first frame.
- **The live effect must not move while it fades in over its poster.** Our live image wall mounts with speed
  and parallax at zero and only receives its real props after the 0.8 s fade, when the poster is hidden.
- **Entrances never replay** on something already visible (slow phone, restored scroll, anchor link).
- **Fonts need metric-matched fallbacks**, so text sits at the same pixels before and after the font arrives.
- **Verify it with measurements, never by eye** in an automation pane (they throttle frames when hidden).

Measured on our lab page after building it this way: poster vs live **0 px** element by element at 390, 834
and 1440 px wide; **CLS 0** on load and after scrolling every section, desktop and phone; 0 console errors;
desktop LCP 120 ms (the H1); phone on throttled 4G (1.6 Mbps, 4x CPU) LCP 1.76 s (the hero paragraph), fonts
at 1.77 s with zero movement; 60 fps in every section on desktop, 53 on a continuous scroll. Page: 260 KB of
HTML (35 KB gzip), 71 KB of CSS, island JavaScript loaded only as sections come near.

---

## 7 · Rules the first build taught us

**Posters and hydration**

1. **The "weird resize" was a component re-centring at hydration.** The poster must reproduce the component's
   geometry exactly (for a scrolling image wall: two copies per column, the same per-column offsets, explicit
   track heights, and only the tiles actually visible).
2. **Preact's hydration leaves styles alone** (it only attaches event handlers). If a component writes big
   inline styles per instance, strip them in the build and put them once in the stylesheet (one card effect
   inlined a 3.7 KB gradient per card).
3. **Two instances of a component that uses `useId` (poster + live) get the same ids.** Rename the poster's ids
   in the build.
4. **A counter component leaves its span EMPTY for one frame** between hydration and its first "0". A paragraph
   holding only that span collapsed to 0 px (a 36 px jump measured on a phone). Fix: `.figure:empty::before
   {content:'0'}` plus a box as wide as the final number, set from the poster's measured width before
   hydration (the `ch`-based classes are the no-JS fallback). Counters then never move the "%" next to them.
5. **A card-stack component positions its cards in a layout effect**, so its server render has every card in the
   same spot. The poster has to be the rest frame: each slot's transform, z-index, opacity, visibility and
   shade written as CSS variables per breakpoint, computed by a port of the component's own geometry
   functions. And the column must be at least as wide as the stage at every width, or the component scales the
   stage and the poster stops matching.
6. **An icon component with its intro animation on renders everything at `opacity:0` until JavaScript
   arrives.** Turn the intro off so the poster is the final frame. If it sizes a canvas at mount, give the
   poster's CSS that same box (its margin was `ceil(tile × 0.7)`), or the inline sizing counts as a layout shift.
7. **A count-up in the hero only counts if it arrives early** (under about 1.3 s from navigation start). On a
   slow phone the final number appears by CSS and stays still; it never goes back to zero.

**Layout and interaction**

8. **`place-items:center` on an image wrapper collapses a lazy, not-yet-loaded image to 0x0** in current Chrome.
9. **In a 3D-transformed plane, the column track can win the hit test over its tiles**: give pointer events only
   to the tiles.
10. **HTML order matters on slow phones:** hero text before the heavy poster markup, the effect's data at the
    end of the document.
11. **Hover-only effects need a resting state that already looks good**, because phones have no hover. An effect
    that takes one trigger gets hover with a pointer and click on touch (`matchMedia('(hover: hover)')`).
12. **A pixel-dissolve effect lagged** (about 220 cloned pixels animated per card, four cards). Replaced by a CSS
    3D flip, one transform. Cheap wins over clever.
13. **A "specular" button component is a `<button>`, not a link.** The island's click handler opens WhatsApp, and
    the island is marked quiet so it still mounts with reduced motion (the light just does not spin).
14. **A component's built-in timer cannot show a fixed value** ("6 min"): turn the timer off and pass the value as
    text.
15. **One heavy effect per section.** Our results page ran three WebGL2 contexts at one point (a button, glass
    plates, a background), each pausing itself off-screen, and still held 60 fps per section on desktop.
16. **GSAP and `@gsap/react` must resolve to their ESM builds in the Node render** (`mainFields: ['module',
    'main']`), or a second copy of Preact loads and hooks lose their component.

**Hosting**

17. Our agency zone hit the platform's limit of 100 Workers custom domains; the lab host runs as a zone **route**
    plus a proxied `AAAA 100::` record created before the deploy ([11-deploy-hosting-domains-email.md](11-deploy-hosting-domains-email.md)).

---

## 8 · Scroll-linked effects without a scroll library

The results section frame was a port of a popular "container scroll" component that uses framer-motion
(`useScroll` + `useTransform`). We ported the effect, not the stack: **one set of `@keyframes` driven two ways.**

- The frame enters tilted back 20° and 5% larger, and straightens while its top edge travels from the bottom of
  the screen to a quarter of the way down (the height of an invisible sentinel element). The title drifts up
  40 px.
- **Where the browser has scroll-driven animations** (Chrome 115+, Edge, Safari 26), CSS runs it on the
  compositor with `animation-timeline` on a named view timeline of the sentinel (`timeline-scope` on the
  scene), and no JavaScript runs at all.
- **Elsewhere** (Firefox, iOS 18 and older), a tiny island pauses the same animations and writes
  `animation.currentTime = progress × duration` once per scroll frame.
- Both paths produce **identical matrices** at every scroll position (we probed 0, 25, 50, 75 and 100% on
  desktop, tablet and phone).
- **The numbers live only in the keyframes, as literals per breakpoint.** Keyframes that use `var()` are not
  guaranteed to run on the compositor.
- **Without JavaScript or with reduced motion there is no animation**: flat from the first paint.
- **If the scene is already on screen when the script arrives**, it stays flat and only arms once it has left
  the screen. Never a jump from flat to tilted.
- Counters inside the transformed frame measure their width with `getComputedStyle` (layout width), never the
  projected bounding rectangle.
- The section clips horizontal overflow (`overflow-x: clip`): the frame starts larger than its column.

The full CSS and the fallback island are in [`code/islands/scroll-frame/`](../code/islands/scroll-frame/). When
someone pastes a component from Aceternity or 21st.dev, this is the route: port the effect onto our HTML this
way instead of installing their stack.

---

## 9 · A 3D card wheel with no WebGL

To show 150 demo sites we built our own engine instead of a library component: every demo on one side of a 3D
ring of cards seen from the side, like a rolodex, running off the right edge so it reads as endless; the front
card slides out toward the text.

- **The engine writes three numbers per card and the CSS owns every size.** `--a` (angle around the axis),
  `--t` (how far the card is pulled out, 0 to 1) and `--o` (opacity). The CSS turns them into one transform:

  ```css
  transform: rotateY(calc(var(--a) * 1deg))
    translate3d(calc(-1 * var(--r) - var(--t) * var(--slide)),
                calc(var(--t) * var(--lift-y)), calc(var(--t) * var(--lift-z)))
    scale(calc(1 + var(--t) * var(--grow)));
  opacity: var(--o);
  ```

  So the first frame is one HTML for every width, and the generator's Python port of the pose formula is the
  whole poster: **0.0 px** difference on 45 cards at 1440, 834 and 390 px, local and live.
- **`--t = smoothstep(max(0, 1 − 2·|d|))`**: a card is only pulled out within half a card of the front, so the
  one leaving is back in the ring before the next one comes out. Two cards out at once crossed each other in 3D.
- **A push toward the camera inside a tilted frame also moves the card down.** Split it with CSS trigonometry:
  `--lift-y: calc(var(--lift) * -1 * sin(var(--tilt)))` and `--lift-z: calc(var(--lift) * cos(var(--tilt)))`.
  (CSS `sin()`/`cos()` need iOS 15.4+.)
- **`.card { display: flex }` beats the browser's own `[hidden]`**: add `.card[hidden] { display: none }` or every
  hidden card stays on screen.
- **The wheel never traps the page scroll:** vertical wheel and touch always scroll the page; only a sideways
  swipe, a drag, a click or the arrow keys turn it (`touch-action: pan-y`).
- Discrete steps are a 700 ms ease-in-out tween; an exponential ease snapped the leaving card back in about 80 ms.
- `sizes` on the images is the width of the **selected** card, the largest image on screen.
- About 57 DOM nodes for 150 demos: cards are created when they come near and get their image a few cards early.
- Auto-advance every 3.6 s, paused under the pointer, for 5 s after any touch, off-screen and on a hidden tab;
  with reduced motion no auto-advance and no easing, still fully usable.
- It is CSS 3D, so it behaves the same in Safari and on iPhones.

---

## 10 · Speed guardrails for any heavy effect

- **A static poster paints first and is the LCP.** The live effect never is.
- **WebGL loads after the load event and only near the viewport.**
- **Pauses off-screen and on a hidden tab.**
- **Device pixel ratio capped at 2.** iPhones are 3x screens; capping the canvas at 2x renders 56% fewer pixels
  with no visible difference on a moving effect.
- **One heavy effect per page section.**
- **Reduced motion and failed WebGL keep the poster.** Feature-detect (`canvas.getContext('webgl2')` in a
  try/catch) before mounting.
- **Zero third-party origins before first paint.** Fonts, effects, icons, libraries: our domain only. The same
  lesson we learned with Google Fonts, applied to everything.
- **Fonts:** self-hosted woff2, subset, metric-matched fallback. **Safari supports `size-adjust` but not
  `ascent-override`/`descent-override`**, so on iPhone the fallback match relies on `size-adjust` alone: keep
  `line-height` explicit to avoid a jump.
- **Analytics and pixels** are now the biggest third-party weight on our sites: load them after the first
  interaction or idle, or run them at the edge (Cloudflare Zaraz is free up to 1,000,000 events a month).
- **Cloudflare Early Hints** (free) lets the edge tell the browser to start fetching the poster and the font
  before the HTML is ready.
- The Lighthouse gate in our toolkit stays exactly as it is ([07-performance.md](07-performance.md)).

### iPhone facts that matter for a premium audience

- **Google never measures iPhones.** The Chrome UX Report (the field data behind Core Web Vitals in ranking)
  comes only from Chrome on Android and desktop; iOS is excluded. Lighthouse and PageSpeed also emulate an
  Android. So we design for the iPhone, but **the Google speed score is decided by Android and desktop
  visitors**, and the Android-emulated Lighthouse gate stays.
- **Low Power Mode caps animation at 30 fps** in iOS Safari. Effects must look good at 30 fps: slow, flowing
  effects survive it; fast particle effects stutter.
- **Cross-document View Transitions** work in Safari 18.2+ and Chrome 126+: page-to-page fades with one CSS rule
  and zero JavaScript. Cheap luxury feel on iPhone.
- **Speculation Rules** (instant next page) are Chrome-only; harmless to add, useless for iPhone visitors.
- Real refraction glass (SVG filters in `backdrop-filter`) runs only on Chromium; Safari and Firefox get the
  component's frosted fallback. Treat the fallback as the design for iPhone users, since it is what they see.
- WebGL2 effects need iOS 15+. **WebGPU effects** (one background we liked runs on a young WebGPU library)
  render nothing on iPhones before iOS 26 and on many Androids: the poster is all most visitors will see. Test on
  a real iPhone before promising one.

---

## 11 · The components we have used, and their traps

| Component | Used for | Trap |
|---|---|---|
| DriftWall | the image wall in a hero | re-centres at hydration unless the poster has its exact geometry; mount the live wall with motion at zero until its fade ends. Preferred over a circular carousel for showing websites |
| CardSwap | a 3D stack of window-style cards, one per site | the poster must be its rest frame per breakpoint (rule 5) |
| GlassSurface | navigation glass | true refraction on Chromium only |
| GlassIcons | a glass icon grid | intro off, canvas box reserved (rule 6); label "always" on phones |
| CountUp | figures | the empty span (rule 4) |
| SpecularButton | the one main CTA | it is a `<button>`; each one is its own WebGL2 canvas, so one per page |
| CallChip | small "running → done" pills | timer off for fixed values (rule 14) |
| BorderGlow | cards whose border lights up toward the pointer | hover only: give it a good resting state |
| Threads | a calm WebGL2 background | SVG poster of still lines; skipped without WebGL2 |
| ShinyText, SplitText, StarBorder, LogoLoop | eyebrow and headline shine, headings, a CTA border, a logo tape | fine as hydrated islands; skip an entrance already on screen |
| SpotlightCard + GlareHover + AnimatedContent | client cards | strip per-instance inline styles (rule 2); no entrance if already visible |
| PixelSwap | a before/after dissolve | lagged on four cards; replaced by a CSS flip |

Picked for later, with notes: **Scroll Expand** (a framed video grows to full screen on scroll; it sets the
section's height in JS after mount, so the poster must reserve that height in CSS), **Masonry** (needs GSAP and
lays tiles out in JS from the measured width, so the poster must be that same layout, with each photo's height
known at build time), **Cubes** and **Circular Gallery** (raw WebGL2, the page's one heavy effect, poster
required), **Folder Float** (pulls in a physics library; tap trigger on phones), **Code Slots**, **Pulse Heart**,
**Tech Text**. **Cursor-following effects stay banned** unless asked for, and then only inside one box with the
normal cursor kept.

---

## 12 · Where else we take effects from

| Source | What for | Notes |
|---|---|---|
| [React Bits](https://reactbits.dev) | the base effects library | the official component grid at `/get-started/index`; real sites at `/showcase`. Stay on the free tier |
| [21st.dev](https://21st.dev) | thousands of React + Tailwind components | React, so it goes in through the same islands recipe. Free tier: browse everything, two copies a day |
| [GSAP](https://gsap.com) | animation engine with scroll, SVG and text plugins | free with every plugin, plain JS, works on any static site |
| Aceternity UI | scroll-linked scenes | port the effect (section 8), do not install framer-motion |
| [Godly](https://godly.website) (now recent.design), [Awwwards](https://www.awwwards.com) | the premium reference bar | a reference is a reference: rebuild the look with our code, never its code, photos or text |

Not chosen: anime.js (GSAP covers it), AOS (old, our reveal system already does it), Motion as a separate
dependency (it is already inside React Bits where needed).

---

## 13 · How we verify an effects page

Never by eye in an automation pane. We run small scripts with a real headless browser:

- **Poster vs live, element by element:** the bounding rectangle of every island's poster before mount and of the
  live component after, at 390, 834 and 1440 px. Target 0 px.
- **Load filmstrip:** frames every 100 ms on a throttled phone profile, every layout shift with its source
  element, LCP and its element, the moment the fonts arrive.
- **Reload separation:** load plus two reloads, measuring the gap between poster and live **during** the fade.
- **Real frame rate per section** with a GPU-backed headless browser, scrolling through each section.
- **Interactions and long tasks:** click, hover, keyboard on every interactive island; long tasks over 50 ms
  logged.
- **CDP screenshot clips are in page coordinates, not viewport coordinates**: add `scrollY` or the frames come
  out blank. Wait for every visible image to be `complete` before a photo, or a cold cache shows grey cards that
  are fine in a real browser.
- If two people work on the same page, rebuild and grep the output for the version you expect before QA: a
  shared output folder means one person's build replaces the other's.

Not yet done at the time of writing: a pass on a real iPhone in Safari (our machines had no WebKit). Safari is
expected to show the glass fallback and needs iOS 15+ for the WebGL2 pieces.
