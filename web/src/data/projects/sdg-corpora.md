---
name: "SDG corpora"
tagline: "Reproducible ontology-grounded corpora for data-governance models."
status: "active"
repo: "https://github.com/zndx/sdg-corpora"
visibility: "public"
order: 6
summary: "Independently-versioned home for the Signals Data Governance corpora. Each commit is a reproducible convergence snapshot of the whole derivation chain — ontology, SKOS vocabulary, relational footprint, and generated corpus."
---

SDG corpora is the independently-versioned home for the Signals Data
Governance datasets used across the weathership stack — the “what”
sibling of [SDG strategy](/projects/sdg-strategy/). Each commit is
a reproducible convergence snapshot of the whole derivation chain:
the 540-template ontology catalog produces a SKOS vocabulary of 548
concepts, which produces a deterministic relational footprint (DDL
plus cross-family foreign keys), which is populated by generated
textbook documents and the corresponding relational rows.

Consumed via git submodule by three downstream projects:

- **[Ægir](/projects/aegir/)** — training and evaluation of the
  hierarchical sequence model.
- **[Atelier](/projects/atelier/)** — independent classification
  against the shared SKOS vocabulary.
- **[Signals](/projects/signals/)** — warehouse facts and Atlas
  tags against the populated relational footprint.

Tagged releases package the SKOS vocabulary, the ontology, and the
populated DDL tables — *without* the per-column reference codes that
identify which template each column was generated from. Atelier pins
a release and classifies blind from values and vocabulary only; the
held-back reference is the scoring key. The result is an
independent, pre-training measure of classification efficacy on the
corpus, and a clean baseline against which to measure Aegir's
downstream lift.

Released under the Apache 2.0 license.
