"""
TRUSTIQ Main FastAPI Application Server
Unified ML Platform for Evidence Verification, Misinformation Detection, Toxicity Analysis, and Length-Aware Fairness.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import backend.services.unpickler_compat  # Register unpickle shims on boot
from backend.config import CORS_ORIGINS
from backend.routers import analysis, models, datasets, evaluation, training

app = FastAPI(
    title="TRUSTIQ API",
    description="Unified ML Platform for Evidence Verification, Misinformation Detection, Toxicity Analysis, and Length-Aware Fairness",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(analysis.router)
app.include_router(models.router)
app.include_router(datasets.router)
app.include_router(evaluation.router)
app.include_router(training.router)

@app.api_route("/api/health", methods=["GET", "HEAD"])
def health_check():
    return {
        "status": "healthy",
        "service": "TRUSTIQ Unified ML Engine",
        "version": "1.0.0"
    }

@app.api_route("/api/status", methods=["GET", "HEAD"])
def system_status():
    from backend.services.evidence_service import evidence_service
    from backend.services.misinformation_service import misinformation_service
    from backend.services.toxicity_service import toxicity_service
    
    return {
        "status": "operational",
        "models_loaded": {
            "evidence": evidence_service.is_loaded,
            "misinformation": misinformation_service.is_loaded,
            "toxicity": toxicity_service.is_loaded
        }
    }

# Mount Production Static Frontend if built
frontend_dist = Path(__file__).resolve().parent.parent / "frontend" / "dist"

@app.api_route("/", methods=["GET", "HEAD"])
async def root_index():
    if frontend_dist.exists() and (frontend_dist / "index.html").exists():
        return FileResponse(str(frontend_dist / "index.html"))
    return {
        "status": "healthy",
        "service": "TRUSTIQ Unified ML Engine",
        "version": "1.0.0"
    }

if frontend_dist.exists() and (frontend_dist / "index.html").exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

    @app.api_route("/{full_path:path}", methods=["GET", "HEAD"])
    async def serve_spa(full_path: str):
        if full_path.startswith("api/"):
            return JSONResponse(status_code=404, content={"detail": "API route not found"})
        file_path = frontend_dist / full_path
        if full_path and file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(frontend_dist / "index.html"))

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Hide raw internal stack traces from client
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal ML processing error occurred. Check server logs."}
    )

if __name__ == "__main__":
    import uvicorn
    from backend.config import HOST, PORT
    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=True)
