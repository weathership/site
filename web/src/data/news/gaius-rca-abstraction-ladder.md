---
title: "New Year's Day: Gaius's first end-to-end autonomous remediation, and the RCA framework it justified."
date: 2026-01-01
summary: "Between 04:11 and 04:45 UTC the HealthObserver daemon detects GPU 1 memory exhaustion at 98.4%, escalates to a coding agent over the Agent Client Protocol after three failed runtime attempts, and the agent diagnoses and resolves a GPU allocation conflict between two model endpoints using the Gaius MCP toolchain. A cascading second incident follows the same pattern; the scheduler handles it. The RCA abstraction ladder is built the same day to formalize how observations like these connect to scheduler constraint gaps."
---

Between 04:11 and 04:45 UTC on New Year's Day, Gaius autonomously
resolves the first end-to-end self-remediation incident on its
production workstation.

**Detection.** HealthObserver flags GPU 1 at 98.4% memory used — 23.6
GB of 24 GB. The fingerprint is `GPU_001:gpu_1_health`,
`RPN = S:5 × O:5 × D:5 = 125`, Tier-2 escalation, three runtime
remediation attempts already failed.

**Escalation.** The daemon issues an Agent Client Protocol call to a
coding agent with the Gaius MCP server attached. The agent has access
to `gpu_status`, `health_check`, and orchestrator commands over gRPC.

**Diagnosis.** Within minutes the agent identifies the root cause:
two endpoints are claiming GPU 1. `cap_reasoning` (Qwen/QwQ-32B on
GPUs `[1, 2, 3, 4]`) loaded first and consumed the bulk of GPU 1's
memory; `orchestrator` (nvidia/Orchestrator-8B on GPUs `[0, 1]`)
cannot start because its planning-time allocation conflicts with the
runtime state.

**Resolution.** The agent runs `gaius-cli --cmd "/gpu stop
orchestrator"`. The scheduler automatically rebalances. GPU 1 drops
from 98.4% to 0.01%; all endpoints return to healthy.

**Cascade.** Immediately, a second incident appears —
`VLLM_001:coding`, same GPU-1 contention pattern, now affecting the
`coding` endpoint. The scheduler handles it without further
escalation: stops `cap_reasoning` to free GPUs `[1, 2, 3, 4]`, stops
the conflicting endpoints, clears GPU memory across the board, and
restarts with non-overlapping allocations. By 04:45 UTC every
endpoint is `HEALTHY`.

The incident exposes architectural gaps that map directly onto
CP-SAT constraints in `makespan_scheduler.py`: `GPU_MUTUAL_EXCLUSION`
is enforced at planning time but not at runtime;
`CONTIGUITY_REQUIREMENT` for tensor-parallel endpoints is not
checked; precedence rules — large models should claim GPUs before
small ones — are absent. These are exactly the rows the RCA
framework, landing the same day in commit `cc935c2d`, was built to
record: incidents that lift a symptom from *the agent fixed it* to
*the scheduler has a structural gap, and here is the constraint that
should have prevented it*.

The framework is the deliverable; the GPU-1 incident is the artifact
that made it necessary. Applied retrospectively to the event, the
abstraction ladder reads:

- **Order 0** — Symptom: GPU 1 at 98.4% memory.
- **Order 1** — Immediate cause: `cap_reasoning` and `orchestrator`
  both claim GPU 1.
- **Order 2** — Structural cause: startup ordering allowed the
  smaller endpoint to enter a starting state while the larger one
  already held the resource.
- **Order 3** — Invariant violation: `GPU_MUTUAL_EXCLUSION` is a
  planning-time constraint, not a continuous one; runtime validation
  does not exist.
- **Order 4** — Design principle: the scheduler needs a
  continuous-time enforcement primitive and a precedence rule for
  resource-claim ordering.

Every incident received from this point forward receives the same
classification — `OPERATIONAL` (a transient; close the incident) or
`ARCHITECTURAL` (open a GitHub issue against the framework itself,
citing the violated constraint and the file:line where the fix
belongs).

Full session details — incident contexts, GPU memory tables before
and after, every MCP command and endpoint state transition — are
captured in the Gaius appendix:
[`acp-incident-2026-01-01.md`](https://github.com/zndx/gaius/blob/trunk/docs/current/src/appendix/acp-incident-2026-01-01.md).
