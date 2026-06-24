import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookPayload = { _type?: string };

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

    // Revalidate everything fetched with a tag matching the changed document
    // type. Next 16 requires the cache-life profile arg; "max" purges on demand.
    revalidateTag(body._type, "max");

    return NextResponse.json({ revalidated: true, type: body._type, now: Date.now() });
  } catch (err) {
    console.error("Revalidate webhook error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
