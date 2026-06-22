import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET: Returns the remaining time variables to the front-end layout
export async function GET() {
  try {
    const config =
      await sql`SELECT "registrationStartedAt", "votingStatus" FROM "VotingConfig" WHERE id = 1`;

    if (config.length === 0 || !config[0].registrationStartedAt) {
      return NextResponse.json({
        status: "not_started",
        secondsLeft: 0,
        votingStatus: "paused",
        canVote: false,
      });
    }

    const startTime = new Date(config[0].registrationStartedAt).getTime();
    const now = Date.now();

    // 2 Hours in milliseconds = 7,200,000
    const twoHoursLeft = Math.max(
      0,
      Math.floor((startTime + 7200000 - now) / 1000),
    );

    // 30-minute lock window happens exactly 2 hours after start time (7,200,000 + 1,800,000 = 9,000,000)
    const voteOpenTime = startTime + 7200000 + 1800000;
    const canVote = now >= voteOpenTime && config[0].votingStatus === "live";

    // Grab live approved nominees and current standings to keep the charts feeding statistics cleanly
    const approvedNominees = await sql`
      SELECT category, "nomineeName" as name FROM "Nomination" WHERE "isApproved" = true GROUP BY category, "nomineeName"
    `;
    const voteTallies = await sql`
      SELECT category, "nomineeName" as name, COUNT(*)::int as votes FROM "VerifiedVote" GROUP BY category, "nomineeName"
    `;

    return NextResponse.json({
      status: twoHoursLeft > 0 ? "registration_open" : "registration_closed",
      secondsLeft: twoHoursLeft,
      canVote: canVote,
      votingStatus: config[0].votingStatus || "paused",
      voteCountdown: Math.max(0, Math.floor((voteOpenTime - now) / 1000)),
      nominees: approvedNominees,
      standings: voteTallies,
    });
  } catch (err) {
    console.error("Clock GET route failure details:", err);
    return NextResponse.json({ error: "Clock down" }, { status: 500 });
  }
}

// POST: Triggered by you in the Admin console to start the clock live
export async function POST() {
  try {
    // FIXED: Enclosed column names inside explicit double-quotes to ensure Neon maps it flawlessly
    await sql`
      UPDATE "VotingConfig" 
      SET "registrationStartedAt" = NOW() 
      WHERE id = 1
    `;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Clock POST route configuration write failure:", err);
    return NextResponse.json(
      { error: "Database rejected configuration timestamp write execution." },
      { status: 500 },
    );
  }
}
