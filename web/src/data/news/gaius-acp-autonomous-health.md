---
title: "Autonomous health maintenance: Gaius escalates over ACP for code-level remediation."
date: 2025-12-25
summary: "A HealthObserver daemon detects incidents that runtime fixes cannot resolve and escalates to a coding agent over the Agent Client Protocol. The agent opens a GitHub issue, implements a FixStrategy, and registers a heuristic — all to a review branch and rate-limited."
---

Gaius closes the inner loop on self-remediation. The HealthObserver
daemon — running alongside the engine — watches for incidents that
the `/health fix` path cannot resolve at runtime. When one appears,
it escalates over the Agent Client Protocol to a coding agent with
the Gaius MCP server attached. The agent opens a GitHub issue,
implements a FixStrategy, and registers a heuristic in the
knowledge base.

The autonomy is real — agents reading their own failure surface and
proposing code-level repairs against the framework that hosts them
— but it is bounded. All changes land on a review branch. Issue
creation is rate-limited to three per twenty-four hours. The rate
limit is a circuit-breaker, not a comment.

A self-improving agent that earns the name is one whose improvements
can be reviewed.
