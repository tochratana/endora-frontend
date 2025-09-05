import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

interface RouteParams {
  params: {
    schemaName: string;
    projectUuid: string;
    userUuid: string;
  };
}

// POST /api/table/[schemaName]/project/[projectUuid]/user/[userUuid]/data
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { schemaName, projectUuid, userUuid } = params;

    // Get the request body (data to insert)
    const requestData = await request.json();

    console.log("Insert data request:", {
      schemaName,
      projectUuid,
      userUuid,
      data: requestData,
    });

    // Validate required parameters
    if (!schemaName || !projectUuid || !userUuid) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: schemaName, projectUuid, or userUuid",
        },
        { status: 400 }
      );
    }

    // Validate request data
    if (!requestData || typeof requestData !== "object") {
      return NextResponse.json(
        { error: "Invalid data format. Expected JSON object." },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Validate the user has permission to insert data into this schema
    // 2. Validate the data against the schema structure
    // 3. Insert the data into your database
    // 4. Return the created record with ID

    // For now, we'll simulate a successful insertion
    const insertedRecord = {
      id: crypto.randomUUID(),
      ...requestData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: userUuid,
      schema_name: schemaName,
      project_uuid: projectUuid,
    };

    // Simulate API call to your backend
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/table/${schemaName}/project/${projectUuid}/user/${userUuid}/data`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token.accessToken}`,
    //   },
    //   body: JSON.stringify(requestData)
    // });

    // if (!response.ok) {
    //   const errorData = await response.text();
    //   console.error('Failed to insert data:', errorData);
    //   return NextResponse.json(
    //     { error: 'Failed to insert data into schema' },
    //     { status: response.status }
    //   );
    // }

    // const result = await response.json();

    console.log("Data inserted successfully:", insertedRecord);

    return NextResponse.json({
      success: true,
      message: "Data inserted successfully",
      data: insertedRecord,
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json(
      { error: "Failed to insert data" },
      { status: 500 }
    );
  }
}

// GET /api/table/[schemaName]/project/[projectUuid]/user/[userUuid]/data
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { schemaName, projectUuid, userUuid } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    console.log("Get data request:", {
      schemaName,
      projectUuid,
      userUuid,
      page,
      limit,
      offset,
    });

    // Validate required parameters
    if (!schemaName || !projectUuid || !userUuid) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: schemaName, projectUuid, or userUuid",
        },
        { status: 400 }
      );
    }

    // Simulate fetching data from your backend
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/table/${schemaName}/project/${projectUuid}/user/${userUuid}/data?page=${page}&limit=${limit}`,
    //   {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${token.accessToken}`,
    //     }
    //   }
    // );

    // if (!response.ok) {
    //   const errorData = await response.text();
    //   console.error('Failed to fetch data:', errorData);
    //   return NextResponse.json(
    //     { error: 'Failed to fetch data from schema' },
    //     { status: response.status }
    //   );
    // }

    // const result = await response.json();

    // For now, return mock data
    const mockData = {
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
        {
          id: "2",
          name: "Sample Product 2",
          price: 49.99,
          created_at: "2024-01-16T14:20:00Z",
          updated_at: "2024-01-16T14:20:00Z",
          created_by: userUuid,
          schema_name: schemaName,
          project_uuid: projectUuid,
        },
      ],
      pagination: {
        page,
        limit,
        total: 2,
        totalPages: 1,
      },
      schema: schemaName,
      project: projectUuid,
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
