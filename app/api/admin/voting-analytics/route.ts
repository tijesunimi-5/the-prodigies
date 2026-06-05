import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    // 1. Fetch live aggregate counts for Phase 1 Nominations
    const nominationAnalytics = await sql`
      SELECT category, "nomineeName" as name, COUNT(*)::int as count
      FROM "Nomination"
      GROUP BY category, "nomineeName"
      ORDER BY category ASC, count DESC
    `;

    // 2. Fetch live aggregate counts for Phase 2 Votes
    const voteAnalytics = await sql`
      SELECT category, "nomineeName" as name, COUNT(*)::int as count
      FROM "Vote"
      GROUP BY category, "nomineeName"
      ORDER BY category ASC, count DESC
    `;

    return NextResponse.json({
      nominations: nominationAnalytics,
      votes: voteAnalytics
    });
  } catch (error) {
    console.error("Admin analytical pull error:", error);
    return NextResponse.json({ error: "Failed to compile analytical pools" }, { status: 500 });
  }
}