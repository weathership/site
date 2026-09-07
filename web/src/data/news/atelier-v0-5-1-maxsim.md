---
title: "Atelier v0.5.1 — maxsim cosine and a multiclass SVM head."
date: 2026-05-31
summary: "Atelier rolls forward to a Crammer–Singer multiclass SVM, renames the DST cosine channel to maxsim to match the late-interaction implementation, and consolidates the UAT line into a single calibrated path."
---

Atelier v0.5.1 ships on Cloudera AI with a tighter architecture of
record. The DST cosine channel is renamed to *maxsim* — a
roll-forward without alias — to reflect the late-interaction
implementation that scores a column's values against vocabulary
anchors token-by-token rather than against a single pooled
embedding.

The SVM head moves to a Crammer–Singer multiclass formulation that
learns one joint margin instead of one-vs-rest, and the UAT line is
consolidated to a single calibrated path so the evidence channels
coming out of training are the evidence channels going into the
classifier.

Subsequent commits ground the test fixtures in CCO ExtendedRelation
annotations and frame coverage as a *correctness invariant* — the
Mars Climate Orbiter failure mode applied to ontology grounding.

Read the [Atelier docs](https://zndx.github.io/atelier/) or the
[project page](/projects/atelier/).
