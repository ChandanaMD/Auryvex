import React from "react";

interface ConfidenceMeterProps {
  score: number; // 0.0 to 1.0 or 0 to 100
  showLabel?: boolean;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ score, showLabel = true }) => {
  const normalized = score > 1 ? score : score * 100;
  const isHigh = normalized >= 90;
  const isMedium = normalized >= 75 && normalized < 90;

  const colorClass = isHigh ? "bg-emerald-500" : isMedium ? "bg-amber-500" : "bg-rose-500";
  const textClass = isHigh ? "text-emerald-400" : isMedium ? "text-amber-400" : "text-rose-400";
  const label = isHigh ? "High Confidence" : isMedium ? "Medium Confidence" : "Manual Review";

  return (
    <div className="flex items-center gap-2.5">
      <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${Math.min(normalized, 100)}%` }}
        />
      </div>
      <span className={`text-xs font-mono font-bold ${textClass}`}>
        {normalized.toFixed(1)}%
      </span>
      {showLabel && (
        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
          ({label})
        </span>
      )}
    </div>
  );
};
