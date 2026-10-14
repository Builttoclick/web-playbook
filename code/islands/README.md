# Islands: React Bits on a static HTML site, compiled on Preact

The build and loader we use to run React Bits components (or any React component) as small, self-contained
islands on a page whose HTML is written by our own generator. The reasoning and the measurements are in
[`docs/06-premium-effects.md`](../../docs/06-premium-effects.md). This folder is a cleaned-up, English copy of
the working code, not a package: copy it into a site and adapt.

What you get:

- **Our HTML stays the page.** Words, H1, images, schema: all written by the generator, readable without
  JavaScript.
- **Each effect compiles to its own hashed file**, with React aliased to Preact (about 6.6 KB of runtime
  instead of 67.5 KB, pixel-identical output), shared code split into chunks, served from your own domain.
- **Every island has a poster that is its exact first frame**: the same component rendered to HTML at build
  time with the same props, then hydrated in place. Nothing is redrawn, nothing jumps.
- **A loader of about 1 KB inline in the page** mounts hero islands right after first paint and the rest as
  they come within 700 px of the screen. With reduced motion only islands marked "quiet" mount.

---

## Layout

```
package.json                  pinned versions (no react, no react-dom: the alias must never fall back)
rb/                           React Bits sources, copied UNTOUCHED, pinned to one upstream commit (see rb/README.md)
fx/build.mjs                  esbuild: islands for the browser + the Node renderer for posters
fx/ssr.jsx                    the Node renderer: [{id, piece, props}] -> {id: html}
fx/loader.js                  the inline loader (__ISLANDS__ is replaced by the build's {island: url} map)
fx/pieces/*.jsx               our markup around each React Bits component (what both the poster and the island render)
fx/islands/*.jsx              how each piece mounts in the browser (one file = one island = one hashed bundle)
fx/islands/_common.js         helpers shared by islands (files starting with "_" are not islands)
generator/islands.py          the Python side: write island markup, render posters, inline the loader
css/counters.css              the counter fixes (empty span, fixed width, hero timing)
css/entrance.css              entrances that never hide what is already on screen
css/fallback-fonts.example.css  metric-matched fallback faces, so text never moves when fonts arrive
scroll-frame/                 a scroll-linked 3D frame: CSS on the compositor + a fallback island
```

## Use it

```bash
npm install                         # esbuild, preact, preact-render-to-string, and what your pieces import
node fx/build.mjs                   # -> dist/fx/<island>.<hash>.js, dist/fx/c.<hash>.js, .cache/islands.json, .cache/ssr.mjs
python your_generator.py            # renders posters through .cache/ssr.mjs, writes the HTML, inlines the loader
```

In the generator (see `generator/islands.py`):

```python
from islands import island, paint, inline_loader

posters = paint([{"id": "h1", "piece": "Shiny", "props": {"text": "Websites that sell", "speed": 3}}])
hero_title = island("shiny", posters["h1"], props={"text": "Websites that sell", "speed": 3}, now=True, tag="h1")
# ... the rest of the page ...
html += f"<script>{inline_loader()}</script>"
```

Which writes, for example:

```html
<h1 class="fx" data-fx="shiny" data-fx-when="now" data-props='{"text":"Websites that sell","speed":3}'>
  <span class="shiny-text">Websites that sell</span>
</h1>
```

## Rules that keep it fast and still

1. Never edit files in `rb/`. Every adaptation goes in `fx/pieces/`, `fx/islands/` or your CSS.
2. The poster must be the component's exact first frame. If a component positions things in an effect at
   runtime, paint the poster yourself with its geometry (or render it with the same props). Check poster vs
   live rectangles at 390, 834 and 1440 px: the target is 0 px.
3. Nothing moves while it fades in over its poster. Mount the live component with its motion at zero and give
   it the real props after the fade.
4. An entrance that arrives when its element is already on screen does not play.
5. One heavy effect (WebGL) per section, paused off-screen and on a hidden tab, DPR capped at 2, skipped when
   WebGL2 is missing (the poster stays).
6. Copy each component's CSS once into your stylesheet; the build ignores CSS imports on purpose.
7. If a component writes large inline styles per instance (gradients, noise SVGs), strip them from the poster
   HTML in the generator and put them once in the stylesheet: Preact's hydration does not touch styles.
8. Two instances of a component that uses `useId` (poster and live) get the same ids: rename the poster's.
9. The three React Bits components built on `@react-three/fiber` need real React. Give them their own island
   with React, loaded lazily, or skip them.

## License

The code in this folder is CC0 like the rest of the repo. React Bits itself is MIT + Commons Clause: use its
components in your sites, do not sell the components themselves. It is not included here; fetch it as
described in `rb/README.md`.
