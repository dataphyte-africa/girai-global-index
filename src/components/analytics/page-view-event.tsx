"use client";

import * as React from "react";
import { track } from "@/lib/analytics/client";
import type { EventName } from "@/lib/analytics/events";

/**
 * Fires a single custom analytics event when a page mounts. Used on the
 * dynamic story pages (country/region/indicator/dimension) so entity-level
 * views are directly queryable (e.g. "most visited country") without parsing
 * URLs off the autocaptured $pageview. Renders nothing.
 */
export function PageViewEvent({
  event,
  properties,
}: {
  event: EventName;
  properties?: Record<string, unknown>;
}) {
  const key = JSON.stringify(properties);
  React.useEffect(() => {
    track(event, properties);
    // Re-fire when the entity changes (client nav between two country pages
    // reuses this component instance). `key` captures the serialized props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, key]);

  return null;
}
