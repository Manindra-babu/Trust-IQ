import React, { useState, useEffect } from "react";
import { Download, BarChart2 } from "lucide-react";
import { fetchEvaluationSummary } from "../services/api";

export const EvaluationPage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetchEvaluationSummary()
      .then((data) => setSummary(data.reports))
      .catch((err) => console.error(err));
  }, []);

  const downloadReportJson = (moduleKey: string, dataObj: any) => {
    const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trustiq_${moduleKey}_evaluation_report.json`;
    a.click();
  };

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>
          Experimental Verification
        </div>
        <h1 style={{ fontSize: "1.375rem", marginBottom: "0.2rem" }}>Model Evaluation & Benchmark Reports</h1>
        <p style={{ fontSize: "0.8125rem" }}>
          Traceable experimental performance reports generated from held-out test splits. All numbers reflect actual CPU training and testing runs.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Module A Card */}
        {summary?.evidence && (
          <div className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-title">Module A: FEVER Evidence Verification</span>
                <div style={{ fontSize: "0.71875rem", color: "var(--color-text-secondary)", marginTop: "0.15rem" }}>
                  Evaluated at: {summary.evidence.timestamp} | Train: {summary.evidence.train_samples} | Test: {summary.evidence.test_samples}
                </div>
              </div>
              <button
                className="btn btn-secondary"
                style={{ fontSize: "0.6875rem", padding: "0.2rem 0.5rem" }}
                onClick={() => downloadReportJson("evidence", summary.evidence)}
              >
                <Download size={12} /> Export JSON
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.85rem" }}>
              <div className="stat-box">
                <div className="stat-label">Accuracy</div>
                <div className="stat-value tabular-numbers" style={{ color: "var(--color-primary)" }}>
                  {(summary.evidence.metrics.accuracy * 100).toFixed(1)}%
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Macro F1-Score</div>
                <div className="stat-value tabular-numbers">
                  {(summary.evidence.metrics.macro_f1 * 100).toFixed(1)}%
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Retrieval Recall@1</div>
                <div className="stat-value tabular-numbers">
                  {(summary.evidence.metrics.retrieval["Recall@1"] * 100).toFixed(1)}%
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Retrieval Recall@5</div>
                <div className="stat-value tabular-numbers" style={{ color: "var(--color-success)" }}>
                  {(summary.evidence.metrics.retrieval["Recall@5"] * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Module B Card */}
        {summary?.misinformation && (
          <div className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-title">Module B: LIAR Misinformation Benchmark</span>
                <div style={{ fontSize: "0.71875rem", color: "var(--color-text-secondary)", marginTop: "0.15rem" }}>
                  Evaluated at: {summary.misinformation.timestamp} | Train: {summary.misinformation.splits.train} | Test: {summary.misinformation.splits.test}
                </div>
              </div>
              <button
                className="btn btn-secondary"
                style={{ fontSize: "0.6875rem", padding: "0.2rem 0.5rem" }}
                onClick={() => downloadReportJson("misinformation", summary.misinformation)}
              >
                <Download size={12} /> Export JSON
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.85rem" }}>
              <div className="stat-box">
                <div className="stat-label">6-Class LR Accuracy</div>
                <div className="stat-value tabular-numbers" style={{ color: "var(--color-primary)" }}>
                  {(summary.misinformation.six_class_benchmark.primary_model_lr.accuracy * 100).toFixed(1)}%
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">6-Class Naive Bayes</div>
                <div className="stat-value tabular-numbers">
                  {(summary.misinformation.six_class_benchmark.baseline_model_nb.accuracy * 100).toFixed(1)}%
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">3-Class Accuracy</div>
                <div className="stat-value tabular-numbers" style={{ color: "var(--color-success)" }}>
                  {(summary.misinformation.three_class_experiment.accuracy * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Module C Card */}
        {summary?.toxicity && (
          <div className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-title">Module C: Jigsaw Toxicity Multi-Label Benchmark</span>
                <div style={{ fontSize: "0.71875rem", color: "var(--color-text-secondary)", marginTop: "0.15rem" }}>
                  Evaluated at: {summary.toxicity.timestamp} | Train: {summary.toxicity.train_samples} | Test: {summary.toxicity.test_samples}
                </div>
              </div>
              <button
                className="btn btn-secondary"
                style={{ fontSize: "0.6875rem", padding: "0.2rem 0.5rem" }}
                onClick={() => downloadReportJson("toxicity", summary.toxicity)}
              >
                <Download size={12} /> Export JSON
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
              <div className="stat-box">
                <div className="stat-label">Primary LR Macro F1-Score</div>
                <div className="stat-value tabular-numbers" style={{ color: "var(--color-primary)" }}>
                  {(summary.toxicity.primary_model.macro_f1 * 100).toFixed(1)}%
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Primary LR Macro ROC-AUC</div>
                <div className="stat-value tabular-numbers" style={{ color: "var(--color-success)" }}>
                  {(summary.toxicity.primary_model.macro_roc_auc * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
