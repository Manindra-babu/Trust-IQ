"""
Tests for Length-Aware Fairness Evaluation metrics and bootstrap intervals.
"""

import numpy as np
from scripts.evaluate_fairness import compute_group_metrics, bootstrap_ci

def test_compute_group_metrics():
    y_true = np.array([1, 1, 0, 0, 1])
    y_pred = np.array([1, 0, 0, 1, 1])
    metrics = compute_group_metrics(y_true, y_pred)
    
    assert metrics["samples"] == 5
    assert metrics["positive_count"] == 3
    assert metrics["negative_count"] == 2
    assert "precision" in metrics
    assert "recall" in metrics
    assert "f1_score" in metrics
    assert "fpr" in metrics
    assert "fnr" in metrics

def test_bootstrap_ci():
    rng = np.random.RandomState(42)
    y_true = rng.randint(0, 2, size=100)
    y_pred = rng.randint(0, 2, size=100)
    ci = bootstrap_ci(y_true, y_pred, n_bootstraps=50)
    
    assert "f1_ci" in ci
    assert len(ci["f1_ci"]) == 2
    assert ci["f1_ci"][0] <= ci["f1_ci"][1]
