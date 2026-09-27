import React, { useState } from "react";
import { Layers, ShieldCheck, ArrowRight, Lock, Mail, Building, Sparkles } from "lucide-react";

interface LoginViewProps {
  onLoginSuccess: () => void;
  onBackToLanding: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onBackToLanding }) => {
  const [organization, setOrganization] = useState("Demo CPSE");
  const [email, setEmail] = useState("admin@matriq.demo");
  const [password, setPassword] = useState("demo123");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-6 selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-md w-full bg-[#0c1424] border border-[#1b2b48] rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-amber-500/25 mb-4">
            <Layers className="w-7 h-7 text-slate-950 font-bold" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            MATRIQ <span className="text-amber-400">AI</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            National Material Intelligence & Harmonization Platform
          </p>
          <div className="mt-2 text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-0.5 rounded-full">
            CPSE Master Data Portal
          </div>
        </div>

        {/* Demo Fast Track Card for Judges */}
        <div className="mb-6 p-3.5 rounded-xl bg-[#121e36] border border-amber-500/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Judge / Evaluator Access
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Pre-configured with demo master datasets</p>
          </div>
          <button
            onClick={onLoginSuccess}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide shadow-md transition-colors"
          >
            Launch Demo
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              CPSE Organization
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
                className="w-full bg-[#080d1a] border border-[#1b2b48] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Officer Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#080d1a] border border-[#1b2b48] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#080d1a] border border-[#1b2b48] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <span>Sign In to Platform</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onBackToLanding}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Back to Public Intro Portal
          </button>
        </div>
      </div>
    </div>
  );
};
