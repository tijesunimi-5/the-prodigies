import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, pin, name, isNewUser } = await request.json();
    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail || !pin) {
      return NextResponse.json({ error: "Missing identity attributes" }, { status: 400 });
    }

    // 1. Look inside the dedicated User table
    const userResult = await sql`
      SELECT "fullName", pin FROM "User" 
      WHERE email = ${cleanEmail} 
      LIMIT 1
    `;

    // 2. Handle Sign Up Workflow
    if (userResult.length === 0) {
      if (!isNewUser) {
        // Tell frontend to pop open the "Full Name" input field
        return NextResponse.json({ code: "USER_NOT_FOUND" }, { status: 404 });
      }

      if (!name) {
        return NextResponse.json({ error: "Name is required for registration" }, { status: 400 });
      }

      // FIX: Actually save the user to the database right now!
      const newUser = await sql`
        INSERT INTO "User" (email, "fullName", pin)
        VALUES (${cleanEmail}, ${name}, ${pin})
        RETURNING email, "fullName" as name
      `;

      return NextResponse.json({
        email: newUser[0].email,
        name: newUser[0].name,
        message: "Profile created securely in cloud"
      });
    }

    // 3. Handle Login Workflow
    const user = userResult[0];
    if (user.pin !== pin) {
      return NextResponse.json({ error: "Invalid Security Access PIN" }, { status: 401 });
    }

    return NextResponse.json({
      email: cleanEmail,
      name: user.fullName
    });

  } catch (error) {
    console.error("Auth System Error:", error);
    return NextResponse.json({ error: "Identity core connection failed" }, { status: 500 });
  }
}
