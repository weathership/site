---
name: "Dempster–Shafer evidence fusion for column classification"
tagline: "Multi-source belief-function combination over a restricted frame of discernment, yielding `[Bel, Pl]` intervals at every hierarchy level."
summary: "Six evidence sources — ColBERT MaxSim retrieval, gradient-boosted prediction, regex patterns, name matching, ModernBERT-NHSVM, and an LLM convergence agent — emit mass functions over a restricted focal set derived from the taxonomy hierarchy; Dempster's rule combines them into belief intervals `[Bel(A), Pl(A)]` at every level, with the interval width `Pl − Bel` quantifying epistemic uncertainty and the Dempster conflict `K` diagnosing source disagreement that point estimates suppress."
projects: [atelier]
order: 2
---

## Motivation

A flat confidence score conflates two distinct epistemic states: "definitely a payment card number" and "definitely some kind of payment information, but unsure which sub-type." Dempster-Shafer Theory (DST), formalized by Dempster (1968) and Shafer (1976), generalizes Bayesian probability by assigning mass to subsets of the frame of discernment rather than to singletons alone. The resulting belief interval `[Bel(A), Pl(A)]` separates what evidence *commits to* from what it *does not rule out* — a distinction load-bearing for policy enforcement and human-review routing.

## Formulation

For a frame of discernment `Theta`, a mass function `m: 2^Theta -> [0,1]` satisfies `m(empty) = 0` and sums to one over subsets. Belief is `Bel(A) = sum over B subset A of m(B)`; plausibility is `Pl(A) = sum over B with non-empty intersection with A of m(B)`. Dempster's rule combines two independent mass functions as `m_12(A) = (1/(1 - K)) * sum over B intersect C = A of m_1(B) * m_2(C)`, where `K = sum over B intersect C = empty of m_1(B) * m_2(C)` is the conflict mass. Decisions use the pignistic transform (Smets & Kennes 1994) for leaf-level classification; the raw intervals are retained for diagnostic and audit surfaces.

## Implementation

The implementation lives in `src/atelier/classify/`, with `mass_functions.py` declaring the six evidence sources and `belief.py` providing combination, focal-set construction, and `Bel` / `Pl` accessors. `HierarchicalClassification.classify_dst` orchestrates the chain.

The first three sources are retrieval-, prediction-, and pattern-based. `maxsim_to_mass` computes mass from the canonical ColBERT MaxSim operator (Khattab & Zaharia 2020) over the canonical ColBERTv2 encoder, executed natively in Qdrant — see [ColBERT MaxSim](/methods/colbert-maxsim/) for the canonical-vs-engineering split — with Haenni-Hartmann (2006) reliability shaping: `alpha` is a sigmoid of the top-1 score blended with a `tanh` margin term, and `(1 - alpha)` is allocated to ignorance. `catboost_to_mass` maps CatBoost `predict_proba` to singletons under variance-adaptive discounting derived from virtual ensembles. `pattern_to_mass` runs eight content-pattern detectors emitting high mass (0.9) on match against category codes, vacuous otherwise.

The remaining three are lexical-, structural-, and judgment-based. `name_match_to_mass` allocates 0.70 / 0.50 / 0.30 tiers against exact, abbreviation, and word-overlap matches between column name and category label. The SVM source uses the registered [ModernBERT-NHSVM](/methods/modernbert-nhsvm/) head, converted to mass by `nhsvm_to_mass` — which applies hierarchy-distance reweighting to the calibrated per-node scores before constructing the mass function — supplying margin-driven evidence architecturally distinct from the retrieval and gradient-boosted channels. The sixth source, an LLM convergence agent (`llm_backend.py`, `bootstrap.py`), targets columns where the independent-tier consensus (`maxsim` ⊕ `pattern` ⊕ `name_match`) disagrees with the first-pass LLM vote at `independent_top1_mass >= 0.45`, routing them for a second pass with cross-source counter-evidence in the prompt.

## Restricted focal set

For an `N`-leaf taxonomy, the power set `2^N` is intractable. The implementation exploits the taxonomy tree to construct a restricted focal set (Denoeux 2008): singletons (leaves), internal nodes mapped to their descendant-leaf sets, manually specified confusable pairs from error analysis, and the full frame `Theta`. Cardinality grows roughly linearly in the number of taxonomy nodes plus the confusable-pair count, keeping per-column cost `(S - 1) * F^2` sub-millisecond at the scale of the Atelier UAT taxonomies.

## Implementation status and known limitations

Source independence is the dominant open problem. Dempster's rule assumes distinct, conditionally independent bodies of evidence (Shafer 1976 §3, Denoeux 2008); when the assumption is violated, combining two mass functions that derive from a shared evidential atom effectively raises that atom's contribution to a power. The six sources split into two clusters by their relation to the LLM. The independent cluster — `maxsim`, `pattern`, `name_match` — derives evidence from semantic comparison, content patterns, and column-name lexical match respectively, with no LLM coupling. The LLM-derivative cluster contains `llm` itself; `catboost`, trained in `fit_to_llm` mode (default true) on `(embedding_text, llm_code)` pairs from the run's LLM sweep (strongly non-distinct — effectively an explainability surface over the LLM's labels); and `svm` (the registered ModernBERT-NHSVM head), weakly non-distinct via the offline enrichment-LLM that produced the taxonomy annotation payloads the head was promoted against.

The current treatment is reliability discounting (Shafer §11.3) plus an independent-tier consensus gate computed only over `{maxsim, pattern, name_match}`; the gate fires when the genuinely independent tier disagrees with the first-pass LLM vote at non-trivial mass, and the disagreeing columns are routed for LLM revisit. A tiered fusion combining the LLM-derivative cluster `{llm, catboost, svm}` via Denoeux's commonality-form cautious conjunction (idempotent on identical evidence; non-normalising) and the independent cluster via Dempster, then combining the two cluster-level mass functions across tiers, would dissolve the non-distinctness at the math level rather than approximating it via discount. The `combine_multiple` infrastructure already accepts a `strategy="cautious"` branch alongside `dempster` / `yager`; the refinement is scoped but not yet wired.

Discount constants were set by engineering judgment; systematic calibration against held-out data is open work.

## References

Dempster (1968), *A generalization of Bayesian inference*, JRSS-B 30(2). Shafer (1976), *A Mathematical Theory of Evidence*. Smets & Kennes (1994), *The Transferable Belief Model*, AIJ 66(2). Denoeux (2008), *Conjunctive and disjunctive combination of belief functions induced by non-distinct bodies of evidence*, AIJ 172(2-3). Haenni & Hartmann (2006), *Modeling partially reliable information sources*, Information Fusion 7(4). Khattab & Zaharia (2020), *ColBERT: Efficient and effective passage search via contextualized late interaction over BERT*, SIGIR.
