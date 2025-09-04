"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";

export function ResetButton() {
  const { pending } = useFormStatus();

  return (
    <Link
      href="/dashboard/reset"
      className="inline-flex items-center justify-center h-8 px-4 rounded-[4px] 
                 bg-gradient-to-r from-teal-500 to-teal-600 
                 text-sm font-semibold dark:text-white text-white shadow-md 
                 transition-all duration-200 
                 hover:from-teal-400 hover:to-teal-500 
                 active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-300 
                 disabled:opacity-50"
    >
      {pending ? "Loading..." : "Reset"}
    </Link>
  );
}
