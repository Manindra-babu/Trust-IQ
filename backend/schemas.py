"""
TRUSTIQ Pydantic Schemas for Request & Response Validation
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class TextAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000, description="Input text to analyze")
    mode: str = Field("full", description="Analysis mode: 'full', 'evidence', 'misinformation', 'toxicity'")
    toxicity_threshold: float = Field(0.5, ge=0.0, le=1.0, description="Decision threshold for toxicity")

class RetrievedEvidenceItem(BaseModel):
    id: str
    wiki_title: str
    sentence_id: int
    text: str
    relevance_score: float
    provenance: str

class EvidenceAnalysisResult(BaseModel):
    is_trained: bool
    claim: str
    predicted_label: Optional[str]
    confidence_scores: Optional[Dict[str, float]]
    retrieved_evidence: List[RetrievedEvidenceItem]
    retrieval_status: str
    limitations: List[str]

class MisinformationAnalysisResult(BaseModel):
    is_trained: bool
    statement: str
    predicted_label_6class: Optional[str]
    confidence_scores_6class: Optional[Dict[str, float]]
    predicted_label_3class: Optional[str]
    model_comparison_baseline: Optional[str]
    warning: str
    limitations: List[str]

class ToxicityCategoryResult(BaseModel):
    label: str
    probability: float
    is_positive: bool
    threshold: float

class ToxicityAnalysisResult(BaseModel):
    is_trained: bool
    comment: str
    token_count: int
    length_cohort: str
    overall_toxic: bool
    categories: Dict[str, ToxicityCategoryResult]
    influential_tokens: List[str]
    warning: str

class UnifiedAnalysisResponse(BaseModel):
    input_text: str
    processing_time_ms: float
    timestamp: str
    evidence: Optional[EvidenceAnalysisResult] = None
    misinformation: Optional[MisinformationAnalysisResult] = None
    toxicity: Optional[ToxicityAnalysisResult] = None
    system_readiness: Dict[str, bool]

class ModelStatusItem(BaseModel):
    module: str
    is_trained: bool
    files_present: List[str]
    evaluation_available: bool

class ModelsStatusResponse(BaseModel):
    models: Dict[str, ModelStatusItem]

class DatasetInfoItem(BaseModel):
    name: str
    source_url: str
    is_downloaded: bool
    local_path: str
    samples: Optional[int]
    description: str

class DatasetsResponse(BaseModel):
    datasets: List[DatasetInfoItem]

class TrainingStartRequest(BaseModel):
    module: str = Field("all", description="'all', 'evidence', 'misinformation', 'toxicity', or 'fairness'")
    sample_limit: Optional[int] = Field(None, ge=100, le=200000)

class TrainingStatusResponse(BaseModel):
    is_training: bool
    current_module: Optional[str]
    status: str
    last_error: Optional[str]
    recent_logs: List[str]
