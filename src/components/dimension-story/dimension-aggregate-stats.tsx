import type { DimensionAggregateStats } from "@/lib/girai";

export interface DimensionAggregateStatsProps {
  stats: DimensionAggregateStats;
}

export function DimensionAggregateStatsSection({
  stats,
}: DimensionAggregateStatsProps) {
  const items = [
    { value: stats.frameworks, label: "AI frameworks identified" },
    { value: stats.initiatives, label: "Implementation activities documented" },
    { value: stats.csoInitiatives, label: "Civil society initiatives on file" },
    { value: stats.countriesWithOversight, label: "Countries with dedicated oversight bodies" },
  ];

  return (
    <section className="w-full px-4 pt-16 md:px-8 md:pt-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight md:text-4xl">
          <span className="text-primary">Global</span>{" "}
          <span className="text-foreground">Aggregate Statistics</span>
        </h2>

        <div className="grid grid-cols-2 divide-y divide-border border-y border-border md:grid-cols-4 md:divide-x md:divide-y-0">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 px-4 py-8 text-center"
            >
              <span className="text-4xl font-bold tabular-nums text-foreground md:text-5xl">
                {item.value.toLocaleString()}
              </span>
              <span className="max-w-[18ch] text-sm text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
