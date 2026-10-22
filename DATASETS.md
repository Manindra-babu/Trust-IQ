# TRUSTIQ Dataset Documentation & Attribution

TRUSTIQ utilizes three canonical natural language processing and fact-verification research datasets.

---

## 1. FEVER (Fact Extraction and VERification)
- **Official Website:** [https://fever.ai/dataset/fever.html](https://fever.ai/dataset/fever.html)
- **Paper:** Thorne et al., *"FEVER: a large-scale dataset for Fact Extraction and VERification"*, NAACL-HLT 2018.
- **Downloaded File:** `data/raw/fever/shared_task_dev.jsonl` (4.3 MB, 19,998 annotated instances)
- **Source URL:** `https://fever.ai/download/fever/shared_task_dev.jsonl`
- **Labels:** `SUPPORTS` (6,666), `REFUTES` (6,666), `NOT ENOUGH INFO` (6,666)
- **License:** Creative Commons Attribution-ShareAlike 3.0 Unported (derived from Wikipedia).
- **Usage in TRUSTIQ:**
  - Lexical candidate evidence knowledge corpus construction (7,100 unique annotated Wikipedia sentences).
  - TF-IDF and BM25-equivalent cosine similarity evidence retrieval.
  - 3-class logistic regression claim classification.

---

## 2. LIAR Benchmark
- **Official Website / Paper:** [https://aclanthology.org/P17-2067/](https://aclanthology.org/P17-2067/)
- **Archive URL:** `https://www.cs.ucsb.edu/~william/data/liar_dataset.zip`
- **Paper:** William Yang Wang, *"Liar, Liar Pants on Fire: A New Benchmark Dataset for Fake News Detection"*, ACL 2017.
- **Downloaded Files:**
  - `train.tsv`: 10,269 claims
  - `valid.tsv`: 1,284 claims
  - `test.tsv`: 1,283 claims (strictly evaluated held-out test split)
- **Original 6 Labels:** `pants-fire`, `false`, `barely-true`, `half-true`, `mostly-true`, `true`.
- **Configured 3-Class Mapping:**
  - `FALSE_OR_MOSTLY_FALSE`: `pants-fire`, `false`, `barely-true`
  - `MIXED_OR_UNCERTAIN`: `half-true`
  - `TRUE_OR_MOSTLY_TRUE`: `mostly-true`, `true`
- **Usage in TRUSTIQ:**
  - Demonstrates classical text classification on PolitiFact political discourse.
  - Compares primary Logistic Regression against Multinomial Naive Bayes baseline.

---

## 3. Jigsaw Toxic Comment Classification Challenge
- **Official Competition:** [https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge/data](https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge/data)
- **Mirror Source:** Hugging Face verified mirror (`Heliosoph/Jigsaw-Toxic-Comments`)
- **Downloaded File:** `data/raw/jigsaw/train.csv` (159,571 comments)
- **Multi-Label Categories:**
  - `toxic`: 15,294 (9.58%)
  - `severe_toxic`: 1,595 (1.00%)
  - `obscene`: 8,449 (5.29%)
  - `threat`: 478 (0.30%)
  - `insult`: 7,877 (4.94%)
  - `identity_hate`: 1,405 (0.88%)
- **License:** CC0 Public Domain.
- **Usage in TRUSTIQ:**
  - Multi-label classification using OneVsRest balanced Logistic Regression, Naive Bayes, and Linear SVM.
  - Length-Aware Fairness Evaluation across short, medium, and long comment cohorts.

---

## Data Download & Preparation Script
To download, unpack, and validate all datasets automatically, run:
```bash
python scripts/prepare_datasets.py
```
This generates `data/dataset_manifest.json` with sample counts and label distributions.
