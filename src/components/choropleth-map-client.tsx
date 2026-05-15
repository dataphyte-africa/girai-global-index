"use client";

import dynamic from "next/dynamic";
import type { CountryRanking } from "@/lib/girai";

const ChoroplethMap = dynamic(
  () =>
    import("@/components/choropleth-map").then((m) => ({
      default: m.ChoroplethMap,
    })),
  { ssr: false }
);

export function ChoroplethMapClient({
  rankingData,
}: {
  rankingData: CountryRanking[];
}) {
  return <ChoroplethMap rankingData={rankingData} />;
}
