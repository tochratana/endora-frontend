import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

interface RelationshipPayload {
  foreignKeyColumn: string;
  referencedTable: string;
  referencedColumn: string;
  relationshipType: string;
  onDelete?: string;
  onUpdate?: string;
}

export async function POST(
  req: NextRequest,
  context: Promise<{ params: { projectUuid: string; schemaName: string } }>
) {
  const { projectUuid, schemaName } = (await context).params;

  try {
    const jwt = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!jwt?.accessToken) {
      return new NextResponse("Unauthorized - No access token", { status: 401 });
    }

    const body: RelationshipPayload = await req.json();

    const response = await fetch(
      `${process.env.API_BASE}/projects/${projectUuid}/schema/tables/${schemaName}/relationships`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt.accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    const responseBody = await response.text();

    if (!response.ok) {
      console.error("Backend error:", responseBody);
      return new NextResponse(responseBody, { status: response.status });
    }

    const result = JSON.parse(responseBody);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}