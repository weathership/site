---
name: "Hermes"
tagline: "Nous Research agent runtime: AgentRTC sessions and weathership plugins."
status: "active"
repo: "https://github.com/zndx/oss-hermes-agent"
docs: "https://hermes-agent.nousresearch.com/"
visibility: "public"
order: 4
summary: "Hermes Agent joins the lattice as capability=agent. Interactive WebRTC (Kyutai STT/TTS) stays on the engine; the GPU claim is a Signals coordination Activity on root.internal.inference.agent-rtc. Plugins under development attach weathership memory and context to that session."
---

[Hermes Agent](https://hermes-agent.nousresearch.com/) is
[Nous Research](https://nousresearch.com/)'s agent runtime. Weathership
pins [zndx/oss-hermes-agent](https://github.com/zndx/oss-hermes-agent)
as a federated peer — `project=hermes`, capability `agent`, gRPC
`:50651`. The primary UI is the dashboard (`:9119`), advertised on
`Engine/Status.surfaces`. `Engine/Announce` seeds the directory so
launchers pull it like any other engine.

## AgentRTC

Interactive sessions keep **media on the engine** (WebRTC + Kyutai
STT/TTS). The federation sees a coordination **Activity**: owner,
horizon, and a claim on `root.internal.inference.agent-rtc` — one GPU,
only while the session runs. Local process → Hermes engine → Signals
`:50551` → Airflow pool `agent_rtc`. YuniKorn admits the Application.
Complete/Status to Gaius (`thinking`) and Ægir (`instruct`) stay on
signals-protocol.

## Plugins

Weathership work on this pin is plugin-shaped, not a fork of the
product:

- **Memory / context-engine** — session memory and compaction that
  talk to Signals services (Atlas `/api/atlas/*`, OpenLineage
  `/api/v1/*`, the warehouse).
- **Lattice join** — Announce, surfaces, workload catalogue
  `interactive.agent_rtc`.
- **Further plugins** under development: tool bridges into Metabase,
  Miro MCP (see [Miro](/integrations/miro/)), and data-product
  publish into the Signals warehouse.

Hermes remains Nous Research's agent. Weathership attaches it to the
scheduler, the warehouse, and the GPU leaf.
