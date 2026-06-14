import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    // Admin gets ALL nominees alongside their explicit approval states
    const nominationAnalytics = await sql`
      SELECT category, "nomineeName" as name, COUNT(*)::int as count, "isApproved"
      FROM "Nomination"
      GROUP BY category, "nomineeName", "isApproved"
      ORDER BY count DESC
    `;

    const voteAnalytics = await sql`
      SELECT category, "nomineeName" as name, COUNT(*)::int as count
      FROM "Vote"
      GROUP BY category, "nomineeName"
      ORDER BY count DESC
    `;

    return NextResponse.json({
      nominations: nominationAnalytics,
      votes: voteAnalytics,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Analytics pull error" },
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

    // Dynamic state updater to toggle shortlist availability row updates
    await sql`
      UPDATE "Nomination"
      SET "isApproved" = ${approveStatus}
      WHERE "nomineeName" = ${nomineeName} AND category = ${category}
    `;

    return NextResponse.json({
      success: true,
      message: "Nominee shortlist flag updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed updating shortlist flag" },
      { status: 500 },
    );
  }
}
