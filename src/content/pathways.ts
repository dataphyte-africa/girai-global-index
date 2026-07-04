import type { EvidencePathwayId } from "@/lib/girai/types";
import { sanityFetch } from "../../sanity/lib/fetch";
import { pathwaysCopyQuery } from "../../sanity/lib/queries";
import {
  PATHWAY_COPY_DEFAULTS,
  PATHWAYS_TAG,
  type PathwayCopyMap,
} from "./pathways.defaults";
import { str } from "./_merge";

export {
  PATHWAY_COPY_DEFAULTS,
  PATHWAYS_TAG,
  type PathwayCopyEntry,
  type PathwayCopyMap,
} from "./pathways.defaults";

type PathwayDoc = {
  pathwayId?: string;
  title?: string;
  tableTitle?: string;
  description?: string;
  itemNoun?: string;
};

/**
 * Editable pathway copy, merged over the code defaults. Falls back to defaults
 * for any field/pathway missing from Sanity.
 */
export async function getPathwayCopy(): Promise<PathwayCopyMap> {
  let docs: PathwayDoc[] | null = null;
  try {
    docs = await sanityFetch<PathwayDoc[] | null>({
      query: pathwaysCopyQuery,
      tags: [PATHWAYS_TAG],
    });
  } catch {
    docs = null;
  }

  const byId = new Map<string, PathwayDoc>(
    (docs ?? [])
      .filter((d): d is PathwayDoc & { pathwayId: string } => typeof d?.pathwayId === "string")
      .map((d) => [d.pathwayId, d])
  );

  const ids = Object.keys(PATHWAY_COPY_DEFAULTS) as EvidencePathwayId[];
  return ids.reduce((map, id) => {
    const d = PATHWAY_COPY_DEFAULTS[id];
    const s = byId.get(id);
    map[id] = {
      title: str(s?.title, d.title),
      tableTitle: str(s?.tableTitle, d.tableTitle),
      description: str(s?.description, d.description),
      itemNoun: str(s?.itemNoun, d.itemNoun),
    };
    return map;
  }, {} as PathwayCopyMap);
}
