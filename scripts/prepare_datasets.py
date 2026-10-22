"""
TRUSTIQ Dataset Preparation and Management Utility
Handles downloading, extracting, validating, and reporting statistics for official research datasets:
1. LIAR (Misinformation Detection)
2. FEVER (Evidence Verification & Faithfulness)
3. Jigsaw Toxic Comment Classification Challenge (Toxicity & Fairness)
"""

import os
import sys
import json
import gzip
import zipfile
import urllib.request
import pandas as pd
import numpy as np
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"

DATASET_URLS = {
    "liar": {
        "url": "https://www.cs.ucsb.edu/~william/data/liar_dataset.zip",
        "archive_name": "liar_dataset.zip",
        "target_dir": RAW_DIR / "liar"
    },
    "fever_dev": {
        "url": "https://fever.ai/download/fever/shared_task_dev.jsonl",
        "archive_name": "shared_task_dev.jsonl",
        "target_dir": RAW_DIR / "fever"
    },
    "jigsaw_toxic": {
        "url": "https://huggingface.co/datasets/Heliosoph/Jigsaw-Toxic-Comments/resolve/main/train.csv.gz",
        "archive_name": "train.csv.gz",
        "target_dir": RAW_DIR / "jigsaw"
    }
}

LIAR_COLUMNS = [
    "id", "label", "statement", "subject", "speaker", "speaker_job",
    "state_info", "party_affiliation", "barely_true_counts", "false_counts",
    "half_true_counts", "mostly_true_counts", "pants_on_fire_counts", "context"
]

LIAR_VALID_LABELS = {
    "pants-fire", "false", "barely-true", "half-true", "mostly-true", "true"
}

JIGSAW_LABEL_COLS = [
    "toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"
]

def download_file(url: str, dest_path: Path):
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    if dest_path.exists() and dest_path.stat().st_size > 0:
        print(f"[EXISTS] {dest_path.name} already downloaded ({dest_path.stat().st_size / 1024:.1f} KB).")
        return dest_path

    print(f"[DOWNLOADING] {url} -> {dest_path}...")
    headers = {'User-Agent': 'Mozilla/5.0 TRUSTIQ-Research/1.0'}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=60) as response, open(dest_path, 'wb') as out_file:
        total_size = response.headers.get('content-length')
        total_size = int(total_size) if total_size else None
        bytes_downloaded = 0
        chunk_size = 64 * 1024
        while True:
            chunk = response.read(chunk_size)
            if not chunk:
                break
            out_file.write(chunk)
            bytes_downloaded += len(chunk)
            if total_size:
                percent = (bytes_downloaded / total_size) * 100
                sys.stdout.write(f"\r  Progress: {bytes_downloaded / (1024*1024):.1f}MB / {total_size / (1024*1024):.1f}MB ({percent:.1f}%)")
                sys.stdout.flush()
    print("\n[COMPLETE] Download finished successfully.")
    return dest_path

def prepare_liar():
    print("\n=== Preparing LIAR Dataset ===")
    cfg = DATASET_URLS["liar"]
    zip_path = RAW_DIR / cfg["archive_name"]
    download_file(cfg["url"], zip_path)
    
    cfg["target_dir"].mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(cfg["target_dir"])
    print(f"Extracted LIAR files to {cfg['target_dir']}")
    
    # Validate files
    splits = ["train.tsv", "valid.tsv", "test.tsv"]
    summary = {}
    for s in splits:
        file_path = cfg["target_dir"] / s
        if not file_path.exists():
            raise FileNotFoundError(f"Missing expected LIAR split: {file_path}")
        df = pd.read_csv(file_path, sep="\t", header=None, names=LIAR_COLUMNS, quoting=3)
        # Validate schema & clean
        df = df.dropna(subset=["statement", "label"])
        invalid_labels = set(df["label"]) - LIAR_VALID_LABELS
        if invalid_labels:
            print(f"Warning: Unexpected labels found in {s}: {invalid_labels}")
        summary[s] = {
            "samples": len(df),
            "label_distribution": df["label"].value_counts().to_dict()
        }
        print(f"  {s}: {len(df)} samples. Distribution: {summary[s]['label_distribution']}")

    return summary

def prepare_fever():
    print("\n=== Preparing FEVER Dataset ===")
    cfg = DATASET_URLS["fever_dev"]
    dest_path = cfg["target_dir"] / cfg["archive_name"]
    download_file(cfg["url"], dest_path)
    
    # Process jsonl & build evidence corpus
    records = []
    with open(dest_path, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                records.append(json.loads(line))
                
    print(f"Loaded {len(records)} FEVER dev instances.")
    labels = [r.get("label") for r in records if "label" in r]
    label_counts = pd.Series(labels).value_counts().to_dict()
    print(f"  FEVER dev label distribution: {label_counts}")

    # Build evidence corpus from annotated evidence sets
    corpus_sentences = []
    sentence_seen = set()
    for item in records:
        evidence_sets = item.get("evidence", [])
        for ev_group in evidence_sets:
            for ev in ev_group:
                # ev format: [annotation_id, evidence_id, wiki_title, sentence_id]
                if len(ev) >= 4 and ev[2] is not None and ev[3] is not None:
                    wiki_title = str(ev[2])
                    sent_idx = int(ev[3])
                    key = f"{wiki_title}::{sent_idx}"
                    if key not in sentence_seen:
                        sentence_seen.add(key)
                        # In FEVER, the title itself and claim provide the context sentence identifier
                        corpus_sentences.append({
                            "doc_id": key,
                            "wiki_title": wiki_title.replace("_", " "),
                            "sentence_id": sent_idx,
                            "text": f"{wiki_title.replace('_', ' ')} (Sentence {sent_idx}): Evidence reference regarding {wiki_title.replace('_', ' ')}."
                        })
                        
    print(f"Constructed initial evidence corpus of {len(corpus_sentences)} unique annotated evidence anchors.")
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    with open(PROCESSED_DIR / "fever_evidence_anchors.json", "w", encoding="utf-8") as f:
        json.dump(corpus_sentences, f, indent=2)

    return {
        "samples": len(records),
        "label_distribution": label_counts,
        "unique_evidence_anchors": len(corpus_sentences)
    }

def prepare_jigsaw():
    print("\n=== Preparing Jigsaw Toxic Comment Dataset ===")
    cfg = DATASET_URLS["jigsaw_toxic"]
    gz_path = RAW_DIR / cfg["archive_name"]
    download_file(cfg["url"], gz_path)
    
    cfg["target_dir"].mkdir(parents=True, exist_ok=True)
    csv_dest = cfg["target_dir"] / "train.csv"
    if not csv_dest.exists() or csv_dest.stat().st_size == 0:
        print(f"Decompressing {gz_path.name} to {csv_dest}...")
        with gzip.open(gz_path, 'rb') as f_in, open(csv_dest, 'wb') as f_out:
            while True:
                buf = f_in.read(1024 * 1024)
                if not buf:
                    break
                f_out.write(buf)
        print("Decompression complete.")
        
    df = pd.read_csv(csv_dest)
    print(f"Loaded Jigsaw train.csv with {len(df)} comments.")
    print(f"Columns: {list(df.columns)}")
    
    # Missing handling
    df["comment_text"] = df["comment_text"].fillna("").astype(str)
    
    dist = {}
    for col in JIGSAW_LABEL_COLS:
        if col in df.columns:
            pos_count = int(df[col].sum())
            dist[col] = {
                "positive": pos_count,
                "negative": len(df) - pos_count,
                "prevalence": round(pos_count / len(df), 4)
            }
            print(f"  {col}: {pos_count} positive ({dist[col]['prevalence']*100:.2f}%)")
            
    return {
        "samples": len(df),
        "columns": list(df.columns),
        "label_distribution": dist
    }

def main():
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    
    reports = {}
    reports["liar"] = prepare_liar()
    reports["fever"] = prepare_fever()
    reports["jigsaw"] = prepare_jigsaw()
    
    summary_path = DATA_DIR / "dataset_manifest.json"
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(reports, f, indent=2)
    print(f"\nAll datasets prepared and verified! Summary written to {summary_path}")

if __name__ == "__main__":
    main()
