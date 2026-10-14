// Island: a scroll-linked scene. The frame enters tilted back and slightly larger and straightens as you scroll;
// the title drifts up a little faster than the page. A port of a framer-motion "container scroll" component
// without framer-motion. The numbers live ONLY in the @keyframes of scroll-frame/frame.css:
//  - where the browser has scroll-driven animations (Chrome 115+, Edge, Safari 26), CSS runs them on the
//    compositor and this island does nothing;
//  - elsewhere (Firefox, iOS 18 and older) it pauses those same animations and sets currentTime = progress once
//    per scroll frame. Progress 0 = the frame peeks in at the bottom, 1 = its top edge is a quarter of the way
//    down the screen (the height of the sentinel, --frame-span), the same range as the CSS `entry`;
//  - if the scene is already on screen when the island arrives (anchor link, restored scroll) it does not jump
//    from flat to tilted: it stays flat, like the poster, and only arms once it has left the screen.
// Testing: set window.__frameJs = true before load to force this path in a browser that has the CSS one.
export default el => {
  const span = el.querySelector('.scene-span');
  const sentinel = el.querySelector('.scene-sentinel');
  if (!span || !sentinel || !el.getAnimations) return;
  if (!window.__frameJs && CSS.supports('animation-timeline: view()') && CSS.supports('timeline-scope: --a')) return;
  el.classList.add('frame-js');
  let anims = [];
  let length = 0;
  let armed = false;
  let last = -1;
  let pending = false;
  const progress = () => {
    const p = (innerHeight - span.getBoundingClientRect().top) / length;
    return p < 0 ? 0 : p > 1 ? 1 : p;
  };
  const apply = p => {
    for (const a of anims) a.currentTime = p * 1000; // the animations are 1 s long and paused (frame.css)
  };
  const measure = () => {
    pending = false;
    const p = progress();
    if (!armed) {
      if (p > 0 && p < 1) return;
      armed = true;
    }
    if (p === last) return;
    last = p;
    apply(p);
  };
  const request = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(measure);
  };
  const prepare = () => {
    length = sentinel.offsetHeight || innerHeight * 0.75;
    // the paused 1 s animations the CSS creates under .frame-js; their names change per breakpoint
    anims = [...el.querySelectorAll('.scene-frame, .scene-title')]
      .flatMap(n => n.getAnimations())
      .filter(a => /^scene-/.test(a.animationName || ''));
    last = -1;
    const p = progress();
    if (!armed && p > 0 && p < 1) apply(1);
    else measure();
  };
  prepare();
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', prepare);
};
