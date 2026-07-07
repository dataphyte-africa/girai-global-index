import { sanityFetch } from "../../sanity/lib/fetch";
import { countdownModalQuery } from "../../sanity/lib/queries";
import {
  countdownModalDefaults,
  type CountdownModalContent,
} from "./countdownModal.defaults";
import { str, type DeepPartial } from "./_merge";

export const COUNTDOWN_MODAL_TAG = "countdownModal";

/**
 * Environment override for the countdown gate, checked before the Sanity
 * `enabled` toggle. Lets you keep the modal ON in production while forcing it
 * OFF in staging/preview even though both share one Sanity dataset.
 *
 *   COUNTDOWN_ENABLED=false  → always hidden (set this on staging)
 *   COUNTDOWN_ENABLED=true   → always shown (until the target date passes)
 *   unset / anything else    → defer to the Sanity "Enabled" toggle
 *
 * Server-only (not NEXT_PUBLIC_), so the flag never ships to the browser.
 */
function resolveEnabled(sanityEnabled: boolean): boolean {
  const override = process.env.COUNTDOWN_ENABLED?.trim().toLowerCase();
  if (override === "false" || override === "0" || override === "off") return false;
  if (override === "true" || override === "1" || override === "on") return true;
  return sanityEnabled;
}

export async function getCountdownModalContent(): Promise<CountdownModalContent> {
  let data: DeepPartial<CountdownModalContent> | null = null;
  try {
    data = await sanityFetch<DeepPartial<CountdownModalContent> | null>({
      query: countdownModalQuery,
      tags: [COUNTDOWN_MODAL_TAG],
    });
  } catch {
    data = null;
  }

  const d = countdownModalDefaults;
  if (!data) {
    return { ...d, enabled: resolveEnabled(d.enabled) };
  }

  const sanityEnabled =
    typeof data.enabled === "boolean" ? data.enabled : d.enabled;

  return {
    enabled: resolveEnabled(sanityEnabled),
    heading: str(data.heading, d.heading),
    headingAccent: str(data.headingAccent, d.headingAccent),
    description: str(data.description, d.description),
    targetDate: str(data.targetDate, d.targetDate),
  };
}
