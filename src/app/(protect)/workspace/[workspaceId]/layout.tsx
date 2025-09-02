import { Sidebar } from "@/components/layouts/WorkspaceSidebar";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  // Next's LayoutProps sometimes expects `params` to be a Promise; match that
  // constraint so the component satisfies Next's types.
  params?: Promise<{ workspaceId?: string | string[] }>;
}) {
  // Resolve params (await the Promise expected by Next's types)
  const resolvedParams = params ? await params : undefined;

  const workspaceIdRaw = resolvedParams?.workspaceId;
  const workspaceId = Array.isArray(workspaceIdRaw)
    ? workspaceIdRaw[0]
    : workspaceIdRaw;

  return (
    <div className="flex h-screen">
      {/* Sidebar pinned on the left */}
      <aside className="sticky h-[calc(100vh-3.5rem)]">
        <Sidebar workspaceId={workspaceId ?? ""} />
      </aside>

      {/* Main content area (scrollable) */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
