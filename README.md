# TRUSTIQ
### Unified AI Trust, Evidence, Safety and Fairness Intelligence System

[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20Render-2563EB?style=for-the-badge&logo=render&logoColor=white)](https://trust-iq.onrender.com/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> 🚀 **Live Workbench:** [https://trust-iq.onrender.com/](https://trust-iq.onrender.com/)

TRUSTIQ is a classical machine learning research workbench that analyzes text for evidential support, misinformation-related labels, toxic language, and length-aware classification disparities.

Built entirely with classical machine learning algorithms (TF-IDF, Logistic Regression, Naive Bayes, Linear SVMs, BM25/Cosine Similarity) running on a Windows 11 CPU with 16 GB RAM. TRUSTIQ does not call pretrained language models, LLM APIs, or hosted inference services.

---

## 1. Project Objectives & Four Research Use Cases

1. **Module A: AI Evidence and Faithfulness Verification (FEVER)**
   - Retrieves candidate evidence sentences from an annotated Wikipedia knowledge corpus using lexical cosine similarity.
   - Classifies claims into `SUPPORTS`, `REFUTES`, or `NOT ENOUGH INFO` using balanced Logistic Regression.
   - Evaluates retrieval Recall@K (Recall@1, Recall@3, Recall@5) and claim classification metrics independently.
2. **Module B: Misinformation Detection (LIAR Benchmark)**
   - Evaluates political statements across the official 6-class PolitiFact schema (`pants-fire`, `false`, `barely-true`, `half-true`, `mostly-true`, `true`).
   - Compares primary Logistic Regression against a Multinomial Naive Bayes baseline.
   - Includes a documented 3-class experiment (`FALSE_OR_MOSTLY_FALSE`, `MIXED_OR_UNCERTAIN`, `TRUE_OR_MOSTLY_TRUE`).
3. **Module C: Toxicity and Hate Speech Classification (Jigsaw)**
   - True multi-label classification across 6 categories: `toxic`, `severe_toxic`, `obscene`, `threat`, `insult`, `identity_hate`.
   - Dynamic thresholding, feature-level token attributions, and comparisons across Logistic Regression, Naive Bayes, and Linear SVM.
4. **Module D: Length-Aware Fairness Evaluator**
   - Evaluates whether toxicity classification performance varies systematically across comment length cohorts (`Short` &lt;25 tokens, `Medium` 25-100 tokens, `Long` &gt;100 tokens).
   - Computes Precision, Recall, F1, False Positive Rate (FPR), False Negative Rate (FNR), confusion matrices, and 95% bootstrap confidence intervals.

---

## 2. Architecture Diagram

```
                 [ User Text Input ]
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
   [FEVER Module A]  [LIAR Module B]  [Jigsaw Module C]
     TF-IDF + BM25    TF-IDF (1-2)     TF-IDF (1-2)
     Cosine Ranking    Logistic Reg.    6x Multi-Label LR
    3-Class Log. Reg.  Naive Bayes      SVM & MNB Baselines
         │                │                │
         └────────────────┼────────────────┘
                          ▼
            [ Module D: Length Fairness ]
             Short / Medium / Long Cohorts
             Bootstrap 95% CI Disparities
                          │
                          ▼
             [ Unified Research Report ]
         FastAPI Backend (127.0.0.1:8000)
         Custom Vanilla CSS Workbench (Vite)
```

---

## 3. Algorithms & Rationale

- **Sublinear TF-IDF N-Grams:** Efficient, sparse representations capturing localized multi-word expressions without black-box embeddings.
- **Balanced Logistic Regression:** Convex optimization with L-BFGS, class-weight balancing for imbalanced categories, and direct coefficient interpretability.
- **Multinomial Naive Bayes:** Classical generative probabilistic baseline for text classification.
- **Linear Support Vector Classifier (SGD):** Margin maximization with modified Huber loss for calibrated confidence scores.
- **Lexical Cosine Similarity & BM25:** Deterministic candidate evidence retrieval scoring term overlap against reference sentences.

---

## 4. Official Dataset Source Links

- **FEVER:** [https://fever.ai/dataset/fever.html](https://fever.ai/dataset/fever.html) (Shared Task Dev: `https://fever.ai/download/fever/shared_task_dev.jsonl`)
- **LIAR:** [https://www.cs.ucsb.edu/~william/data/liar_dataset.zip](https://www.cs.ucsb.edu/~william/data/liar_dataset.zip) (Wang, ACL 2017)
- **Jigsaw Toxic Comments:** [https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge/data](https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge/data) (Hugging Face mirror: `Heliosoph/Jigsaw-Toxic-Comments`)

---

## 5. Installation on Windows 11

### 1. Clone & Set Up Python Environment
```powershell
cd c:\Users\manin\OneDrive\Desktop\Projects\Fake_News
pip install -r requirements.txt
```

### 2. Set Up Frontend
```powershell
cd frontend
npm install
cd ..
```

---

## 6. Dataset Preparation & Verification

To download and verify all three official datasets:
```powershell
python scripts/prepare_datasets.py
```
This automatically downloads and extracts:
- `data/raw/liar/train.tsv`, `valid.tsv`, `test.tsv`
- `data/raw/fever/shared_task_dev.jsonl`
- `data/raw/jigsaw/train.csv`
And generates `data/dataset_manifest.json`.

---

## 7. Model Training Commands

### Train Everything Sequentially (Recommended)
```powershell
python scripts/evaluate_all.py
```

### Train Modules Individually
```powershell
# Module A: Evidence Verification
python scripts/train_evidence.py

# Module B: Misinformation Detection
python scripts/train_misinformation.py

# Module C: Multi-Label Toxicity
python scripts/train_toxicity.py

# Module D: Length-Aware Fairness
python scripts/evaluate_fairness.py
```

---

## 8. Running Automated Tests

Run the full pytest suite (14 passing tests):
```powershell
python -m pytest tests/
```

---

## 9. Starting the Backend Server

Start the local FastAPI server on port 8000:
```powershell
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
Health Check: `http://127.0.0.1:8000/api/health`
Interactive Swagger Docs: `http://127.0.0.1:8000/docs`

---

## 10. Starting the Frontend UI

In a separate terminal:
```powershell
cd frontend
npm run dev
```
Open `http://localhost:5173` in your browser.

To produce a production build:
```powershell
cd frontend
npm run build
```

---

## 11. Measured Experimental Results Summary

All metrics are traceable to genuine held-out evaluation runs:
- **FEVER Evidence Verification:** 3-Class Accuracy `52.40%`, Retrieval Recall@1 `40.8%`, Recall@3 `79.2%`, Recall@5 `90.2%`.
- **LIAR Misinformation Benchmark:** 6-Class LR Accuracy `24.63%` vs NB `23.54%` (matching published Wang 2017 baselines), 3-Class LR Accuracy `44.74%`.
- **Jigsaw Multi-Label Toxicity:** Macro F1 `0.6402`, Macro ROC-AUC `0.9551`.
- **Length-Aware Fairness:** Statistically significant disparity observed between short (<25 tokens, F1 `88.67%`, FPR `10.74%`) and long comments (>100 tokens, F1 `84.42%`, FPR `4.41%`).

---

## 12. Known Limitations & Research Boundaries

1. **Lexical Overlap vs Factual Reality:** High cosine similarity indicates topical vocabulary match, not semantic truth.
2. **Domain Bias:** LIAR statements stem from US political debates; predictions reflect rhetorical patterns rather than absolute factual correctness.
3. **Not Character Profiling:** Toxicity predictions evaluate linguistic surface features of the submitted text string only; never user identity or moral character.
4. **Length Disparities:** Long comments exhibit lower false-negative rates but higher false-positive rates due to the cumulative presence of polysemous words.
