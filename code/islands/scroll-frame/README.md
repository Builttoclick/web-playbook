# Scroll-linked frame

A section whose content sits in a frame that enters tilted back 20° and 5% larger, and straightens as the
visitor scrolls, while its title drifts up. No scroll library: `frame.css` holds the only numbers, and the
island `fx/islands/frame.jsx` drives the same keyframes where the browser cannot.

## Markup

```html
<section class="scene-section">
  <div class="scene" data-fx="frame" data-fx-when="now">
    <header class="scene-title"><h2>Results</h2></header>
    <div class="scene-span">
      <div class="scene-sentinel" aria-hidden="true"></div>
      <div class="scene-frame">
        ...the content: cards, charts, numbers...
      </div>
    </div>
  </div>
</section>
```

The island mounts right away (`data-fx-when="now"`): where CSS scroll-driven animations exist it returns
immediately and the compositor does the work.

## Checks before shipping

- Probe the computed transform of `.scene-frame` at scroll progress 0, 0.25, 0.5, 0.75 and 1 in a browser with
  scroll-driven animations, then again with `window.__frameJs = true` set before load: the matrices must match.
- Load the page scrolled into the middle of the scene (an anchor link): the frame must be flat and must not jump.
- With reduced motion, and with JavaScript off: flat from the first paint.
- No horizontal overflow at 360 to 430 px (`.scene-section` clips it).
- Numbers inside the frame that count must measure their width with `getComputedStyle`, not with the projected
  bounding rectangle (see `lockWidth()` in `fx/islands/_common.js`).
