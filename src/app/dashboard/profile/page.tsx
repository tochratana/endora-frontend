import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Profile - Endora",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Profile Information
          </h2>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center space-x-4">
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-20 h-20 rounded-full"
              />
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {session?.user?.name}
              </h3>
              <p className="text-gray-600">{session?.user?.email}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {session?.user?.name || "Not provided"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {session?.user?.email}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Account created
                </dt>
                <dd className="mt-1 text-sm text-gray-900">Recently</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Last sign in
                </dt>
                <dd className="mt-1 text-sm text-gray-900">Just now</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
