import { useState } from "react";
import {
  Clock,
  AlertTriangle,
  Pencil,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { DeletionWarningModal } from "../popup/deletion-warning-modal";

export function ScheduleReset({
  rowCount,
  lastUpdated,
  dataSourceName,
}: {
  rowCount: number;
  lastUpdated: string; // e.g., "Aug 18, 2025" or "—"
  dataSourceName: string; // "products"
}) {
  const [frequency, setFrequency] = useState("Weekly");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [frequencyOpen, setFrequencyOpen] = useState(false);
  const [dayOpen, setDayOpen] = useState(false);

  const frequencyOptions = ["Daily", "Weekly", "Monthly", "Yearly"];
  const dayOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    console.log("Item deleted!");
    // Add your deletion logic here
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Reset Schedule
        </h2>
        <p className="text-gray-600 dark:text-gray-500">
          Manage and view your reset schedule for this data source.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-300 dark:border-slate-700 space-y-3">
        <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
          <Clock className="w-4 h-4" />
          <span>{rowCount} rows</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
          <Clock className="w-4 h-4" />
          <span>Last updated: {lastUpdated}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
          <Clock className="w-4 h-4" />
          <span>Data Source: {dataSourceName}</span>
        </div>
      </div>

      {/* Next Reset Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-300 dark:border-slate-700">
        <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
          <Clock className="w-4 h-4" />
          <span>Next Reset: Aug-25-2025 -- 00</span>
          <span className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 px-2 py-1 rounded text-sm">
            Weekly
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Frequency Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Frequency
          </label>
          <div className="relative">
            <button
              onClick={() => setFrequencyOpen(!frequencyOpen)}
              className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center justify-between">
                <span>{frequency || "Frequency"}</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>
            {frequencyOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg shadow-lg">
                {frequencyOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setFrequency(option);
                      setFrequencyOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Day Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Day
          </label>
          <div className="relative">
            <button
              onClick={() => setDayOpen(!dayOpen)}
              className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center justify-between">
                <span>{day || "Day"}</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>
            {dayOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {dayOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setDay(option);
                      setDayOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Time Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Warning Message */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
          <AlertTriangle className="w-4 h-4" />
          <span>
            Reset will permanently delete all current data from this source.
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Pencil className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
        <DeletionWarningModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}

// Demo usage
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <ScheduleReset
        rowCount={1234}
        lastUpdated="Aug-18-2025"
        dataSourceName="products"
      />
    </div>
  );
}
