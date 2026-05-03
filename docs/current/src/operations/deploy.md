# Deploy

Two deployment surfaces, two release targets:

| Surface | Target | Trigger |
|---------|--------|---------|
| Development | `weathership.zndx.org` (Worker `weathership-web-dev`) | `just web-deploy` (or push to `main`) |
| Production | `weathership.org` (Worker `weathership-web`) | `just web-release` (or `gh workflow run deploy.yml -f target=production`) |
| Engineering docs (this book) | GitHub Pages, `weathership.github.io/site/` | `.github/workflows/docs.yml` on push to main |

## Public site

### Local

```sh
just web-install        # one-time: pnpm install in web/
just web-dev            # Astro dev server on localhost:4321 (HMR)
just web-build          # syncs brand/, builds Astro to web/dist/
just web-preview        # wrangler dev against the built dist on localhost:8787
just behave             # runs BDD against $WEATHERSHIP_URL (default localhost:8787)
just web-deploy         # → dev (weathership.zndx.org)
just web-release        # → production (weathership.org)
```

The first deploy from any machine requires:

```sh
pnpm exec wrangler login
```

(Or set `CLOUDFLARE_API_TOKEN` in the environment — the dev shell picks
it up via direnv.)

### CI

`.github/workflows/deploy.yml` runs on push to `main` when files under
`web/`, `brand/`, or the workflow itself change. It:

1. Installs Node 22 and pnpm.
2. Runs `pnpm install --frozen-lockfile` in `web/`.
3. Runs `pnpm typecheck`.
4. Runs `pnpm run deploy:dev` (i.e., a dev deploy).

**Production releases require an explicit `workflow_dispatch`** with
`target: production`:

```sh
gh workflow run deploy.yml -f target=production
```

This is intentional: a `git push` to main never lands on production
unattended; releases are deliberate.

#### Required repository secrets

- `CLOUDFLARE_API_TOKEN` — token with **Workers Scripts:Edit** scope on
  the account.
- `CLOUDFLARE_ACCOUNT_ID` — the account that owns the workers.

The token does **not** need `zone:route` because custom domains are
bound through the dashboard / API at infrastructure-setup time (see
[DNS](./dns.md)). Routine deploys only update the worker code.

### Naming convention

- `wrangler deploy` (no flag) targets the **default** environment in
  `wrangler.jsonc` — top-level `name: "weathership-web-dev"`.
- `wrangler deploy --env production` targets `env.production` —
  `name: "weathership-web"`.

The default-is-dev choice deliberately makes accidental production
deploys harder. Explicit verb (`web-release`) is required to push to
the world-facing domain.

## Engineering docs (this book)

`.github/workflows/docs.yml` runs on push to main when files under
`docs/current/` change. It:

1. Installs mdbook and the d2/mermaid preprocessors.
2. Runs `mdbook build docs/current`.
3. Uploads `docs/current/book/` as a Pages artifact.
4. Deploys to GitHub Pages.

The `site-url = "/site/"` setting in `book.toml` assumes the GH Pages
publish path is `weathership.github.io/site/`. If the repo is renamed,
update that setting.
