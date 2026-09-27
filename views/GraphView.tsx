import React, { useState, useEffect } from "react";
import { Share2, Layers, CheckCircle2, ChevronDown, Sparkles } from "lucide-react";
import { api } from "../services/api";
import { MaterialGraph } from "../components/graph/MaterialGraph";
import { HarmonizationGroup } from "../types";

interface GraphViewProps {
  initialGroup?: HarmonizationGroup | null;
}

export const GraphView: React.FC<GraphViewProps> = ({ initialGroup }) => {
  const [catalogueList, setCatalogueList] = useState<HarmonizationGroup[]>([]);
  const [selectedId, setSelectedId] = useState<number>(initialGroup?.id || 1);
  const [graphData, setGraphData] = useState<any>({
    standard_code: "MAT-BRG-6205-2RS",
    canonical_name: "Deep Groove Ball Bearing 6205-2RS",
    nodes: [],
    links: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCatalogue();
  }, []);

  useEffect(() => {
    if (initialGroup) {
      setSelectedId(initialGroup.id);
    }
  }, [initialGroup]);

  useEffect(() => {
    if (selectedId) {
      loadGraph(selectedId);
    }
  }, [selectedId]);

  const loadCatalogue = async () => {
    try {
      const items = await api.getCatalogue();
      setCatalogueList(items);
      if (items.length > 0 && !initialGroup) {
        setSelectedId(items[0].id);
      }
    } catch (err) {
      console.error("Failed to load catalogue items", err);
    }
  };

  const loadGraph = async (id: number) => {
    try {
      setLoading(true);
      const res = await api.getCatalogueGraph(id);
      setGraphData(res);
    } catch (err) {
      console.error("Failed to load graph data", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Visual Convergence Explorer
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Topological Code Mapping
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
            Material Relationship & Convergence Network
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive visual network demonstrating how disparate enterprise item codes from multiple CPSEs map into a standardized national material identity.
          </p>
        </div>

        {/* Dropdown selector for standard items */}
        <div className="flex items-center gap-2 bg-[#0c1424] border border-[#1b2b48] rounded-xl px-3 py-2">
          <span className="text-xs text-slate-400 font-mono">Select Identity:</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            className="bg-transparent text-xs font-bold text-amber-400 focus:outline-none cursor-pointer font-mono"
          >
            {catalogueList.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#0f172a] text-white">
                {c.standard_code} - {c.canonical_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Interactive Graph Canvas */}
      {loading ? (
        <div className="h-[540px] rounded-2xl bg-[#090f1d] border border-[#1b2b48] flex items-center justify-center text-slate-500 font-mono text-xs">
          Calculating relationship topology & rendering canvas...
        </div>
      ) : (
        <MaterialGraph data={graphData} />
      )}

      {/* Explanation Banner */}
      <div className="p-4 rounded-xl bg-[#0c1424] border border-[#1b2b48] flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">How to Read this Convergence Network:</strong> The outer ring represents participating CPSE organizations (e.g. CPSE Alpha, CPSE Bharat, CPSE Energy). The middle nodes represent disparate legacy material codes created by local enterprise plant ERPs. The central green node represents the <strong>National Standard Identity</strong> recommended by MATRIQ AI and ratified by the reviewer committee.
        </div>
      </div>
    </div>
  );
};

