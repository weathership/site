# Production release: Signals hero link

Pushed local `main` (32 commits behind origin, plus the hero
link and a typecheck fix) and released the Worker to
weathership.org.

## Sequence

1. `git push origin main` at `48e1a43` (hero link). CI deploy
   failed: `astro check` rejected `.filter(Boolean)` on
   `projectMap.get` as possibly undefined.
2. Replaced those filters with `flatMap` so the CollectionEntry
   is narrowed. Typecheck green. Commit `473b1d8`, pushed.
3. `just web-release` → Worker `weathership-web`, version
   `ce9cc3ee-6740-4c2a-9e3e-54c9a9e01721`.
4. `https://weathership.org/` serves the hero anchor
   `https://weathership.github.io/signals/`. `/health` is `ok`.

Push-to-main still deploys **dev** (`weathership.zndx.org`) via
Actions; production was this explicit local release.
