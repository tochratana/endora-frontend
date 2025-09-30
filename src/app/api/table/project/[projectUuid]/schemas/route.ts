import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

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

    if (!projectUuid) {
      return NextResponse.json(
        { error: "projectUuid is required in the path" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { schemaName, schema, publicList, publicRead } = body;

    const payload = {
      schemaName,
      schema,
      publicList,
      publicRead,
    };

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
      console.log("Backend error:", errorText);
      console.log("Respose Error is : ", response);
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
