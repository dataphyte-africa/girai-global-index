"use client";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Country } from "@/data/countries";
import type { ArcPosition } from "@/data/countries";
import { cn } from "@/lib/utils";
import { GlobeFallback } from "@/components/ui/globe-fallback";
import type { GlobeConfig } from "@/components/ui/globe";

function GlobeImportFallback({
  globeConfig,
}: {
  globeConfig: GlobeConfig;
  data: unknown;
}) {
  return <GlobeFallback markers={globeConfig.markers ?? []} />;
}

const World = dynamic(
  () =>
    import("@/components/ui/globe")
      .then((m) => m.World)
      .catch((error) => {
        console.warn("[Globe] failed to load WebGL globe, using fallback.", error);
        return GlobeImportFallback;
      }),
  { ssr: false },
);

interface GlobeDemoProps {
  arcData: ArcPosition[];
  markers: Country[];
  /** Override default container height (landing hero uses md:h-[40rem]). */
  className?: string;
}

export function GlobeDemo({ arcData, markers, className }: GlobeDemoProps) {
  const globeConfig = {
    pointSize: 4,
    globeColor: "#7150F4",
    showAtmosphere: true,
    atmosphereColor: "#000000",
    atmosphereAltitude: 0.1,
    emissive: "green",
    emissiveIntensity: 0,
    shininess: 0.9,
    polygonColor: "#5366CD",
    ambientLight: "white",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 5,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
    markers: markers.map((m) => ({
      lat: m.lat,
      lng: m.lng,
      iso3: m.iso3,
      country: m.name,
      flag: m.flag,
      ranking: m.rankGlobal ?? 0,
      indexScore: m.girai ?? 0,
    })),
  };
  return (
      <div
        className={cn(
          "relative mx-auto h-80 w-full max-w-7xl overflow-hidden md:h-[40rem]",
          className,
        )}
      >
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <World data={arcData} globeConfig={globeConfig} />
          </Suspense>
        </div>
      </div>
  );
}
