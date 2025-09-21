import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE; 
// e.g. http://localhost:8080 (without /api/v1)

export async function GET(
  req: Request,
  { params }: { params: { projectUuid: string; schemaName: string } }
) {
  const secret = process.env.NEXTAUTH_SECRET;
  const jwt = await getToken({ req: req as any, secret });

  if (!jwt?.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectUuid, schemaName } = params;
  const url = `${API_BASE}/api/v1/projects/${projectUuid}/schema/tables/${encodeURIComponent(
    schemaName
  )}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.accessToken}`, // include if backend expects token
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
