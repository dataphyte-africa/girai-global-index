import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

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

interface GeoJSONCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ iso3: string }> }
) {
  try {
    const { iso3 } = await params;
    const path = join(process.cwd(), "src/data/customgeo.json");
    const content = readFileSync(path, "utf-8");
    const geojson: GeoJSONCollection = JSON.parse(content);

    const feature = geojson.features.find(
      (f) => f.properties.iso_a3?.toUpperCase() === iso3.toUpperCase()
    );

    if (!feature) {
      return NextResponse.json(
        { error: `Country with ISO3 code "${iso3}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(feature);
  } catch (e) {
    console.error("Failed to load country GeoJSON:", e);
    return NextResponse.json(
      { error: "Failed to load GeoJSON" },
      { status: 500 }
    );
  }
}
