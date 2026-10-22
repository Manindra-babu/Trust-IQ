"""
TRUSTIQ Master Training & Evaluation Pipeline
Runs all 4 classical ML pipelines sequentially:
1. Module A: Evidence Verification (FEVER)
2. Module B: Misinformation Detection (LIAR)
3. Module C: Toxicity Classification (Jigsaw)
4. Module D: Length-Aware Fairness Evaluation (Jigsaw cohorts)
"""

import os
import sys
import time
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

def main():
    print("=" * 60)
    print("TRUSTIQ UNIFIED ML TRAINING & EVALUATION SUITE")
    print("=" * 60)
    total_start = time.time()
    
    # 1. Module A: FEVER Evidence
    print("\n>>> STEP 1/4: Training Module A (Evidence & Faithfulness)...")
    from scripts.train_evidence import train_and_evaluate as train_evidence
    ev_report = train_evidence()
    
    # 2. Module B: LIAR Misinformation
    print("\n>>> STEP 2/4: Training Module B (Misinformation Detection)...")
    from scripts.train_misinformation import train_and_evaluate as train_misinfo
    mi_report = train_misinfo()
    
    # 3. Module C: Jigsaw Toxicity
    print("\n>>> STEP 3/4: Training Module C (Toxicity Classification)...")
    from scripts.train_toxicity import train_and_evaluate as train_toxicity
    tox_report = train_toxicity(sample_limit=40000)
    
    # 4. Module D: Length Fairness
    print("\n>>> STEP 4/4: Evaluating Module D (Length-Aware Fairness)...")
    from scripts.evaluate_fairness import evaluate_length_fairness
    fair_report = evaluate_length_fairness()
    
    total_dur = time.time() - total_start
    print("\n" + "=" * 60)
    print(f"ALL TRUSTIQ ML MODULES SUCCESSFULLY TRAINED & EVALUATED IN {total_dur:.1f} SECONDS!")
    print("=" * 60)

if __name__ == "__main__":
    main()
