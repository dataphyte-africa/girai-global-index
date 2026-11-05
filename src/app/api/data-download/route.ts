import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getDownloadAsset,
  getPublicDownloadUrl,
  hasLanguageChoice,
  isReportLanguage,
} from "@/lib/data-download/config";
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
  language: z.enum(["en", "es", "fr"]).optional(),
});

/**
 * Resolves a file without logging anything. Used for repeat downloads by
 * visitors whose identity is remembered client-side, so they don't create
 * another Sheets row. Redirects so the server-only env path overrides apply.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const edition = params.get("edition");
  const assetType = params.get("type");
  const lang = params.get("lang");

  if (
    (edition !== "first" && edition !== "second") ||
    (assetType !== "report" && assetType !== "data" && assetType !== "methodology")
  ) {
    return NextResponse.json({ error: "Invalid download" }, { status: 400 });
  }

  const language =
    hasLanguageChoice(edition, assetType) && isReportLanguage(lang)
      ? lang
      : undefined;

  return NextResponse.redirect(
    new URL(getPublicDownloadUrl(edition, assetType, language), request.url)
  );
}

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

    const { language, ...fields } = parsed.data;
    // Language only applies to the 2026 report; drop it for everything else.
    const submission = {
      ...fields,
      language: hasLanguageChoice(fields.edition, fields.assetType)
        ? language
        : undefined,
    };

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
        language: submission.language,
      },
    });

    const downloadUrl = getPublicDownloadUrl(
      submission.edition,
      submission.assetType,
      submission.language
    );
    const { filename } = getDownloadAsset(
      submission.edition,
      submission.assetType,
      submission.language
    );

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
