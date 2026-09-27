import React from "react";
import { 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  TrendingDown, 
  Database, 
  CheckCircle2, 
  Share2 
} from "lucide-react";

interface LandingViewProps {
  onEnterApp: () => void;
  onGoToLogin: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterApp, onGoToLogin }) => {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <header className="h-20 border-b border-[#15233c] px-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Layers className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Material<span className="text-amber-400">IQ</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                MATRIQ AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              SIH 2026 Problem Statement SIH26099
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onGoToLogin}
            className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Officer Sign In
          </button>
          <button
            onClick={onEnterApp}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-14 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121e36] border border-[#20345b] text-amber-300 text-xs font-mono font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>National Material Intelligence & Standardization Portal</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Unifying India's <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-cyan-400 bg-clip-text text-transparent">
              Material Intelligence
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            AI-powered standardization and harmonization of material master data across Central Public Sector Enterprises (CPSEs). Eliminating catalog fragmentation with transparent, explainable machine intelligence.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onEnterApp}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm tracking-wide shadow-xl shadow-amber-500/25 transition-all hover:scale-105"
            >
              <span>Explore Interactive Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToLogin}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#101b33] hover:bg-[#162548] border border-[#233863] text-slate-200 font-semibold text-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CPSE Enterprise Login</span>
            </button>
          </div>
        </div>

        {/* Convergence Diagram Visual */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-[#0b1324] border border-[#1b2b48] shadow-2xl overflow-hidden max-w-4xl mx-auto w-full">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center justify-between pb-6 border-b border-[#1b2b48] mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Core Problem Statement
              </span>
              <h3 className="text-sm font-bold text-white mt-1">
                Material Master Convergence Workflow
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              97.2% Match Accuracy
            </span>
          </div>

          {/* 3 CPSE Inputs -> AI Matcher -> Standard Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left: 3 Disparate CPSEs */}
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#0e172a] border border-amber-500/30">
                <div className="flex items-center justify-between text-[10px] font-mono text-amber-300">
                  <span>CPSE Alpha</span>
                  <span>ELEC-004521</span>
                </div>
                <p className="text-xs font-bold text-white mt-1">"BALL BRG 6205 2RS SKF"</p>
                <p className="text-[10px] text-slate-400">Unit: NOS | Qty: 450</p>
              </div>

              <div className="p-3 rounded-lg bg-[#0e172a] border border-cyan-500/30">
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300">
                  <span>CPSE Bharat</span>
                  <span>MRO-8831</span>
                </div>
                <p className="text-xs font-bold text-white mt-1">
                  "SKF 6205-2RS DEEP GROOVE BALL BEARING"
                </p>
                <p className="text-[10px] text-slate-400">Unit: EA | Qty: 320</p>
              </div>

              <div className="p-3 rounded-lg bg-[#0e172a] border border-indigo-500/30">
                <div className="flex items-center justify-between text-[10px] font-mono text-indigo-300">
                  <span>CPSE Energy</span>
                  <span>ENG-7721</span>
                </div>
                <p className="text-xs font-bold text-white mt-1">
                  "DEEP GROOVE BEARING, 6205, DOUBLE SEALED"
                </p>
                <p className="text-[10px] text-slate-400">Unit: PCS | Qty: 180</p>
              </div>
            </div>

            {/* Middle: AI Engine Hub */}
            <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-b from-[#14213d] to-[#0d1629] border border-[#233b66] shadow-xl text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/20">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                MATRIQ AI Engine
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Multi-Factor Weighted Similarity & Spec Extraction
              </p>
              <div className="mt-3 text-[10px] font-mono text-emerald-400 space-y-0.5">
                <p>✓ Bearing Model 6205 Match</p>
                <p>✓ Rubber Seal 2RS Match</p>
                <p>✓ Manufacturer SKF Match</p>
              </div>
            </div>

            {/* Right: Unified Standard Output */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#0c241b] to-[#0a1628] border border-emerald-500/40 shadow-xl">
              <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300 mb-2">
                <span>CANONICAL IDENTITY</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20">APPROVED</span>
              </div>
              <p className="text-xs text-slate-300 font-mono">Standard Code:</p>
              <p className="text-base font-extrabold text-amber-400 font-mono tracking-wide">
                MAT-BRG-6205-2RS
              </p>
              <p className="text-xs font-bold text-white mt-1">
                Deep Groove Ball Bearing 6205-2RS
              </p>
              <div className="mt-3 pt-2 border-t border-emerald-500/20 text-[10px] text-slate-400 space-y-1">
                <p>
                  <span className="text-slate-200">Bore:</span> 25mm |{" "}
                  <span className="text-slate-200">OD:</span> 52mm |{" "}
                  <span className="text-slate-200">Width:</span> 15mm
                </p>
                <p>
                  <span className="text-slate-200">Consolidated Units:</span> 950 EA
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-16 border-t border-[#15233c] px-8 flex items-center justify-between max-w-7xl mx-auto w-full text-xs text-slate-400">
        <p>Smart India Hackathon 2026 | Problem Statement SIH26099</p>
        <p className="font-mono">Built for Central Public Sector Enterprises of India</p>
      </footer>
    </div>
  );
};
