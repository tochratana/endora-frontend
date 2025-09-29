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
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { schemaName, projectUuid } = params;

    // Parse incoming JSON body
    const jsonData = await request.json();

    console.log("Proxying request to backend:", {
      url: `${API_BASE}/projects/${projectUuid}/rest/tables/${schemaName}/data/insert-from-editor-plain`,
      dataType: typeof jsonData,
      isArray: Array.isArray(jsonData),
      dataLength: Array.isArray(jsonData) ? jsonData.length : 1,
      sampleData: Array.isArray(jsonData) ? jsonData[0] : jsonData,
    });

    // Forward the JSON to backend
    const backendResponse = await fetch(
      `${API_BASE}/projects/${projectUuid}/rest/tables/${schemaName}/data/insert-from-editor-plain`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.accessToken ?? token.sub ?? ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(`Backend error: ${backendResponse.status}`, errorText);

      return NextResponse.json(
        {
          error: "Backend import failed",
          details: errorText,
          status: backendResponse.status,
        },
        { status: backendResponse.status }
      );
    }

    const result = await backendResponse.json();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("File import proxy failed:", error);

    return NextResponse.json(
      {
        error: "Upload failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
