import React from "react";

export const PrivacyPage: React.FC = () => {
  return (
    <div style={{ maxWidth: "820px", margin: "2.5rem auto 3rem" }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
          Governance & Data Boundary
        </div>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.35rem" }}>Privacy Policy</h1>
        <p style={{ fontSize: "0.875rem" }}>
          Effective Date: October 2026. Applicable to the TRUSTIQ Local ML Research Platform.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ marginBottom: "0.65rem", fontSize: "1.1rem" }}>1. Local Execution & Data Boundary</h2>
        <p style={{ marginBottom: "0.65rem", lineHeight: 1.6 }}>
          TRUSTIQ runs entirely on your local machine. When you enter claims, statements, or discussion comments into the workbench, the text is transmitted exclusively via localhost (HTTP 127.0.0.1:8000) to the local Python FastAPI process.
        </p>
        <p style={{ lineHeight: 1.6 }}>
          At no time is any user text, metadata, or model prediction transmitted over the public internet, nor is it uploaded to cloud servers, external AI APIs, or third-party telemetry services.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ marginBottom: "0.65rem", fontSize: "1.1rem" }}>2. Local Browser Storage (localStorage)</h2>
        <p style={{ marginBottom: "0.65rem", lineHeight: 1.6 }}>
          To provide session analysis history, the web interface saves the last 50 queries and their model verdicts directly into your browser's <code>localStorage</code> under the key <code>trustiq_history</code>.
        </p>
        <p style={{ lineHeight: 1.6 }}>
          This data remains on your physical disk and can be purged immediately at any time by clicking the "Purge Local History" button in the Analysis History page.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ marginBottom: "0.65rem", fontSize: "1.1rem" }}>3. Non-Usage for Model Training</h2>
        <p style={{ lineHeight: 1.6 }}>
          Texts entered into the workbench are never recorded into training corpora or used to fine-tune future model checkpoints. All machine learning weights are derived solely from the official research datasets (FEVER, LIAR, Jigsaw).
        </p>
      </div>

      <div className="panel">
        <h2 style={{ marginBottom: "0.65rem", fontSize: "1.1rem" }}>4. Maintainer Information</h2>
        <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
          TRUSTIQ is maintained as an open reproducible research workbench. For questions regarding code provenance or methodology, consult the repository documentation in <code>MODEL_CARD.md</code>.
        </p>
      </div>
    </div>
  );
};
