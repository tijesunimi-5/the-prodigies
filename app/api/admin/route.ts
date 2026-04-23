import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid"; // Install this: npm install nanoid

export async function PATCH(request: Request) {
  try {
    const { registrationId } = await request.json();

    // Generate a unique Access Code for the QR
    const accessCode = `PRD26-${nanoid(8).toUpperCase()}`;

    const updated = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        status: "verified",
        accessCode: accessCode,
      },
    });

    return NextResponse.json({
      message: "Payment verified and QR generated",
      accessCode: updated.accessCode,
    });
  } catch (error) {
    return NextResponse.json({ error: "Approval failed" }, { status: 500 });
  }
}
