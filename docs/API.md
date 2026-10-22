# TRUSTIQ API Specification

Base URL: `http://127.0.0.1:8000/api`

## 1. System Endpoints
- `GET /health`
  - Returns engine status and service version.
- `GET /status`
  - Returns readiness and model loading status for each module.
- `GET /models`
  - Returns required artifact files, presence status, and whether evaluation reports exist.
- `GET /datasets`
  - Returns dataset manifests, verified local paths, sample counts, and source URLs.

## 2. Text Analysis Endpoints
- `POST /analyze`
  - Request Body:
    ```json
    {
      "text": "String claim or comment to analyze",
      "mode": "full", // "full", "evidence", "misinformation", "toxicity"
      "toxicity_threshold": 0.5
    }
    ```
  - Response: Unified analysis response including processing time (ms), active models status, candidate evidence, LIAR 6-class/3-class verdicts, and multi-label toxicity categories.

- `POST /analyze/evidence`
  - Returns FEVER 3-class classification and ranked candidate evidence items.

- `POST /analyze/misinformation`
  - Returns LIAR 6-class and 3-class classifications, Naive Bayes comparison, and PolitiFact warnings.

- `POST /analyze/toxicity`
  - Returns per-category probabilities, positive detection flags, and salient token attributions.

## 3. Evaluation & Research Reports
- `GET /evaluation/summary`
  - Returns parsed JSON reports for evidence, misinformation, toxicity, and fairness.
- `GET /evaluation/fairness`
  - Returns cohort breakdowns (short, medium, long), confusion matrices, and 95% bootstrap confidence intervals.

## 4. Model Training Operations
- `POST /training/start`
  - Initiates asynchronous background CPU training for a given module (`"all"`, `"evidence"`, `"misinformation"`, `"toxicity"`, or `"fairness"`).
- `GET /training/status`
  - Returns whether training is currently active, current module, and recent logs.
- `GET /training/logs`
  - Returns complete training log array.
