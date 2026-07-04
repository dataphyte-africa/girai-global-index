"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import type { CountryRanking } from "@/lib/girai";
import {
  resolveGeoIso2,
  resolveGeoIso3,
  type GeoAdminProperties,
} from "@/lib/geo-iso";
import { CountryDrawer } from "./country-drawer";
import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const h = Math.round(x).toString(16);
        return h.length === 1 ? "0" + h : h;
      })
      .join("")
  );
}

function interpolateColor(color1: string, color2: string, t: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = c1.r + (c2.r - c1.r) * t;
  const g = c1.g + (c2.g - c1.g) * t;
  const b = c1.b + (c2.b - c1.b) * t;
  return rgbToHex(r, g, b);
}

function getColor(score: number, ceiling: number): string {
  const normalized = Math.min(ceiling, Math.max(0, score)) / ceiling;
  // Inverted: high score (1.0) = #5200FF (purple), low score (0) = #FAF5FF (light)
  if (normalized < 0.5) {
    return interpolateColor("#D3C9FC", "#A08AF8", normalized * 2);
  }
  return interpolateColor("#A08AF8", "#5039AD", (normalized - 0.5) * 2);
}

// Fixed 20-point semantic bands (nascent → leading). A score's tier is
// absolute — a 65 is always "Advanced" — so the legend stays interpretable
// across every view. The "Leading" band only appears when the active metric
// reaches into it (see resolveCeiling).
const TIER_LEGEND: { label: string; min: number; max: number }[] = [
  { label: "Leading", min: 80, max: 100 },
  { label: "Advanced", min: 60, max: 80 },
  { label: "Developing", min: 40, max: 60 },
  { label: "Emerging", min: 20, max: 40 },
  { label: "Nascent", min: 0, max: 20 },
];

/**
 * Snap the largest visible score up to a "nice" gradient ceiling. The overall
 * GIRAI never exceeds ~80, so the default view keeps the 0–80 scale (and its
 * existing colour spread); filtered pillar / dimension-cell / indicator views
 * routinely reach into the 90s, so they expand to 0–100 — extending the
 * gradient (no clamping at the top) and surfacing the "Leading" tier.
 */
function resolveCeiling(maxScore: number): number {
  return maxScore > 80 ? 100 : 80;
}

function MapLockControl({ isLocked, onToggle }: { isLocked: boolean; onToggle: () => void }) {
  const map = useMap();

  useEffect(() => {
    if (isLocked) {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      if ('tap' in map && map.tap) {
        (map.tap as { disable: () => void }).disable();
      }
    } else {
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      if ('tap' in map && map.tap) {
        (map.tap as { enable: () => void }).enable();
      }
    }
  }, [isLocked, map]);

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          className="h-9 w-9 border-none outline-0 border-[0.5px] bg-background  hover:bg-accent"
          aria-label={isLocked ? "Unlock map" : "Lock map"}
        >
          {isLocked ? (
            <Lock className="size-4" />
          ) : (
            <Unlock className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

function buildTooltipContent(
  name: string,
  iso2: string,
  rank: number,
  score: number
): string {
  const flagUrl = `https://flagcdn.com/w40/${iso2.toLowerCase()}.png`;
  return `
    <div style="min-width: 140px; padding:10px; background-color: #f8f9fa; border-radius: 6px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
        <img src="${flagUrl}" alt="" width="24" height="18" style="border-radius: 2px;" />
        <span style="font-weight: 600; font-size: 13px;">${name}</span>
      </div>
      <div style="font-size: 12px; color: #64748b;">
        Rank: <strong>#${rank}</strong> &nbsp;|&nbsp; Score: <strong>${score.toFixed(2)}</strong>
      </div>
    </div>
  `;
}

export function ChoroplethMap({
  rankingData,
  getScore,
  getRank,
}: {
  rankingData: CountryRanking[];
  /** Score used to colour each country. Defaults to the overall GIRAI score. */
  getScore?: (c: CountryRanking) => number | null;
  /** Rank shown in the tooltip. Defaults to the global GIRAI rank. */
  getRank?: (c: CountryRanking) => number | null;
}) {
  const [geojson, setGeojson] = useState<GeoJSON.GeoJsonObject | null>(null);
  const [selectedCountry, setSelectedCountry] =
    useState<CountryRanking | null>(null);
  const [isLocked, setIsLocked] = useState(true);

  const resolveScore = getScore ?? ((c: CountryRanking) => c.girai);
  const resolveRank = getRank ?? ((c: CountryRanking) => c.rankGlobal);

  const rankingByIso3 = useMemo(
    () => new Map(rankingData.map((r) => [r.iso3, r])),
    [rankingData]
  );

  // Gradient + legend scale to the metric in view: 0–80 for the overall GIRAI,
  // 0–100 once a filter/indicator pushes the top score past 80.
  const ceiling = useMemo(() => {
    let max = 0;
    for (const c of rankingData) {
      const score = resolveScore(c);
      if (score != null && score > max) max = score;
    }
    return resolveCeiling(max);
  }, [rankingData, resolveScore]);

  const visibleTiers = useMemo(
    () => TIER_LEGEND.filter((t) => t.min < ceiling),
    [ceiling]
  );

  useEffect(() => {
    fetch("/api/geojson/countries")
      .then((res) => res.json())
      .then(setGeojson)
      .catch(console.error);
  }, []);

  const style = (feature?: { properties?: GeoAdminProperties }) => {
    const iso3 = resolveGeoIso3(feature?.properties);
    const countryData = iso3 ? rankingByIso3.get(iso3) : undefined;
    const score = countryData ? resolveScore(countryData) : null;
    return {
      fillColor: score !== null && score !== undefined
        ? getColor(score, ceiling)
        : "var(--background)",
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 1,
    };
  };

  const onEachFeature = (
    feature: { properties?: GeoAdminProperties },
    layer: L.Layer
  ) => {
    const iso3 = resolveGeoIso3(feature.properties);
    const iso2 = resolveGeoIso2(feature.properties) ?? "";
    const name = feature.properties?.admin ?? "";
    const countryData = iso3 ? rankingByIso3.get(iso3) : undefined;

    if (countryData && iso2) {
      const content = buildTooltipContent(
        countryData.name || name,
        iso2,
        resolveRank(countryData) ?? 0,
        resolveScore(countryData) ?? 0
      );
      layer.bindTooltip(content, {
        sticky: true,
        className: "choropleth-tooltip",
        direction: "top",
      });
      layer.on("click", () => setSelectedCountry(countryData));
    }
  };

  if (!geojson) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center rounded-lg border bg-muted/30">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <>
      <div className="choropleth-map relative isolate z-0 ">
      <div className="my-5 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border bg-background/95 px-4 py-3 shadow-sm">
          <span className="text-muted-foreground text-sm font-medium">Score tier</span>
          {visibleTiers.map(({ label, min, max }) => {
            const mid = (min + max) / 2;
            return (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="size-4 shrink-0 rounded border border-white/50 shadow-sm"
                  style={{ backgroundColor: getColor(mid, ceiling) }}
                  aria-hidden
                />
                <span className="text-sm text-foreground">
                  {label} <span className="text-muted-foreground">({min}–{max})</span>
                </span>
              </div>
            );
          })}
        </div>
        <div className="bg-[#F8FAFC] p-2 dark:bg-muted/20 rounded-sm">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          className="h-[500px] w-full rounded-lg "
          scrollWheelZoom={!isLocked}
          dragging={!isLocked}
          doubleClickZoom={!isLocked}
          touchZoom={!isLocked}
          boxZoom={!isLocked}
          keyboard={!isLocked}
          attributionControl={false}
          style={{ backgroundColor: "rgba(var(--background), 0.5)" }}
        >
          <GeoJSON
            data={geojson}
            style={style as L.StyleFunction}
            onEachFeature={onEachFeature}
          />
          <MapLockControl isLocked={isLocked} onToggle={() => setIsLocked(!isLocked)} />
        </MapContainer>
        <p className="text-muted-foreground/70 mt-2 text-xs leading-relaxed">
          Boundaries and country names shown on this map are for illustrative
          purposes only and do not imply any judgement or endorsement regarding
          the legal status of any territory or its borders. We do not officially
          endorse the boundaries depicted; they are used solely to render the
          map. Base map data:{" "}
          <a
            href="https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Natural Earth — Admin 0 Countries
          </a>{" "}
          (public domain).
        </p>
        </div>
      </div>
      <CountryDrawer
        country={selectedCountry}
        open={!!selectedCountry}
        onClose={() => setSelectedCountry(null)}
      />
    </>
  );
}
