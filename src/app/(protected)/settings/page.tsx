export const metadata = {
  title: "Settings - Endora",
};

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
          <p className="text-gray-600">
            Manage your account preferences and settings.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
          <p className="text-gray-600">
            Update your security and privacy settings.
          </p>
        </div>
      </div>
    </div>
  );
}
