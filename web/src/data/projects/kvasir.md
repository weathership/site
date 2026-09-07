---
name: "Kvasir"
tagline: "Fragment-gated OWL reasoner that lowers certified axioms to SHACL and SQL."
status: "active"
repo: "https://github.com/zndx/kvasir"
visibility: "public"
order: 5
summary: "A Rust engine born of the truce between speed and trust. It refuses constructs outside a pinned fragment, emits machine-checkable refutation proofs, and projects HermiT-certified OWL into SHACL shapes and proof-carrying DDL — the relational half of OWL ⊨ SKOS ⊨ SHACL."
---

Kvasir is the reasoner and relational projector beside
[Ægir](/projects/aegir/)'s SDG ontology. Named for the being born of
the truce between two clans of gods: this engine is fast only where
it can prove it is right.

Battle-tested tableau reasoners implement full SROIQ generality that
the SDG workload does not use. Kvasir occupies a pinned fragment
(EL⁺ / ALCH-class consequence-based saturation, citing Baader–Brandt–Lutz
and Kazakov–Krötzsch–Simančík) and **refuses** anything outside that
fragment — loudly, never by silent weakening. Out-of-fragment inputs
go to the general oracle (HermiT), which still signs published
certificates until Kvasir earns co-signing through a differential-clean
record.

v0 is a **sound refuter, not a certifier**. `Refuted` carries a
machine-checkable proof DAG; `kvasir-check` is a small independent
kernel that re-derives every step (De Bruijn: trust the checker, not
the prover). `NoClashFound` is not a consistency certificate.

## Relational projection

The same facts that saturate also emit the closed-world faces of
[OWL ⊨ SKOS ⊨ SHACL](/methods/convergence-snapshot-derivation/):

- `kvasir shapes` — SHACL Core (Turtle), denormalized per class so a
  plain validator sees what DDL will realize. `sh:targetClass`,
  `sh:datatype`, `sh:minCount` / `sh:maxCount`, `sh:in`, `sh:class`.
- `kvasir ddl` — proof-carrying SQL. Every table, column, and foreign
  key *cites* the axiom lines that justify it. An inconsistent ontology
  refuses emission; the refutation is the reason. Statements self-check
  under `sqlparser` before they leave the process.

Ægir's realize path is merge → HermiT certificate → Kvasir DDL and
shapes. The published [SDG corpora](/projects/sdg-corpora/) schema is
that projection.

Source: [zndx/kvasir](https://github.com/zndx/kvasir). Apache 2.0.
