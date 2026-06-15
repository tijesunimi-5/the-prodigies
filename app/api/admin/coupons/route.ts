import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// Helper function to generate randomized high-end unique crypto tokens
function generateCouponToken(): string {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous characters like 0, O, 1, I
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  // Standardized premium formatting mask
  return `PRDG-${result.slice(0, 4)}-${result.slice(4)}`;
}

export async function GET() {
  try {
    const couponLedger = await sql`
      SELECT 
        id,
        code,
        status,
        "usedBy",
        to_char("createdAt", 'DD Mon, HH:MI AM') as created,
        to_char("usedAt", 'DD Mon, HH:MI AM') as used
      FROM "Coupon"
      ORDER BY "createdAt" DESC
    `;
    return NextResponse.json(couponLedger);
  } catch (error) {
    console.error("Failed pulling coupon indices:", error);
    return NextResponse.json({ error: "Coupons offline" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { quantity } = await request.json();
    const count = parseInt(quantity, 10);

    if (isNaN(count) || count <= 0 || count > 50) {
      return NextResponse.json(
        { error: "Quantity batch must be between 1 and 50" },
        { status: 400 },
      );
    }

    const tokensToInsert: string[] = [];
    while (tokensToInsert.length < count) {
      const newToken = generateCouponToken();
      if (!tokensToInsert.includes(newToken)) {
        tokensToInsert.push(newToken);
      }
    }

    // Insert each generated code securely into your Neon database table
    for (const code of tokensToInsert) {
      await sql`
        INSERT INTO "Coupon" (code, status)
        VALUES (${code}, 'Active')
      `;
    }

    return NextResponse.json({ success: true, generatedCount: count });
  } catch (error) {
    console.error("Batch token generation crash:", error);
    return NextResponse.json(
      { error: "Failed creating code lines" },
      { status: 500 },
    );
  }
}
