import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  icon: LucideIcon;
  color?: "amber" | "emerald" | "cyan" | "indigo" | "rose";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  color = "amber",
}) => {
  const colorMap = {
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10",
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 shadow-cyan-500/10",
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/10",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-rose-500/10",
  };

  return (
    <div className="p-4 rounded-xl bg-[#0f172a] border border-[#1e2f4f] shadow-lg flex items-center justify-between hover:border-slate-600 transition-colors">
      <div>
        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase font-mono">
          {title}
        </p>
        <p className="text-2xl font-extrabold text-white mt-1 tracking-tight font-mono">
          {value}
        </p>
        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                {trend}
              </span>
            )}
            {subtitle && <span className="text-[11px] text-slate-400">{subtitle}</span>}
          </div>
        )}
      </div>

      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
