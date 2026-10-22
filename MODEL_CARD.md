# TRUSTIQ Model Card

## Model Details
- **System Name:** TRUSTIQ Unified Classical Machine Learning Platform
- **Version:** 1.0.0
- **Authors:** Senior ML & NLP Engineering Team
- **Model Types:**
  - TF-IDF Sparse Word N-Gram Vectorizers (unigrams and bigrams, sublinear TF)
  - Balanced Logistic Regression (L2 regularization, L-BFGS solver)
  - Multinomial Naive Bayes (Laplace smoothing)
  - Linear Support Vector Classifiers (SGD with modified Huber loss for calibrated scores)
  - Lexical Evidence Retrieval (BM25-equivalent Cosine Similarity against FEVER Wikipedia knowledge anchors)
- **Execution Target:** Windows 11 CPU (16 GB RAM), Intel i5 / AMD Ryzen 5 or equivalent.
- **Dependencies:** scikit-learn, SciPy, NumPy, pandas, joblib. No external LLMs, transformers, or API inference.

## Intended Use
- Research bench for claim verification, political statement analysis, multi-label toxicity detection, and classification disparity across comment lengths.
- Real-time explainable prediction with token attribution and lexical candidate evidence display.

## Measured Empirical Results
1. **Module A (FEVER Evidence & Faithfulness):**
   - 3-Class Accuracy: `52.40%`
   - Macro F1: `0.5243`
   - Candidate Retrieval Recall@1: `40.8%`
   - Candidate Retrieval Recall@3: `79.2%`
   - Candidate Retrieval Recall@5: `90.2%`
2. **Module B (LIAR Misinformation Benchmark):**
   - Official 6-Class LR Accuracy: `24.63%` (Macro F1: `0.2443`)
   - Official 6-Class NB Accuracy: `23.54%` (Macro F1: `0.1927`)
   - Documented 3-Class Aggregated Accuracy: `44.74%` (Macro F1: `0.4123`)
3. **Module C (Jigsaw Toxicity Multi-Label):**
   - Overall Primary LR Macro F1: `0.6402`
   - Primary LR Macro ROC-AUC: `0.9551`
   - Per-category F1: `toxic` (0.863), `obscene` (0.806), `insult` (0.739), `threat` (0.500), `severe_toxic` (0.478), `identity_hate` (0.456)
4. **Module D (Length-Aware Fairness Disparity):**
   - Short Cohort (<25 tokens): F1 `88.67%`, FPR `10.74%`, FNR `9.13%` (95% CI: F1 [87.32%, 89.90%])
   - Medium Cohort (25-100 tokens): F1 `83.31%`, FPR `7.34%`, FNR `14.64%` (95% CI: F1 [81.55%, 85.11%])
   - Long Cohort (>100 tokens): F1 `84.42%`, FPR `4.41%`, FNR `15.88%` (95% CI: F1 [81.10%, 87.43%])

## Limitations & Ethical Considerations
- **Not Real-World Ground Truth:** Benchmark predictions reflect statistical surface associations. They do not constitute verified investigation.
- **Lexical Limitations:** Bag-of-words representation lacks multi-hop logical reasoning and long-distance co-reference resolution.
- **Fairness Nuance:** Comment length is an extrinsic linguistic property, not a demographic identity.
