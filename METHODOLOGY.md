# TRUSTIQ Methodology & Technical Design

## 1. Classical Feature Extraction Pipeline
Rather than relying on uninterpretable neural embeddings, TRUSTIQ extracts sparse n-gram representations:
- **Sublinear Term Frequency:** Formulated as $tf(t, d) = 1 + \log(f_{t, d})$ for terms $f > 0$.
- **Inverse Document Frequency:** $idf(t, D) = \log\left(\frac{1 + |D|}{1 + |\{d \in D : t \in d\}|}\right) + 1$.
- **N-Gram Ranges:** Unigrams and bigrams $(1, 2)$ capture local idiomatic compounds (e.g. "not true", "hate speech").
- **Vocabulary Sizing:** 15,000 to 25,000 max features, filtered by minimum document frequency $min\_df \ge 2$, preserving memory on standard 16 GB RAM laptops.

## 2. Lexical Evidence Retrieval (Module A)
Candidate evidence retrieval uses a dual-index architecture:
1. An inverted vocabulary knowledge corpus generated from 7,100 unique FEVER reference Wikipedia entries.
2. Sparse matrix dot-product cosine similarity:
$$\text{Sim}(q, d) = \frac{\mathbf{v}_q \cdot \mathbf{v}_d}{\|\mathbf{v}_q\|_2 \|\mathbf{v}_d\|_2}$$
Candidates are ranked descending by similarity score, filtered by a minimum relevance threshold of $0.01$.

## 3. Misinformation Benchmark (Module B)
The LIAR benchmark consists of short statements evaluated across 6 categorical truth ratings. To prevent data leakage:
- Preprocessing transformations are fit strictly on the official `train.tsv`.
- Evaluation is executed strictly against the official held-out `test.tsv`.
- Multinomial Naive Bayes serves as the canonical generative baseline:
$$P(c \mid \mathbf{x}) \propto P(c) \prod_{i=1}^n P(x_i \mid c)$$
- Logistic Regression serves as the discriminative primary estimator with balanced class weights to compensate for label imbalance (e.g., fewer `pants-fire` examples than `half-true`).

## 4. Multi-Label Toxicity Decomposition (Module C)
Toxicity analysis avoids compressing nuanced harms into a single scalar:
- Separate estimators are trained per category: `toxic`, `severe_toxic`, `obscene`, `threat`, `insult`, `identity_hate`.
- Decision thresholds are configurable, allowing researchers to evaluate precision-recall trade-offs.
- Linear SVM with modified Huber loss provides bounded decision margins suitable for calibrated scoring.

## 5. Length-Aware Fairness Protocol (Module D)
Comments are divided into three non-overlapping cohorts using a documented word tokenizer:
- **Short:** $< 25$ tokens
- **Medium:** $25 - 100$ tokens
- **Long:** $> 100$ tokens

For each group, we compute:
- Precision, Recall, F1-score
- False Positive Rate ($FPR = \frac{FP}{FP + TN}$)
- False Negative Rate ($FNR = \frac{FN}{FN + TP}$)
- 95% Confidence Intervals via 500 to 1,000 bootstrap iterations with replacement.
Between-group metric deltas are evaluated to verify whether observed performance variations are statistically meaningful or mere sampling noise.
