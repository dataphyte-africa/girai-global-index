import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookPayload = { _type?: string };

/** Top-level routes that embed SiteHeader/SiteFooter (shared singleton edits). */
const ALL_PAGE_PATHS = [
  "/",
  "/about",
  "/methodology",
  "/takeaways",
  "/indicators",
  "/evidence",
  "/regions",
  "/countries",
] as const;

/** Singleton document type → routes whose rendered HTML must be regenerated. */
const TYPE_PATHS: Record<string, readonly string[]> = {
  siteSettings: ALL_PAGE_PATHS,
  header: ALL_PAGE_PATHS,
  footer: ALL_PAGE_PATHS,
  // Download modal is mounted in the root layout, so it appears on every page.
  downloadModal: ALL_PAGE_PATHS,
  // Report-download section is reused across these pages.
  reportDownload: ["/", "/countries", "/regions", "/takeaways"],
  // Key Findings accordion is reused on these pages.
  keyFindings: ["/takeaways", "/countries"],
  homePage: ["/"],
  aboutPage: ["/about"],
  methodologyPage: ["/methodology"],
  takeawaysPage: ["/takeaways"],
  indicatorsPage: ["/indicators"],
  evidencePage: ["/evidence"],
  regionsPage: ["/regions"],
  countriesPage: ["/countries"],
  // Fixed collections. The generic revalidateTag() below busts the data cache
  // for every page; these are the static routes whose HTML also embeds the copy.
  pillar: ["/", "/about"],
  dimensionCopy: ["/"],
  // Per-indicator copy also renders on the indicators list; the detail routes
  // are revalidated below (dynamic segment).
  indicatorPage: ["/indicators"],
  evidencePathway: ["/evidence"],
  // Per-region copy renders on the region detail routes (dynamic segment,
  // revalidated below).
  regionPage: ["/regions"],
  // Editorial collection: list page + every post detail route.
  updatePost: ["/updates"],
};

function revalidateRoutes(type: string) {
  const paths = TYPE_PATHS[type] ?? [];
  for (const path of paths) {
    revalidatePath(path, "page");
  }
  // Root layout holds generateMetadata() (siteSettings).
  if (type === "siteSettings") {
    revalidatePath("/", "layout");
  }
  // Editorial posts also render at a dynamic detail route.
  if (type === "updatePost") {
    revalidatePath("/updates/[slug]", "page");
  }
  // Indicator copy renders at a dynamic detail route.
  if (type === "indicatorPage") {
    revalidatePath("/indicators/[slug]", "page");
  }
  // Region copy renders at a dynamic detail route.
  if (type === "regionPage") {
    revalidatePath("/regions/[slug]", "page");
  }
}

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    if (!body?._type) {
      return new NextResponse("Bad Request: missing _type", { status: 400 });
    }

    // Webhooks need immediate expiration. "max" uses stale-while-revalidate and
    // can keep serving old HTML on the next visit.
    revalidateTag(body._type, { expire: 0 });
    revalidateRoutes(body._type);

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      paths: TYPE_PATHS[body._type] ?? [],
      now: Date.now(),
    });
  } catch (err) {
    console.error("Revalidate webhook error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
