import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ExternalLink, 
  Terminal, 
  Database, 
  ChevronRight,
  Loader2
} from "lucide-react";
import { api } from "../../services/api";
import { CopilotResponse } from "../../types";
import { NavItemKey } from "../layout/Sidebar";

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateView: (view: NavItemKey) => void;
}

interface Message {
  sender: "user" | "copilot";
  text: string;
  response?: CopilotResponse;
  timestamp: string;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateView,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "copilot",
      text: "Namaste! I am MATRIQ Copilot, your national material intelligence assistant. I query the live CPSE master database directly to answer questions regarding duplicates, equivalences, cross-CPSE overlap, and catalog reduction.",
      timestamp: "Just now",
      response: {
        query: "initial_welcome",
        answer: "Ready to assist you with material harmonization analytics across CPSE Alpha, Bharat, Energy, Infrastructure, and Engineering.",
        intent: "WELCOME",
        highlights: [
          { label: "Active CPSEs", value: "5 Enterprises", color: "indigo" },
          { label: "Harmonization Engine", value: "Multi-Factor Local", color: "emerald" },
        ],
      },
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    "How many duplicate materials were detected?",
    "Show me all equivalent bearing materials.",
    "Which CPSE has the highest material duplication?",
    "What materials have low-confidence matches?",
    "How much catalogue reduction is possible?",
    "Show me all materials pending approval.",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (qToSend?: string) => {
    const q = (qToSend || inputQuery).trim();
    if (!q || loading) return;

    setInputQuery("");
    const userMsg: Message = {
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const resp: CopilotResponse = await api.queryCopilot(q);
      const copilotMsg: Message = {
        sender: "copilot",
        text: resp.answer,
        response: resp,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, copilotMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "copilot",
          text: `Error connecting to Copilot engine: ${err.message || "Unknown error"}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#0c1424] border-l border-[#1f3154] shadow-2xl flex flex-col justify-between">
      {/* Header */}
      <div className="p-4 bg-[#101a30] border-b border-[#1e2f4f] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">MATRIQ Copilot</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono">
                Live DB Query
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Natural language material intelligence</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[90%] rounded-xl p-3 text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-amber-500/20 text-amber-200 border border-amber-500/30 font-medium"
                  : "bg-[#14213d] text-slate-200 border border-[#22365e]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 opacity-60 text-[10px]">
                <span className="font-semibold uppercase tracking-wider font-mono">
                  {m.sender === "user" ? "You" : "MATRIQ Copilot"}
                </span>
                <span>{m.timestamp}</span>
              </div>
              <p className="whitespace-pre-wrap">{m.text}</p>

              {/* Copilot highlights cards */}
              {m.response?.highlights && m.response.highlights.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-700/60">
                  {m.response.highlights.map((h, hIdx) => (
                    <div
                      key={hIdx}
                      className="p-2 rounded-lg bg-[#0d1629] border border-[#1b2b48]"
                    >
                      <p className="text-[10px] text-slate-400">{h.label}</p>
                      <p className="text-xs font-bold font-mono text-cyan-400 mt-0.5">{h.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Jump Action Links */}
              {m.response?.quick_links && m.response.quick_links.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-slate-700/60">
                  {m.response.quick_links.map((link, lIdx) => (
                    <button
                      key={lIdx}
                      onClick={() => {
                        onNavigateView(link.view as NavItemKey);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/40 text-cyan-300 text-[11px] font-medium transition-colors"
                    >
                      <span>{link.title}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#14213d] border border-[#22365e] max-w-[70%]">
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            <span className="text-xs text-slate-400">Querying SQLite database & NLP model...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Chips */}
      <div className="p-3 bg-[#0d1527] border-t border-[#1b2b48]">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
          Recommended Queries for Judges
        </p>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-[#132039] hover:bg-[#1a2d52] border border-[#1f3358] text-slate-300 hover:text-cyan-300 transition-colors text-left truncate max-w-full"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <div className="p-3 bg-[#101a30] border-t border-[#1e2f4f] flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about duplicates, bearings, reduction %..."
          className="flex-1 bg-[#090f1d] border border-[#1e2f4f] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || loading}
          className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-bold transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
