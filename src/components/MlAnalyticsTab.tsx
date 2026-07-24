import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Brain, AlertTriangle, TrendingUp, CheckCircle, Search } from "lucide-react";
import { ProcessedDataset } from "../types";

interface MlAnalyticsTabProps {
  dataset: ProcessedDataset;
}

export const MlAnalyticsTab: React.FC<MlAnalyticsTabProps> = ({ dataset }) => {
  const [selectedMetric, setSelectedMetric] = useState<string>(
    dataset.numericColumns[0] || ""
  );
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const forecast = dataset.forecasts[selectedMetric] || dataset.forecasts[dataset.numericColumns[0]];

  const filteredAnomalies = dataset.anomalies.filter((a) => {
    if (filterSeverity === "all") return true;
    return a.severity.toLowerCase() === filterSeverity.toLowerCase();
  });

  return (
    <div className="space-y-6 my-2">
      {/* ML Regression Forecast Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-slate-100 text-slate-800 rounded">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Trend Regression & Forecast
              </h3>
              <p className="text-xs text-slate-500">
                Ordinary Least Squares (OLS) regression model with 95% confidence interval
              </p>
            </div>
          </div>

          {/* Metric Picker */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-600">Dimension:</span>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="bg-white border border-slate-200 text-xs text-slate-800 rounded-md px-3 py-1.5 focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              {dataset.numericColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Forecast Stats Pills */}
        {forecast && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-md">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Model R² (Fit)</span>
              <span className="text-sm font-bold text-slate-900">{(forecast.rSquared * 100).toFixed(1)}%</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-md">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Growth Rate Trajectory</span>
              <span className={`text-sm font-bold ${forecast.growthRatePercent >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                {forecast.growthRatePercent >= 0 ? "+" : ""}{forecast.growthRatePercent}%
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-md">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Slope (Change/Period)</span>
              <span className="text-sm font-bold text-slate-900">{forecast.slope.toLocaleString()}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-md">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Baseline Intercept</span>
              <span className="text-sm font-bold text-slate-900">{forecast.intercept.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Recharts Chart */}
        {forecast && forecast.points && forecast.points.length > 0 ? (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecast.points} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => (v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}K` : String(v))} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "8px", color: "#0f172a", fontSize: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                  formatter={(value: any, name: any) => [typeof value === "number" ? value.toLocaleString() : value, name]}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Area type="monotone" dataKey="upperBound" name="95% Upper Bound" fill="#e2e8f0" opacity={0.5} stroke="none" />
                <Line type="monotone" dataKey="actual" name="Actual Metric" stroke="#0f172a" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="forecast" name="ML Trend/Forecast" stroke="#2563eb" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">Insufficient data to run ML regression model.</div>
        )}
      </div>

      {/* Anomaly Outlier Detection Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-slate-100 text-slate-800 rounded">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Statistical Anomaly Log
              </h3>
              <p className="text-xs text-slate-500">
                Detection of values exceeding 2.2 standard deviations
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-600">Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-white border border-slate-200 text-xs text-slate-800 rounded-md px-2.5 py-1 focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              <option value="all">All ({dataset.anomalies.length})</option>
              <option value="high">High Severity</option>
              <option value="medium">Medium Severity</option>
            </select>
          </div>
        </div>

        {filteredAnomalies.length === 0 ? (
          <div className="p-8 text-center text-xs text-emerald-700 flex flex-col items-center justify-center space-y-2">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
            <span className="font-semibold">No anomalous outliers detected for this filter.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="p-2.5">Row #</th>
                  <th className="p-2.5">Column</th>
                  <th className="p-2.5">Observed Value</th>
                  <th className="p-2.5 text-center">Z-Score</th>
                  <th className="p-2.5">Severity</th>
                  <th className="p-2.5">Analyst Diagnosis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAnomalies.map((anom, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2.5 font-bold text-slate-500">#{anom.rowIndex}</td>
                    <td className="p-2.5 font-semibold text-slate-900">{anom.columnName}</td>
                    <td className="p-2.5 font-medium text-slate-800">{anom.value.toLocaleString()}</td>
                    <td className="p-2.5 text-center font-bold text-slate-900">{anom.zScore}σ</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded font-medium text-xs ${
                        anom.severity === "High"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {anom.severity}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-600">{anom.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
