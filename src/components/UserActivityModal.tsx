import React from "react";
import { X, User, BarChart2, Calendar, MousePointer, PlusCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export interface UserActivity {
  id: string;
  action: string;
  timestamp: string;
  details: string;
  durationMs: number;
}

interface UserActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: UserActivity[];
  onAddActivity: (action: string, details: string) => void;
}

export const UserActivityModal: React.FC<UserActivityModalProps> = ({
  isOpen,
  onClose,
  activities,
  onAddActivity,
}) => {
  if (!isOpen) return null;

  // Aggregate user actions for graph view
  const actionCounts = activities.reduce((acc: Record<string, number>, curr) => {
    acc[curr.action] = (acc[curr.action] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(actionCounts).map((action) => ({
    name: action,
    count: actionCounts[action],
  }));

  // Parse total time spent actively interacting
  const totalInteractionMs = activities.reduce((acc, curr) => acc + curr.durationMs, 0);
  const totalInteractionSeconds = Math.round(totalInteractionMs / 1000);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-lg w-full max-w-3xl shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-slate-100 text-slate-700 rounded">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">User Session & Activity Logs</h2>
              <p className="text-xs text-slate-500">Track and visualize dashboard interactions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Total Operations</span>
              <span className="text-2xl font-bold text-slate-900">{activities.length} Actions</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Tracked Time</span>
              <span className="text-2xl font-bold text-slate-900">{totalInteractionSeconds}s Active</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Most Common Action</span>
              <span className="text-2xl font-bold text-slate-900 truncate">
                {chartData.sort((a, b) => b.count - a.count)[0]?.name || "N/A"}
              </span>
            </div>
          </div>

          {/* Activity Graph */}
          {chartData.length > 0 ? (
            <div className="bg-white border border-slate-200 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <BarChart2 className="h-4 w-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Action Frequency Distribution Graph
                </h3>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#cbd5e1",
                        borderRadius: "8px",
                        color: "#0f172a",
                        fontSize: "12px",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar dataKey="count" fill="#0f172a" radius={[4, 4, 0, 0]} name="Occurrences" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 border border-slate-200 rounded-lg">
              No activities logged yet.
            </div>
          )}

          {/* Activity Logs Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Historical Logs</span>
              <button
                onClick={() => onAddActivity("Custom Mark", "Manual checkpoint added by user")}
                className="flex items-center space-x-1 text-[10px] bg-slate-900 text-white hover:bg-slate-800 px-2 py-1 rounded transition-colors font-medium cursor-pointer"
              >
                <PlusCircle className="h-3 w-3" />
                <span>Add Record</span>
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
                    <th className="p-2.5">Time</th>
                    <th className="p-2.5">Action</th>
                    <th className="p-2.5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activities.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2.5 text-slate-500 font-mono text-[10px] whitespace-nowrap">
                        {act.timestamp}
                      </td>
                      <td className="p-2.5 font-semibold text-slate-900 whitespace-nowrap">
                        {act.action}
                      </td>
                      <td className="p-2.5 text-slate-600 truncate max-w-[300px]">
                        {act.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-md text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
