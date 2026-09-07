---
name: "FMEA-mediated self-remediation with an RCA abstraction ladder"
tagline: "A failure-mode catalog gated by Risk Priority Number, escalating unresolved incidents to a coding agent that climbs a five-order RCA ladder terminating at CP-SAT constraint vocabulary."
summary: "Couples a quantitative FMEA catalog (S × O × D) to an Agent Client Protocol escalation path and a five-order root-cause abstraction ladder. Incidents the runtime cannot close are classified as OPERATIONAL or ARCHITECTURAL; the latter open GitHub issues that link symptom to a violated scheduler constraint."
projects: [gaius]
order: 8
---

## Motivation

Self-healing loops in agentic systems tend to collapse into one of two failure modes: silent retry storms that mask underlying defects, or unbounded escalation that floods maintainers with low-value tickets. The technique implemented in gaius treats remediation as a control loop with a budgeted escalation channel, and treats every escalation as an opportunity to lift a symptom into a structural observation about the scheduler that produced it.

## Formulation

Three components compose the method.

**FMEA catalog.** Each known failure mode is a row in `fmea_catalog` carrying base scores for Severity, Occurrence, and Detection on a 1–10 ordinal scale, after Stamatis (2003) and the AIAG handbook. The Risk Priority Number `RPN = S × O × D` partitions incidents into Tier 0 (procedural restart), Tier 1 (agent-assisted), Tier 2 (approval-gated), and manual. Conservative overrides escalate when `D ≥ 8` or when the recommended action is flagged `DESTRUCTIVE`. The seed migration in `db/migrations/20251222000005_seed_fmea_catalog.sql` covers GPU, vLLM endpoint, model-quality, and emergent-behavior categories; the README enumerates 34 modes across seven categories, while the seed currently materialises a working subset and is expanded with each new detector. Adaptive `S/O/D` updates use an exponential moving average with learning rate `α = 0.2`, persisted to `fmea_outcomes`.

**ACP-escalated remediation.** The `HealthObserver` daemon (`src/gaius/health/observe.py`) polls health checks and attempts in-process remediation up to a retry budget. When the runtime `/health fix` framework cannot resolve an incident — high RPN, repeated failure, or an unknown failure mode — the daemon escalates over the Agent Client Protocol to a coding agent with the gaius MCP server attached. The agent operates under explicit rate limits: `max_issues_per_day = 3`, bounded restart frequency, and a minimum observation window before any code change. All commits land on a development branch (`acp/health-fix`) for human review; commits to trunk are forbidden in the system prompt (`src/gaius/acp/prompts.py`).

**RCA abstraction ladder.** Following successful (or unsuccessful) remediation, the agent enters an RCA workflow mode that classifies the incident across five orders, defined in `src/gaius/health/fmea/models.py` as the `AnalysisOrder` IntEnum:

- Order 0 — Symptom (observable failure)
- Order 1 — Immediate cause (triggering action)
- Order 2 — Structural cause (configuration that permitted it)
- Order 3 — Invariant violation (a CP-SAT constraint in the makespan scheduler)
- Order 4 — Design principle (system-modelling improvement)

The ordering deliberately mirrors the convergence hierarchy of numerical PDE methods (Euler → RK2 → RK4 → BDF → spectral), per the docstring; the analogy is mnemonic, not load-bearing. Order 3 observations resolve against the constraint vocabulary in `src/gaius/acp/constraint_vocab.py`, which names each Google OR-Tools CP-SAT constraint in `engine/scheduling/makespan_scheduler.py` (`GPU_MUTUAL_EXCLUSION`, `CONTIGUITY_REQUIREMENT`, `PRECEDENCE`, `RESOURCE_FEASIBILITY`) with its enforcement mode — point-in-time, continuous, or reactive — and the gap if it is not continuous. The `RCAResult` (`models.py:283`) emits a binary `RCAClassification`: `OPERATIONAL` closes the incident; `ARCHITECTURAL` opens a GitHub issue whose body cites the violated constraint, the file:line, and the proposed fix location.

## Implementation notes

The RCA layer was added on 2026-01-01 (commit `cc935c2`) and is partially in flux: the constraint vocabulary covers four scheduler invariants; coverage of Order 4 design principles is sparse and currently enumerates four named principles (continuous resource allocation, runtime constraint monitoring, topology-aware validation, concurrent-request serialisation). Classification still relies on the agent's judgement against criteria listed in the system prompt rather than a learned model. Audit history is persisted in `healing_events` with dedicated ACP escalation event types.

## References

- Stamatis, D. H. (2003). *Failure Mode and Effect Analysis: FMEA from Theory to Execution.* ASQ Quality Press.
- MIL-STD-1629A (1980). *Procedures for Performing a Failure Mode, Effects and Criticality Analysis.*
- AIAG & VDA (2019). *FMEA Handbook*, 4th edition.
- Perron, L. and Furnon, V. *OR-Tools CP-SAT Solver.* Google.
- Agent Client Protocol — `agentclientprotocol.com`.
