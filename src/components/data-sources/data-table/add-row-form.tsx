"use client";

import Input from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

const todayLocalISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};

export function AddRowForm({
  onSave,
  onCancel,
}: {
  onSave: (p: { name: string; price: number; created_date: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [priceStr, setPriceStr] = useState("");
  const [date, setDate] = useState(todayLocalISO());

  const isValid = useMemo(() => {
    const price = parseFloat(priceStr);
    return name.trim().length > 0 && Number.isFinite(price);
  }, [name, priceStr]);

  return (
    <tr className="border-b border-slate-200 dark:border-slate-700 dark:bg-slate-750">
      <td className="p-3 border-r border-slate-200 dark:border-slate-700" />
      <td className="p-3 text-slate-700 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700 font-mono">
        auto
      </td>
      <td className="p-3 border-r text-black border-slate-200 dark:border-slate-700">
        <Input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </td>
      <td className="p-3 border-r border-slate-200 dark:border-slate-700">
        <Input
          type="number"
          step="0.01"
          placeholder="0.00"
          value={priceStr}
          onChange={(e) => setPriceStr(e.target.value)}
          className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 text-sm font-mono focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </td>
      <td className="p-3 border-r border-slate-200 dark:border-slate-700 text-gray-900">
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 text-sm font-mono focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </td>
      <td className="p-3 text-center">
        <div className="flex items-center justify-center gap-1">
          <button
            disabled={!isValid}
            onClick={() =>
              onSave({
                name: name.trim(),
                price: parseFloat(parseFloat(priceStr).toFixed(2)),
                created_date: date || todayLocalISO(),
              })
            }
            className="text-green-600 disabled:opacity-40 disabled:cursor-not-allowed dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 p-1 rounded transition-colors"
            title="Save"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={onCancel}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded transition-colors"
            title="Cancel"
          >
            ×
          </button>
        </div>
      </td>
    </tr>
  );
}
