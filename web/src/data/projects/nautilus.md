---
name: "Nautilus"
tagline: "Deterministic supervisor for federated engine stacks."
status: "active"
repo: "https://github.com/weathership/nautilus"
visibility: "public"
order: 2
summary: "An agent-free Rust supervisor. Each project ships a zndx.supervision.v1 instance; Nautilus loads that tree, observes every process, stamps positions, keeps a Brier-scored ledger, and escalates what determinism cannot settle to the engine's Overwatch."
---

Nautilus is the supervisor that sits *beside* a federated engine, not
inside it. It is deterministic and agent-free: no model, no agent
loop. Triggers are a pure function of a snapshot, unit-testable
without I/O. Judgment stays in the engine as **Overwatch** (ACP plus
an independent model). Nautilus reaches Overwatch only through an
escalation; it scores the answer like any other observer.

The grammar is [`zndx.supervision.v1`](https://github.com/zndx/signals-protocol)
in [signals-protocol](https://github.com/zndx/signals-protocol). The
protocol names no project. Each engine ships an *instance* —
`config/supervision/<project>.textproto` — that declares the
supervision tree, restart strategies, cadences, phase gates, horizons,
resource intents, and objectives. Gaius is the reference instance;
Hermes, Signals, Ægir, and Atelier ship their own.

## What it does

- **Supervision tree.** Every process names a parent and a restart
  strategy on its children (`ONE_FOR_ONE`, `ONE_FOR_ALL`,
  `REST_FOR_ONE`, or `NONE` = observe and score). Warmup is grace;
  silence past a cadence is `MISSING`; progress beats wall-clock.
  Recycle budgets trip a breaker that is surfaced, never silently
  retried.
- **Phase gates.** A machine decomposes a flow into phases closed by
  explicit gates. Forecasts resolve against *that* phase's gate within
  *that* phase's horizon, so a download succeeding is not Brier-penalized
  for a later serving failure.
- **Positions.** Processes that declare `reports_positions` call
  `ReportPosition` at each gate. Adapters fill Metaflow steps, Airflow
  task instances, and pg_cron runs as observed positions. A process that
  promised to report and never does is `UNSUPERVISED`.
- **Resource intents.** Occupancy, floor, and priority are declared on
  a phase. Nautilus emits the intent on entry (and a zero floor on
  exit) so [Signals](/projects/signals/) can merge guarantee floors
  before the GPU token is already needed.
- **Ledger.** Forecasts, resolutions, transitions, and objective
  verifications go first to a local write-ahead buffer, then to the
  project's PostgreSQL. The supervised database being down is when the
  supervisor's memory matters most.
- **Federation.** One binary; one instance and one ledger per project.
  Peers watch peers over `Engine/Status`. No engine writes another
  engine's ledger.

Nautilus does not schedule work (YuniKorn and `zndx.scheduler.v1` do)
and does not host models. It observes through each engine's
`zndx.engine.v1` face, so a distributed deployment can expose one
protocol port per host and nothing more.

Source: [weathership/nautilus](https://github.com/weathership/nautilus).
Spec: [nautilus_supervision.md](https://github.com/zndx/signals-protocol/blob/trunk/specification/operations/nautilus_supervision.md).
