import React from "react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="workbench-footer">
      <div className="workbench-footer-inner">
        {/* Column 1: Platform Overview */}
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-primary)", marginBottom: "0.45rem" }}>
            TRUSTIQ Research Platform
          </div>
          <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", lineHeight: 1.55, margin: 0 }}>
            Unified AI Trust, Evidence, Safety and Fairness Intelligence System. Operating on verifiable classical machine learning algorithms with reproducible provenance, local CPU execution, and transparent boundary documentation.
          </p>
        </div>

        {/* Column 2: Research Modules */}
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-primary)", marginBottom: "0.6rem" }}>
            Research Modules
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.8125rem" }}>
            <button
              onClick={() => onNavigate("evidence")}
              style={{ background: "none", border: "none", textAlign: "left", color: "var(--color-text-secondary)", cursor: "pointer", padding: 0 }}
            >
              FEVER Evidence Verification
            </button>
            <button
              onClick={() => onNavigate("misinformation")}
              style={{ background: "none", border: "none", textAlign: "left", color: "var(--color-text-secondary)", cursor: "pointer", padding: 0 }}
            >
              LIAR Misinformation Classifier
            </button>
            <button
              onClick={() => onNavigate("toxicity")}
              style={{ background: "none", border: "none", textAlign: "left", color: "var(--color-text-secondary)", cursor: "pointer", padding: 0 }}
            >
              Jigsaw Multi-Label Toxicity
            </button>
            <button
              onClick={() => onNavigate("fairness")}
              style={{ background: "none", border: "none", textAlign: "left", color: "var(--color-text-secondary)", cursor: "pointer", padding: 0 }}
            >
              Length-Aware Fairness Evaluator
            </button>
          </div>
        </div>

        {/* Column 3: Governance & Documentation */}
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-primary)", marginBottom: "0.6rem" }}>
            Governance & Policies
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.8125rem" }}>
            <button
              onClick={() => onNavigate("about")}
              style={{ background: "none", border: "none", textAlign: "left", color: "var(--color-text-secondary)", cursor: "pointer", padding: 0 }}
            >
              Methodology & Architecture
            </button>
            <button
              onClick={() => onNavigate("datasets")}
              style={{ background: "none", border: "none", textAlign: "left", color: "var(--color-text-secondary)", cursor: "pointer", padding: 0 }}
            >
              Dataset Attribution & Licenses
            </button>
            <button
              onClick={() => onNavigate("privacy")}
              style={{ background: "none", border: "none", textAlign: "left", color: "var(--color-text-secondary)", cursor: "pointer", padding: 0 }}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate("terms")}
              style={{ background: "none", border: "none", textAlign: "left", color: "var(--color-text-secondary)", cursor: "pointer", padding: 0 }}
            >
              Terms of Use & Research Boundaries
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Legal / Execution Strip */}
      <div className="workbench-footer-bottom">
        <span>Deterministic Classical Scikit-Learn Execution • Windows 11 CPU Local Host</span>
        <span>Strictly Classical Machine Learning: No LLMs, No Foundation Models, No External APIs</span>
      </div>
    </footer>
  );
};
