# Architecture

```text
brand/                 →  source-of-truth for marks, colors, type, copy
                          ↓ (sync-brand.mjs at build)
web/public/brand/      →  mirrored for serving
                          ↓
web/src/               →  Astro pages (static), React islands using @cloudflare/kumo
                          ↓ astro build
web/dist/              →  static HTML + assets
                          ↓ wrangler deploy
Cloudflare Worker      →  serves dist/ via the `assets` binding
                          ↓ custom domain
weathership.zndx.org   →  public site
```

## Components

### `web/src/worker.ts`

A thin Hono router. Two routes only:

- `GET /health` — returns `ok\n` (worker liveness check).
- `*` — falls through to the asset binding (`c.env.ASSETS.fetch(c.req.raw)`),
  which serves the contents of `web/dist/` as static assets.

The worker is intentionally empty of dynamic logic. If we ever need
SSR or API endpoints, the router is the place to add them; until then,
the site is fully static.

### `web/astro.config.mjs`

- `output: "static"` — every page is pre-rendered at build time.
- `integrations: [react()]` — enables React islands (used by the
  `/media-kit/` pages: `ColorSwatch`, `AssetDownload`, `LogoVariantGrid`).
- `site: "https://weathership.zndx.org"` — sets the canonical base URL
  used in OG/canonical metadata.

### `web/wrangler.jsonc`

- `main: "src/worker.ts"` — the Hono entry.
- `assets.directory: "./dist"` — Astro's build output is the asset root.
- `assets.binding: "ASSETS"` — the worker reads from this binding.
- `compatibility_flags: ["nodejs_compat"]` — Hono needs a couple of
  Node-shape APIs.

The custom domain `weathership.zndx.org` is bound in the Cloudflare
dashboard rather than declared in this config because the deploy token
lacks `zone:route` permissions. See [Operations / DNS](./operations/dns.md).

### Astro Content Collections

Two collections in `web/src/content/`:

- **`news`** — markdown posts with `title`, `date`, `summary`, `author`.
  Rendered at `/news/<slug>/` and indexed at `/news/`.
- **`projects`** — markdown entries with `name`, `tagline`, `status`,
  optional `repo` and `docs` URLs, `visibility` (`public` /
  `private` / `stealth`), and `order`. Rendered at
  `/projects/<slug>/` and indexed at `/projects/`.

The `visibility: stealth` value triggers a different render style on
the index card (muted, no external-link affordance) — used by the
unnamed CAF/Kudu/Aeron project today.

### Brand sync

`web/scripts/sync-brand.mjs` runs before `astro dev` and `astro build`.
It mirrors the entire `brand/` tree to `web/public/brand/`, plus
conventional root copies for the favicon and OG image. Everything
under `web/public/brand/` is deployment artifact, not source — the
directory is gitignored.

### kumo integration

`@cloudflare/kumo` is loaded via `import "@cloudflare/kumo/styles"` in
`web/src/styles/global.css`. The custom property tokens from
`brand/colors/tokens.css` are imported just before, so kumo components
inherit weathership colors via standard CSS cascade.

Today the React islands are hand-rolled (the `ColorSwatch`,
`AssetDownload`, `LogoVariantGrid` components live in
`web/src/components/`). As the surface grows, swap hand-rolled
elements for kumo equivalents — they share the token namespace.

## Build pipeline

```text
pnpm install         →  installs Astro, React, kumo, hono, wrangler
just brand-render    →  rsvg-convert + optipng over brand/{logo,…}/*.svg
pnpm build           →  sync-brand → astro build → web/dist/
pnpm preview         →  wrangler dev (serves dist/ on localhost:8787)
pnpm deploy          →  build + wrangler deploy
```

mdbook documentation is built independently by `mdbook build docs/current`
and deployed to GitHub Pages via `.github/workflows/docs.yml`.

## Behave

The Python BDD suite at `features/` tests the deployed site:

- `site.feature` — landing renders, `/health` returns `ok`, favicon
  reachable.
- `brand.feature` — palette tokens served in the page CSS, brand
  assets reachable at expected URLs, logo variants enumerated by the
  media-kit page match the files in `brand/logo/`.

Run via `just behave` (defaults to `localhost:8787`) or
`WEATHERSHIP_URL=https://weathership.zndx.org just behave` against
production.
