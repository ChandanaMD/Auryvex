import React, { useState, useEffect } from "react";
import { Sliders, Save, RotateCcw, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { api } from "../services/api";

export const SettingsView: React.FC = () => {
  const [weights, setWeights] = useState({
    weight_semantic: 0.35,
    weight_specification: 0.20,
    weight_category: 0.15,
    weight_manufacturer: 0.10,
    weight_model: 0.10,
    weight_unit: 0.10,
    threshold_high: 0.90,
    threshold_medium: 0.75,
  });
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    loadWeights();
  }, []);

  const loadWeights = async () => {
    try {
      const res = await api.getAiWeights();
      setWeights(res);
    } catch (err) {
      console.error("Failed to load weights", err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateAiWeights(weights);
      setSavedMsg("AI Matching configuration updated successfully!");
      setTimeout(() => setSavedMsg(null), 3000);
    } catch (err: any) {
      alert(`Failed to save settings: ${err.message}`);
    }
  };

  const handleReset = () => {
    setWeights({
      weight_semantic: 0.35,
      weight_specification: 0.20,
      weight_category: 0.15,
      weight_manufacturer: 0.10,
      weight_model: 0.10,
      weight_unit: 0.10,
      threshold_high: 0.90,
      threshold_medium: 0.75,
    });
  };

  const sumWeights = (
    weights.weight_semantic +
    weights.weight_specification +
    weights.weight_category +
    weights.weight_manufacturer +
    weights.weight_model +
    weights.weight_unit
  ).toFixed(2);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            AI Algorithm Calibration
          </span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            Multi-Factor Tuning
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
          AI Matching Pipeline & Threshold Settings
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure mathematical weights for multi-factor similarity calculations, specification extraction sensitivity, and human review decision gates.
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{savedMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Similarity Factors Sliders */}
        <div className="p-6 rounded-2xl bg-[#0c1424] border border-[#1b2b48] shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1b2b48]">
            <div>
              <h3 className="text-sm font-bold text-white">Multi-Factor Similarity Weights</h3>
              <p className="text-[11px] text-slate-400">Sum of weights: {sumWeights} (Target = 1.00)</p>
            </div>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${Number(sumWeights) === 1.0 ? "text-emerald-400 bg-emerald-500/10" : "text-amber-400 bg-amber-500/10"}`}>
              Weights Sum: {sumWeights}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Semantic */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-200">Semantic / Description (TF-IDF & N-Grams)</span>
                <span className="font-mono text-amber-400">{(weights.weight_semantic * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.weight_semantic}
                onChange={(e) => setWeights({ ...weights, weight_semantic: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
              <p className="text-[10px] text-slate-500">Sub-word character n-gram cosine similarity and fuzzy match.</p>
            </div>

            {/* Specification */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-200">Specification / Dimensions Matching</span>
                <span className="font-mono text-emerald-400">{(weights.weight_specification * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.weight_specification}
                onChange={(e) => setWeights({ ...weights, weight_specification: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500"
              />
              <p className="text-[10px] text-slate-500">Regex-extracted bore, OD, width, voltage, pressure ratings.</p>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-200">Category / Engineering Domain</span>
                <span className="font-mono text-cyan-400">{(weights.weight_category * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.weight_category}
                onChange={(e) => setWeights({ ...weights, weight_category: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500"
              />
              <p className="text-[10px] text-slate-500">Taxonomy hierarchy and category token set overlap.</p>
            </div>

            {/* Manufacturer */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-200">Manufacturer / OEM Similarity</span>
                <span className="font-mono text-indigo-400">{(weights.weight_manufacturer * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.weight_manufacturer}
                onChange={(e) => setWeights({ ...weights, weight_manufacturer: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500"
              />
              <p className="text-[10px] text-slate-500">Brand and manufacturer token sort ratio.</p>
            </div>

            {/* Model */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-200">Model / Part Number Exact Match</span>
                <span className="font-mono text-purple-400">{(weights.weight_model * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.weight_model}
                onChange={(e) => setWeights({ ...weights, weight_model: parseFloat(e.target.value) })}
                className="w-full accent-purple-500"
              />
              <p className="text-[10px] text-slate-500">Part number containment and token matching.</p>
            </div>

            {/* Unit */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-200">Unit Compatibility</span>
                <span className="font-mono text-emerald-400">{(weights.weight_unit * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.weight_unit}
                onChange={(e) => setWeights({ ...weights, weight_unit: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500"
              />
              <p className="text-[10px] text-slate-500">Canonical SI unit compatibility (e.g. EA vs NOS = 100%).</p>
            </div>
          </div>
        </div>

        {/* Confidence Thresholds */}
        <div className="p-6 rounded-2xl bg-[#0c1424] border border-[#1b2b48] shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white pb-3 border-b border-[#1b2b48]">
            Confidence Decision Thresholds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-400">High Confidence Threshold</span>
                <span className="font-mono text-emerald-300">{(weights.threshold_high * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="0.99"
                step="0.01"
                value={weights.threshold_high}
                onChange={(e) => setWeights({ ...weights, threshold_high: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500"
              />
              <p className="text-[10px] text-slate-500">Automatic recommendation for reviewer sign-off.</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-amber-400">Medium Confidence Threshold</span>
                <span className="font-mono text-amber-300">{(weights.threshold_medium * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.85"
                step="0.01"
                value={weights.threshold_medium}
                onChange={(e) => setWeights({ ...weights, threshold_medium: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
              <p className="text-[10px] text-slate-500">Flagged for manual review with warning tag.</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wider transition-all shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};

