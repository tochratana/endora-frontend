import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectUuid: string }> } // <-- params is now a Promise
) {
  const secret = process.env.NEXTAUTH_SECRET;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwt = await getToken({ req: req as any, secret });

  if (!jwt?.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { projectUuid } = await params; // <-- await the params first, then destructure

    const response = await fetch(
      `${process.env.API_BASE}/projects/${projectUuid}/usage/current`,
      {
        headers: {
          Authorization: `Bearer ${jwt.accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      return new NextResponse(errorText, { status: response.status });
    }

    const projectOverview = await response.json();

    if (!projectOverview) {
      return new NextResponse("Project overview not found", { status: 404 });
    }

    return NextResponse.json(projectOverview);
  } catch (err) {
    console.error("Route error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
