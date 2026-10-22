import React, { useState } from "react";
import { Search, Clock, AlertTriangle, FileCheck2, Flame, RefreshCw, X, ArrowUpRight } from "lucide-react";
import { analyzeText } from "../services/api";
import type { UnifiedAnalysisResponse, ModelsStatusResponse } from "../types";

interface WorkspacePageProps {
  modelsStatus: ModelsStatusResponse | null;
  onNavigate: (page: string) => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({ modelsStatus, onNavigate }) => {
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<string>("full");
  const [threshold, setThreshold] = useState<number>(0.5);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UnifiedAnalysisResponse | null>(null);

  const sampleInputs = [
    {
      title: "FEVER Claim",
      text: "The Roman Empire was the post-Republican period of ancient Rome.",
      mode: "evidence"
    },
    {
      title: "PolitiFact Claim",
      text: "Under our tax reform, 80 percent of middle-class families received a direct federal tax decrease.",
      mode: "misinformation"
    },
    {
      title: "Civil Comment",
      text: "Thank you for contributing to this article. Please provide reliable secondary citations to verify the dates.",
      mode: "toxicity"
    },
    {
      title: "Harassment Sample",
      text: "You are completely stupid and your edits are pure garbage. Get off this page immediately.",
      mode: "toxicity"
    }
  ];

  const handleAnalyze = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      setError("Please provide text to analyze.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeText(trimmed, mode, threshold);
      setResult(data);

      // Save to localStorage history
      const prev = JSON.parse(localStorage.getItem("trustiq_history") || "[]");
      const summaryText = data.evidence?.predicted_label
        ? `FEVER: ${data.evidence.predicted_label}`
        : data.misinformation?.predicted_label_6class
        ? `LIAR: ${data.misinformation.predicted_label_6class}`
        : `Toxic: ${data.toxicity?.overall_toxic ? 'Detected' : 'Clean'}`;

      const historyItem = {
        id: Date.now().toString(),
        text: trimmed,
        mode,
        timestamp: data.timestamp,
        latency_ms: data.processing_time_ms,
        summary: summaryText
      };
      localStorage.setItem("trustiq_history", JSON.stringify([historyItem, ...prev.slice(0, 49)]));
    } catch (err: any) {
      setError(err.message || "Failed to communicate with backend ML server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Top Workspace Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.375rem", marginBottom: "0.2rem" }}>Text Analysis Workspace</h1>
          <p style={{ fontSize: "0.8125rem" }}>
            Submit text for real-time inference across classical evidence retrieval, misinformation classification, and multi-label toxicity models.
          </p>
        </div>

        {/* Quiet Readiness Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span className="badge badge-success" style={{ fontSize: "0.6875rem" }}>
            4 Models Operational
          </span>
          <span className="mono-tag">FastAPI Localhost (Port 8000)</span>
        </div>
      </div>

      {/* Main Workspace Layout (Two-Column on Desktop) */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "1.25rem", alignItems: "start" }}>
        {/* Left Column: Input Panel */}
        <div className="panel">
          {/* Mode Selector Tabs */}
          <div style={{ display: "flex", gap: "0.25rem", padding: "0.2rem", backgroundColor: "var(--color-surface-subtle)", borderRadius: "var(--radius-sm)", marginBottom: "0.85rem" }}>
            {[
              { id: "full", label: "Full Analysis" },
              { id: "evidence", label: "Evidence Only" },
              { id: "misinformation", label: "Misinformation Only" },
              { id: "toxicity", label: "Toxicity Only" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id)}
                style={{
                  flex: 1,
                  padding: "0.35rem 0.5rem",
                  fontSize: "0.75rem",
                  fontWeight: mode === tab.id ? 600 : 500,
                  color: mode === tab.id ? "var(--color-primary)" : "var(--color-text-secondary)",
                  backgroundColor: mode === tab.id ? "var(--color-surface)" : "transparent",
                  borderRadius: "var(--radius-xs)",
                  boxShadow: mode === tab.id ? "var(--shadow-subtle)" : "none",
                  textAlign: "center"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Text Area */}
          <div className="form-group" style={{ marginBottom: "0.5rem" }}>
            <textarea
              className="form-control"
              placeholder="Enter a claim, political statement, debate comment, or document passage..."
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ fontSize: "0.84375rem" }}
            />
          </div>

          {/* Input Footer: Counts & Sample Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem", fontSize: "0.71875rem", color: "var(--color-text-muted)" }}>
            <span>
              {inputText.length} characters | {inputText.split(/\s+/).filter(Boolean).length} tokens
            </span>
            {inputText && (
              <button
                onClick={() => {
                  setInputText("");
                  setResult(null);
                  setError(null);
                }}
                style={{ display: "flex", alignItems: "center", gap: "0.2rem", color: "var(--color-text-muted)" }}
              >
                <X size={12} /> Clear text
              </button>
            )}
          </div>

          {/* Research Samples */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.35rem" }}>
              Load Test Examples:
            </div>
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {sampleInputs.map((s, idx) => (
                <button
                  key={idx}
                  className="btn btn-secondary"
                  style={{ fontSize: "0.6875rem", padding: "0.2rem 0.5rem" }}
                  onClick={() => {
                    setInputText(s.text);
                    setMode(s.mode);
                  }}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Controls (Threshold Slider) */}
          {mode !== "evidence" && mode !== "misinformation" && (
            <div style={{ padding: "0.65rem 0.75rem", backgroundColor: "var(--color-surface-subtle)", borderRadius: "var(--radius-xs)", marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.71875rem", marginBottom: "0.25rem" }}>
                <span style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Toxicity Decision Threshold:</span>
                <span className="tabular-numbers" style={{ fontWeight: 700 }}>{threshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
          )}

          {/* Primary Action Button */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              className="btn btn-primary"
              style={{ padding: "0.55rem 1.25rem", fontSize: "0.84375rem" }}
              onClick={handleAnalyze}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} />
                  Running Inference...
                </>
              ) : (
                <>
                  <Search size={14} />
                  Analyze Text
                </>
              )}
            </button>

            <span className="mono-tag">Scikit-Learn Sparse Inference</span>
          </div>

          {error && (
            <div className="alert alert-warning" style={{ marginTop: "0.85rem" }}>
              <AlertTriangle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Column: Execution Information & Quick Status */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Model Specifications</span>
              <span className="badge badge-neutral">Windows 11 CPU</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.78125rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Module A (FEVER):</span>
                <span style={{ fontWeight: 600 }}>BM25 Retrieval + 3-Class LR</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Module B (LIAR):</span>
                <span style={{ fontWeight: 600 }}>6-Class LR & Naive Bayes</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Module C (Jigsaw):</span>
                <span style={{ fontWeight: 600 }}>6-Category Multi-Label LR</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Module D (Fairness):</span>
                <span style={{ fontWeight: 600 }}>Short / Med / Long Cohorts</span>
              </div>
            </div>

            <div style={{ marginTop: "0.85rem", paddingTop: "0.65rem", borderTop: "1px solid var(--color-border-subtle)", fontSize: "0.71875rem", color: "var(--color-text-muted)" }}>
              All models execute in memory via scikit-learn without external inference servers.
            </div>
          </div>
        </div>
      </div>

      {/* Inference Results Section */}
      {result && (
        <div style={{ marginTop: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.5rem" }}>
            <h2>Inference Results</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
              <Clock size={13} />
              <span>Execution Time: <strong className="tabular-numbers">{result.processing_time_ms} ms</strong></span>
              <span>at {result.timestamp}</span>
            </div>
          </div>

          {/* Module A Result */}
          {result.evidence && (
            <div className="panel" style={{ marginBottom: "1rem" }}>
              <div className="panel-header">
                <div className="panel-title">
                  <FileCheck2 size={16} color="var(--color-primary)" />
                  <span>Module A: Evidence Verification (FEVER)</span>
                </div>
                {result.evidence.predicted_label && (
                  <span
                    className={`badge ${
                      result.evidence.predicted_label === "SUPPORTS"
                        ? "badge-success"
                        : result.evidence.predicted_label === "REFUTES"
                        ? "badge-danger"
                        : "badge-warning"
                    }`}
                  >
                    Verdict: {result.evidence.predicted_label}
                  </span>
                )}
              </div>

              {/* Probability Breakdown */}
              {result.evidence.confidence_scores && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.65rem", marginBottom: "0.85rem" }}>
                  {Object.entries(result.evidence.confidence_scores).map(([label, score]) => (
                    <div key={label} style={{ padding: "0.5rem 0.65rem", backgroundColor: "var(--color-surface-subtle)", borderRadius: "var(--radius-xs)" }}>
                      <div style={{ fontSize: "0.6875rem", color: "var(--color-text-secondary)" }}>{label}</div>
                      <div style={{ fontSize: "1rem", fontWeight: 700 }} className="tabular-numbers">
                        {(score * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Retrieved Candidate Sentences */}
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "0.4rem" }}>
                  Retrieved Wikipedia Reference Knowledge (BM25 / Cosine Ranking):
                </div>

                {result.evidence.retrieved_evidence.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    {result.evidence.retrieved_evidence.map((ev, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "0.6rem 0.75rem",
                          border: "1px solid var(--color-border-subtle)",
                          borderRadius: "var(--radius-xs)",
                          backgroundColor: "#FFFFFF"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                          <span style={{ fontWeight: 600, fontSize: "0.75rem", color: "var(--color-primary)" }}>
                            {ev.wiki_title} (Sentence {ev.sentence_id})
                          </span>
                          <span className="badge badge-neutral" style={{ fontSize: "0.625rem" }}>
                            Relevance: {(ev.relevance_score * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div style={{ fontSize: "0.78125rem", color: "var(--color-text-primary)" }}>
                          "{ev.text}"
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontStyle: "italic", padding: "0.6rem", backgroundColor: "var(--color-surface-subtle)", borderRadius: "var(--radius-xs)" }}>
                    No verifiable evidence sentences found above similarity threshold.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Module B Result */}
          {result.misinformation && (
            <div className="panel" style={{ marginBottom: "1rem" }}>
              <div className="panel-header">
                <div className="panel-title">
                  <AlertTriangle size={16} color="var(--color-primary)" />
                  <span>Module B: Misinformation Classifier (LIAR)</span>
                </div>
                {result.misinformation.predicted_label_6class && (
                  <span className="badge badge-neutral">
                    LIAR 6-Class: {result.misinformation.predicted_label_6class}
                  </span>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.75rem" }}>
                <div style={{ padding: "0.65rem 0.85rem", backgroundColor: "var(--color-surface-subtle)", borderRadius: "var(--radius-xs)" }}>
                  <div style={{ fontSize: "0.6875rem", color: "var(--color-text-secondary)" }}>Documented 3-Class Mapping</div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 700, marginTop: "0.15rem" }}>
                    {result.misinformation.predicted_label_3class}
                  </div>
                </div>

                <div style={{ padding: "0.65rem 0.85rem", backgroundColor: "var(--color-surface-subtle)", borderRadius: "var(--radius-xs)" }}>
                  <div style={{ fontSize: "0.6875rem", color: "var(--color-text-secondary)" }}>Baseline Model Comparison</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, marginTop: "0.15rem" }}>
                    {result.misinformation.model_comparison_baseline}
                  </div>
                </div>
              </div>

              {result.misinformation.confidence_scores_6class && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.4rem", marginBottom: "0.75rem" }}>
                  {Object.entries(result.misinformation.confidence_scores_6class).map(([lbl, p]) => (
                    <div key={lbl} style={{ padding: "0.4rem", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-xs)", textAlign: "center" }}>
                      <div style={{ fontSize: "0.625rem", color: "var(--color-text-secondary)" }}>{lbl}</div>
                      <div style={{ fontSize: "0.84375rem", fontWeight: 700 }} className="tabular-numbers">
                        {(p * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="alert alert-warning" style={{ margin: 0, fontSize: "0.75rem" }}>
                <span>{result.misinformation.warning}</span>
              </div>
            </div>
          )}

          {/* Module C Result */}
          {result.toxicity && (
            <div className="panel" style={{ marginBottom: "1rem" }}>
              <div className="panel-header">
                <div className="panel-title">
                  <Flame size={16} color="var(--color-primary)" />
                  <span>Module C: Toxicity & Safety Analysis (Jigsaw)</span>
                </div>
                <div style={{ display: "flex", gap: "0.45rem", alignItems: "center" }}>
                  <span className="badge badge-neutral">Cohort: {result.toxicity.length_cohort}</span>
                  <span className={`badge ${result.toxicity.overall_toxic ? "badge-danger" : "badge-success"}`}>
                    {result.toxicity.overall_toxic ? "Toxic Language Detected" : "Non-Toxic"}
                  </span>
                </div>
              </div>

              {/* 6 Categories Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.65rem", marginBottom: "0.85rem" }}>
                {Object.values(result.toxicity.categories).map((cat) => (
                  <div
                    key={cat.label}
                    style={{
                      padding: "0.65rem 0.75rem",
                      border: "1px solid var(--color-border-subtle)",
                      borderRadius: "var(--radius-xs)",
                      backgroundColor: cat.is_positive ? "var(--color-danger-bg)" : "var(--color-surface)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "capitalize" }}>
                        {cat.label.replace("_", " ")}
                      </span>
                      <span className={`badge ${cat.is_positive ? "badge-danger" : "badge-neutral"}`} style={{ fontSize: "0.625rem" }}>
                        {cat.is_positive ? "Detected" : "Clean"}
                      </span>
                    </div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 700, color: cat.is_positive ? "var(--color-danger)" : "var(--color-text-primary)" }} className="tabular-numbers">
                      {(cat.probability * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>

              {result.toxicity.influential_tokens.length > 0 && (
                <div style={{ fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                  <strong>Trigger Features:</strong> {result.toxicity.influential_tokens.join(", ")}
                </div>
              )}

              <div style={{ fontSize: "0.71875rem", color: "var(--color-text-muted)" }}>
                {result.toxicity.warning}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
