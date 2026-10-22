import React from "react";
import {
  Sliders,
  FileCheck2,
  AlertTriangle,
  Flame,
  Scale,
  Database,
  Cpu,
  BarChart2,
  History,
  ChevronLeft,
  ChevronRight,
  Home
} from "lucide-react";

interface WorkbenchSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const WorkbenchSidebar: React.FC<WorkbenchSidebarProps> = ({
  currentPage,
  onNavigate,
  isCollapsed,
  onToggleCollapse
}) => {
  const navSections = [
    {
      title: "Workspace",
      items: [
        { id: "workspace", label: "Unified Workbench", icon: Sliders }
      ]
    },
    {
      title: "Research Modules",
      items: [
        { id: "evidence", label: "Evidence & Faithfulness", icon: FileCheck2 },
        { id: "misinformation", label: "Misinformation (LIAR)", icon: AlertTriangle },
        { id: "toxicity", label: "Toxicity Multi-Label", icon: Flame },
        { id: "fairness", label: "Length Fairness", icon: Scale }
      ]
    },
    {
      title: "ML Operations",
      items: [
        { id: "datasets", label: "Datasets", icon: Database },
        { id: "training", label: "Training Center", icon: Cpu },
        { id: "evaluation", label: "Evaluation Reports", icon: BarChart2 },
        { id: "history", label: "History", icon: History }
      ]
    }
  ];

  return (
    <aside className={`workbench-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Top Header */}
      <div
        style={{
          height: "var(--topbar-height)",
          padding: isCollapsed ? "0" : "0 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          borderBottom: "1px solid var(--color-border-subtle)"
        }}
      >
        {!isCollapsed && (
          <button
            onClick={() => onNavigate("landing")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: "var(--color-primary)"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="4" fill="#173F32" />
              <path
                d="M16 6L24 11V21L16 26L8 21V11L16 6Z"
                stroke="#F5F3EC"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 11V21M11 13.5L21 18.5M21 13.5L11 18.5"
                stroke="#D8E9DE"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="16" cy="16" r="2.2" fill="#F5F3EC" />
            </svg>
            <span>TRUSTIQ</span>
          </button>
        )}

        <button
          onClick={onToggleCollapse}
          style={{
            padding: "0.3rem",
            color: "var(--color-text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "var(--radius-xs)"
          }}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Nav List */}
      <div
        style={{
          flex: 1,
          padding: isCollapsed ? "0.75rem 0.25rem" : "0.75rem 0.65rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          overflowY: "auto"
        }}
      >
        {/* Back to Public Site link */}
        <div>
          <button
            className="sidebar-nav-item"
            onClick={() => onNavigate("landing")}
            title={isCollapsed ? "Public Overview" : undefined}
            style={{ justifyContent: isCollapsed ? "center" : "flex-start" }}
          >
            <Home size={15} />
            {!isCollapsed && <span>Public Overview</span>}
          </button>
        </div>

        {navSections.map((section, sIdx) => (
          <div key={sIdx}>
            {!isCollapsed && (
              <div
                style={{
                  fontSize: "0.65625rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--color-text-muted)",
                  padding: "0 0.65rem 0.35rem"
                }}
              >
                {section.title}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                    onClick={() => onNavigate(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    style={{ justifyContent: isCollapsed ? "center" : "flex-start" }}
                  >
                    <Icon size={15} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      {!isCollapsed && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderTop: "1px solid var(--color-border-subtle)",
            fontSize: "0.6875rem",
            color: "var(--color-text-muted)"
          }}
        >
          <div>TRUSTIQ v1.0.0</div>
          <div>Classical Scikit-Learn ML</div>
        </div>
      )}
    </aside>
  );
};
