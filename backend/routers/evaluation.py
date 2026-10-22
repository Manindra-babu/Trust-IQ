"""
TRUSTIQ Evaluation & Research Reports Endpoints
Reads genuine evaluation reports generated from official test splits.
"""

import json
from fastapi import APIRouter, HTTPException
from backend.config import REPORTS_DIR

router = APIRouter(prefix="/api/evaluation", tags=["Evaluation"])

@router.get("/summary")
def get_evaluation_summary():
    reports = {}
    report_files = {
        "evidence": "evidence_metrics.json",
        "misinformation": "misinformation_metrics.json",
        "toxicity": "toxicity_metrics.json",
        "fairness": "fairness_metrics.json"
    }

    for key, filename in report_files.items():
        file_path = REPORTS_DIR / filename
        if file_path.exists():
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    reports[key] = json.load(f)
            except Exception as e:
                reports[key] = {"error": f"Failed to parse report: {str(e)}"}
        else:
            reports[key] = None

    return {
        "status": "success",
        "reports": reports
    }

@router.get("/fairness")
def get_fairness_report():
    file_path = REPORTS_DIR / "fairness_metrics.json"
    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Fairness evaluation report not found. Please train toxicity models and run fairness evaluation."
        )
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading fairness report: {e}")
