import UserHeader from "@/components/layouts/UserHeader";
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

  // return (
  //   <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
  //     <UserHeader />
  //     {/* Sidebar pinned on the left */}
  //     <div className="flex sticky">
  //       <aside>
  //         <Sidebar workspaceId={workspaceId ?? ""} />
  //       </aside>

  //       {/* Main content area (scrollable) */}
  //       <main className="flex-1">{children}</main>
  //     </div>
  //   </div>
  // );
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sticky top header */}
      <header
        className="sticky top-0 z-50 border-b border-gray-200/60 dark:border-gray-800/60
                       bg-gray-100/90 dark:bg-gray-900/90 backdrop-blur"
      >
        {/* Give the header a known height so the sidebar can offset correctly */}
        <div className="h-10 lg:h-16">
          <UserHeader />
        </div>
      </header>

      {/* Content row */}
      <div className="flex">
        {/* Sticky left sidebar (offset by header height) - hidden on mobile since sidebar is fixed */}
        <aside
          className="hidden md:block sticky top-14 lg:top-16 h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4rem)]
                   shrink-0 overflow-y-auto border-r border-gray-200 dark:border-gray-800
                   bg-gray-50 dark:bg-gray-950"
        >
          <Sidebar workspaceId={workspaceId ?? ""} headerOffsetPx={64} />
        </aside>

        {/* Main content with mobile padding to account for fixed sidebar */}
        <main className="flex-1 min-w-0 pl-14 md:pl-0">{children}</main>
      </div>

      {/* Mobile sidebar - fixed positioned */}
      <div className="md:hidden">
        <Sidebar workspaceId={workspaceId ?? ""} headerOffsetPx={48} />
      </div>
    </div>
  );
}
