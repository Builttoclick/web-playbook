// Effects loader. Goes INLINE in the HTML (about 1 KB minified); the generator replaces __ISLANDS__ with the
// {island: url} map that fx/build.mjs wrote to .cache/islands.json, and strips these comments.
// Mounts every [data-fx] island after first paint:
//   data-fx-when="now"  -> right away (hero islands)
//   otherwise           -> when it comes within 700 px of the screen
// With prefers-reduced-motion only islands marked data-fx-quiet mount (things that must stay clickable);
// every other island keeps its poster, which is already the finished first frame.
(() => {
  const MAP = __ISLANDS__;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loading = {};
  const mount = el => {
    const name = el.dataset.fx;
    (loading[name] = loading[name] || import(MAP[name]))
      .then(m => m.default(el))
      .catch(err => console.error('fx', name, err));
  };
  const near = new IntersectionObserver(
    entries =>
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        near.unobserve(e.target);
        mount(e.target.fxIsland || e.target);
      }),
    { rootMargin: '700px 0px' }
  );
  const start = () => {
    for (const el of document.querySelectorAll('[data-fx]')) {
      if (reduced && !('fxQuiet' in el.dataset)) continue;
      if (el.dataset.fxWhen === 'now') {
        mount(el);
        continue;
      }
      // a display:contents wrapper (class "fx") has no box: observe its first child instead
      const target = el.classList.contains('fx') ? el.firstElementChild || el : el;
      target.fxIsland = el;
      near.observe(target);
    }
  };
  // after the first frame is on screen, never before
  requestAnimationFrame(() => setTimeout(start, 0));
})();
