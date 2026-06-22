import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { voterEmail, ballots } = await request.json();

    if (!voterEmail || !ballots || Object.keys(ballots).length === 0) {
      return NextResponse.json(
        { error: "Incomplete ballot parameters." },
        { status: 400 },
      );
    }

    const cleanEmail = voterEmail.toLowerCase().trim();

    // 1. TIME & STATUS GATE: Check if voting is authorized and active
    const config =
      await sql`SELECT "votingStatus" FROM "VotingConfig" WHERE id = 1`;
    if (config.length === 0 || config[0].votingStatus !== "live") {
      return NextResponse.json(
        {
          error:
            "Voting is currently paused or has not been activated by the Admin.",
        },
        { status: 403 },
      );
    }

    // 2. ELITE AUTH GATE: Cross-check against the newly created 2-hour registration pool
    const isRegistered =
      await sql`SELECT id FROM "VoterRegistry" WHERE email = ${cleanEmail}`;
    if (isRegistered.length === 0) {
      return NextResponse.json(
        {
          error:
            "Access Denied: You are not a registered voter for this session.",
        },
        { status: 403 },
      );
    }

    // 3. CAST BALLOTS: Process choices cleanly
    for (const [category, nominee] of Object.entries(ballots)) {
      if (!nominee) continue;

      const cleanCategory = category.trim();
      const cleanNominee = (nominee as string).trim();

      try {
        // Log into your new dedicated table
        await sql`
          INSERT INTO "VerifiedVote" ("voterEmail", category, "nomineeName")
          VALUES (${cleanEmail}, ${cleanCategory}, ${cleanNominee})
        `;
      } catch (dbErr: unknown) {
        // Narrow the unknown error to check postgres unique-violation code (23505)
        const isDbError = (err: unknown): err is { code?: string } =>
          typeof err === "object" && err !== null && "code" in err;

        // If they already voted in this category, unique constraints skip it automatically
        if (isDbError(dbErr) && dbErr.code === "23505") continue;
        throw dbErr;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Secure voting exception:", error);
    return NextResponse.json(
      { error: "Internal ballot processing error." },
      { status: 500 },
    );
  }
}
