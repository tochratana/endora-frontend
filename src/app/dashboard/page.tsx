import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Dashboard - Endora",
  description: "Your Endora dashboard",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to your Dashboard!
          </h1>
          <div className="space-y-2 text-gray-600">
            <p>
              <strong>Name:</strong> {session?.user?.name}
            </p>
            <p>
              <strong>Email:</strong> {session?.user?.email}
            </p>
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-16 h-16 rounded-full mx-auto mt-4"
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Profile</h3>
          <p className="text-gray-600">Manage your account settings</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Security</h3>
          <p className="text-gray-600">Update your security preferences</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">API Keys</h3>
          <p className="text-gray-600">Manage your API access</p>
        </div>
      </div>
    </div>
  );
}
