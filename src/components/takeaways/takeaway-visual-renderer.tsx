"use client";

import Image from "next/image";
import {
  BubbleMap,
  ComparisonColumns,
  DataTableViz,
  DeviationHeatmap,
  GroupedBarChart,
  IndicatorRankBar,
  RatioBarChart,
  RegionalBarChart,
} from "./takeaway-charts";
import type { TakeawayVisual, VisualImage } from "./types";

/** Renders a static chart image exported from the flagship report. */
function ChartImage({
  image,
  title,
  caption,
}: {
  image: VisualImage;
  title?: string;
  caption?: string;
}) {
  return (
    <figure className="mt-5">
      {title ? (
        <figcaption className="mb-2 text-sm font-semibold text-foreground">
          {title}
        </figcaption>
      ) : null}
      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/5 dark:ring-white/10">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(max-width: 768px) 100vw, 720px"
          className="h-auto w-full"
        />
      </div>
      {caption ? (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {caption}
        </p>
      ) : null}
    </figure>
  );
}

export function TakeawayVisualRenderer({ visual }: { visual: TakeawayVisual }) {
  // Kept in source but intentionally not rendered.
  if (visual.hidden) return null;

  // An attached report image overrides the native chart (reversible: remove
  // `image` from the data to restore the live chart).
  if (visual.image) {
    return (
      <ChartImage
        image={visual.image}
        title={visual.title}
        caption={visual.caption}
      />
    );
  }

  switch (visual.kind) {
    case "image":
      return (
        <ChartImage
          image={visual.image}
          title={visual.title}
          caption={visual.caption}
        />
      );
    case "ratioBar":
      return (
        <RatioBarChart
          data={visual.data}
          average={visual.average}
          title={visual.title}
          caption={visual.caption}
        />
      );
    case "regionalBar":
      return (
        <RegionalBarChart
          data={visual.data}
          title={visual.title}
          caption={visual.caption}
          showDeviation={visual.showDeviation}
          valueDigits={visual.valueDigits}
        />
      );
    case "groupedBar":
      return <GroupedBarChart visual={visual} />;
    case "indicatorRankBar":
      return (
        <IndicatorRankBar
          data={visual.data}
          title={visual.title}
          caption={visual.caption}
          highlightTop={visual.highlightTop}
          highlightBottom={visual.highlightBottom}
          highlight={visual.highlight}
          valueDigits={visual.valueDigits}
        />
      );
    case "comparisonColumns":
      return (
        <ComparisonColumns
          left={visual.left}
          right={visual.right}
          title={visual.title}
          caption={visual.caption}
          highlightLabel={visual.highlightLabel}
        />
      );
    case "heatmap":
      return (
        <DeviationHeatmap
          columns={visual.columns}
          rows={visual.rows}
          mode={visual.mode}
          title={visual.title}
          caption={visual.caption}
        />
      );
    case "table":
      return (
        <DataTableViz
          columns={visual.columns}
          rows={visual.rows}
          title={visual.title}
          caption={visual.caption}
          emphasizeLastRow={visual.emphasizeLastRow}
        />
      );
    case "bubbleMap":
      return <BubbleMap points={visual.points} title={visual.title} caption={visual.caption} />;
    default: {
      const _exhaustive: never = visual;
      return _exhaustive;
    }
  }
}
