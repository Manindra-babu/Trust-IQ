import React, { useState, useEffect } from "react";
import { Search, Flame } from "lucide-react";
import { fetchEvaluationSummary, analyzeText } from "../services/api";

export const ToxicityPage: React.FC = () => {
  const [evalData, setEvalData] = useState<any>(null);
  const [comment, setComment] = useState("You are completely clueless and your edits on this article are destructive nonsense.");
  const [threshold, setThreshold] = useState(0.5);
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchEvaluationSummary()
      .then((data) => setEvalData(data.reports.toxicity))
      .catch((err) => console.error(err));
  }, []);

  const handleTest = async () => {
    if (!comment.trim()) return;
    setIsLoading(true);
    try {
      const res = await analyzeText(comment, "toxicity", threshold);
      setTestResult(res.toxicity);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const primaryLR = evalData?.primary_model;
  const comparison = evalData?.model_comparison;

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>
          Module C Deep-Dive
        </div>
        <h1 style={{ fontSize: "1.375rem", marginBottom: "0.2rem" }}>Toxicity & Hate Speech Multi-Label Classification</h1>
        <p style={{ fontSize: "0.8125rem" }}>
          True multi-label evaluation across 6 distinct categories on the official Jigsaw Toxic Comment benchmark. Compares balanced Logistic Regression against Naive Bayes and Linear SVM.
        </p>
      </div>

      {/* Model Comparison Table */}
      <div className="panel" style={{ marginBottom: "1.25rem" }}>
        <div className="panel-header">
          <span className="panel-title">
            <Flame size={16} color="var(--color-primary)" />
            Category Performance Comparison
          </span>
          <span className="badge badge-primary">Held-Out Test Set (8,000 Comments)</span>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>LR Precision</th>
                <th>LR Recall</th>
                <th>LR F1-Score</th>
                <th>LR ROC-AUC</th>
                <th>NB F1</th>
                <th>SVM F1</th>
              </tr>
            </thead>
            <tbody>
              {primaryLR?.per_label ? (
                Object.entries(primaryLR.per_label).map(([cat, m]: [string, any]) => (
                  <tr key={cat}>
                    <td style={{ fontWeight: 600, textTransform: "capitalize" }}>{cat.replace("_", " ")}</td>
                    <td className="tabular-numbers">{(m.precision * 100).toFixed(1)}%</td>
                    <td className="tabular-numbers">{(m.recall * 100).toFixed(1)}%</td>
                    <td className="tabular-numbers" style={{ fontWeight: 700, color: "var(--color-primary)" }}>
                      {(m.f1_score * 100).toFixed(1)}%
                    </td>
                    <td className="tabular-numbers">{(m.roc_auc * 100).toFixed(1)}%</td>
                    <td className="tabular-numbers" style={{ color: "var(--color-text-secondary)" }}>
                      {comparison?.multinomial_nb?.per_label?.[cat]
                        ? `${(comparison.multinomial_nb.per_label[cat].f1_score * 100).toFixed(1)}%`
                        : "-"}
                    </td>
                    <td className="tabular-numbers" style={{ color: "var(--color-text-secondary)" }}>
                      {comparison?.linear_svm?.per_label?.[cat]
                        ? `${(comparison.linear_svm.per_label[cat].f1_score * 100).toFixed(1)}%`
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7}>Metrics loading...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "1.25rem" }}>
        {/* Interactive Multi-Label Tester */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Interactive Comment Analyzer</span>
            <span className="badge badge-primary">Dynamic Thresholding</span>
          </div>

          <div className="form-group">
            <label className="form-label">Discussion Comment</label>
            <textarea
              className="form-control"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.2rem" }}>
              <span>Decision Threshold:</span>
              <strong className="tabular-numbers">{threshold.toFixed(2)}</strong>
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

          <button className="btn btn-primary" onClick={handleTest} disabled={isLoading} style={{ marginBottom: "0.85rem" }}>
            <Search size={14} />
            Evaluate Toxicity
          </button>

          {testResult && (
            <div style={{ padding: "0.75rem", backgroundColor: "var(--color-surface-subtle)", borderRadius: "var(--radius-xs)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>Overall Verdict:</span>
                <span className={`badge ${testResult.overall_toxic ? "badge-danger" : "badge-success"}`}>
                  {testResult.overall_toxic ? "Toxic Language Detected" : "Non-Toxic"}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem", marginBottom: "0.5rem" }}>
                {Object.values(testResult.categories).map((c: any) => (
                  <div key={c.label} style={{ padding: "0.35rem 0.45rem", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-xs)", backgroundColor: "#FFFFFF" }}>
                    <div style={{ fontSize: "0.625rem", textTransform: "capitalize" }}>{c.label.replace("_", " ")}</div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: c.is_positive ? "var(--color-danger)" : "inherit" }} className="tabular-numbers">
                      {(c.probability * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>

              {testResult.influential_tokens?.length > 0 && (
                <div style={{ fontSize: "0.71875rem" }}>
                  <strong>Trigger Features:</strong> {testResult.influential_tokens.join(", ")}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Ethical Considerations */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Ethical Boundaries</span>
            <span className="badge badge-neutral">Research Ethics</span>
          </div>

          <div style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
            <p style={{ marginBottom: "0.65rem" }}>
              <strong>Linguistic Surface Detection:</strong> Bag-of-words classifiers detect strong lexical associations with harassment or obscenity. They do not comprehend social intent or contextual reclaimed speech.
            </p>
            <p style={{ marginBottom: "0.65rem" }}>
              <strong>Not Character Assessment:</strong> A classification result pertains strictly to the linguistic characteristics of the submitted string. It is never an appraisal of the author's personhood or moral character.
            </p>
            <p>
              <strong>Threshold Sensitivity:</strong> Lowering the threshold captures subtle slurs at the expense of higher false positives on heated debate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
