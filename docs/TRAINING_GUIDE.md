# TRUSTIQ Local Training Guide

All training operations in TRUSTIQ are designed to run sequentially on a Windows 11 laptop CPU (16 GB RAM) without external GPUs or cloud services.

## Prerequisites
Ensure all required Python packages are installed:
```bash
pip install -r requirements.txt
```

## Step 1: Download & Prepare Official Datasets
```bash
python scripts/prepare_datasets.py
```
This downloads:
- LIAR dataset archive (`liar_dataset.zip`) from UCSB and extracts `train.tsv`, `valid.tsv`, `test.tsv`.
- FEVER shared task dev split (`shared_task_dev.jsonl`) from fever.ai.
- Jigsaw Toxic Comment dataset (`train.csv.gz`) and unzips to `train.csv`.

## Step 2: Train Modules Individually
Each module can be trained and evaluated independently:

### Train Module A (FEVER Evidence & Faithfulness)
```bash
python scripts/train_evidence.py
```
- Outputs: `models/saved/evidence_tfidf.joblib`, `models/saved/evidence_clf.joblib`, `models/saved/evidence_corpus.joblib`.
- Generates: `models/eval_reports/evidence_metrics.json`.

### Train Module B (LIAR Misinformation Benchmark)
```bash
python scripts/train_misinformation.py
```
- Outputs: `models/saved/misinformation_tfidf.joblib`, `models/saved/misinformation_clf.joblib`, `models/saved/misinformation_nb.joblib`.
- Generates: `models/eval_reports/misinformation_metrics.json`.

### Train Module C (Jigsaw Multi-Label Toxicity)
```bash
python scripts/train_toxicity.py
```
- Outputs: `models/saved/toxicity_tfidf.joblib`, `models/saved/toxicity_clf.joblib`, `models/saved/toxicity_comparison.joblib`, `models/saved/toxicity_test_split.parquet`.
- Generates: `models/eval_reports/toxicity_metrics.json`.

### Evaluate Module D (Length-Aware Fairness Evaluator)
```bash
python scripts/evaluate_fairness.py
```
- Evaluates disparities across Short (<25), Medium (25-100), and Long (>100) cohorts.
- Generates: `models/eval_reports/fairness_metrics.json`.

## Step 3: Run All Sequential Pipelines
To train and evaluate everything in sequence:
```bash
python scripts/evaluate_all.py
```
Execution typically completes in 18 to 30 seconds on a standard modern CPU.
