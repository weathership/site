---
name: "OWL ⊨ SKOS ⊨ SHACL derivation chain"
tagline: "A BFO/CCO-grounded OWL ontology entails its SKOS vocabulary and SHACL shapes; the relational schema is a projection of that certified artifact, versioned so each commit is one coherent snapshot."
summary: "Ontology-grounded derivation in which HermiT-certified OWL is the source of truth, SKOS and SHACL are entailed views of the same axioms, and loadable SQL is lowered from the certified ontology. Every git commit is a content-hashed snapshot of the whole chain, enabling blind-release evaluation."
projects: [aegir, sdg-corpora]
order: 4
---

## Motivation

Evaluating column classification or ontology-grounded pretraining requires the type system, the constraints that exercise it, the relational schema, and the populated data to be mutually consistent. When those are versioned independently — a glossary in one place, DDL in another, corpus regenerated ad hoc — drift silently contaminates downstream measurement. The derivation chain treats them as one function of a versioned OWL artifact, so a commit hash identifies a coherent (ontology, vocabulary, shapes, schema, corpus) tuple.

## Formulation

Let `Ω` be a realized OWL 2 ontology, BFO 2020 / CCO-grounded and HermiT-certified [Motik, Patel-Schneider & Grau 2012; Arp, Smith & Spear 2015]. The published faces are *entailed*, never independently authored:

`Ω ⊨ V(Ω) ⊨ S(Ω)  →  R(Ω)  →  X(Ω, V, R)`

- `V(Ω)` is the SKOS ConceptScheme [Miles & Bechhofer 2009]: every concept's defining class exists in `Ω`. `skos:prefLabel` / `altLabel` / `definition` / `scopeNote` / `example` are annotation properties on that class — retrieval text, not a parallel taxonomy.
- `S(Ω)` is the SHACL Core shapes graph [Knublauch & Kontokostas 2017]. Every `sh:targetClass` names a realized OWL class; `some` restrictions become `sh:minCount ≥ 1`; `exactly n` becomes `min = max = n`; fillers become `sh:class`. Value enumerations (`sh:in`) correspond to SKOS labels — that is `SKOS ⊨ SHACL`.
- `R(Ω)` is the **relational projection**: loadable SQL (tables, keys, foreign keys) lowered from the certified OWL by kvasir, with a plan that cites class and property IRIs per relation. The schema is a view of `Ω`, not a catalog of generation templates.
- `X(Ω, V, R)` is the populated corpus — textbook chapters and rows that conform to `R` with column labels drawn from `V`.

Aegir's `scripts/check_triad_entailment.py` measures the three entailments mechanically (OWL ⊨ SKOS, OWL ⊨ SHACL, SKOS ⊨ SHACL). Realization (`scripts/realize_sdg.py`) is merge → HermiT certificate → DDL → `shapes.ttl`.

## Implementation notes

The chain lives in Ægir and publishes through the `corpora/` submodule ([sdg-corpora](/projects/sdg-corpora/)). Two properties make it operational. First, **content-hashed run identity**: identical certified inputs produce bit-identical DDL and shapes in a directory named by their fingerprint. Second, **blind release**: a tagged SHARE-tier package includes ontology, SKOS, SHACL, and populated tables, but holds back the per-column class reference. Downstream classifiers — Atelier for independent scoring, Ægir for lift — see values and vocabulary only.

Hand-authored axiom families and a fixed template catalog were an early scaffold. They are retired: the live ontology is content-derived from input passages, membrane-gated (parse → HermiT → OntoClean), and projected outward. Counts of classes, concepts, and tables are properties of a given snapshot, not the method.

## Status

The triad and the relational lowering are the published contract. Atlas and Qdrant are views of the same OWL, rebuilt from it. Cross-entity foreign keys are earned from content, not name-matched from a family table.

## References

- Motik, B., Patel-Schneider, P. F., Grau, B. C. (2012). *OWL 2 Web Ontology Language Direct Semantics.* W3C Recommendation.
- Arp, R., Smith, B., Spear, A. (2015). *Building Ontologies with Basic Formal Ontology.* MIT Press.
- Miles, A., Bechhofer, S. (2009). *SKOS Simple Knowledge Organization System Reference.* W3C Recommendation.
- Knublauch, H., Kontokostas, D. (2017). *Shapes Constraint Language (SHACL).* W3C Recommendation.
- Common Core Ontologies (CCO). github.com/CommonCoreOntology/CommonCoreOntologies.
