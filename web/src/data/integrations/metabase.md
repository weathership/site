---
name: "Metabase"
tagline: "AGPL analytics peer: dashboards over the Signals warehouse and SDG corpus."
status: "active"
repo: "https://github.com/zndx/agpl-metabase"
docs: "https://www.metabase.com/docs/latest"
visibility: "public"
order: 1
summary: "A dashboard-capability engine on the lattice (gRPC :50451). This AGPL fork stays in its own tree — never vendored into Signals — and registers zndx.engine.v1 so launchers discover its UI the same way they discover Gaius or Hermes."
---

Metabase is the first **dashboard** peer on the weathership lattice.
The product lives in an AGPL checkout (`zndx/agpl-metabase`); Signals
(Apache 2.0) only ships a systemd unit that points `WorkingDirectory`
at that tree. The license boundary is the integration.

`mbengine` presents native `metabase.engine` plus
`zndx.engine.v1.Engine` on **`:50451`**. Capability is `dashboard`.
`Engine/Status.surfaces` advertises the primary UI (lab `:3200`);
launchers never hard-code the URL. Metabot keeps tool execution in
Metabase; inference goes over the engine (ACP → Gaius `thinking` /
Ægir `instruct`) on the Open Inference Protocol path the rest of the
fleet uses.

Bootstrap loads the SDG projection as a Metabase database, scaffolds
the ontology collection tree, and maps field `semantic_type` from
SKOS associations. Questions run against PostgreSQL that already sees
Kudu and Iceberg through [impala_fdw](/projects/signals/). Bring-up
is `just install-systemd --peers metabase --enable` then
`systemctl start signals.target`; `just lattice-ci --require metabase`
is the accept probe.

Upstream: [metabase.com](https://www.metabase.com/). Fork:
[zndx/agpl-metabase](https://github.com/zndx/agpl-metabase).
