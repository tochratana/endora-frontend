// app/api/table/[schemaName]/project/[projectUuid]/import/route.ts

// REQUIRED: Configuration to correctly parse the file upload
export const config = {
  api: {
    bodyParser: false, 
  },
};

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// 🔑 FIX: Define the required interface for path parameters
interface RouteParams {
  params: {
    schemaName: string;
    projectUuid: string;
  };
}

const API_BASE = process.env.API_BASE;

export async function POST(request: NextRequest, { params }: RouteParams) {
    
    try {
        const token = await getToken({ req: request });
        if (!token) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        // 🔑 Access parameters securely from the typed object
        const { schemaName, projectUuid } = params;
        
        // Use request.formData() to parse the incoming file and form data
        const formData = await request.formData(); 
        
        // 🔑 We assume the real backend is located at a separate API endpoint
        const backendResponse = await fetch(
            // Forward the file and metadata
            `${API_BASE}/projects/${projectUuid}/rest/import?schema=${schemaName}`,
            {
                method: "POST",
                // Headers are usually set automatically by the fetch API when passing FormData
                body: formData,
            }
        );

        if (!backendResponse.ok) {
            throw new Error(`Backend import error: ${backendResponse.status}`);
        }

        const result = await backendResponse.json();
        
        // Delay the response slightly to simulate network latency for better testing
        await new Promise(resolve => setTimeout(resolve, 500)); 

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error("File import proxy failed:", error);
        return NextResponse.json({ error: "File import failed at the server level" }, { status: 500 });
    }
}