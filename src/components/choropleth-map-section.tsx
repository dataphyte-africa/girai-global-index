import { getAllCountries } from "@/lib/girai";
import {
  CountryPerformanceTabs,
  type PerformanceSectionContent,
} from "@/components/country-performance-tabs";

export function ChoroplethMapSection({
  /** List-tab table variant, forwarded to CountryPerformanceTabs. */
  listTable = "ranking",
  /** Editable heading/subtitle copy, forwarded to CountryPerformanceTabs. */
  content,
}: {
  listTable?: "ranking" | "heatmap";
  content?: PerformanceSectionContent;
} = {}) {
  const rankingData = getAllCountries();
  return (
    <section id="results" className="w-full px-4 py-12 md:px-8 md:py-16 bg-white dark:bg-muted/20">
      <div className="mx-auto max-w-6xl">
        <CountryPerformanceTabs
          rankingData={rankingData}
          listTable={listTable}
          content={content}
        />
      </div>
    </section>
  );
}
