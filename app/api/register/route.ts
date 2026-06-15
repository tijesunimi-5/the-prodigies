import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const {
      attendees,
      buyerEmail,
      eventName,
      amountPaid,
      couponUsed,
      receiptUrl,
    } = await request.json();

    // Safety extractions
    const primaryName = attendees?.[0]?.name || "Unknown Guest";
    const primaryPhone = attendees?.[0]?.phone || "";

    // Grab the attendee's direct email to fix the NOT NULL constraint error!
    const attendeeEmail = (
      attendees?.[0]?.email ||
      buyerEmail ||
      "guest@prodigy.com"
    )
      .toLowerCase()
      .trim();

    const cleanBuyerEmail = (buyerEmail || attendeeEmail).toLowerCase().trim();
    const cleanEventName = eventName || "The Grand Dinner Night";
    const numericAmount = parseFloat(amountPaid) || 0;
    const stableReceiptUrl = receiptUrl || "";

    // 1. Coupon Validation Guard
    if (couponUsed) {
      try {
        const cleanCoupon = couponUsed.toUpperCase().trim();
        const couponCheck = await sql`
          SELECT status FROM "Coupon" WHERE code = ${cleanCoupon}
        `;
        if (couponCheck.length > 0 && couponCheck[0].status === "Used") {
          return NextResponse.json(
            { error: "This coupon code has already been claimed or redeemed." },
            { status: 400 },
          );
        }
      } catch (e) {
        console.error("Non-critical coupon validation check hitch:", e);
      }
    }

    // 2. FIXED INSERT: Added the mandatory "email" column to satisfy the NOT NULL constraint
    await sql`
      INSERT INTO "Registration" ("fullName", "email", "phone", "eventName", "amountPaid", "status", "receiptUrl", "buyerEmail")
      VALUES (${primaryName}, ${attendeeEmail}, ${primaryPhone}, ${cleanEventName}, ${numericAmount}, 'pending', ${stableReceiptUrl}, ${cleanBuyerEmail})
    `;

    // 3. SECURE BURN STEP: Flipped to 'Used' right here during checkout transaction execution
    if (couponUsed) {
      const cleanCoupon = couponUsed.toUpperCase().trim();
      try {
        await sql`
          UPDATE "Coupon"
          SET 
            status = 'Used',
            "usedBy" = ${cleanBuyerEmail},
            "usedAt" = NOW()
          WHERE code = ${cleanCoupon} AND status = 'Active'
        `;
      } catch (couponUpdateErr) {
        console.error("Coupon state flip hit an anomaly:", couponUpdateErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration endpoint critical failure details:", error);
    return NextResponse.json(
      { error: "Failed to process checkout transaction pipelines safely." },
      { status: 500 },
    );
  }
}
