import { getRegions } from "@/lib/girai/data";
import { resolveSubregion } from "./utils";

/**
 * Error payload for a geography argument the resolvers could not match.
 *
 * Silently dropping an unrecognised filter is the worst option: the tool then
 * returns the whole index and the model presents it as the requested slice —
 * "LATAM" once produced a leaderboard headed by Norway. Failing loudly, with
 * the valid values and a redirect when the name is really a subregion, lets
 * the model correct itself in the next step instead of inventing a result.
 */
export function unknownRegion(query: string) {
  const asSubregion = resolveSubregion(query);
  return {
    error: "Unknown region",
    query,
    availableRegions: getRegions(),
    ...(asSubregion
      ? {
          hint:
            `"${query}" is not a GIRAI region — it is the ${asSubregion.subregion} ` +
            `subregion of ${asSubregion.region}. Retry with the subregion parameter.`,
        }
      : {}),
  };
}

export function unknownSubregion(query: string) {
  return {
    error: "Unknown subregion",
    query,
    hint: "Call get_subregion_summary with includeAllSubregions to list valid subregions.",
  };
}
