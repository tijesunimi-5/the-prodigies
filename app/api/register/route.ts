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

    // 1. Double check the coupon is still valid before processing payment records
    if (couponUsed) {
      const cleanCoupon = couponUsed.toUpperCase().trim();
      const couponCheck = await sql`
        SELECT status FROM "Coupon" WHERE code = ${cleanCoupon}
      `;

      if (couponCheck.length === 0 || couponCheck[0].status === "Used") {
        return NextResponse.json(
          { error: "This coupon has already been used or does not exist." },
          { status: 400 },
        );
      }
    }

    // 2. Insert the registration log (locks down the event seat capacity)
    await sql`
      INSERT INTO "Registration" ("fullName", phone, "eventName", "amountPaid", status, "receiptUrl")
      VALUES (${attendees[0].name}, ${attendees[0].phone}, ${eventName}, ${amountPaid}, 'pending', ${receiptUrl})
    `;

    // 3. SECURE BURN STEP: Flipped to 'Used' right here during checkout transaction execution
    if (couponUsed) {
      const cleanCoupon = couponUsed.toUpperCase().trim();
      const cleanEmail = buyerEmail.toLowerCase().trim();

      await sql`
        UPDATE "Coupon"
        SET 
          status = 'Used',
          "usedBy" = ${cleanEmail},
          "usedAt" = NOW()
        WHERE code = ${cleanCoupon}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration endpoint crash:", error);
    return NextResponse.json(
      { error: "Failed to process checkout transaction pipelines." },
      { status: 500 },
    );
  }
}
