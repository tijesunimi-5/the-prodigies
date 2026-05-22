import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, pin, name, isNewUser } = await request.json();

    if (!email || !pin) {
      return NextResponse.json(
        { error: "Missing identity attributes" },
        { status: 400 },
      );
    }

    // 1. Search if an entry under this email exists in the database
    const userResult = await sql`
      SELECT "fullName", "accountPin" FROM "Registration" 
      WHERE email = ${email} 
      LIMIT 1
    `;

    // 2. Handle completely new registration profile setup
    if (userResult.length === 0) {
      if (!isNewUser) {
        // Send explicit flag to frontend to trigger name setup workflow
        return NextResponse.json({ code: "USER_NOT_FOUND" }, { status: 404 });
      }

      // If user inputs their name and pin for the first time, create their core system pass
      // We temporarily save an empty verification shell that populates on payment
      return NextResponse.json(
        { email, name, status: "initialized" },
        { status: 200 },
      );
    }

    // 3. Handle Existing User Verification
    const registeredUser = userResult[0];

    // If they already have a ticket but haven't initialized an account PIN, bind this one as their pass
    if (!registeredUser.accountPin) {
      await sql`
        UPDATE "Registration" 
        SET "accountPin" = ${pin} 
        WHERE email = ${email}
      `;
      return NextResponse.json({ email, name: registeredUser.fullName });
    }

    // If they have a PIN, evaluate it securely
    if (registeredUser.accountPin !== pin) {
      return NextResponse.json(
        { error: "Invalid Security Access PIN" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      email,
      name: registeredUser.fullName,
    });
  } catch (error) {
    console.error("Auth System Error:", error);
    return NextResponse.json(
      { error: "Identity core connection failed" },
      { status: 500 },
    );
  }
}
