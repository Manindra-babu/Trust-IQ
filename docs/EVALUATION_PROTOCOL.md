# TRUSTIQ Evaluation Protocol

TRUSTIQ adheres to strict evaluation principles to ensure scientific honesty and reproducibility.

## 1. No Data Leakage
- Vectorizers (vocabulary and IDF weights) are fit strictly on designated training splits.
- Feature extraction transformations are applied to validation and test splits without refitting.
- Official test sets (e.g. `test.tsv` for LIAR) are never partitioned randomly or used for hyperparameter selection.

## 2. Metric Standards
- **Accuracy:** Overall proportion of correct categorical assignments.
- **Macro F1:** Unweighted mean of per-class F1-scores, ensuring minority classes are not masked by large classes.
- **Weighted F1:** Class-size weighted average F1-score.
- **Recall@K (Evidence Retrieval):** Fraction of queries where at least one gold evidence reference is ranked in the top $K$ candidate sentences.
- **False Positive Rate (FPR):** $FP / (FP + TN)$, crucial for measuring over-censorship.
- **False Negative Rate (FNR):** $FN / (FN + TP)$, crucial for measuring missed toxic instances.

## 3. Bootstrap Resampling Protocol
For length-aware fairness analysis:
- We draw 500 to 1,000 bootstrap samples with replacement from each length cohort.
- Empirical percentiles at $2.5\%$ and $97.5\%$ determine the 95% Confidence Intervals for F1, FPR, and FNR.
- If interval bounds do not overlap between cohorts, a statistically significant disparity is established.

## 4. Reporting Format
All metrics are saved simultaneously in machine-readable JSON format in `models/eval_reports/` with timestamps, sample sizes, and split descriptions.
