import { NextResponse } from "next/server";
import { z } from "zod";
import { getPublicDownloadUrl } from "@/lib/data-download/config";
import {
  appendDataDownloadSubmission,
  isGoogleSheetsConfigured,
} from "@/lib/google-sheets";

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
          ? "GIRAI-methodology.pdf"
          : submission.edition === "first"
            ? "GIRAI-2024-report.pdf"
            : "GIRAI-2026-report.pdf";

    return NextResponse.json({
      ok: true,
      downloadUrl,
      filename,
    });
  } catch (error) {
    console.error("[data-download] submission failed:", error);
    return NextResponse.json(
      { error: "Failed to process download request" },
      { status: 500 }
    );
  }
}
