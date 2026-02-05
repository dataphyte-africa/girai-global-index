"use client";

import dynamic from "next/dynamic";
import type { FullRankingData } from "@/data/countries";

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
  rankingData: FullRankingData[];
}) {
  return <ChoroplethMap rankingData={rankingData} />;
}
