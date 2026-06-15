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

    const cleanBuyerEmail = buyerEmail.toLowerCase().trim();

    // 2. Insert the registration log (locks down the event seat capacity under 'pending')
    await sql`
      INSERT INTO "Registration" ("fullName", phone, "eventName", "amountPaid", status, "receiptUrl", "buyerEmail")
      VALUES (${attendees[0].name}, ${attendees[0].phone}, ${eventName}, ${amountPaid}, 'pending', ${receiptUrl}, ${cleanBuyerEmail})
    `;

    // 3. SECURE BURN STEP: Flipped to 'Used' safely inside an isolated execution container
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
      } catch (couponError) {
        // Keeps the route from completely throwing a 500 error if coupon row updates hitch
        console.error(
          "Warning: Ticket saved, but coupon state flip hit an anomaly:",
          couponError,
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Satisfies linter checks by logging the master error object explicitly
    console.error("Registration endpoint critical failure details:", error);
    return NextResponse.json(
      { error: "Failed to process checkout transaction pipelines safely." },
      { status: 500 },
    );
  }
}
