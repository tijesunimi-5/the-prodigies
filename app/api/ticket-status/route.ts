import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email)
    return NextResponse.json({ error: "Email required" }, { status: 400 });

  try {
    const data = await sql`
      SELECT "eventName" as event, "fullName" as name, email, status, "accessCode", passcode 
      FROM "Registration" 
      WHERE email = ${email} 
      LIMIT 1
    `;

    if (data.length === 0)
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
  }
}
