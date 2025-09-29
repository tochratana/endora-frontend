import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { Project } from "@/types/product";

interface RouteParams {
  params: Promise<{ projectUuid: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const secret = process.env.NEXTAUTH_SECRET;
  // eslint-disable-next-line @typesjson-eslint/no-explicit-any
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

// PATCH endpoint for updating project
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const secret = process.env.NEXTAUTH_SECRET;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwt = await getToken({ req: req as any, secret });

  if (!jwt?.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { projectUuid } = await params;
    const body = await req.json();

    // Validate required fields
    if (!body.projectName) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    // Make request to backend API
    const response = await fetch(
      `${process.env.API_BASE}/projects/${projectUuid}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt.accessToken}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      return new NextResponse(errorText, { status: response.status });
    }

    const updatedProject = await response.json();
    return NextResponse.json(updatedProject, { status: response.status });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}