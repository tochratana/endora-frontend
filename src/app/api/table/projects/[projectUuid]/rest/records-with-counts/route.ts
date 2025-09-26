import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

interface RouteParams {
  params: {
    projectUuid: string;
  };
}

const API_BASE = process.env.API_BASE;

export async function GET(
  request: NextRequest,
  { params }: { params: { projectUuid: string } }
) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { projectUuid } = params;

    const backendResponse = await fetch(
      `${API_BASE}/projects/${projectUuid}/rest/records-with-counts`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      throw new Error(
        `Backend error: ${backendResponse.status} - ${errorText}`
      );
    }

    const result = await backendResponse.json();
    return NextResponse.json(result);
  } catch (error: unknown) {
    let errorMessage = "Failed to get project stats";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Backend stats fetch failed:", errorMessage);
    return NextResponse.json(
      { error: "Failed to get project stats" },
      { status: 500 }
    );
  }
}
