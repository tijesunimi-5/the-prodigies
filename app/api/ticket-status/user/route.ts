import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import crypto from "crypto";

function sanitizeEmail(rawEmail: string): string {
  const parts = rawEmail.toLowerCase().trim().split("@");
  if (parts.length !== 2) return "";
  const username = parts[0].split("+")[0];
  const trueUser = username.replace(/\./g, "");
  return `${trueUser}@${parts[1]}`;
}

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 },
      );
    }

    const cleanEmail = sanitizeEmail(email);
    if (!cleanEmail) {
      return NextResponse.json(
        { error: "Invalid email formatting." },
        { status: 400 },
      );
    }

    // Generate unique codes matching your database format (e.g. PRD26-X89ABC & 6-digit passcode)
    const accessCode = `PRD26-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const passcode = Math.floor(100000 + Math.random() * 900000).toString();

    // Insert directly into your 'registration' table as verified
    await sql`
      INSERT INTO "Registration" (
        "fullName", 
        "email", 
        "buyerEmail", 
        "phone", 
        "eventName", 
        "amountPaid", 
        "status", 
        "accessCode", 
        "passcode", 
        "receiptUrl"
      )
      VALUES (
        ${name.trim()}, 
        ${cleanEmail}, 
        ${cleanEmail}, 
        '', 
        'The Grand Dinner Night', 
        4000, 
        'verified', 
        ${accessCode}, 
        ${passcode}, 
        ''
      )
    `;

    return NextResponse.json({
      success: true,
      ticket: {
        code: accessCode,
        passCode: passcode,
        email: cleanEmail,
        name: name.trim(),
      },
    });
  } catch (error) {
    console.error("Failed to issue ticket:", error);
    return NextResponse.json(
      { error: "Database error issuing ticket." },
      { status: 500 },
    );
  }
}
