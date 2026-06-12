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
  getScore,
  getRank,
}: {
  rankingData: CountryRanking[];
  getScore?: (c: CountryRanking) => number | null;
  getRank?: (c: CountryRanking) => number | null;
}) {
  return (
    <ChoroplethMap
      rankingData={rankingData}
      getScore={getScore}
      getRank={getRank}
    />
  );
}
