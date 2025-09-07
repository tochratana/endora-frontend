"use client";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Settings, LogOut, Boxes } from "lucide-react";

export default function UserHeader() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };
  return (
    <nav className="bg-white border-b border-slate-800 px-4 sm:px-6 md:px-8 lg:px-[100px] py-3 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center justify-center">
            <Image
              src="/logo-v3.png"
              width={35}
              height={38}
              alt="logo"
              unoptimized
              className="sm:w-[45px] sm:h-[48px]"
            />
          </div>
          <div className="w-1 h-5 sm:h-7 bg-secondary-900 rounded-md"></div>
          <Link href="/dashboard">
            <Boxes className="text-gray-900 dark:text-white w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white hidden sm:inline">
            {session?.user?.name || "User"}
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-3">
          <button className="px-1 sm:px-2 py-1 rounded-xs bg-transparent border-2 border-secondary-900 text-gray-900 hover:bg-teal-500 hover:text-white dark:text-white text-xs sm:text-sm">
            My API
          </button>
          <button className="px-1 sm:px-2 py-1 rounded-xs bg-transparent border-2 border-secondary-900 text-gray-900 hover:bg-teal-500 hover:text-white dark:text-white text-xs sm:text-sm">
            <span className="hidden sm:inline">Feedback</span>
            <span className="sm:hidden">Help</span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={50}
                    height={50}
                    unoptimized
                    className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
                  />
                ) : (
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs sm:text-sm text-gray-600">?</span>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 sm:w-64 bg-white border-slate-700 text-white dark:bg-slate-900 dark:text-white"
              align="end"
              forceMount
            >
              {/* Theme toggle */}
              <div className="flex items-center justify-between p-3">
                <div className="flex flex-col space-y-1 p-3">
                  <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-gray-700 dark:text-slate-400">
                    {session?.user?.email || "email"}
                  </p>
                </div>
                <Switch className="data-[state=checked]:bg-teal-500 data-[state=unchecked]:bg-indigo-900" />
              </div>

              <DropdownMenuSeparator className="bg-slate-700" />

              {/* Account settings */}
              <DropdownMenuItem className="cursor-pointer text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-teal-500 dark:text-white dark:hover:bg-slate-800 dark:focus:text-indigo-400">
                <Settings className="mr-2 h-4 w-4" />
                <Link href="/dashboard/profile">Account Setting</Link>
              </DropdownMenuItem>

              {/* Log out */}
              <DropdownMenuItem className="cursor-pointer text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-teal-500 dark:text-white dark:hover:bg-slate-800 dark:focus:text-indigo-400">
                <LogOut className="mr-2 h-4 w-4" />
                <button
                  onClick={async () => {
                    // Clear local session
                    await signOut({ redirect: false });
                    // Optional: also log out at Keycloak (SSO end-session)
                    window.location.href = "/api/auth/kc-logout";
                  }}
                  aria-label="Sign out"
                >
                  Sign out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
