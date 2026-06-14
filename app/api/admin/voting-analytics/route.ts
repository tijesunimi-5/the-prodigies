import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    // 1. Admin summary of nominations
    const nominationAnalytics = await sql`
      SELECT category, "nomineeName" as name, COUNT(*)::int as count, "isApproved"
      FROM "Nomination"
      GROUP BY category, "nomineeName", "isApproved"
      ORDER BY count DESC
    `;

    // 2. Admin summary of final votes
    const voteAnalytics = await sql`
      SELECT category, "nomineeName" as name, COUNT(*)::int as count
      FROM "Vote"
      GROUP BY category, "nomineeName"
      ORDER BY count DESC
    `;

    // 3. NEW: Raw Audit Log tracking exactly who nominated who
    const auditLogs = await sql`
      SELECT 
        id,
        category,
        "nomineeName" as nominee,
        "buyerEmail" as nominator,
        to_char("createdAt", 'DD Mon YYYY, HH:MI AM') as timestamp
      FROM "Nomination"
      ORDER BY "createdAt" DESC
    `;

    return NextResponse.json({
      nominations: nominationAnalytics,
      votes: voteAnalytics,
      auditLogs: auditLogs,
    });
  } catch (error) {
    console.error("Admin analytical pull error:", error);
    return NextResponse.json(
      { error: "Failed to compile analytical pools" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { nomineeName, category, approveStatus } = await request.json();

    if (!nomineeName || !category) {
      return NextResponse.json(
        { error: "Missing identity tags" },
        { status: 400 },
      );
    }

    await sql`
      UPDATE "Nomination"
      SET "isApproved" = ${approveStatus}
      WHERE "nomineeName" = ${nomineeName} AND category = ${category}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed updating shortlist flag" },
      { status: 500 },
    );
  }
}
