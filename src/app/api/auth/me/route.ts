import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Session } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const s = session as Session & {
      provider?: string;
      user?: { id?: string };
    };

    const user = {
      id: s.user?.id,
      name: s.user?.name,
      email: s.user?.email,
      image: s.user?.image,
      provider: s.provider,
    };

    return NextResponse.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
