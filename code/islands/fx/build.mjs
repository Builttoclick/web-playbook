// Compiles the effects with esbuild, React -> Preact:
//  - for the browser: one island per file in fx/islands (ESM, minified, hashed names, shared code split into
//    common chunks) into dist/fx/, plus .cache/islands.json with {island: url} for the loader;
//  - for the build: .cache/ssr.mjs, which renders the pieces to HTML in Node (the posters).
// React Bits .css files do not go through here: copy them once into your stylesheet.
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FX = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(FX, '..');
const OUT = path.join(ROOT, 'dist', 'fx');

const PREACT = {
  react: 'preact/compat',
  'react-dom': 'preact/compat',
  'react-dom/client': 'preact/compat/client',
  'react/jsx-runtime': 'preact/jsx-runtime',
  'react/jsx-dev-runtime': 'preact/jsx-runtime'
};

// component CSS imports resolve to nothing: the styles live in the site's one stylesheet
const noCss = {
  name: 'no-css',
  setup(b) {
    b.onResolve({ filter: /\.css$/ }, a => ({ path: a.path, namespace: 'no-css' }));
    b.onLoad({ filter: /.*/, namespace: 'no-css' }, () => ({ contents: '', loader: 'js' }));
  }
};

const shared = {
  bundle: true,
  jsx: 'automatic',
  alias: PREACT,
  plugins: [noCss],
  nodePaths: [path.join(ROOT, 'node_modules')],
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'none',
  logLevel: 'warning',
  logOverride: { 'unsupported-jsx-comment': 'silent' }
};

fs.rmSync(OUT, { recursive: true, force: true });
const islands = fs
  .readdirSync(path.join(FX, 'islands'))
  .filter(f => f.endsWith('.jsx') && !f.startsWith('_'))
  .map(f => path.join(FX, 'islands', f));

const result = await esbuild.build({
  ...shared,
  entryPoints: islands,
  outdir: OUT,
  format: 'esm',
  splitting: true,
  minify: true,
  target: ['es2020', 'safari15'],
  entryNames: '[name].[hash]',
  chunkNames: 'c.[hash]',
  metafile: true
});

const map = {};
for (const [output, info] of Object.entries(result.metafile.outputs)) {
  // only the islands (a dynamic import() also shows up as an entryPoint in the metafile)
  if (info.entryPoint && /(^|\/)islands\//.test(info.entryPoint)) {
    map[path.basename(info.entryPoint, '.jsx')] = '/fx/' + path.basename(output);
  }
}
fs.mkdirSync(path.join(ROOT, '.cache'), { recursive: true });
fs.writeFileSync(path.join(ROOT, '.cache', 'islands.json'), JSON.stringify(map, null, 1));

await esbuild.build({
  ...shared,
  entryPoints: [path.join(FX, 'ssr.jsx')],
  outfile: path.join(ROOT, '.cache', 'ssr.mjs'),
  platform: 'node',
  format: 'esm',
  // like the browser: always the ESM build of every package. With the CommonJS one, @gsap/react loaded a
  // second copy of Preact and its hooks ran without a component ("reading '__H'").
  mainFields: ['module', 'main'],
  // gsap and motion carry require() inside: give the Node ESM bundle a real require
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" }
});

const kb = f => (fs.statSync(f).size / 1024).toFixed(1);
for (const [name, url] of Object.entries(map)) console.log(`island ${name.padEnd(10)} ${url}  ${kb(path.join(ROOT, 'dist', url))} KB`);
for (const f of fs.readdirSync(OUT).filter(f => f.startsWith('c.'))) console.log(`chunk ${f}  ${kb(path.join(OUT, f))} KB`);
