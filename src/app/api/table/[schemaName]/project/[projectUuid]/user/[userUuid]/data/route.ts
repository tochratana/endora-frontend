// /api/table/[schemaName]/project/[projectUuid]/user/[userUuid]/data
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

interface RouteParams {
  params: Promise<{
    schemaName: string;
    projectUuid: string;
    userUuid: string;
  }>;
}

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = process.env.API_BASE;

// POST
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { schemaName, projectUuid, userUuid } = await params;
    const requestData = await request.json();

    if (!schemaName || !projectUuid || !userUuid) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: schemaName, projectUuid, or userUuid",
        },
        { status: 400 }
      );
    }

    try {
      // Real backend request
      const response = await fetch(
        //   `${API_BASE}/table/${schemaName}/project/${projectUuid}/user/${userUuid}/data`,
        `${API_BASE}/projects/${projectUuid}/rest/${schemaName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.accessToken}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const result = await response.json();
      return NextResponse.json(result);
    } catch (err) {
      console.error("Backend insert failed, using fallback:", err);

      // Fallback mock response
      const insertedRecord = {
        id: crypto.randomUUID(),
        ...requestData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: userUuid,
        schema_name: schemaName,
        project_uuid: projectUuid,
      };

      return NextResponse.json({
        success: true,
        message: "Data inserted (mock mode)",
        data: insertedRecord,
      });
    }
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json(
      { error: "Failed to insert data" },
      { status: 500 }
    );
  }
}

// GET 
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { schemaName, projectUuid, userUuid } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    try {
      // Real backend request
      // const url = `${API_BASE}/projects/${projectUuid}/rest/${schemaName}?page=${page}&limit=${limit}`;
      // console.log(`[ GET ] Fetching from backend: ${url}`);

      const response = await fetch(
        `${API_BASE}/projects/${projectUuid}/rest/mirror/${schemaName}?page=${page}&limit=${limit}`,

        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const result = await response.json();
      console.log("[ GET ] Fetched real data:", result);

      return NextResponse.json(result);
    } catch (err) {
      console.error("Backend fetch failed, using fallback:", err);

      // Fallback mock response
      return NextResponse.json({
        data: [
          {
            id: "1",
            name: "Sample Product 1",
            price: 29.99,
            created_at: "2024-01-15T10:30:00Z",
            updated_at: "2024-01-15T10:30:00Z",
            created_by: userUuid,
            schema_name: schemaName,
            project_uuid: projectUuid,
          },
        ],
        pagination: {
          page,
          limit,
          total: 1,
          totalPages: 1,
        },
        schema: schemaName,
        project: projectUuid,
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);

    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}






