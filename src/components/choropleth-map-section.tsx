import { getFullRankingData } from "@/lib/parse-ranking";
import { ChoroplethMapClient } from "@/components/choropleth-map-client";
import { ChoroplethMapHeading } from "@/components/choropleth-map-heading";

export function ChoroplethMapSection() {
  const rankingData = getFullRankingData();
  return (
    <section className="w-full px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-6xl">
        <ChoroplethMapHeading />
        <ChoroplethMapClient rankingData={rankingData} />
      </div>
    </section>
  );
}
