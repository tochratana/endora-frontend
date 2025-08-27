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
    <nav className="bg-slate-900 border-b border-slate-800 px-[100px] py-3 dark:bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <Image
              src="/logo.png"
              width={45}
              height={48}
              alt="logo"
              unoptimized
            />
          </div>
          <div className="w-1 h-7 bg-secondary-900 rounded-md"></div>
          <Boxes className="text-white dark:text-gray-900"/>
          <span className="text-white text-sm font-medium dark:text-gray-900">
            {session?.user?.name || "User"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-2 py-1 rounded-xs bg-transparent border-2 border-secondary-900 text-white hover:bg-teal-500 hover:text-white dark:text-gray-900">
            My API
          </button>
          <button className="px-2 py-1 rounded-xs bg-transparent border-2 border-secondary-900 text-white hover:bg-teal-500 hover:text-white dark:text-gray-900">
            Feedback
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative h-10 w-10 rounded-full p-0">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={50}
                    height={50}
                    unoptimized
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm text-gray-600">?</span>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 bg-slate-900 border-slate-700 text-white dark:bg-white dark:text-gray-900"
              align="end"
              forceMount
            >

              {/* Theme toggle */}
              <div className="flex items-center justify-between p-3">
                <div className="flex flex-col space-y-1 p-3">
                  <p className="text-sm font-medium leading-none text-white dark:text-gray-900">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-slate-400 dark:text-gray-700">
                    {session?.user?.email || "email"}
                  </p>
                </div>
                <Switch className="data-[state=checked]:bg-teal-500 data-[state=unchecked]:bg-indigo-900" />
              </div>

              <DropdownMenuSeparator className="bg-slate-700" />

              {/* Account settings */}
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 hover:text-teal-500 focus:text-teal-500 dark:text-gray-900 dark:hover:bg-gray-100">
                <Settings className="mr-2 h-4 w-4" />
                <Link href="/dashboard/profile">Account Setting</Link>
              </DropdownMenuItem>

              {/* Log out */}
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 hover:text-teal-500 focus:text-teal-500 dark:text-gray-900 dark:hover:bg-gray-100">
                <LogOut className="mr-2 h-4 w-4" />
                <button onClick={handleSignOut}>Sign out</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
