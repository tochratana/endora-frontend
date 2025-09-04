import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });
  const issuer = process.env.KEYCLOAK_ISSUER!;
  const postLogout = process.env.NEXTAUTH_URL!;

  // If we have an ID Token, call the OIDC end_session endpoint
  if (token?.idToken) {
    const url = new URL(`${issuer}/protocol/openid-connect/logout`);
    url.searchParams.set("id_token_hint", String(token.idToken));
    url.searchParams.set("post_logout_redirect_uri", postLogout);
    return NextResponse.redirect(url.toString(), { status: 302 });
  }

  // Fallback: just redirect home
  return NextResponse.redirect(postLogout, { status: 302 });
}
