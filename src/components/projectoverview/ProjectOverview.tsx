import { Archive, Database, User, Zap } from "lucide-react";

export default function ProjectOverview() {
  // Demo data – replace with real values or props
  const storeName = "Daron-Beauty-Store";
  const tagline =
    "We bring convenience to your fingertips with a wide range of products tailored to your lifestyle.";

  const cards = [
    {
      title: "Schema",
      subtitle: "REST Requests",
      value: 0,
      icon: Database,
      empty: true,
    },
    {
      title: "Catalog",
      subtitle: "Products",
      value: 0,
      icon: Archive,
      empty: true,
    },
    {
      title: "Users",
      subtitle: "Active",
      value: 0,
      icon: User,
      empty: true,
    },
    {
      title: "Performance",
      subtitle: "Zaps/min",
      value: 0,
      icon: Zap,
      empty: true,
    },
  ];

  const total = cards.reduce((acc, c) => acc + (Number(c.value) || 0), 0);

  return (
    <section className="w-full py-10 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-6 mb-8">
          <div className="md:col-span-8">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {storeName}
            </h1>
            <p className="mt-2 text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
              {tagline}
            </p>
          </div>

          <div className="md:col-span-4 md:justify-self-end">
            <div className="rounded-2xl border border-gray-200 dark:border-slate-700 p-4 md:p-5 bg-gray-50 dark:bg-slate-800/60">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white" aria-live="polite">
                {total.toString().padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cards.map((card, idx) => (
            <StatCard key={idx} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ title, subtitle, value, icon: Icon, empty }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 transition-shadow hover:shadow-lg focus-within:shadow-lg">
      <div className="p-4 md:p-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
            <Icon className="h-5 w-5 text-[var(--color-secondary,#6366f1)]" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white" aria-live="polite">
            {Number(value) || value === 0 ? String(value) : "—"}
          </p>
        </div>

        <div className="mt-4 h-28 md:h-32 grid place-content-center rounded-xl border border-dashed border-gray-300 dark:border-slate-600 text-center">
          {empty ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">No data to show</p>
          ) : (
            <div className="text-xs text-gray-600 dark:text-gray-400">{/* Put a sparkline, mini table, or preview here */}</div>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 -bottom-6 h-12 translate-y-6 bg-gradient-to-r from-transparent via-[var(--color-secondary,#6366f1)]/20 to-transparent opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
    </div>
  );
}
