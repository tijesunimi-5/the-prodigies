import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    // 1. Fetch real-time nominees from the Nomination table grouped by category
    // This looks at who people nominated during Phase 1
    const nomineesList = await sql`
      SELECT category, "nomineeName" as name, COUNT(*)::int as nomination_count
      FROM "Nomination"
      GROUP BY category, "nomineeName"
      ORDER BY category ASC, nomination_count DESC
    `;

    // 2. Fetch running vote tallies for the leaderboard
    const voteTallies = await sql`
      SELECT category, "nomineeName" as name, COUNT(*)::int as votes
      FROM "Vote"
      GROUP BY category, "nomineeName"
      ORDER BY votes DESC
    `;

    return NextResponse.json({
      nominees: nomineesList,
      standings: voteTallies
    });
  } catch (error) {
    console.error("Failed to load voting data matrix:", error);
    return NextResponse.json({ error: "Voting registry offline" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { buyerEmail, ballots } = await request.json(); // Expected format: { buyerEmail: "...", ballots: { most_active: "Amos Daniel Eniola" } }

    if (!buyerEmail || !ballots || Object.keys(ballots).length === 0) {
      return NextResponse.json({ error: "Incomplete ballot parameters" }, { status: 400 });
    }

    const cleanEmail = buyerEmail.toLowerCase().trim();

    // Loop through the cast votes and securely save them
    for (const [category, nominee] of Object.entries(ballots)) {
      try {
        await sql`
          INSERT INTO "Vote" ("buyerEmail", category, "nomineeName")
          VALUES (${cleanEmail}, ${category}, ${nominee})
        `;
      } catch (err: any) {
        // Unique constraint code 23505 catches duplicate votes per category safely
        if (err.code !== "23505") throw err;
      }
    }

    return NextResponse.json({ success: true, message: "Ballot cast successfully!" });
  } catch (error) {
    console.error("Ballot submission error:", error);
    return NextResponse.json({ error: "Failed to submit ballot lines" }, { status: 500 });
  }
}