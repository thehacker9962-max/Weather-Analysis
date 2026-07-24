import React, { useState } from "react";
import { ShieldAlert, AlertTriangle, ShieldCheck, FileText, ArrowRight } from "lucide-react";
import { AiExecutiveReport, RiskMatrixItem, ProcessedDataset } from "../types";

interface RiskMatrixTabProps {
  report: AiExecutiveReport | null;
  dataset?: ProcessedDataset | null;
}

export const RiskMatrixTab: React.FC<RiskMatrixTabProps> = ({ report, dataset }) => {
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<string>("all");

  // Dynamic fallback risks generated from actual dataset
  const generateDatasetRisks = (): RiskMatrixItem[] => {
    if (!dataset) return [];
    
    const items: RiskMatrixItem[] = [];

    // 1. Anomalies Risk
    if (dataset.anomalies && dataset.anomalies.length > 0) {
      const topAnomaly = dataset.anomalies[0];
      items.push({
        category: "Data Integrity & Outliers",
        riskFactor: `Outlier Variance in ${topAnomaly.columnName}`,
        likelihood: topAnomaly.severity === "High" ? 4 : 3,
        impact: topAnomaly.severity === "High" ? 5 : 4,
        rootCause: `Z-score of ${topAnomaly.zScore} detected at Row #${topAnomaly.rowIndex} (${topAnomaly.value.toLocaleString()}).`,
        mitigationAction: `Audit Row #${topAnomaly.rowIndex} for measurement error or extreme operational transaction.`,
        estimatedRiskCost: `Flagged Row #${topAnomaly.rowIndex}`,
      });
    }

    // 2. Volatility in numeric columns
    const volatileCol = dataset.columnSummaries.find((c) => c.stdDev && c.mean && (c.stdDev / Math.abs(c.mean)) > 0.5);
    if (volatileCol) {
      items.push({
        category: "Financial Volatility",
        riskFactor: `High Variance in ${volatileCol.name}`,
        likelihood: 4,
        impact: 4,
        rootCause: `Standard deviation (${volatileCol.stdDev?.toFixed(1)}) is over 50% of the mean (${volatileCol.mean?.toFixed(1)}).`,
        mitigationAction: `Implement smoothing policies or risk hedging around ${volatileCol.name}.`,
        estimatedRiskCost: `High Volatility Band`,
      });
    }

    // 3. Missing data risk
    const missingCol = dataset.columnSummaries.find((c) => c.missingCount > 0);
    if (missingCol) {
      items.push({
        category: "Data Completeness",
        riskFactor: `Missing Records in ${missingCol.name}`,
        likelihood: 3,
        impact: 3,
        rootCause: `${missingCol.missingCount} missing values found in ${missingCol.name}.`,
        mitigationAction: "Enforce required fields during data intake or apply mean imputation.",
        estimatedRiskCost: `${missingCol.missingCount} Null Entries`,
      });
    }

    // 4. Primary Metric Concentration
    const primaryCol = dataset.columnSummaries.find((c) => c.type === "numeric" || c.type === "currency");
    if (primaryCol) {
      items.push({
        category: "Operational Concentration",
        riskFactor: `Distribution Skew in ${primaryCol.name}`,
        likelihood: 2,
        impact: 4,
        rootCause: `Primary concentration analyzed across ${dataset.rowCount} records for ${primaryCol.name}.`,
        mitigationAction: `Diversify portfolio streams and monitor top percentile values in ${primaryCol.name}.`,
        estimatedRiskCost: `Top Tier Exposure`,
      });
    }

    return items;
  };

  const risks: RiskMatrixItem[] = report?.riskMitigationMatrix || (dataset ? generateDatasetRisks() : []);

  const categories = Array.from(new Set(risks.map((r) => r.category)));

  const filteredRisks = risks.filter((r) => {
    if (selectedRiskCategory === "all") return true;
    return r.category === selectedRiskCategory;
  });

  // Calculate Heatmap grid items
  const getCellRisks = (l: number, i: number) => {
    return risks.filter((r) => r.likelihood === l && r.impact === i);
  };

  const getHeatmapColor = (l: number, i: number) => {
    const score = l * i;
    if (score >= 15) return "bg-rose-950/80 border-rose-600/60 text-rose-300";
    if (score >= 9) return "bg-amber-950/80 border-amber-600/60 text-amber-300";
    return "bg-slate-900 border-slate-800 text-slate-400";
  };

  return (
    <div className="space-y-6 my-2">
      {/* Risk Heatmap & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 5x5 Heatmap Matrix */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-4">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">Enterprise 5x5 Risk Heatmap</h3>
                <p className="text-xs text-slate-400">Likelihood vs Impact distribution</p>
              </div>
            </div>

            {/* 5x5 Grid */}
            <div className="space-y-1.5">
              <div className="flex items-center text-[10px] text-slate-400 font-semibold mb-1">
                <span className="w-12 text-right pr-2">Impact →</span>
                <div className="grid grid-cols-5 gap-1.5 flex-1 text-center">
                  <span>1 (Negligible)</span>
                  <span>2 (Low)</span>
                  <span>3 (Moderate)</span>
                  <span>4 (High)</span>
                  <span>5 (Critical)</span>
                </div>
              </div>

              {[5, 4, 3, 2, 1].map((likelihood) => (
                <div key={likelihood} className="flex items-center">
                  <span className="w-12 text-right text-[10px] text-slate-400 font-semibold pr-2">
                    L{likelihood}
                  </span>
                  <div className="grid grid-cols-5 gap-1.5 flex-1">
                    {[1, 2, 3, 4, 5].map((impact) => {
                      const cellItems = getCellRisks(likelihood, impact);
                      const colorClass = getHeatmapColor(likelihood, impact);
                      return (
                        <div
                          key={impact}
                          className={`h-12 rounded-lg border p-1 text-center flex flex-col items-center justify-center relative ${colorClass}`}
                          title={`Likelihood ${likelihood}, Impact ${impact}`}
                        >
                          <span className="text-[10px] font-bold">{likelihood * impact}</span>
                          {cellItems.length > 0 && (
                            <span className="mt-0.5 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px] font-extrabold shadow">
                              {cellItems.length}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1.5" /> High Critical Risk (15-25)</span>
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5" /> Medium Risk (9-14)</span>
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-slate-700 mr-1.5" /> Low Risk (1-8)</span>
          </div>
        </div>

        {/* Risk Filter & Action Plan Cards */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100">Mitigation Protocol Action Plans</h3>
            <select
              value={selectedRiskCategory}
              onChange={(e) => setSelectedRiskCategory(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
            >
              <option value="all">All Risk Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {filteredRisks.map((risk, idx) => {
              const score = risk.likelihood * risk.impact;
              return (
                <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      {risk.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      score >= 12 ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-amber-500/20 text-amber-300"
                    }`}>
                      Risk Score: {score}/25
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-100">{risk.riskFactor}</h4>
                  <p className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Root Cause:</span> {risk.rootCause}
                  </p>

                  <div className="bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/50 text-xs text-emerald-300 font-medium flex items-start space-x-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-[10px] uppercase text-emerald-400">Action Protocol</span>
                      <span>{risk.mitigationAction}</span>
                    </div>
                  </div>

                  <div className="text-right text-[11px] font-semibold text-slate-300">
                    Exposure Estimate: <span className="text-rose-400">{risk.estimatedRiskCost}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
