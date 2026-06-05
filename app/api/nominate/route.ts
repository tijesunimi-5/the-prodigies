import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// 1. GET ALL EXISTING NOMINATIONS FOR THE LOGGED-IN USER
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Authentication email required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Fetch what this specific user has already voted/nominated for
    const userNominations = await sql`
      SELECT category, "nomineeEmail", "nomineeName"
      FROM "Nomination"
      WHERE "buyerEmail" = ${cleanEmail}
    `;

    return NextResponse.json(userNominations);
  } catch (error) {
    console.error("Nomination fetch error:", error);
    return NextResponse.json({ error: "Failed to load nominations" }, { status: 500 });
  }
}

// 2. SUBMIT A NEW NOMINATION
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nomineeEmail, nomineeName, category, buyerEmail } = body;

    if (!nomineeEmail || !nomineeName || !category || !buyerEmail) {
      return NextResponse.json({ error: "Missing required attributes" }, { status: 400 });
    }

    const cleanBuyer = buyerEmail.toLowerCase().trim();
    const cleanNominee = nomineeEmail.toLowerCase().trim();

    // Insert nomination. If they already nominated for this category, the constraint catches it.
    await sql`
      INSERT INTO "Nomination" ("nomineeEmail", "nomineeName", category, "buyerEmail")
      VALUES (${cleanNominee}, ${nomineeName}, ${category}, ${cleanBuyer})
    `;

    return NextResponse.json({ message: "Nomination registered successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Nomination submission error:", error);
    
    // Check for Postgres Unique Constraint Violation (Error code 23505)
    if (error.code === "23505") {
      return NextResponse.json({ error: "You have already submitted a nomination for this award category!" }, { status: 400 });
    }

    return NextResponse.json({ error: "Nomination transaction pipeline failed" }, { status: 500 });
  }
}