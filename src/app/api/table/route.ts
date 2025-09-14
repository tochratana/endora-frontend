import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwt = await getToken({ req: req as any, secret });

  if (!jwt?.accessToken) {
    return new NextResponse("Unauthorized - No access token", { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const projectUuid = searchParams.get("projectUuid");

    if (!projectUuid) {
      return NextResponse.json(
        { error: "projectUuid query parameter is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { schemaName, schema } = body;

    // Validate required fields
    if (!schemaName || !schema) {
      return NextResponse.json(
        { error: "schemaName and schema are required" },
        { status: 400 }
      );
    }

    // Create the payload for the backend
    const payload = {
      schemaName,
      schema,
    };

    console.log("Creating schema for project:", projectUuid);
    console.log("Schema payload:", JSON.stringify(payload, null, 2));

    // Make request to backend API
    const response = await fetch(
      `${process.env.API_BASE}/projects/${projectUuid}/schema/tables`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt.accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("Backend response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Backend error:", errorText);
      return new NextResponse(errorText, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating schema:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
