# Archive — 2026 Q2

Retired engineering documentation for the April–June 2026 quarter.

This directory is intentionally a placeholder at the start of the
quarter. As `docs/current/` content is replaced or rewritten, the
prior version moves here so that links elsewhere in the org keep
working and historical context is preserved.

## When to archive

- A `docs/current/` page is rewritten end-to-end (move the prior
  version here under its original filename).
- A subsystem is deprecated (move all of its docs here).
- A decision document is overtaken by a follow-up decision (keep the
  original here for provenance).

## Convention

Filenames inside this directory keep their original `docs/current/`
relative paths so a redirect map is trivial:

```
docs/current/architecture.md      →  docs/archive/2026Q2/architecture.md
docs/current/operations/dns.md    →  docs/archive/2026Q2/operations/dns.md
```

Empty quarter directories are kept under version control as a marker
that we considered the quarter and chose not to archive anything.
