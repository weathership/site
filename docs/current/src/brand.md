# Brand

The brand package lives in [`brand/`](https://github.com/weathership/site/tree/main/brand)
in this repo. Everything below is a pointer; the canonical content is
in those files.

## Source-of-truth files

| File | Surface on the public site |
|------|----------------------------|
| `brand/identity.md` | `/about` |
| `brand/voice-tone.md` | (engineering only) |
| `brand/usage-guidelines.md` | (engineering only) |
| `brand/press-kit.md` | `/media-kit/press` |
| `brand/colors/palette.md`, `tokens.css` | `/media-kit/colors` |
| `brand/typography/system.md`, `specimens.svg` | `/media-kit/typography` |
| `brand/logo/**` | `/media-kit/logo` |
| `brand/favicon/**` | `/favicon.svg` and friends |
| `brand/social/**` | `/og.png` and `/media-kit/press` |

## How the site reads from `brand/`

`web/scripts/sync-brand.mjs` runs as a `prebuild` step (and `predev`).
It mirrors the entire `brand/` tree to `web/public/brand/`, plus a few
conventional copies:

- `brand/favicon/favicon.svg` → `web/public/favicon.svg`
- `brand/favicon/favicon-{16,32}.png` → `web/public/favicon-{16,32}.png`
- `brand/favicon/apple-touch-icon-180.png` → `web/public/apple-touch-icon.png`
- `brand/social/og.png` → `web/public/og.png`

`web/src/styles/global.css` imports `../../../brand/colors/tokens.css`
directly so the page CSS uses the exact same custom-property values as
the documented palette.

`web/src/lib/brand-assets.ts` enumerates the asset variants that the
`/media-kit/` pages render (logo variants, social cards, color tokens,
type ramp). The enumeration is maintained by hand — keeping it explicit
means the build stays static and the media-kit pages render at compile
time without runtime filesystem reads.

## Regenerating renders

PNGs are generated from SVG masters via `librsvg`'s `rsvg-convert`,
then optimized with `optipng`. To regenerate:

```sh
just brand-render
```

The shell script is `brand/render-pngs.sh`. Re-run whenever a master
SVG changes.

## Editing rules (recap)

1. Edit the SVG master, not the PNG. PNGs are regenerated.
2. Color values live in `brand/colors/tokens.css`. Don't hard-code hex
   in SVGs unless the variant is explicitly mono-black or mono-white.
3. Keep paths integer-aligned to the 24×24 mark grid for the mark; for
   the wordmark, keep x-positions on whole pixels at 64px cap height.
4. No raster placeholders. Every published asset is finished.
