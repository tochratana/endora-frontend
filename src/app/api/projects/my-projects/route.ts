import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwt = await getToken({ req: req as any, secret });

  if (!jwt?.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Get query parameters for pagination if needed
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || "10";
    const skip = searchParams.get("skip") || "0";

    const response = await fetch(
      `${process.env.API_BASE}/projects/my-projects?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${jwt.accessToken}`,
        },
        // Avoid caching user-specific responses
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      return new NextResponse(errorText, { status: response.status });
    }

    const projects = await response.json();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching my projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
