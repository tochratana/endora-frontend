import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    // TODO: integrate with backend registration endpoint.
    // For now return the payload so front-end can continue during local testing.
    return NextResponse.json({ ok: true, data: body });
  } catch (err) {
    console.error("/api/auth/register error:", err);
    return NextResponse.json(
      { ok: false, message: "Registration failed" },
      { status: 500 }
    );
  }
}
