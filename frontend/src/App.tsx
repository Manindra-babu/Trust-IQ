import React, { useState, useEffect } from "react";
import { PublicNavbar } from "./components/layout/PublicNavbar";
import { WorkbenchNavbar } from "./components/layout/WorkbenchTopbar";
import { WorkbenchSidebar } from "./components/layout/WorkbenchSidebar";
import { Footer } from "./components/layout/Footer";
import { LandingPage } from "./pages/LandingPage";
import { WorkspacePage } from "./pages/WorkspacePage";
import { EvidencePage } from "./pages/EvidencePage";
import { MisinfoPage } from "./pages/MisinfoPage";
import { ToxicityPage } from "./pages/ToxicityPage";
import { FairnessPage } from "./pages/FairnessPage";
import { DatasetsPage } from "./pages/DatasetsPage";
import { TrainingPage } from "./pages/TrainingPage";
import { EvaluationPage } from "./pages/EvaluationPage";
import { HistoryPage } from "./pages/HistoryPage";
import { AboutPage } from "./pages/AboutPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { checkHealth, fetchModelsStatus } from "./services/api";
import type { ModelsStatusResponse } from "./types";

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean>(true);
  const [modelsStatus, setModelsStatus] = useState<ModelsStatusResponse | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const checkStatus = async () => {
    try {
      await checkHealth();
      setIsBackendHealthy(true);
      const mStatus = await fetchModelsStatus();
      setModelsStatus(mStatus);
    } catch {
      setIsBackendHealthy(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const isPublicPage = ["landing", "about", "privacy", "terms"].includes(currentPage);

  const renderPageContent = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={setCurrentPage} modelsStatus={modelsStatus} />;
      case "workspace":
        return <WorkspacePage modelsStatus={modelsStatus} onNavigate={setCurrentPage} />;
      case "evidence":
        return <EvidencePage />;
      case "misinformation":
        return <MisinfoPage />;
      case "toxicity":
        return <ToxicityPage />;
      case "fairness":
        return <FairnessPage />;
      case "datasets":
        return <DatasetsPage />;
      case "training":
        return <TrainingPage />;
      case "evaluation":
        return <EvaluationPage />;
      case "history":
        return <HistoryPage />;
      case "about":
        return <AboutPage />;
      case "privacy":
        return <PrivacyPage />;
      case "terms":
        return <TermsPage />;
      default:
        return <NotFoundPage onNavigate={setCurrentPage} />;
    }
  };

  if (isPublicPage) {
    return (
      <div className="public-layout">
        <PublicNavbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          isBackendHealthy={isBackendHealthy}
        />
        <main className="public-main">
          {renderPageContent()}
        </main>
        <Footer onNavigate={setCurrentPage} />
      </div>
    );
  }

  return (
    <div className={`workbench-layout ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <WorkbenchSidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="workbench-body">
        <WorkbenchNavbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          isBackendHealthy={isBackendHealthy}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="workbench-content">
          <div className="workbench-content-inner">
            {renderPageContent()}
          </div>
        </main>
        <Footer onNavigate={setCurrentPage} />
      </div>
    </div>
  );
};

export default App;
