import React, { useState, useEffect } from "react";
import { Sparkles, Search, Filter, ShieldCheck, History, Clock } from "lucide-react";
import { api } from "../services/api";
import { AuditLogItem } from "../types";

export const AuditView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  useEffect(() => {
    loadLogs();
  }, [actionFilter]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (actionFilter) params.action = actionFilter;
      const res = await api.getAuditLogs(params);
      setLogs(res);
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((l) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      l.user_name.toLowerCase().includes(term) ||
      l.action.toLowerCase().includes(term) ||
      (l.material_code && l.material_code.toLowerCase().includes(term)) ||
      (l.comments && l.comments.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Government Compliance
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Immutable Ledger
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
            National Master Data Audit Trail
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically timestamped audit log of all ingestion, AI matching, reviewer sign-offs, modifications, and catalog updates.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#0c1424] px-3 py-1.5 rounded-lg border border-[#1b2b48]">
          <History className="w-4 h-4 text-cyan-400" />
          <span>{filteredLogs.length} Logged Events</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0c1424] border border-[#1b2b48] flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by officer name, action, standard code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#080d1a] border border-[#1b2b48] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-[#080d1a] border border-[#1b2b48] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="">All Action Types</option>
            <option value="APPROVE">Approval Actions</option>
            <option value="MODIFY">Modifications</option>
            <option value="INGESTION">Ingestion</option>
            <option value="HARMONIZATION">Harmonization Runs</option>
            <option value="QUALITY">Quality Remediation</option>
          </select>

          <button
            onClick={loadLogs}
            className="px-3 py-2 rounded-lg bg-[#14213d] hover:bg-[#1a2d54] text-xs font-semibold text-slate-200 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl bg-[#0c1424] border border-[#1b2b48] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e172a] text-slate-400 font-mono uppercase text-[10px] border-b border-[#1b2b48]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Officer / Agent</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Material</th>
                <th className="py-3 px-4">Previous State</th>
                <th className="py-3 px-4">New State</th>
                <th className="py-3 px-4">Audit Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#17233c] text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                    Loading audit trail...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                    No matching audit entries found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#121c32] transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{log.user_name}</div>
                      <div className="text-[10px] font-mono text-slate-500">{log.user_role}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {log.material_code || "—"}
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate font-mono text-[11px]">
                      {log.previous_value || "—"}
                    </td>
                    <td className="py-3 px-4 text-emerald-300 max-w-xs truncate font-mono text-[11px] font-semibold">
                      {log.new_value || "—"}
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate text-[11px]">
                      {log.comments || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

