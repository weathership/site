# Landing hero: Signals → GitHub Pages docs

The homepage lede opened with unlinked "Signals is the foundation".
The word now points at the public Signals book.

## Change

- `web/src/pages/index.astro` — wrap the first "Signals" in
  `<a href="https://weathership.github.io/signals/" rel="external">`,
  matching the other outbound hero links (Hermes, Nous, Postgres FDW).
- `features/site.feature` — landing scenario asserts the href.

About still links Signals to `/projects/signals/`. That was left
alone; this request was landing-hero only.

## Check

Astro `pnpm dev` on `:4321`. The rendered hero lede contains the
anchor. `WEATHERSHIP_URL=http://localhost:4321 uv run behave
features/site.feature --name "Landing page"` — 2 scenarios passed.
No browser MCP in this session; verified via curl of the HTML.
