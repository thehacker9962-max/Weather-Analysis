import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { BarChart3, LineChart as LineIcon, PieChart as AreaIcon, Filter, Layers } from "lucide-react";
import { ProcessedDataset } from "../types";

interface FinancialDashTabProps {
  dataset: ProcessedDataset;
}

export const FinancialDashTab: React.FC<FinancialDashTabProps> = ({ dataset }) => {
  const [chartType, setChartType] = useState<"bar" | "line" | "area" | "composed">("composed");
  const [xAxisCol, setXAxisCol] = useState<string>(
    dataset.dateColumns[0] || dataset.categoricalColumns[0] || dataset.columns[0]
  );
  const [yAxis1, setYAxis1] = useState<string>(dataset.numericColumns[0] || "");
  const [yAxis2, setYAxis2] = useState<string>(dataset.numericColumns[1] || "");

  // Prepare chart data
  const chartData = dataset.data.slice(0, 30);

  const formatNumber = (v: number): string => {
    if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
    if (Math.abs(v) >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
    return String(v);
  };

  return (
    <div className="space-y-6 my-2">
      {/* Dashboard Customization Controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <Layers className="h-5 w-5 text-slate-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Interactive Visual Dashboard</h3>
              <p className="text-xs text-slate-500">Configure chart axes and overlay multi-metric trends</p>
            </div>
          </div>

          {/* Chart Type Picker */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-md border border-slate-200">
            <button
              onClick={() => setChartType("composed")}
              className={`p-1.5 rounded text-xs font-medium flex items-center space-x-1 cursor-pointer transition-colors ${
                chartType === "composed" ? "bg-slate-900 text-white font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Multi-Axis</span>
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`p-1.5 rounded text-xs font-medium flex items-center space-x-1 cursor-pointer transition-colors ${
                chartType === "bar" ? "bg-slate-900 text-white font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Bar</span>
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`p-1.5 rounded text-xs font-medium flex items-center space-x-1 cursor-pointer transition-colors ${
                chartType === "line" ? "bg-slate-900 text-white font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LineIcon className="h-3.5 w-3.5" />
              <span>Line</span>
            </button>
            <button
              onClick={() => setChartType("area")}
              className={`p-1.5 rounded text-xs font-medium flex items-center space-x-1 cursor-pointer transition-colors ${
                chartType === "area" ? "bg-slate-900 text-white font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <AreaIcon className="h-3.5 w-3.5" />
              <span>Area</span>
            </button>
          </div>
        </div>

        {/* Axis & Metric Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-600 block mb-1 font-semibold">Primary X-Axis Dimension</label>
            <select
              value={xAxisCol}
              onChange={(e) => setXAxisCol(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-md p-2 focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              {dataset.columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-600 block mb-1 font-semibold">Primary Y-Axis Metric (Bar/Line)</label>
            <select
              value={yAxis1}
              onChange={(e) => setYAxis1(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-md p-2 focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              {dataset.numericColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-600 block mb-1 font-semibold">Secondary Y-Axis Metric (Overlay)</label>
            <select
              value={yAxis2}
              onChange={(e) => setYAxis2(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-md p-2 focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              <option value="">None (Single Metric)</option>
              {dataset.numericColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Chart Area */}
        <div className="h-80 w-full pt-6">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "composed" ? (
              <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey={xAxisCol} stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" stroke="#0f172a" tick={{ fontSize: 11 }} tickFormatter={formatNumber} />
                {yAxis2 && <YAxis yAxisId="right" orientation="right" stroke="#2563eb" tick={{ fontSize: 11 }} tickFormatter={formatNumber} />}
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "8px", color: "#0f172a", fontSize: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                  formatter={(v: any) => [typeof v === "number" ? v.toLocaleString() : v]}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar yAxisId="left" dataKey={yAxis1} fill="#1e293b" radius={[4, 4, 0, 0]} name={yAxis1} />
                {yAxis2 && <Line yAxisId="right" type="monotone" dataKey={yAxis2} stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} name={yAxis2} />}
              </ComposedChart>
            ) : chartType === "bar" ? (
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey={xAxisCol} stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={formatNumber} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "8px", color: "#0f172a", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey={yAxis1} fill="#1e293b" radius={[4, 4, 0, 0]} name={yAxis1} />
                {yAxis2 && <Bar dataKey={yAxis2} fill="#2563eb" radius={[4, 4, 0, 0]} name={yAxis2} />}
              </BarChart>
            ) : chartType === "line" ? (
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey={xAxisCol} stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={formatNumber} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "8px", color: "#0f172a", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Line type="monotone" dataKey={yAxis1} stroke="#1e293b" strokeWidth={2} dot={{ r: 3 }} name={yAxis1} />
                {yAxis2 && <Line type="monotone" dataKey={yAxis2} stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} name={yAxis2} />}
              </LineChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey={xAxisCol} stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={formatNumber} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "8px", color: "#0f172a", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Area type="monotone" dataKey={yAxis1} fill="#e2e8f0" stroke="#1e293b" name={yAxis1} />
                {yAxis2 && <Area type="monotone" dataKey={yAxis2} fill="#dbeafe" stroke="#2563eb" name={yAxis2} />}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
