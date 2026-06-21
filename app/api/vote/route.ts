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

    // Loop through each submitted ballot category-by-category
    for (const [category, nominee] of Object.entries(ballots)) {
      if (!nominee) continue; // Skip if empty or skipped selection

      const cleanCategory = category.trim();
      const cleanNominee = (nominee as string).trim();

      try {
        // 1. STRICT ANTI-CHEAT CHECK: Look up if this buyerEmail already voted in this category
        const existingVote = await sql`
          SELECT id FROM "Vote" 
          WHERE LOWER("buyerEmail") = ${cleanEmail} AND category = ${cleanCategory}
        `;

        // 2. If they already voted in this category, skip inserting to prevent duplicate spamming
        if (existingVote.length > 0) {
          continue; 
        }

        // 3. Otherwise, safely log their vote point
        await sql`
          INSERT INTO "Vot" ("buyerEmail", category, "nomineeName")
          VALUES (${cleanEmail}, ${cleanCategory}, ${cleanNominee})
        `;
      } catch (err) {
        const postgresError = err as { code?: string };
        // Catch distinct pkey/unique constraints violations safely without breaking execution loops
        if (postgresError.code !== "23505") throw err;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST ballot submission failed:", error);
    return NextResponse.json(
      { error: "Failed to submit ballot lines" },
      { status: 500 },
    );
  }
}