import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      eventName,
      amountPaid,
      couponUsed,
      receiptUrl,
    } = body;

    // 1. Check if user already exists using plain SQL
    const existing = await sql`
      SELECT id FROM "Registration" 
      WHERE email = ${email} AND "eventName" = ${eventName} 
      LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "You are already registered!" },
        { status: 400 },
      );
    }

    // 2. Insert the data
    await sql`
      INSERT INTO "Registration" ("fullName", email, phone, "eventName", "amountPaid", "couponUsed", "receiptUrl")
      VALUES (${fullName}, ${email}, ${phone}, ${eventName}, ${amountPaid}, ${couponUsed}, ${receiptUrl})
    `;

    return NextResponse.json(
      { message: "Registration Successful" },
      { status: 201 },
    );
  } catch (error: unknown) {
    // We check if the error is an object with a message property
    const errorMessage = error instanceof Error ? error.message : "Database connection failed";
    
    console.error("Database Error:", errorMessage);
    
    return NextResponse.json(
      { error: "Database connection failed", details: errorMessage }, 
      { status: 500 }
    );
  }
}
