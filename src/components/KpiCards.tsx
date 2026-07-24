import React, { useState } from "react";
import { FileSpreadsheet, Tag, Hash, Calendar, Layers, ChevronDown, ChevronUp } from "lucide-react";
import { ProcessedDataset, AiExecutiveReport } from "../types";

interface KpiCardsProps {
  dataset: ProcessedDataset | null;
  report: AiExecutiveReport | null;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ dataset }) => {
  const [showAllCategories, setShowAllCategories] = useState(false);

  if (!dataset) return null;

  const totalCols = dataset.columnCount;
  const totalRows = dataset.rowCount;
  const categoricalCols = dataset.categoricalColumns;
  const numericCols = dataset.numericColumns;
  const dateCols = dataset.dateColumns;

  return (
    <div className="space-y-4 mb-6">
      {/* Top 4 Data Category Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Dataset Volume */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Dataset Volume
            </span>
            <div className="p-1.5 rounded bg-slate-100 text-slate-700">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
              {totalRows.toLocaleString()} <span className="text-xs font-normal text-slate-500">Rows</span>
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200">
                {totalCols} Columns
              </span>
              <span className="text-xs text-slate-500 font-mono truncate max-w-[120px]">
                {dataset.name}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Categorical Attributes */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Categorical Attributes
            </span>
            <div className="p-1.5 rounded bg-slate-100 text-slate-700">
              <Tag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
              {categoricalCols.length} <span className="text-xs font-normal text-slate-500">Text Columns</span>
            </p>
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {categoricalCols.slice(0, 2).map((col) => (
                <span key={col} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200 truncate max-w-[100px]">
                  {col}
                </span>
              ))}
              {categoricalCols.length > 2 && (
                <span className="text-xs text-slate-500 font-medium">+{categoricalCols.length - 2} more</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Numeric Metrics */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Quantitative Metrics
            </span>
            <div className="p-1.5 rounded bg-slate-100 text-slate-700">
              <Hash className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
              {numericCols.length} <span className="text-xs font-normal text-slate-500">Numeric Fields</span>
            </p>
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {numericCols.slice(0, 2).map((col) => (
                <span key={col} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200 truncate max-w-[100px]">
                  {col}
                </span>
              ))}
              {numericCols.length > 2 && (
                <span className="text-xs text-slate-500 font-medium">+{numericCols.length - 2} more</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 4: Date & Time Fields */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Date & Time Fields
            </span>
            <div className="p-1.5 rounded bg-slate-100 text-slate-700">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
              {dateCols.length} <span className="text-xs font-normal text-slate-500">Timestamps</span>
            </p>
            <div className="flex items-center gap-1 mt-2">
              {dateCols.length > 0 ? (
                dateCols.slice(0, 2).map((col) => (
                  <span key={col} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200 truncate max-w-[110px]">
                    {col}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 font-normal italic">No date columns</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSV Data Categories Detailed Breakdown Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="h-4 w-4 text-slate-600" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
              Data Schema & Categories ({dataset.columnCount} Columns)
            </h3>
          </div>
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="flex items-center space-x-1 text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer bg-slate-50 px-2.5 py-1 rounded border border-slate-200 transition-colors"
          >
            <span>{showAllCategories ? "Hide Schema" : "View Full Schema"}</span>
            {showAllCategories ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Quick Column Category Badges */}
        <div className="mt-3 flex flex-wrap gap-2">
          {dataset.columnSummaries.map((col) => (
            <div
              key={col.name}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700"
            >
              <span className="font-semibold text-slate-900">{col.name}</span>
              <span className="text-[10px] uppercase px-1.5 py-0.2 rounded font-mono bg-white border border-slate-200 text-slate-500">
                {col.type}
              </span>
            </div>
          ))}
        </div>

        {/* Detailed Column Category Breakdown Grid (When Expanded) */}
        {showAllCategories && (
          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {dataset.columnSummaries.map((col) => (
              <div key={col.name} className="bg-slate-50 p-3 rounded-md border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate max-w-[150px]">{col.name}</span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                    {col.type}
                  </span>
                </div>
                <div className="text-xs text-slate-600 flex justify-between">
                  <span>Unique Values: <strong className="text-slate-900">{col.uniqueValuesCount}</strong></span>
                  <span>Nulls: <strong className={col.missingCount > 0 ? "text-amber-600" : "text-emerald-600"}>{col.missingCount}</strong></span>
                </div>
                {col.sampleValues && col.sampleValues.length > 0 && (
                  <div className="text-xs text-slate-500 truncate pt-1 border-t border-slate-200">
                    Samples: <span className="text-slate-700 font-mono">{col.sampleValues.slice(0, 3).join(", ")}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

