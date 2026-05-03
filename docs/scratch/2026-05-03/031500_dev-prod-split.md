# 2026-05-03 — dev/prod split, weathership.org release

## Goal

Promote weathership.org to the production target. Keep
weathership.zndx.org as dev. Default deploys go to dev so prod is never
the accidental outcome of a routine push.

## What changed

### Cloudflare topology

- **`weathership-web-dev`** worker (new) → `weathership.zndx.org`
- **`weathership-web`** worker (existing, repurposed) → `weathership.org`
  apex **and** `www.weathership.org`
- Same Cloudflare account; weathership.org zone bound separately from
  zndx.org zone.

### wrangler.jsonc

Top-level config = dev (`weathership-web-dev`). `env.production`
overrides name to `weathership-web`. `wrangler deploy` (no flag)
targets dev; `wrangler deploy --env production` targets prod.

### justfile

- `web-deploy` → dev (zndx.org)
- `web-release` → production (weathership.org)
- explicit verb (release) on the prod path

### web/package.json

- `deploy:dev` → `astro build && wrangler deploy`
- `deploy:prod` → `astro build && wrangler deploy --env production`

### .github/workflows/deploy.yml

- push-to-main → dev only
- production releases require `gh workflow run deploy.yml -f target=production`
  (workflow_dispatch with explicit target input)

### astro.config.mjs

- `site` set to `https://weathership.org` (canonical / OG metadata uses
  prod domain even when serving from dev)

## DNS work

`weathership.org` apex previously had four A records pointing to GitHub
Pages (185.199.108–111.153) — unused 301-redirect-loop placeholder.
User deleted them on apex and www so the worker custom-domain bindings
could be created cleanly. Google Workspace MX records and SPF TXT on
the apex were left intact (independent of web routing).

Custom-domain binding IDs (for reference / future cleanup):
- `weathership.zndx.org` → `weathership-web-dev`: `a70a7ce5ec41307f30c938303d78d771841cd5fb`
- `weathership.org` → `weathership-web`: `5e1809158cb0021417ffe1a3bf9452bbc6f241ad`
- `www.weathership.org` → `weathership-web`: `982fb744e43b0b201500b33eae0448629bfd9fc0`

## API tokens

- `CLOUDFLARE_API_TOKEN` (account-scoped) — workers deploy + custom
  domain binding API. Worked for both zones.
- `CF_WX_API_TOKEN` (zone-scoped to weathership.org) — DNS record
  reads for inspection. Did NOT have account-level workers/domains
  permissions; the account-scoped token did.

## Verification

```
WEATHERSHIP_URL=https://weathership.org      uv run behave features/
  → 13 scenarios passed, 54 steps passed
WEATHERSHIP_URL=https://weathership.zndx.org uv run behave features/
  → 13 scenarios passed, 54 steps passed
```

## Open follow-ups

- Consider redirect of `www.weathership.org` → `weathership.org`
  (apex-canonical) via Cloudflare bulk redirects or the worker itself.
  Today both serve the same content; SEO-clean would pick one canonical
  and 301 the other.
- Add a noindex/disallow rule for `weathership.zndx.org` so dev doesn't
  pollute search results. Easiest: serve `X-Robots-Tag: noindex` from
  the worker when the host header is the dev domain.
- Set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repo
  secrets if/when CI deploys are wanted (workflow already wired).
