import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

interface PostgresError {
  code?: string;
  message?: string;
}

function sanitizeAndValidateEmail(rawEmail: string): {
  clean: string;
  isValid: boolean;
} {
  const parts = rawEmail.toLowerCase().trim().split("@");
  if (parts.length !== 2 || parts[1] !== "gmail.com") {
    return { clean: "", isValid: false };
  }

  let username = parts[0];

  // 1. Instantly eliminate plus character extensions (e.g., username+spam@gmail.com)
  username = username.split("+")[0];

  // 2. STRIP ALL PERIODS PERMANENTLY (e.g., t.i.j.e.s.u.n.i.m.i@gmail.com -> tijesunimi@gmail.com)
  const trueUser = username.replace(/\./g, "");

  return { clean: `${trueUser}@gmail.com`, isValid: trueUser.length >= 3 };
}

export async function POST(request: Request) {
  try {
    const { fullName, email, deviceFingerprint } = await request.json();

    if (!fullName || !email || !deviceFingerprint) {
      return NextResponse.json(
        { error: "Incomplete validation properties." },
        { status: 400 },
      );
    }

    // Capture the public network connection signature safely from Vercel/Next headers
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. Time-Gate Window Security Check
    const config =
      await sql`SELECT "registrationStartedAt" FROM "VotingConfig" WHERE id = 1`;
    if (config.length === 0 || !config[0].registrationStartedAt) {
      return NextResponse.json(
        { error: "Registration has not been declared active yet." },
        { status: 403 },
      );
    }

    const startTime = new Date(config[0].registrationStartedAt).getTime();
    if (Date.now() > startTime + 7200000) {
      return NextResponse.json(
        { error: "Registration window expired permanently." },
        { status: 403 },
      );
    }

    // 2. Run Deep Email Screening & Canonical Matching
    const emailCheck = sanitizeAndValidateEmail(email);
    if (!emailCheck.isValid) {
      return NextResponse.json(
        { error: "Invalid email pattern. Use your primary active Gmail." },
        { status: 400 },
      );
    }

    // 3. SECURE RE-CHECK: Make sure the normalized, dot-free email isn't already logged
    const existingEmailCheck = await sql`
      SELECT id FROM "VoterRegistry" WHERE email = ${emailCheck.clean}
    `;
    if (existingEmailCheck.length > 0) {
      return NextResponse.json(
        {
          error:
            "Security Lockout: This canonical Gmail account has already been issued a voter pass.",
        },
        { status: 400 },
      );
    }

    // 4. IP ADDRESS THROTTLING LAYER (Max 2 accounts per network connection)
    // IP ADDRESS THROTTLING LAYER (Enforced to exactly 1 account per public network profile)
    const activeIpCount = await sql`
      SELECT COUNT(*)::int as total FROM "VoterRegistry" WHERE "ipAddress" = ${ipAddress}
    `;
    if (activeIpCount.length > 0 && activeIpCount[0].total >= 1) {
      return NextResponse.json(
        {
          error:
            "Security Lockout: A voter pass has already been claimed from this internet connection.",
        },
        { status: 400 },
      );
    }
    // if (activeIpCount.length > 0 && activeIpCount[0].total >= 2) {
    //   return NextResponse.json(
    //     {
    //       error:
    //         "Security Lockout: Maximum allowable accounts exceeded for this device network profile.",
    //     },
    //     { status: 400 },
    //   );
    // }

    // 5. Database Write Operation using strictly normalized arguments
    try {
      await sql`
        INSERT INTO "VoterRegistry" (email, "fullName", "deviceFingerprint", "ipAddress")
        VALUES (${emailCheck.clean}, ${fullName.trim()}, ${deviceFingerprint}, ${ipAddress})
      `;
    } catch (dbErr) {
      const postgresError = dbErr as PostgresError;
      if (postgresError.code === "23505") {
        return NextResponse.json(
          {
            error:
              "Security Alert: This specific hardware footprint signature has already claimed a voter card.",
          },
          { status: 400 },
        );
      }
      throw dbErr;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Voter registration exception:", error);
    return NextResponse.json(
      { error: "Internal registry error." },
      { status: 500 },
    );
  }
}
