import React, { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

interface PublicNavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isBackendHealthy: boolean;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  currentPage,
  onNavigate,
  isBackendHealthy
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="public-header">
      <div className="public-header-inner">
        {/* Brand / Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={() => handleNav("landing")}
            style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}
          >
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
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
            <span
              style={{
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: "-0.01em",
                color: "var(--color-primary)"
              }}
            >
              TRUSTIQ
            </span>
          </button>
          <span
            style={{
              fontSize: "0.6875rem",
              color: "var(--color-text-muted)",
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              display: "none"
            }}
            className="brand-sub"
          >
            Classical ML System
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem"
          }}
          className="desktop-nav"
        >
          <button
            className={`public-nav-link ${currentPage === "landing" ? "active" : ""}`}
            onClick={() => handleNav("landing")}
          >
            Product
          </button>
          <button
            className={`public-nav-link ${currentPage === "about" ? "active" : ""}`}
            onClick={() => handleNav("about")}
          >
            Methodology
          </button>
          <button
            className={`public-nav-link ${currentPage === "evaluation" ? "active" : ""}`}
            onClick={() => handleNav("evaluation")}
          >
            Evaluation
          </button>
          <button
            className={`public-nav-link ${currentPage === "datasets" ? "active" : ""}`}
            onClick={() => handleNav("datasets")}
          >
            Datasets
          </button>
          <button
            className={`public-nav-link ${currentPage === "about" ? "active" : ""}`}
            onClick={() => handleNav("about")}
          >
            About
          </button>
        </nav>

        {/* Right CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <button
            className="btn btn-primary"
            onClick={() => handleNav("workspace")}
          >
            Open Workbench
            <ArrowRight size={13} />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: "none" }}
            className="mobile-toggle"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "var(--topbar-height)",
            left: 0,
            right: 0,
            backgroundColor: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border)",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem"
          }}
        >
          <button
            className="sidebar-nav-item"
            onClick={() => handleNav("landing")}
          >
            Product
          </button>
          <button
            className="sidebar-nav-item"
            onClick={() => handleNav("about")}
          >
            Methodology
          </button>
          <button
            className="sidebar-nav-item"
            onClick={() => handleNav("evaluation")}
          >
            Evaluation
          </button>
          <button
            className="sidebar-nav-item"
            onClick={() => handleNav("datasets")}
          >
            Datasets
          </button>
          <button
            className="sidebar-nav-item"
            onClick={() => handleNav("workspace")}
          >
            Launch Workbench
          </button>
        </div>
      )}
    </header>
  );
};
