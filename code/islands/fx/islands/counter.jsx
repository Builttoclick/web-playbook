// Island: a counting number (React Bits CountUp). It decides BEFORE downloading the component (CountUp brings
// motion, tens of KB):
//  - in the hero: it only counts if it arrives early (under 1.3 s since navigation start). If the JavaScript is
//    late (slow phone), the final number has already appeared through CSS and it stays still, never back to 0.
//    All the hero figures decide together.
//  - in a section: if the number is already visible when the island arrives, it does not go back to 0.
// The CSS that goes with it is in css/counters.css.
import { h, hydrate } from 'preact';
import { frames, onScreen, wait, lockWidth, props } from './_common.js';

const component = () => import('../pieces/Counter.jsx').then(m => m.default);

export default async el => {
  const hero = el.closest('.hero__figures');
  if (!hero) {
    if (onScreen(el)) return;
    lockWidth(el);
    hydrate(h(await component(), props(el)), el);
    return;
  }
  lockWidth(el);
  if (!hero.dataset.decided) {
    if (performance.now() > 1300) {
      hero.dataset.decided = 'still';
      hero.classList.add('still');
      return;
    }
    hero.dataset.decided = 'count';
    hero.classList.add('waiting'); // holds back the CSS reveal while the component downloads
    hero.loading = Promise.race([component(), wait(1200).then(() => null)]);
  }
  if (hero.dataset.decided === 'still') return;
  const C = await hero.loading;
  if (!C) {
    // too late: show the final number, still
    hero.dataset.decided = 'still';
    hero.classList.replace('waiting', 'still');
    return;
  }
  hydrate(h(C, props(el)), el);
  await frames(2); // CountUp has written its 0 by now
  hero.classList.replace('waiting', 'counting');
};
