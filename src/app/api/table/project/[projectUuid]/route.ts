import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectUuid: string }> }
) {
  const secret = process.env.NEXTAUTH_SECRET;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwt = await getToken({ req: req as any, secret });

  if (!jwt?.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { projectUuid } = await params;

    console.log("Fetching schemas for project:", projectUuid);

    // Make request to backend API
    const response = await fetch(
      `${process.env.API_BASE}/table/project/${projectUuid}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt.accessToken}`,
        },
        cache: "no-store",
      }
    );

    console.log("Backend response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Backend error:", errorText);
      return new NextResponse(errorText, { status: response.status });
    }

    const schemas = await response.json();
    return NextResponse.json(schemas);
  } catch (error) {
    console.error("Error fetching schemas:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
