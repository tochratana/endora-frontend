"use client";

import { useFormStatus } from "react-dom";

export function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="h-8 rounded-[4px] bg-teal-500 px-4 text-sm font-medium dark:text-white text-white shadow
                 hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300
                 disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}
