# site

Public web presence and brand package for **weathership.org**, an
open-source AI entity.

## Layout

| Path | Purpose |
|------|---------|
| `brand/` | Source-of-truth: voice, palette, typography, logo SVGs, social cards. |
| `web/` | Astro + React site (uses `@cloudflare/kumo`), deployed as a Cloudflare Worker. |
| `docs/current/` | Engineering docs (mdbook). |
| `docs/scratch/<date>/` | Working session notes. |
| `docs/archive/<quarter>/` | Retired engineering docs. |
| `features/` | Python `behave` BDD against the deployed site. |
| `devenv.nix` | Nix dev shell — Python 3.12 + uv, Node 22 + pnpm, mdbook + d2 + mermaid, librsvg, optipng, just. |
| `pyproject.toml` | Python deps for behave/pytest. |
| `justfile` | Task recipes (`just --list`). |

Initial deployment target: `weathership.zndx.org` (Cloudflare Worker
on the existing zndx.org zone). Will move to a dedicated
`weathership.org` zone — worker code is unchanged.

## Quick start

```sh
direnv allow .              # enter dev shell (or: devenv shell)
just bootstrap              # pnpm install + uv sync + brand-render
just web-dev                # Astro dev server on http://localhost:4321
just web-preview            # wrangler dev (after `just web-build`) on :8787
just behave                 # BDD against $WEATHERSHIP_URL (default :8787)
just docs-serve             # engineering docs at http://localhost:3000
```

## Documentation

- Public site: <https://weathership.zndx.org>
- Engineering docs: <https://weathership.github.io/site/> (deployed by
  `.github/workflows/docs.yml`)
- Brand source: [`brand/README.md`](./brand/README.md)
