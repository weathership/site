---
name: "Ontology-grounded convergence-snapshot derivation chain"
tagline: "A reproducible derivation chain — ontology catalog → SKOS vocabulary → relational DDL footprint → populated corpus — versioned so each commit is a coherent snapshot of every downstream artifact."
summary: "An ontology-grounded pipeline in which a 540-template Manchester-syntax catalog deterministically derives a 548-concept SKOS vocabulary, a cross-dialect DDL spine, and a populated textbook + table corpus. Every git commit is a content-hashed convergence snapshot of the whole chain, enabling blind-release evaluation."
projects: [aegir, sdg-corpora]
order: 4
---

## Motivation

Evaluating column-classification or ontology-grounded pretraining requires three artifacts to be mutually consistent: the type system, the relational schema that exercises it, and the populated data that exemplifies it. When these are versioned independently — vocabulary in one repository, DDL in another, corpus regenerated ad hoc — drift between them silently contaminates downstream measurement. The convergence-snapshot derivation chain treats all four stages as a single deterministic function over a versioned source artifact, so a commit hash uniquely identifies a coherent (ontology, vocabulary, schema, corpus) tuple.

## Formulation

Let `C` denote a procedural ontology catalog: a flat data artifact in which each row is a Manchester-syntax axiom template carrying typed slot constraints, a cached DeepOnto verbalization, a `bfo_anchor_path` to a BFO 2020 / CCO upper class [Arp, Smith & Spear 2015], and an `is_complex` flag determined offline by `onto.get_asserted_complex_classes()` [He et al. 2023]. The derivation chain is the deterministic sequence

`C → V(C) → D(C) → X(C, D, V)`

where `V(C)` is the SKOS ConceptScheme [Miles & Bechhofer 2009] whose codes are the ontology (the seven BFO/CCO anchors as upper concepts, each catalog template as a leaf under its anchor); `D(C)` is the relational footprint (one table per template, with cross-family foreign keys sanctioned by an empirical family-simplicial complex); and `X(C, D, V)` is the populated corpus — textbook chapters generated against the cached verbalizations, with populated rows that conform to `D(C)` and column labels drawn from `V(C)`. The chain has no LLM, no JVM, and no network access in any step except corpus generation.

## Implementation notes

The implementation lives in `aegir/scripts/`, with the four stage drivers being `build_catalog.py`, `build_skos_vocab.py`, `build_ddl_spine.py`, and the corpus generators under the `corpora/` git submodule (released independently as `zndx/sdg-corpora`). At the time of writing, the catalog contains 540 templates across seven families (foundation, observation/measurement, directive/governance, eBPF kernel, PROV-O lineage, belief structure, long tail); the SKOS vocabulary emits 548 concepts (7 BFO/CCO upper anchors + 540 template leaves + 1 generic anchor for templates without a `bfo_anchor_path`); the DDL spine emits 540 tables and 351 cross-family foreign keys validated cross-dialect against the Trino ∩ Spark intersection via `polyglot`; and the v0.3 corpus card reports 2,235 chapters, 9,230 relational tables, 16,516 columns, and 79,746 cells with paired reasoning traces.

Two properties make the chain operationally useful. First, **content-hashed run IDs**: `build_ddl_spine.py` derives its `run_id` from a SHA-256 over the catalog file hashes, dialect set, and per-family cap, so identical inputs produce bit-identical outputs in a directory whose name is the input's fingerprint. Second, **blind release**: a tagged release packages `annotations.parquet` (SKOS vocabulary), the ontology JSON, and the populated DDL tables, but holds back the per-column reference codes (column → template-code map). Downstream consumers — Atelier for independent classification, Aegir for downstream lift measurement — see values and vocabulary only; the held-back reference is the scoring key, supplying a pre-training efficacy baseline that cannot be contaminated by the consumer's training pipeline.

## Status

The chain is operational end-to-end as of the v0.3 corpus card. R<sub>C</sub> verbalization coverage is 522 / 540 templates (97%); the residual 18 templates are flagged for follow-up. Catalog construction's offline DeepOnto pass is the only stage with a Java dependency, by deliberate design — runtime consumers carry no JVM. The empirical family-simplicial complex that sanctions cross-family foreign keys is data-driven (`build_family_complex.py`); novel join structures outside the complex are suppressed and audited rather than silently dropped.

## References

- Arp, R., Smith, B., Spear, A. (2015). *Building Ontologies with Basic Formal Ontology.* MIT Press.
- He, Y., Chen, J., Antonyrajah, D., Horrocks, I. (2023). *DeepOnto: A Python package for ontology engineering with deep learning.*
- Miles, A., Bechhofer, S. (2009). *SKOS Simple Knowledge Organization System Reference.* W3C Recommendation.
- Common Core Ontologies (CCO). github.com/CommonCoreOntology/CommonCoreOntologies.
