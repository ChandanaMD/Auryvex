import React from "react";
import {
  LayoutDashboard,
  Database,
  UploadCloud,
  GitCompare,
  CheckSquare,
  BookOpen,
  Share2,
  BarChart3,
  Sparkles,
  ShieldAlert,
  Sliders,
  ChevronRight
} from "lucide-react";

export type NavItemKey =
  | "dashboard"
  | "materials"
  | "ingestion"
  | "workspace"
  | "review"
  | "catalogue"
  | "graph"
  | "analytics"
  | "quality"
  | "audit"
  | "settings";

interface SidebarProps {
  activeView: NavItemKey;
  setActiveView: (view: NavItemKey) => void;
  reviewCount?: number;
  qualityIssuesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  reviewCount = 0,
  qualityIssuesCount = 0
}) => {
  const menuItems = [
    { key: "dashboard", label: "Executive Dashboard", icon: LayoutDashboard, badge: null },
    { key: "materials", label: "Material Intelligence", icon: Database, badge: "24.8K" },
    { key: "ingestion", label: "Data Ingestion", icon: UploadCloud, badge: null },
    { key: "workspace", label: "Harmonization Workspace", icon: GitCompare, badge: "AI Match" },
    { key: "review", label: "Human Review", icon: CheckSquare, badge: reviewCount > 0 ? `${reviewCount}` : null, badgeColor: "amber" },
    { key: "catalogue", label: "Central Catalogue", icon: BookOpen, badge: null },
    { key: "graph", label: "Relationship Graph", icon: Share2, badge: "Interactive" },
    { key: "analytics", label: "Analytics & Insights", icon: BarChart3, badge: "-31.4%" },
    { key: "quality", label: "Data Quality", icon: ShieldAlert, badge: qualityIssuesCount > 0 ? `${qualityIssuesCount}` : null, badgeColor: "rose" },
    { key: "audit", label: "Audit Trail", icon: Sparkles, badge: null },
    { key: "settings", label: "AI Model Config", icon: Sliders, badge: null },
  ];

  return (
    <aside className="w-64 bg-[#090f1d] border-r border-[#1a2844] flex flex-col justify-between select-none">
      <div className="py-4">
        <div className="px-5 mb-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Platform Modules
          </p>
        </div>

        <nav className="space-y-0.5 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveView(item.key as NavItemKey)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#121c32]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-amber-400" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        item.badgeColor === "amber"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : item.badgeColor === "rose"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-400" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* CPSE Participating Entities Mini-List */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-[#0e172a] border border-[#1b2b48]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-300">Connected CPSEs</span>
          <span className="text-[10px] text-emerald-400 font-mono">5 Active</span>
        </div>
        <div className="space-y-1.5 text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span className="truncate">CPSE Alpha (Heavy Eng.)</span>
            <span className="text-[10px] font-mono text-slate-300">6,820</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="truncate">CPSE Bharat (Electrical)</span>
            <span className="text-[10px] font-mono text-slate-300">5,940</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="truncate">CPSE Energy (Power)</span>
            <span className="text-[10px] font-mono text-slate-300">4,830</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="truncate">CPSE Infrastructure</span>
            <span className="text-[10px] font-mono text-slate-300">3,150</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="truncate">CPSE Engineering</span>
            <span className="text-[10px] font-mono text-slate-300">4,120</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Engine: RapidFuzz+TFIDF</span>
          <span className="text-emerald-400">Local Ready</span>
        </div>
      </div>
    </aside>
  );
};
