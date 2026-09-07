---
name: "ModernBERT-NHSVM: calibrated multiclass SVM over ModernBERT embeddings"
tagline: "Hierarchy-aware multiclass SVM with a Crammer–Singer joint margin over ModernBERT mean-pool embeddings, post-hoc temperature-calibrated."
summary: "Normalized Hierarchical SVM (NHSVM; Choi, Chung & Hewitt 2015) head trained with the Crammer & Singer (2001) joint multiclass objective over 768-dim ModernBERT-base embeddings, with a structured tree-distance margin and a post-hoc softmax temperature fitted against a held-out reference slice for calibration."
projects: [atelier]
order: 5
---

## Motivation

The Atelier classification pipeline fuses up to six evidence channels under Dempster-Shafer theory. Channel independence is load-bearing for the fusion (see `docs/src/architecture/dst-evidence-independence.md`): two channels that share an encoder also share their failure modes, which violates the source-independence assumption Dempster's rule requires. The SVM channel exists to supply margin-driven, hierarchy-aware evidence architecturally distinct from the retrieval ([ColBERT MaxSim](/methods/colbert-maxsim/)) and gradient-boosted (CatBoost) channels.

A native hierarchical formulation matters because the target taxonomies are deep (the v0.5.1 UAT line spans 287 nodes) and non-leaf nodes are first-class prediction targets — a flat one-vs-rest classifier discards the structural prior the taxonomy carries.

## Formulation

The natural Kronecker expansion `phi(x, y) = sqrt(alpha_y) * (x ⊗ e_y)` from Choi et al. 2015 (Eq. 5) works for sparse text features — a few hundred nonzero dimensions per row — but catastrophically degrades on dense pretrained embeddings where every dimension is nonzero with similar magnitude. On the 1149-row reference, the same expansion reaches 98.93% top-1 fit-on-train with TF-IDF features versus 4.26% with ModernBERT mean-pool features — a structural mismatch, not a tuning gap (`src/atelier/classify/factorized_nhsvm.py:5-9`).

The factorized form learns one weight vector `W_n in R^d` per hierarchy node and computes the path score directly,

`gamma(x, y) = sum_{n in A_y} alpha_n * (W_n^T x)`,

where `A_y` is the root-to-`y` ancestor set, without ever materializing the Kronecker product. Operationally the model is a single `(n_nodes, d)` linear layer with the path indicator `M_alpha = (path_indicator) * diag(alpha)` baked into a frozen buffer, so the forward pass is two matmuls:

`node_scores = X @ W.T`;  `path_scores = node_scores @ M_alpha.T`.

Training optimizes the structured-SVM margin under the Crammer–Singer joint multiclass objective (Crammer & Singer 2001) with a tree-distance loss `delta(y, y') = sqrt(sum alpha_n over symmetric-difference of ancestor sets)`, via AdamW. Implementation in `src/atelier/classify/factorized_nhsvm.py`.

## Calibration

The structured hinge objective is margin-driven, not probability-calibrated. Under a 287-way softmax, hinge-trained logits flatten — top-1 probabilities collapse to the 0.02-0.04 range even when the margin to second-best is large. A single scalar softmax temperature `T` is fitted against a held-out reference slice, minimizing NLL via grid search over `(0.05, ..., 2.00)` followed by scalar refinement (`src/atelier/optimize/svm/calibrate.py`, following Guo et al. 2017). The fitted `T` is persisted in the adapter manifest and applied at inference.

## Implementation status

The factorized ModernBERT-NHSVM head is the canonical and default SVM evidence source for the DST pipeline. The encoder is `answerdotai/ModernBERT-base`, mean-pooled, 768-dim, loaded once per `(model_id, device)` and cached process-wide (`src/atelier/optimize/svm/encoder.py`). Trained heads are content-addressed and promoted via the `nhsvm_head_registry` table; the runtime `NHSVMHeadAdapter` wraps the head with encoder identity and training metadata, and `_ensure_registered_svm_head` (`src/atelier/classify/pipeline.py:418`) installs it via `ml_inference.install_svm` so the orchestrator's `predict_svm` resolves to the registered head at classify-time. At fusion time `nhsvm_to_mass` applies hierarchy-distance reweighting to the calibrated per-node scores before constructing the DST mass function — see [Dempster–Shafer evidence fusion](/methods/dempster-shafer-fusion/).

A legacy TF-IDF + LinearSVC path survives in `src/atelier/classify/svm_classifier.py`, reachable only via the deprecated `per_vocab_legacy` / `auto` source modes. The deprecation is explicit: `_ensure_per_vocab_svm` emits a runtime warning naming the registered NHSVM head as the intended source, the classifier docstring carries an explicit **LEGACY** marker, and the file is slated for deletion once a promoted head is guaranteed in every environment. Pre-roll-forward `_nhsvm.pkl` bundles from the prior one-vs-rest era fail loudly on load via a `nhsvm_variant` tag (`SVMClassifier._NHSVM_BUNDLE_VERSION = "crammer_singer.v1"`).

## References

- Crammer, K. & Singer, Y. (2001). *On the algorithmic implementation of multiclass kernel-based vector machines.* JMLR 2:265-292.
- Choi, J., Chung, J., & Hewitt, J. (2015). *Normalized Hierarchical Multi-label SVM.* arXiv:1508.02479. Eq. 5 (Kronecker expansion), Eq. 7 (directional alpha constraints), Eq. 9 (tree-distance reweight).
- Guo, C. et al. (2017). *On calibration of modern neural networks.* ICML.
- Warner, B. et al. (2024). *ModernBERT: A Smarter, Better, Faster, Longer Encoder.*
