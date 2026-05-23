import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    if (!search || search.trim().length < 3) {
      return NextResponse.json([]);
    }

    const queryTerm = `%${search.trim()}%`;

    const matches = await sql`
      SELECT "fullName" as name, email, "eventName" as event, status, "accessCode"
      FROM "Registration"
      WHERE "fullName" ILIKE ${queryTerm} OR email ILIKE ${queryTerm}
      ORDER BY "fullName" ASC
      LIMIT 10
    `;

    return NextResponse.json(matches);
  } catch (error) {
    console.error("GET Lookup Error:", error);
    return NextResponse.json(
      { error: "Failed to search registry" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { accessCode } = await request.json();

    if (!accessCode) {
      return NextResponse.json(
        { error: "No scanner token detected" },
        { status: 400 },
      );
    }

    // 1. Look up ticket details matching the scanned code token
    const ticketResult = await sql`
      SELECT id, "fullName", "eventName", status 
      FROM "Registration" 
      WHERE "accessCode" = ${accessCode} 
      LIMIT 1
    `;

    if (ticketResult.length === 0) {
      return NextResponse.json(
        { status: "invalid", error: "Ticket token not found in registry." },
        { status: 404 },
      );
    }

    const attendee = ticketResult[0];

    // 2. State Controller Evaluation Matrix
    if (attendee.status === "pending") {
      return NextResponse.json(
        {
          status: "pending",
          name: attendee.fullName,
          error: "Ticket payment is still awaiting financial verification.",
        },
        { status: 400 },
      );
    }

    if (attendee.status === "checked_in") {
      return NextResponse.json(
        {
          status: "fraud",
          name: attendee.fullName,
          error:
            "FRAUD WARNING: This ticket has already checked into the venue!",
        },
        { status: 409 },
      );
    }

    // 3. Success Workflow: Mark them inside the venue hall
    await sql`
      UPDATE "Registration" 
      SET status = 'checked_in' 
      WHERE "accessCode" = ${accessCode}
    `;

    return NextResponse.json({
      status: "success",
      name: attendee.fullName,
      event: attendee.eventName,
    });
  } catch (error) {
    console.error("Scanning infrastructure fault:", error);
    return NextResponse.json(
      { error: "Server gate controller failed" },
      { status: 500 },
    );
  }
}
