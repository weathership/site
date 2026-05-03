# Deploy

Two deployment surfaces, deployed independently:

| Surface | Output | Trigger |
|---------|--------|---------|
| Public site | Cloudflare Worker `weathership-web` | `pnpm deploy` from `web/` (or `.github/workflows/deploy.yml`) |
| Engineering docs (this book) | GitHub Pages, `weathership.github.io/site/` | `.github/workflows/docs.yml` on push to main |

## Public site

### Local

```sh
just web-install        # one-time: pnpm install in web/
just web-dev            # Astro dev server on localhost:4321 (HMR)
just web-build          # syncs brand/, builds Astro to web/dist/
just web-preview        # wrangler dev against the built dist on localhost:8787
just behave             # runs BDD against $WEATHERSHIP_URL (default localhost:8787)
just web-deploy         # build + wrangler deploy
```

The first deploy from any machine requires:

```sh
direnv exec . pnpm --filter weathership-web exec wrangler login
```

(Or run `pnpm exec wrangler login` from inside `web/`.) The login
flow is browser-based and writes a token to `~/.config/.wrangler/`.

### CI

`.github/workflows/deploy.yml` runs on push to main when files under
`web/`, `brand/`, or the workflow itself change. It:

1. Installs Node 22 and pnpm.
2. Runs `pnpm install` in `web/`.
3. Runs `pnpm build`.
4. Runs `pnpm exec wrangler deploy` with the
   `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets.

#### Required repository secrets

- `CLOUDFLARE_API_TOKEN` — token with **Workers Scripts:Edit** scope on
  the account. Optionally `Workers KV Storage:Edit` if KV is added later.
- `CLOUDFLARE_ACCOUNT_ID` — the account that owns the worker.

Generate the token at: Cloudflare dashboard → My Profile → API Tokens →
**Create Token** → use the "Edit Cloudflare Workers" template.

The token does **not** need `zone:route` because the custom domain is
bound through the dashboard (see [DNS](./dns.md)).

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
