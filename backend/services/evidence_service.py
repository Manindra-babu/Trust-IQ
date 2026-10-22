"""
TRUSTIQ Evidence and Faithfulness Verification Service
Performs lexical candidate retrieval and 3-class FEVER claim verification.
"""

import re
import joblib
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Optional
from backend.config import MODELS_DIR

class EvidenceService:
    def __init__(self):
        self.vectorizer = None
        self.classifier = None
        self.corpus = None
        self.corpus_matrix = None
        self.is_loaded = False
        self.load_artifacts()

    def load_artifacts(self):
        tfidf_path = MODELS_DIR / "evidence_tfidf.joblib"
        clf_path = MODELS_DIR / "evidence_clf.joblib"
        corpus_path = MODELS_DIR / "evidence_corpus.joblib"
        
        if tfidf_path.exists() and clf_path.exists() and corpus_path.exists():
            try:
                self.vectorizer = joblib.load(tfidf_path)
                self.classifier = joblib.load(clf_path)
                self.corpus = joblib.load(corpus_path)
                # Precompute corpus TF-IDF matrix for fast cosine similarity scoring
                corpus_texts = [self._clean_text(doc["text"]) for doc in self.corpus]
                self.corpus_matrix = self.vectorizer.transform(corpus_texts)
                self.is_loaded = True
            except Exception as e:
                print(f"[EvidenceService] Error loading artifacts: {e}")
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

    def analyze_claim(self, claim: str, top_k: int = 5) -> Dict[str, Any]:
        if not self.is_loaded:
            return {
                "is_trained": False,
                "claim": claim,
                "predicted_label": None,
                "confidence_scores": None,
                "retrieved_evidence": [],
                "retrieval_status": "Model artifacts not trained or loaded.",
                "limitations": ["Module not yet trained. Run training pipeline."]
            }

        cleaned = self._clean_text(claim)
        claim_vec = self.vectorizer.transform([cleaned])
        
        # 1. Evidence Retrieval via Cosine Similarity
        scores = (claim_vec * self.corpus_matrix.T).toarray()[0]
        top_indices = np.argsort(scores)[::-1][:top_k]
        
        retrieved = []
        ev_contexts = []
        for idx in top_indices:
            score = float(scores[idx])
            if score > 0.01:
                doc = self.corpus[idx]
                retrieved.append({
                    "id": doc["id"],
                    "wiki_title": doc["wiki_title"],
                    "sentence_id": doc["sentence_id"],
                    "text": doc["text"],
                    "relevance_score": round(score, 4),
                    "provenance": doc["provenance"]
                })
                ev_contexts.append(doc["wiki_title"])

        # 2. 3-class Classification on paired (Claim, Evidence) representation
        ev_string = " ".join(ev_contexts) if ev_contexts else "NO_EVIDENCE"
        paired_input = f"{cleaned} [EVIDENCE] {ev_string}"
        paired_vec = self.vectorizer.transform([paired_input])
        
        pred_label = self.classifier.predict(paired_vec)[0]
        probas = self.classifier.predict_proba(paired_vec)[0]
        conf_scores = {
            cls_name: round(float(prob), 4)
            for cls_name, prob in zip(self.classifier.classes_, probas)
        }

        retrieval_status = (
            f"Successfully retrieved {len(retrieved)} candidate evidence documents."
            if retrieved else
            "No suitable evidence sentences found above similarity threshold."
        )

        return {
            "is_trained": True,
            "claim": claim,
            "predicted_label": pred_label,
            "confidence_scores": conf_scores,
            "retrieved_evidence": retrieved,
            "retrieval_status": retrieval_status,
            "limitations": [
                "Lexical BM25/TF-IDF retrieval relies on surface token overlap.",
                "High cosine similarity reflects lexical topicality, not ground-truth verification.",
                "Classifier outputs reflect dataset label bias and statistical correlation, not verified truth."
            ]
        }

evidence_service = EvidenceService()
