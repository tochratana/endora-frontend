"use client";

import { Clock, Download, Trash2 } from "lucide-react";

export function TableToolbar({
  selectedCount,
  onDeleteSelected,
  onOpenAutoReset,
  onOpenImport,
}: {
  selectedCount: number;
  onDeleteSelected: () => void;
  onOpenAutoReset: () => void;
  onOpenImport: () => void;
}) {
  return (
    <div className="flex items-center justify-end">
      <div className="flex gap-2">
        {selectedCount > 0 && (
          <button
            onClick={onDeleteSelected}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          >
            <Trash2 size={14} /> Delete ({selectedCount})
          </button>
        )}

        <button
          onClick={onOpenAutoReset}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-300 dark:bg-slate-700 text-gray-600 dark:text-gray-200 rounded text-sm hover:bg-slate-600 transition-colors"
        >
          <Clock size={14} /> Auto Reset
        </button>

        <button
          onClick={onOpenImport}
          className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 text-white rounded text-sm hover:bg-teal-700 transition-colors"
        >
          <Download size={14} /> Import File
        </button>
      </div>
    </div>
  );
}
