import { readFileSync } from "fs";
import { join } from "path";
import type { RankingData, FullRankingData } from "@/data/countries";
import {
  selectMixedCountries,
  generateArcData,
  type Country,
  type ArcPosition,
} from "@/data/countries";

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += c;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseRankingCSV(content: string): RankingData[] {
  const lines = content.split(/\r?\n/).filter(Boolean);
  const data: RankingData[] = [];
  // Skip header (line 0) and sub-header (line 1)
  for (let i = 2; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const ranking = parseInt(cols[0], 10);
    const iso3 = cols[1];
    const country = cols[2];
    const giraiRegion = cols[3];
    const unRegion = cols[4];
    const unSubregion = cols[5];
    const indexScore = parseFloat(cols[6]) || 0;
    if (!iso3 || isNaN(ranking)) continue;
    data.push({
      ranking,
      iso3,
      country,
      giraiRegion,
      unRegion,
      unSubregion,
      indexScore,
    });
  }
  return data;
}

function parseNum(value: string): number {
  const n = parseFloat(value);
  return Number.isNaN(n) ? 0 : n;
}

export function parseFullRankingCSV(content: string): FullRankingData[] {
  const lines = content.split(/\r?\n/).filter(Boolean);
  const data: FullRankingData[] = [];
  for (let i = 2; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const ranking = parseInt(cols[0], 10);
    const iso3 = cols[1];
    const country = cols[2];
    const giraiRegion = cols[3];
    const unRegion = cols[4];
    const unSubregion = cols[5];
    const indexScore = parseNum(cols[6]);
    if (!iso3 || isNaN(ranking)) continue;
    data.push({
      ranking,
      iso3,
      country,
      giraiRegion,
      unRegion,
      unSubregion,
      indexScore,
      pillarScores: {
        governmentFrameworks: parseNum(cols[7]),
        governmentActions: parseNum(cols[8]),
        nonStateActors: parseNum(cols[9]),
      },
      dimensionScores: {
        humanRightsAI: parseNum(cols[10]),
        responsibleAIGovernance: parseNum(cols[11]),
        responsibleAICapacities: parseNum(cols[12]),
      },
      coefficients: {
        governmentFrameworks: parseNum(cols[13]),
        governmentActions: parseNum(cols[14]),
        nonStateActors: parseNum(cols[15]),
      },
    });
  }
  return data;
}

export function getFullRankingData(): FullRankingData[] {
  const path = join(process.cwd(), "src/data/ranking.csv");
  const content = readFileSync(path, "utf-8");
  return parseFullRankingCSV(content);
}

export function getHeroGlobeData(): {
  arcData: ArcPosition[];
  markers: Country[];
} {
  const path = join(process.cwd(), "src/data/ranking.csv");
  const content = readFileSync(path, "utf-8");
  const rankings = parseRankingCSV(content);
  const markers = selectMixedCountries(rankings, 20);
  const arcData = generateArcData(markers, 15);
  return { arcData, markers };
}

export function getTopAndBottomCountries(count: number = 10): {
  topCountries: RankingData[];
  bottomCountries: RankingData[];
} {
  const path = join(process.cwd(), "src/data/ranking.csv");
  const content = readFileSync(path, "utf-8");
  const rankings = parseRankingCSV(content);
  
  // Sort by ranking (ascending for top, descending for bottom)
  const sorted = [...rankings].sort((a, b) => a.ranking - b.ranking);
  
  const topCountries = sorted.slice(0, count);
  const bottomCountries = sorted.slice(-count).reverse(); // Reverse to show worst first
  
  return { topCountries, bottomCountries };
}

export type RegionAggregatedData = {
  region: string;
  averageScore: number;
  countryCount: number;
  globalRank: number;
  pillarScores: {
    governmentFrameworks: number;
    governmentActions: number;
    nonStateActors: number;
  };
  dimensionScores: {
    humanRightsAI: number;
    responsibleAIGovernance: number;
    responsibleAICapacities: number;
  };
};

export function getRegionalAggregatedData(): RegionAggregatedData[] {
  const fullData = getFullRankingData();
  
  // Group by GIRAI region
  const regionMap = new Map<string, FullRankingData[]>();
  for (const country of fullData) {
    const region = country.giraiRegion || "Other";
    if (!regionMap.has(region)) {
      regionMap.set(region, []);
    }
    regionMap.get(region)!.push(country);
  }
  
  // Aggregate data for each region
  const aggregatedData: RegionAggregatedData[] = [];
  
  for (const [region, countries] of regionMap) {
    if (countries.length === 0) continue;
    
    const avgScore = countries.reduce((sum, c) => sum + c.indexScore, 0) / countries.length;
    
    const avgPillarScores = {
      governmentFrameworks: countries.reduce((sum, c) => sum + c.pillarScores.governmentFrameworks, 0) / countries.length,
      governmentActions: countries.reduce((sum, c) => sum + c.pillarScores.governmentActions, 0) / countries.length,
      nonStateActors: countries.reduce((sum, c) => sum + c.pillarScores.nonStateActors, 0) / countries.length,
    };
    
    const avgDimensionScores = {
      humanRightsAI: countries.reduce((sum, c) => sum + c.dimensionScores.humanRightsAI, 0) / countries.length,
      responsibleAIGovernance: countries.reduce((sum, c) => sum + c.dimensionScores.responsibleAIGovernance, 0) / countries.length,
      responsibleAICapacities: countries.reduce((sum, c) => sum + c.dimensionScores.responsibleAICapacities, 0) / countries.length,
    };
    
    aggregatedData.push({
      region,
      averageScore: avgScore,
      countryCount: countries.length,
      globalRank: 0, // Will be calculated after sorting
      pillarScores: avgPillarScores,
      dimensionScores: avgDimensionScores,
    });
  }
  
  // Sort by average score and assign global ranks
  aggregatedData.sort((a, b) => b.averageScore - a.averageScore);
  aggregatedData.forEach((data, index) => {
    data.globalRank = index + 1;
  });
  
  return aggregatedData;
}

export function getUniqueRegions(): string[] {
  const fullData = getFullRankingData();
  const regions = new Set<string>();
  for (const country of fullData) {
    if (country.giraiRegion) {
      regions.add(country.giraiRegion);
    }
  }
  return Array.from(regions).sort();
}