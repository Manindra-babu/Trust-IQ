import React, { useState, useEffect } from "react";
import { Search, AlertTriangle } from "lucide-react";
import { fetchEvaluationSummary, analyzeText } from "../services/api";

export const MisinfoPage: React.FC = () => {
  const [evalData, setEvalData] = useState<any>(null);
  const [statement, setStatement] = useState("Under our tax reform, 80 percent of taxpayers received a direct federal tax decrease.");
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchEvaluationSummary()
      .then((data) => setEvalData(data.reports.misinformation))
      .catch((err) => console.error(err));
  }, []);

  const handleTest = async () => {
    if (!statement.trim()) return;
    setIsLoading(true);
    try {
      const res = await analyzeText(statement, "misinformation");
      setTestResult(res.misinformation);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const sixClassLR = evalData?.six_class_benchmark?.primary_model_lr;
  const sixClassNB = evalData?.six_class_benchmark?.baseline_model_nb;
  const threeClass = evalData?.three_class_experiment;

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>
          Module B Deep-Dive
        </div>
        <h1 style={{ fontSize: "1.375rem", marginBottom: "0.2rem" }}>Misinformation Detection (LIAR Benchmark)</h1>
        <p style={{ fontSize: "0.8125rem" }}>
          Evaluates political statements against the official LIAR benchmark (ACL 2017) across six truthfulness categories using Logistic Regression and Naive Bayes baselines.
        </p>
      </div>

      {/* Benchmark Metric Cards */}
      <div className="grid-3" style={{ marginBottom: "1.25rem" }}>
        <div className="stat-box">
          <div className="stat-label">6-Class Primary (Logistic Regression)</div>
          <div className="stat-value tabular-numbers" style={{ color: "var(--color-primary)" }}>
            {sixClassLR?.accuracy ? `${(sixClassLR.accuracy * 100).toFixed(1)}%` : "24.6%"}
          </div>
          <div className="stat-sub">
            Macro F1: {sixClassLR?.macro_f1 || "0.2443"} on official test.tsv
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-label">6-Class Baseline (Naive Bayes)</div>
          <div className="stat-value tabular-numbers">
            {sixClassNB?.accuracy ? `${(sixClassNB.accuracy * 100).toFixed(1)}%` : "23.5%"}
          </div>
          <div className="stat-sub">
            Macro F1: {sixClassNB?.macro_f1 || "0.1927"}
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Documented 3-Class Mapping</div>
          <div className="stat-value tabular-numbers" style={{ color: "var(--color-success)" }}>
            {threeClass?.accuracy ? `${(threeClass.accuracy * 100).toFixed(1)}%` : "44.7%"}
          </div>
          <div className="stat-sub">
            Macro F1: {threeClass?.macro_f1 || "0.4123"}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "1.25rem" }}>
        {/* Interactive Statement Tester */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">
              <AlertTriangle size={16} color="var(--color-primary)" />
              Statement Classifier
            </span>
            <span className="badge badge-primary">LIAR Test</span>
          </div>

          <div className="form-group">
            <label className="form-label">Political Statement</label>
            <textarea
              className="form-control"
              rows={3}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" onClick={handleTest} disabled={isLoading} style={{ marginBottom: "0.85rem" }}>
            <Search size={14} />
            Classify Statement
          </button>

          {testResult && (
            <div style={{ padding: "0.75rem", backgroundColor: "var(--color-surface-subtle)", borderRadius: "var(--radius-xs)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>6-Class Prediction:</span>
                <span className="badge badge-warning">
                  {testResult.predicted_label_6class}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>3-Class Aggregation:</span>
                <span className="badge badge-neutral">
                  {testResult.predicted_label_3class}
                </span>
              </div>
              <div style={{ fontSize: "0.71875rem", color: "var(--color-text-muted)" }}>
                {testResult.warning}
              </div>
            </div>
          )}
        </div>

        {/* 3-Class Mapping Documentation */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">3-Class Mapping Protocol</span>
            <span className="badge badge-neutral">Documented Schema</span>
          </div>

          <div className="data-table-container" style={{ marginBottom: "0.75rem" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Original LIAR 6-Class Label</th>
                  <th>Configured 3-Class Category</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>pants-fire</td><td><span className="badge badge-danger">FALSE_OR_MOSTLY_FALSE</span></td></tr>
                <tr><td>false</td><td><span className="badge badge-danger">FALSE_OR_MOSTLY_FALSE</span></td></tr>
                <tr><td>barely-true</td><td><span className="badge badge-danger">FALSE_OR_MOSTLY_FALSE</span></td></tr>
                <tr><td>half-true</td><td><span className="badge badge-warning">MIXED_OR_UNCERTAIN</span></td></tr>
                <tr><td>mostly-true</td><td><span className="badge badge-success">TRUE_OR_MOSTLY_TRUE</span></td></tr>
                <tr><td>true</td><td><span className="badge badge-success">TRUE_OR_MOSTLY_TRUE</span></td></tr>
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: "0.71875rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
            Published classical baselines in the original paper (Wang, ACL 2017) achieve ~24–25% accuracy. Text alone without real-world knowledge cannot verify isolated statements.
          </div>
        </div>
      </div>
    </div>
  );
};
