---
title: "sdg-corpora v0.3 publishes to Hugging Face."
date: 2026-06-09
summary: "The first cut of the SDG ontology-grounded synthetic corpus is live as a dataset on Hugging Face — chapters, columns, and SKOS vocabulary as parquet, blind columns separated from the held-back reference key, Apache 2.0."
---

The first cut of the SDG ontology-grounded synthetic corpus is
up on Hugging Face:
[**zndx/sdg-corpora-v0.3**](https://huggingface.co/datasets/zndx/sdg-corpora-v0.3).
Three parquet configurations — `chapters`, `columns`, and
`vocabulary` — over a deterministic relational footprint, all derived
from a BFO 2020 / CCO-grounded ontology rather than from scraped web
text. Every chapter is generated from ontology axioms; every column
is populated from the same axioms via a deterministic relational
schema; every artifact ships with the generator's reasoning trace.

The release is shaped to the workflow [Atelier](/projects/atelier/)
consumes. Blind columns — values plus vocabulary — are public; the
per-column reference codes (which template produced which column)
are held back as the scoring key. The result is independent,
pre-training efficacy feedback on the corpus, and a clean baseline
against which to measure the lift [Aegir](/projects/aegir/)'s
hierarchical sequence model delivers downstream.

Apache 2.0. The source artifacts live in the
[sdg-corpora repository](https://github.com/zndx/sdg-corpora) and as
a submodule of Aegir. A multi-run held-out benchmark is already
landing on trunk for the next release.

we who saw the deep.
