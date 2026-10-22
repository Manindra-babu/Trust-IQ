import React from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";

interface NotFoundPageProps {
  onNavigate: (page: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="panel empty-state" style={{ maxWidth: "560px", margin: "4rem auto" }}>
      <AlertCircle size={40} className="empty-state-icon" color="var(--color-warning)" />
      <h1 style={{ fontSize: "1.35rem", marginBottom: "0.4rem" }}>Page Not Found (404)</h1>
      <p style={{ marginBottom: "1.25rem", fontSize: "0.84375rem" }}>
        The requested workbench module or research document does not exist.
      </p>
      <button className="btn btn-primary" onClick={() => onNavigate("workspace")}>
        <ArrowLeft size={14} />
        Return to Workbench
      </button>
    </div>
  );
};
