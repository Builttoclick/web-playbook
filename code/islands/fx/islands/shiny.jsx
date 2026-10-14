// Island type 1, HYDRATE: the build already painted the piece with the same props, so hydration only attaches
// behaviour. Use it for text effects, cards, chips, buttons.
import Shiny from '../pieces/Shiny.jsx';
import { hydrateWith } from './_common.js';

export default el => hydrateWith(el, Shiny);
