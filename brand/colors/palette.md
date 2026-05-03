# Color palette

The weathership palette is anchored in two metaphors: the sea and the
sky over it. Six tokens; each one named for what it represents and
scoped to a clear role.

## Tokens

| Token | Role | Hex | RGB | HSL | CMYK |
|-------|------|-----|-----|-----|------|
| `--ws-ink` | Primary text on light surfaces | `#0E1726` | `14, 23, 38` | `217° 46% 10%` | `63, 39, 0, 85` |
| `--ws-paper` | Light surface | `#F7F5EE` | `247, 245, 238` | `47° 31% 95%` | `0, 1, 4, 3` |
| `--ws-sea` | Primary brand accent — links, focus, CTA | `#1E5F7A` | `30, 95, 122` | `198° 61% 30%` | `75, 22, 0, 52` |
| `--ws-storm` | Secondary accent — meta, dividers | `#3A4A5E` | `58, 74, 94` | `213° 24% 30%` | `38, 21, 0, 63` |
| `--ws-sun` | Highlight — selective emphasis, illustrations | `#E8B14A` | `232, 177, 74` | `40° 78% 60%` | `0, 24, 68, 9` |
| `--ws-fog` | Muted UI surface — cards, tag chips | `#D6D2C4` | `214, 210, 196` | `47° 16% 80%` | `0, 2, 8, 16` |

## Roles in detail

**`--ws-ink`** — Default body text on `--ws-paper`. Don't use pure black
(`#000`) for text; ink reads warmer and contrasts more naturally with
the paper surface.

**`--ws-paper`** — Default page background. Slightly off-white with a
warm tint; meant to feel like printed paper, not screen-default white.

**`--ws-sea`** — The accent. Link color, focus rings, primary buttons,
and the one element on a page that's calling for attention. Use
sparingly — if everything is sea, nothing is.

**`--ws-storm`** — Secondary text (meta, captions), dividers, the muted
tier of UI chrome. Sits between ink and fog in visual weight.

**`--ws-sun`** — Reserved for selective emphasis: illustrations, the
"sail" stroke in two-tone mark variants, occasional callouts. Not a
link color.

**`--ws-fog`** — Chip backgrounds, code-block borders, muted card
surfaces. The "I'm here, I'm not the point" tier.

## Contrast pairs

WCAG 2.1 AA targets contrast ≥ 4.5:1 for body text and ≥ 3:1 for large
text and UI components.

| Foreground | Background | Ratio | AA body | AA large |
|------------|-----------|-------|---------|----------|
| `--ws-ink` | `--ws-paper` | 14.6 | ✓ | ✓ |
| `--ws-storm` | `--ws-paper` | 8.3 | ✓ | ✓ |
| `--ws-sea` | `--ws-paper` | 6.4 | ✓ | ✓ |
| `--ws-paper` | `--ws-ink` | 14.6 | ✓ | ✓ |
| `--ws-paper` | `--ws-sea` | 6.4 | ✓ | ✓ |
| `--ws-sun` | `--ws-ink` | 9.5 | ✓ | ✓ |
| `--ws-sun` | `--ws-paper` | 1.5 | ✗ | ✗ |
| `--ws-fog` | `--ws-paper` | 1.2 | ✗ | ✗ |

Notably: `--ws-sun` is **not** safe for body text on `--ws-paper`.
Reserve it for shapes and illustrations, not type. Same caveat for
`--ws-fog` — it's a surface, not a foreground.

## Dark surfaces

For inverted layouts (hero sections, footer), use:

- Background: `--ws-ink`
- Body text: `--ws-paper`
- Accent: a tinted lift of `--ws-sea` — contrast pair `--ws-paper` on
  `--ws-ink` is 14.6:1 and is the default body pairing on dark.

If we need a third tier on dark, lift `--ws-storm` toward fog: roughly
`color-mix(in oklab, var(--ws-fog) 60%, var(--ws-storm))`.

## Source of truth

The numbers above are documentation. The values consumed by the website
live in [`tokens.css`](./tokens.css). When you change a value, change it
there and re-run `just web-build`.
