import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { code, email } = await request.json();

    if (!code || !email) {
      return NextResponse.json(
        { error: "Coupon code and email are required." },
        { status: 400 },
      );
    }

    const cleanCode = code.toUpperCase().trim();
    const cleanEmail = email.toLowerCase().trim();

    // 1. Check if the coupon exists
    const couponMatch = await sql`
      SELECT id, code, status 
      FROM "Coupon" 
      WHERE code = ${cleanCode}
    `;

    if (couponMatch.length === 0) {
      return NextResponse.json(
        { valid: false, error: "Invalid coupon code." },
        { status: 404 },
      );
    }

    const coupon = couponMatch[0];

    // 2. Check if it's already spent
    if (coupon.status === "Used") {
      return NextResponse.json(
        { valid: false, error: "This coupon has already been used." },
        { status: 400 },
      );
    }

    // Return the discount profile to the checkout client frame
    return NextResponse.json({
      valid: true,
      discountAmount: 500,
      message: "Coupon applied successfully! ₦500 deducted.",
    });
  } catch (error) {
    console.error("Coupon validation crash:", error);
    return NextResponse.json(
      { error: "Validation pipeline failure." },
      { status: 500 },
    );
  }
}
