// app/topup/page.tsx
import TopupForm from "./topupFrom";

export const metadata = {
  title: "Topup - Endora",
  description: "Create or fund a new project",
};

export default function TopupPage() {
  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-200">
      <div className="mx-auto w-full max-w-3xl px-6 py-10 space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">Topup</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Set up a new project or add credits to your workspace.
        </p>
        <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800/80 dark:bg-[#0F0F1A]">
          <TopupForm />
        </div>
      </div>
    </div>
  );
}
