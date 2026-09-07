---
title: "Aegir closes OWL ⊨ SKOS ⊨ SHACL and the relational projection."
date: 2026-06-07
summary: "The ontology entails its SKOS vocabulary and SHACL shapes; loadable SQL is lowered from the certified OWL. Every commit is a reproducible snapshot of the whole chain."
---

Aegir closes the derivation from certified OWL to populated relational
data. The published faces are entailed views of one artifact, not a
catalog of generation templates:

1. **OWL** — a BFO 2020 / CCO-grounded ontology, HermiT-certified, is
   the source of truth.
2. **SKOS** — the shared type-system key consumed by Atelier and
   Signals is a projection of realized classes, not an independent
   glossary.
3. **SHACL** — closed-world shapes whose `sh:targetClass` names those
   same classes; cardinality and fillers follow the restrictions.
4. **Relational projection** — loadable SQL (tables, keys, foreign
   keys) lowered from the certified OWL, then populated as a textbook
   corpus with the generator's reasoning trace beside each chapter.

Every commit is a reproducible snapshot of the whole chain. The
artifacts ship from a separate, independently-versioned repository —
[sdg-corpora](/projects/sdg-corpora/) — consumed by Aegir, Atelier,
and Signals via git submodule.

The phase-gate record lives in the Aegir mdbook under
`roadmap/phase_gate_governance_ddl`.
