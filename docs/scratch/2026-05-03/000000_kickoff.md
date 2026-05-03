# 2026-05-03 — kickoff

## Session goal

Bootstrap `~/local/src/wxs/site` from initial-commit scaffold (devenv
shell, Python-flavored .gitignore, one-line README) into the public
web presence and brand package for **weathership.org**, an
open-source AI entity.

Modeled after `~/local/src/zndx/gaius` (which is "working very well"),
borrowing devenv patterns from `~/local/src/zndx/atelier`. Initial
deployment target: `weathership.zndx.org` on the existing zndx.org
Cloudflare zone.

## What got built

- **devenv.nix** — Python 3.12 + uv, Node 22 + pnpm, TypeScript,
  mdbook + d2 + mermaid, librsvg, optipng, just, gh.
- **pyproject.toml** — minimal app project with httpx + behave +
  pytest in the dev group.
- **brand/** — full identity package, publication-ready out of the
  gate:
  - identity.md, voice-tone.md, usage-guidelines.md, press-kit.md
  - colors/palette.md + tokens.css (six tokens: ink, paper, sea,
    storm, sun, fog)
  - typography/system.md + specimens.svg
  - logo/{mark,wordmark,lockup}/*.svg (full-color + mono variants)
  - favicon/favicon.svg
  - social/{og,twitter-banner,avatar}.svg
  - render-pngs.sh that produces all PNG renders via rsvg-convert +
    optipng
- **web/** — Astro static site + Cloudflare Worker (Hono shim).
  - Pages: `/`, `/about`, `/news/`, `/news/[slug]`, `/projects/`,
    `/projects/[slug]`, `/media-kit/{index,logo,colors,typography,press}`.
  - kumo via `@cloudflare/kumo` for component primitives.
  - React islands: ColorSwatch (click-to-copy), AssetDownload,
    LogoVariantGrid.
  - Content collections for `news` and `projects` (aegir, gaius,
    stealth).
- **docs/current/** — mdbook with brand, architecture, operations
  (dns, deploy) sections.
- **features/** — behave BDD with site.feature + brand.feature.
- **justfile** — task recipes wrapping every common workflow.
- **.github/workflows/{docs,deploy}.yml** — CI for mdbook → GH Pages
  and Astro/Worker → Cloudflare.

## Logo concept (committed)

Two-tone geometric mark on a 24×24 grid: an upper triangle in
`--ws-sun` (sail) above a horizon stripe in `--ws-sea`, with a lower
triangle in `--ws-sea` (hull) below. Reads as a stylized
weather-instrument or compass rose, not literally as a "W." Subject to
revision once the user has eyes on rendered PNGs.

## Projects

- **aegir** (active, public): Hierarchical sequence model for
  semantic column annotation. Repo private; docs at
  zndx.github.io/aegir.
- **gaius** (active, public): Terminal interface for graph-oriented
  data on a 19×19 grid. github.com/zndx/gaius.
- **(stealth)**: Event-sourced actor system for Industry 4.0
  manufacturing — CAF + Kudu + Aeron. Currently lives at
  github.com/rch/asf-kudu/tree/rch/devenv/examples/caf; doesn't yet
  have a name or its own repo.

## Open follow-ups

- User to review the mark and either confirm or redirect.
- User to confirm color values (the proposed hex values are
  starter-grade; can be tuned in `brand/colors/tokens.css`).
- Acquire `weathership.org` Cloudflare zone when ready; one-step
  custom-domain swap (no code change required).
- Add `Inter` and `JetBrains Mono` woff2 to `web/public/fonts/` for
  pixel-perfect wordmark rendering. Today the wordmark falls back to
  system fonts when Inter isn't available system-wide; visually fine
  but not pixel-identical to the documented wordmark.

## Verification commands

```sh
direnv reload                                  # rebuild devenv
just web-install                               # pnpm install
just brand-render                              # regenerate PNGs
just web-build                                 # astro build
just web-preview &                             # wrangler dev on :8787
WEATHERSHIP_URL=http://localhost:8787 just behave
just docs-build && just docs-serve             # mdbook
```
