#!/usr/bin/env bash
# Regenerate every PNG render from its SVG master.
#
# Reads SVGs under brand/{logo,favicon,social,typography}/ and writes
# PNGs at the documented sizes alongside them. Optimizes with optipng.
#
# Run from the repo root via `just brand-render`, or directly:
#   bash brand/render-pngs.sh

set -euo pipefail

cd "$(dirname "$0")"

have() { command -v "$1" >/dev/null 2>&1; }

if ! have rsvg-convert; then
  echo "rsvg-convert not found — enter the devenv shell (direnv allow .) and retry." >&2
  exit 1
fi
if ! have optipng; then
  echo "optipng not found — enter the devenv shell (direnv allow .) and retry." >&2
  exit 1
fi

# render <svg> <size> <out>
render() {
  local svg="$1" size="$2" out="$3"
  echo "  → $out (${size}px)"
  rsvg-convert -w "$size" -h "$size" -o "$out" "$svg"
  optipng -strip all -quiet "$out" || true
}

# render_wh <svg> <w> <h> <out>
render_wh() {
  local svg="$1" w="$2" h="$3" out="$4"
  echo "  → $out (${w}×${h})"
  rsvg-convert -w "$w" -h "$h" -o "$out" "$svg"
  optipng -strip all -quiet "$out" || true
}

echo "Rendering mark PNGs from logo/mark/mark.svg"
for size in 16 32 48 192 512; do
  render logo/mark/mark.svg "$size" "logo/mark/mark-${size}.png"
done

echo "Rendering favicon PNGs from favicon/favicon.svg"
render favicon/favicon.svg 16 favicon/favicon-16.png
render favicon/favicon.svg 32 favicon/favicon-32.png
render favicon/favicon.svg 180 favicon/apple-touch-icon-180.png

echo "Rendering social PNGs"
render_wh social/og.svg 1200 630 social/og.png
render_wh social/og.svg 1200 1200 social/og-square.png
render_wh social/twitter-banner.svg 1500 500 social/twitter-banner.png
render_wh social/avatar.svg 400 400 social/avatar-400.png

echo "Done."
