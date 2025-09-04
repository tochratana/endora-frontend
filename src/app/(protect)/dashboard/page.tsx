// app/dashboard/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getToken } from "next-auth/jwt";
import { Lock, Search } from "lucide-react";
import NewProjectButton from "./topupPage/newProjectButton"; // ⬅️ add this

export const metadata = {
  title: "Dashboard - Endora",
  description: "Your Endora dashboard",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Try to obtain the server-side JWT (which should contain the Keycloak access token)
  // and use it to call the external API that returns projects for the current user.
  // If anything fails, fall back to an empty list and show a helpful message.
  let cards: Array<{
    id: string | number;
    title: string;
    desc?: string;
    locked?: boolean;
    href: string;
  }> = [];

  try {
    // getToken can accept a missing req in server components; silence the explicit-any warning for this call.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jwt = await getToken({
      req: undefined as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const accessToken =
      jwt && (jwt as unknown as Record<string, unknown>)["accessToken"]
        ? String((jwt as unknown as Record<string, unknown>)["accessToken"])
        : undefined;

    if (accessToken) {
      const res = await fetch(
        "https://api.api-ngin.oudom.dev/projects/my-projects",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const body = isJson ? await res.json() : null;

      // Normalize a few possible response shapes.
      let projects: unknown[] = [];
      if (Array.isArray(body)) projects = body as unknown[];
      else if (body && Array.isArray((body as Record<string, unknown>).data))
        projects = (body as Record<string, unknown>).data as unknown[];
      else if (
        body &&
        Array.isArray((body as Record<string, unknown>).projects)
      )
        projects = (body as Record<string, unknown>).projects as unknown[];
      else if (body && Array.isArray((body as Record<string, unknown>).items))
        projects = (body as Record<string, unknown>).items as unknown[];

      const getField = (o: unknown, key: string) => {
        const r = o as Record<string, unknown> | null;
        if (!r) return undefined;
        const v = r[key];
        return typeof v === "string" || typeof v === "number" ? v : undefined;
      };

      cards = projects.map((p, idx) => {
        const id = getField(p, "id") ?? getField(p, "_id") ?? idx + 1;
        const title =
          getField(p, "projectName") ??
          getField(p, "name") ??
          `Project ${idx + 1}`;
        const desc = getField(p, "description");
        return {
          id,
          title: String(title),
          desc: desc ? String(desc) : undefined,
          locked: false,
          href: `/workspace/${id}/projectOverview`,
        };
      });
    } else {
      // No server-side token; leave cards empty (user might not be signed in server-side)
      cards = [];
    }
  } catch (err) {
    // swallow the error and render fallback UI — keep server logs clean for now
    // You can also log to your server logger here if desired.
    console.error("Failed to load projects on server:", err);
    cards = [];
  }

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
            {/* ⬇️ Replaced Link with modal-trigger button */}
            <NewProjectButton />

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
          {cards.map(c => (
            <Link
              key={c.id}
              href={c.href}
              className="group relative block rounded-[8px] border border-zinc-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:border-teal-400 dark:border-zinc-800/80 dark:bg-[#0F0F1A] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] dark:hover:border-emerald-500"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                    {c.title}
                  </p>
                  <p className="text-[13px] leading-5 text-zinc-500 dark:text-zinc-400 max-w-[28ch]">
                    {c.desc}
                  </p>
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
