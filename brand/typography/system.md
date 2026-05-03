# Typography system

Two faces, both variable, both self-hosted. Inter for everything that
isn't code; JetBrains Mono for code.

## Faces

### Inter

- **Use:** display, body, UI.
- **Source:** [rsms.me/inter](https://rsms.me/inter/) — variable woff2.
- **Weights in active use:** 400 (body), 500 (small caps / labels), 600
  (headings, wordmark), 700 (rare emphasis).
- **License:** SIL Open Font License 1.1.

Why Inter: it's a humanist sans designed for screen reading at small
sizes, with a variable axis that gives us a precise weight ramp without
shipping multiple files. The wordmark uses Inter at 600 with a custom
kerning pass on `t-h` and `s-h-i` so the wordmark feels intentional
rather than auto-rendered.

### JetBrains Mono

- **Use:** code blocks, terminal output, file paths, identifiers in
  running prose.
- **Source:** [jetbrains.com/lp/mono](https://www.jetbrains.com/lp/mono/)
  — variable woff2.
- **Weights:** 400, 500.
- **License:** SIL Open Font License 1.1.

Why JetBrains Mono: clear distinction between similar glyphs (`0/O`,
`1/l/I`), variable axis, and a height/cap-height that pairs with Inter
without obvious mismatch.

## Stacks

The CSS stacks declared in `web/src/styles/global.css`:

```css
--ws-font-sans: "Inter", "Inter Fallback", ui-sans-serif, system-ui,
                -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
                Arial, sans-serif;
--ws-font-mono: "JetBrains Mono", "JetBrains Mono Fallback",
                ui-monospace, SFMono-Regular, Menlo, Consolas,
                "Liberation Mono", monospace;
```

The `... Fallback` entries are local-system fallback faces metric-matched
to the variable web font, used during font load to prevent layout shift.

## Type ramp

| Role | Size | Weight | Line height | Letter spacing |
|------|------|--------|-------------|----------------|
| Display (hero) | 56 px | 600 | 1.05 | -0.02em |
| H1 | 40 px | 600 | 1.15 | -0.015em |
| H2 | 28 px | 600 | 1.2 | -0.01em |
| H3 | 20 px | 600 | 1.3 | -0.005em |
| Body | 17 px | 400 | 1.6 | 0 |
| Body small | 14 px | 400 | 1.55 | 0 |
| Caption | 13 px | 500 | 1.4 | 0.01em |
| Code (block) | 14 px | 400 | 1.6 | 0 |
| Code (inline) | 0.92em | 500 | inherit | 0 |

Sizes are anchors, not contracts. Adjust within ±2 px when the
surrounding density requires.

## Specimens

A rendered type ramp lives in [`specimens.svg`](./specimens.svg) — used
inline on `/media-kit/typography` and downloadable from there.

## Font loading

Variable woff2 files are served from `web/public/fonts/`. The Astro
`<Base>` layout preloads the two primary axes (sans 400/600, mono 400)
with `<link rel="preload" as="font" type="font/woff2" crossorigin>` so
the first paint isn't styled in fallback.

Fallback faces (declared via `@font-face` with metric overrides) cover
the load gap so there's no layout shift when the web font arrives.
