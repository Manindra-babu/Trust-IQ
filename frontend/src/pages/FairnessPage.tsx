import React, { useState, useEffect } from "react";
import { Scale, BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { fetchFairnessReport } from "../services/api";
import type { FairnessReport } from "../types";

export const FairnessPage: React.FC = () => {
  const [fairness, setFairness] = useState<FairnessReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFairnessReport()
      .then((data) => {
        setFairness(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="panel" style={{ padding: "2rem", textAlign: "center" }}>Loading fairness evaluation metrics...</div>;
  }

  if (error || !fairness) {
    return (
      <div className="panel" style={{ padding: "2rem" }}>
        <h3>Fairness Evaluation Unavailable</h3>
        <p style={{ marginTop: "0.5rem" }}>{error || "Run scripts/evaluate_fairness.py to generate genuine metrics."}</p>
      </div>
    );
  }

  const chartData = [
    {
      group: "Short (<25)",
      f1: parseFloat((fairness.groups.short.f1_score * 100).toFixed(1)),
      fpr: parseFloat((fairness.groups.short.fpr * 100).toFixed(1)),
      fnr: parseFloat((fairness.groups.short.fnr * 100).toFixed(1))
    },
    {
      group: "Medium (25-100)",
      f1: parseFloat((fairness.groups.medium.f1_score * 100).toFixed(1)),
      fpr: parseFloat((fairness.groups.medium.fpr * 100).toFixed(1)),
      fnr: parseFloat((fairness.groups.medium.fnr * 100).toFixed(1))
    },
    {
      group: "Long (>100)",
      f1: parseFloat((fairness.groups.long.f1_score * 100).toFixed(1)),
      fpr: parseFloat((fairness.groups.long.fpr * 100).toFixed(1)),
      fnr: parseFloat((fairness.groups.long.fnr * 100).toFixed(1))
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>
          Module D Research Dashboard
        </div>
        <h1 style={{ fontSize: "1.375rem", marginBottom: "0.2rem" }}>Length-Aware Fairness & Disparity Evaluator</h1>
        <p style={{ fontSize: "0.8125rem" }}>
          Empirical evaluation of toxicity classification disparities across comment length cohorts on held-out Jigsaw test data (8,000 samples).
        </p>
      </div>

      {/* Cohort Metric Summary Cards */}
      <div className="grid-3" style={{ marginBottom: "1.25rem" }}>
        {Object.entries(fairness.groups).map(([groupName, g]) => (
          <div key={groupName} className="panel">
            <div className="panel-header">
              <span style={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.8125rem" }}>
                Cohort: {groupName}
              </span>
              <span className="badge badge-neutral">{g.samples} samples</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginBottom: "0.65rem" }}>
              <div>
                <div style={{ fontSize: "0.6875rem", color: "var(--color-text-secondary)" }}>F1-Score</div>
                <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--color-primary)" }} className="tabular-numbers">
                  {(g.f1_score * 100).toFixed(1)}%
                </div>
                <div style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)" }}>
                  95% CI: [{(g.confidence_intervals_95.f1_ci[0]*100).toFixed(1)}%, {(g.confidence_intervals_95.f1_ci[1]*100).toFixed(1)}%]
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.6875rem", color: "var(--color-text-secondary)" }}>False Positive Rate</div>
                <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--color-warning)" }} className="tabular-numbers">
                  {(g.fpr * 100).toFixed(1)}%
                </div>
                <div style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)" }}>
                  95% CI: [{(g.confidence_intervals_95.fpr_ci[0]*100).toFixed(1)}%, {(g.confidence_intervals_95.fpr_ci[1]*100).toFixed(1)}%]
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--color-border-subtle)", paddingTop: "0.45rem", fontSize: "0.71875rem", color: "var(--color-text-secondary)", display: "flex", justifyContent: "space-between" }}>
              <span>False Negative Rate: <strong>{(g.fnr * 100).toFixed(1)}%</strong></span>
              <span>Base Rate: <strong>{(g.base_rate * 100).toFixed(1)}%</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Disparity Chart Container */}
      <div className="panel" style={{ marginBottom: "1.25rem" }}>
        <div className="panel-header">
          <span className="panel-title">
            <BarChart2 size={16} color="var(--color-primary)" />
            Cross-Cohort Metric Comparison (Percentage)
          </span>
          <span className="badge badge-primary">Empirical Held-Out Split</span>
        </div>

        <div style={{ height: 260, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 25, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EBEFEA" />
              <XAxis dataKey="group" stroke="#58635B" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#58635B" fontSize={11} />
              <Tooltip formatter={(value: any) => [`${value}%`, '']} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="f1" name="F1-Score (%)" fill="#176B52" />
              <Bar dataKey="fpr" name="False Positive Rate (%)" fill="#996013" />
              <Bar dataKey="fnr" name="False Negative Rate (%)" fill="#A83333" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Core Research Questions */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">
            <Scale size={16} color="var(--color-primary)" />
            Five Fundamental Fairness Research Questions
          </span>
          <span className="badge badge-neutral">Statistical Findings</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.8125rem", color: "var(--color-text-primary)", marginBottom: "0.15rem" }}>
              1. Does classification performance differ across comment lengths?
            </div>
            <p style={{ fontSize: "0.78125rem", color: "var(--color-text-secondary)" }}>
              {fairness.research_questions.q1_performance_difference}
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: "0.8125rem", color: "var(--color-text-primary)", marginBottom: "0.15rem" }}>
              2. Which metrics show the largest differences?
            </div>
            <p style={{ fontSize: "0.78125rem", color: "var(--color-text-secondary)" }}>
              {fairness.research_questions.q2_largest_differences}
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: "0.8125rem", color: "var(--color-text-primary)", marginBottom: "0.15rem" }}>
              3. Are the observed differences supported by sufficient data?
            </div>
            <p style={{ fontSize: "0.78125rem", color: "var(--color-text-secondary)" }}>
              {fairness.research_questions.q3_sufficient_data}
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: "0.8125rem", color: "var(--color-text-primary)", marginBottom: "0.15rem" }}>
              4. What errors occur most frequently in each group?
            </div>
            <p style={{ fontSize: "0.78125rem", color: "var(--color-text-secondary)" }}>
              {fairness.research_questions.q4_frequent_errors}
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: "0.8125rem", color: "var(--color-text-primary)", marginBottom: "0.15rem" }}>
              5. What limitations prevent a stronger fairness conclusion?
            </div>
            <p style={{ fontSize: "0.78125rem", color: "var(--color-text-secondary)" }}>
              {fairness.research_questions.q5_limitations}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
