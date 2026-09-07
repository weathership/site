---
title: "Signals is the weathership foundation."
date: 2026-09-07
summary: "The public description of Signals matches the lattice: protocol, scheduler, warehouse, and agent-rtc workloads that sibling engines attach to."
---

Signals is no longer usefully described as a column-classification
pipeline with a query stack beside it. It is the hub the rest of
weathership attaches to.

Independent engines — Gaius, Ægir, Atelier, Hermes Agent — keep their
own products, native gRPC, and models. They register
`zndx.engine.v1.Engine` beside that native service and speak
[signals-protocol](https://github.com/zndx/signals-protocol). Signals
pins the protocol, runs the scheduler (`zndx.scheduler.v1`, YuniKorn
as the lab backend), holds the warehouse, and is the only process that
talks to Airflow.

Workloads are Applications YuniKorn admits. Resource class is the
queue leaf; project is identity. Interactive sessions claim
`root.internal.inference.agent-rtc` for one GPU, only while they run.
Hermes keeps WebRTC on the engine; the claim is a coordination
Activity Signals materialises as an Airflow DAG. Metaflow is the
production flow path: one metadata service, artifacts on RustFS, events
through Knative Eventing.

Storage is transparent hierarchical storage in Percy's sense: Kudu for
hot rows, Iceberg on RustFS for settled weeks, Impala views across
both, PostgreSQL applications through
[impala_fdw](https://github.com/weathership/impala_fdw). Atlas is the
lineage record. The in-tree `sigint` classifier still writes tags
there; it is one consumer of that record, not the definition of the
project.

Source and operator notes:
[github.com/weathership/signals](https://github.com/weathership/signals).
Project page: [Signals](/projects/signals/).
