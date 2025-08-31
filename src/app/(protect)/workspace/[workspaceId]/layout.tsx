import { Sidebar } from "@/components/layouts/WorkspaceSidebar";

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar pinned on the left */}
      <aside className="sticky h-[calc(100vh-3.5rem)]">
        <Sidebar workspaceId={params.workspaceId} />
      </aside>

      {/* Main content area (scrollable) */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
