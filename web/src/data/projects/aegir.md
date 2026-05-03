---
name: "Aegir"
tagline: "Hierarchical sequence modeling with dynamic chunking."
status: "active"
docs: "https://zndx.github.io/aegir/"
visibility: "public"
order: 1
summary: "A hierarchical sequence model for semantic column annotation and cross-table data-element discovery on relational data."
---

Aegir is a hierarchical sequence model for semantic column annotation
and cross-table data-element discovery. It addresses an enterprise data
governance problem — warehouse columns whose meanings have drifted past
recognition — by reading each column as a sequence and predicting what
the column represents.

The model performs three tasks:

1. **Column type annotation.** Each column is classified into a semantic
   category drawn from the governance taxonomy.
2. **Column property annotation.** For each pair of columns, the model
   predicts whether a relationship exists and what kind.
3. **Data element discovery.** Columns across different tables that
   refer to the same real-world entity are grouped together — the
   structural artifact that lets governance, privacy, and integration
   workflows treat the warehouse as a coherent surface.

The architecture bridges pattern-based detection methods (regex,
constraint, fingerprint) with learned sequence models. Aegir does not
replace evidence-fusion pipelines that already exist in enterprise
governance stacks; it integrates with them, providing a learned signal
alongside the rule-based ones.

The source repository is private; published documentation, technical
design notes, and benchmarks are available at the docs link below.
