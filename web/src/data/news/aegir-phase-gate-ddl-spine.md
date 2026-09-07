---
title: "Aegir clears the v0.3 phase gate on the governance and DDL spine."
date: 2026-06-07
summary: "The ontology → SKOS vocabulary → relational footprint → generated corpus derivation chain is closed end-to-end. Every commit is a reproducible convergence snapshot of the whole chain."
---

Aegir clears the v0.3 phase gate on the governance and DDL spine.
The deterministic chain from ontology axioms to populated relational
data is now closed end-to-end:

1. The 540-template catalog produces a **548-concept SKOS
   vocabulary** — the shared type-system key consumed by Atelier and
   Signals.
2. The vocabulary produces a deterministic **relational footprint**
   of `CREATE TABLE` statements with cross-family foreign keys.
3. The footprint populates a generated **textbook corpus**, with the
   generator's reasoning trace preserved alongside each chapter.

Every commit is a reproducible convergence snapshot of the whole
chain. The artifacts ship from a separate, independently-versioned
repository — [sdg-corpora](/projects/sdg-corpora/) — consumed by
Aegir, Atelier, and Signals via git submodule.

The phase gate report lives in the Aegir mdbook under
`roadmap/phase_gate_governance_ddl`.
