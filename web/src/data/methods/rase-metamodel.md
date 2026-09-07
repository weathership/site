---
name: "RASE — Rapid Agentic Systems Engineering"
tagline: "A Python-native MBSE metamodel that couples SysML v2 semantics with Reinforcement Learning with Verifiable Rewards for agent training."
summary: "Python-native MBSE metamodel coupling SysML v2 semantics with RLVR. Four sub-models — OSM (BDD scenarios), SSM (typed system-state graph with declarative constraints), UOM (Set-of-Mark / Trace-of-Mark UI grounding), VM (verifier and reward) — share a URI-based traceability spine, with API ground truth as oracle and UI traces as the training target."
projects: [gaius]
order: 1
---

RASE is a Python-native Model-Based Systems Engineering (MBSE) metamodel that couples SysML v2-aligned vocabulary with Reinforcement Learning with Verifiable Rewards (RLVR, Lambert et al. 2024). It treats the verifier as a first-class engineering artifact — specified, reviewed, tested, and versioned alongside the agent it trains — and structures the agent-training problem as four tightly coupled sub-models with a shared traceability spine.

## Motivation

Training a UI-driving agent against a real enterprise system (the original target domain is Apache NiFi) raises a separation-of-concerns problem: the agent must learn to act on the UI, but the UI is precisely the surface most prone to nondeterminism, partial rendering, and accidental success. Verifying via the UI conflates "the agent reached the goal" with "the UI happened to look right." RLVR (Lambert et al. 2024), in the lineage of process- and outcome-based reward modeling, replaces a learned reward model with a programmatic oracle. RASE specializes RLVR for agent-on-software tasks by codifying which observations are training targets and which are reward sources, and by attaching the MBSE discipline (traceability, requirements, verification cases) that long-lived agent systems otherwise lack.

## Formulation

RASE is organized as four coupled models, implemented under `src/gaius/rase/` in the gaius repository:

- **OSM** (Operational Scenario Model, `rase/osm/`) — BDD `Feature`/`Scenario`/`StepUsage` structures with `@given`/`@when`/`@then` decorators registered against `StepDef` patterns. Scenarios serve as executable specifications and as the source from which `ScenarioRequirement` objects are derived.
- **SSM** (System State Model, `rase/domains/`) — the system under test as a typed graph (`NiFiInstance`, `ProcessorGroup`, `Processor`, `FlowConnection`). Declarative `Constraint[S]` predicates (`ProcessorExists`, `FlowIsEquivalent`, `NoBackpressure`) compose algebraically through `AllOf`, `AnyOf`, `Not`, all `frozen=True` and returning structured `ConstraintResult` values.
- **UOM** (UI Observation Model, `rase/uom/`) — Set-of-Mark (SoM) annotations after Yang et al. 2023, recording numbered `Mark`s with bounding boxes and `UIRole`, and Trace-of-Mark (ToM) sequences of `ActionFrame`s. Agents address elements by mark id rather than pixel coordinates.
- **VM** (Verifier Model, `rase/vm/`) — `Requirement` / `VerificationCase` / `Oracle` triple. `APIVerificationCase` queries the system's REST API for ground truth; `UIVerificationCase` records the agent's browser trace but still checks the *final state* via API. `compute_reward()` converts a `VerificationResult` into a scalar via `BinaryReward` or `GradedReward`, with accuracy defined as `|{c in C : pass(c)}| / |C|`.

The load-bearing invariant is the **oracle/target split**: UI traces are the *training target* (what the agent learns to produce); the oracle reads API ground truth (what the reward is computed from). This isolates reward computation from UI nondeterminism, and is enforced structurally by routing `Oracle.verify()` only through `domains/nifi/oracle.py`.

A `TraceableId` URI scheme (`bdd://features/basic_flows#Scenario:CreateFlow`, `nifi://root/processors/abc123`) and a `DigitalThread` provenance graph (`rase/traceability.py`) link artifacts across the four models, providing the digital-thread coverage SysML v2 calls for (Friedenthal, Moore & Steiner 2014).

## Implementation notes

The metamodel is currently single-domain in production — NiFi — with a `DomainRegistry` and `DomainSpec` boundary intended to accept additional state types. A KB (knowledge-base) domain for ontology-grounded training was added recently (`Add RASE KB domain with ontology-grounded training pipeline`), and ontology constraints for de novo ontology generation followed. Specialized oracles (`CurriculumOracle`, `EnsembleOracle`, `DaemonOracle`) extend the base `NiFiOracle`; the `DaemonOracle` is what the evolution loop consults, ensuring evolution's reward is verifiable rather than learned. The SysML v2 alignment is semantic, not file-level — RASE does not emit KerML/SysML textual notation.

## References

- Friedenthal, Moore & Steiner 2014, *A Practical Guide to SysML* (3rd ed.).
- Lambert et al. 2024, *Tülu 3: Pushing Frontiers in Open Language Model Post-Training.* arXiv:2411.15124. (RLVR formulation.)
- Yang et al. 2023, "Set-of-Mark Prompting Unleashes Extraordinary Visual Grounding in GPT-4V."
