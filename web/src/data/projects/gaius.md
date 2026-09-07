---
name: "Gaius"
tagline: "A cognition engine and terminal for graph-oriented data domains."
status: "active"
repo: "https://github.com/zndx/gaius"
visibility: "public"
order: 2
summary: "The reference federated engine. Projects high-dimensional embeddings onto a 19×19 grid, runs topological and geometric analysis, and speaks signals-protocol so the rest of the lattice can discover its surfaces, workloads, and data products."
---

Gaius is the reference engine on the [Signals](/projects/signals/)
lattice: capability `cognition`, gRPC `:50051`, engine-first product
logic. The TUI, CLI, and MCP clients are thin; the daemon owns GPUs,
inference, and the knowledge base.

The interface projects high-dimensional embeddings onto a 19×19 grid
and uses topological data analysis — persistent homology and
Ollivier–Ricci curvature — to surface structure in a corpus. The grid
borrows from Go: a finite board where each position has weight.
Orthographic 9×9 mini-grids show local similarity and curvature. Named
after Gaius Plinius Secundus, whose *Naturalis Historia* tried to
assemble the known world into one navigable artifact.

Gaius is also where federated protocol shapes land first, then
promote into [signals-protocol](https://github.com/zndx/signals-protocol)
for every peer: pairwise `ServerQuery` (peers, surfaces, workloads,
products, cognition), TTL `Announce`, `WatchWorkload` for long-held
intents, and queue-share occupancy so Signals can see GPU floors as
mix changes. Article curation, prospects, and Metaflow runs publish
data-product facts into the Signals warehouse on RustFS.

Built in Python. Includes an MCP server for agent tooling. Agent
collaboration uses Rapid Agent Systems Engineering
([RASE](/methods/rase-metamodel/)).
