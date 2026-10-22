import React from "react";
import {
  Home,
  Sliders,
  FileCheck2,
  AlertTriangle,
  Flame,
  Scale,
  Database,
  Cpu,
  BarChart2,
  History,
  BookOpen,
  Lock,
  FileText
} from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const navSections = [
    {
      heading: "Overview",
      items: [
        { id: "landing", label: "Product Home", icon: Home },
        { id: "workspace", label: "Unified Workspace", icon: Sliders }
      ]
    },
    {
      heading: "Research Modules",
      items: [
        { id: "evidence", label: "Evidence & Faithfulness", icon: FileCheck2 },
        { id: "misinformation", label: "Misinformation Detection", icon: AlertTriangle },
        { id: "toxicity", label: "Toxicity & Hate Speech", icon: Flame },
        { id: "fairness", label: "Length-Aware Fairness", icon: Scale }
      ]
    },
    {
      heading: "ML Operations",
      items: [
        { id: "datasets", label: "Dataset Management", icon: Database },
        { id: "training", label: "Model Training Center", icon: Cpu },
        { id: "evaluation", label: "Evaluation Reports", icon: BarChart2 },
        { id: "history", label: "Analysis History", icon: History }
      ]
    },
    {
      heading: "Governance & Protocol",
      items: [
        { id: "about", label: "About & Methodology", icon: BookOpen },
        { id: "privacy", label: "Privacy Policy", icon: Lock },
        { id: "terms", label: "Terms of Use", icon: FileText }
      ]
    }
  ];

  return (
    <aside className="sidebar">
      <div style={{ padding: "1.25rem 1.25rem 0.75rem", borderBottom: "1px solid var(--color-border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#176B52" />
            <path d="M16 6L24 11V21L16 26L8 21V11L16 6Z" stroke="#F7F8F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 11V21M11 13.5L21 18.5M21 13.5L11 18.5" stroke="#DFE4DC" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="16" cy="16" r="2.5" fill="#F7F8F5" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.01em", color: "var(--color-primary)" }}>
            TRUSTIQ
          </span>
        </div>
      </div>

      <div style={{ padding: "1rem 0.75rem", overflowY: "auto", flex: 1 }}>
        {navSections.map((sec, i) => (
          <div key={i} style={{ marginBottom: "1.25rem" }}>
            <div
              style={{
                fontSize: "0.6875rem",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                padding: "0 0.6rem 0.35rem"
              }}
            >
              {sec.heading}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      padding: "0.5rem 0.6rem",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.8125rem",
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                      backgroundColor: isActive ? "var(--color-primary-subtle)" : "transparent",
                      border: isActive ? "1px solid var(--color-primary-border)" : "1px solid transparent",
                      textAlign: "left",
                      transition: "all 0.1s ease"
                    }}
                  >
                    <Icon size={16} color={isActive ? "var(--color-primary)" : "var(--color-text-muted)"} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "0.85rem 1.25rem",
          borderTop: "1px solid var(--color-border-subtle)",
          fontSize: "0.75rem",
          color: "var(--color-text-muted)"
        }}
      >
        <span>TRUSTIQ v1.0.0 (Local CPU)</span>
      </div>
    </aside>
  );
};
