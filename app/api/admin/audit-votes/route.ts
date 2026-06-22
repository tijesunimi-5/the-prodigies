import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    // 1. Fetch individual row-by-row logs to see exactly who voted for who
    const auditLogs = await sql`
      SELECT id, "voterEmail" as "buyerEmail", category, "nomineeName" 
      FROM "VerifiedVote" 
      ORDER BY id DESC
    `;

    // 2. Fetch aggregated live metrics to see exactly who is leading with exact counts
    const liveStandings = await sql`
      SELECT category, "nomineeName" as name, COUNT(*)::int as votes 
      FROM "VerifiedVote" 
      GROUP BY category, "nomineeName"
      ORDER BY votes DESC
    `;

    return NextResponse.json({
      logs: auditLogs,
      standings: liveStandings,
    });
  } catch (err) {
    console.error("Admin Audit Pipeline failure:", err);
    return NextResponse.json(
      { error: "Audit lines unreachable" },
      { status: 500 },
    );
  }
}
