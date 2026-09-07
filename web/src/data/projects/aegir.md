---
name: "Aegir"
tagline: "Hierarchical sequence modeling with dynamic chunking."
status: "active"
docs: "https://zndx.github.io/aegir/"
visibility: "public"
order: 4
summary: "The instruct engine on the Signals lattice. A hierarchical sequence model for semantic column annotation and cross-table data-element discovery on relational data."
---

Aegir is the instruct engine on the [Signals](/projects/signals/)
lattice (gRPC `:50151`). It is a hierarchical sequence model for
semantic column annotation and cross-table data-element discovery. It
reads each warehouse column as a sequence and predicts what the column
represents.

The model performs three tasks:

1. **Column type annotation.** Each column is classified into a
   semantic category drawn from the shared governance taxonomy.
2. **Column property annotation.** For each pair of columns, the model
   predicts whether a relationship exists and what kind.
3. **Data element discovery.** Columns across different tables that
   refer to the same real-world entity are grouped together.

The architecture bridges pattern-based detectors (regex, constraint,
fingerprint) with learned sequence models. On the lattice Aegir
consumes Signals governance and the warehouse; its instruct capability
is what Hermes and other peers call for short-form completion.

The source repository is private; published documentation, design
notes, and benchmarks are at the documentation link.
