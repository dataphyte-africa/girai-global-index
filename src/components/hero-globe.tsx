"use client";
import React from "react";
import dynamic from "next/dynamic";
import type { Country } from "@/data/countries";
import type { ArcPosition } from "@/data/countries";

const World = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
  ssr: false,
});

interface GlobeDemoProps {
  arcData: ArcPosition[];
  markers: Country[];
}

export function GlobeDemo({ arcData, markers }: GlobeDemoProps) {
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
      country: m.country,
      flag: m.flag,
      ranking: m.ranking,
      indexScore: m.indexScore,
    })),
  };
  return (
      <div className="max-w-7xl  mx-auto w-full relative overflow-hidden h-full md:h-[40rem] ">
        
        
        <div className="absolute w-full h-72 md:h-full z-10">
          <World data={arcData} globeConfig={globeConfig} />
        </div>
      </div>
  );
}
