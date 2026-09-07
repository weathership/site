---
name: "BERTopic input–intermediate–output correspondence"
tagline: "A paired dataset and pipeline capturing every prompt, intermediate topic-clustering state, and verifier component score for constrained-decode-generated ontology compositions."
summary: "Per-sample preservation of the full input-intermediate-output trace — prompt, raw completion, parsed composition, verbalisations, KMeans topic centroids over a fixed reference clustering, and four-component verifier scores — for rejection-sampled ontology compositions, enabling exact verifier re-derivation, alternative scoring, and RLVR self-distillation against a stable embedding-space anchor."
projects: [aegir]
order: 6
---

## Motivation

Verifier-guided rejection sampling and RLVR self-distillation depend on a scoring function `R(O, I)` that compares a generated composition `O` against a reference input corpus `I`. If only the final scalar reward is retained, downstream analysis cannot ask the questions that matter: does the verifier actually separate good from bad compositions in embedding space, how does an SFT iteration shift the policy's topic distribution, and can an alternative aggregation be applied without re-running generation. The input-intermediate-output (IIO) correspondence dataset addresses this by persisting, for each kept sample, the prompt that produced it, the verbalised composition, the per-sample topic clustering, the alignment vector against a pinned reference clustering, and every verifier component — sufficient to re-derive the stored reward to within `1e-3` from raw inputs.

## Approach

The verifier's topic-alignment component `R_D` follows the BERTopic principle of Grootendorst (2022) — embed sentences, cluster, compare topics — but commits to a methodologically equivalent and dependency-light chain: sentence-transformer embeddings (`all-MiniLM-L6-v2`), KMeans clustering, and Hungarian-optimal one-to-one centroid matching by cosine similarity. The input corpus `I` is clustered once into a fixed reference `T_I` of `k=100` centroids (`T_I_centroids.npy`, shape `(100, 384)`). At sampling time each composition `O` is verbalised via per-template Manchester-syntax templates, clustered into `T_V` with `k=12`, and scored as the mean matched-cosine similarity between `T_V` and `T_I`, then normalised against a structural-shuffle null distribution so `null_mean` maps to 0 and `null_p95` maps to 1.

The IIO dataset captures, per row: `prompt_text`, `raw_completion`, the parsed `composition_template_ids` + `composition_slot_fillers_json`, the `verbalizations` list, the flattened `T_V` centroids with their `(k_v, 384)` shape, the per-`T_I`-centroid max-cosine `alignment_per_t_i_centroid` vector of length 100, the raw and normalised alignments, and the four verifier components `r_a, r_b, r_c, r_d` plus aggregate `r`. A drift check re-computes `r` for every row and rejects the parquet if any sample exceeds the tolerance.

## Implementation notes

The core pipeline lives in Aegir, not Atelier — the only Atelier reference in the relevant module tree is a vocabulary-ttl comment about a shared belief-interval concept. The clustering and Hungarian-match primitives are in `src/aegir/ontology/topic_alignment.py` (`fit_topic_model`, `alignment_score`, `normalize_alignment`); the four-component scorer is in `src/aegir/ontology/verifier.py` with weights `W_R_B = 0.50, W_R_C = 0.05, W_R_D = 0.45` ("C1-locked"); the extraction script is `scripts/p5_extract_correspondence.py`, which reads the two rejection-sampling corpora, the catalog snapshot, the cached `T_I.pkl`, and the null statistics, and writes `correspondence.parquet` plus side files. The published artifact is `zndx/sdg-bertopic-correspondence-v0.1` on Hugging Face under CC-BY-4.0, with 1,405 rows across two policies (`base`, `sft-r1`).

The dataset is v0.1 and explicitly marked peer-review preview; schema and methodology may evolve. Domain coverage is skewed toward `sdg:` / `cco:` namespaces, and all generations come from a single base model (`Qwen3.5-9B-Base`), so cross-model generalisation is not assessed here. The BERTopic-era topic instruments this method describes are superseded in production by the inverted topic layer and congruence over the OWL ⊨ SKOS retrieval face.

## References

- Grootendorst (2022), BERTopic: Neural topic modeling with a class-based TF-IDF procedure.
- Kuhn (1955), The Hungarian method for the assignment problem.
- Reimers and Gurevych (2019), Sentence-BERT.
- Dataset: `zndx/sdg-bertopic-correspondence-v0.1` (Hugging Face, CC-BY-4.0).
