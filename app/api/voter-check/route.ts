import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ registered: false });

    const clean = email.toLowerCase().trim();
    const check =
      await sql`SELECT id FROM "VoterRegistry" WHERE email = ${clean}`;

    return NextResponse.json({ registered: check.length > 0 });
  } catch (e) {
    return NextResponse.json({ registered: false }, { status: 500 });
  }
}
