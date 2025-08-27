import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Redirect /auth to /auth/signin
  if (request.nextUrl.pathname === "/auth") {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Handle root path explicitly
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/:path*", "/dashboard/:path*"],
};
