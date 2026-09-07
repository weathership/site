---
name: "Metaflow"
tagline: "Platform production flows: one metadata service, YuniKorn pods, Airflow DAGs."
status: "active"
repo: "https://github.com/weathership/oss-metaflow"
docs: "https://docs.metaflow.org/"
visibility: "public"
order: 2
summary: "Signals-owned Metaflow so every federated engine shares run metadata, a RustFS artifact store, and Kubernetes tasks YuniKorn admits. Airflow is the production clock; Knative Eventing is the trigger plane."
---

[Metaflow](https://docs.metaflow.org/) is the production flow path for
the federation. Signals pins
[weathership/oss-metaflow](https://github.com/weathership/oss-metaflow)
(`rch/devenv`) and runs **one** metadata service (`:30180`) and **one**
S3 datastore on RustFS (`s3://metaflow/metaflow/`). Engines copy
`config/metaflow/platform.json` and opt in; they do not stand up a
second metadata service on a shared host.

Tasks are `@kubernetes` pods. [YuniKorn](https://yunikorn.apache.org/)
admits them onto resource-class leaves. Production schedules are
Airflow DAGs (`airflow create`); events flow through Knative Eventing
(`signals-events/default`) rather than a second workflow SoR. Run
records and artifacts are first-class data-product facts in the
Signals warehouse.

Upstream: [Outerbounds](https://outerbounds.com/). Architecture:
[Platform Metaflow](https://github.com/weathership/signals/blob/trunk/docs/current/src/architecture/metaflow-platform.md)
in the Signals tree.
