---
name: "Gaius"
tagline: "A terminal interface for navigating graph-oriented data domains."
status: "active"
repo: "https://github.com/zndx/gaius"
visibility: "public"
order: 2
summary: "Projects high-dimensional embeddings onto a 19×19 grid. Combines a Go-board metaphor with topological data analysis to surface structural patterns in knowledge bases and document collections."
---

Gaius is a terminal interface for navigating graph-oriented data
domains. It renders knowledge bases and document collections as spatial
layouts, projecting high-dimensional embeddings onto a 19×19 grid and
using topological data analysis to identify structural patterns.

The interface is named after Gaius Plinius Secundus — Pliny the Elder —
whose *Naturalis Historia* attempted to assemble the known world into a
single navigable artifact. The 19×19 grid borrows from Go: an
intentionally constrained surface where each move has weight because the
canvas is finite. Combined with orthographic projection from
high-dimensional embeddings, the grid becomes a way to walk a corpus
the way a player walks a board.

Multi-agent analysis runs alongside the interface, surfacing structural
properties — clusters, gradients, voids — that are otherwise invisible
in the raw embedding space. The agents annotate the grid; the human
navigates it.

Built in Python with a TUI front-end. Includes an MCP server for
[Claude Code](https://docs.claude.com/en/docs/claude-code) integration.
Active development is focused on agent collaboration through
Rapid Agent Systems Engineering (RASE).
