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
URIs) into this warehouse. Atlas is the lineage and classification
record; Ranger consumes those tags.

## OpenLineage on Atlas

Governance and runtime lineage live in one process: an
[Apache Atlas](https://atlas.apache.org/) fork
([rch/asf-atlas](https://github.com/rch/asf-atlas)) with Apache AGE
on PostgreSQL 16. Existing Atlas clients keep `/api/atlas/*`. The
OpenLineage extension adds the **complete Marquez REST surface** on
the same host:

- `POST /api/v1/lineage` — OpenLineage RunEvent ingest
- `/api/v1/{namespaces,jobs,runs,datasets,events,lineage,column-lineage,tags,search,stats,sources}`
- `/api/v2beta/search/{jobs,datasets}`

Job, run, dataset, and facet records sit in the AGE graph plus
relational lineage tables (`lineage_events`, `lineage_namespaces`,
`lineage_tags`, `lineage_sources`). Producers — Airflow, Metaflow,
Flink, Gaius, `sigint` — talk only to Signals.

[Marquez](https://marquezproject.github.io/marquez/) **web** is the
OpenLineage UI for that API. It binds Atlas HTTP + 1 (lab:
`:21011` → `:21010`) and proxies `/api/v1` and `/api/v2beta` to
Atlas. Jobs, datasets, events, search, stats, and lineage graphs
render from the Atlas store. The UI is the acceptance harness that
the REST contract is complete: every path Marquez-web calls returns
Marquez-shaped JSON.

## Atlas through PostgreSQL (impala_fdw)

Heavy Atlas and OpenLineage analytics scale through
[impala_fdw](https://github.com/weathership/impala_fdw) on the same
PostgreSQL that hosts AGE — one Kerberos principal into graph
metadata and warehouse rows.

Typed Atlas projections land on Kudu (`atlas.entity_flat`,
`entity_by_qn`, dual adjacency for edges, classifications) via an
idempotent outbox. Postgres foreign tables
(`atlas_entity_flat`, …) default to `access=auto`: closed shapes
use `kudu_scan` (`libkudu_client`); Iceberg cold tiers and Impala
`UNION ALL` views of hot Kudu ∪ warm Iceberg use `impala_sql` over
HS2. Agents and AGE queries join lineage in Postgres to Kudu and
Iceberg without a second catalog.

```bash
just impala-fdw-build && just impala-fdw-install
just atlas-kudu-projections-seed
psql -p 5455 -d signals
```

The in-tree `sigint` pipeline classifies columns into the SIGDG
taxonomy — Dempster–Shafer fusion, SAGE-measured features — and
writes the Atlas tags the rest of the federation already consumes.

Source: [weathership/signals](https://github.com/weathership/signals).
Control plane UI on a running stack: port 9889.
