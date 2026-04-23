import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // We'll create this helper next

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      eventName,
      amountPaid,
      couponUsed,
      receiptUrl,
    } = body;

    // 1. Basic Validation
    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 2. Check if user already registered for this event
    const existing = await prisma.registration.findFirst({
      where: { email, eventName },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered for this event" },
        { status: 400 },
      );
    }

    // 3. Create the pending registration
    const newRegistration = await prisma.registration.create({
      data: {
        fullName,
        email,
        phone,
        eventName,
        amountPaid: parseInt(amountPaid),
        couponUsed,
        receiptUrl,
        status: "pending",
      },
    });

    return NextResponse.json(
      {
        message: "Registration recorded",
        id: newRegistration.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
