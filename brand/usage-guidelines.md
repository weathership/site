# Usage guidelines

These rules apply to every public surface — the site, social profiles,
slide decks, documentation, third-party press, conference materials.
When in doubt, choose the more conservative option.

## Logo

### Variants

| Variant | When to use |
|---------|-------------|
| Full-color mark | Primary; light backgrounds where contrast meets WCAG AA. |
| Mono-black mark | Print, embossing, single-color contexts on light surfaces. |
| Mono-white mark | Dark or photographic backgrounds. |
| Wordmark | When the mark would be redundant alongside running text. |
| Horizontal lockup | Headers, business cards, footer rows. |
| Stacked lockup | Square placements (avatar, app tile, sticker). |

### Clear space

The minimum clear space around any mark or lockup is **one cap-height of
the wordmark** on every side. For the mark alone, use the height of the
horizontal stroke at the waterline as the clear-space unit.

No type, no UI element, no image edge intrudes into the clear-space box.

### Minimum sizes

| Asset | Print | Screen |
|-------|-------|--------|
| Mark only | 6 mm | 16 px |
| Wordmark | 18 mm | 80 px |
| Horizontal lockup | 24 mm | 120 px |
| Stacked lockup | 18 mm | 96 px |

Below these sizes, swap to the mark or skip the logo entirely.

### What not to do

- Don't recolor outside the documented palette.
- Don't apply drop shadow, glow, bevel, gradient, stroke, or any other
  effect.
- Don't rotate.
- Don't skew, stretch, or otherwise change the aspect ratio.
- Don't crop the mark.
- Don't place on a background with insufficient contrast (target WCAG AA
  for the mark vs. its background).
- Don't combine with another logo such that the marks touch or appear
  composed.
- Don't reproduce from a screenshot. Always start from the SVG master in
  `brand/logo/`.

## Color

The full palette and tokens are in [`colors/palette.md`](./colors/palette.md)
and [`colors/tokens.css`](./colors/tokens.css). Two rules:

1. The accent (`--ws-sea`) is for one purpose at a time on any given
   surface. If everything is highlighted, nothing is.
2. Body text on light surfaces is `--ws-ink`, not pure black. Pure black
   reads as harsher than the rest of the system.

## Typography

See [`typography/system.md`](./typography/system.md). Inter for everything
that isn't code; JetBrains Mono for code. No display faces, no script
faces, no novelty.

## Photography & imagery

We don't use stock photography of people. When imagery is required, we
prefer:

- Architectural diagrams (rendered via Mermaid, D2, or hand-authored SVG).
- Code excerpts as syntax-highlighted screenshots.
- Data visualizations from real outputs (with axes labeled and units on
  every number).

If we publish a photograph, it depicts the actual subject (a real
machine, a real screen, a real workspace) and is credited.

## Voice

See [`voice-tone.md`](./voice-tone.md). Hyped marketing copy on a brand
asset undoes whatever the asset was trying to communicate.
