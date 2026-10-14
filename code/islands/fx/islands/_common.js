// Helpers shared by the islands. Not an island itself: the build only compiles files that do not start with "_".
import { h, hydrate } from 'preact';

export const props = el => JSON.parse(el.dataset.props || '{}');

// hydrate the HTML the build already painted, with the same component and the same props: nothing is redrawn
export const hydrateWith = (el, C) => hydrate(h(C, props(el)), el);

// resolve after n animation frames
export const frames = (n = 2) =>
  new Promise(resolve => {
    const step = k => (k ? requestAnimationFrame(() => step(k - 1)) : resolve());
    step(n);
  });

export const wait = ms => new Promise(r => setTimeout(r, ms));

// images inside a container that fall within a rectangle (the visible part of a section)
export const visibleImages = (root, rect) =>
  [...root.querySelectorAll('img')].filter(img => {
    const b = img.getBoundingClientRect();
    return b.width > 0 && b.bottom > rect.top && b.top < rect.bottom && b.right > rect.left && b.left < rect.right;
  });

// Is it already on screen? (a display:contents wrapper is measured through its first child.)
// An entrance (a title that rises, a card that appears, a number that counts) that arrives while its element is
// already visible must NOT play: hiding it to show it again is exactly the jump we never want.
export const onScreen = el => {
  const r = (el.firstElementChild || el).getBoundingClientRect();
  return r.bottom > 0 && r.top < innerHeight;
};

// Staggered entrance of a block (bars, a heat map). If it is not visible yet it crouches (.enter) and appears
// (.live) when it comes on screen. If the visitor jumped past it without it ever being seen (an anchor link, a
// fast scroll), the observer never sees it cross, so it appears without animation (.no-anim). Never stays hidden.
export const entrance = (el, threshold = 0.3) => {
  if (onScreen(el)) return;
  el.classList.add('enter');
  let io;
  let pending = false;
  const check = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      if (el.getBoundingClientRect().bottom < 0) done(false);
    });
  };
  const done = animate => {
    if (!animate) el.classList.add('no-anim');
    el.classList.add('live');
    io.disconnect();
    removeEventListener('scroll', check);
  };
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) requestAnimationFrame(() => done(true));
      else if (e.boundingClientRect.bottom < 0) done(false);
    },
    { threshold }
  );
  io.observe(el);
  addEventListener('scroll', check, { passive: true });
};

// A number about to count: lock its box to the width of the final number already in the poster, so the text
// next to it never moves while it counts (css/counters.css has the no-JS fallback in ch).
export const lockWidth = root => {
  for (const s of root.querySelectorAll('.figure')) {
    if (!s.textContent) continue;
    // layout width (getComputedStyle), not the bounding rectangle: inside a transformed parent (a tilted,
    // scaled frame) the rectangle is projected and the box would get the wrong width
    const w = parseFloat(getComputedStyle(s).width);
    s.style.minWidth = `${w > 0 ? w : s.getBoundingClientRect().width}px`;
  }
};
