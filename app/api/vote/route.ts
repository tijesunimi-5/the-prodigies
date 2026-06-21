import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { category, nomineeName, voterEmail } = await request.json();

    if (!category || !nomineeName || !voterEmail) {
      return NextResponse.json(
        { error: "Missing required voting credentials." },
        { status: 400 }
      );
    }

    const cleanEmail = voterEmail.toLowerCase().trim();
    const cleanCategory = category.trim();

    // 1. STRICT ANTI-CHEAT GUARD: Check if this email already voted in this specific category
    const existingVote = await sql`
      SELECT id FROM "Vote" 
      WHERE LOWER("voterEmail") = ${cleanEmail} AND "category" = ${cleanCategory}
    `;

    if (existingVote.length > 0) {
      return NextResponse.json(
        { error: "You have already cast your ballot in this category!" },
        { status: 400 }
      );
    }

    // 2. Safe to log the vote if they haven't voted in this category yet
    await sql`
      INSERT INTO "Vote" ("category", "nomineeName", "voterEmail", "createdAt")
      VALUES (${cleanCategory}, ${nomineeName.trim()}, ${cleanEmail}, NOW())
    `;

    return NextResponse.json({ success: true, message: "Ballot logged successfully!" });
  } catch (error) {
    console.error("Critical voting submission pipeline failure:", error);
    return NextResponse.json(
      { error: "Internal server error logging ballot." },
      { status: 500 }
    );
  }
}
