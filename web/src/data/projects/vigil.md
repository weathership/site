---
name: "Vigil"
tagline: "A global resource-oriented compute fabric for sovereign and high-latency environments."
status: "preview"
repo: "https://github.com/weathership/vigil"
visibility: "public"
order: 4
summary: "Reimagines distributed storage as a Plan 9-style namespace where every object is both data and a programmable endpoint. Built on Rust, RustFS, and Apache DataFusion."
---

Vigil is a global resource-oriented compute fabric for sovereign and
high-latency environments. It reimagines distributed storage as a
Plan 9-style namespace, where every object is both data and a
programmable endpoint. Built on Rust, RustFS, and Apache DataFusion,
Vigil embeds computation directly inside the storage layer — turning
persistence into active, addressable resources.

## Core design

**Arena-style immutable storage.** Following Venti's model, data is
written once into fixed-size, append-only arenas. Content is addressed
by cryptographic hash, providing inherent integrity and perfect
reproducibility. Arenas can be independently replicated, backed up, or
moved between sites.

**Resource-oriented computing.** Inspired by Plan 9's *everything is a
file* and the 9P resource model: data, queries, and compute operations
are exposed through a single unified namespace. Any object can be
opened, transformed, or executed against — DataFusion runs queries
directly at rest.

**Federated Reach integration.** Vigil securely ingests high-fidelity
events from any number of Reach instances. Single-site deterministic
actor streams are materialized into Vigil as versioned resources with
full provenance.

**Cryptographic access control.** Every resource is protected by a
composite-order, decentralized, multi-authority attribute-based
encryption scheme (Datta–Komargodski–Waters, 2022) supporting
fully-adaptive security under dynamic authority corruption.

**CRDT-based federation.** Conflict-free replicated data types,
optimized for append-only physical event streams, enable reliable
replication across high-latency, intermittent, air-gapped, or orbital
deployments.

## Position in the architecture

Where Reach provides fast, deterministic local plumbing inside a
single facility, Vigil federates those facilities into a coherent,
programmable whole — no matter how far apart or disconnected they may
be. Vigil is the slow, semantically rich, cryptographically hardened
global cortex of the weathership architecture.

The README is in active development; the most current technical
detail lives in the repository.
