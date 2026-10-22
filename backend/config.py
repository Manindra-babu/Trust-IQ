"""
TRUSTIQ Backend Configuration
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
MODELS_DIR = BASE_DIR / "models" / "saved"
REPORTS_DIR = BASE_DIR / "models" / "eval_reports"

HOST = os.getenv("TRUSTIQ_HOST", "0.0.0.0" if os.getenv("PORT") else "127.0.0.1")
PORT = int(os.getenv("PORT", os.getenv("TRUSTIQ_PORT", "8000")))
CORS_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173", "*"]
MAX_INPUT_LENGTH = 10000
