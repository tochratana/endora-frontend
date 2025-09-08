import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwt = await getToken({ req: req as any, secret });

  if (!jwt?.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const reqBody = await req.json();

  const res = await fetch("https://api.api-ngin.oudom.dev/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.accessToken}`,
    },
    body: JSON.stringify(reqBody),
    // Do not cache authenticated responses
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    // Return a JSON error payload for better client-side debugging
    return NextResponse.json(
      { status: res.status, error: body },
      { status: res.status }
    );
  }

  return new NextResponse(isJson ? JSON.stringify(body) : String(body), {
    status: res.status,
    headers: { "content-type": contentType },
  });
}
