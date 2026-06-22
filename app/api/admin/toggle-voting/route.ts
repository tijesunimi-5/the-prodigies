import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { status } = await request.json(); // expect 'live' or 'paused'
    await sql`UPDATE "VotingConfig" SET "votingStatus" = ${status} WHERE id = 1`;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Toggle channel failed" },
      { status: 500 },
    );
  }
}
