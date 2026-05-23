import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

interface Attendee {
  name: string;
  email: string;
  phone: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      attendees,
      buyerEmail,
      eventName,
      amountPaid,
      couponUsed,
      receiptUrl,
    } = body;

    if (!attendees || attendees.length === 0 || !buyerEmail) {
      return NextResponse.json(
        { error: "Missing required registration package records." },
        { status: 400 },
      );
    }

    // Loop through each attendee to insert their personal unique row
    for (const attendee of attendees as Attendee[]) {
      // Prevent overlapping duplicate registration profiles for the same singular event
      const existingRecord = await sql`
        SELECT id FROM "Registration" 
        WHERE email = ${attendee.email} AND "eventName" = ${eventName} 
        LIMIT 1
      `;

      if (existingRecord.length > 0) {
        return NextResponse.json(
          {
            error: `Attendee with email ${attendee.email} is already registered for this event!`,
          },
          { status: 400 },
        );
      }

      // Insert individual row mapped to their personal email, but tracking the buyer identity
      await sql`
        INSERT INTO "Registration" 
          ("fullName", email, phone, "eventName", "amountPaid", "couponUsed", "receiptUrl", "buyerEmail", status)
        VALUES 
          (${attendee.name}, ${attendee.email}, ${attendee.phone}, ${eventName}, ${amountPaid}, ${couponUsed}, ${receiptUrl}, ${buyerEmail}, 'pending')
      `;
    }

    return NextResponse.json(
      { message: "All registrations queued successfully" },
      { status: 201 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Database pipeline exception";
    console.error("Group Insertion Error:", errorMessage);
    return NextResponse.json(
      { error: "Registration transaction failed", details: errorMessage },
      { status: 500 },
    );
  }
}
