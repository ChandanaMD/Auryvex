import React, { useState, useEffect, useCallback } from "react";
import {
  Database,
  Search,
  Filter,
  RefreshCw,
  ChevronRight,
  X,
  Layers,
  Cpu,
  Tag
} from "lucide-react";
import { api } from "../services/api";
import { Material } from "../types";
import { Badge } from "../components/common/Badge";

const CATEGORIES = [
  "All Categories",
  "Bearings",
  "Fasteners",
  "Valves",
  "Electrical",
  "Cables",
  "Gaskets",
  "Pumps",
  "Filters",
  "Tools",
];

const CPSES = ["All CPSEs", "CPSE-A", "CPSE-B", "CPSE-C"];

const STATUS_COLORS: Record<string, "emerald" | "amber" | "rose" | "slate"> = {
  ACTIVE: "emerald",
  HARMONIZED: "amber",
  REDUNDANT: "rose",
};

export const MaterialsView: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cpseFilter, setCpseFilter] = useState("All CPSEs");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Material | null>(null);

  const PAGE_SIZE = 20;

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        skip: page * PAGE_SIZE,
        limit: PAGE_SIZE,
      };
      if (search.trim()) params.search = search.trim();
      if (cpseFilter !== "All CPSEs") params.cpse = cpseFilter;
      if (categoryFilter !== "All Categories") params.category = categoryFilter;

      const data = await api.getMaterials(params);
      if (Array.isArray(data)) {
        setMaterials(data);
        setTotal(
          data.length < PAGE_SIZE
            ? page * PAGE_SIZE + data.length
            : (page + 1) * PAGE_SIZE + 1
        );
      }
    } catch (err) {
      console.error("Failed to load materials:", err);
    } finally {
      setLoading(false);
    }
  }, [search, cpseFilter, categoryFilter, page]);

  useEffect(() => {
    const t = setTimeout(fetchMaterials, 300);
    return () => clearTimeout(t);
  }, [fetchMaterials]);

  const handleReset = () => {
    setSearch("");
    setCpseFilter("All CPSEs");
    setCategoryFilter("All Categories");
    setPage(0);
  };

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <Database className="w-7 h-7 text-amber-400" />
            Material Intelligence
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Browse, search and inspect all ingested CPSE material records
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-400">Total Records</p>
            <p className="text-2xl font-extrabold font-mono text-amber-400">24,860</p>
          </div>
          <button
            onClick={fetchMaterials}
            className="p-2.5 rounded-lg bg-[#111827] border border-[#1e2f4f] hover:border-amber-500/40 text-slate-400 hover:text-amber-400 transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-[#0d1527] border border-[#1b2b48]">
        <div className="flex-1 min-w-[220px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search material code, description, manufacturer..."
            className="w-full bg-[#111827] border border-[#1e2f4f] rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300" />
            </button>
          )}
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <select
            value={cpseFilter}
            onChange={(e) => { setCpseFilter(e.target.value); setPage(0); }}
            className="bg-[#111827] border border-[#1e2f4f] rounded-lg pl-9 pr-8 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 cursor-pointer appearance-none transition-colors"
          >
            {CPSES.map((c) => <option key={c} value={c} className="bg-[#0f172a]">{c}</option>)}
          </select>
        </div>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
            className="bg-[#111827] border border-[#1e2f4f] rounded-lg pl-9 pr-8 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 cursor-pointer appearance-none transition-colors"
          >
            {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#0f172a]">{c}</option>)}
          </select>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-medium transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Table + Detail Panel */}
      <div className="flex gap-4 flex-1 min-h-0">
        <div className={`flex flex-col flex-1 rounded-xl bg-[#0d1527] border border-[#1b2b48] overflow-hidden transition-all ${selected ? "max-w-[calc(100%-22rem)]" : "w-full"}`}>
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#0a1120] border-b border-[#1b2b48]">
                  {["Material Code", "Description", "Category", "CPSE", "Unit", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {h}
                    </th>
                  ))}
                  <th className="px-4 py-3 w-8" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-500">
                      <div className="flex flex-col items-center gap-3">
                        <Cpu className="w-8 h-8 text-amber-500/40 animate-pulse" />
                        <span className="text-sm">Loading material records...</span>
                      </div>
                    </td>
                  </tr>
                ) : materials.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-500">
                      <div className="flex flex-col items-center gap-3">
                        <Database className="w-8 h-8 text-slate-700" />
                        <span className="text-sm">No materials found for your filters</span>
                        <button onClick={handleReset} className="text-xs text-amber-400 hover:underline">Clear filters</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  materials.map((mat) => (
                    <tr
                      key={mat.id}
                      onClick={() => setSelected(mat.id === selected?.id ? null : mat)}
                      className={`border-b border-[#111c33] cursor-pointer transition-colors group ${
                        selected?.id === mat.id
                          ? "bg-amber-500/10 border-l-2 border-l-amber-500"
                          : "hover:bg-[#111c33]"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {mat.material_code}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-200 max-w-[240px]">
                        <p className="truncate text-xs">{mat.description}</p>
                        {mat.manufacturer && (
                          <p className="text-[10px] text-slate-500 truncate">{mat.manufacturer}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-300 font-medium">{mat.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-cyan-400">{mat.cpse}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-400 font-mono">{mat.unit}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_COLORS[mat.status] || "slate"} size="sm">
                          {mat.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <ChevronRight className={`w-3.5 h-3.5 transition-colors ${selected?.id === mat.id ? "text-amber-400" : "text-slate-700 group-hover:text-slate-400"}`} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#1b2b48] bg-[#0a1120]">
            <span className="text-xs text-slate-500 font-mono">
              Showing {materials.length > 0 ? page * PAGE_SIZE + 1 : 0}-{page * PAGE_SIZE + materials.length} of {total}+ results
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 rounded bg-[#111827] border border-[#1e2f4f] text-xs text-slate-400 disabled:opacity-30 hover:border-amber-500/40 hover:text-amber-300 transition-all"
              >
                Prev
              </button>
              <span className="px-3 py-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-mono">
                Page {page + 1}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={materials.length < PAGE_SIZE}
                className="px-3 py-1.5 rounded bg-[#111827] border border-[#1e2f4f] text-xs text-slate-400 disabled:opacity-30 hover:border-amber-500/40 hover:text-amber-300 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {selected && (
          <div className="w-80 shrink-0 rounded-xl bg-[#0d1527] border border-[#1b2b48] flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1b2b48] flex items-center justify-between bg-[#0a1120]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200">Material Detail</span>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Material Code</p>
                <p className="font-mono text-amber-300 text-sm bg-amber-500/10 px-3 py-1.5 rounded border border-amber-500/20">
                  {selected.material_code}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Status</p>
                <Badge variant={STATUS_COLORS[selected.status] || "slate"} size="sm">{selected.status}</Badge>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Source CPSE</p>
                <p className="text-sm font-mono text-cyan-400">{selected.cpse}</p>
                <p className="text-xs text-slate-400 mt-0.5">{selected.plant}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Description</p>
                <p className="text-xs text-slate-200 leading-relaxed">{selected.description}</p>
                {selected.normalized_description && (
                  <div className="mt-2 p-2 rounded bg-emerald-500/5 border border-emerald-500/20">
                    <p className="text-[10px] text-emerald-400 mb-0.5">AI Normalized</p>
                    <p className="text-xs text-slate-300">{selected.normalized_description}</p>
                  </div>
                )}
              </div>
              {selected.specification && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Specification</p>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono bg-[#111827] p-2 rounded">
                    {selected.specification}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Category</p>
                  <p className="text-xs text-slate-200">{selected.category}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Unit</p>
                  <p className="text-xs font-mono text-slate-200">{selected.unit}</p>
                  {selected.normalized_unit && selected.normalized_unit !== selected.unit && (
                    <p className="text-[10px] text-emerald-400 mt-0.5">to {selected.normalized_unit}</p>
                  )}
                </div>
              </div>
              {(selected.manufacturer || selected.model) && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Manufacturer</p>
                    <p className="text-xs text-slate-200">{selected.manufacturer || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Model</p>
                    <p className="text-xs font-mono text-slate-200">{selected.model || "N/A"}</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Qty on Record</p>
                  <p className="text-xs font-mono text-slate-200">{selected.quantity?.toLocaleString() || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Unit Price</p>
                  <p className="text-xs font-mono text-slate-200">
                    {selected.unit_price ? `Rs.${selected.unit_price.toLocaleString()}` : "N/A"}
                  </p>
                </div>
              </div>
              {selected.standardized_group_id && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="text-[10px] text-amber-300 font-semibold mb-0.5">In Harmonization Group</p>
                  <p className="text-xs text-slate-300 font-mono">Group #{selected.standardized_group_id}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
