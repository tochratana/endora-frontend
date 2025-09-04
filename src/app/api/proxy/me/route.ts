import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwt = await getToken({ req: req as any, secret });

  if (!jwt?.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const res = await fetch(`${process.env.API_BASE}/me`, {
    headers: { Authorization: `Bearer ${jwt.accessToken}` },
    // Avoid caching user-specific responses
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}
