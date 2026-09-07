---
title: "RASE — verifiable agent training as MBSE plus RLVR."
date: 2025-12-20
summary: "Rapid Agentic Systems Engineering lands as a four-model metamodel — Operational Scenario, System State, UI Observation, and Verifier — couples Model-Based Systems Engineering vocabulary with Reinforcement Learning with Verifiable Rewards. The digital thread from requirement to verdict, made explicit."
---

Gaius introduces RASE — *Rapid Agentic Systems Engineering* — a
Python-native metamodel with SysML v2 semantics. Four coupled
sub-models hold the pieces:

- **OSM** — Operational Scenario Model. BDD scenarios as executable
  specifications, given/when/then registered against step
  decorators.
- **SSM** — System State Model. NiFi (and adjacent systems) as a
  typed graph with declarative constraints over its structure.
- **UOM** — UI Observation Model. Set-of-Mark and Trace-of-Mark for
  grounding agent actions in the rendered UI.
- **VM** — Verifier Model. The RLVR oracle and reward computation,
  with the load-bearing constraint that the oracle uses ground
  truth — never UI observations.

UI traces are the training target; verification provides the reward
signal. The discipline behind self-improving agents is not chains
of prompts — it is a digital thread from requirement to verdict.
RASE makes the thread explicit.
