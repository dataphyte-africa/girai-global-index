import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const path = join(process.cwd(), "src/data/customgeo.json");
    const content = readFileSync(path, "utf-8");
    const geojson = JSON.parse(content);
    return NextResponse.json(geojson);
  } catch (e) {
    console.error("Failed to load countries GeoJSON:", e);
    return NextResponse.json(
      { error: "Failed to load GeoJSON" },
      { status: 500 }
    );
  }
}
