"""
TRUSTIQ Text Analysis Endpoints
"""

import time
from fastapi import APIRouter, HTTPException, Depends
from backend.schemas import (
    TextAnalysisRequest, UnifiedAnalysisResponse,
    EvidenceAnalysisResult, MisinformationAnalysisResult, ToxicityAnalysisResult
)
from backend.services.evidence_service import evidence_service
from backend.services.misinformation_service import misinformation_service
from backend.services.toxicity_service import toxicity_service

router = APIRouter(prefix="/api", tags=["Analysis"])

@router.post("/analyze", response_model=UnifiedAnalysisResponse)
def run_unified_analysis(req: TextAnalysisRequest):
    start = time.perf_counter()
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")

    mode = req.mode.lower()
    evidence_res = None
    misinfo_res = None
    tox_res = None

    if mode in ["full", "evidence"]:
        ev_data = evidence_service.analyze_claim(text)
        evidence_res = EvidenceAnalysisResult(**ev_data)

    if mode in ["full", "misinformation"]:
        mi_data = misinformation_service.analyze_statement(text)
        misinfo_res = MisinformationAnalysisResult(**mi_data)

    if mode in ["full", "toxicity"]:
        tox_data = toxicity_service.analyze_comment(text, threshold=req.toxicity_threshold)
        tox_res = ToxicityAnalysisResult(**tox_data)

    duration_ms = round((time.perf_counter() - start) * 1000, 2)
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())

    return UnifiedAnalysisResponse(
        input_text=text,
        processing_time_ms=duration_ms,
        timestamp=timestamp,
        evidence=evidence_res,
        misinformation=misinfo_res,
        toxicity=tox_res,
        system_readiness={
            "evidence": evidence_service.is_loaded,
            "misinformation": misinformation_service.is_loaded,
            "toxicity": toxicity_service.is_loaded
        }
    )

@router.post("/analyze/evidence", response_model=EvidenceAnalysisResult)
def analyze_evidence_only(req: TextAnalysisRequest):
    return EvidenceAnalysisResult(**evidence_service.analyze_claim(req.text))

@router.post("/analyze/misinformation", response_model=MisinformationAnalysisResult)
def analyze_misinfo_only(req: TextAnalysisRequest):
    return MisinformationAnalysisResult(**misinformation_service.analyze_statement(req.text))

@router.post("/analyze/toxicity", response_model=ToxicityAnalysisResult)
def analyze_toxicity_only(req: TextAnalysisRequest):
    return ToxicityAnalysisResult(**toxicity_service.analyze_comment(req.text, threshold=req.toxicity_threshold))
