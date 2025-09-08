"use client";

import { useState } from "react";
import { useCreateProjectMutation } from "@/service/apiSlide/projectApi";

type Props = {
  onDone?: () => void;
};

export default function TopupForm({ onDone }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [createProject, { isLoading, isError, error }] =
    useCreateProjectMutation();

  async function handleSubmit(e: React.FormEvent) {
    console.log("Form submitted with:", { name, description });
    e.preventDefault();
    setErrorMessage(null);
    const payload = { projectName: name, description };

    if (!name.trim() || !description.trim()) {
      return;
    }

    try {
      await createProject({
        projectName: name.trim(),
        description: description.trim(),
      }).unwrap();

      // Reset form and close modal on success
      setName("");
      setDescription("");
      onDone?.();
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  }

  console.log();
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <label className="text-sm">Project name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full rounded-[8px] border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-400 hover:border-teal-400 dark:border-zinc-800 dark:bg-[#0F0F1A] dark:text-zinc-200 dark:focus:border-emerald-500 dark:hover:border-emerald-500"
          placeholder="Input your project name"
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full rounded-[8px] border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-400 hover:border-teal-400 dark:border-zinc-800 dark:bg-[#0F0F1A] dark:text-zinc-200 dark:focus:border-emerald-500 dark:hover:border-emerald-500"
          placeholder="Description of project"
          rows={3}
          required
        />
      </div>

      {isError && (
        <div className="text-red-600 text-sm">
          Error:{" "}
          {error && "data" in error
            ? String(error.data)
            : "Failed to create project"}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isLoading || !name.trim() || !description.trim()}
          className="inline-flex items-center justify-center rounded-[8px] bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-emerald-500"
        >
          {isLoading ? "Creating..." : "Continue"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex items-center justify-center rounded-[8px] border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          Cancel
        </button>
      </div>
      {errorMessage && (
        <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
      )}
    </form>
  );
}
