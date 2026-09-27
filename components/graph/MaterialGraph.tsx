import React, { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Info, CheckCircle2 } from "lucide-react";

interface GraphNode {
  id: string;
  label: string;
  subLabel?: string;
  fullDescription?: string;
  type: "STANDARD_IDENTITY" | "CPSE_NODE" | "LOCAL_MATERIAL";
  color: string;
  radius: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
  relation: string;
}

interface MaterialGraphProps {
  data: {
    standard_code: string;
    canonical_name: string;
    nodes: GraphNode[];
    links: GraphLink[];
  };
  onSelectNode?: (node: GraphNode) => void;
}

export const MaterialGraph: React.FC<MaterialGraphProps> = ({ data, onSelectNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const nodesRef = useRef<GraphNode[]>([]);

  useEffect(() => {
    if (!data.nodes.length) return;

    const width = 800;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2;

    // Position central standard node at center
    const positionedNodes = data.nodes.map((node) => {
      let x = centerX;
      let y = centerY;

      if (node.type === "STANDARD_IDENTITY") {
        x = centerX;
        y = centerY;
      } else if (node.type === "CPSE_NODE") {
        // Outer ring
        const cpseIndex = data.nodes.filter((n) => n.type === "CPSE_NODE").indexOf(node);
        const totalCpses = data.nodes.filter((n) => n.type === "CPSE_NODE").length || 1;
        const angle = (cpseIndex / totalCpses) * 2 * Math.PI - Math.PI / 2;
        x = centerX + Math.cos(angle) * 260;
        y = centerY + Math.sin(angle) * 200;
      } else {
        // Mid ring
        const matIndex = data.nodes.filter((n) => n.type === "LOCAL_MATERIAL").indexOf(node);
        const totalMats = data.nodes.filter((n) => n.type === "LOCAL_MATERIAL").length || 1;
        const angle = (matIndex / totalMats) * 2 * Math.PI;
        x = centerX + Math.cos(angle) * 150;
        y = centerY + Math.sin(angle) * 110;
      }

      return { ...node, x, y, vx: 0, vy: 0 };
    });

    nodesRef.current = positionedNodes;
  }, [data]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(offset.x + canvas.width / 2, offset.y + canvas.height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      const nodeMap = new Map(nodesRef.current.map((n) => [n.id, n]));

      // 1. Draw Links
      data.links.forEach((link) => {
        const src = nodeMap.get(link.source);
        const tgt = nodeMap.get(link.target);
        if (src && tgt && src.x !== undefined && src.y !== undefined && tgt.x !== undefined && tgt.y !== undefined) {
          ctx.beginPath();
          ctx.moveTo(src.x, src.y);
          ctx.lineTo(tgt.x, tgt.y);

          if (link.relation === "CONVERGES_TO") {
            ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
            ctx.lineWidth = 2.5;
            ctx.setLineDash([4, 4]);
          } else {
            ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
            ctx.lineWidth = 1.5;
            ctx.setLineDash([]);
          }
          ctx.stroke();
          ctx.setLineDash([]);

          // Link label
          const midX = (src.x + tgt.x) / 2;
          const midY = (src.y + tgt.y) / 2;
          ctx.font = "9px 'JetBrains Mono', monospace";
          ctx.fillStyle = link.relation === "CONVERGES_TO" ? "#34d399" : "#94a3b8";
          ctx.textAlign = "center";
          ctx.fillText(link.label, midX, midY - 4);
        }
      });

      // 2. Draw Nodes
      nodesRef.current.forEach((node) => {
        if (node.x === undefined || node.y === undefined) return;

        // Glow ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 4, 0, 2 * Math.PI);
        ctx.fillStyle = node.type === "STANDARD_IDENTITY" ? "rgba(16, 185, 129, 0.2)" : "rgba(30, 47, 79, 0.5)";
        ctx.fill();

        // Main node body
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = node.type === "STANDARD_IDENTITY" ? 2.5 : 1.5;
        ctx.stroke();

        // Node Text
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (node.type === "STANDARD_IDENTITY") {
          ctx.font = "bold 11px Inter, sans-serif";
          ctx.fillText(node.label, node.x, node.y - 4);
          ctx.font = "9px 'JetBrains Mono', monospace";
          ctx.fillStyle = "#ecfdf5";
          ctx.fillText("STANDARD ID", node.x, node.y + 10);
        } else if (node.type === "CPSE_NODE") {
          ctx.font = "bold 10px Inter, sans-serif";
          ctx.fillText(node.label.replace("CPSE ", ""), node.x, node.y - 2);
          ctx.font = "8px 'JetBrains Mono', monospace";
          ctx.fillStyle = "#e0f2fe";
          ctx.fillText("ENTERPRISE", node.x, node.y + 9);
        } else {
          ctx.font = "bold 9px 'JetBrains Mono', monospace";
          ctx.fillText(node.label, node.x, node.y);
        }
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [data, scale, offset]);

  // Canvas Interactions
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - offset.x - canvas.width / 2) / scale + canvas.width / 2;
    const clickY = (e.clientY - rect.top - offset.y - canvas.height / 2) / scale + canvas.height / 2;

    for (const node of nodesRef.current) {
      if (node.x !== undefined && node.y !== undefined) {
        const dist = Math.hypot(node.x - clickX, node.y - clickY);
        if (dist <= node.radius) {
          setSelectedNode(node);
          if (onSelectNode) onSelectNode(node);
          return;
        }
      }
    }
    setSelectedNode(null);
  };

  return (
    <div className="relative w-full h-[540px] bg-[#090f1d] border border-[#1b2b48] rounded-2xl overflow-hidden flex flex-col justify-between">
      {/* Top Banner */}
      <div className="p-4 bg-[#0d1629]/90 border-b border-[#1b2b48] flex items-center justify-between z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Convergence Network
            </span>
            <h4 className="text-sm font-bold text-white tracking-wide">
              {data.standard_code} - {data.canonical_name}
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Interactive relationship graph proving cross-enterprise convergence into unified national identity
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-[#14213d] border border-[#233863] rounded-lg p-1">
          <button
            onClick={() => setScale((s) => Math.min(s + 0.15, 2.5))}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(s - 0.15, 0.5))}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setScale(1);
              setOffset({ x: 0, y: 0 });
            }}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        width={900}
        height={460}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        className="cursor-grab active:cursor-grabbing w-full h-full block"
      />

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 max-w-sm p-3.5 rounded-xl bg-[#0e1930]/95 border border-[#243c68] shadow-2xl backdrop-blur-md z-20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
              {selectedNode.type}
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              x
            </button>
          </div>
          <p className="text-xs font-bold text-white">{selectedNode.label}</p>
          {selectedNode.fullDescription && (
            <p className="text-[11px] text-slate-300 mt-1">{selectedNode.fullDescription}</p>
          )}
          {selectedNode.subLabel && (
            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{selectedNode.subLabel}</p>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#0e172a]/90 border border-[#1b2b48] text-[10px] text-slate-300 font-mono z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Standard Identity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>CPSE Local Item</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
          <span>Enterprise Org</span>
        </div>
      </div>
    </div>
  );
};
