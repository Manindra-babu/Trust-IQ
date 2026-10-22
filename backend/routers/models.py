"""
TRUSTIQ Models Status & Artifact Information Endpoints
"""

from fastapi import APIRouter
from backend.config import MODELS_DIR, REPORTS_DIR
from backend.schemas import ModelsStatusResponse, ModelStatusItem

router = APIRouter(prefix="/api", tags=["Models"])

@router.get("/models", response_model=ModelsStatusResponse)
def get_models_status():
    modules = {
        "evidence": {
            "name": "Evidence and Faithfulness Verification",
            "required_files": ["evidence_tfidf.joblib", "evidence_clf.joblib", "evidence_corpus.joblib"],
            "eval_report": "evidence_metrics.json"
        },
        "misinformation": {
            "name": "Misinformation Detection (LIAR Benchmark)",
            "required_files": ["misinformation_tfidf.joblib", "misinformation_clf.joblib"],
            "eval_report": "misinformation_metrics.json"
        },
        "toxicity": {
            "name": "Toxicity and Hate Speech Multi-Label Classifier",
            "required_files": ["toxicity_tfidf.joblib", "toxicity_clf.joblib"],
            "eval_report": "toxicity_metrics.json"
        },
        "fairness": {
            "name": "Length-Aware Fairness Evaluator",
            "required_files": ["toxicity_clf.joblib", "toxicity_test_split.parquet"],
            "eval_report": "fairness_metrics.json"
        }
    }

    result = {}
    for mod_key, mod_info in modules.items():
        present_files = [
            f for f in mod_info["required_files"]
            if (MODELS_DIR / f).exists()
        ]
        is_trained = len(present_files) == len(mod_info["required_files"])
        has_eval = (REPORTS_DIR / mod_info["eval_report"]).exists()
        
        result[mod_key] = ModelStatusItem(
            module=mod_info["name"],
            is_trained=is_trained,
            files_present=present_files,
            evaluation_available=has_eval
        )

    return ModelsStatusResponse(models=result)
