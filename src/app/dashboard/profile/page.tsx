
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Account settings — Endora",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  const fullName = session?.user?.name ?? "";
  const [firstName, ...rest] = fullName.split(" ");
  const lastName = rest.join(" ");

  return (
    <div className="">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <span aria-hidden>←</span>
            <span>Back to dashboard</span>
          </Link>
        </div>

        <h1 className="mb-8 text-2xl font-semibold tracking-tight">
          Account settings
        </h1>

        <div className="grid gap-8 md:grid-cols-[320px,1fr]">
          <section className="rounded-[8px] p-6 shadow-lg ring-1 ring-black/10  dark:ring-white/5">
            <div className="flex flex-col items-center">
              <div className="relative">
                {session?.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="h-56 w-56 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 w-56 items-center justify-center rounded-full bg-gray-200 text-5xl font-semibold text-gray-900 dark:bg-[#0E0E1C] dark:text-gray-100">
                    {firstName?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}

                <button
                  type="button"
                  className="absolute bottom-2 left-2 inline-flex items-center gap-2 rounded-[8px] bg-white/90 px-3 py-2 text-sm text-gray-800 ring-1 ring-black/10 hover:bg-white dark:bg-[#12192b] dark:text-gray-200 dark:ring-white/10 dark:hover:bg-[#18223a] focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <span aria-hidden>✎</span>
                  Edit
                </button>
              </div>

              <p className="mt-6 text-center text-2xl font-semibold">
                {fullName || "Your name"}
              </p>
            </div>
          </section>

          <section className="space-y-8">
            <div className="rounded-[8px] shadow-lg ring-1 ring-black/10  dark:ring-white/5">
              <div className="border-b border-black/10 px-6 py-4 dark:border-white/10">
                <h2 className="text-lg font-semibold">Profile Information</h2>
              </div>

              <form className="px-6 py-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <label
                      htmlFor="firstName"
                      className="mb-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      First name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      defaultValue={firstName}
                      placeholder="Enter first name"
                      className="h-11 rounded-[8px] border dark:text-gray-500 border-black/10 px-3 outline-none placeholder:text-gray-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 dark:border-white/10"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="lastName"
                      className="mb-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      defaultValue={lastName}
                      placeholder="Enter last name"
                      className="h-11 rounded-[8px] border border-black/10 px-3 outline-none placeholder:text-gray-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 dark:border-white/10"
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    className="h-10 rounded-[8px] px-4 text-sm text-gray-700 ring-1 ring-black/10 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-gray-300 dark:ring-white/10 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 rounded-[8px] bg-teal-500 px-5 text-sm font-medium text-black hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-[8px] shadow-lg ring-1 ring-black/10  dark:ring-white/5">
              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <h3 className="text-base font-medium">Reset Password</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Generate a link to update your password.
                  </p>
                </div>
                <Link
                    href=""
                    className="inline-flex h-10 items-center justify-center rounded-[8px] bg-teal-500 px-5 text-sm font-medium text-black hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
                  >
                    Reset
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
