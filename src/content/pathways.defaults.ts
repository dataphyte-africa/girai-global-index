import { PATHWAYS } from "@/components/evidence-hub/pathway-config";
import type { EvidencePathwayId } from "@/lib/girai/types";

export const PATHWAYS_TAG = "evidencePathway";

export type PathwayCopyEntry = {
  title: string;
  tableTitle: string;
  description: string;
  itemNoun: string;
};

export type PathwayCopyMap = Record<EvidencePathwayId, PathwayCopyEntry>;

/** Code defaults, derived from the structural pathway config. */
export const PATHWAY_COPY_DEFAULTS: PathwayCopyMap = PATHWAYS.reduce(
  (map, p) => {
    map[p.id] = {
      title: p.title,
      tableTitle: p.tableTitle,
      description: p.description,
      itemNoun: p.itemNoun,
    };
    return map;
  },
  {} as PathwayCopyMap
);
