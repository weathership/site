---
title: "Signals: DST evidence fusion expands to five sources."
date: 2026-03-26
summary: "A short-text SVM head joins cosine, gradient boosting, regex, and name matching as the fifth independent source in the Dempster–Shafer pipeline. A bootstrap agent now learns the schema before classification begins."
---

The Signals classification pipeline now combines five evidence
sources. The new short-text SVM head reads character n-grams —
sparse lexical features with no dependency on the
sentence-transformer embedding — and directly addresses the
source-independence concern in Dempster's rule.

The release also lands a bootstrap agent that performs table-aware
batching, data-element discovery, and schema introspection before
classification begins, so the downstream pipeline isn't starting
cold. SHAP explanations expose which slice of the 992-dimensional
feature vector mattered for each decision, and the synthetic-training
path now ships with a `--self-train` mode that reproduces LLM
annotations at 99.4% accuracy.

The 74-scenario BDD framework passes in air-gap mode with zero
external network calls. See the [Signals project page](/projects/signals/).
