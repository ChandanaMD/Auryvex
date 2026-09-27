import React, { useState, useEffect } from "react";
import { 
  CheckSquare, 
  Check, 
  Edit3, 
  X, 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Layers, 
  AlertCircle,
  FileCheck,
  CheckCircle2
} from "lucide-react";
import confetti from "canvas-confetti";
import { api } from "../services/api";
import { HarmonizationGroup, UserRole } from "../types";
import { ConfidenceMeter } from "../components/common/ConfidenceMeter";
import { Badge } from "../components/common/Badge";

interface ReviewViewProps {
  currentRole: UserRole;
  onRefreshReviewCount?: () => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({ currentRole, onRefreshReviewCount }) => {
  const [queue, setQueue] = useState<HarmonizationGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<HarmonizationGroup | null>(null);

  // Modify Modal State
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [modifyData, setModifyData] = useState({
    code: "",
    name: "",
    category: "",
    mfr: "",
    specs: "",
    unit: "",
    comments: "",
  });
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    try {
      setLoading(true);
      const res = await api.getReviewQueue("PENDING_REVIEW");
      setQueue(res);
      if (res.length > 0 && !selectedGroup) {
        setSelectedGroup(res[0]);
      } else if (res.length > 0 && selectedGroup) {
        const found = res.find((r: any) => r.id === selectedGroup.id);
        setSelectedGroup(found || res[0]);
      }
      if (onRefreshReviewCount) onRefreshReviewCount();
    } catch (err) {
      console.error("Failed to load review queue", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: "APPROVE" | "REJECT" | "ESCALATE") => {
    if (!selectedGroup) return;

    try {
      await api.submitReviewAction(selectedGroup.id, {
        action,
        user_name: "Chief Reviewer Officer",
        user_role: currentRole,
        comments: `Reviewer performed ${action} from dashboard queue.`,
      });

      if (action === "APPROVE") {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        setActionSuccessMsg(`Approved ${selectedGroup.standard_code} into Central Catalogue!`);
      } else {
        setActionSuccessMsg(`Item marked as ${action}. Audit entry created.`);
      }

      setTimeout(() => setActionSuccessMsg(null), 4000);
      loadQueue();
    } catch (err: any) {
      alert(`Error submitting action: ${err.message}`);
    }
  };

  const openModifyModal = () => {
    if (!selectedGroup) return;
    setModifyData({
      code: selectedGroup.standard_code,
      name: selectedGroup.canonical_name,
      category: selectedGroup.category,
      mfr: selectedGroup.manufacturer || "",
      specs: selectedGroup.specifications || "",
      unit: selectedGroup.normalized_unit || "EA",
      comments: "Approved with engineering parameter corrections.",
    });
    setIsModifyModalOpen(true);
  };

  const handleModifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;

    try {
      await api.submitReviewAction(selectedGroup.id, {
        action: "MODIFY",
        user_name: "Chief Reviewer Officer",
        user_role: currentRole,
        comments: modifyData.comments,
        modified_standard_code: modifyData.code,
        modified_canonical_name: modifyData.name,
        modified_category: modifyData.category,
        modified_manufacturer: modifyData.mfr,
        modified_specifications: modifyData.specs,
        modified_unit: modifyData.unit,
      });

      setIsModifyModalOpen(false);
      confetti({ particleCount: 60, spread: 60 });
      setActionSuccessMsg(`Modified & approved standard item: ${modifyData.code}`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
      loadQueue();
    } catch (err: any) {
      alert(`Error modifying item: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Human-in-the-Loop Governance
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Mandatory Reviewer Verification
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
            Standardization Recommendation Review Queue
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            AI recommendations do not modify master data automatically. Official CPSE standardization requires human verification, parameter correction, or rejection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30 font-bold">
            {queue.length} Pending Recommendations
          </span>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Main Review Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Pending Items */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-[#0c1424] border border-[#1b2b48] space-y-2 max-h-[700px] overflow-y-auto">
          <p className="text-[10px] font-mono uppercase text-slate-400 px-2 mb-2">
            Pending Recommendations Queue
          </p>
          {loading ? (
            <p className="text-xs text-slate-400 p-4 font-mono">Loading review items...</p>
          ) : queue.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-bold text-white">All Clear!</p>
              <p className="text-[11px] mt-1">No items currently pending approval.</p>
            </div>
          ) : (
            queue.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGroup(g)}
                className={`w-full p-3.5 rounded-xl text-left transition-all border ${
                  selectedGroup?.id === g.id
                    ? "bg-[#14223d] border-amber-500 text-white shadow-lg"
                    : "bg-[#0e172a] border-[#1b2b48] text-slate-400 hover:text-slate-200 hover:bg-[#121c32]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-extrabold text-amber-400">
                    {g.standard_code}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    {(g.confidence_score * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-200 truncate">{g.canonical_name}</p>
                <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-slate-400">
                  <span>Category: {g.category}</span>
                  <span>{g.source_cpses.length} CPSEs</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Right Active Recommendation Detailed Card */}
        {selectedGroup ? (
          <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0c1424] border border-[#1b2b48] shadow-xl flex flex-col justify-between space-y-6">
            <div>
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1b2b48] gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="cyan">{selectedGroup.category}</Badge>
                    <Badge variant="emerald">{(selectedGroup.confidence_score * 100).toFixed(1)}% Match</Badge>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">
                    {selectedGroup.canonical_name}
                  </h3>
                  <p className="text-xs font-mono text-amber-400 font-bold mt-0.5">
                    Proposed Code: {selectedGroup.standard_code}
                  </p>
                </div>

                {/* Reviewer Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleAction("APPROVE")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide shadow-md transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={openModifyModal}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#14213d] hover:bg-[#1a2e56] border border-amber-500/40 text-amber-300 font-semibold text-xs transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Modify</span>
                  </button>
                  <button
                    onClick={() => handleAction("REJECT")}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1e1418] hover:bg-[#2b1820] border border-rose-500/40 text-rose-300 font-semibold text-xs transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleAction("ESCALATE")}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#121c32] hover:bg-[#182644] border border-[#233863] text-slate-300 font-semibold text-xs transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Escalate</span>
                  </button>
                </div>
              </div>

              {/* Standard Identity Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-3.5 rounded-xl bg-[#090f1d] border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">Manufacturer</span>
                  <p className="font-semibold text-slate-200">{selectedGroup.manufacturer || "Standard"}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">Model / Series</span>
                  <p className="font-semibold text-slate-200">{selectedGroup.model || "—"}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">Normalized Unit</span>
                  <p className="font-bold text-amber-300 font-mono">{selectedGroup.normalized_unit}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">CPSE Sources</span>
                  <p className="font-semibold text-cyan-300">{selectedGroup.source_cpses.length} Enterprises</p>
                </div>
              </div>

              {/* Explainable AI Evidence */}
              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-300">
                  AI Equivalence Evidence:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {(selectedGroup.ai_explanation || []).map((exp: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-lg bg-[#0e172a] border border-[#1b2b48] text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{exp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mapped Source Records Table */}
              <div>
                <span className="text-xs font-semibold text-slate-300">
                  Disparate CPSE Master Records Converged ({selectedGroup.materials?.length || 0}):
                </span>
                <div className="mt-2 space-y-2">
                  {(selectedGroup.materials || []).map((mat, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-3 rounded-xl bg-[#0e172a] border border-[#1e2f4f] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-cyan-300">{mat.cpse}</span>
                          <span className="font-mono text-amber-400 font-bold">
                            [{mat.material_code}]
                          </span>
                          <span className="text-[10px] text-slate-400">{mat.plant}</span>
                        </div>
                        <p className="text-slate-200 mt-1 font-medium">"{mat.description}"</p>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] font-mono shrink-0">
                        <span className="text-slate-400">
                          Unit: <strong className="text-slate-200">{mat.unit}</strong>
                        </span>
                        <span className="text-slate-400">
                          Qty: <strong className="text-slate-200">{mat.quantity}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1b2b48] flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Reviewed By: Pending Senior Reviewer</span>
              <span>Logged to Central Audit Log on Action</span>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-slate-400 font-mono text-xs">
            Select a recommendation from the queue to view details.
          </div>
        )}
      </div>

      {/* Modify Modal */}
      {isModifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="max-w-lg w-full p-6 rounded-2xl bg-[#0c1424] border border-[#1b2b48] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2b48] mb-4">
              <h3 className="font-bold text-sm text-white">Modify & Standardize Item</h3>
              <button
                onClick={() => setIsModifyModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleModifySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Standard Code</label>
                <input
                  type="text"
                  value={modifyData.code}
                  onChange={(e) => setModifyData({ ...modifyData, code: e.target.value })}
                  className="w-full bg-[#080d1a] border border-[#1b2b48] rounded px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Canonical Name</label>
                <input
                  type="text"
                  value={modifyData.name}
                  onChange={(e) => setModifyData({ ...modifyData, name: e.target.value })}
                  className="w-full bg-[#080d1a] border border-[#1b2b48] rounded px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={modifyData.category}
                    onChange={(e) => setModifyData({ ...modifyData, category: e.target.value })}
                    className="w-full bg-[#080d1a] border border-[#1b2b48] rounded px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Normalized Unit</label>
                  <input
                    type="text"
                    value={modifyData.unit}
                    onChange={(e) => setModifyData({ ...modifyData, unit: e.target.value })}
                    className="w-full bg-[#080d1a] border border-[#1b2b48] rounded px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Manufacturer</label>
                <input
                  type="text"
                  value={modifyData.mfr}
                  onChange={(e) => setModifyData({ ...modifyData, mfr: e.target.value })}
                  className="w-full bg-[#080d1a] border border-[#1b2b48] rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Specifications</label>
                <textarea
                  rows={2}
                  value={modifyData.specs}
                  onChange={(e) => setModifyData({ ...modifyData, specs: e.target.value })}
                  className="w-full bg-[#080d1a] border border-[#1b2b48] rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Review Comments</label>
                <input
                  type="text"
                  value={modifyData.comments}
                  onChange={(e) => setModifyData({ ...modifyData, comments: e.target.value })}
                  className="w-full bg-[#080d1a] border border-[#1b2b48] rounded px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-[#1b2b48] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModifyModalOpen(false)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                >
                  Save & Approve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

