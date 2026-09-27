import React, { useEffect, useState } from "react";
import { 
  BarChart3, 
  TrendingDown, 
  Percent, 
  CheckCircle2, 
  Layers, 
  Building2, 
  Clock, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import { api } from "../services/api";
import { StatCard } from "../components/common/StatCard";

export const AnalyticsView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getAnalyticsSummary();
      setData(res);
    } catch (err) {
      console.error("Failed to load analytics summary", err);
    } finally {
      setLoading(false);
    }
  };

  const overview = data?.impact_overview || {
    before_unique_records: 24860,
    after_standardized_records: 18492,
    potential_catalogue_reduction_pct: 25.6,
    duplicate_rate_pct: 15.5,
    harmonization_rate_pct: 74.4,
    standardization_coverage_pct: 78.2,
    cross_cpse_similarity_avg: 88.6,
    human_approval_rate_pct: 94.2
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Enterprise Impact Analytics
          </span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            Procurement Optimization
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
          Catalogue Optimization & Standardization Impact
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Quantifiable efficiency gains achieved through cross-CPSE catalog consolidation and duplicate elimination.
        </p>
      </div>

      {/* Large Hero Impact Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1e38] via-[#102446] to-[#0d1629] border border-[#223d6d] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono uppercase text-amber-300 font-bold tracking-wider">
            National Catalogue Optimization Impact
          </span>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
            Simulated Estimate
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="p-4 rounded-xl bg-[#080d1a]/80 border border-slate-800 text-center">
            <p className="text-[11px] font-mono text-slate-400 uppercase">Pre-Harmonization Count</p>
            <p className="text-3xl font-extrabold text-white font-mono mt-1">24,860</p>
            <p className="text-[10px] text-slate-500 mt-1">Fragmented CPSE Master Items</p>
          </div>

          <div className="p-4 rounded-xl bg-[#080d1a]/80 border border-emerald-500/40 text-center">
            <p className="text-[11px] font-mono text-emerald-400 uppercase">Unified National Master</p>
            <p className="text-3xl font-extrabold text-emerald-300 font-mono mt-1">18,492</p>
            <p className="text-[10px] text-emerald-400/70 mt-1">Standardized Clean Records</p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-center">
            <p className="text-[11px] font-mono text-amber-300 uppercase">Net Catalogue Reduction</p>
            <p className="text-3xl font-black text-amber-400 font-mono mt-1">
              {overview.potential_catalogue_reduction_pct}%
            </p>
            <p className="text-[10px] text-amber-200/70 mt-1">6,368 Redundant SKUs Eliminated</p>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl bg-[#0c1424] border border-[#1b2b48]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Duplicate Rate</span>
          <p className="text-lg font-bold font-mono text-amber-400 mt-1">{overview.duplicate_rate_pct}%</p>
        </div>
        <div className="p-3 rounded-xl bg-[#0c1424] border border-[#1b2b48]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Harmonization Rate</span>
          <p className="text-lg font-bold font-mono text-emerald-400 mt-1">{overview.harmonization_rate_pct}%</p>
        </div>
        <div className="p-3 rounded-xl bg-[#0c1424] border border-[#1b2b48]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Standardization Cov.</span>
          <p className="text-lg font-bold font-mono text-cyan-400 mt-1">{overview.standardization_coverage_pct}%</p>
        </div>
        <div className="p-3 rounded-xl bg-[#0c1424] border border-[#1b2b48]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Cross-CPSE Sim.</span>
          <p className="text-lg font-bold font-mono text-indigo-400 mt-1">{overview.cross_cpse_similarity_avg}%</p>
        </div>
        <div className="p-3 rounded-xl bg-[#0c1424] border border-[#1b2b48]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Approval Rate</span>
          <p className="text-lg font-bold font-mono text-emerald-400 mt-1">{overview.human_approval_rate_pct}%</p>
        </div>
        <div className="p-3 rounded-xl bg-[#0c1424] border border-[#1b2b48]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Avg Review Speed</span>
          <p className="text-lg font-bold font-mono text-white mt-1">29 sec/item</p>
        </div>
      </div>

      {/* Before vs After by Category Chart */}
      <div className="p-5 rounded-2xl bg-[#0c1424] border border-[#1b2b48] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Before vs After Harmonization by Engineering Domain
            </h3>
            <p className="text-[11px] text-slate-400">Inventory SKU consolidation comparison</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.before_after_by_category || []} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#17243d" />
              <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e2f4f", borderRadius: "8px", fontSize: "11px" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              <Bar dataKey="before" name="Before (Disparate SKUs)" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="after" name="After (Unified Standard Records)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Row: Cross CPSE Overlap Matrix & Review Turnaround */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cross-CPSE Duplication Matrix */}
        <div className="p-5 rounded-2xl bg-[#0c1424] border border-[#1b2b48] shadow-lg">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-2">
            Cross-CPSE Material Description Overlap Matrix (%)
          </h3>
          <p className="text-[11px] text-slate-400 mb-4">
            Shows percentage of material items in Row CPSE that have semantic duplicates in Column CPSE.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs">
              <thead className="bg-[#0e172a] text-slate-400 font-mono text-[10px] border-b border-[#1b2b48]">
                <tr>
                  <th className="py-2.5 px-3 text-left">Enterprise</th>
                  <th className="py-2.5 px-2">Alpha</th>
                  <th className="py-2.5 px-2">Bharat</th>
                  <th className="py-2.5 px-2">Energy</th>
                  <th className="py-2.5 px-2">Engg</th>
                  <th className="py-2.5 px-2">Infra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#17233c] text-slate-300 font-mono text-[11px]">
                {(data?.cross_cpse_matrix || []).map((m: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[#121c32]">
                    <td className="py-2 px-3 text-left font-sans font-semibold text-white whitespace-nowrap">
                      {m.cpse}
                    </td>
                    <td className={`py-2 px-2 ${m.overlap_alpha === 100 ? "text-slate-600" : "text-amber-300 font-bold"}`}>
                      {m.overlap_alpha}%
                    </td>
                    <td className={`py-2 px-2 ${m.overlap_bharat === 100 ? "text-slate-600" : "text-cyan-300 font-bold"}`}>
                      {m.overlap_bharat}%
                    </td>
                    <td className={`py-2 px-2 ${m.overlap_energy === 100 ? "text-slate-600" : "text-emerald-300 font-bold"}`}>
                      {m.overlap_energy}%
                    </td>
                    <td className={`py-2 px-2 ${m.overlap_engineering === 100 ? "text-slate-600" : "text-indigo-300 font-bold"}`}>
                      {m.overlap_engineering}%
                    </td>
                    <td className={`py-2 px-2 ${m.overlap_infra === 100 ? "text-slate-600" : "text-purple-300 font-bold"}`}>
                      {m.overlap_infra}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Duplicate Clusters */}
        <div className="p-5 rounded-2xl bg-[#0c1424] border border-[#1b2b48] shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-2">
              Top High-Value Duplicate Clusters
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">
              Identities generating the largest multi-enterprise procurement savings.
            </p>

            <div className="space-y-2.5">
              {(data?.top_duplicate_clusters || []).map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#0e172a] border border-[#1e2f4f] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono text-[10px] font-bold text-amber-400">
                      {item.code}
                    </span>
                    <p className="font-semibold text-white mt-0.5">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      CPSEs: {item.cpses}
                    </p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      {item.confidence}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">{item.source_count} Sources</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

