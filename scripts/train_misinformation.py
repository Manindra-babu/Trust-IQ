"""
TRUSTIQ Module B: Misinformation Detection Training & Evaluation Pipeline
Uses the official LIAR dataset:
- Evaluates Logistic Regression (Primary) vs Multinomial Naive Bayes (Baseline)
- Evaluates on the official 6-class benchmark (pants-fire, false, barely-true, half-true, mostly-true, true)
- Also provides a documented 3-class experiment (FALSE_OR_MOSTLY_FALSE, MIXED_OR_UNCERTAIN, TRUE_OR_MOSTLY_TRUE)
- Evaluates strictly on the official held-out test.tsv.
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
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data" / "raw" / "liar"
MODELS_DIR = BASE_DIR / "models" / "saved"
REPORTS_DIR = BASE_DIR / "models" / "eval_reports"

LIAR_COLUMNS = [
    "id", "label", "statement", "subject", "speaker", "speaker_job",
    "state_info", "party_affiliation", "barely_true_counts", "false_counts",
    "half_true_counts", "mostly_true_counts", "pants_on_fire_counts", "context"
]

SIX_LABELS = ["pants-fire", "false", "barely-true", "half-true", "mostly-true", "true"]

THREE_CLASS_MAP = {
    "pants-fire": "FALSE_OR_MOSTLY_FALSE",
    "false": "FALSE_OR_MOSTLY_FALSE",
    "barely-true": "FALSE_OR_MOSTLY_FALSE",
    "half-true": "MIXED_OR_UNCERTAIN",
    "mostly-true": "TRUE_OR_MOSTLY_TRUE",
    "true": "TRUE_OR_MOSTLY_TRUE"
}

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'[\r\n\t]+', ' ', text)
    text = re.sub(r'[^\w\s\.\,\?\!\-]', '', text)
    return text.strip()

def load_split(filename: str):
    path = DATA_DIR / filename
    df = pd.read_csv(path, sep="\t", header=None, names=LIAR_COLUMNS, quoting=3)
    df = df.dropna(subset=["statement", "label"]).copy()
    df = df[df["label"].isin(SIX_LABELS)].copy()
    return df

def train_and_evaluate():
    start_time = time.time()
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    
    print("Loading official LIAR splits...")
    train_df = load_split("train.tsv")
    valid_df = load_split("valid.tsv")
    test_df = load_split("test.tsv")
    
    print(f"Train samples: {len(train_df)}, Valid: {len(valid_df)}, Test: {len(test_df)}")
    
    # Feature extraction on statements
    print("Fitting TF-IDF Vectorizer (word n-grams 1-2)...")
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=20000,
        sublinear_tf=True,
        min_df=2,
        preprocessor=clean_text
    )
    
    X_train = vectorizer.fit_transform(train_df["statement"])
    y_train_6 = train_df["label"].values
    
    X_valid = vectorizer.transform(valid_df["statement"])
    y_valid_6 = valid_df["label"].values
    
    X_test = vectorizer.transform(test_df["statement"])
    y_test_6 = test_df["label"].values
    
    # 1. Primary Model: Logistic Regression (6-class)
    print("Training Logistic Regression (6-class)...")
    clf_lr = LogisticRegression(
        C=1.0,
        max_iter=1000,
        class_weight="balanced",
        random_state=42,
        solver="lbfgs"
    )
    clf_lr.fit(X_train, y_train_6)
    
    # 2. Baseline Model: Multinomial Naive Bayes (6-class)
    print("Training Multinomial Naive Bayes (6-class baseline)...")
    clf_nb = MultinomialNB(alpha=0.5)
    clf_nb.fit(X_train, y_train_6)
    
    # Evaluate 6-class models on official held-out test split
    print("Evaluating 6-class models on official test.tsv...")
    y_pred_lr_6 = clf_lr.predict(X_test)
    y_pred_nb_6 = clf_nb.predict(X_test)
    
    acc_lr_6 = accuracy_score(y_test_6, y_pred_lr_6)
    macro_f1_lr_6 = f1_score(y_test_6, y_pred_lr_6, average="macro")
    weighted_f1_lr_6 = f1_score(y_test_6, y_pred_lr_6, average="weighted")
    report_lr_6 = classification_report(y_test_6, y_pred_lr_6, output_dict=True)
    cm_lr_6 = confusion_matrix(y_test_6, y_pred_lr_6, labels=SIX_LABELS).tolist()
    
    acc_nb_6 = accuracy_score(y_test_6, y_pred_nb_6)
    macro_f1_nb_6 = f1_score(y_test_6, y_pred_nb_6, average="macro")
    weighted_f1_nb_6 = f1_score(y_test_6, y_pred_nb_6, average="weighted")
    
    print(f"LIAR 6-Class LR -> Accuracy: {acc_lr_6:.4f}, Macro F1: {macro_f1_lr_6:.4f}")
    print(f"LIAR 6-Class NB -> Accuracy: {acc_nb_6:.4f}, Macro F1: {macro_f1_nb_6:.4f}")
    
    # 3. Documented 3-class Experiment
    y_train_3 = np.array([THREE_CLASS_MAP[l] for l in y_train_6])
    y_test_3 = np.array([THREE_CLASS_MAP[l] for l in y_test_6])
    three_classes = ["FALSE_OR_MOSTLY_FALSE", "MIXED_OR_UNCERTAIN", "TRUE_OR_MOSTLY_TRUE"]
    
    clf_lr_3 = LogisticRegression(
        C=1.0,
        max_iter=1000,
        class_weight="balanced",
        random_state=42
    )
    clf_lr_3.fit(X_train, y_train_3)
    y_pred_lr_3 = clf_lr_3.predict(X_test)
    
    acc_lr_3 = accuracy_score(y_test_3, y_pred_lr_3)
    macro_f1_lr_3 = f1_score(y_test_3, y_pred_lr_3, average="macro")
    report_lr_3 = classification_report(y_test_3, y_pred_lr_3, output_dict=True)
    cm_lr_3 = confusion_matrix(y_test_3, y_pred_lr_3, labels=three_classes).tolist()
    
    print(f"LIAR 3-Class LR -> Accuracy: {acc_lr_3:.4f}, Macro F1: {macro_f1_lr_3:.4f}")
    
    duration = time.time() - start_time
    
    # Save artifacts
    joblib.dump(vectorizer, MODELS_DIR / "misinformation_tfidf.joblib")
    joblib.dump(clf_lr, MODELS_DIR / "misinformation_clf.joblib")
    joblib.dump(clf_nb, MODELS_DIR / "misinformation_nb.joblib")
    joblib.dump(clf_lr_3, MODELS_DIR / "misinformation_clf_3class.joblib")
    print(f"Saved LIAR model artifacts to {MODELS_DIR}")
    
    eval_report = {
        "module": "Misinformation Detection",
        "dataset": "Official LIAR Benchmark (Wang, ACL 2017)",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        "splits": {
            "train": len(train_df),
            "validation": len(valid_df),
            "test": len(test_df)
        },
        "six_class_benchmark": {
            "classes": SIX_LABELS,
            "primary_model_lr": {
                "accuracy": round(acc_lr_6, 4),
                "macro_f1": round(macro_f1_lr_6, 4),
                "weighted_f1": round(weighted_f1_lr_6, 4),
                "per_class": {
                    k: {
                        "precision": round(v["precision"], 4),
                        "recall": round(v["recall"], 4),
                        "f1_score": round(v["f1-score"], 4),
                        "support": v["support"]
                    }
                    for k, v in report_lr_6.items() if k in SIX_LABELS
                },
                "confusion_matrix": {
                    "labels": SIX_LABELS,
                    "matrix": cm_lr_6
                }
            },
            "baseline_model_nb": {
                "accuracy": round(acc_nb_6, 4),
                "macro_f1": round(macro_f1_nb_6, 4),
                "weighted_f1": round(weighted_f1_nb_6, 4)
            }
        },
        "three_class_experiment": {
            "classes": three_classes,
            "mapping": THREE_CLASS_MAP,
            "accuracy": round(acc_lr_3, 4),
            "macro_f1": round(macro_f1_lr_3, 4),
            "per_class": {
                k: {
                    "precision": round(v["precision"], 4),
                    "recall": round(v["recall"], 4),
                    "f1_score": round(v["f1-score"], 4),
                    "support": v["support"]
                }
                for k, v in report_lr_3.items() if k in three_classes
            },
            "confusion_matrix": {
                "labels": three_classes,
                "matrix": cm_lr_3
            }
        },
        "training_duration_seconds": round(duration, 2),
        "limitations": [
            "LIAR dataset consists primarily of US political claims from PolitiFact.",
            "Predictions reflect stylistic and domain lexical patterns, not universal fact verification.",
            "Surface text alone is often insufficient to distinguish subtle degrees of truth without external evidence."
        ]
    }
    
    with open(REPORTS_DIR / "misinformation_metrics.json", "w", encoding="utf-8") as f:
        json.dump(eval_report, f, indent=2)
    print(f"Saved evaluation report to {REPORTS_DIR / 'misinformation_metrics.json'}")
    return eval_report

if __name__ == "__main__":
    train_and_evaluate()
