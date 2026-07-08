"use client";

import posthog from "posthog-js";
import type { EventName } from "./events";

type Props = Record<string, unknown>;

/** Safe wrapper around posthog.capture — no-ops when PostHog isn't initialized. */
export function track(event: EventName, properties?: Props) {
  if (!posthog.__loaded) return;
  posthog.capture(event, properties);
}

/**
 * Identify a person by email (used after download/subscribe form submits).
 * Extra traits are stored as person properties.
 */
export function identifyByEmail(email: string, traits?: Props) {
  if (!posthog.__loaded || !email) return;
  posthog.identify(email, { email, ...traits });
}
