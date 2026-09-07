---
name: "OTel-projected Metaflow flows in NiFi"
tagline: "Render a Metaflow DAG as a NiFi processor graph and route the flow's OTel spans into per-step processors on that same canvas."
summary: "Project Metaflow flow classes onto the NiFi canvas — one processor per step, edges following self.next() — and stand up a sibling ListenOTLP graph that routes spans emitted at runtime back to per-step LogAttribute processors. The canvas becomes both DAG diagram and live telemetry surface against a shared step-name key."
projects: [gaius]
order: 7
---

## Motivation

Metaflow gives a Python-level DAG and an OpenTelemetry-instrumented runtime, but no canvas to watch a run on. NiFi gives an operator-grade canvas — processors, connections, FlowFiles, RouteOnAttribute filters — but no notion of a Metaflow step. The technique closes the gap in both directions: the Metaflow DAG is rendered as a NiFi process group at design time, and span events from `traced_step`-decorated runs are received back onto a sibling process group at runtime. The two graphs share one key, `metaflow.step_name`, so a span emitted by step `fetch_pdf` lands at a NiFi processor named `fetch_pdf`.

## Approach

The projection is structural, not executional. A parser walks a `FlowSpec` subclass via `inspect` and `ast`, identifies step methods, and extracts `self.next(self.<step>)` calls to recover the DAG edges (`MetaflowParser.parse_flow` in `src/gaius/agents/metaagent/nifi/projector.py`). A topological layout assigns canvas coordinates; each step becomes an `UpdateAttribute` placeholder processor carrying `metaflow.step_name`, `metaflow.flow_name`, `metaflow.is_start/is_end`, and the decorator list as properties. Edges become NiFi connections on the `success` relationship. No FlowFile actually traverses these connections — they are a typed diagram.

The OTel side is a second process group, `Metaflow-Telemetry` (`otel_flow.py`). It centres on a `ListenOTLP` processor (gRPC, port 4319) feeding a `RouteOnAttribute` that fans out on three keys: `metaflow.step_name` for step lifecycle, `event.name` for `heartbeat` / `progress` events, and `progress.phase` for research-flow phases. Each route terminates in a `LogAttribute` processor configured to surface `metaflow.*`, `heartbeat.*`, and `gaius.*` attribute families. An `anomaly_detected` route filters on `heartbeat.anomaly=true` and logs at `warn`. If `ListenOTLP` is unavailable in the target NiFi build, a `GenerateFlowFile` placeholder seeded with simulated attributes is substituted so the rest of the graph remains testable.

The Metaflow side is instrumented by a `TracedFlow` base class plus a `traced_step` decorator (`telemetry/metaflow_trace.py`). Each decorated step opens a span named `metaflow/<flow>/<step>`, attaches the standard attributes, emits `step.started` / `step.completed` / `step.failed` events, and — when `heartbeat_interval > 0` — runs a background thread that emits `heartbeat` events carrying elapsed time, a per-operation baseline mean/stddev, and a Z-score against that baseline. The same key, `metaflow.step_name`, that the parser writes into the canvas processor is the key the span carries; that is the entire correlation contract.

## Implementation status

What exists today is the visualisation side and the telemetry-reception side. Bidirectional control — editing a NiFi processor's properties to influence the corresponding Metaflow step — is design intent, not code. The projector's docstring states the position plainly: "actual execution happens in Metaflow, not NiFi." A separate `create_trigger_metaflow` graph (`trigger_flow.py`) exists for the inverse case of NiFi triggering Metaflow runs, but it is not yet wired into the projected DAG as a parameter-write channel back into the flow class.

The method complements, rather than duplicates, the NiFi system-state model in `src/gaius/rase/ssm/nifi.py`, which models the canvas as a typed graph (SysML v2 `part def ProcessorGroup`) for verification against the live REST API. The OTel projection is the runtime overlay on that same typed graph.

## References

- OpenTelemetry tracing specification, span events and attributes.
- Apache NiFi `ListenOTLP` and `RouteOnAttribute` processors.
- Metaflow `FlowSpec` and `@step` semantics (Berkmann et al., Netflix 2019).
