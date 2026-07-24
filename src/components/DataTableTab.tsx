import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Table as TableIcon, Download, SlidersHorizontal } from "lucide-react";
import { ProcessedDataset } from "../types";

interface DataTableTabProps {
  dataset: ProcessedDataset;
}

export const DataTableTab: React.FC<DataTableTabProps> = ({ dataset }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Filter rows
  const filteredData = dataset.data.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort rows
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortCol) return 0;
    const valA = a[sortCol];
    const valB = b[sortCol];
    if (valA === valB) return 0;
    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;
    if (typeof valA === "number" && typeof valB === "number") {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
  };

  const exportCSV = () => {
    if (!dataset.data || dataset.data.length === 0) return;
    const headers = dataset.columns.join(",");
    const rows = dataset.data.map((row) =>
      dataset.columns.map((col) => `"${row[col] ?? ""}"`).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${dataset.name.replace(/\s+/g, "_")}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 my-2">
      {/* Column Summary Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs overflow-x-auto">
        <div className="flex items-center space-x-2 mb-3">
          <TableIcon className="h-4 w-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Dataset Profile & Column Summaries
          </h3>
        </div>
        <div className="flex space-x-3 text-xs">
          {dataset.columnSummaries.map((s, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-md shrink-0 min-w-[140px]">
              <span className="font-semibold text-slate-900 block truncate">{s.name}</span>
              <span className="text-[10px] text-slate-600 font-medium uppercase">{s.type}</span>
              {s.mean !== undefined && (
                <div className="text-[10px] text-slate-600 mt-1 space-y-0.5">
                  <div>Mean: <span className="text-slate-900 font-semibold">{s.mean.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span></div>
                  <div>Min: <span className="text-slate-800">{s.min?.toLocaleString()}</span></div>
                  <div>Max: <span className="text-slate-800">{s.max?.toLocaleString()}</span></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Raw Data Controls & Search */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search values across columns..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-md pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-500">
              Showing {sortedData.length} records
            </span>
            <button
              onClick={exportCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-medium cursor-pointer transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-md">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="p-2.5 w-12 text-center border-r border-slate-200">#</th>
                {dataset.columns.map((col) => (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="p-2.5 cursor-pointer hover:text-slate-900 transition-colors whitespace-nowrap"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col}</span>
                      {sortCol === col && (
                        <span className="text-slate-900 font-bold">{sortAsc ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedData.map((row, idx) => {
                const globalRowIdx = (currentPage - 1) * pageSize + idx + 1;
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2.5 text-center text-slate-400 font-mono text-[10px] border-r border-slate-200">
                      {globalRowIdx}
                    </td>
                    {dataset.columns.map((col) => (
                      <td key={col} className="p-2.5 font-medium text-slate-800 whitespace-nowrap">
                        {row[col] !== null && row[col] !== undefined ? String(row[col]) : "-"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <div>
            Page <span className="font-semibold text-slate-900">{currentPage}</span> of{" "}
            <span className="font-semibold text-slate-900">{totalPages}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-700 rounded-md cursor-pointer transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-700 rounded-md cursor-pointer transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
