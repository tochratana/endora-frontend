import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

interface RouteParams {
  params: {
    schemaName: string;
    projectUuid: string;
    userUuid: string;
    id: string;
  };
}

const API_BASE = process.env.API_BASE;
//PATCH

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { schemaName, projectUuid, userUuid, id } = params;
    const requestData = await request.json();

    if (!id || !requestData) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Adjust this URL to match your backend's update endpoint
    const backendResponse = await fetch(
      `${API_BASE}/projects/${projectUuid}/rest/${schemaName}/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.accessToken}`,
        },
        body: JSON.stringify(requestData),
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
    let errorMessage = "Failed to update record";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Backend update failed:", errorMessage);
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}

//DELETE
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { schemaName, projectUuid, userUuid, id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    try {
      const response = await fetch(
        `${API_BASE}/projects/${projectUuid}/rest/${schemaName}/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }

      // Add a success log to the terminal
      console.log(
        `[DELETE] successful: Record ${id} from schema '${schemaName}' was deleted.`
      );

      return new NextResponse(null, { status: 204 });
    } catch (err: unknown) {
      //
      let errorMessage = "Failed to delete record";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error("Backend delete failed:", errorMessage);
      return NextResponse.json(
        { error: "Failed to delete record" },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    let errorMessage = "Failed to delete data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Error deleting data:", errorMessage);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}
