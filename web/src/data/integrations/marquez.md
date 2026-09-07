---
name: "Marquez"
tagline: "OpenLineage UI on Atlas: the REST contract, not a second catalog."
status: "active"
repo: "https://github.com/zndx/oss-marquez"
docs: "https://marquezproject.github.io/marquez/"
visibility: "public"
order: 3
summary: "Marquez-web is the human OpenLineage surface for Signals. It proxies /api/v1 and /api/v2beta to the Atlas fork; lineage events, jobs, datasets, and graphs live in AGE — the same store Ranger and sigint already use."
---

[Marquez](https://marquezproject.github.io/marquez/) is the OpenLineage
reference UI. In weathership it is **UI plus contract harness**, not a
second system of record.

The [Atlas fork](https://github.com/rch/asf-atlas) implements the
complete Marquez REST surface on the same process as governance
(`/api/atlas/*` unchanged):

- `POST /api/v1/lineage` — OpenLineage RunEvent ingest
- `/api/v1/{namespaces,jobs,runs,datasets,events,lineage,column-lineage,tags,search,stats,sources}`
- `/api/v2beta/search/{jobs,datasets}`

Marquez-web binds Atlas HTTP + 1 (lab `:21011` → Atlas `:21010`) and
proxies those prefixes. Jobs, datasets, events, search, stats, and
lineage graphs render from AGE. Empty collections are valid; a 404 on
a path the UI calls is not. That is how we know the OpenLineage API is
complete.

Producers (Airflow, Metaflow, Flink, Gaius, `sigint`) talk only to
Signals. See [OpenLineage on Atlas](/projects/signals/) on the Signals
project page. Pin: [zndx/oss-marquez](https://github.com/zndx/oss-marquez).
