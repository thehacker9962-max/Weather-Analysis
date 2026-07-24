import React, { useState } from "react";
import { Sliders, Sparkles, DollarSign, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";
import { ProcessedDataset, ScenarioParameters } from "../types";
import { simulateScenario } from "../utils/mlEngine";

interface ScenarioSimulatorTabProps {
  dataset: ProcessedDataset;
}

export const ScenarioSimulatorTab: React.FC<ScenarioSimulatorTabProps> = ({ dataset }) => {
  const [params, setParams] = useState<ScenarioParameters>({
    priceMultiplier: 1.05, // +5% Price increase
    cogsInflationMultiplier: 1.03, // +3% Inflation
    volumeGrowthMultiplier: 1.08, // +8% Volume
    fxVolatilityShift: 0.0, // 0%
  });

  const outcome = simulateScenario(dataset.data, params);

  const resetSliders = () => {
    setParams({
      priceMultiplier: 1.0,
      cogsInflationMultiplier: 1.0,
      volumeGrowthMultiplier: 1.0,
      fxVolatilityShift: 0.0,
    });
  };

  const formatCurrency = (val: number) => {
    if (Math.abs(val) >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (Math.abs(val) >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    if (Math.abs(val) >= 1e3) return `$${(val / 1e3).toFixed(1)}K`;
    return `$${val.toFixed(2)}`;
  };

  return (
    <div className="space-y-6 my-2">
      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                What-If Sensitivity & Stress Test Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Simulate macro economic shocks, price adjustments, and supply inflation on dataset performance
              </p>
            </div>
          </div>

          <button
            onClick={resetSliders}
            className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {/* Slider 1: Price Shift */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Price Adjustment</span>
              <span className="text-indigo-400 font-bold">
                {((params.priceMultiplier - 1) * 100).toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="0.80"
              max="1.30"
              step="0.01"
              value={params.priceMultiplier}
              onChange={(e) =>
                setParams({ ...params, priceMultiplier: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-20% Discount</span>
              <span>+30% Premium</span>
            </div>
          </div>

          {/* Slider 2: COGS Inflation */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">COGS / Inflation Shift</span>
              <span className="text-amber-400 font-bold">
                {((params.cogsInflationMultiplier - 1) * 100).toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="0.85"
              max="1.25"
              step="0.01"
              value={params.cogsInflationMultiplier}
              onChange={(e) =>
                setParams({ ...params, cogsInflationMultiplier: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-15% Savings</span>
              <span>+25% Inflation</span>
            </div>
          </div>

          {/* Slider 3: Volume Growth */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Demand Volume Growth</span>
              <span className="text-emerald-400 font-bold">
                {((params.volumeGrowthMultiplier - 1) * 100).toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="0.70"
              max="1.50"
              step="0.01"
              value={params.volumeGrowthMultiplier}
              onChange={(e) =>
                setParams({ ...params, volumeGrowthMultiplier: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-30% Contraction</span>
              <span>+50% Surge</span>
            </div>
          </div>

          {/* Slider 4: FX Volatility */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">FX Currency Shift</span>
              <span className="text-purple-400 font-bold">
                {(params.fxVolatilityShift * 100).toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="-0.10"
              max="0.10"
              step="0.005"
              value={params.fxVolatilityShift}
              onChange={(e) =>
                setParams({ ...params, fxVolatilityShift: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-10% Devaluation</span>
              <span>+10% Gain</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Outcome Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Projected Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Projected Revenue
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-100">
              {formatCurrency(outcome.projectedRevenue)}
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                outcome.revenueDeltaPct >= 0
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {outcome.revenueDeltaPct >= 0 ? "+" : ""}
              {outcome.revenueDeltaPct}%
            </span>
          </div>
          <p className="text-xs text-slate-400 border-t border-slate-800 pt-2">
            Baseline: <span className="text-slate-200 font-semibold">{formatCurrency(outcome.baseRevenue)}</span>
          </p>
        </div>

        {/* Card 2: Projected EBITDA */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Projected EBITDA Margin
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-100">
              {formatCurrency(outcome.projectedEbitda)}
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                outcome.ebitdaDeltaPct >= 0
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {outcome.ebitdaDeltaPct >= 0 ? "+" : ""}
              {outcome.ebitdaDeltaPct}%
            </span>
          </div>
          <p className="text-xs text-slate-400 border-t border-slate-800 pt-2">
            Baseline EBITDA: <span className="text-slate-200 font-semibold">{formatCurrency(outcome.baseEbitda)}</span>
          </p>
        </div>

        {/* Card 3: Projected Net Profit */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Projected Net Income
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-100">
              {formatCurrency(outcome.projectedNetIncome)}
            </span>
            <span className="text-xs text-indigo-400 font-semibold">
              Estimated Net Flow
            </span>
          </div>
          <p className="text-xs text-slate-400 border-t border-slate-800 pt-2">
            Baseline Net: <span className="text-slate-200 font-semibold">{formatCurrency(outcome.baseNetIncome)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
