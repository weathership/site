# Introduction

This is the engineering documentation for the weathership.org site
repository: the public web presence and brand package for weathership,
an open-source AI entity. It complements — and does not replace — the
public site at <https://weathership.zndx.org>.

## What's in this repo

| Path | Purpose |
|------|---------|
| `brand/` | Canonical brand source. Voice, color tokens, typography, logo SVG masters, social cards. |
| `web/` | Astro + React site, deployed as a Cloudflare Worker that serves static assets via the `assets` binding. |
| `docs/current/` | This mdbook documentation (engineering / operations). |
| `docs/scratch/<date>/` | Working session notes — informal, time-stamped. |
| `docs/archive/<quarter>/` | Retired engineering docs, kept for provenance. |
| `features/` | Python `behave` BDD tests against the deployed site and brand consistency. |
| `pyproject.toml` | Python deps for `behave` and `pytest` (managed via `uv`). |
| `devenv.nix` | Nix dev shell — Python, Node, mdbook, librsvg, optipng, just, etc. |

## What's where externally

- **Public site:** <https://weathership.zndx.org> (Cloudflare Worker on
  the zndx.org zone).
- **mdbook documentation (this book):** GitHub Pages at
  `weathership.github.io/site/`.
- **Source SVGs and assets:** in `brand/` here, mirrored at build time
  to `/brand/` on the deployed site.

## Reading order

If you're new:

1. [Brand](./brand.md) — voice, palette, type, logo system. The same
   content surfaced publicly at `/media-kit/`, but here with the
   engineering context.
2. [Architecture](./architecture.md) — how the site is built and
   deployed.
3. [Operations: DNS](./operations/dns.md) — how the
   `weathership.zndx.org` subdomain is wired.
4. [Operations: Deploy](./operations/deploy.md) — how to ship a change
   from local to production.
