import React, { useState } from "react";
import { X, Download, FileText, CheckCircle2, FileType, Loader2 } from "lucide-react";
import { ProcessedDataset, AiExecutiveReport } from "../types";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, WidthType } from "docx";
import jsPDF from "jspdf";

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: ProcessedDataset | null;
  report: AiExecutiveReport | null;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  dataset,
  report,
}) => {
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  if (!isOpen || !dataset || !report) return null;

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const reportId = `RPT-${Math.floor(100000 + Math.random() * 900000)}`;

  // Function to generate and download Word (.docx) Document
  const handleDownloadWord = async () => {
    try {
      setIsExportingWord(true);

      const tableRows: TableRow[] = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Column Name", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Type", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Unique Values", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Nulls", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Sample Content", bold: true })] })] }),
          ],
        }),
        ...dataset.columnSummaries.map(
          (col) =>
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: col.name, bold: true })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: col.type })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(col.uniqueValuesCount) })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(col.missingCount) })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: col.sampleValues?.slice(0, 3).join(", ") || "N/A" })] })] }),
              ],
            })
        ),
      ];

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: "FINVISION ANALYTICS - EXECUTIVE SUMMARY REPORT",
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Document ID: ${reportId} | Date: ${currentDate}`, italics: true }),
                  new TextRun({ text: ` | Overall Health Score: ${report.executiveSummary.overallHealthScore}/100`, bold: true, color: "059669" }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({ text: "" }),

              new Paragraph({
                text: "Executive Overview & Dataset Context",
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                children: [new TextRun({ text: report.executiveSummary.strategicContext, italics: true })],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Dataset: `, bold: true }),
                  new TextRun({ text: `${dataset.name} (${dataset.rowCount.toLocaleString()} Rows, ${dataset.columnCount} Columns)` }),
                ],
              }),
              new Paragraph({ text: "" }),

              new Paragraph({
                text: "Key Findings",
                heading: HeadingLevel.HEADING_2,
              }),
              ...report.executiveSummary.keyFindings.map(
                (finding) =>
                  new Paragraph({
                    bullet: { level: 0 },
                    children: [new TextRun(finding)],
                  })
              ),
              new Paragraph({ text: "" }),

              new Paragraph({
                text: "CSV Data Categories Architecture",
                heading: HeadingLevel.HEADING_1,
              }),
              new Table({
                rows: tableRows,
                width: { size: 100, type: WidthType.PERCENTAGE },
              }),
              new Paragraph({ text: "" }),

              new Paragraph({
                text: "Quantitative Analysis & Machine Learning Diagnostics",
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                children: [new TextRun({ text: "Primary Metrics Analysis: ", bold: true }), new TextRun(report.financialPerformance.revenueAnalysis)],
              }),
              new Paragraph({
                children: [new TextRun({ text: "Secondary Attribute Distribution: ", bold: true }), new TextRun(report.financialPerformance.profitabilityMargins)],
              }),
              new Paragraph({
                children: [new TextRun({ text: "ML Trend Insight: ", bold: true }), new TextRun(report.mlTrendAndAnomalies.forecastInsight)],
              }),
              new Paragraph({
                children: [new TextRun({ text: "Outlier Diagnosis: ", bold: true }), new TextRun(report.mlTrendAndAnomalies.anomalyDiagnosis)],
              }),
              new Paragraph({ text: "" }),

              new Paragraph({
                text: "Actionable Strategic Directives",
                heading: HeadingLevel.HEADING_1,
              }),
              ...report.actionableRecommendations.map(
                (rec) =>
                  new Paragraph({
                    children: [
                      new TextRun({ text: `• [${rec.timeframe} - Priority: ${rec.priority}] `, bold: true, color: "2563EB" }),
                      new TextRun({ text: `${rec.title}: `, bold: true }),
                      new TextRun({ text: `${rec.description} (Expected ROI: ${rec.expectedImpact})` }),
                    ],
                  })
              ),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Executive_Report_${dataset.name.replace(/\s+/g, "_")}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export Word document:", err);
    } finally {
      setIsExportingWord(false);
    }
  };

  // Function to generate and download PDF (.pdf) Document
  const handleDownloadPdf = () => {
    try {
      setIsExportingPdf(true);
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      let yPos = 20;

      // Title
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(15, 23, 42);
      pdf.text("FINVISION ANALYTICS", 15, yPos);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(37, 99, 235);
      pdf.text("C-SUITE EXECUTIVE DATA BRIEFING", 15, yPos + 6);

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Doc ID: ${reportId}  |  Date: ${currentDate}`, 120, yPos);
      pdf.text(`Overall Health Index: ${report.executiveSummary.overallHealthScore}/100`, 120, yPos + 6);

      yPos += 16;
      pdf.setDrawColor(226, 232, 240);
      pdf.line(15, yPos, 195, yPos);
      yPos += 10;

      // Executive Context
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(15, 23, 42);
      pdf.text("I. Executive Strategic Context", 15, yPos);
      yPos += 7;

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(51, 65, 85);
      const contextLines = pdf.splitTextToSize(`"${report.executiveSummary.strategicContext}"`, 175);
      pdf.text(contextLines, 15, yPos);
      yPos += contextLines.length * 5 + 6;

      // Key Findings
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(15, 23, 42);
      pdf.text("Key Dataset Findings:", 15, yPos);
      yPos += 6;

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      report.executiveSummary.keyFindings.forEach((finding) => {
        const lines = pdf.splitTextToSize(`• ${finding}`, 170);
        pdf.text(lines, 18, yPos);
        yPos += lines.length * 4.5;
      });

      yPos += 8;

      // Data Categories Summary Table
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(15, 23, 42);
      pdf.text(`II. Uploaded CSV Categories Architecture (${dataset.columnCount} Columns)`, 15, yPos);
      yPos += 8;

      // Table Header
      pdf.setFillColor(241, 245, 249);
      pdf.rect(15, yPos - 4, 180, 7, "F");
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(71, 85, 105);
      pdf.text("Column Name", 18, yPos);
      pdf.text("Data Type", 70, yPos);
      pdf.text("Unique", 110, yPos);
      pdf.text("Nulls", 140, yPos);
      pdf.text("Sample", 165, yPos);
      yPos += 6;

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(30, 41, 59);

      dataset.columnSummaries.forEach((col) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(col.name.substring(0, 22), 18, yPos);
        pdf.text(col.type.toUpperCase(), 70, yPos);
        pdf.text(String(col.uniqueValuesCount), 110, yPos);
        pdf.text(String(col.missingCount), 140, yPos);
        pdf.text((col.sampleValues?.[0] || "N/A").substring(0, 12), 165, yPos);
        yPos += 5;
      });

      yPos += 10;
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      // Section III: Quantitative Analysis
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(15, 23, 42);
      pdf.text("III. Quantitative Analysis & ML Trend Insights", 15, yPos);
      yPos += 7;

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(51, 65, 85);

      const revLines = pdf.splitTextToSize(`Primary Metrics: ${report.financialPerformance.revenueAnalysis}`, 175);
      pdf.text(revLines, 15, yPos);
      yPos += revLines.length * 4.5 + 4;

      const mlLines = pdf.splitTextToSize(`ML Forecast: ${report.mlTrendAndAnomalies.forecastInsight}`, 175);
      pdf.text(mlLines, 15, yPos);
      yPos += mlLines.length * 4.5 + 8;

      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      // Section IV: Actionable Recommendations
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(15, 23, 42);
      pdf.text("IV. Actionable Strategic Directives", 15, yPos);
      yPos += 7;

      report.actionableRecommendations.forEach((rec) => {
        if (yPos > 260) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(37, 99, 235);
        pdf.text(`[${rec.timeframe} • ${rec.priority}] ${rec.title}`, 15, yPos);
        yPos += 5;

        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(71, 85, 105);
        const descLines = pdf.splitTextToSize(`${rec.description} (Expected ROI: ${rec.expectedImpact})`, 170);
        pdf.text(descLines, 18, yPos);
        yPos += descLines.length * 4.5 + 4;
      });

      // Save PDF file
      pdf.save(`Executive_Report_${dataset.name.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Failed to export PDF document:", err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white border border-slate-200 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-lg overflow-hidden my-auto">
        {/* Modal Top Header Bar */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-slate-100 text-slate-700 rounded">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Export Executive Summary Report
              </h2>
              <p className="text-[11px] text-slate-500">
                Download formatted Word (.docx) or PDF (.pdf) documents
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Word Document Download Button */}
            <button
              onClick={handleDownloadWord}
              disabled={isExportingWord}
              className="flex items-center space-x-2 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded transition-all cursor-pointer"
            >
              {isExportingWord ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileType className="h-4 w-4" />
              )}
              <span>{isExportingWord ? "Exporting Word..." : "Download Word (.docx)"}</span>
            </button>

            {/* PDF Document Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="flex items-center space-x-2 px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 text-slate-800 text-xs font-semibold rounded transition-all cursor-pointer"
            >
              {isExportingPdf ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4 text-slate-600" />
              )}
              <span>{isExportingPdf ? "Exporting PDF..." : "Download PDF (.pdf)"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Executive Document Preview Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 bg-white">
          {/* Executive Header Block */}
          <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                EXECUTIVE DATA REPORT
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Data Summary & Briefing
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500 space-y-1">
              <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded text-[10px] uppercase">
                CONFIDENTIAL BRIEFING
              </span>
              <div>Doc ID: <strong className="text-slate-900">{reportId}</strong></div>
              <div>Date: <strong className="text-slate-900">{currentDate}</strong></div>
              <div>Health Score: <strong className="text-slate-900">{report.executiveSummary.overallHealthScore}/100</strong></div>
            </div>
          </div>

          {/* Strategic Context Banner */}
          <div className="bg-slate-50 border-l-3 border-slate-700 p-4 rounded-r-md text-xs italic text-slate-700">
            "{report.executiveSummary.strategicContext}"
          </div>

          {/* Key Dataset Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Dataset Name</span>
              <strong className="text-slate-900 text-sm truncate block mt-0.5">{dataset.name}</strong>
            </div>
            <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Records</span>
              <strong className="text-slate-900 text-sm block mt-0.5">{dataset.rowCount.toLocaleString()} Rows</strong>
            </div>
            <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Columns</span>
              <strong className="text-slate-900 text-sm block mt-0.5">{dataset.columnCount} Categories</strong>
            </div>
            <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Data Outliers</span>
              <strong className="text-slate-900 text-sm block mt-0.5">{dataset.anomalies.length} Flagged</strong>
            </div>
          </div>

          {/* Section 1: Executive Key Findings */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
              I. Executive Key Findings
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {report.executiveSummary.keyFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-700 shrink-0 mt-0.5" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Data Categories Architecture */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
              II. Uploaded CSV Data Categories Architecture
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-md">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <th className="p-2 font-bold uppercase">Column Category</th>
                    <th className="p-2 font-bold uppercase">Type</th>
                    <th className="p-2 font-bold uppercase">Unique Values</th>
                    <th className="p-2 font-bold uppercase">Missing / Nulls</th>
                    <th className="p-2 font-bold uppercase">Sample Content</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {dataset.columnSummaries.map((col) => (
                    <tr key={col.name}>
                      <td className="p-2 font-bold text-slate-900">{col.name}</td>
                      <td className="p-2">
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-mono uppercase">
                          {col.type}
                        </span>
                      </td>
                      <td className="p-2 text-slate-700">{col.uniqueValuesCount}</td>
                      <td className="p-2 text-slate-700">{col.missingCount}</td>
                      <td className="p-2 text-slate-600 font-mono text-[11px]">
                        {col.sampleValues?.slice(0, 3).join(", ") || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Quantitative & ML Diagnostics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Quantitative Metrics Analysis
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {report.financialPerformance.revenueAnalysis}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-200">
                {report.financialPerformance.profitabilityMargins}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Machine Learning & Outliers Diagnosis
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {report.mlTrendAndAnomalies.forecastInsight}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-200">
                {report.mlTrendAndAnomalies.anomalyDiagnosis}
              </p>
            </div>
          </div>

          {/* Section 4: Actionable Directives */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
              III. Actionable Strategic Directives
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {report.actionableRecommendations.map((rec, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-md border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-800 uppercase">{rec.timeframe}</span>
                    <span className="text-slate-600">{rec.priority}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{rec.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-normal">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Watermark */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
            <div>DATA REPORT</div>
            <div>STRICTLY CONFIDENTIAL</div>
          </div>
        </div>
      </div>
    </div>
  );
};

