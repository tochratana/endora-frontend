
import { Clock, AlertTriangle, Pencil, Trash2 } from "lucide-react";

export function ScheduleReset({
  rowCount,
  lastUpdated,
  dataSourceName,
}: {
  rowCount: number;
  lastUpdated: string; // e.g., "Aug 18, 2025" or "—"
  dataSourceName: string; // "products"
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Reset Schedule</h2>
        <p className="text-gray-500">Manage and view your reset schedule for this data source.</p>
      </div>

      <div className="dark:bg-slate-800 rounded-lg p-4 border dark:border-slate-700 space-y-3">
        <div className="flex items-center gap-2 dark:text-slate-300 text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{rowCount} rows</span>
        </div>
        <div className="flex items-center gap-2 dark:text-slate-300 text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Last updated: {lastUpdated}</span>
        </div>
        <div className="flex items-center gap-2 dark:text-slate-300 text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Data Source: {dataSourceName}</span>
        </div>
      </div>

      {/* keep the rest of your schedule UI as-is */}
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-4 h-4" />
          <span>Reset will permanently delete all current data from this source.</span>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Pencil className="w-4 h-4" />
          Save
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
