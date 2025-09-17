"use client";

import { useEffect, useRef, useState } from "react";
import ProjectCreationForm from "./ProjectCreationForm";

export default function NewProjectButton() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-[8px] bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110 active:scale-[0.98] dark:bg-emerald-500"
      >
        New Project
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          aria-hidden={false}
          role="dialog"
          aria-modal="true"
          aria-label="Topup modal"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <div
            ref={dialogRef}
            className="relative z-[61] w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800/80 dark:bg-[#0F0F1A]"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold tracking-tight">
                New Project
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Set up a new project or add credits to your workspace.
              </p>
            </div>

            <ProjectCreationForm onDone={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
