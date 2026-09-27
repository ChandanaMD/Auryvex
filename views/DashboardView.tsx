import React, { useEffect, useState } from "react";
import { 
  Database, 
  GitCompare, 
  CheckCircle2, 
  TrendingDown, 
  Sparkles, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Cpu
} from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  AreaChart, Area
} from "recharts";
import { api } from "../services/api";
import { StatCard } from "../components/common/StatCard";
import { NavItemKey } from "../components/layout/Sidebar";

interface DashboardViewProps {
  onNavigate: (view: NavItemKey) => void;
  onRunHarmonization: () => void;
  isHarmonizing: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onRunHarmonization,
  isHarmonizing
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardStats();
      setData(res);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const kpis = data?.kpis || {
    total_materials: 24860,
    potential_duplicates: 3842,
    equivalent_materials: 2176,
    standardized_materials: 18492,
    potential_reduction_pct: 31.4,
    standardization_coverage_pct: 74.4,
    human_approval_rate_pct: 94.2
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Callout */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d172e] via-[#101e3d] to-[#0c1426] border border-[#1e3258] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              National Harmonization Center
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ● All CPSE Nodes Connected
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
            Central CPSE Material Command Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time cross-enterprise material deduplication, equivalence resolution, and unified catalog standardization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-[#14213d] hover:bg-[#1a2d54] text-slate-300 border border-[#233b66] transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-amber-400" : ""}`} />
          </button>
          
          <button
            onClick={onRunHarmonization}
            disabled={isHarmonizing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wider transition-all shadow-lg shadow-amber-500/20 hover:scale-105 disabled:opacity-50"
          >
            <Cpu className="w-4 h-4" />
            <span>{isHarmonizing ? "PROCESSING AI PIPELINE..." : "RUN AI HARMONIZATION"}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Materials"
          value={kpis.total_materials.toLocaleString()}
          subtitle="Across 5 CPSEs"
          icon={Database}
          color="indigo"
        />
        <StatCard
          title="Potential Duplicates"
          value={kpis.potential_duplicates.toLocaleString()}
          trend="+15.5%"
          subtitle="Identified for merge"
          icon={GitCompare}
          color="amber"
        />
        <StatCard
          title="Equivalents Detected"
          value={kpis.equivalent_materials.toLocaleString()}
          subtitle="Cross-enterprise matches"
          icon={Sparkles}
          color="cyan"
        />
        <StatCard
          title="Standardized Records"
          value={kpis.standardized_materials.toLocaleString()}
          trend="74.4% Coverage"
          subtitle="Approved identities"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Catalogue Reduction"
          value={`${kpis.potential_reduction_pct}%`}
          trend="Target >30%"
          subtitle="Procurement efficiency"
          icon={TrendingDown}
          color="amber"
        />
      </div>

      {/* Charts Grid: Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart A: Harmonization Status */}
        <div className="p-5 rounded-2xl bg-[#0c1424] border border-[#1b2b48] shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Material Harmonization Status
              </h3>
              <p className="text-[11px] text-slate-400">Catalogue distribution by state</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Total 24,860
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.harmonization_status || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {(data?.harmonization_status || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e2f4f", borderRadius: "8px", fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#1b2b48] text-[11px]">
            {(data?.harmonization_status || []).map((s: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-400 truncate">{s.name}:</span>
                <span className="font-mono font-bold text-white ml-auto">{s.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart B: Materials by CPSE */}
        <div className="p-5 rounded-2xl bg-[#0c1424] border border-[#1b2b48] shadow-lg flex flex-col justify-between lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Materials Ingested vs Standardized by CPSE
              </h3>
              <p className="text-[11px] text-slate-400">Total catalog vs standardized clean records</p>
            </div>
            <button
              onClick={() => onNavigate("analytics")}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Detailed Breakdown</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.materials_by_cpse || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#17243d" />
                <XAxis dataKey="cpse" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e2f4f", borderRadius: "8px", fontSize: "11px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="count" name="Total Ingested" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="standardized" name="Standardized" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="duplicates" name="Duplicates" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid: Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart C: AI Confidence Distribution */}
        <div className="p-5 rounded-2xl bg-[#0c1424] border border-[#1b2b48] shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                AI Confidence Distribution
              </h3>
              <p className="text-[11px] text-slate-400">Match quality thresholds</p>
            </div>
          </div>

          <div className="space-y-4 my-auto py-2">
            {(data?.confidence_distribution || []).map((c: any, idx: number) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{c.range}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400">{c.count} items</span>
                    <span className="font-mono font-bold" style={{ color: c.color }}>{c.pct}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${c.pct}%`, backgroundColor: c.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1b2b48] text-[11px] text-slate-400">
            Rule: Only matches with <span className="text-amber-400 font-mono font-bold">&gt;=90%</span> confidence qualify for one-click human verification.
          </div>
        </div>

        {/* Chart D: Monthly Progress */}
        <div className="p-5 rounded-2xl bg-[#0c1424] border border-[#1b2b48] shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Harmonization Progress & Redundancy Reduction Trend
              </h3>
              <p className="text-[11px] text-slate-400">Cumulative materials processed over 5 months</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.monthly_progress || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHarmonized" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorIngested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#17243d" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e2f4f", borderRadius: "8px", fontSize: "11px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Area type="monotone" dataKey="ingested" name="Total Ingested" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIngested)" />
                <Area type="monotone" dataKey="harmonized" name="Harmonized" stroke="#10b981" fillOpacity={1} fill="url(#colorHarmonized)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 10 Categories Bar */}
      <div className="p-5 rounded-2xl bg-[#0c1424] border border-[#1b2b48] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Material Categories Breakdown
            </h3>
            <p className="text-[11px] text-slate-400">Harmonized volume by engineering domain</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(data?.top_categories || []).map((cat: any, idx: number) => (
            <div key={idx} className="p-3 rounded-xl bg-[#0e172a] border border-[#1e2f4f] hover:border-amber-500/40 transition-colors">
              <p className="text-xs font-bold text-white truncate">{cat.name}</p>
              <div className="flex items-center justify-between mt-2 text-[11px] font-mono">
                <span className="text-slate-400">Count:</span>
                <span className="font-bold text-cyan-400">{cat.count.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5 text-[10px] font-mono">
                <span className="text-slate-500">Dupes:</span>
                <span className="text-amber-400 font-semibold">{cat.duplicates}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

