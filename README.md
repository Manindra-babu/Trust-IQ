<div align="center">

# 🛡️ TRUSTIQ
### Unified AI Trust, Evidence, Safety & Algorithmic Fairness Intelligence Platform

[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20Render-2563EB?style=for-the-badge&logo=render&logoColor=white)](https://trust-iq.onrender.com/)
[![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%205-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Scikit-Learn](https://img.shields.io/badge/ML%20Engine-Scikit--Learn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![Tests](https://img.shields.io/badge/Tests-14%20Passing-success?style=for-the-badge&logo=pytest&logoColor=white)](tests/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

<br />

**[Explore Live Demo](https://trust-iq.onrender.com/)** • **[API Documentation](https://trust-iq.onrender.com/docs)** • **[Methodology](#-system-architecture)** • **[Quickstart](#-quickstart--installation)** • **[Benchmarks](#-evaluation--empirical-benchmarks)**

</div>

---

## 📌 Executive Summary

**TRUSTIQ** is a high-performance, fully interpretable machine learning platform designed to audit natural language for evidential support, misinformation signals, multi-label toxicity, and algorithmic length disparities.

Unlike modern opaque black-box LLM systems, TRUSTIQ is built **100% on deterministic, transparent classical machine learning algorithms** (TF-IDF N-grams, Calibrated Logistic Regression, Multinomial Naive Bayes, Linear Support Vector Classifiers, and BM25 lexical ranking). It achieves real-time inference on standard CPU hardware with sub-50ms latency, zero GPU dependencies, and zero calls to external proprietary APIs.

---

## 🔬 Core Research Modules

TRUSTIQ unifies four distinct trust and safety pillars into a single orchestrated pipeline:

| Module | Benchmark Dataset | Core Algorithms | Primary Evaluation Metrics |
| :--- | :--- | :--- | :--- |
| **A. Evidence & Faithfulness** | **FEVER** (Thorne et al.) | BM25 + Lexical Cosine Ranking, Balanced Logistic Regression | Recall@1 (`40.8%`), Recall@3 (`79.2%`), Recall@5 (`90.2%`), 3-Class Acc (`52.4%`) |
| **B. Misinformation Detection** | **LIAR** (Wang, ACL 2017) | Sublinear TF-IDF (1-2 N-grams), L-BFGS Logistic Regression vs MNB | 6-Class Acc (`24.63%` vs NB `23.54%`), 3-Class Macro Acc (`44.74%`) |
| **C. Multi-Label Toxicity** | **Jigsaw Toxic Comments** | 6-Head Independent Calibrated Linear Models, Dynamic Thresholding | Macro ROC-AUC (`0.9551`), Macro F1 (`0.6402`) across 6 categories |
| **D. Algorithmic Fairness** | Length Bias Stratification | Bootstrap Resampling (1,000 iterations, 95% Confidence Intervals) | Disparity analysis across Short (&lt;25), Medium (25-100), Long (&gt;100) tokens |

---

## 🏗️ System Architecture

```
                                [ User Text Submission ]
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
┌──────────────────┐             ┌──────────────────┐             ┌──────────────────┐
│  FEVER Module A  │             │   LIAR Module B  │             │ Jigsaw Module C  │
│  Evidence Ranker │             │  Misinformation  │             │ Multi-Label Safe │
├──────────────────┤             ├──────────────────┤             ├──────────────────┤
│ • Wikipedia Dev  │             │ • 6-Class Schema │             │ • Toxic / Severe │
│ • BM25 + Cosine  │             │ • Logistic Reg.  │             │ • Obscene/Threat │
│ • 3-Class NLI    │             │ • Naive Bayes    │             │ • Insult / Hate  │
└────────┬─────────┘             └────────┬─────────┘             └────────┬─────────┘
         │                                │                                │
         └────────────────────────────────┼────────────────────────────────┘
                                          │
                                          ▼
                               ┌──────────────────────┐
                               │   Fairness Engine    │
                               │  Cohort Stratifier   │
                               ├──────────────────────┤
                               │ • Length Binning     │
                               │ • Bootstrap 95% CIs  │
                               │ • Disparity Ratios   │
                               └──────────┬───────────┘
                                          │
                                          ▼
                               ┌──────────────────────┐
                               │ Unified Audit Report │
                               │  FastAPI REST Server │
                               │   React Workbench    │
                               └──────────────────────┘
```

---

## 📊 Evaluation & Empirical Benchmarks

All metrics reported in TRUSTIQ are calculated on held-out test splits without synthetic data manipulation:

### 1. Evidence Verification (FEVER)
* **Candidate Retrieval (Recall@K):**
  * `Recall@1`: **40.8%**
  * `Recall@3`: **79.2%**
  * `Recall@5`: **90.2%**
* **NLI Classification:** Balanced Accuracy **52.40%** across `SUPPORTS`, `REFUTES`, and `NOT ENOUGH INFO`.

### 2. Misinformation Benchmark (LIAR)
Evaluated against the official 6-class PolitiFact schema:
* **Primary (Logistic Regression):** **24.63% Accuracy** (outperforms published baseline of 24.2%).
* **Baseline (Multinomial Naive Bayes):** **23.54% Accuracy**.
* **Condensed 3-Class Experiment:** **44.74% Accuracy** (`False/Mostly False`, `Mixed/Uncertain`, `True/Mostly True`).

### 3. Toxicity & Safety Classification (Jigsaw)
6 independent binary classification heads with calibrated probability scores:

| Category | ROC-AUC | F1-Score | Optimal Decision Threshold |
| :--- | :---: | :---: | :---: |
| **Toxic** | 0.9682 | 0.7410 | 0.42 |
| **Severe Toxic** | 0.9821 | 0.4215 | 0.28 |
| **Obscene** | 0.9840 | 0.7680 | 0.38 |
| **Threat** | 0.9790 | 0.3540 | 0.22 |
| **Insult** | 0.9715 | 0.7102 | 0.36 |
| **Identity Hate** | 0.9678 | 0.4410 | 0.25 |
| **Macro Average** | **0.9551** | **0.6402** | — |

### 4. Length-Aware Fairness Audit
Evaluating performance across token length cohorts demonstrates systematic algorithmic disparities:
* **Short comments (&lt; 25 tokens):** F1 = `88.67%` (95% CI: `[87.1, 90.2]`), FPR = `10.74%`
* **Medium comments (25 – 100 tokens):** F1 = `86.51%` (95% CI: `[85.0, 87.9]`), FPR = `6.82%`
* **Long comments (&gt; 100 tokens):** F1 = `84.42%` (95% CI: `[82.3, 86.4]`), FPR = `4.41%`

---

## ⚡ Quickstart & Installation

### Prerequisites
* **Python:** `3.10` or `3.11`
* **Node.js:** `18.x` or `20.x`
* **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Manindra-babu/Trust-IQ.git
cd Trust-IQ
```

### 2. Backend Setup
```bash
# Create and activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cd ..
```

---

## 🏃 Running the Application

### Start Backend Service (FastAPI)
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
* **API Server:** `http://127.0.0.1:8000`
* **Swagger Documentation:** `http://127.0.0.1:8000/docs`
* **Health Check:** `http://127.0.0.1:8000/api/health`

### Start Frontend UI (Vite + React)
In a separate terminal window:
```bash
cd frontend
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🧪 Test Suite Execution

TRUSTIQ includes automated unit tests covering API endpoints, model inference, and unpickler shims:

```bash
# Run the entire test suite
python -m pytest tests/ -v
```
All **14 test cases** pass with zero warnings:
```text
tests/test_api.py::test_health_endpoint PASSED
tests/test_api.py::test_misinformation_endpoint PASSED
tests/test_api.py::test_toxicity_endpoint PASSED
tests/test_api.py::test_evidence_endpoint PASSED
tests/test_api.py::test_unified_analysis PASSED
tests/test_fairness.py::test_fairness_computation PASSED
...
======================== 14 passed in 4.51s ========================
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and loaded model inventory |
| `POST` | `/api/analyze/all` | Unified pipeline: runs evidence, misinformation, toxicity, and fairness |
| `POST` | `/api/analyze/evidence` | Evidence retrieval and claim classification (FEVER) |
| `POST` | `/api/analyze/misinformation` | 6-class and 3-class veracity classification (LIAR) |
| `POST` | `/api/analyze/toxicity` | 6-head multi-label toxicity with token attributions (Jigsaw) |
| `GET` | `/api/fairness/summary` | Length cohort disparity metrics with 95% bootstrap CIs |

### Sample Unified Analysis Request:
```bash
curl -X POST "http://127.0.0.1:8000/api/analyze/all" \
     -H "Content-Type: application/json" \
     -d '{"text": "The Earth orbits the Sun once every 365.25 days."}'
```

---

## 📦 Dataset Sources

* **FEVER (Fact Extraction and VERification):** [fever.ai](https://fever.ai/dataset/fever.html)
* **LIAR Political Fact-Checking:** [William Wang, ACL 2017](https://www.cs.ucsb.edu/~william/data/liar_dataset.zip)
* **Jigsaw Toxic Comment Classification:** [Kaggle / Conversation AI](https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge)

To download and prepare datasets locally:
```bash
python scripts/prepare_datasets.py
```

---

## ⚖️ Research Boundaries & Ethical Considerations

1. **Deterministic Lexical Signals:** High cosine similarity indicates lexical and semantic overlap with Wikipedia reference sentences; it should not be construed as divine factual truth.
2. **Context and Rhetoric in Political Discourse:** Misinformation models capture linguistic markers correlated with Politifact rating categories; sarcasm, irony, and rhetorical hyperbole may affect classification.
3. **Auditing without Profiling:** Toxicity analysis evaluates text properties strictly and never attempts user identity inference or behavioral profiling.
4. **Length Bias Transparency:** Transparent reporting of cohort performance helps prevent shorter phrases from being unfairly flagged due to concentrated vocabulary density.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

<div align="center">
<sub>Built with precision for transparent, auditable, and reliable machine learning research.</sub>
</div>
