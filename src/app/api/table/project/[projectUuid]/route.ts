import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// GET schemas
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ projectUuid: string }> }
) {
  const secret = process.env.NEXTAUTH_SECRET;
  const jwt = await getToken({ req, secret });

  if (!jwt?.accessToken) {
    return new NextResponse("Unauthorized - No access token", { status: 401 });
  }

  try {
    // await params
    const { projectUuid } = await context.params;

    const response = await fetch(
      `${process.env.API_BASE}/projects/${projectUuid}/schema/tables`,
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
      return new NextResponse(errorText, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching schemas:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST schema
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
      schemaName: body.schemaName,
      publicList: body.publicList ?? true,
      publicRead: body.publicRead ?? true,
      schema: body.schema,
    };

    const payload2 = {
      schemaName: "club1",
      publicList: true,
      publicRead: true,
      schema: {
        name: "varchar(200)",
        country: "varchar(200)",
      },
    };
    console.log("Payload to backend:", JSON.stringify(payload2, null, 2));

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