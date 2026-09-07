---
title: "Gaius formalizes failure modes: a 34-mode FMEA catalog with RPN scoring."
date: 2025-12-13
summary: "The engine ships with a Failure Modes and Effects catalog — thirty-four modes, Risk Priority Numbers, and trend analysis. Self-healing becomes an observable property of the system rather than a folder of remediation scripts."
---

Gaius grows a Failure Modes and Effects catalog. Thirty-four modes
spanning the storage backend, the inference path, the TUI grid, and
the agent loop, each one scored with a Risk Priority Number and
tracked for trend. Self-healing stops being a folder of remediation
scripts and becomes a structured, classifiable property of the
system: every incident lands in the catalog with a severity, an
occurrence rate, and a detection score, and the catalog drives trend
analysis over time.

MinIO is promoted from optional to core. Module READMEs are filled
out across the codebase so each subsystem documents its own failure
surface alongside its behavior.

The discipline is borrowed straight from manufacturing engineering.
The thing it disciplines is an agent loop.
