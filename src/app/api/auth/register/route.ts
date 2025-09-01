import { NextRequest, NextResponse } from "next/server";
// import { registerSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received registration data:", {
      ...body,
      password: "[REDACTED]",
      confirmPassword: "[REDACTED]",
    });

    // Check if required environment variables are set
    if (
      !process.env.KEYCLOAK_ISSUER ||
      !process.env.KEYCLOAK_ID ||
      !process.env.KEYCLOAK_SECRET
    ) {
      console.error("Missing required environment variables");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0].message;
      console.error("Validation error:", errorMessage);
      return NextResponse.json(
        {
          message: errorMessage,
          errors: validationResult.error.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data;

    // Create user in Keycloak
    const keycloakAdminToken = await getKeycloakAdminToken();
    const keycloakUser = await createKeycloakUser(
      {
        username: email,
        email,
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" "),
        enabled: true,
        credentials: [
          {
            type: "password",
            value: password,
            temporary: false,
          },
        ],
      },
      keycloakAdminToken
    );

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: keycloakUser.id,
          name,
          email,
          provider: "credentials",
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: error.issues.map((issue: any) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getMasterRealmToken() {
  const tokenUrl = `${process.env.KEYCLOAK_ISSUER}/realms/master/protocol/openid-connect/token`;
  console.log("Getting master realm token from:", tokenUrl);

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "password",
        client_id: "admin-cli",
        username: process.env.KEYCLOAK_ADMIN || "admin",
        password: process.env.KEYCLOAK_ADMIN_PASSWORD || "admin",
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Failed to get master realm token:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      throw new Error(
        `Failed to get master realm token: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.access_token) {
      console.error("No access token in response:", data);
      throw new Error("No access token received from Keycloak");
    }

    console.log("Successfully obtained master realm token");
    return data.access_token;
  } catch (error) {
    console.error("Error getting master realm token:", error);
    throw error;
  }
}

async function getKeycloakAdminToken() {
  const tokenUrl = `${process.env.KEYCLOAK_ISSUER}/realms/endora_api/protocol/openid-connect/token`;
  console.log("Getting admin token from:", tokenUrl);

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.KEYCLOAK_ID!,
        client_secret: process.env.KEYCLOAK_SECRET!,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Failed to get admin token:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      throw new Error(
        `Failed to get admin token: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.access_token) {
      console.error("No access token in response:", data);
      throw new Error("No access token received from Keycloak");
    }

    console.log("Successfully obtained admin token");
    return data.access_token;
  } catch (error) {
    console.error("Error getting admin token:", error);
    throw error;
  }
}

async function createKeycloakUser(userData: any, adminToken: string) {
  console.log(
    "Creating Keycloak user with URL:",
    `${process.env.KEYCLOAK_ISSUER}/admin/realms/endora_api/users`
  );
  console.log("User data:", { ...userData, credentials: "[REDACTED]" });
  console.log("Admin token (first 10 chars):", adminToken.substring(0, 10));

  try {
    // Remove /realms/endora_api from the ISSUER URL for admin endpoints
    const baseUrl = process.env.KEYCLOAK_ISSUER!.replace(
      "/realms/endora_api",
      ""
    );
    const url = `${baseUrl}/admin/realms/endora_api/users`;
    console.log("Corrected URL:", url);

    // Try to get master realm token instead
    const masterRealmToken = await getMasterRealmToken();
    console.log(
      "Using master realm token (first 10 chars):",
      masterRealmToken.substring(0, 10)
    );

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${masterRealmToken}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Keycloak error response:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      throw new Error(
        `Failed to create user in Keycloak: ${response.status} ${response.statusText}`
      );
    }

    const location = response.headers.get("location");
    console.log("User created successfully, location header:", location);

    if (!location) {
      console.warn("No location header in response");
      // Try to get user ID from response body
      const responseBody = await response.json().catch(() => null);
      console.log("Response body:", responseBody);
      return { id: responseBody?.id || "unknown" };
    }

    const userId = location.split("/").pop();
    return { id: userId };
  } catch (error) {
    console.error("Error in createKeycloakUser:", error);
    throw error;
  }
}
