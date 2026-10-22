"""
TRUSTIQ Dataset Management & Status Endpoints
"""

import json
from fastapi import APIRouter
from backend.config import DATA_DIR, RAW_DATA_DIR
from backend.schemas import DatasetsResponse, DatasetInfoItem

router = APIRouter(prefix="/api", tags=["Datasets"])

@router.get("/datasets", response_model=DatasetsResponse)
def get_datasets_status():
    manifest_path = DATA_DIR / "dataset_manifest.json"
    manifest = {}
    if manifest_path.exists():
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                manifest = json.load(f)
        except Exception:
            pass

    liar_dir = RAW_DATA_DIR / "liar"
    fever_path = RAW_DATA_DIR / "fever" / "shared_task_dev.jsonl"
    jigsaw_path = RAW_DATA_DIR / "jigsaw" / "train.csv"

    liar_samples = manifest.get("liar", {}).get("train.tsv", {}).get("samples")
    fever_samples = manifest.get("fever", {}).get("samples")
    jigsaw_samples = manifest.get("jigsaw", {}).get("samples")

    items = [
        DatasetInfoItem(
            name="FEVER (Fact Extraction and VERification)",
            source_url="https://fever.ai/dataset/fever.html",
            is_downloaded=fever_path.exists(),
            local_path=str(fever_path),
            samples=fever_samples or (19998 if fever_path.exists() else None),
            description="Wikipedia-based fact verification dataset with annotated gold evidence sentences and SUPPORTS, REFUTES, NOT ENOUGH INFO labels."
        ),
        DatasetInfoItem(
            name="LIAR Benchmark Dataset",
            source_url="https://www.cs.ucsb.edu/~william/data/liar_dataset.zip",
            is_downloaded=(liar_dir / "train.tsv").exists(),
            local_path=str(liar_dir),
            samples=liar_samples or (10269 if (liar_dir / "train.tsv").exists() else None),
            description="Public political statements collected from PolitiFact across six truthfulness categories (Wang, ACL 2017)."
        ),
        DatasetInfoItem(
            name="Jigsaw Toxic Comment Classification Challenge",
            source_url="https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge/data",
            is_downloaded=jigsaw_path.exists(),
            local_path=str(jigsaw_path),
            samples=jigsaw_samples or (159571 if jigsaw_path.exists() else None),
            description="Wikipedia discussion talk page comments labeled for 6 toxic language categories (toxic, severe_toxic, obscene, threat, insult, identity_hate)."
        )
    ]

    return DatasetsResponse(datasets=items)
