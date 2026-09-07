---
name: "Atelier"
tagline: "Agentic classification workbench for column-level governance."
status: "active"
repo: "https://github.com/zndx/atelier"
docs: "https://zndx.github.io/atelier/"
visibility: "public"
order: 6
summary: "The referee engine on the Signals lattice. An interactive workbench that fuses six evidence sources through Dempster–Shafer belief functions to produce uncertainty-quantified column classifications."
---

Atelier is the referee engine on the [Signals](/projects/signals/)
lattice (gRPC `:50251`). It is an agentic classification workbench: a
gRPC core and a React canvas where analysts steer classification
across thousands of columns.

The pipeline combines six evidence sources — embedding similarity,
gradient-boosted prediction, regex pattern detection, column-name
matching, short-text SVM, and an LLM convergence agent — through
Dempster–Shafer belief fusion. Each source contributes a mass function
over a restricted frame of discernment; combination yields a belief
interval at every node of the hierarchy. Interval width is epistemic
uncertainty made legible.

A convergence agent targets the columns where the belief gap is
widest, gathers additional context, and proposes a reclassification.
Embeddings are explored on a 2-D atlas — a
[derivative of Apple's embedding-atlas](https://github.com/apple/embedding-atlas)
modified for this workflow.

Atelier classifies into the shared SKOS vocabulary published by
[SDG corpora](/projects/sdg-corpora/). It is the short-iteration
counterpart to [Ægir](/projects/aegir/): per-column, agent-assisted
convergence, with outcomes stored for Signals governance.
