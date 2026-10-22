import {
  UnifiedAnalysisResponse,
  ModelsStatusResponse,
  DatasetsResponse,
  EvaluationSummaryResponse,
  FairnessReport,
  TrainingStatusResponse
} from "../types";

const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? "http://127.0.0.1:8000/api" : "/api");

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}

export async function fetchModelsStatus(): Promise<ModelsStatusResponse> {
  const res = await fetch(`${API_BASE}/models`);
  if (!res.ok) throw new Error("Failed to load models status");
  return res.json();
}

export async function fetchDatasets(): Promise<DatasetsResponse> {
  const res = await fetch(`${API_BASE}/datasets`);
  if (!res.ok) throw new Error("Failed to load datasets manifest");
  return res.json();
}

export async function fetchEvaluationSummary(): Promise<EvaluationSummaryResponse> {
  const res = await fetch(`${API_BASE}/evaluation/summary`);
  if (!res.ok) throw new Error("Failed to load evaluation summary");
  return res.json();
}

export async function fetchFairnessReport(): Promise<FairnessReport> {
  const res = await fetch(`${API_BASE}/evaluation/fairness`);
  if (!res.ok) throw new Error("Failed to load fairness report");
  return res.json();
}

export async function analyzeText(text: string, mode = "full", threshold = 0.5): Promise<UnifiedAnalysisResponse> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, mode, toxicity_threshold: threshold })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Analysis failed" }));
    throw new Error(err.detail || "Analysis request failed");
  }
  return res.json();
}

export async function startTraining(module = "all", sampleLimit?: number) {
  const res = await fetch(`${API_BASE}/training/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ module, sample_limit: sampleLimit })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to start training" }));
    throw new Error(err.detail || "Training start failed");
  }
  return res.json();
}

export async function fetchTrainingStatus(): Promise<TrainingStatusResponse> {
  const res = await fetch(`${API_BASE}/training/status`);
  if (!res.ok) throw new Error("Failed to load training status");
  return res.json();
}
