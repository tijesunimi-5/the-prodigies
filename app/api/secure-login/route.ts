import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

function sanitizeEmail(rawEmail: string): string {
  const parts = rawEmail.toLowerCase().trim().split("@");
  if (parts.length !== 2 || parts[1] !== "gmail.com") return "";

  const username = parts[0].split("+")[0];
  const trueUser = username.replace(/\./g, "");
  return `${trueUser}@gmail.com`;
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required." },
        { status: 400 },
      );
    }

    const cleanEmail = sanitizeEmail(email);
    if (!cleanEmail) {
      return NextResponse.json(
        { error: "Invalid Gmail formatting." },
        { status: 400 },
      );
    }

    // Scan if this email is a verified, pre-registered voter
    const userRow = await sql`
      SELECT "fullName" FROM "VoterRegistry" WHERE email = ${cleanEmail}
    `;

    if (userRow.length === 0) {
      return NextResponse.json(
        {
          error:
            "Access Denied: This email was not found in the registration roster.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json({
      success: true,
      name: userRow[0].fullName,
      email: cleanEmail,
    });
  } catch (error) {
    console.error("Secure login route failure:", error);
    return NextResponse.json(
      { error: "Internal authentication error." },
      { status: 500 },
    );
  }
}
