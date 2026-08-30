# estebancitox.github.io

## Design system

Every value below is copied verbatim from the stylesheets. Do not restate a
number here from memory — re-read the file:line if you need to change one.

### Color tokens — light

Defined in `:root`, `css/main.css:87-100`.

| Token | Value | Source | Observed role |
| --- | --- | --- | --- |
| `--ground` | `#f3f5f6` | `css/main.css:89` | Page background (`body`), and the foreground on accent fills |
| `--ink` | `#171a1e` | `css/main.css:90` | Primary text |
| `--muted` | `#5a6470` | `css/main.css:91` | Secondary text, labels, list markers, underline color |
| `--line` | `#d9dee1` | `css/main.css:92` | 1px rules and borders |
| `--accent` | `#b03d00` | `css/main.css:93` | Links, `::selection`, `:focus-visible` outline, corner marks |

`color-scheme: light` is set alongside them (`css/main.css:88`).

### Color tokens — dark

The same five tokens are redefined with **identical values in two places**, so
any edit has to be made twice or the themes drift:

| Token | Value | `[data-theme="dark"]` | `@media (prefers-color-scheme: dark)` on `:root:not([data-theme="light"])` |
| --- | --- | --- | --- |
| `--ground` | `#14171b` | `css/main.css:104` | `css/main.css:114` |
| `--ink` | `#e6e9ea` | `css/main.css:105` | `css/main.css:115` |
| `--muted` | `#8b939c` | `css/main.css:106` | `css/main.css:116` |
| `--line` | `#2a2f35` | `css/main.css:107` | `css/main.css:117` |
| `--accent` | `#ff8a50` | `css/main.css:108` | `css/main.css:118` |

Blocks: `[data-theme="dark"]` at `css/main.css:102-109`, the media query at
`css/main.css:111-120`. Both also set `color-scheme: dark`
(`css/main.css:103`, `css/main.css:113`). The `data-theme` attribute is written
by the toggle in `js/main.js` and pre-applied by the inline script at
`index.html:11`.

### Non-color tokens

Declared once in `:root` only — no dark-theme variants exist for these.

| Token | Value | Source |
| --- | --- | --- |
| `--sans` | `"Archivo", "Archivo-fb", system-ui, Arial, sans-serif` | `css/main.css:95` |
| `--disp` | `"Archivo Expanded", "ArchivoExp-fb", Arial, sans-serif` | `css/main.css:96` |
| `--mono` | `"IBM Plex Mono", "PlexMono-fb", ui-monospace, "SF Mono", Consolas, monospace` | `css/main.css:97` |
| `--pad` | `max(clamp(1.25rem, 5vw, 3rem), calc((100% - 66rem) / 2))` | `css/main.css:99` |

### `notes/notes.css`

Defines **no** custom properties. It is a consumer-only prose layer
(`@layer prose`, `notes/notes.css:4`) that reads `--pad`
(`notes/notes.css:6`), `--disp` (`notes/notes.css:16`), `--mono`
(`notes/notes.css:36`, `:63`, `:86`), `--muted` (`notes/notes.css:28`, `:41`,
`:57`, `:98`) and `--line` (`notes/notes.css:42`, `:65`, `:70`, `:94`). New
tokens belong in `css/main.css:87-120`, not here.

## Typography

- **IBM Plex Mono (`--mono`) is the data face.** Site head, datalines, section
  labels, tables, and code. Face loaded at weight 400 only
  (`css/main.css:21-26`).
- **Archivo Expanded (`--disp`) is the display face.** Weight 700, uppercase,
  negative tracking, used for `.name` (`css/main.css:253-259`), `.lost-title`
  (`css/main.css:500-508`) and `.article h1` (`notes/notes.css:15-24`). Face
  loaded at weight 700 only (`css/main.css:15-20`).
- **Archivo (`--sans`) is body text**, set once as
  `font: 400 1.0625rem/1.65 var(--sans)` on `body` (`css/main.css:134`).
  Weights 400 and 500 are loaded (`css/main.css:3-14`); `font-synthesis: none`
  (`css/main.css:135`) means an unloaded weight will not be faked — do not use
  one.
- All four faces are self-hosted woff2 in `fonts/` with `font-display: swap`.
  Each has a metric-matched local fallback so pre-swap layout does not shift:
  `Archivo-fb` (`css/main.css:29-37`), `ArchivoExp-fb` (`css/main.css:38-46`),
  `PlexMono-fb` (`css/main.css:47-54`). Changing a webfont means recomputing
  its override percentages.

## Philosophy

**Restraint executed with precision.** The vocabulary is small — five colors,
three families, one spacing token — so correctness is visible. Reach for an
existing token before adding one; if an effect needs a library to work, it does
not belong here.

## Forbidden

- Particles
- Scroll-jacking
- 3D scenes
- Animation libraries
- New dependencies
- Build steps

The repo currently has no `package.json`, no `node_modules`, and no bundler
config; the only script is local `js/main.js` plus the inline theme script at
`index.html:11`. Files ship as authored. Keep it that way.

## Resolved

- **`--pad`'s `66rem` is the site's canonical content measure.** Intentional,
  not an incidental gutter constant. The string occurs exactly once in the
  codebase (`css/main.css:99`), inside the `--pad` formula's centering arm, and
  that is the only place it belongs. Content pages — including the upcoming
  `/lab` — inherit the measure by reusing `--pad`; never introduce a separate
  `max-width` rule or a content-width token to restate it. Changing the measure
  is a single edit at `css/main.css:99`.
