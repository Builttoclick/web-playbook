# rb/ · React Bits sources, untouched

Put the React Bits components you use here, one folder per component (`rb/ShinyText/ShinyText.jsx` +
`ShinyText.css`), **copied untouched** from the upstream repository at one pinned commit:
https://github.com/DavidHDev/react-bits

We take the plain JavaScript + CSS variant of each component from the repository's registry files
(`public/r/<Name>-JS-CSS.json` at the pinned commit), and write a `VERSION.txt` here with the commit hash, the
date, a short hash of every file, and each component's npm dependencies (CountUp needs `motion`, Masonry
needs `gsap`, several backgrounds need `ogl`).

Rules:
- Never edit these files. Every adaptation lives in `fx/pieces/`, `fx/islands/` and your stylesheet.
- To update: download again at a new commit, rebuild, and compare the posters and the live render against the
  old build before deploying.
- React Bits is MIT + Commons Clause: use the components in your sites; do not sell the components themselves.
  It is not redistributed in this repository.
