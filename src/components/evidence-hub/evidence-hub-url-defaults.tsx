"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

/**
 * Seeds `/evidence` with a default pathway (`?kind=framework`) on first load only.
 *
 * This runs a single time on mount: if the user arrives without a `kind` param
 * we pick `framework` so the page opens on a sensible pathway. After that we
 * never touch the param again, so the user can freely deselect the `kind`
 * filter without it snapping back.
 */
export function EvidenceHubUrlDefaults() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const seededRef = React.useRef(false);

  React.useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;

    if (searchParams.get("kind")) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("kind", "framework");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
