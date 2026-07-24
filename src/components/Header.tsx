import React from "react";
import {
  TrendingUp,
  Upload,
  Brain,
  Download,
  FileSpreadsheet,
  Activity,
} from "lucide-react";
import { ProcessedDataset } from "../types";

interface HeaderProps {
  dataset: ProcessedDataset | null;
  onOpenUpload: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExportReport: () => void;
  onOpenChat: () => void;
  hasAiReport: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  dataset,
  onOpenUpload,
  activeTab,
  setActiveTab,
  onExportReport,
  onOpenChat,
  hasAiReport,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-30 shadow-xs">
      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand & App Title */}
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-md bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase">
                FinVision Analytics
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                CSV Analytics Engine
              </span>
            </div>
          </div>
        </div>

        {/* Dataset Status & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Active CSV Name Display (if loaded) */}
          {dataset && (
            <div className="hidden sm:flex items-center bg-slate-50 rounded-md px-2.5 py-1.5 border border-slate-200 text-xs font-medium text-slate-700">
              <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500 mr-2 shrink-0" />
              <span className="truncate max-w-[180px] font-mono">{dataset.name}</span>
            </div>
          )}

          {/* Upload CSV Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-medium text-xs transition-colors cursor-pointer"
            id="upload-data-btn"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload CSV</span>
          </button>

          <button
            onClick={onOpenChat}
            disabled={!dataset}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 rounded-md border border-slate-200 text-xs font-medium transition-colors cursor-pointer"
            title="Open AI Analyst"
            id="open-ai-chat-btn"
          >
            <Brain className="h-3.5 w-3.5 text-slate-500" />
            <span>AI Analyst</span>
          </button>

          {/* Export Button */}
          {hasAiReport && (
            <button
              onClick={onExportReport}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-md border border-slate-200 text-xs font-medium transition-colors cursor-pointer"
              title="Export Report"
              id="export-report-btn"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="bg-slate-50/50 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar space-x-1">
          <TabButton
            id="tab-ai-insights"
            active={activeTab === "report"}
            onClick={() => setActiveTab("report")}
            icon={<Brain className="h-3.5 w-3.5" />}
            label="Executive Summary"
          />
          <TabButton
            id="tab-financial-dash"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
            icon={<TrendingUp className="h-3.5 w-3.5" />}
            label="Interactive Dashboard"
          />
          <TabButton
            id="tab-ml-analytics"
            active={activeTab === "ml"}
            onClick={() => setActiveTab("ml")}
            icon={<Activity className="h-3.5 w-3.5" />}
            label="ML Forecasts & Anomalies"
            badge={dataset?.anomalies?.length ? `${dataset.anomalies.length}` : undefined}
          />
          <TabButton
            id="tab-data-table"
            active={activeTab === "data"}
            onClick={() => setActiveTab("data")}
            icon={<FileSpreadsheet className="h-3.5 w-3.5" />}
            label={`Raw Data (${dataset?.rowCount || 0})`}
          />
        </div>
      </div>
    </header>
  );
};

interface TabButtonProps {
  id: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}

const TabButton: React.FC<TabButtonProps> = ({ id, active, onClick, icon, label, badge }) => (
  <button
    id={id}
    onClick={onClick}
    className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs font-medium whitespace-nowrap transition-all cursor-pointer border-b-2 ${
      active
        ? "text-slate-900 border-slate-900 font-semibold bg-white"
        : "text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-100/60"
    }`}
  >
    {icon}
    <span>{label}</span>
    {badge && (
      <span
        className={`px-1.5 py-0.2 text-[10px] font-medium rounded ${
          active ? "bg-slate-200 text-slate-800" : "bg-slate-200/60 text-slate-600"
        }`}
      >
        {badge}
      </span>
    )}
  </button>
);
