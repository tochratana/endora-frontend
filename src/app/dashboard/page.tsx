import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Lock, Search } from "lucide-react";

export const metadata = {
  title: "Dashboard - Endora",
  description: "Your Endora dashboard",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const cards = Array.from({ length: 9 }).map((_, i) => ({
    id: i + 1,
    title: "Ecommerce",
    desc: "Products and Order management.",
    locked: true,
    href: `/projects/${i + 1}`,
  }));

  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-200">
      <div className="mx-auto w-full max-w-7xl px-0 py-8 space-y-8">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Welcome{session?.user?.name ? `, ${session.user.name}` : ""}
              {session?.user?.email ? ` · ${session.user.email}` : ""}
            </p>
          </div>

          <div className="flex w-full sm:w-auto items-center gap-3">
            <button className="inline-flex items-center justify-center rounded-[8px] bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110 active:scale-[0.98] dark:bg-emerald-500">
              New Project
            </button>

            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search for a project"
                className="w-full rounded-[8px] border border-zinc-300 bg-white pl-9 pr-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-teal-400 hover:border-teal-400 dark:border-zinc-800 dark:bg-[#0F0F1A] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-emerald-500 dark:hover:border-emerald-500"
              />
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.id}
              href={c.href}
              className="group relative block rounded-[8px] border border-zinc-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:border-teal-400 dark:border-zinc-800/80 dark:bg-[#0F0F1A] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] dark:hover:border-emerald-500"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{c.title}</p>
                  <p className="text-[13px] leading-5 text-zinc-500 dark:text-zinc-400 max-w-[28ch]">{c.desc}</p>
                </div>

                {c.locked && (
                  <div className="rounded-[8px] border border-teal-600/30 bg-teal-500/5 p-2 dark:border-emerald-600/30 dark:bg-emerald-500/5">
                    <Lock className="h-4 w-4 text-teal-600 dark:text-emerald-400" />
                  </div>
                )}
              </div>


              <div className="absolute inset-0 rounded-[8px] bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
