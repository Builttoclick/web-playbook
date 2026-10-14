// A piece = our markup around a React Bits component. Both the poster (Node, at build time) and the island
// (browser) render THIS, with the same props, so hydration redraws nothing. Here: ShinyText as it is.
import ShinyText from '../../rb/ShinyText/ShinyText.jsx';

export default function Shiny(p) {
  return <ShinyText {...p} />;
}
