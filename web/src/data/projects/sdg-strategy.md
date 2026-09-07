---
name: "SDG strategy"
tagline: "Content-addressed record of how a Signals data product was made."
status: "active"
repo: "https://github.com/zndx/sdg-strategy"
visibility: "public"
order: 8
summary: "Sibling of SDG corpora. A STRATEGY is the Merkle-shaped answer to why the pipeline did that: lens, voices, knobs, and targets — every outcome-shaping determinant that is neither the input window nor the code commit."
---

SDG strategy is the “how it was made” data product, sibling of
[SDG corpora](/projects/sdg-corpora/). A run is determined by the
provenance triple `(window, strategy, code)`. This repository holds
the middle vertex: every outcome-shaping factor that is neither the
input window nor the code commit.

`strategy_id` is a 12-character SHA-256 of the sorted component
hashes. It is verifiable from any Signals project with no Ægir
context. Release tags and zettel ids are names;
`manifests/<strategy_id>.json` is the Merkle tree; `CURRENT` names
the checked-out strategy on `trunk`.

## Four pillars

- **lens** — Qdrant aperture snapshot (concept ids, labels, vector hashes)
- **voices** — agent-facing surfaces: prompts, schemas, feedback
  templates, MCP tool docstrings, writer profile, backend config
- **knobs** — the flow's tunable defaults
- **targets** — what it aims at: SchemaPile norms, gate floors, brand
  lexicon

Shadows are branches from `trunk`. Promotion is cherry-pick or merge;
consumers pin by ref. Ægir maintains the manifests
(`python -m aegir.strategy.manifest`). Lineage surfaces (Atlas /
OpenLineage) carry the same `strategy_id`.

Released under the Apache 2.0 license.
