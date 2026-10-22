"""
Tests for FastAPI endpoints using TestClient.
"""

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_models_endpoint():
    res = client.get("/api/models")
    assert res.status_code == 200
    data = res.json()["models"]
    assert "evidence" in data
    assert "misinformation" in data
    assert "toxicity" in data
    assert "fairness" in data

def test_datasets_endpoint():
    res = client.get("/api/datasets")
    assert res.status_code == 200
    assert len(res.json()["datasets"]) >= 3

def test_evaluation_summary():
    res = client.get("/api/evaluation/summary")
    assert res.status_code == 200
    reports = res.json()["reports"]
    assert reports["evidence"] is not None
    assert reports["misinformation"] is not None
    assert reports["toxicity"] is not None
    assert reports["fairness"] is not None

def test_analyze_endpoint():
    res = client.post("/api/analyze", json={
        "text": "The government released a public health guideline.",
        "mode": "full",
        "toxicity_threshold": 0.5
    })
    assert res.status_code == 200
    data = res.json()
    assert "input_text" in data
    assert "processing_time_ms" in data
    assert data["evidence"] is not None
    assert data["misinformation"] is not None
    assert data["toxicity"] is not None

def test_analyze_empty_input_rejected():
    res = client.post("/api/analyze", json={
        "text": "   ",
        "mode": "full"
    })
    assert res.status_code == 400
