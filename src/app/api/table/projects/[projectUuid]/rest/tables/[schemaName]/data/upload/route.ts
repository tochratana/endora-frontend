import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

interface RouteParams {
  params: {
    schemaName: string;
    projectUuid: string;
  };
}

const API_BASE = process.env.API_BASE as string;

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify JWT from NextAuth
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { schemaName, projectUuid } = params;

    // Parse incoming FormData
    const formData = await request.formData();

    // Forward the upload to backend
    const backendResponse = await fetch(
      `${API_BASE}/projects/${projectUuid}/rest/tables/${schemaName}/data/upload`,
      {
        method: "POST",
        headers: {
          // Forward token if backend needs it
          Authorization: `Bearer ${token.accessToken ?? token.sub ?? ""}`,
        },
        body: formData,
      }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      throw new Error(`Backend import error: ${backendResponse.status} - ${errorText}`);
    }

    const result = await backendResponse.json();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("File import proxy failed:", error);
    return NextResponse.json(
      { error: "File import failed at the server level" },
      { status: 500 }
    );
  }
}
