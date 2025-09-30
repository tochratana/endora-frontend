"use client";

import { useState } from "react";
import { Clock, Download, Link as LinkIcon, Trash2 } from "lucide-react";
import { JsonEditor } from "../json-editor/JsonEditor";

export function TableToolbar({
  selectedCount,
  onDeleteSelected,
  onOpenAutoReset,
  onOpenImport,
  workspaceId,
  schemas,
  projectUuid,
  onInsertData,
  theme,
}: {
  selectedCount: number;
  onDeleteSelected: () => void;
  onOpenAutoReset: () => void;
  onOpenImport: () => void;
  workspaceId: string;
  schemas?: Array<{ schemaName: string }>;
  projectUuid: string;
  onInsertData: (schemaName: string, data: any) => Promise<void>;
  theme?: "light" | "dark";
}) {
  const [isJsonEditorOpen, setIsJsonEditorOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end">
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
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-300 dark:bg-slate-700 text-gray-600 dark:text-gray-200 rounded text-sm hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors"
          >
            <Clock size={14} /> Auto Reset
          </button>

          <button
            onClick={onOpenImport}
            className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 text-white rounded text-sm hover:bg-teal-700 transition-colors"
          >
            <Download size={14} /> Import File
          </button>

          <button
            onClick={() => setIsJsonEditorOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 text-white rounded text-sm hover:bg-teal-700 transition-colors"
          >
            <LinkIcon size={14} />
            JSON Editor
          </button>
        </div>
      </div>

      <JsonEditor
        isOpen={isJsonEditorOpen}
        onClose={() => setIsJsonEditorOpen(false)}
        schemas={schemas || []}
        projectUuid={projectUuid}
        onInsertData={onInsertData}
        theme={theme}
      />
    </>
  );
}
