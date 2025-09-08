import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Development-only helper: returns what the server-side NextAuth `getToken` returns.
// Use this to verify that the server sees a valid access token when your client
// hits the proxy endpoints. Do NOT expose this in production.
export async function GET(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  // Keep the same cast used elsewhere in the repo for compatibility
  // getToken expects the raw request. This cast is safe in this dev-only helper.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwt = await getToken({ req: req as any, secret });

  if (!jwt) {
    return NextResponse.json(
      { ok: false, message: "no session token available on server" },
      { status: 401 }
    );
  }
  // Narrow the token into an indexable record to read claims without `any`.
  const jwtRecord = jwt as unknown as Record<string, unknown>;
  const accessToken =
    typeof jwtRecord["accessToken"] === "string"
      ? String(jwtRecord["accessToken"])
      : undefined;
  const refreshTokenExists = Boolean(jwtRecord["refreshToken"]);

  const accessTokenPreview = accessToken
    ? `${accessToken.slice(0, 12)}...${accessToken.slice(-12)}`
    : null;

  const body = {
    ok: true,
    hasAccessToken: Boolean(accessToken),
    accessTokenPreview,
    accessTokenLength: accessToken ? accessToken.length : 0,
    refreshTokenExists,
    // Expose other claims for debugging (avoid full raw tokens)
    expiresAt: jwtRecord["expiresAt"] ?? null,
    user: jwtRecord["user"] ?? null,
    // Only include the raw token object when running in development on the server
    raw: process.env.NODE_ENV === "development" ? jwtRecord : undefined,
  } as const;

  return NextResponse.json(body, { status: 200 });
}
