"""
TRUSTIQ Background Training Service
Tracks training lifecycle, prevents concurrent runs, and captures logs safely.
"""

import sys
import threading
import time
from typing import List, Optional
from pathlib import Path
from backend.config import BASE_DIR

class TrainingManager:
    def __init__(self):
        self.is_training = False
        self.current_module: Optional[str] = None
        self.status = "idle"
        self.last_error: Optional[str] = None
        self.logs: List[str] = []
        self._lock = threading.Lock()

    def log(self, message: str):
        timestamp = time.strftime("%H:%M:%S", time.localtime())
        entry = f"[{timestamp}] {message}"
        self.logs.append(entry)
        if len(self.logs) > 500:
            self.logs = self.logs[-500:]

    def start_training(self, module: str = "all", sample_limit: Optional[int] = None) -> bool:
        with self._lock:
            if self.is_training:
                return False
            self.is_training = True
            self.current_module = module
            self.status = "running"
            self.last_error = None
            self.logs = []
            self.log(f"Initiating training workflow for target: '{module}'")

        thread = threading.Thread(
            target=self._run_training_worker,
            args=(module, sample_limit),
            daemon=True
        )
        thread.start()
        return True

    def _run_training_worker(self, module: str, sample_limit: Optional[int]):
        sys.path.insert(0, str(BASE_DIR))
        try:
            if module in ["all", "evidence"]:
                self.log("Starting FEVER Evidence verification training...")
                from scripts.train_evidence import train_and_evaluate as train_ev
                train_ev()
                self.log("FEVER Evidence model successfully trained and evaluated.")
                # Reload service
                from backend.services.evidence_service import evidence_service
                evidence_service.load_artifacts()

            if module in ["all", "misinformation"]:
                self.log("Starting LIAR Misinformation detection training...")
                from scripts.train_misinformation import train_and_evaluate as train_mi
                train_mi()
                self.log("LIAR Misinformation models successfully trained.")
                from backend.services.misinformation_service import misinformation_service
                misinformation_service.load_artifacts()

            if module in ["all", "toxicity"]:
                self.log("Starting Jigsaw Toxicity multi-label training...")
                from scripts.train_toxicity import train_and_evaluate as train_tox
                train_tox(sample_limit=sample_limit or 40000)
                self.log("Jigsaw Toxicity multi-label models trained.")
                from backend.services.toxicity_service import toxicity_service
                toxicity_service.load_artifacts()

            if module in ["all", "fairness"]:
                self.log("Starting Length-Aware Fairness Evaluation...")
                from scripts.evaluate_fairness import evaluate_length_fairness
                evaluate_length_fairness()
                self.log("Length-Aware Fairness evaluation complete.")

            self.status = "completed"
            self.log("Training workflow finished successfully.")
        except Exception as e:
            self.status = "error"
            self.last_error = str(e)
            self.log(f"Training failed with error: {e}")
        finally:
            with self._lock:
                self.is_training = False
                self.current_module = None

    def get_status(self):
        return {
            "is_training": self.is_training,
            "current_module": self.current_module,
            "status": self.status,
            "last_error": self.last_error,
            "recent_logs": self.logs[-50:]
        }

training_manager = TrainingManager()
