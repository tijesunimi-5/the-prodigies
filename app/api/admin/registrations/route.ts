import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    // Fetching all registrations from the SQL table
    const data = await sql`
      SELECT * FROM "Registration" 
      ORDER BY "createdAt" DESC
    `;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch registry" },
      { status: 500 },
    );
  }
}
