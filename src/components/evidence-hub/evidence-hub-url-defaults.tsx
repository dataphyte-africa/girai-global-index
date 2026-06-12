"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

/**
 * Ensures `/evidence` always has a pathway selected (`?kind=framework` by default).
 */
export function EvidenceHubUrlDefaults() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (searchParams.get("kind")) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("kind", "framework");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  return null;
}
