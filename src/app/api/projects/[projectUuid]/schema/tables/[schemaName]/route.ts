import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ projectUuid: string; schemaName: string }> }
) {
  const secret = process.env.NEXTAUTH_SECRET;
  const jwt = await getToken({ req: request, secret });

  if (!jwt?.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Await the params Promise and extract the specific properties
  const params = await context.params;
  const projectUuid = params.projectUuid;
  const schemaName = params.schemaName;

  const url = `${API_BASE}/api/v1/projects/${projectUuid}/schema/tables/${encodeURIComponent(
    schemaName
  )}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.accessToken}`,
    },
    cache: "no-store",
  });

  const bodyText = await res.text();
  try {
    const json = JSON.parse(bodyText);
    return NextResponse.json(json, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Bad upstream response", body: bodyText },
      { status: res.status }
    );
  }
}
