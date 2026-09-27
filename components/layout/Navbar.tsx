import React from "react";
import { UserRole } from "../../types";
import { 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Bot, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";

interface NavbarProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onOpenCopilot: () => void;
  onStartGuidedDemo: () => void;
  isDemoRunning?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  onOpenCopilot,
  onStartGuidedDemo,
  isDemoRunning
}) => {
  const roles: UserRole[] = ["Admin", "Data Manager", "AI Analyst", "Reviewer", "Viewer"];

  return (
    <header className="h-16 bg-[#0a1120] border-b border-[#1b2b48] px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-amber-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Layers className="w-6 h-6 text-slate-950 font-bold" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center">
              Material<span className="text-amber-400">IQ</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              MATRIQ AI
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Govt CPSE Portal
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            National Material Intelligence & Harmonization Platform
          </p>
        </div>
      </div>

      {/* Center / Action Area */}
      <div className="flex items-center gap-4">
        {/* 3-Minute Guided Judge Demo Flow Button */}
        <button
          onClick={onStartGuidedDemo}
          disabled={isDemoRunning}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs tracking-wide transition-all shadow-md ${
            isDemoRunning
              ? "bg-amber-600/50 text-amber-200 cursor-not-allowed animate-pulse"
              : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20 hover:scale-[1.02]"
          }`}
        >
          <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
          <span>{isDemoRunning ? "AI PIPELINE RUNNING..." : "RUN LIVE AI DEMO"}</span>
        </button>

        {/* AI Copilot Trigger */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#14213d] hover:bg-[#1a2c52] border border-[#233863] text-cyan-300 text-xs font-medium transition-all shadow-sm group"
        >
          <Bot className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span>MATRIQ Copilot</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
        </button>
      </div>

      {/* Right / Role & User Profile */}
      <div className="flex items-center gap-4">
        {/* Role Switcher */}
        <div className="flex items-center gap-2 bg-[#101b33] border border-[#1e2f4f] rounded-lg px-2.5 py-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] text-slate-400">Role:</span>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
          >
            {roles.map((r) => (
              <option key={r} value={r} className="bg-[#0f172a] text-white">
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#1e2f4f]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white border border-cyan-400/30">
            CP
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-tight">Demo CPSE Officer</p>
            <p className="text-[10px] text-slate-400 font-mono">admin@matriq.demo</p>
          </div>
        </div>
      </div>
    </header>
  );
};
