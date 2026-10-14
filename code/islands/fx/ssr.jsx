// Runs in Node during the build: renders each piece to HTML with the same props it later receives in the
// browser. That HTML is the poster, and hydrating it redraws nothing.
// Input: a JSON file [{id, piece, props}]; output: a JSON file {id: html}.
//   node .cache/ssr.mjs spec.json html.json
import fs from 'node:fs';
import { render } from 'preact-render-to-string';
import Shiny from './pieces/Shiny.jsx';
import Counter from './pieces/Counter.jsx';

// register every piece a page may render as a poster
const PIECES = { Shiny, Counter };

const [input, output] = process.argv.slice(2);
const out = {};
for (const { id, piece, props } of JSON.parse(fs.readFileSync(input, 'utf8'))) {
  const C = PIECES[piece];
  if (!C) throw new Error(`unknown piece: ${piece}`);
  out[id] = render(<C {...props} />);
}
fs.writeFileSync(output, JSON.stringify(out));
