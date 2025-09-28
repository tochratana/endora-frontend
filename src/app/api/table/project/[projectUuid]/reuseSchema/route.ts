import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

//GET all schemas
export async function GET(
  req: NextRequest,
  context: { params: { projectUuid: string } }
) {
  const secret = process.env.NEXTAUTH_SECRET;
  const jwt = await getToken({ req, secret });

  if (!jwt?.accessToken) {
    console.warn("Unauthorized request: no access token");
    return new NextResponse("Unauthorized - No access token", { status: 401 });
  }

  try {
    const { projectUuid } = context.params;

    console.log("Fetching schemas for project:", projectUuid);

    const response = await fetch(
      `${process.env.API_BASE}/projects/${projectUuid}/schema/my-schemas`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upstream API error:", response.status, errorText);
      return new NextResponse(errorText, { status: response.status });
    }

    const result = await response.json();
    console.log("Fetched schemas:", JSON.stringify(result, null, 2));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching schemas:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

//import schema
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ projectUuid: string }> }
) {
  const secret = process.env.NEXTAUTH_SECRET;
  const jwt = await getToken({ req, secret });

  if (!jwt?.accessToken) {
    return new NextResponse("Unauthorized - No access token", { status: 401 });
  }

  try {
    const { projectUuid } = await context.params;
    const body = await req.json();

    const payload = {
      sourceProjectId: body.sourceProjectId,
      schemaName: body.schemaName,
    };

    console.log("Payload to backend:", JSON.stringify(payload, null, 2));

    const response = await fetch(
      `${process.env.API_BASE}/projects/${projectUuid}/schema/import`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt.accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
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
