"use client";

import { useEffect, useState } from "react";

interface GeoJSONFeature {
  type: "Feature";
  properties: {
    iso_a3?: string;
    admin?: string;
    [key: string]: unknown;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

interface CountryMapSVGProps {
  iso3: string;
  className?: string;
  fillGradientId?: string;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  width?: number;
  height?: number;
}

// Convert GeoJSON coordinates to SVG path string
function coordsToPath(coords: number[][]): string {
  return coords
    .map((point, i) => {
      const [lng, lat] = point;
      return `${i === 0 ? "M" : "L"} ${lng} ${-lat}`;
    })
    .join(" ") + " Z";
}

// Process geometry (handles both Polygon and MultiPolygon)
function geometryToPath(geometry: GeoJSONFeature["geometry"]): string {
  if (geometry.type === "Polygon") {
    // Polygon: array of rings, first is outer, rest are holes
    return (geometry.coordinates as number[][][])
      .map((ring) => coordsToPath(ring))
      .join(" ");
  } else if (geometry.type === "MultiPolygon") {
    // MultiPolygon: array of polygons
    return (geometry.coordinates as number[][][][])
      .map((polygon) => polygon.map((ring) => coordsToPath(ring)).join(" "))
      .join(" ");
  }
  return "";
}

// Calculate bounding box from geometry
function getBoundingBox(geometry: GeoJSONFeature["geometry"]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  const processCoords = (coords: number[]) => {
    const [lng, lat] = coords;
    minX = Math.min(minX, lng);
    maxX = Math.max(maxX, lng);
    minY = Math.min(minY, -lat); // Flip Y for SVG coordinate system
    maxY = Math.max(maxY, -lat);
  };

  if (geometry.type === "Polygon") {
    (geometry.coordinates as number[][][]).forEach((ring) =>
      ring.forEach(processCoords)
    );
  } else if (geometry.type === "MultiPolygon") {
    (geometry.coordinates as number[][][][]).forEach((polygon) =>
      polygon.forEach((ring) => ring.forEach(processCoords))
    );
  }

  return { minX, maxX, minY, maxY };
}

export function CountryMapSVG({
  iso3,
  className = "",
  fillGradientId,
  fillColor = "#6366f1",
  strokeColor = "#ffffff",
  strokeWidth = 0.5,
  width = 400,
  height = 300,
}: CountryMapSVGProps) {
  const [feature, setFeature] = useState<GeoJSONFeature | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(`/api/geojson/country/${iso3}`)
      .then((res) => {
        if (!res.ok) throw new Error("Country not found");
        return res.json();
      })
      .then((data) => {
        setFeature(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [iso3]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="animate-pulse bg-muted/30 rounded-lg w-full h-full" />
      </div>
    );
  }

  if (error || !feature) {
    return (
      <div
        className={`flex items-center justify-center text-muted-foreground ${className}`}
        style={{ width, height }}
      >
        <span className="text-sm">Map unavailable</span>
      </div>
    );
  }

  const pathData = geometryToPath(feature.geometry);
  const bbox = getBoundingBox(feature.geometry);
  
  // Add padding
  const padding = 5;
  const viewBoxWidth = bbox.maxX - bbox.minX + padding * 2;
  const viewBoxHeight = bbox.maxY - bbox.minY + padding * 2;
  const viewBox = `${bbox.minX - padding} ${bbox.minY - padding} ${viewBoxWidth} ${viewBoxHeight}`;

  const fill = fillGradientId ? `url(#${fillGradientId})` : fillColor;

  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {fillGradientId && (
        <defs>
          <linearGradient id={fillGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      )}
      <path
        d={pathData}
        fill={fill}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Alternative component with custom gradient colors
interface CountryMapWithGradientProps extends Omit<CountryMapSVGProps, "fillGradientId" | "fillColor"> {
  gradientColors: [string, string] | [string, string, string];
  gradientId?: string;
}

export function CountryMapWithGradient({
  iso3,
  className = "",
  gradientColors,
  gradientId = "countryGradient",
  strokeColor = "rgba(255,255,255,0.3)",
  strokeWidth = 0.5,
  width = 400,
  height = 300,
}: CountryMapWithGradientProps) {
  const [feature, setFeature] = useState<GeoJSONFeature | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(`/api/geojson/country/${iso3}`)
      .then((res) => {
        if (!res.ok) throw new Error("Country not found");
        return res.json();
      })
      .then((data) => {
        setFeature(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [iso3]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="animate-pulse bg-muted/30 rounded-lg w-full h-full" />
      </div>
    );
  }

  if (error || !feature) {
    return (
      <div
        className={`flex items-center justify-center text-muted-foreground ${className}`}
        style={{ width, height }}
      >
        <span className="text-sm">Map unavailable</span>
      </div>
    );
  }

  const pathData = geometryToPath(feature.geometry);
  const bbox = getBoundingBox(feature.geometry);
  
  const padding = 5;
  const viewBoxWidth = bbox.maxX - bbox.minX + padding * 2;
  const viewBoxHeight = bbox.maxY - bbox.minY + padding * 2;
  const viewBox = `${bbox.minX - padding} ${bbox.minY - padding} ${viewBoxWidth} ${viewBoxHeight}`;

  const stops = gradientColors.length === 2
    ? [
        { offset: "0%", color: gradientColors[0] },
        { offset: "100%", color: gradientColors[1] },
      ]
    : [
        { offset: "0%", color: gradientColors[0] },
        { offset: "50%", color: gradientColors[1] },
        { offset: "100%", color: gradientColors[2] },
      ];

  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          {stops.map((stop, i) => (
            <stop key={i} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
      </defs>
      <path
        d={pathData}
        fill={`url(#${gradientId})`}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}
