
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Play, RefreshCcw } from "lucide-react";

export function TableFooter({
  total,
  selectedCount,
  isRefreshing,
  onToggleAll,
  onRefresh,
}: {
  total: number;
  selectedCount: number;
  isRefreshing: boolean;
  onToggleAll: (checked: boolean) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="flex items-center justify-between text-sm text-slate-400">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={selectedCount === total && total > 0}
          onCheckedChange={(v) => onToggleAll(!!v)}
        />
        <span>
          {selectedCount} of {total}
        </span>
        <button className="p-1 hover:text-white transition-colors">
          <Play size={14} />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <span>records {total}</span>
        <button
          onClick={onRefresh}
          disabled={isRefreshing} // prevent double clicks
          className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          <RefreshCcw
            size={14}
            className={isRefreshing ? "animate-spin" : ""}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>
    </div>
  );
}
