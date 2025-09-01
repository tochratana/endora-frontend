"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";

export function ResetButton() {
  const { pending } = useFormStatus();

  return (
    <Link
      href="/dashboard/reset"
      className="h-10 rounded-[8px] bg-teal-500 px-5 text-sm font-medium text-black shadow
                 hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300
                 disabled:opacity-60"
    >
      {" "}
      Click
    </Link>
  );
}
