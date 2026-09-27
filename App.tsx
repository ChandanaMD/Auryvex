import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Sidebar, NavItemKey } from "./components/layout/Sidebar";
import { CopilotDrawer } from "./components/copilot/CopilotDrawer";
import { LandingView } from "./views/LandingView";
import { LoginView } from "./views/LoginView";
import { DashboardView } from "./views/DashboardView";
import { MaterialsView } from "./views/MaterialsView";
import { IngestionView } from "./views/IngestionView";
import { WorkspaceView } from "./views/WorkspaceView";
import { ReviewView } from "./views/ReviewView";
import { CatalogueView } from "./views/CatalogueView";
import { GraphView } from "./views/GraphView";
import { AnalyticsView } from "./views/AnalyticsView";
import { DataQualityView } from "./views/DataQualityView";
import { AuditView } from "./views/AuditView";
import { SettingsView } from "./views/SettingsView";
import { HarmonizationGroup, UserRole } from "./types";
import { api } from "./services/api";

type AppState = "landing" | "login" | "app";

const DEMO_STEPS = [
  "Loading material records from 5 CPSEs...",
  "Running AI description normalizer...",
  "Extracting engineering specifications...",
  "Computing TF-IDF + RapidFuzz similarity...",
  "Running harmonization pipeline...",
  "Generating canonical standard codes...",
  "Preparing human review queue...",
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>("landing");
  const [activeView, setActiveView] = useState<NavItemKey>("dashboard");
  const [currentRole, setCurrentRole] = useState<UserRole>("Admin");
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [isHarmonizing, setIsHarmonizing] = useState(false);
  const [selectedGraphGroup, setSelectedGraphGroup] = useState<HarmonizationGroup | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [qualityIssuesCount, setQualityIssuesCount] = useState(0);

  const loadCounts = useCallback(async () => {
    try {
      const queue = await api.getReviewQueue();
      if (queue && Array.isArray(queue)) {
        setReviewCount(queue.filter((g: HarmonizationGroup) => g.status === "PENDING_REVIEW").length);
      }
    } catch (_) {}
    try {
      const quality = await api.getDataQualitySummary();
      if (quality?.total_anomalies) setQualityIssuesCount(quality.total_anomalies);
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (appState === "app") {
      loadCounts();
      const interval = setInterval(loadCounts, 30000);
      return () => clearInterval(interval);
    }
  }, [appState, loadCounts]);

  const handleLogin = () => {
    setAppState("app");
    setActiveView("dashboard");
  };

  const handleNavigateView = (view: NavItemKey) => {
    setActiveView(view);
    setIsCopilotOpen(false);
  };

  const handleRunHarmonization = async () => {
    setIsHarmonizing(true);
    try {
      await api.runHarmonization();
    } catch (_) {}
    setIsHarmonizing(false);
    await loadCounts();
  };

  const handleStartGuidedDemo = async () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    setDemoStep(0);

    for (let i = 0; i < 4; i++) {
      await new Promise((r) => setTimeout(r, 500));
      setDemoStep(i + 1);
    }

    setIsHarmonizing(true);
    try {
      await api.runHarmonization();
    } catch (_) {}
    setIsHarmonizing(false);
    setDemoStep(5);
    await new Promise((r) => setTimeout(r, 500));

    setDemoStep(6);
    await new Promise((r) => setTimeout(r, 500));

    setDemoStep(7);
    await new Promise((r) => setTimeout(r, 600));

    setIsDemoRunning(false);
    setDemoStep(0);
    await loadCounts();
    setActiveView("workspace");
  };

  if (appState === "landing") {
    return (
      <LandingView
        onEnterApp={() => setAppState("login")}
        onGoToLogin={() => setAppState("login")}
      />
    );
  }

  if (appState === "login") {
    return (
      <LoginView
        onLoginSuccess={handleLogin}
        onBackToLanding={() => setAppState("landing")}
      />
    );
  }

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <DashboardView
            onNavigate={handleNavigateView}
            onRunHarmonization={handleRunHarmonization}
            isHarmonizing={isHarmonizing}
          />
        );
      case "materials":
        return <MaterialsView />;
      case "ingestion":
        return (
          <IngestionView
            onStartHarmonization={handleRunHarmonization}
            isHarmonizing={isHarmonizing}
          />
        );
      case "workspace":
        return <WorkspaceView onNavigate={handleNavigateView} />;
      case "review":
        return (
          <ReviewView
            currentRole={currentRole}
            onRefreshReviewCount={loadCounts}
          />
        );
      case "catalogue":
        return (
          <CatalogueView
            onSelectGraphItem={(group) => {
              setSelectedGraphGroup(group);
              setActiveView("graph");
            }}
            onNavigate={handleNavigateView}
          />
        );
      case "graph":
        return <GraphView initialGroup={selectedGraphGroup} />;
      case "analytics":
        return <AnalyticsView />;
      case "quality":
        return <DataQualityView />;
      case "audit":
        return <AuditView />;
      case "settings":
        return <SettingsView />;
      default:
        return (
          <DashboardView
            onNavigate={handleNavigateView}
            onRunHarmonization={handleRunHarmonization}
            isHarmonizing={isHarmonizing}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#080c16] text-slate-200 overflow-hidden">
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onStartGuidedDemo={handleStartGuidedDemo}
        isDemoRunning={isDemoRunning}
      />

      <div className="flex flex-1 min-h-0">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          reviewCount={reviewCount}
          qualityIssuesCount={qualityIssuesCount}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>

      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onNavigateView={handleNavigateView}
      />

      {isDemoRunning && (
        <div className="fixed inset-0 z-50 bg-[#080c16]/90 backdrop-blur-sm flex items-center justify-center">
          <div className="w-[480px] rounded-2xl bg-[#0d1527] border border-amber-500/30 shadow-2xl shadow-amber-500/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center">
                <span className="text-slate-950 font-extrabold text-sm">AI</span>
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white">MATRIQ AI Pipeline</h2>
                <p className="text-xs text-amber-400 font-mono">Live harmonization run in progress</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {DEMO_STEPS.map((label, idx) => {
                const stepNum = idx + 1;
                const isDone = demoStep > stepNum;
                const isCurrent = demoStep === stepNum;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                      isDone
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : isCurrent
                        ? "bg-amber-500/15 border-amber-500/40"
                        : "bg-[#111827] border-[#1e2f4f] opacity-40"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isDone
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-amber-500 text-slate-950 animate-pulse"
                          : "bg-[#1e2f4f] text-slate-500"
                      }`}
                    >
                      {isDone ? "OK" : stepNum}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isDone ? "text-emerald-300" : isCurrent ? "text-amber-200" : "text-slate-500"
                      }`}
                    >
                      {label}
                    </span>
                    {isCurrent && (
                      <div className="ml-auto flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="h-1.5 rounded-full bg-[#1e2f4f] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 transition-all duration-500 rounded-full"
                style={{ width: `${(demoStep / DEMO_STEPS.length) * 100}%` }}
              />
            </div>
            <p className="text-center text-xs text-slate-500 mt-3 font-mono">
              Step {demoStep} of {DEMO_STEPS.length} — navigating to Workspace on completion
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
