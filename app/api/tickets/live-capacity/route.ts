import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// FIXED: Define an explicit type interface to eliminate the 'any' linter flag
interface CapacityRow {
  eventName: string;
  hold_count: number;
}

export async function GET() {
  try {
    // Counts BOTH verified payments and pending submissions awaiting admin review
    const claimedSeats = (await sql`
      SELECT "eventName", COUNT(*)::int as hold_count
      FROM "Registration"
      WHERE status = 'verified' OR status = 'pending'
      GROUP BY "eventName"
    `) as CapacityRow[];

    const capacityMap: Record<string, number> = {};

    // FIXED: Typed cleanly as CapacityRow instead of any
    claimedSeats.forEach((row: CapacityRow) => {
      capacityMap[row.eventName] = row.hold_count;
    });

    return NextResponse.json(capacityMap);
  } catch (error) {
    console.error("Live capacity hold computation pipeline failed:", error);
    return NextResponse.json(
      { error: "Failed compiling capacity layout metrics." },
      { status: 500 },
    );
  }
}
