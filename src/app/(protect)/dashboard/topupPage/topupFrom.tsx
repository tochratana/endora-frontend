"use client";

import { useState } from "react";

type Props = {
  onDone?: () => void;
};

export default function TopupForm({ onDone }: Props) {
  const [name, setName] = useState("");
  const [credits, setCredits] = useState<number | "">("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // TODO: call your API here, e.g.:
    // await fetch("/api/projects", { method: "POST", body: JSON.stringify({ name, credits }) });

    // For now just close the modal
    onDone?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <label className="text-sm">Project name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-[8px] border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-400 hover:border-teal-400 dark:border-zinc-800 dark:bg-[#0F0F1A] dark:text-zinc-200 dark:focus:border-emerald-500 dark:hover:border-emerald-500"
          placeholder="Input your project name"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm">Discrition</label>
        <textarea
          className="w-full rounded-[8px] border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-400 hover:border-teal-400 dark:border-zinc-800 dark:bg-[#0F0F1A] dark:text-zinc-200 dark:focus:border-emerald-500 dark:hover:border-emerald-500"
          placeholder="Discrition of project"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-[8px] bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110 active:scale-[0.98] dark:bg-emerald-500"
        >
          Continue
        </button>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex items-center justify-center rounded-[8px] border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
