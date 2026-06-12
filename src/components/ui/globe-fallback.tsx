"use client";

import type { MarkerData } from "@/components/ui/globe";

const PIN_PATH =
  "M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z";

/** Static globe shown when WebGL is unavailable (e.g. sandboxed preview). */
export function GlobeFallback({ markers }: { markers: MarkerData[] }) {
  const topMarkers = [...markers]
    .sort((a, b) => a.ranking - b.ranking)
    .slice(0, 6);

  return (
    <div
      className="relative flex h-full w-full items-center justify-center"
      role="img"
      aria-label="Global responsible AI index preview"
    >
      <div className="relative aspect-square w-[min(100%,22rem)] md:w-[min(100%,28rem)]">
        <div
          className="absolute inset-0 rounded-full shadow-[0_0_80px_rgba(113,80,244,0.35)]"
          style={{
            background:
              "radial-gradient(circle at 32% 28%, #a08af8 0%, #7150f4 35%, #5039ad 62%, #1d072e 100%)",
          }}
        />
        <div
          className="absolute inset-[8%] rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 70% 20%, rgba(255,255,255,0.45) 0%, transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0 rounded-full border border-white/20"
          aria-hidden
        />
        {topMarkers.map((marker, i) => {
          const angle = (i / topMarkers.length) * Math.PI * 2 - Math.PI / 2;
          const radius = 42;
          const x = 50 + Math.cos(angle) * radius;
          const y = 50 + Math.sin(angle) * radius * 0.85;
          return (
            <div
              key={marker.iso3}
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className="globe-marker scale-90 md:scale-100">
                <svg
                  className="globe-marker-pin"
                  viewBox="0 0 28 36"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d={PIN_PATH}
                    fill="rgba(59, 7, 100, 0.4)"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="0.6"
                  />
                </svg>
                <div className="globe-marker-content">
                  <span className="globe-marker-score">
                    {marker.indexScore.toFixed(1)}
                  </span>
                  <span className="globe-marker-flag">{marker.flag}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
