import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    // Public page only gets nominees officially verified and approved by the admin committee
    const approvedNominees = await sql`
      SELECT category, "nomineeName" as name
      FROM "Nomination"
      WHERE "isApproved" = true
      GROUP BY category, "nomineeName"
      ORDER BY "nomineeName" ASC
    `;

    const voteTallies = await sql`
      SELECT category, "nomineeName" as name, COUNT(*)::int as votes
      FROM "Vote"
      GROUP BY category, "nomineeName"
      ORDER BY votes DESC
    `;

    return NextResponse.json({
      nominees: approvedNominees,
      standings: voteTallies,
    });
  } catch (error) {
    // FIXED: Using the variable by logging it out prevents 'unused-vars' lint blocks
    console.error("GET vote compilation failed:", error);
    return NextResponse.json({ error: "Registry offline" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { buyerEmail, ballots } = await request.json();
    if (!buyerEmail || !ballots || Object.keys(ballots).length === 0) {
      return NextResponse.json(
        { error: "Incomplete ballot parameters" },
        { status: 400 },
      );
    }

    const cleanEmail = buyerEmail.toLowerCase().trim();

    for (const [category, nominee] of Object.entries(ballots)) {
      try {
        await sql`
          INSERT INTO "Vote" ("buyerEmail", category, "nomineeName")
          VALUES (${cleanEmail}, ${category}, ${nominee})
        `;
      } catch (err) {
        // FIXED: Safely type-cast the unknown database error object or check for property safely
        const postgresError = err as { code?: string };
        if (postgresError.code !== "23505") throw err;
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    // FIXED: Logging the error variable so it is used cleanly
    console.error("POST ballot submission failed:", error);
    return NextResponse.json(
      { error: "Failed to submit ballot lines" },
      { status: 500 },
    );
  }
}
