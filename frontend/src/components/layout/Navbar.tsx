import React from "react";
import { ShieldCheck, Activity } from "lucide-react";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isBackendHealthy: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, isBackendHealthy }) => {
  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={() => onNavigate("landing")}
          style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontWeight: 700, fontSize: "1.05rem", color: "var(--color-primary)" }}
        >
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#176B52" />
            <path d="M16 6L24 11V21L16 26L8 21V11L16 6Z" stroke="#F7F8F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 11V21M11 13.5L21 18.5M21 13.5L11 18.5" stroke="#DFE4DC" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="16" cy="16" r="2.5" fill="#F7F8F5" />
          </svg>
          TRUSTIQ
        </button>
        <span style={{ color: "var(--color-border-strong)", fontSize: "0.85rem" }}>|</span>
        <span style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
          Classical ML Trust, Safety & Fairness Workbench
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8125rem" }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: isBackendHealthy ? "var(--color-success)" : "var(--color-danger)"
            }}
          />
          <span style={{ color: "var(--color-text-secondary)" }}>
            {isBackendHealthy ? "FastAPI Local Engine Active" : "Backend Offline"}
          </span>
        </div>
        <button
          className="btn btn-primary"
          style={{ padding: "0.35rem 0.85rem", fontSize: "0.8125rem" }}
          onClick={() => onNavigate("workspace")}
        >
          Open Workbench
        </button>
      </div>
    </header>
  );
};
