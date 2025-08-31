export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-lg mr-3">
                <span className="font-bold text-sm">API</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Endora</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="w-64 bg-white shadow-sm h-screen" />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
