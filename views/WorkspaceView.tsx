import React, { useState, useEffect } from "react";
import { 
  GitCompare, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Building2, 
  Sliders, 
  Check, 
  X,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { api } from "../services/api";
import { MatchPair } from "../types";
import { ConfidenceMeter } from "../components/common/ConfidenceMeter";
import { Badge } from "../components/common/Badge";
import { NavItemKey } from "../components/layout/Sidebar";

interface WorkspaceViewProps {
  onNavigate: (view: NavItemKey) => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({ onNavigate }) => {
  const [matches, setMatches] = useState<MatchPair[]>([]);
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const res = await api.getMatches(0.7);
      setMatches(res);
      if (res.length > 0) {
        setSelectedPairIndex(0);
      }
    } catch (err) {
      console.error("Failed to load match pairs", err);
    } finally {
      setLoading(false);
    }
  };

  const currentPair = matches[selectedPairIndex];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Explainable AI Workspace
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Transparent Multi-Factor Scoring
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
            AI Equivalence & Deduplication Studio
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent side-by-side comparison of disparate CPSE material records with weighted similarity scoring and explainability rationales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("review")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition-all shadow-md"
          >
            <span>GO TO REVIEW QUEUE</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Match Selection Quick Ribbon */}
      <div className="p-3 rounded-xl bg-[#0c1424] border border-[#1b2b48] overflow-x-auto">
        <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider mb-2">
          Detected Equivalence Clusters ({matches.length} Verified Pairs)
        </p>
        <div className="flex items-center gap-2 pb-1">
          {matches.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPairIndex(idx)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                selectedPairIndex === idx
                  ? "bg-amber-500/20 border-amber-500 text-amber-200 shadow-md"
                  : "bg-[#0f172a] border-[#1e2f4f] text-slate-400 hover:text-slate-200 hover:border-slate-600"
              }`}
            >
              <span className="font-mono text-[11px] font-bold">
                {p.source_material.material_code}
              </span>
              <span className="text-slate-500">↔</span>
              <span className="font-mono text-[11px] font-bold">
                {p.candidate_material.material_code}
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                {(p.overall_confidence * 100).toFixed(1)}%
              </span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400 font-mono text-xs">
          Loading AI match pairs...
        </div>
      ) : currentPair ? (
        <div className="space-y-6">
          {/* Split-Screen Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* LEFT: Source Material (CPSE A) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0c1424] border border-[#1b2b48] shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1b2b48] mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-sm text-white">
                      {currentPair.source_material.cpse}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    Source Material
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      Material Code
                    </span>
                    <p className="text-base font-extrabold text-amber-400 font-mono">
                      {currentPair.source_material.material_code}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      Local ERP Description
                    </span>
                    <p className="text-sm font-semibold text-white mt-0.5 leading-snug">
                      "{currentPair.source_material.description}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono">Category</span>
                      <p className="text-slate-200 font-medium">{currentPair.source_material.category}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono">Manufacturer</span>
                      <p className="text-slate-200 font-medium">
                        {currentPair.source_material.manufacturer || "Not Specified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono">Model / Part No</span>
                      <p className="text-slate-200 font-medium">{currentPair.source_material.model || "—"}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono">Unit of Measure</span>
                      <p className="text-amber-300 font-mono font-bold">
                        {currentPair.source_material.unit}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono">Engineering Specification</span>
                    <p className="text-xs text-slate-300 mt-0.5 font-mono bg-[#090f1d] p-2.5 rounded border border-slate-800">
                      {currentPair.source_material.specification || "Standard catalog spec"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1b2b48] flex items-center justify-between text-[11px] text-slate-400">
                <span>Plant: {currentPair.source_material.plant}</span>
                <span>Qty: {currentPair.source_material.quantity}</span>
              </div>
            </div>

            {/* CENTER: AI Match Indicator & Confidence Gauge */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-gradient-to-b from-[#101b33] to-[#0c1424] border border-[#223963] shadow-xl flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-2 shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>

              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                Overall AI Match
              </span>
              <p className="text-3xl font-black text-emerald-400 font-mono mt-1">
                {(currentPair.overall_confidence * 100).toFixed(1)}%
              </p>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mt-1">
                High Confidence
              </span>

              {/* Six Visual Dimension Score Bars */}
              <div className="w-full mt-4 space-y-2 text-left">
                <div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Description</span>
                    <span className="text-white font-bold">
                      {Math.round(currentPair.description_score * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${currentPair.description_score * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Specifications</span>
                    <span className="text-white font-bold">
                      {Math.round(currentPair.spec_score * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${currentPair.spec_score * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Category</span>
                    <span className="text-white font-bold">
                      {Math.round(currentPair.category_score * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="h-full bg-indigo-400 rounded-full"
                      style={{ width: `${currentPair.category_score * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Manufacturer</span>
                    <span className="text-white font-bold">
                      {Math.round(currentPair.mfr_score * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${currentPair.mfr_score * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Model</span>
                    <span className="text-white font-bold">
                      {Math.round(currentPair.model_score * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="h-full bg-purple-400 rounded-full"
                      style={{ width: `${currentPair.model_score * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Unit Compatibility</span>
                    <span className="text-white font-bold">
                      {Math.round(currentPair.unit_score * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${currentPair.unit_score * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Candidate Equivalent Material (CPSE B) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0c1424] border border-[#1b2b48] shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1b2b48] mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-sm text-white">
                      {currentPair.candidate_material.cpse}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    Candidate Equivalent
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      Material Code
                    </span>
                    <p className="text-base font-extrabold text-cyan-400 font-mono">
                      {currentPair.candidate_material.material_code}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      Local ERP Description
                    </span>
                    <p className="text-sm font-semibold text-white mt-0.5 leading-snug">
                      "{currentPair.candidate_material.description}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono">Category</span>
                      <p className="text-slate-200 font-medium">
                        {currentPair.candidate_material.category}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono">Manufacturer</span>
                      <p className="text-slate-200 font-medium">
                        {currentPair.candidate_material.manufacturer || "Not Specified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono">Model / Part No</span>
                      <p className="text-slate-200 font-medium">
                        {currentPair.candidate_material.model || "—"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono">Unit of Measure</span>
                      <p className="text-cyan-300 font-mono font-bold">
                        {currentPair.candidate_material.unit}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono">Engineering Specification</span>
                    <p className="text-xs text-slate-300 mt-0.5 font-mono bg-[#090f1d] p-2.5 rounded border border-slate-800">
                      {currentPair.candidate_material.specification || "Standard catalog spec"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1b2b48] flex items-center justify-between text-[11px] text-slate-400">
                <span>Plant: {currentPair.candidate_material.plant}</span>
                <span>Qty: {currentPair.candidate_material.quantity}</span>
              </div>
            </div>
          </div>

          {/* Explainable AI Evidence Card */}
          <div className="p-6 rounded-2xl bg-[#0c1424] border border-[#1b2b48] shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2b48] mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Why did MATRIQ AI match these materials?
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-0.5 rounded-full">
                Explainable AI Rationale
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-300">
                  Algorithmic Verification Checklist:
                </p>
                {currentPair.rationale.map((reason, rIdx) => (
                  <div
                    key={rIdx}
                    className="flex items-center gap-2 text-xs font-medium text-slate-200 bg-[#0e172a] p-2.5 rounded-lg border border-[#1b2b48]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>

              {/* Recommended Standard Identity Output Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#0e1f2f] to-[#0a1426] border border-cyan-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300 mb-1">
                    <span>RECOMMENDED UNIFIED CODE</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20">READY FOR APPROVAL</span>
                  </div>
                  <p className="text-lg font-extrabold text-amber-400 font-mono tracking-wide">
                    MAT-BRG-6205-2RS
                  </p>
                  <p className="text-xs font-bold text-white mt-0.5">
                    Deep Groove Ball Bearing 6205-2RS
                  </p>
                  <p className="text-[11px] text-slate-300 mt-2">
                    Harmonizes{" "}
                    <span className="font-mono text-amber-300 font-semibold">
                      {currentPair.source_material.material_code}
                    </span>{" "}
                    and{" "}
                    <span className="font-mono text-cyan-300 font-semibold">
                      {currentPair.candidate_material.material_code}
                    </span>{" "}
                    into a single national catalog record.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-cyan-500/20 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Requires Reviewer Sign-Off</span>
                  <button
                    onClick={() => onNavigate("review")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                  >
                    <span>Open in Review Queue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center text-slate-400 font-mono text-xs">
          No matches found. Run AI Harmonization to generate pairs.
        </div>
      )}
    </div>
  );
};

