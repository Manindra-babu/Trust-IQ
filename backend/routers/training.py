"""
TRUSTIQ Training Lifecycle Endpoints
"""

from fastapi import APIRouter, HTTPException
from backend.schemas import TrainingStartRequest, TrainingStatusResponse
from backend.services.training_service import training_manager

router = APIRouter(prefix="/api/training", tags=["Training"])

@router.post("/start")
def start_model_training(req: TrainingStartRequest):
    success = training_manager.start_training(
        module=req.module,
        sample_limit=req.sample_limit
    )
    if not success:
        raise HTTPException(
            status_code=409,
            detail="A training job is already actively running. Please wait for it to complete."
        )
    return {
        "message": f"Training job for target '{req.module}' started successfully.",
        "status": "started"
    }

@router.get("/status", response_model=TrainingStatusResponse)
def get_training_status():
    return TrainingStatusResponse(**training_manager.get_status())

@router.get("/logs")
def get_training_logs():
    return {
        "logs": training_manager.logs
    }
