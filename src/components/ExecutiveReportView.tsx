import React from "react";
import {
  Brain,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  Clock,
  Sparkles,
  Download,
} from "lucide-react";
import { AiExecutiveReport, ProcessedDataset } from "../types";

interface ExecutiveReportViewProps {
  report: AiExecutiveReport | null;
  dataset: ProcessedDataset;
  isAnalyzing: boolean;
  onGenerateReport: () => void;
  onExport: () => void;
}

export const ExecutiveReportView: React.FC<ExecutiveReportViewProps> = ({
  report,
  dataset,
  isAnalyzing,
  onGenerateReport,
  onExport,
}) => {
  if (isAnalyzing) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center my-6 shadow-xs">
        <div className="h-12 w-12 bg-slate-100 text-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4 animate-spin">
          <Brain className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Generating Dataset Insights</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
          Synthesizing {dataset.rowCount} rows across {dataset.columnCount} columns from dataset "{dataset.name}"...
        </p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-10 text-center my-6 shadow-xs">
        <div className="h-12 w-12 bg-slate-100 text-slate-800 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Brain className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Dataset Ready</h3>
        <p className="text-xs text-slate-500 max-w-lg mx-auto mt-2">
          Upload any CSV file above or select from sample datasets to analyze metrics instantly.
        </p>
      </div>
    );
  }

  const { executiveSummary, financialPerformance, mlTrendAndAnomalies, riskMitigationMatrix, actionableRecommendations, boardroomQuestions } = report;

  return (
    <div className="space-y-6 my-2" id="executive-report-container">
      {/* Report Hero Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                Executive Analysis
              </span>
              <span className="text-xs text-slate-500 font-mono">{dataset.name}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-2">
              {executiveSummary.headline}
            </h2>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-md px-3.5 py-1.5 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-medium tracking-wider block">
                Health Score
              </span>
              <span className="text-lg font-bold text-slate-900">
                {executiveSummary.overallHealthScore}/100
              </span>
            </div>
            <button
              onClick={onExport}
              className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-md border border-slate-200 transition-colors cursor-pointer"
              title="Download Report"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Strategic Context */}
        <div className="mt-4">
          <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3.5 rounded-md border-l-4 border-slate-900">
            "{executiveSummary.strategicContext}"
          </p>
        </div>

        {/* Key Findings Bullet Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {executiveSummary.keyFindings.map((finding, idx) => (
            <div key={idx} className="flex items-start space-x-2.5 bg-slate-50 p-3 rounded-md border border-slate-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 leading-normal">{finding}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Metrics Analysis & Data Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quantitative Metrics Analysis */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
            <div className="p-1.5 bg-slate-100 text-slate-800 rounded">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Quantitative Metrics Analysis</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Primary Metric Aggregation</h4>
              <p className="bg-slate-50 p-3 rounded-md border border-slate-200 text-slate-700">{financialPerformance.revenueAnalysis}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Variance & Distribution</h4>
              <p className="bg-slate-50 p-3 rounded-md border border-slate-200 text-slate-700">{financialPerformance.profitabilityMargins}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Key Performance Indicators</h4>
              <p className="bg-slate-50 p-3 rounded-md border border-slate-200 text-slate-700">{financialPerformance.dupontDrivers}</p>
            </div>
          </div>
        </div>

        {/* Machine Learning Trend & Anomaly Diagnostics */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
            <div className="p-1.5 bg-slate-100 text-slate-800 rounded">
              <Brain className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Machine Learning & Anomaly Diagnostics</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Regression Trend Forecast</h4>
              <p className="bg-slate-50 p-3 rounded-md border border-slate-200 text-slate-700">{mlTrendAndAnomalies.forecastInsight}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Z-Score Anomaly Diagnosis</h4>
              <p className="bg-slate-50 p-3 rounded-md border border-slate-200 text-slate-700">{mlTrendAndAnomalies.anomalyDiagnosis}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Statistical Variance</h4>
              <p className="bg-slate-50 p-3 rounded-md border border-slate-200 text-slate-700">{mlTrendAndAnomalies.statisticalSignificance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Risk Mitigation Matrix Table - if populated */}
      {riskMitigationMatrix && riskMitigationMatrix.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-slate-100 text-slate-800 rounded">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Risk Assessment Matrix</h3>
                <p className="text-xs text-slate-500">Key risk factors and recommended mitigation protocols</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Risk Factor</th>
                  <th className="p-2.5 text-center">Score (L × I)</th>
                  <th className="p-2.5">Root Cause</th>
                  <th className="p-2.5">Mitigation Protocol</th>
                  <th className="p-2.5 text-right">Cost Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {riskMitigationMatrix.map((item, idx) => {
                  const score = item.likelihood * item.impact;
                  const isHighRisk = score >= 12;
                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2.5 font-medium text-slate-900 whitespace-nowrap">{item.category}</td>
                      <td className="p-2.5 font-medium text-slate-800">{item.riskFactor}</td>
                      <td className="p-2.5 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded font-medium text-xs ${
                          isHighRisk ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-slate-100 text-slate-700"
                        }`}>
                          {item.likelihood} × {item.impact} = {score}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-600">{item.rootCause}</td>
                      <td className="p-2.5 text-slate-900 font-medium">{item.mitigationAction}</td>
                      <td className="p-2.5 text-right font-semibold text-slate-900 whitespace-nowrap">{item.estimatedRiskCost}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actionable Recommendations Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
          <div className="p-1.5 bg-slate-100 text-slate-800 rounded">
            <ArrowRight className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Strategic Recommendations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actionableRecommendations.map((rec, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-md p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {rec.timeframe}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    rec.priority === "Critical" ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-800"
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{rec.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rec.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Expected ROI:</span>
                <span className="font-semibold text-slate-900">{rec.expectedImpact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Boardroom Questions Section */}
      {boardroomQuestions && boardroomQuestions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2.5">
            <HelpCircle className="h-4 w-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">Key Strategic Questions</h3>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
            {boardroomQuestions.map((q, idx) => (
              <li key={idx} className="bg-slate-50 p-2.5 rounded-md border border-slate-200 flex items-start space-x-2">
                <span className="text-slate-900 font-bold shrink-0">Q{idx + 1}.</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
