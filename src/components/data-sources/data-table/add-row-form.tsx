"use client";

import { useState } from "react";
import type { Schema } from "@/service/apiSlide/schemaApi";
import { Check, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface AddRowFormProps {
  schema: Schema | undefined;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}

export function AddRowForm({ schema, onSave, onCancel }: AddRowFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  if (!schema) return null;

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  // Get columns in the same order as the main table: id first, then others
  const orderedColumns = [];

  // Add 'id' column first if it exists
  if (schema.columns.id) {
    orderedColumns.push(["id", schema.columns.id]);
  }

  // Add all other columns except 'id'
  Object.entries(schema.columns)
    .filter(([colName]) => colName !== "id")
    .forEach(entry => orderedColumns.push(entry));

  return (
    <tr className="bg-blue-50 dark:bg-blue-900/20 border-b border-slate-200 dark:border-slate-700">
      {/* Checkbox column to match table structure */}
      <td className="p-3 border-r border-slate-200 dark:border-slate-700 w-12">
        <Checkbox
          disabled
          className="opacity-50"
          aria-label="New row (not selectable)"
        />
      </td>

      {/* Form inputs for each column */}
      {orderedColumns.map(([colName, colType]) => {
        let inputType = "text";
        let isReadOnly = false;

        // Handle different column types
        if (
          colType.toLowerCase().includes("decimal") ||
          colType.toLowerCase().includes("numeric")
        ) {
          inputType = "number";
        }
        if (
          colType.toLowerCase().includes("timestamp") ||
          colType.toLowerCase().includes("date")
        ) {
          inputType = "date";
        }
        if (colType.toLowerCase().includes("boolean")) {
          inputType = "checkbox";
        }

        // Make ID field read-only since it's auto-generated
        if (colName === "id") {
          isReadOnly = true;
        }

        return (
          <td
            key={colName}
            className="p-3 border-r border-slate-200 dark:border-slate-700"
          >
            {colName === "id" ? (
              <span className="font-mono text-gray-400 dark:text-gray-500 text-sm">
                auto-generated
              </span>
            ) : (
              <input
                type={inputType}
                value={formData[colName] as string | number | readonly string[] ?? "" }
                onChange={e =>
                  handleChange(
                    colName,
                    inputType === "checkbox"
                      ? e.currentTarget.checked
                      : e.currentTarget.value
                  )
                }
                placeholder={`Enter ${colName}`}
                readOnly={isReadOnly}
                className="w-full bg-transparent border border-slate-400 dark:border-slate-500 rounded px-2 py-1 text-sm text-gray-800 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
              />
            )}
          </td>
        );
      })}

      {/* Actions column to match table structure */}
      <td className="p-3 w-20">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={handleSubmit}
            className="text-slate-500 hover:text-green-400 p-1 rounded transition-colors"
            title="Save"
          >
            <Check size={14} />
          </button>
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
            title="Cancel"
          >
            <X size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
