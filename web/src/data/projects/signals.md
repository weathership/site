---
name: "Signals"
tagline: "Federated infrastructure for engines, agents, and data products."
status: "active"
repo: "https://github.com/weathership/signals"
visibility: "public"
order: 1
summary: "The weathership foundation: a shared protocol, scheduler, warehouse, and governance record. Independent engines attach over gRPC; workloads land in YuniKorn, Airflow, and Metaflow; data lives in Kudu and Iceberg, queried through Impala and PostgreSQL."
---

Signals is the hub of the weathership federation. [Nautilus](/projects/nautilus/)
supervises each attached stack. Sibling engines —
[Gaius](/projects/gaius/), [Ægir](/projects/aegir/),
[Atelier](/projects/atelier/), and [Hermes Agent](https://github.com/zndx/oss-hermes-agent)
— keep their own products, native gRPC, and models. They meet here: one
protocol, one scheduler, one warehouse, one governance record.

The shared wire is
[signals-protocol](https://github.com/zndx/signals-protocol). Each
engine registers `zndx.engine.v1.Engine` beside its native service, so
a single stub reaches any peer. Capabilities travel on that wire
(`scheduler`, `cognition`, `instruct`, `referee`, `agent`); the serving
engine chooses the model and reports what it ran. Discovery is
`Engine/Status.surfaces` and pairwise `ServerQuery`. A peer Announces
itself; launchers fill in.

## Workloads

[Apache YuniKorn](https://yunikorn.apache.org/) admits Applications.
The queue path is the resource class; project is identity, not a parent
queue. Interactive agent sessions claim
`root.internal.inference.agent-rtc` — one GPU, only while the session
runs. Hermes keeps WebRTC and Kyutai STT on the engine; the claim,
lifetime, and observation go over the protocol.

[Apache Airflow](https://airflow.apache.org/) is the clock for intent
that has a lifetime. A coordination Activity — owner, reason, horizon,
GPU claims — is a Signals-owned DAG run. Local processes talk to their
engine; engines talk to Signals; only Signals talks to Airflow.

[Metaflow](https://docs.metaflow.org/) is the production flow path: one
metadata service, artifacts on RustFS, tasks as Kubernetes pods YuniKorn
admits, events through Knative Eventing.

## Transparent hierarchical storage

Percy (2019) described the model: Kudu for hot mutable rows, Impala for
SQL, cooler data as files. That is the warehouse.

| Tier | Store | Role |
|------|--------|------|
| Hot | Apache Kudu | Upserts, weekly range partitions |
| Warm | Apache Iceberg on RustFS | Settled weeks (Parquet and HDF5) |
| SQL | Impala views | `details`, `tx`, `hx_exchange`, `hx_reasoning` |
| Applications | PostgreSQL + [impala_fdw](https://github.com/weathership/impala_fdw) | One Kerberos principal into the data plane |

Peers publish facts (UUIDv7 transaction ids, product names, object
URIs) into this warehouse. They do not stand up a second catalog.
Apache Atlas (AGE on PostgreSQL 16) is the lineage and classification
record; Ranger consumes those tags.

The in-tree `sigint` pipeline still classifies columns into the SIGDG
taxonomy — Dempster–Shafer fusion, SAGE-measured features — and writes
the Atlas tags the rest of the federation already consumes.

Source: [weathership/signals](https://github.com/weathership/signals).
Control plane UI on a running stack: port 9889.
