# weathership.org — task recipes
# `just --list` from the dev shell to see what's available.

set shell := ["bash", "-uc"]

# Default: list recipes.
default:
    @just --list

# --- docs (mdbook) ----------------------------------------------------

docs-serve:
    mdbook serve docs/current

docs-build:
    mdbook build docs/current

docs-clean:
    rm -rf docs/current/book

# --- web (Astro + Worker) ---------------------------------------------

web-install:
    cd web && pnpm install

web-dev:
    cd web && pnpm dev

web-build:
    cd web && pnpm build

web-preview:
    cd web && pnpm preview

# Deploy to dev (weathership.zndx.org). Day-to-day target.
web-deploy:
    cd web && pnpm run build && pnpm exec wrangler deploy

# Release to production (weathership.org). Explicit verb on purpose —
# dev iterates with `just web-deploy`, releases use `just web-release`.
web-release:
    cd web && pnpm run build && pnpm exec wrangler deploy --env production

web-typecheck:
    cd web && pnpm typecheck

web-clean:
    rm -rf web/dist web/.astro web/public/brand

# --- brand ------------------------------------------------------------

brand-render:
    bash brand/render-pngs.sh

brand-check:
    uv run behave features/brand.feature

# --- behave (BDD) -----------------------------------------------------

behave:
    WEATHERSHIP_URL="${WEATHERSHIP_URL:-http://localhost:8787}" uv run behave features/

behave-smoke:
    WEATHERSHIP_URL="${WEATHERSHIP_URL:-http://localhost:8787}" uv run behave features/site.feature

# --- aggregates -------------------------------------------------------

build: web-build docs-build

test: web-typecheck behave-smoke brand-check

# --- one-shot bootstrap -----------------------------------------------

bootstrap: web-install
    uv sync
    just brand-render
    @echo
    @echo "✓ ready. try: just web-dev    or    just docs-serve"
