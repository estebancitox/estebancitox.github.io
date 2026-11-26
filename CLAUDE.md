# estebancitox.github.io

Static site on GitHub Pages, served as authored. Five pages: `index.html` (the home),
`lab/index.html`, two notes in `notes/`, and `404.html`.

Every value below is copied from the stylesheets. The code span just before each
file:line cite is text from that line. Re-read the line before changing a value, and
move the cite when lines shift.

## Files

- `css/site.css` and `js/site.js` load on all five pages and count toward the home
  page's stated weight (Rules, 1).
- `css/inner.css` loads after `css/site.css` on the lab, the notes and the 404. Rules for
  those pages go there, in the layers the first file declares:
  `@layer reset, base, layout, components, motion, print;` (`css/site.css:66`).
- `js/visit.js` paints the visit line on the lab and the two notes.
- Each page starts with `<script>document.documentElement.className="js"</script>`
  (`index.html:11`). Without that class, what needs scripts stays hidden:
  `html:not(.js) .live {` (`css/site.css:665`), `html:not(.js) .marks li {` (`css/inner.css:184`).

## Colour

One theme: `color-scheme: light;` (`css/site.css:90`). There are no dark values and no
theme switch.

| Token | Value | Source | Role |
| --- | --- | --- | --- |
| `--ground` | `#e9edee` | `css/site.css:91` | Page background, and text on ink fills |
| `--ink` | `#0e1920` | `css/site.css:92` | Text, buttons, focus ring, selection |
| `--muted` | `#47555e` | `css/site.css:93` | Secondary text, link hover, ruler ticks |
| `--line` | `#c3cdd2` | `css/site.css:94` | 1px rules and borders |
| `--signal` | `#17a65b` | `css/site.css:95` | The availability lamp only, never text |
| `--say-from` | `#76838a` | `css/site.css:96` | The statement's words before the scroll reaches them |
| `--say-wave` | `#0f8a4a` | `css/site.css:97` | The colour that passes through each word |

The gauge's colours are attributes inside its SVG, not tokens: `stroke="#2DBE78"`
(`index.html:103`), repeated in the icon (`assets/favicon.svg:4`).

## Type

| Token | Value | Source | Face and use |
| --- | --- | --- | --- |
| `--serif` | `"Newsreader", "Newsreader-fb", Georgia, serif` | `css/site.css:99` | Newsreader 400: statements, page titles, figures |
| `--sans` | `"Archivo", "Archivo-fb", Arial, sans-serif` | `css/site.css:100` | Archivo, variable 400 to 650: everything else |
| `--wide` | `"Archivo Name", "ArchivoName-fb", Arial, sans-serif` | `css/site.css:101` | Archivo Name 650: the name in the header |
| `--dial` | `"B612", Arial, sans-serif` | `css/site.css:102` | B612 700: text inside the gauge |
| `--mono` | `"IBM Plex Mono", "PlexMono-fb", ui-monospace, "SF Mono", Consolas, monospace` | `css/inner.css:40` | IBM Plex Mono 400: code in the two notes |

- Body: `font: 400 1rem/1.5 var(--sans);` (`css/site.css:129`).
- `font-synthesis: none;` (`css/site.css:130`): a weight or style without a loaded face is
  not faked. No face is italic, and text weights stop at 650.
- Every face is a self-hosted woff2 in `fonts/` with `font-display: swap;`
  (`css/site.css:6`), over a local fallback (Rules, 2):

| Fallback | Local face | Value | Source |
| --- | --- | --- | --- |
| `Newsreader-fb` | Georgia | `size-adjust: 94.6%;` | `css/site.css:34` |
| `Archivo-fb`, 400 to 500 | Arial | `size-adjust: 99.3%;` | `css/site.css:43` |
| The same, replaced on the lab, the notes and the 404 | Arial | `size-adjust: 98.65%;` | `css/inner.css:33` |
| `Archivo-fb`, 550 to 650 | Arial Bold | `size-adjust: 95.25%;` | `css/site.css:52` |
| `ArchivoName-fb` | Arial Bold | `size-adjust: 110.86%;` | `css/site.css:60` |
| `PlexMono-fb` | Courier New | `size-adjust: 99.98%;` | `css/inner.css:18` |

## Layout

- Side padding: `--pad: max(clamp(1.25rem, 5.6vw, 4.5rem), calc((100% - 71rem) / 2));`
  (`css/site.css:104`). Its `71rem` is the content measure and appears once in the
  stylesheets. Pages take the measure by using `--pad`: do not restate it in a
  `max-width` or a new token.
- The header is sticky, and compact and static under `@media (max-width: 68.74em) {`
  (`css/site.css:407`). `css/inner.css` follows the same line: `@media (min-width: 68.75em) {`
  (`css/inner.css:121`).

## Philosophy

**Restraint executed with precision.** The vocabulary is small so that correctness is
visible. Reach for an existing token before adding one; if an effect needs a library to
work, it does not belong here.

## Forbidden

- Particles
- Scroll-jacking
- 3D scenes
- Animation libraries
- New dependencies
- Build steps

The repository has no `package.json`, no `node_modules` and no bundler config. Files ship
as authored. Tools that measure or render stay outside it, in
`~/personal/notes/portfolio-redesign-n1/`.

## Rules this redesign taught

1. **The home page states its own figures, and the CV repeats the weight.** They are typed
   at `this page weighs` (`index.html:92`), `class="digit"` (`index.html:121`, and the two
   lines after it), `class="needle"` (`index.html:130`, `index.html:133`), `id="visit-n"`
   and `id="visit-kb"` (`index.html:138`), `KB of JavaScript` (`index.html:271`), and in
   `assets/Sergio_Esteban_Torres_CV.pdf`. The weight is `gzip -9` of `index.html`,
   `css/site.css`, `js/site.js` and `assets/favicon.svg`, plus the four fonts the home
   loads. After a byte change to any of them, run
   `python3 -I ~/personal/notes/portfolio-redesign-n1/build/budget.py .` from the
   repository root. If it reports another figure, the page and the CV change with it
   (`cv/` in the tools folder).
2. **Fallback `size-adjust` values were tuned by sweeping widths in Chrome, not computed
   from font metrics.** A value is right when the first screen breaks into the same lines
   with either face. With the home's 99.3% the ledes of the other pages ran one line
   longer until the swap, and only 98.6% to 98.7% held there. After changing a face, its
   subset or the text of a first screen, sweep again with `tune.mjs` and confirm with
   `fontswap.mjs` (`build/` for the home, `pages/tools/` for the rest): no box in a first
   screen may change top or height.
3. **Motion is checked from pixels.** Chrome 158 draws a `cqi` length inside the
   `@keyframes` of a scroll-driven animation on a pseudo-element against the viewport,
   while `getComputedStyle` reports the container's value (`build/cqi-repro/` in the tools
   folder). Judge an animation from screenshots, not from computed style.
4. **A scroll-driven animation is allowed when it never moves or slows the scroll.**
   Scroll-jacking stays forbidden. The ruler's marker and the statement's ink only read
   the position: `animation-timeline: scroll(root);` (`css/site.css:787`) and
   `animation-timeline: --say;` (`css/site.css:794`), both under
   `@media (prefers-reduced-motion: no-preference) {` (`css/site.css:774`).
