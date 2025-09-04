import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function GET(req: Request) {
  const secret = process.env.NEXTAUTH_SECRET
  const jwt = await getToken({ req, secret })

  if (!jwt?.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const res = await fetch(`${process.env.API_BASE}/me`, {
    headers: { Authorization: `Bearer ${jwt.accessToken}` },
    // Avoid caching user-specific responses
    cache: "no-store",
  })

  const text = await res.text()
  return new NextResponse(text, { status: res.status })
}
