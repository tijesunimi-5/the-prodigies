import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { nanoid } from "nanoid";

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (status === "verified") {
      // 1. Generate unique QR Token (Long string)
      const accessCode = `PRD26-${nanoid(10).toUpperCase()}`;

      // 2. Generate 6-digit 2FA Passcode (For manual entry)
      const passcode = Math.floor(100000 + Math.random() * 900000).toString();

      await sql`
        UPDATE "Registration"
        SET status = ${status}, "accessCode" = ${accessCode}, passcode = ${passcode}
        WHERE id = ${id}
      `;

      return NextResponse.json({
        message: "Approved with QR and Passcode generated",
      });
    }

    // Standard decline logic
    await sql`UPDATE "Registration" SET status = ${status} WHERE id = ${id}`;
    return NextResponse.json({ message: "Status updated" });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
