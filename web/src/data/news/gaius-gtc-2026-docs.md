---
title: "Gaius opens its public documentation."
date: 2026-03-15
summary: "The Gaius mdbook is live, with deepened architecture notes targeting an external audience and a CI/CD path that keeps the published docs in step with trunk."
---

Gaius is the terminal interface that walks high-dimensional embeddings
as a 19×19 board. With this release the architecture pages get the
depth an external reader needs: the gRPC engine, the rendering
pipeline that projects embeddings onto an orthographic grid, the
RASE metamodel that lets agents annotate the board cooperatively,
and the publish path that gates card promotion on enrichment
completeness.

Mathematical detail surfaces alongside the prose. The Agent Client
Protocol — *ACP*, as in the protocol, not the generic acronym — is
named throughout, and the integration story is told against Mistral
Vibe rather than a single editor.

The docs build from trunk on every push. Browse the [project
page](/projects/gaius/) or jump straight into the
[repository](https://github.com/zndx/gaius).
