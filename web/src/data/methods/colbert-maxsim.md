---
name: "ColBERT MaxSim late interaction"
tagline: "Classification by ColBERT MaxSim retrieval against an iteratively-optimized augmented controlled vocabulary, with per-text-feature analysis driving discriminative power."
summary: "Each ontology code is represented by an augmented definitional text — label, LLM-generated description, prototype values, name hints, value patterns, parent path, mnemonic — encoded once into a ColBERTv2 multi-vector and stored in Qdrant. Target items are classified by MaxSim retrieval against the vocabulary collection; a reflective evolution loop iteratively refines the vocabulary representation using per-feature attribution on both sides to drive discriminative power."
projects: [atelier]
order: 3
---

## Motivation

Classification-by-retrieval against a *controlled vocabulary* is attractive when the codes are an ontology: every code carries definitional metadata — label, description, prototypes, parent path, mnemonic — that a flat ML classifier discards. The discriminative responsibility then shifts to the vocabulary representation. If each code is reduced to a single pooled embedding, fine distinctions between sibling codes collapse before retrieval sees them; no amount of downstream weighting recovers signal already lost in the pool.

ColBERT MaxSim (Khattab & Zaharia 2020) preserves the token-level surface so each token of the augmented vocabulary text retains its weight in the retrieval score. ColBERT and Qdrant are the substrate. The methodological contribution lives in how the vocabulary representation is composed, how the target representation is curated, and how the vocabulary side is iteratively optimized for discriminative power.

## Approach

### Augmented vocabulary representation

Each ontology code is represented not by a bare label but by an *augmented definitional text* composed in `enrichment.qdrant_writer.compose_annotation_text()`: the canonical label, an LLM-generated description, prototype values, name hints, value-pattern descriptors, the ontology parent path, and the abbreviation, joined with `|`. The composition is deliberate — every slice is one a downstream MaxSim query token might align against. Anti-examples are excluded from the composition by design: they add embedding-space noise without improving discrimination, a representation choice that surfaced from trace-driven confusion analysis on earlier collections.

### Curated target representation

`ColumnFeatures.to_embedding_text()` composes the target item — for atelier's column-classification application, a database column — into a parallel single-string representation: name, type, sample values, distributional features, pattern signals, sibling-column context, and value-description summaries. The target side carries twelve ablatable features so per-feature attribution can decompose classification mass to specific feature slices rather than treating the embedding as an opaque whole.

### Classification by MaxSim retrieval

Both sides are encoded once through the same canonical ColBERTv2 encoder; classification is one MaxSim retrieval per target. Let `Q = {q_1, ..., q_n}` and `D = {d_1, ..., d_m}` be the per-token embeddings of the target and vocabulary texts respectively, each L2-normalized to unit length. The score (Khattab & Zaharia 2020, Eq. 1) is

```
S(Q, D) = Σ_{q ∈ Q} max_{d ∈ D} (q · d)
```

The inner product `q · d` between unit vectors equals their cosine similarity; each query token contributes its best vocabulary-token match independently, with no coupling across query tokens. That structural property is what lets the augmented vocabulary text retain its discriminative weight at the per-token level rather than collapsing into a pooled centroid. The operator is executed natively by Qdrant's `MAX_SIM` multi-vector comparator over an HNSW-indexed collection; the top-K results are the candidate classifications.

### Roll-forward collection versioning

The vocabulary collection is versioned and rolled forward, never edited in place. Each iteration of the optimization loop produces a fresh Qdrant collection `annotations_<taxonomy_id>_<augmentation_version>` with a content-addressed `augmentation_version`; the previous collection becomes `stale` via an atomic demote-then-promote in `taxonomy_registry`. Rollback is achieved by synthesizing an inverse-transform cohort and applying it as a fresh forward step. Every classification is reproducible against an exact, identifiable vocabulary representation; runs months apart can be compared on identical substrate.

## Iterative optimization with per-feature attribution

`scripts/enrichment_evolution.py` implements a reflective evolution loop adapted from GEPA (Agrawal et al. 2025): the augmented text per ontology node is treated as a prompt; classification traces under the current collection are inspected for *over-attraction* (the node ranking too high on columns whose reference is elsewhere) and *under-attraction* (the node ranking too low on columns where it is the reference); a natural-language reflection step surfaces the concrete confusion evidence and proposes rewrites with explicit rationale; candidates accumulate as a Pareto front per node rather than collapsing to a single best. Mutation operators today are template rewrite, discriminator insertion, child citation, and umbrella semantics; anti-example placement and cross-node refactoring are in scope but not yet wired. `scripts/apply_enrichment_transforms.py` materializes accepted candidates into the next forward collection (Phase 5 of the `/evolve-classification` workflow), maintaining the content-addressing and the demote-then-promote invariants.

Per-text-feature attribution drives the optimization signal at two scales. On the target side, SAGE and TreeSHAP (`src/atelier/classify/features.py`, `src/atelier/classify/shap_explanations.py`) attribute classification mass to each of the twelve ablatable column features individually, so a misclassification can be diagnosed at the feature slice — *the SVM and pattern channels disagreed because the value-pattern feature carried the discriminative signal but the name feature was misleading*. On the vocabulary side, the trace-driven attribution underlying `enrichment_evolution.py` flags which composed slice — description vs prototypes vs patterns vs path — is driving a systematic confusion event, which is what the reflection step rewrites. The two attributions are complementary: target-side per-feature attribution explains why a single column was misclassified; vocabulary-side trace attribution explains why a vocabulary node is systematically confused with another. Iteration converges when over- and under-attraction trends are flat across a representative trace cohort.

## Implementation

`colbert_encoder.py` instantiates the canonical `colbert-ir/colbertv2.0` checkpoint and loads its published `linear.weight` 768→128 projection directly from the checkpoint's safetensors; outputs are L2-normalized and special tokens are stripped, matching the ColBERTv2 encoder pipeline as published. The MaxSim operator is executed natively by Qdrant's `MAX_SIM` multi-vector comparator under `Distance.COSINE` (operationally equivalent to `Distance.DOT` on L2-normalized inputs). There is no Python-side scoring loop. The retrieval backend is Qdrant HNSW over multi-vectors rather than PLAID centroid quantization (Santhanam et al. 2022), an engineering choice appropriate when the candidate set numbers in the hundreds rather than millions of passages.

The enrichment loop (`src/atelier/enrichment/loop.py`) orchestrates per-node work: LLM generation of the augmented-text components, deterministic verifier checks (`run_verifier_suite` in `verifiers.py`), retry on failure, ColBERT encoding, Qdrant upsert. Each enriched point is content-addressed by the SHA-256 of `(taxonomy_id, taxonomy_version_hash, augmentation_version, code, ...)` so re-runs are idempotent and partial failures don't pollute the collection.

At classify-time, `maxsim_bridge.py:try_compute_maxsim_mass` issues one `query_points(using="colbert")` per target and surfaces a normalized score `s(Q, D) = S(Q, D) / |Q|` in `[-1, +1]` to its downstream consumer; the rescaling is for calibration tractability, the operator itself is unchanged. The channel feeds the [Dempster–Shafer evidence fusion](/methods/dempster-shafer-fusion/) pipeline as one of three genuinely-independent evidence sources; reliability shaping, focal-set allocation, and the indep-tier consensus gate are described there. The channel-boundary fail-fast contract is explicit: when `classify.maxsim.enabled = true` and the path cannot run (no enriched collection registered, Qdrant unreachable, scoring error), `MaxSimUnavailable` is raised and the classification FSM advances to ERROR — there is no silent fallback to the retired single-vector cosine source.

## Status

The channel was renamed end-to-end from `cosine` to `maxsim` as a no-alias roll-forward (commit `3683558`, May 2026); the config loader loudly rejects retired keys (`_LEGACY_MAXSIM_KEYS`). A previously sketched multi-slot per-role query (separate `col_name_view`, `col_sample_*`, `col_pattern_view` vectors with tunable weights) was not built and is documented as deferred; the shipped path uses a single composed query text and a single `colbert` multi-vector field. The `/evolve-classification` roll-forward loop is operational through Phase 5 (apply transforms) under operator review; later phases (automated re-score, fully-closed iteration) are deliberately deferred while the methodology proves out.

## References

- Khattab, O. & Zaharia, M. (2020). ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT. *SIGIR '20*, 39-48.
- Santhanam, K., Khattab, O., Saad-Falcon, J., Potts, C., & Zaharia, M. (2022). ColBERTv2: Effective and Efficient Retrieval via Lightweight Late Interaction. *NAACL 2022*.
- Agrawal, S. et al. (2025). GEPA: Reflective Prompt Evolution. *arXiv:2507.19457.*
