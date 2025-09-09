import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { CreateProjectRequest } from "@/types/product";

export async function POST(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwt = await getToken({ req: req as any, secret });

  console.log("JWT token:", jwt ? "exists" : "null");
  console.log("Access token:", jwt?.accessToken ? "exists" : "null");

  if (!jwt?.accessToken) {
    return new NextResponse("Unauthorized - No access token", { status: 401 });
  }

  try {
    const body: CreateProjectRequest = await req.json();

    // Validate required fields
    if (!body.projectName || !body.description) {
      return NextResponse.json(
        { error: "Project name and description are required" },
        { status: 400 }
      );
    }

    // Create project data
    const projectData = {
      projectName: body.projectName,
      description: body.description,
    };

    // Make request to backend API
    console.log("Making request to:", `${process.env.API_BASE}/projects`);
    console.log(
      "With token:",
      typeof jwt.accessToken === "string"
        ? jwt.accessToken.substring(0, 20) + "..."
        : jwt.accessToken
    );

    const response = await fetch(`${process.env.API_BASE}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt.accessToken}`,
      },
      body: JSON.stringify(projectData),
    });

    console.log("Backend response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Backend error:", errorText);
      return new NextResponse(errorText, { status: response.status });
    }

    const createdProject = await response.json();
    return NextResponse.json(createdProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwt = await getToken({ req: req as any, secret });

  if (!jwt?.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Get query parameters for pagination
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || "10";
    const skip = searchParams.get("skip") || "0";

    const response = await fetch(
      `${process.env.API_BASE}/projects?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${jwt.accessToken}`,
        },
        // Avoid caching user-specific responses
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new NextResponse(errorText, { status: response.status });
    }

    const projects = await response.json();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
