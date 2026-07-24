/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { KpiCards } from "./components/KpiCards";
import { ExecutiveReportView } from "./components/ExecutiveReportView";
import { FinancialDashTab } from "./components/FinancialDashTab";
import { MlAnalyticsTab } from "./components/MlAnalyticsTab";
import { DataTableTab } from "./components/DataTableTab";
import { FileUploadModal } from "./components/FileUploadModal";
import { ExportReportModal } from "./components/ExportReportModal";
import { AiAnalystChatDrawer } from "./components/AiAnalystChatDrawer";
import { SAMPLE_DATASETS } from "./data/sampleDatasets";
import { processRawDataset, generateInstantAiReport } from "./utils/mlEngine";
import { ProcessedDataset, AiExecutiveReport } from "./types";

export default function App() {
  const [currentDataset, setCurrentDataset] = useState<ProcessedDataset | null>(null);
  const [report, setReport] = useState<AiExecutiveReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("report");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Initialize with default sample dataset & auto-generate instant AI report
  useEffect(() => {
    const defaultSample = SAMPLE_DATASETS[0];
    const processed = processRawDataset(
      defaultSample.name,
      defaultSample.description,
      defaultSample.data
    );
    setCurrentDataset(processed);
    setReport(generateInstantAiReport(processed));
  }, []);

  // Handle selecting a sample dataset
  const handleSelectSample = (sampleId: string) => {
    const found = SAMPLE_DATASETS.find((s) => s.id === sampleId);
    if (found) {
      const processed = processRawDataset(found.name, found.description, found.data);
      setCurrentDataset(processed);
      setReport(generateInstantAiReport(processed));
    }
  };

  // Handle uploaded custom CSV file dataset
  const handleDatasetLoaded = (name: string, description: string, rawData: Record<string, any>[]) => {
    const processed = processRawDataset(name, description, rawData);
    setCurrentDataset(processed);
    setReport(generateInstantAiReport(processed));
    setActiveTab("report");
  };

  // Run server-side AI analysis
  const runAiAnalysis = async () => {
    if (!currentDataset) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch("/api/ai-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datasetName: currentDataset.name,
          rowCount: currentDataset.rowCount,
          columnCount: currentDataset.columnCount,
          columnsSummary: currentDataset.columnSummaries,
          sampleRows: currentDataset.data.slice(0, 8),
          calculatedMetrics: {
            forecasts: currentDataset.forecasts,
            dupont: currentDataset.dupont,
          },
          riskOverview: {
            anomalyCount: currentDataset.anomalies.length,
            topAnomalies: currentDataset.anomalies.slice(0, 5),
          },
        }),
      });

      const json = await res.json();
      if (json.success && json.report) {
        setReport(json.report);
        setActiveTab("report");
      } else {
        alert("Failed to generate report: " + (json.error || "Unknown server error"));
      }
    } catch (err: any) {
      console.error("AI Analysis failed:", err);
      alert("Error generating AI analysis report. Please verify API configuration.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Export Executive Report
  const handleExportReport = () => {
    if (!report) return;
    setIsExportOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-800 selection:text-white">
      {/* Navbar & Tab Controls */}
      <Header
        dataset={currentDataset}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportReport={handleExportReport}
        hasAiReport={!!report}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Key Metrics Bar */}
        <KpiCards dataset={currentDataset} report={report} />

        {/* Tab Views */}
        {currentDataset && (
          <>
            {activeTab === "report" && (
              <ExecutiveReportView
                report={report}
                dataset={currentDataset}
                isAnalyzing={isAnalyzing}
                onGenerateReport={runAiAnalysis}
                onExport={handleExportReport}
              />
            )}

            {activeTab === "dashboard" && <FinancialDashTab dataset={currentDataset} />}

            {activeTab === "ml" && <MlAnalyticsTab dataset={currentDataset} />}

            {activeTab === "data" && <DataTableTab dataset={currentDataset} />}
          </>
        )}
      </main>

      {/* Modals & Drawers */}
      <FileUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDatasetLoaded={handleDatasetLoaded}
        onSelectSample={handleSelectSample}
      />

      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        dataset={currentDataset}
        report={report}
      />

      {currentDataset && (
        <AiAnalystChatDrawer
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          dataset={currentDataset}
          report={report}
        />
      )}
    </div>
  );
}
