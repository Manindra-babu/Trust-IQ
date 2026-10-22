import React from "react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer
      style={{
        marginTop: "auto",
        backgroundColor: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        padding: "2.75rem var(--page-padding-x) 2.25rem",
        fontSize: "0.8125rem",
        color: "var(--color-text-secondary)"
      }}
    >
      <div
        style={{
          maxWidth: "var(--content-public-max)",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "2rem"
        }}
      >
        <div style={{ maxWidth: "380px" }}>
          <div style={{ fontWeight: 700, color: "var(--color-primary)", marginBottom: "0.35rem" }}>
            TRUSTIQ Research Platform
          </div>
          <p style={{ fontSize: "0.78125rem", color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
            Unified AI Trust, Evidence, Safety and Fairness Intelligence System. Operating on genuine classical machine learning algorithms with verifiable data provenance and honest evaluation reporting.
          </p>
        </div>

        <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-primary)", marginBottom: "0.6rem" }}>
              Research Modules
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.78125rem" }}>
              <button onClick={() => onNavigate("evidence")} style={{ textAlign: "left", color: "var(--color-text-secondary)" }}>
                FEVER Evidence Verification
              </button>
              <button onClick={() => onNavigate("misinformation")} style={{ textAlign: "left", color: "var(--color-text-secondary)" }}>
                LIAR Misinformation Classifier
              </button>
              <button onClick={() => onNavigate("toxicity")} style={{ textAlign: "left", color: "var(--color-text-secondary)" }}>
                Jigsaw Multi-Label Toxicity
              </button>
              <button onClick={() => onNavigate("fairness")} style={{ textAlign: "left", color: "var(--color-text-secondary)" }}>
                Length-Aware Fairness Evaluator
              </button>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-primary)", marginBottom: "0.6rem" }}>
              Governance & Policies
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.78125rem" }}>
              <button onClick={() => onNavigate("about")} style={{ textAlign: "left", color: "var(--color-text-secondary)" }}>
                Methodology & Architecture
              </button>
              <button onClick={() => onNavigate("datasets")} style={{ textAlign: "left", color: "var(--color-text-secondary)" }}>
                Dataset Attribution & Licenses
              </button>
              <button onClick={() => onNavigate("privacy")} style={{ textAlign: "left", color: "var(--color-text-secondary)" }}>
                Privacy Policy
              </button>
              <button onClick={() => onNavigate("terms")} style={{ textAlign: "left", color: "var(--color-text-secondary)" }}>
                Terms of Use & Research Boundaries
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "var(--content-public-max)",
          margin: "1.5rem auto 0",
          paddingTop: "1rem",
          borderTop: "1px solid var(--color-border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
          fontSize: "0.71875rem",
          color: "var(--color-text-muted)"
        }}
      >
        <span>Locally Executed Classical ML Pipelines (Windows 11 CPU)</span>
        <span>Strictly Classical Machine Learning: No LLMs, No Pretrained Foundation Models, No External APIs</span>
      </div>
    </footer>
  );
};
