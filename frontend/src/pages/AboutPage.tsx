import React from "react";

export const AboutPage: React.FC = () => {
  return (
    <div style={{ maxWidth: "860px", margin: "2.5rem auto 3rem" }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
          Platform Architecture & Rationale
        </div>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.35rem" }}>About TRUSTIQ & Methodology</h1>
        <p style={{ fontSize: "0.9375rem" }}>
          Unified AI Trust, Evidence, Safety and Fairness Intelligence System.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ marginBottom: "0.65rem", fontSize: "1.15rem" }}>Research Objectives</h2>
        <p style={{ marginBottom: "0.85rem", lineHeight: 1.6 }}>
          TRUSTIQ was developed to address four distinct challenges in contemporary natural language processing without relying on black-box generative models or hosted commercial APIs:
        </p>
        <ul style={{ paddingLeft: "1.25rem", color: "var(--color-text-secondary)", lineHeight: 1.65, fontSize: "0.84375rem" }}>
          <li><strong>Evidential Faithfulness:</strong> Checking whether a claim is supported, refuted, or unverified given retrieved evidence references from Wikipedia.</li>
          <li><strong>Misinformation Detection:</strong> Investigating the discriminative power and inherent limitations of classical lexical models on political fact-checking corpora.</li>
          <li><strong>Toxicity & Hate Speech Analysis:</strong> Multi-label decomposition of hostile discourse without collapsing nuanced harm categories into an arbitrary single score.</li>
          <li><strong>Length-Aware Classification Fairness:</strong> Measuring statistical performance disparities between brief, standard, and verbose text comments.</li>
        </ul>
      </div>

      <div className="panel">
        <h2 style={{ marginBottom: "0.65rem", fontSize: "1.15rem" }}>Why Classical Machine Learning?</h2>
        <p style={{ marginBottom: "0.75rem", lineHeight: 1.6 }}>
          Modern natural language benchmarks are often dominated by multi-billion parameter neural networks whose decision surfaces cannot be fully inspected or reproduced on standard consumer hardware.
        </p>
        <p style={{ marginBottom: "0.85rem", lineHeight: 1.6 }}>
          By employing TF-IDF n-gram vectorization alongside balanced Logistic Regression, Multinomial Naive Bayes, and Linear SVMs, TRUSTIQ ensures:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
          <div style={{ padding: "0.75rem 0.85rem", backgroundColor: "var(--color-surface-subtle)", borderRadius: "var(--radius-xs)" }}>
            <div style={{ fontWeight: 600, fontSize: "0.8125rem", marginBottom: "0.2rem" }}>Deterministic Reproducibility</div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
              Training pipelines execute in under 30 seconds on a standard Windows 11 laptop CPU without external GPU dependencies.
            </div>
          </div>
          <div style={{ padding: "0.75rem 0.85rem", backgroundColor: "var(--color-surface-subtle)", borderRadius: "var(--radius-xs)" }}>
            <div style={{ fontWeight: 600, fontSize: "0.8125rem", marginBottom: "0.2rem" }}>Feature-Level Attribution</div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
              Model weights map directly back to unigram and bigram vocabularies, enabling transparent coefficient inspection.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
