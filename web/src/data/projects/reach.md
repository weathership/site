---
name: "Reach"
tagline: "Event-sourced actor system for distributed manufacturing."
status: "active"
repo: "https://github.com/weathership/reach"
visibility: "public"
order: 8
summary: "Process-separated architecture using Apache Kudu for event persistence and Aeron IPC for sub-microsecond inter-process messaging."
---

Reach is an event-sourced actor system for Industry 4.0 manufacturing —
a process-separated architecture using the C++ Actor Framework, Apache
Kudu for event persistence, and Aeron IPC for sub-microsecond
inter-process messaging.

The architecture validates a specific claim: that fault isolation and
ultra-low-latency IPC together outperform monolithic integration at
manufacturing scale. Phase-3 testing showed that direct integration
between the actor framework and the storage layer caused segmentation
faults due to thread-local storage conflicts; process separation
eliminated the failure mode and added 0.25 µs of round-trip latency,
which is irrelevant at the timescales of physical machinery.

Current numbers, reproducible on commodity hardware:

- **Aeron round-trip latency:** ≈ 0.25 µs
- **Recovery throughput:** 4,347 entities / second
- **100 equipment recovery:** 23 ms total
- **Telemetry capacity:** 56,000 events / second across 10,000
  simulated machines

The name comes from the nautical sense — a stretch of navigable water
between two points — and the everyday sense of extending across
distance. Both fit: the system extends a coherent event log across
machines, processes, and sites without losing the timing guarantees
each layer needs.
