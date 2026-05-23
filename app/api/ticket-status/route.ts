import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Fetch tickets where the user is either the attendee OR the buyer who paid for the group
    const data = await sql`
      SELECT 
        id,
        "eventName" as event, 
        "fullName" as name, 
        email, 
        status, 
        "accessCode", 
        passcode,
        "buyerEmail"
      FROM "Registration" 
      WHERE email = ${cleanEmail} OR "buyerEmail" = ${cleanEmail}
      ORDER BY id ASC
    `;

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No tickets found" }, { status: 404 });
    }

    // Return the full array of tickets back to the client container
    return NextResponse.json(data);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
