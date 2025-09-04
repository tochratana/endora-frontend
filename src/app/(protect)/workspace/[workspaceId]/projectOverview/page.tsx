import ProjectOverview from "@/components/projectoverview/ProjectOverview";

interface PageProps {
  params: {
    workspaceId: string;
  };
}

export default function page({ params }: PageProps) {
  return (
    <section>
      <ProjectOverview projectUuid={params.workspaceId} />
    </section>
  );
}
