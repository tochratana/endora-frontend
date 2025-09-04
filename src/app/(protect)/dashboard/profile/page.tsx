// ./src/app/dashboard/profile/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SaveButton } from "./SaveButton";
import { ResetButton } from "./ResetButton";
import { updateProfile, requestPasswordReset } from "./actions";

// Optional: SEO
export const metadata = {
  title: "Account settings — Endora",
};

// Helper: split name into first/last
function splitName(fullName: string) {
  if (!fullName?.trim()) return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  const fullName = session?.user?.name ?? "";
  const { firstName, lastName } = splitName(fullName);
  const avatarInitial = firstName?.[0]?.toUpperCase() || "?";

  return (
    <div className="min-h-screen text-gray-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 hover:text-gray-900 text-gray-700"
          >
            <span aria-hidden>←</span>
            <span>Back to dashboard</span>
          </Link>
        </div>

        <h1 className="mb-8 text-2xl font-semibold tracking-tight dark:text-white text-[#0E0E1C]">
          Account settings
        </h1>

        <div className="grid gap-8 md:grid-cols-[320px,1fr]">
          <section className="rounded-[4px] p-6 shadow-md border-1 dark:ring-white/5">
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
                  <div className="flex h-56 w-56 items-center justify-center rounded-full bg-[#0E0E1C] text-5xl font-semibold">
                    {avatarInitial}
                  </div>
                )}

                <label
                  htmlFor="avatarUpload"
                  className="absolute bottom-2 left-2 inline-flex cursor-pointer items-center gap-2 rounded-[4px] bg-[#12192b] px-3 py-2 text-sm text-gray-200 ring-1 ring-white/10 hover:bg-[#18223a] focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <span aria-hidden>✎</span>
                  Edit
                </label>
                <input
                  id="avatarUpload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                />
              </div>

              <p className="mt-6 text-center text-2xl font-semibold dark:text-white text-[#0E0E1C]">
                {fullName || "Your name"}
              </p>
            </div>
          </section>

          <section className="space-y-8 ">
            <div className="rounded-[4px] shadow-md border-1 ring-white/5">
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="text-lg font-semibold">Profile Information</h2>
              </div>

              <form className="px-6 py-6" action={updateProfile}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <label
                      htmlFor="firstName"
                      className="mb-2 text-sm dark:text-gray-400 text-[#0E0E1C]"
                    >
                      First name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      defaultValue={firstName}
                      placeholder="Enter first name"
                      autoComplete="given-name"
                      className="h-11 rounded-[4px] border dark:border-white/10 border-gray-400 px-3 dark:text-gray-100 text-gray-600 outline-none placeholder:text-gray-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="lastName"
                      className="mb-2 text-sm dark:text-gray-400 text-[#0E0E1C]"
                    >
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      defaultValue={lastName}
                      placeholder="Enter last name"
                      autoComplete="family-name"
                      className="h-11 rounded-[4px] border dark:border-white/10 border-gray-400 px-3 dark:text-gray-100 text-gray-600 outline-none placeholder:text-gray-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                  <button
                    type="reset"
                    className="h-7 rounded-[4px] px-3 text-sm dark:text-gray-300 text-[#0E0E1C] ring-1 dark:ring-white/10 ring-[#0E0E1C] hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    Cancel
                  </button>
                  <SaveButton />
                </div>
              </form>
            </div>

            <div className="rounded-[4px] shadow-md border-1 ring-white/5">
              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <h3 className="text-base font-medium dark:text-white text-[#0E0E1C]">Reset Password</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Generate a link to update your password.
                  </p>
                </div>
                <form action={requestPasswordReset}>
                  <ResetButton />
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}