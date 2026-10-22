"""
TRUSTIQ Misinformation Detection Service
Evaluates political/public claims using classical models trained on the official LIAR benchmark.
"""

import re
import joblib
from pathlib import Path
from typing import Dict, Any, Optional
from backend.config import MODELS_DIR

SIX_LABELS = ["pants-fire", "false", "barely-true", "half-true", "mostly-true", "true"]

THREE_CLASS_MAP = {
    "pants-fire": "FALSE_OR_MOSTLY_FALSE",
    "false": "FALSE_OR_MOSTLY_FALSE",
    "barely-true": "FALSE_OR_MOSTLY_FALSE",
    "half-true": "MIXED_OR_UNCERTAIN",
    "mostly-true": "TRUE_OR_MOSTLY_TRUE",
    "true": "TRUE_OR_MOSTLY_TRUE"
}

class MisinformationService:
    def __init__(self):
        self.vectorizer = None
        self.clf_lr = None
        self.clf_nb = None
        self.clf_3class = None
        self.is_loaded = False
        self.load_artifacts()

    def load_artifacts(self):
        tfidf_path = MODELS_DIR / "misinformation_tfidf.joblib"
        clf_lr_path = MODELS_DIR / "misinformation_clf.joblib"
        clf_nb_path = MODELS_DIR / "misinformation_nb.joblib"
        clf_3_path = MODELS_DIR / "misinformation_clf_3class.joblib"
        
        if tfidf_path.exists() and clf_lr_path.exists():
            try:
                self.vectorizer = joblib.load(tfidf_path)
                self.clf_lr = joblib.load(clf_lr_path)
                if clf_nb_path.exists():
                    self.clf_nb = joblib.load(clf_nb_path)
                if clf_3_path.exists():
                    self.clf_3class = joblib.load(clf_3_path)
                self.is_loaded = True
            except Exception as e:
                print(f"[MisinformationService] Error loading artifacts: {e}")
                self.is_loaded = False
        else:
            self.is_loaded = False

    def _clean_text(self, text: str) -> str:
        if not isinstance(text, str):
            return ""
        text = text.lower()
        text = re.sub(r'[\r\n\t]+', ' ', text)
        text = re.sub(r'[^\w\s\.\,\?\!\-]', '', text)
        return text.strip()

    def analyze_statement(self, statement: str) -> Dict[str, Any]:
        if not self.is_loaded:
            return {
                "is_trained": False,
                "statement": statement,
                "predicted_label_6class": None,
                "confidence_scores_6class": None,
                "predicted_label_3class": None,
                "model_comparison_baseline": None,
                "warning": "Misinformation model is not trained.",
                "limitations": ["Module not yet trained. Run training pipeline."]
            }

        cleaned = self._clean_text(statement)
        vec = self.vectorizer.transform([cleaned])
        
        # 6-class Primary Prediction (Logistic Regression)
        pred_6 = self.clf_lr.predict(vec)[0]
        probas_6 = self.clf_lr.predict_proba(vec)[0]
        conf_6 = {
            cls_name: round(float(p), 4)
            for cls_name, p in zip(self.clf_lr.classes_, probas_6)
        }
        
        # Baseline Comparison (Naive Bayes)
        nb_pred = self.clf_nb.predict(vec)[0] if self.clf_nb else None
        
        # Documented 3-class Experiment
        pred_3 = self.clf_3class.predict(vec)[0] if self.clf_3class else THREE_CLASS_MAP.get(pred_6, "MIXED_OR_UNCERTAIN")

        warning = (
            "IMPORTANT: This classification is derived solely from statistical lexical patterns in the LIAR PolitiFact dataset. "
            "It does NOT represent a verified factual determination of truth or falsity."
        )

        return {
            "is_trained": True,
            "statement": statement,
            "predicted_label_6class": pred_6,
            "confidence_scores_6class": conf_6,
            "predicted_label_3class": pred_3,
            "model_comparison_baseline": f"Multinomial Naive Bayes Baseline: {nb_pred}",
            "warning": warning,
            "limitations": [
                "LIAR benchmark consists strictly of US political statements.",
                "Surface lexical analysis cannot verify real-world facts or temporal updates.",
                "The 6-class accuracy on this benchmark is ~25%, consistent with published classical ML baselines."
            ]
        }

misinformation_service = MisinformationService()
