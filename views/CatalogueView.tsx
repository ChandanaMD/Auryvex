import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Share2, 
  CheckCircle2, 
  Building2, 
  Layers, 
  ExternalLink, 
  X,
  Clock,
  History,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { api } from "../services/api";
import { HarmonizationGroup } from "../types";
import { Badge } from "../components/common/Badge";
import { NavItemKey } from "../components/layout/Sidebar";

interface CatalogueViewProps {
  onSelectGraphItem?: (group: HarmonizationGroup) => void;
  onNavigate: (view: NavItemKey) => void;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  onSelectGraphItem,
  onNavigate
}) => {
  const [items, setItems] = useState<HarmonizationGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<any>(null);

  useEffect(() => {
    loadCatalogue();
  }, [categoryFilter, statusFilter]);

  const loadCatalogue = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter) params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;
      const res = await api.getCatalogue(params);
      setItems(res);
    } catch (err) {
      console.error("Failed to load catalogue", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (id: number) => {
    try {
      const detail = await api.getCatalogueDetail(id);
      setSelectedDetail(detail);
    } catch (err) {
      console.error("Failed to load detail", err);
    }
  };

  const categories = [
    "Bearings",
    "Valves",
    "Fasteners",
    "Cables",
    "Pumps",
    "Motors",
    "Sensors",
    "Safety Equipment",
    "Industrial Chemicals"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              National Repository
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Single Source of Truth
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
            Central Standardized Material Catalogue
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            National unified material master records harmonized across CPSE Alpha, Bharat, Energy, Engineering, and Infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#0c1424] px-3 py-1.5 rounded-lg border border-[#1b2b48]">
          <span>Standardized Records:</span>
          <span className="font-bold text-emerald-400">{items.length} Identities</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0c1424] border border-[#1b2b48] flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by code, title, manufacturer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadCatalogue()}
            className="w-full bg-[#080d1a] border border-[#1b2b48] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#080d1a] border border-[#1b2b48] rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#080d1a] border border-[#1b2b48] rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="MODIFIED">Modified</option>
          </select>

          <button
            onClick={loadCatalogue}
            className="px-3 py-2 rounded-lg bg-[#14213d] hover:bg-[#1a2d54] text-xs font-semibold text-slate-200 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Catalogue Table */}
      <div className="rounded-2xl bg-[#0c1424] border border-[#1b2b48] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e172a] text-slate-400 font-mono uppercase text-[10px] border-b border-[#1b2b48]">
              <tr>
                <th className="py-3 px-4">Standard Code</th>
                <th className="py-3 px-4">Canonical Material Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Manufacturer</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Linked CPSEs</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#17233c] text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-mono">
                    Loading Central Catalogue...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-mono">
                    No matching catalog records found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleOpenDetail(item.id)}
                    className="hover:bg-[#121c32] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                      {item.standard_code}
                    </td>
                    <td className="py-3 px-4 font-medium text-white max-w-xs truncate">
                      {item.canonical_name}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{item.category}</td>
                    <td className="py-3 px-4 text-slate-400">
                      {item.manufacturer || "Standard"}
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-300 font-bold">
                      {item.normalized_unit}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 flex-wrap">
                        {item.source_cpses.map((cpse, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300"
                          >
                            {cpse.replace("CPSE ", "")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {(item.confidence_score * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          item.status === "APPROVED"
                            ? "emerald"
                            : item.status === "PENDING_REVIEW"
                            ? "amber"
                            : "cyan"
                        }
                      >
                        {item.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectGraphItem) onSelectGraphItem(item);
                          onNavigate("graph");
                        }}
                        className="px-2.5 py-1 rounded bg-[#162544] hover:bg-[#1f3563] text-cyan-300 text-[10px] font-mono flex items-center gap-1 ml-auto"
                        title="View Convergence Network"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Graph</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 rounded-2xl bg-[#0c1424] border border-[#1b2b48] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2b48]">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Standardized Catalog Identity
                </span>
                <h3 className="text-base font-extrabold text-white mt-1">
                  {selectedDetail.standard_code} - {selectedDetail.canonical_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="text-slate-400 hover:text-white text-base"
              >
                ✕
              </button>
            </div>

            {/* Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#080d1a] border border-[#1b2b48] text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-mono">Category</span>
                <p className="font-semibold text-slate-200">{selectedDetail.category}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono">Manufacturer</span>
                <p className="font-semibold text-slate-200">{selectedDetail.manufacturer || "Standard"}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono">Normalized Unit</span>
                <p className="font-bold text-amber-300 font-mono">{selectedDetail.normalized_unit}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono">Confidence</span>
                <p className="font-bold text-emerald-400 font-mono">
                  {(selectedDetail.confidence_score * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Engineering Specifications */}
            <div>
              <span className="text-xs font-semibold text-slate-300 font-mono uppercase">
                Consolidated Specifications
              </span>
              <p className="text-xs text-slate-200 mt-1 bg-[#090f1d] p-3 rounded-lg border border-slate-800 font-mono">
                {selectedDetail.specifications || "Standard engineering spec"}
              </p>
            </div>

            {/* Mapped CPSE Records */}
            <div>
              <span className="text-xs font-semibold text-slate-300 font-mono uppercase">
                Converged CPSE Local Items ({selectedDetail.materials?.length || 0})
              </span>
              <div className="mt-2 space-y-2">
                {(selectedDetail.materials || []).map((m: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#0e172a] border border-[#1b2b48] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-300">{m.cpse}</span>
                        <span className="font-mono text-amber-400 font-bold">[{m.material_code}]</span>
                        <span className="text-[10px] text-slate-500">{m.plant}</span>
                      </div>
                      <p className="text-slate-200 mt-1 font-medium">"{m.description}"</p>
                    </div>
                    <div className="text-right text-[11px] font-mono">
                      <span className="text-slate-400">Unit: {m.unit}</span>
                      <p className="text-emerald-400 font-bold">Active</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-[#1b2b48] flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedDetail(null);
                  if (onSelectGraphItem) onSelectGraphItem(selectedDetail);
                  onNavigate("graph");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#14213d] hover:bg-[#1a2e56] border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Explore Convergence Graph</span>
              </button>

              <button
                onClick={() => setSelectedDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

