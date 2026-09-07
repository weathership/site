---
name: "Vigil"
tagline: "A global resource-oriented compute fabric for sovereign and high-latency environments."
status: "preview"
repo: "https://github.com/weathership/vigil"
visibility: "public"
order: 7
summary: "Resource-oriented compute fabric in the 1060 NetKernel tradition. Every artifact — raw events, queries, materialized views — is a URI-addressed, content-addressed resource that a kernel resolves to a DataFusion compute endpoint at rest."
---

Vigil is a global resource-oriented compute fabric for sovereign and
high-latency environments. It descends architecturally from
[1060 NetKernel](https://netkernel.io/) and the resource-oriented
computing (ROC) tradition: clients issue requests against URIs that
name *abstract* resources, and a kernel resolves each request to an
endpoint that produces an immutable representation. Plan 9's
*everything is a file* and the 9P namespace are co-influences in the
same family. Built on Rust, RustFS, and Apache DataFusion, Vigil
embeds computation directly inside the storage layer — turning
persistence into active, addressable resources.

## Core design

**Arena-style immutable storage.** Following Venti's model, data is
written once into fixed-size, append-only arenas. Content is addressed
by cryptographic hash, providing inherent integrity and perfect
reproducibility. Arenas can be independently replicated, backed up, or
moved between sites. Because every representation is content-addressed
and immutable, caching becomes an architectural property of the
system rather than a per-component concern — a direct consequence of
applying ROC discipline to physical storage.

**Resource-oriented computing.** Following 1060 NetKernel: data,
queries, transformations, and compute operations all share a single
URI namespace and a single resolution mechanism. The kernel maps a
request URI onto an endpoint; the endpoint produces an immutable
representation. Endpoints compose through pipelines and grammars
rather than direct calls, so adding a new transform — a new query
language, a new materialization, a new analytic — registers an
endpoint instead of re-wiring callers. DataFusion is the workhorse
endpoint family: it runs queries against the resolved inputs directly
at rest, no marshalling layer in between.

**Federated Reach integration.** Vigil securely ingests high-fidelity
events from any number of Reach instances. Single-site deterministic
actor streams are materialized into Vigil as versioned, URI-addressable
resources with full provenance, and become first-class inputs to any
endpoint that can resolve them.

**Cryptographic access control.** Every resource is protected by a
composite-order, decentralized, multi-authority attribute-based
encryption scheme (Datta–Komargodski–Waters, 2022) supporting
fully-adaptive security under dynamic authority corruption. Access
policy travels with the URI, not with the wire.

**CRDT-based federation.** Conflict-free replicated data types,
optimized for append-only physical event streams, enable reliable
replication across high-latency, intermittent, air-gapped, or orbital
deployments. Resource identity (the hash) is invariant across sites,
so a request resolved against any replica returns the same
representation as a request resolved at the origin.

## Position in the architecture

Where Reach provides fast, deterministic local plumbing inside a
single facility, Vigil federates those facilities into one
addressable plane — regardless of distance or disconnection. Resource
identity is the hash; ROC's URI-addressable abstraction sits on
Venti's content-addressable substrate.

The project is in active, early development and will be released
under the Apache 2.0 license.
