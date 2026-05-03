# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

This repo hosts the public web presence and brand package for
**weathership.org**, an open-source AI entity. Initial deployment
target is `weathership.zndx.org` — a Cloudflare Worker on the
existing zndx.org zone — modeled on the sibling `gaius` project.

## Repo layout

- `brand/` — canonical source-of-truth for marks, colors, type, voice,
  and copy. Edit here; the site reflects it. Don't hand-edit PNGs:
  they're regenerated from SVG masters by `just brand-render`
  (`brand/render-pngs.sh` → `rsvg-convert` + `optipng`).
- `web/` — Astro static site + Cloudflare Worker (Hono shim).
  - `src/worker.ts` is the Worker entry; `/health` returns `ok`,
    everything else falls through to the `assets` binding.
  - `src/lib/brand-assets.ts` is a hand-maintained enumeration of
    asset variants (logo, colors, social, type ramp). Update it when
    you add a new SVG or token; otherwise the media-kit pages don't
    surface it. `features/brand.feature` will fail if the
    enumeration diverges from `brand/logo/`.
  - `scripts/sync-brand.mjs` runs as a `prebuild` step and mirrors
    `brand/` into `web/public/brand/` plus conventional root paths
    (`/favicon.svg`, `/og.png`, etc.). `web/public/brand/` is build
    artifact (gitignored), not source.
  - `src/styles/global.css` imports `brand/colors/tokens.css`
    directly so kumo components and Astro pages share one source of
    palette truth.
- `docs/current/` — engineering mdbook (architecture, operations).
- `docs/scratch/<date>/` — session notes, time-stamped per global
  CLAUDE.md convention.
- `docs/archive/<quarter>/` — retired engineering docs.
- `features/` — Python `behave` BDD that hits the deployed site
  (`WEATHERSHIP_URL`, default `http://localhost:8787`).
- `pyproject.toml` — Python app project (uv-managed, no wheel build).
- `devenv.nix` / `devenv.yaml` — Nix dev shell (Python 3.12 + uv,
  Node 22 + pnpm, TypeScript, mdbook + d2 + mermaid, librsvg,
  optipng, just). `devenv.yaml` declares the `nixpkgs-python` input
  required by `languages.python.version`.

## Common commands

From the dev shell (direnv-loaded automatically in this dir):

```sh
just --list                 # see all recipes
just bootstrap              # one-shot: pnpm install + uv sync + brand-render
just web-dev                # Astro dev server (http://localhost:4321)
just web-build              # syncs brand/, builds Astro to web/dist/
just web-preview            # wrangler dev against built dist (http://localhost:8787)
just web-deploy             # build + wrangler deploy
just web-typecheck          # astro check + tsc --noEmit
just docs-serve             # mdbook live preview
just docs-build             # mdbook build → docs/current/book/
just brand-render           # regenerate PNG renders from SVG masters
just behave                 # full BDD suite against $WEATHERSHIP_URL
just test                   # typecheck + smoke + brand
```

The first deploy from any machine: `pnpm exec wrangler login` from
inside `web/`.

## Architecture notes that matter when editing

- **The Worker is intentionally empty.** Don't add dynamic logic
  unless there's a reason it can't be a static page. The site is
  static-by-default; routes that need server-side compute go in
  `src/worker.ts` *before* the `*` catch-all.
- **Brand source-of-truth is `brand/`, not `web/public/brand/`.** The
  latter is rebuilt by `sync-brand.mjs`. If you edit a file in
  `web/public/brand/` directly, your change is wiped on the next
  build. CI builds always re-run sync.
- **Color tokens are imported, not duplicated.** `web/src/styles/global.css`
  does `@import "../../../brand/colors/tokens.css"`. If you add a
  new color, add it once in `brand/colors/tokens.css` and update
  `brand/colors/palette.md` and `web/src/lib/brand-assets.ts:COLOR_TOKENS`.
- **The `stealth` project pattern.** `web/src/content/projects/stealth.md`
  uses `visibility: stealth` and intentionally has no `repo` or
  `docs` URL. The card renders muted on `/projects/`. When the
  underlying project (CAF/Kudu/Aeron — currently at
  `github.com/rch/asf-kudu/tree/rch/devenv/examples/caf`) gets a
  name and its own repo, swap visibility to `public` and add `repo`.
- **Behave hits the deployed URL.** Tests are not unit tests of TS
  modules — they're acceptance tests against a serving target. Run
  `just web-preview` (or deploy and hit prod) before `just behave`.

## DNS & deploy

The custom domain `weathership.zndx.org` is bound through the
Cloudflare dashboard, not in `wrangler.jsonc`, because the deploy
token lacks `zone:route` (matches the gaius pattern). See
`docs/current/src/operations/dns.md` for the one-time setup.

GitHub Actions:
- `.github/workflows/docs.yml` — mdbook → GitHub Pages (path:
  `docs/current/**`).
- `.github/workflows/deploy.yml` — Astro + wrangler deploy (path:
  `web/**`, `brand/**`). Requires `CLOUDFLARE_API_TOKEN` and
  `CLOUDFLARE_ACCOUNT_ID` repo secrets.

## Conventions

- Per global CLAUDE.md: prefer `uv run` over `python` when uv is
  available. Save session summaries to
  `docs/scratch/$(date --iso-8601)/HHMMSS_<topic>.md`.
- Per project: never commit raster assets that should have come from
  SVG masters. If a PNG is needed at a new size, add it to
  `render-pngs.sh` and rerun `just brand-render`.
- Per project: brand text files are publication-ready, not
  placeholders. Don't ship "TODO" copy.
