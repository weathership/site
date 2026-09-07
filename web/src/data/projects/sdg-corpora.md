---
name: "SDG corpora"
tagline: "Reproducible ontology-grounded corpora for data-governance models."
status: "active"
repo: "https://github.com/zndx/sdg-corpora"
visibility: "public"
order: 6
summary: "Independently-versioned home for the Signals Data Governance corpora. Each commit is a coherent snapshot of the OWL ⊨ SKOS ⊨ SHACL chain and the relational schema projected from it."
---

SDG corpora is the independently-versioned home for the Signals Data
Governance datasets used across the weathership stack — the “what”
sibling of [SDG strategy](/projects/sdg-strategy/). Each commit is a
coherent snapshot of one derivation:

**OWL ⊨ SKOS ⊨ SHACL**, then a **relational projection**.

The source of truth is a BFO 2020 / CCO-grounded OWL ontology,
HermiT-certified. SKOS is not a second vocabulary: every published
concept is a projection of a realized OWL class (labels, definitions,
and examples live as SKOS annotation properties on that class). SHACL
is the closed-world constraint view of the same axioms — `sh:targetClass`
names a realized class; cardinality and filler restrictions become
shape constraints. The relational schema (tables, keys, foreign keys,
loadable SQL) is lowered from that certified OWL, not authored beside
it. Generated textbook chapters and rows populate the projection;
column labels come from the SKOS face.

Consumed via git submodule by three downstream projects:

- **[Ægir](/projects/aegir/)** — training and evaluation of the
  hierarchical sequence model; owner of the derivation.
- **[Atelier](/projects/atelier/)** — independent classification
  against the shared SKOS vocabulary.
- **[Signals](/projects/signals/)** — warehouse facts and Atlas
  tags against the populated relational footprint.

Tagged releases package the ontology, the SKOS vocabulary, the SHACL
shapes, and the populated tables — *without* the per-column reference
that would tell a downstream classifier which class minted each
column. Atelier pins a release and classifies blind from values and
vocabulary only; the held-back reference is the scoring key.

Released under the Apache 2.0 license.
