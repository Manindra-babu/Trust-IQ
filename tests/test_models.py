"""
Tests for model artifact loading, serialization, and inference.
"""

from pathlib import Path
import joblib
from backend.config import MODELS_DIR
from backend.services.evidence_service import evidence_service
from backend.services.misinformation_service import misinformation_service
from backend.services.toxicity_service import toxicity_service

def test_evidence_service_inference():
    assert evidence_service.is_loaded is True
    res = evidence_service.analyze_claim("Barack Obama was born in Hawaii.", top_k=3)
    assert res["is_trained"] is True
    assert res["predicted_label"] in ["SUPPORTS", "REFUTES", "NOT ENOUGH INFO"]
    assert len(res["retrieved_evidence"]) <= 3
    assert "limitations" in res

def test_misinformation_service_inference():
    assert misinformation_service.is_loaded is True
    res = misinformation_service.analyze_statement("The unemployment rate dropped to an all-time low.")
    assert res["is_trained"] is True
    assert res["predicted_label_6class"] in ["pants-fire", "false", "barely-true", "half-true", "mostly-true", "true"]
    assert res["predicted_label_3class"] in ["FALSE_OR_MOSTLY_FALSE", "MIXED_OR_UNCERTAIN", "TRUE_OR_MOSTLY_TRUE"]

def test_toxicity_service_inference():
    assert toxicity_service.is_loaded is True
    res = toxicity_service.analyze_comment("Have a wonderful productive day, my friend!", threshold=0.5)
    assert res["is_trained"] is True
    assert res["overall_toxic"] is False
    assert "toxic" in res["categories"]
    assert res["token_count"] > 0
