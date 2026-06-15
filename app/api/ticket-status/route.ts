import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 },
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // FIXED: Ensured column identifiers mirror your actual Neon table definitions
    const data = await sql`
      SELECT 
        id,
        "eventName" as event, 
        "fullName" as name, 
        status, 
        "accessCode", 
        passcode,
        "buyerEmail"
      FROM "Registration" 
      WHERE LOWER("buyerEmail") = ${cleanEmail}
      ORDER BY id ASC
    `;

    // Instead of throwing a harsh 404 error (which can break client fetch loops),
    // it's cleaner to return an empty array [] if a student hasn't registered yet.
    if (!data || data.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(data);
  } catch (error) {
    // Satisfies strict ESLint rules by logging the error object explicitly
    console.error("Ticket status ledger sync error:", error);
    return NextResponse.json(
      { error: "Internal ticket status compilation failure." },
      { status: 500 },
    );
  }
}
