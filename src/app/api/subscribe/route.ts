import { type NextRequest, NextResponse } from "next/server";

// Mailchimp audience config. The API key is a secret and must never reach the
// browser — it is only read here, server-side.
const API_KEY = process.env.MAILCHIMP_API_KEY;
const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID ?? "77f7ced742";
const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX ?? "us17";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubscribeBody = { email?: unknown; name?: unknown };

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    console.error("Mailchimp subscribe: MAILCHIMP_API_KEY is not set");
    return NextResponse.json(
      { error: "Subscription is temporarily unavailable." },
      { status: 500 }
    );
  }

  let body: SubscribeBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const endpoint = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${API_KEY}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        // Double opt-in: Mailchimp emails a confirmation before subscribing.
        status: "pending",
        merge_fields: name ? { FNAME: name } : undefined,
      }),
    });

    if (res.ok) {
      return NextResponse.json({ ok: true });
    }

    const data = (await res.json().catch(() => ({}))) as {
      title?: string;
      detail?: string;
    };

    // Already-subscribed members come back as 400 "Member Exists".
    if (res.status === 400 && data.title === "Member Exists") {
      return NextResponse.json(
        { error: "You're already subscribed." },
        { status: 409 }
      );
    }

    console.error("Mailchimp subscribe failed:", res.status, data);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 502 }
    );
  } catch (err) {
    console.error("Mailchimp subscribe error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 502 }
    );
  }
}
