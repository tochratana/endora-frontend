"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { LogOut, User } from "lucide-react";

export default function DashboardNav() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {/* <Image
            src="/EndoraTransparent.png"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          /> */}
          <span className="ml-3 text-xl font-semibold text-gray-800 dark:text-white">
            Dashboard
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {/* {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <User className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            )} */}
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              {session?.user?.name || "User"}
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 dark:text-gray-200 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
