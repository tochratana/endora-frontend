import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { Project } from "@/types/product";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectUuid: string }> }
) {
  const secret = process.env.NEXTAUTH_SECRET;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwt = await getToken({ req: req as any, secret });

  if (!jwt?.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { projectUuid } = await params;

    // Directly fetch the project by UUID
    const response = await fetch(
      `${process.env.API_BASE}/projects/${projectUuid}`,
      {
        headers: {
          Authorization: `Bearer ${jwt.accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      return new NextResponse(errorText, { status: response.status });
    }

    const project: Project = await response.json();

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
