import { NextResponse } from "next/server";
import { z } from "zod";
import { getPublicDownloadUrl } from "@/lib/data-download/config";
import {
  appendDataDownloadSubmission,
  isGoogleSheetsConfigured,
} from "@/lib/google-sheets";
import {
  captureServerEvent,
  captureServerException,
} from "@/lib/analytics/server";
import { EVENTS } from "@/lib/analytics/events";

const submissionSchema = z.object({
  edition: z.enum(["first", "second"]),
  assetType: z.enum(["report", "data", "methodology"]),
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  organization: z.string().trim().optional().default(""),
  role: z.string().trim().optional().default(""),
  reason: z.enum([
    "academic-research",
    "journalism-media",
    "policy-development",
    "civil-society",
    "private-sector",
    "government",
    "personal-interest",
    "other",
  ]),
  consent: z
    .boolean()
    .refine((value) => value === true, {
      message: "Consent to the data policy is required",
    }),
  source: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = submissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const submission = parsed.data;

    if (!isGoogleSheetsConfigured() && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Download logging is not configured" },
        { status: 503 }
      );
    }

    await appendDataDownloadSubmission(submission);

    // Server-side capture (distinct ID = email to match the client identify)
    // so downloads are recorded even if a client-side blocker drops events.
    await captureServerEvent({
      distinctId: submission.email,
      event: EVENTS.DOWNLOAD_REQUESTED,
      properties: {
        asset_type: submission.assetType,
        edition: submission.edition,
        reason: submission.reason,
        has_organization: Boolean(submission.organization),
        source: submission.source,
      },
    });

    const downloadUrl = getPublicDownloadUrl(
      submission.edition,
      submission.assetType
    );
    const filename =
      submission.assetType === "data"
        ? submission.edition === "first"
          ? "GIRAI_2024_dataset.xlsx"
          : "GIRAI_2026_dataset.xlsx"
        : submission.assetType === "methodology"
          ? submission.edition === "first"
            ? "GIRAI-2024-methodology.pdf"
            : "GIRAI-2026-methodology.pdf"
          : submission.edition === "first"
            ? "GIRAI-2024-report.pdf"
            : "Global-Index-on-Responsible-AI-2026.pdf";

    return NextResponse.json({
      ok: true,
      downloadUrl,
      filename,
    });
  } catch (error) {
    console.error("[data-download] submission failed:", error);
    await captureServerException(error, undefined, {
      route: "/api/data-download",
    });
    return NextResponse.json(
      { error: "Failed to process download request" },
      { status: 500 }
    );
  }
}
