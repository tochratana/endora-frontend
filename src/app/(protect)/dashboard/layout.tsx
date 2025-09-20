import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserHeader from "@/components/layouts/UserHeader";
import { Toaster } from "@/components/ui/sonner"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <UserHeader />
      <div className="flex">
        {/* <Sidebar /> */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
