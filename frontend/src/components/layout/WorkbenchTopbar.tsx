import React from "react";
import { Sliders, CheckCircle2, BookOpen, Menu } from "lucide-react";

interface WorkbenchTopbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isBackendHealthy: boolean;
  onToggleSidebar?: () => void;
}

export const WorkbenchNavbar: React.FC<WorkbenchTopbarProps> = ({
  currentPage,
  onNavigate,
  isBackendHealthy,
  onToggleSidebar
}) => {
  const getSectionTitle = (page: string) => {
    switch (page) {
      case "workspace": return "Unified Text Workbench";
      case "evidence": return "Evidence Verification (FEVER)";
      case "misinformation": return "Misinformation Classifier (LIAR)";
      case "toxicity": return "Toxicity & Hate Speech Analysis";
      case "fairness": return "Length-Aware Fairness Evaluator";
      case "datasets": return "Dataset Management";
      case "training": return "Model Training Center";
      case "evaluation": return "Evaluation Reports";
      case "history": return "Analysis History";
      default: return "Workbench";
    }
  };

  return (
    <header className="workbench-topbar">
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            style={{ display: "none", padding: "0.3rem" }}
            className="mobile-toggle"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.8125rem" }}>
          <span style={{ color: "var(--color-text-muted)" }}>Workbench</span>
          <span style={{ color: "var(--color-border-strong)" }}>/</span>
          <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>
            {getSectionTitle(currentPage)}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: isBackendHealthy ? "var(--color-success)" : "var(--color-danger)"
            }}
          />
          <span style={{ fontSize: "0.71875rem" }}>
            {isBackendHealthy ? "Local Engine Active (CPU)" : "Engine Offline"}
          </span>
        </div>

        <button
          className="btn btn-secondary"
          style={{ fontSize: "0.75rem", padding: "0.3rem 0.65rem" }}
          onClick={() => onNavigate("about")}
        >
          <BookOpen size={13} />
          Documentation
        </button>

        {currentPage !== "workspace" && (
          <button
            className="btn btn-primary"
            style={{ fontSize: "0.75rem", padding: "0.3rem 0.75rem" }}
            onClick={() => onNavigate("workspace")}
          >
            <Sliders size={13} />
            Analyze Text
          </button>
        )}
      </div>
    </header>
  );
};
