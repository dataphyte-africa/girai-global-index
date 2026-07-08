import "server-only";

import { PostHog } from "posthog-node";
import type { EventName } from "./events";

/**
 * Server-side PostHog client for API routes. Serverless functions are
 * short-lived, so we flush immediately and shut down after each use.
 */
function getServerClient(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  return new PostHog(key, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  });
}

type CaptureArgs = {
  distinctId: string;
  event: EventName;
  properties?: Record<string, unknown>;
};

/** Fire-and-forget server-side event. Never throws into the request path. */
export async function captureServerEvent({
  distinctId,
  event,
  properties,
}: CaptureArgs): Promise<void> {
  const client = getServerClient();
  if (!client) return;
  try {
    client.capture({ distinctId, event, properties });
    await client.shutdown();
  } catch {
    // Analytics must never break the request.
  }
}

/** Capture a server-side exception for PostHog error tracking. */
export async function captureServerException(
  error: unknown,
  distinctId?: string,
  properties?: Record<string, unknown>
): Promise<void> {
  const client = getServerClient();
  if (!client) return;
  try {
    client.captureException(
      error instanceof Error ? error : new Error(String(error)),
      distinctId,
      properties
    );
    await client.shutdown();
  } catch {
    // Swallow — never break the request over analytics.
  }
}
