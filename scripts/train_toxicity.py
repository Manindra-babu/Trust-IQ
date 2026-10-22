"""
TRUSTIQ Module C: Toxicity & Hate Speech Multi-Label Classification
Trains classical machine learning models on the official Jigsaw Toxic Comment dataset:
- Primary: Logistic Regression (OneVsRest per category)
- Comparison Baselines: Multinomial Naive Bayes and Linear SVM
- Labels: toxic, severe_toxic, obscene, threat, insult, identity_hate
- Full multilabel evaluation: per-label Precision, Recall, F1, ROC-AUC, PR-AUC
- Model artifact serialization with joblib
"""

import os
import sys
import json
import re
import time
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression, SGDClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import (
    precision_recall_fscore_support, roc_auc_score,
    average_precision_score, confusion_matrix, accuracy_score
)
from sklearn.model_selection import train_test_split

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "raw" / "jigsaw" / "train.csv"
MODELS_DIR = BASE_DIR / "models" / "saved"
REPORTS_DIR = BASE_DIR / "models" / "eval_reports"

LABEL_COLUMNS = [
    "toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"
]

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'[\r\n\t]+', ' ', text)
    text = re.sub(r'https?://\S+|www\.\S+', ' [URL] ', text)
    text = re.sub(r'[^\w\s\.\,\?\!\'\-]', ' ', text)
    return text.strip()

def train_and_evaluate(sample_limit=None):
    start_time = time.time()
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    
    print(f"Loading Jigsaw dataset from {DATA_PATH}...")
    df = pd.read_csv(DATA_PATH)
    df["comment_text"] = df["comment_text"].fillna("").astype(str)
    
    # Stratified or representative subset for fast local CPU training if specified
    if sample_limit and len(df) > sample_limit:
        print(f"Sampling {sample_limit} comments for efficient CPU training...")
        # Oversample toxic comments slightly to maintain class balance in sample
        toxic_mask = (df[LABEL_COLUMNS].sum(axis=1) > 0)
        toxic_df = df[toxic_mask]
        clean_df = df[~toxic_mask]
        n_toxic = min(len(toxic_df), int(sample_limit * 0.35))
        n_clean = sample_limit - n_toxic
        df = pd.concat([
            toxic_df.sample(n_toxic, random_state=42),
            clean_df.sample(n_clean, random_state=42)
        ]).sample(frac=1.0, random_state=42).reset_index(drop=True)
        
    print(f"Dataset size: {len(df)} comments.")
    
    # Split: 80% train, 20% test
    train_df, test_df = train_test_split(df, test_size=0.20, random_state=42)
    print(f"Train set: {len(train_df)}, Test set: {len(test_df)}")
    
    print("Fitting TF-IDF Vectorizer...")
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=25000,
        sublinear_tf=True,
        min_df=3,
        preprocessor=clean_text
    )
    
    X_train = vectorizer.fit_transform(train_df["comment_text"])
    X_test = vectorizer.transform(test_df["comment_text"])
    
    models_lr = {}
    models_nb = {}
    models_svm = {}
    
    metrics_lr = {}
    metrics_nb = {}
    metrics_svm = {}
    
    print("\nTraining per-label models...")
    for label in LABEL_COLUMNS:
        print(f"\n--- Training for label: [{label}] ---")
        y_train = train_df[label].values
        y_test = test_df[label].values
        
        pos_train = int(y_train.sum())
        pos_test = int(y_test.sum())
        print(f"  Positive train: {pos_train} ({pos_train/len(y_train)*100:.2f}%), test: {pos_test} ({pos_test/len(y_test)*100:.2f}%)")
        
        # 1. Logistic Regression (Primary)
        clf_lr = LogisticRegression(
            C=2.0,
            max_iter=1000,
            class_weight="balanced",
            random_state=42,
            solver="lbfgs"
        )
        clf_lr.fit(X_train, y_train)
        models_lr[label] = clf_lr
        
        # Predictions & Probabilities
        y_prob_lr = clf_lr.predict_proba(X_test)[:, 1]
        y_pred_lr = (y_prob_lr >= 0.5).astype(int)
        
        p, r, f, _ = precision_recall_fscore_support(y_test, y_pred_lr, average="binary", zero_division=0)
        roc = roc_auc_score(y_test, y_prob_lr) if pos_test > 0 else 0.5
        pr_auc = average_precision_score(y_test, y_prob_lr) if pos_test > 0 else 0.0
        cm = confusion_matrix(y_test, y_pred_lr).tolist()
        
        metrics_lr[label] = {
            "precision": round(p, 4),
            "recall": round(r, 4),
            "f1_score": round(f, 4),
            "roc_auc": round(roc, 4),
            "pr_auc": round(pr_auc, 4),
            "confusion_matrix": cm,
            "positive_count_test": pos_test
        }
        print(f"  LR -> P: {p:.4f}, R: {r:.4f}, F1: {f:.4f}, ROC-AUC: {roc:.4f}")
        
        # 2. Multinomial Naive Bayes Baseline
        clf_nb = MultinomialNB(alpha=0.2)
        clf_nb.fit(X_train, y_train)
        models_nb[label] = clf_nb
        y_prob_nb = clf_nb.predict_proba(X_test)[:, 1]
        y_pred_nb = (y_prob_nb >= 0.5).astype(int)
        p_nb, r_nb, f_nb, _ = precision_recall_fscore_support(y_test, y_pred_nb, average="binary", zero_division=0)
        roc_nb = roc_auc_score(y_test, y_prob_nb) if pos_test > 0 else 0.5
        metrics_nb[label] = {
            "precision": round(p_nb, 4),
            "recall": round(r_nb, 4),
            "f1_score": round(f_nb, 4),
            "roc_auc": round(roc_nb, 4)
        }
        
        # 3. Linear SVM (SGDClassifier with modified Huber loss for calibrated scores)
        clf_svm = SGDClassifier(loss="modified_huber", max_iter=1000, random_state=42, class_weight="balanced")
        clf_svm.fit(X_train, y_train)
        models_svm[label] = clf_svm
        y_prob_svm = clf_svm.predict_proba(X_test)[:, 1]
        y_pred_svm = (y_prob_svm >= 0.5).astype(int)
        p_svm, r_svm, f_svm, _ = precision_recall_fscore_support(y_test, y_pred_svm, average="binary", zero_division=0)
        roc_svm = roc_auc_score(y_test, y_prob_svm) if pos_test > 0 else 0.5
        metrics_svm[label] = {
            "precision": round(p_svm, 4),
            "recall": round(r_svm, 4),
            "f1_score": round(f_svm, 4),
            "roc_auc": round(roc_svm, 4)
        }
    
    # Calculate macro averages for Logistic Regression
    macro_f1 = np.mean([m["f1_score"] for m in metrics_lr.values()])
    macro_roc = np.mean([m["roc_auc"] for m in metrics_lr.values()])
    print(f"\nOverall LR Macro F1: {macro_f1:.4f}, Macro ROC-AUC: {macro_roc:.4f}")
    
    duration = time.time() - start_time
    
    # Save artifacts
    joblib.dump(vectorizer, MODELS_DIR / "toxicity_tfidf.joblib")
    joblib.dump(models_lr, MODELS_DIR / "toxicity_clf.joblib")
    joblib.dump({"nb": models_nb, "svm": models_svm}, MODELS_DIR / "toxicity_comparison.joblib")
    # Also save held-out test dataframe for fairness evaluation
    test_df.to_parquet(MODELS_DIR / "toxicity_test_split.parquet", index=False)
    print(f"Saved toxicity artifacts to {MODELS_DIR}")
    
    eval_report = {
        "module": "Toxicity and Hate Speech Multi-Label Classification",
        "dataset": "Jigsaw Toxic Comment Classification Challenge (Kaggle / Civil Comments)",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        "train_samples": len(train_df),
        "test_samples": len(test_df),
        "categories": LABEL_COLUMNS,
        "primary_model": {
            "algorithm": "Logistic Regression (Balanced, C=2.0)",
            "macro_f1": round(float(macro_f1), 4),
            "macro_roc_auc": round(float(macro_roc), 4),
            "per_label": metrics_lr
        },
        "model_comparison": {
            "multinomial_nb": {
                "macro_f1": round(float(np.mean([m["f1_score"] for m in metrics_nb.values()])), 4),
                "macro_roc_auc": round(float(np.mean([m["roc_auc"] for m in metrics_nb.values()])), 4),
                "per_label": metrics_nb
            },
            "linear_svm": {
                "macro_f1": round(float(np.mean([m["f1_score"] for m in metrics_svm.values()])), 4),
                "macro_roc_auc": round(float(np.mean([m["roc_auc"] for m in metrics_svm.values()])), 4),
                "per_label": metrics_svm
            }
        },
        "training_duration_seconds": round(duration, 2),
        "limitations": [
            "Trained on Wikipedia talk page comments; style distribution differs from chat or social feeds.",
            "Subtle sarcasm, reclaimed in-group slurs, or toxic nuance may be misclassified by lexical bag-of-words.",
            "Predictions analyze text surface features, not personal identity or moral character."
        ]
    }
    
    with open(REPORTS_DIR / "toxicity_metrics.json", "w", encoding="utf-8") as f:
        json.dump(eval_report, f, indent=2)
    print(f"Saved evaluation report to {REPORTS_DIR / 'toxicity_metrics.json'}")
    return eval_report

if __name__ == "__main__":
    train_and_evaluate(sample_limit=40000)
