# Safe area & minimum sizes

## Clear space

The minimum clear space around any logo is **one cap-height of the
wordmark** on every side. For the mark alone, use the height of the
horizontal stroke at the waterline as the unit.

```
        ┌──────────────────────────┐
        │      [ clear space ]     │
        │  ┌────────────────────┐  │
        │  │                    │  │
        │  │      [ MARK ]      │  │
        │  │                    │  │
        │  └────────────────────┘  │
        │      [ clear space ]     │
        └──────────────────────────┘
```

No type, UI element, image edge, or other logo intrudes into the
clear-space box. When the surrounding layout can't accommodate the full
clear space, scale the logo down rather than crop the clearance.

## Minimum sizes

Below these sizes, switch to a smaller variant or omit the logo.

| Asset | Print | Screen |
|-------|-------|--------|
| Mark only | 6 mm | 16 px |
| Wordmark | 18 mm | 80 px |
| Horizontal lockup | 24 mm | 120 px |
| Stacked lockup | 18 mm | 96 px |

## Background contrast

Every logo placement has to clear WCAG AA contrast against its
background:

- The full-color mark reads against `--ws-paper` and any background
  with WCAG ≥ 3:1 against the mark's `--ws-sea` strokes.
- The mono-white variant requires a background of WCAG ≥ 3:1 against
  `--ws-paper`.
- On photographic backgrounds, use mono-white over a tinted scrim
  (e.g., `--ws-ink` at 60% opacity over the photo) to guarantee
  contrast.

When in doubt, place the lockup on a solid `--ws-paper` or `--ws-ink`
panel rather than directly on imagery.
