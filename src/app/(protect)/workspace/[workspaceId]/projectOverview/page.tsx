import ProjectOverview from "@/components/projectoverview/ProjectOverview";

interface PageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function page({ params }: PageProps) {
  const { workspaceId } = await params;
  return (
    <section>
      <ProjectOverview projectUuid={workspaceId} />
    </section>
  );
}
