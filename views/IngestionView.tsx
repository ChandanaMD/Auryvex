import React, { useState, useRef } from "react";
import { 
  UploadCloud, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  ArrowRight,
  Database,
  FileCheck,
  RefreshCw,
  Info
} from "lucide-react";
import { api } from "../services/api";
import { Badge } from "../components/common/Badge";

interface IngestionViewProps {
  onStartHarmonization: () => void;
  isHarmonizing: boolean;
}

export const IngestionView: React.FC<IngestionViewProps> = ({
  onStartHarmonization,
  isHarmonizing
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleDatasets = [
    {
      filename: "CPSE_A_Materials.csv",
      cpse: "CPSE Alpha",
      records: "~50 records",
      domain: "Mechanical, Bearings & Valves",
      color: "border-amber-500/30 text-amber-300 bg-amber-500/10"
    },
    {
      filename: "CPSE_B_Materials.csv",
      cpse: "CPSE Bharat",
      records: "~50 records",
      domain: "Electrical, Cables & Motors",
      color: "border-cyan-500/30 text-cyan-300 bg-cyan-500/10"
    },
    {
      filename: "CPSE_C_Materials.csv",
      cpse: "CPSE Energy",
      records: "~50 records",
      domain: "Thermal Power, Fasteners & Sensors",
      color: "border-emerald-500/30 text-emerald-300 bg-emerald-500/10"
    },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const res = await api.uploadMaterialFile(file, "Officer Reviewer");
      setUploadResult(res.data);
    } catch (err: any) {
      setError(err.message || "Upload and validation failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Material Master Data Ingestion
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Ingest raw, unstandardized ERP/SAP material master catalogs from various CPSEs. Supports automated column schema validation, abbreviation detection, and data health scoring.
        </p>
      </div>

      {/* Downloadable Sample Datasets for Judges */}
      <div className="p-5 rounded-2xl bg-[#0c1424] border border-[#1b2b48]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Judge Evaluation Kit
            </span>
            <h3 className="text-sm font-bold text-white">Download Sample CPSE Datasets</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">3 Realistic Pre-built Datasets</span>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Download these CSV datasets to test drag-and-drop file ingestion with intentional variations (abbreviations, units, duplicate bearing/valve codes):
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleDatasets.map((sample, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0e172a] border border-[#1e2f4f] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${sample.color}`}>
                    {sample.cpse}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{sample.records}</span>
                </div>
                <p className="text-xs font-bold text-white">{sample.filename}</p>
                <p className="text-[11px] text-slate-400 mt-1">{sample.domain}</p>
              </div>

              <a
                href={api.downloadSampleUrl(sample.filename)}
                download
                className="mt-4 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#14213d] hover:bg-[#1b2e56] border border-[#233863] text-cyan-300 text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Drag & Drop Upload Container */}
      <div className="p-6 rounded-2xl bg-[#0c1424] border border-[#1b2b48]">
        <h3 className="text-sm font-bold text-white mb-2">Upload Material Master Catalog</h3>
        <p className="text-xs text-slate-400 mb-4">
          Upload files in <span className="text-slate-200 font-mono font-semibold">.CSV</span>,{" "}
          <span className="text-slate-200 font-mono font-semibold">.XLSX</span>, or{" "}
          <span className="text-slate-200 font-mono font-semibold">.JSON</span> format.
        </p>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            dragActive
              ? "border-amber-400 bg-amber-500/10 scale-[1.01]"
              : "border-[#1e2f4f] bg-[#090f1d] hover:border-slate-500"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls,.json"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>

          <p className="text-sm font-bold text-white">
            {uploading ? "Parsing and Validating Schema..." : "Drag and drop your material dataset here"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            or <span className="text-amber-400 font-semibold underline">browse from your computer</span>
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-xl text-[10px] text-slate-500 font-mono">
            <span>Expected Schema:</span>
            <span className="text-slate-300">Material Code</span> •
            <span className="text-slate-300">Description</span> •
            <span className="text-slate-300">Category</span> •
            <span className="text-slate-300">Manufacturer</span> •
            <span className="text-slate-300">Model</span> •
            <span className="text-slate-300">Specification</span> •
            <span className="text-slate-300">Unit</span> •
            <span className="text-slate-300">Quantity</span> •
            <span className="text-slate-300">CPSE</span>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Upload Quality Results Breakdown */}
        {uploadResult && (
          <div className="mt-6 p-5 rounded-xl bg-[#0f172a] border border-[#1e3258] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">
                  Ingestion Complete: {uploadResult.filename}
                </h4>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                Ready for AI Processing
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 rounded-lg bg-[#0c1424] border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Records Imported</p>
                <p className="text-xl font-bold font-mono text-white mt-1">
                  {uploadResult.total_records}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#0c1424] border border-emerald-500/30">
                <p className="text-[10px] text-emerald-400 uppercase font-mono">Valid Records</p>
                <p className="text-xl font-bold font-mono text-emerald-300 mt-1">
                  {uploadResult.valid_records}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#0c1424] border border-amber-500/30">
                <p className="text-[10px] text-amber-400 uppercase font-mono">Missing Descriptions</p>
                <p className="text-xl font-bold font-mono text-amber-300 mt-1">
                  {uploadResult.missing_descriptions}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#0c1424] border border-rose-500/30">
                <p className="text-[10px] text-rose-400 uppercase font-mono">Duplicate Codes</p>
                <p className="text-xl font-bold font-mono text-rose-300 mt-1">
                  {uploadResult.duplicate_codes}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#0c1424] border border-cyan-500/30">
                <p className="text-[10px] text-cyan-400 uppercase font-mono">Unit Inconsistencies</p>
                <p className="text-xl font-bold font-mono text-cyan-300 mt-1">
                  {uploadResult.inconsistent_units}
                </p>
              </div>
            </div>

            {/* Launch Harmonization Trigger */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Data quality check passed. Records have been parsed into local staging store.
              </p>
              <button
                onClick={onStartHarmonization}
                disabled={isHarmonizing}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>START HARMONIZATION</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

