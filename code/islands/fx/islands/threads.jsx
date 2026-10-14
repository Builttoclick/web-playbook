// Island type 2, RENDER OVER THE POSTER, THEN FADE: for WebGL backgrounds. The poster is static markup (here an
// SVG of still lines painted by the generator). The live component renders into a layer on top and fades in
// once it has drawn a few frames; the poster fades out underneath. Without WebGL2 nothing mounts and the poster
// stays. The component pauses itself off-screen and on a hidden tab.
//
// Markup the generator writes:
//   <div class="close__bg" aria-hidden="true" data-fx="threads" data-props='{"amplitude":1,"distance":0}'>
//     <svg class="threads-poster" ...>...still lines...</svg>
//   </div>
// CSS: .threads-live { position:absolute; inset:0; opacity:0; transition:opacity 1.2s var(--ease) }
//      .close__bg.live .threads-live { opacity:1 }   .close__bg.live .threads-poster { opacity:0 }
import { h, render } from 'preact';
import Threads from '../../rb/Threads/Threads.jsx';
import { frames, props } from './_common.js';

const hasWebGL2 = () => {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
};

export default el => {
  if (!hasWebGL2()) return;
  const layer = document.createElement('div');
  layer.className = 'threads-live';
  el.appendChild(layer);
  render(h(Threads, props(el)), layer);
  frames(4).then(() => el.classList.add('live'));
};
