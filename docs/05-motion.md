# 05 · Motion

Motion is a finishing pass with a budget. Distinctness comes from structure ([03-structure.md](03-structure.md));
adding effects is how a page starts to look generated. **If you notice an animation, it is mis-calibrated.**

For heavier effects (WebGL backgrounds, React Bits components, scroll-linked 3D) see
[06-premium-effects.md](06-premium-effects.md). This file is the everyday system every site gets.

---

## The budget

- **Three mechanics per site, and one of them is the reveal.** Not three per page: three per site.
- **One easing curve across the whole site.**
- **Nothing re-animates on a second pass.** Observers `unobserve()` on fire. Scroll back up and nothing
  repeats: repeating feels cheap and costs CPU forever.
- **No glow**, no shadow tinted with the element's own colour.
- **Loops run only on screen**, and stop on a hidden tab.
- **`prefers-reduced-motion` turns all of it off** without hiding anything.
- **Banned outright:** loading screens, custom cursors and cursor followers, dark-mode toggles, anything that
  makes the page pan sideways on a phone. A magnetic CTA on hover is fine, desktop only.

---

## The numbers that do all the work

It is not the code, it is the values.

**One easing curve for everything.** Our client builds use `cubic-bezier(0.22, 1, 0.36, 1)`; our own agency
site uses the slightly snappier `cubic-bezier(0.16, 1, 0.3, 1)`. Both belong to the same family: around 96%
of the travel happens in the first half of the duration, so the eye reads *"it was already there"* instead of
*"it is arriving"*. Swap either for `ease-in-out` and the site feels cheap without anyone being able to say why.

**Small travel.** Client builds move 26 px on entry; our own site moves 13 px. Never the 60 to 100 px that
scroll libraries ship by default: that distance is exactly how you can tell at a glance a site uses one.

**Stagger 70 to 80 ms, capped at three items.** A fourth staggered item is a queue.

**Fire before the element arrives.** Our reveals trigger when the element reaches about 89% of the viewport
height (a negative bottom root margin), so the visitor feels the animation *started when they arrived*. Fire
earlier and it finished off screen, which reads as a static image; fire later and you see the jump.

---

## Hero entrances without a loading screen

Above the fold is **painted, not revealed** (see [07-performance.md](07-performance.md): a reveal on hero text
is how LCP goes from 2 s to 6 s). If the hero has an entrance at all, it starts on the first frame:

- Put a class on `<html>` in an inline script in the `<head>` (for example `html.intro`) that hides only the
  pieces that will animate, with a pure-CSS fallback that shows them after about 2.5 s no matter what.
- The animation script removes the class after it has set its start states.
- **Never** a curtain, a counter screen or a "loading" overlay. One site had all three removed within an hour
  of the agency owner seeing it on his phone.

---

## The traps, ordered by how much they hurt

**1. A paused element with no one to un-pause it stays paused forever.** Our CSS pauses everything carrying
`data-anim`, and the JS only releases elements inside a `[data-widget]` container. An orphan `data-anim` is
never released. If it is an SVG stroke with `stroke-dashoffset:1` inline, it is not still, it is **invisible**:
the section renders empty while the HTML, the CSS and the keyframes are all correct. It hit us once with 63
elements at the same time. The fix is one attribute; the prevention is a static linter run after touching any
graphic, exiting non-zero so it works as a pre-commit hook. Visual QA does not catch this (see trap 3).

**2. With `prefers-reduced-motion` on, SVG strokes disappear.** Killing the animation freezes the inline
`stroke-dashoffset: 1`, which is a fully run-out, invisible path. Real users have reduced motion on, and it is
common on iOS.

```css
@media (prefers-reduced-motion: reduce){
  [data-widget] [stroke-dasharray]{ stroke-dashoffset: 0 !important; }
}
```

**3. If the JS fails to load, the page is blank.** Reveal elements start at `opacity: 0`; if the script never
runs (network error, blocker, a typo that throws before the observer exists) nothing reveals, and Google sees
an empty page. The net is a class the script removes as its first statement:

```html
<html class="no-js">
```
```css
.no-js [data-reveal]{ opacity:1 !important; transform:none !important; }
.no-js [data-anim]{ animation-play-state: running !important; }
```
```js
document.documentElement.classList.remove('no-js');  // first line of the script
```

Worst case becomes "appears without animation" instead of "does not appear". Always take that trade. On lead
demos the floor is even simpler: `setTimeout(revealAll, 2200)`, not tied to `load`.

**4. If entrances hang off a `js` class, set it inline in the `<head>`**, never from a deferred script, or you
get a flash of unrevealed content.

**5. A safety animation with `forwards` kills your scroll reveals.** A CSS fallback that reveals everything
after N seconds with `animation-fill-mode: forwards` shows every element at N seconds regardless of scroll
position, silently disabling the whole system. The safety net is a class toggle, not a timed animation.

**6. Never put a scroll reveal on a `position:fixed` element at the bottom edge.** With a negative bottom
`rootMargin`, a fixed bottom bar sits permanently outside the trigger zone and never appears.

**7. `loading="lazy"` and a reveal on the same image fight.** Pick one per image.

**8. Two copies of the same looping widget breathe in sync.** Same duration on two graphics makes them move
in unison, which reads as robotic. Use mutually prime durations per page (ours ended at 7.4, 7.6, 8, 8.2,
8.4, 8.6 and 8.8 s). Easy to break when copying a widget between pages.

**9. Accordion panels measured with `scrollHeight` get cut off** when they hold an image without declared
dimensions or a font that changes the height on load. Re-measure on resize, or accept a `max-height` large
enough never to clip.

**10. Splitting a headline into per-word spans** breaks anything that touches those nodes, and it can move
the LCP element to a paragraph that carries a reveal ([07-performance.md](07-performance.md)).

**11. A horizontal carousel plus a vertical reveal equals a phantom scrollbar.** `overflow-x:auto` drags
`overflow-y` to `auto`, so a positive `translateY` on a child creates a vertical bar and the block reads like
an iframe. Give the rail `padding-bottom` at least as large as the travel.

**12. Hiding a scrollbar and keeping it draggable is three declarations:** `scrollbar-width:none`,
`-ms-overflow-style:none` and `::-webkit-scrollbar{width:0;height:0;display:none}`. A 6 px webkit scrollbar
renders thick and with arrows on Windows.

**13. Big start states push the page sideways.** A GSAP `from()` with a large scale near the edge applies its
start state at load; a fixed grain layer with a negative inset; rotated badges; a `width: 110%` piece. Each one
created sideways scroll on a phone. The net: `overflow-x: clip` on the section that owns the effect (and on
`html`), and the overflow probe before every deploy ([12-qa.md](12-qa.md)). Prefer `clip` to `hidden`:
`overflow-x:hidden` on `body` breaks `window.scrollTo` and lazy loading in tests.

**14. An entrance that arrives when its element is already visible must not play.** Hiding something the
visitor is already looking at, to show it again, is exactly the jump we never want. Check whether the element
is on screen when the script arrives (slow phones, restored scroll, anchor links) and skip the entrance.

**15. An IntersectionObserver never sees an element the visitor jumped over** (an anchor link, a fast scroll).
An entrance gated only on the observer leaves bars at height 0 forever. Also watch `scroll` and reveal the
block without animation once its bottom is above the viewport.

**16. Looping animations on SVG are not free.** A CSS transform animation on an SVG element costs a layout per
frame in Chromium (we measured 241 layouts in 4 seconds, about 10% of a CPU core). Gate looping SVG animations
to the viewport and keep decorative pulses static.

**17. Old phones pay for hundreds of animated nodes.** `content-visibility: auto` on graphic containers, and
stop infinite animations when the widget leaves the viewport.

---

## Scroll mechanics, ranked by risk

| Mechanic | Risk | Use when |
|---|---|---|
| Reveal on enter | none | always; it is the free one |
| Sticky column | low | editorial and fixed-split spines |
| Sticky card stack | low | `position: sticky; top: calc(30px + var(--i) * 5px)`, no shadow. No library needed |
| Scroll-snap rail | medium | horizontal spine, always with a partial item visible at the edge |
| Parallax | medium | one element, one page, with `animation-timeline`, not JavaScript |
| Counter | medium | only with verifiable numbers; reserve the final number's width (see 06) |
| Clip-path reveal | high | one per site at most |
| Horizontal on vertical scroll | high | the horizontal spine only, never as decoration |
| Loading screen | banned | |
| Dark mode toggle | banned | |

---

## Libraries: what is worth its weight

We measured before adopting anything:

- **Lenis** (smooth scroll, about 5 KB gzip): ships fine; did not break sticky headers, progress bars or
  reveals on our site.
- **GSAP + ScrollTrigger** (about 45 KB): worth it only when a section needs **scrub** (animation tied to
  scroll position), the one thing an IntersectionObserver cannot do. GSAP is now free including every plugin
  (SplitText, DrawSVG, MorphSVG, ScrambleText), and it is plain JavaScript, so it works on static sites. For
  scroll-linked effects we now prefer CSS scroll-driven animations with a small fallback (see 06).
- **three.js as a default** (about 88 KB gzip before any scene): a trap when the whole home weighs 21 KB
  gzip. Only for a specific, justified effect.
- **AOS and similar**: old and recognisable; our own reveal system does the same in a few KB.
- Turning on five "free" libraries on our own site added 141 KB of JavaScript, 79 times the site's JS. The
  two that were actually noticeable cost 5 KB together.

Three different cost models hide behind "free repos": a runtime library costs **kilobytes**, an agent skill
costs **tokens**, and a generation service costs **money on every build**. Look at which one you are adding
before classifying it.

---

## Verify motion with a renderer, never with your eyes on a hidden pane

Automation browser panes that are hidden throttle animation frames to a couple per second, never load lazy
images, and do not fire observers. A `requestAnimationFrame` loop guarded by a "pending" flag stays dead
forever there, frozen at a plausible value, which looks like a broken mechanism instead of one that never ran.
Measure frame rate, layout shifts and posters with a real headless browser with a GPU; see
[12-qa.md](12-qa.md).
