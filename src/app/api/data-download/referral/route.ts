import { NextResponse } from "next/server";
import { z } from "zod";
import {
  appendDownloadReferralEvent,
  isGoogleSheetsConfigured,
} from "@/lib/google-sheets";

const referralSchema = z.object({
  assetType: z.enum(["report", "data", "methodology"]),
  edition: z.enum(["first", "second"]).optional(),
  source: z.string().trim().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = referralSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid referral data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (!isGoogleSheetsConfigured() && process.env.NODE_ENV === "production") {
      return NextResponse.json({ ok: true, logged: false });
    }

    await appendDownloadReferralEvent(parsed.data);

    return NextResponse.json({ ok: true, logged: true });
  } catch (error) {
    console.error("[data-download/referral] logging failed:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
