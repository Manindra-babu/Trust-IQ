"""
TRUSTIQ Toxicity and Hate Speech Multi-Label Analysis Service
Evaluates text across 6 categories (toxic, severe_toxic, obscene, threat, insult, identity_hate)
and provides token-level explanations and comment length categorization.
"""

import re
import joblib
import numpy as np
from pathlib import Path
from typing import Dict, Any, List
import backend.services.unpickler_compat  # Ensure legacy scripts shims are registered
from backend.config import MODELS_DIR

LABEL_COLUMNS = [
    "toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"
]

class ToxicityService:
    def __init__(self):
        self.vectorizer = None
        self.models_lr = None
        self.is_loaded = False
        self.load_artifacts()

    def load_artifacts(self):
        tfidf_path = MODELS_DIR / "toxicity_tfidf.joblib"
        clf_path = MODELS_DIR / "toxicity_clf.joblib"
        
        if tfidf_path.exists() and clf_path.exists():
            try:
                self.vectorizer = joblib.load(tfidf_path)
                self.models_lr = joblib.load(clf_path)
                self.is_loaded = True
            except Exception as e:
                print(f"[ToxicityService] Error loading artifacts: {e}")
                self.is_loaded = False
        else:
            self.is_loaded = False

    def _clean_text(self, text: str) -> str:
        if not isinstance(text, str):
            return ""
        text = text.lower()
        text = re.sub(r'[\r\n\t]+', ' ', text)
        text = re.sub(r'https?://\S+|www\.\S+', ' [URL] ', text)
        text = re.sub(r'[^\w\s\.\,\?\!\'\-]', ' ', text)
        return text.strip()

    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r'\b\w+\b', text.lower())

    def analyze_comment(self, comment: str, threshold: float = 0.5) -> Dict[str, Any]:
        tokens = self._tokenize(comment)
        token_count = len(tokens)
        
        # Determine cohort
        if token_count < 25:
            cohort = "short (< 25 tokens)"
        elif token_count <= 100:
            cohort = "medium (25 - 100 tokens)"
        else:
            cohort = "long (> 100 tokens)"

        if not self.is_loaded:
            return {
                "is_trained": False,
                "comment": comment,
                "token_count": token_count,
                "length_cohort": cohort,
                "overall_toxic": False,
                "categories": {},
                "influential_tokens": [],
                "warning": "Toxicity models are not trained."
            }

        cleaned = self._clean_text(comment)
        vec = self.vectorizer.transform([cleaned])
        
        categories = {}
        for label in LABEL_COLUMNS:
            clf = self.models_lr.get(label)
            if clf:
                prob = float(clf.predict_proba(vec)[0][1])
                is_pos = prob >= threshold
                categories[label] = {
                    "label": label,
                    "probability": round(prob, 4),
                    "is_positive": is_pos,
                    "threshold": threshold
                }

        overall_toxic = categories.get("toxic", {}).get("is_positive", False) or any(
            c.get("is_positive", False) for c in categories.values()
        )

        # Extract influential tokens based on model coefficients for 'toxic'
        influential_tokens = []
        toxic_clf = self.models_lr.get("toxic")
        if toxic_clf:
            feature_names = self.vectorizer.get_feature_names_out()
            coefs = toxic_clf.coef_[0]
            # Find tokens present in input that have highest positive weight
            present_features = []
            cleaned_tokens = set(tokens)
            for t in cleaned_tokens:
                if t in self.vectorizer.vocabulary_:
                    feat_idx = self.vectorizer.vocabulary_[t]
                    weight = coefs[feat_idx]
                    if weight > 0.5:
                        present_features.append((t, weight))
            present_features.sort(key=lambda x: x[1], reverse=True)
            influential_tokens = [f"{t} (weight +{round(w, 2)})" for t, w in present_features[:5]]

        warning = (
            "NOTICE: Predictions reflect automated linguistic feature detection and must NOT be used "
            "to label a person's character, identity, or intent."
        )

        return {
            "is_trained": True,
            "comment": comment,
            "token_count": token_count,
            "length_cohort": cohort,
            "overall_toxic": overall_toxic,
            "categories": categories,
            "influential_tokens": influential_tokens,
            "warning": warning
        }

toxicity_service = ToxicityService()
