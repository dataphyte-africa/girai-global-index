import type { SchemaTypeDefinition } from "sanity";

import { ctaLink } from "./objects/ctaLink";
import { contentImage } from "./objects/contentImage";
import { funderLogo } from "./objects/funderLogo";
import { titledCard } from "./objects/titledCard";
import { partnerItem } from "./objects/partnerItem";
import { committeeMember } from "./objects/committeeMember";
import { statItem } from "./objects/statItem";
import { paragraph } from "./objects/paragraph";
import { editionChange } from "./objects/editionChange";
import { definitionItem } from "./objects/definitionItem";
import { blockContent } from "./objects/blockContent";
import { richText } from "./objects/richText";
import { findingChart } from "./objects/findingChart";
import { findingTable } from "./objects/findingTable";
import { findingBody } from "./objects/findingBody";
import { keyFinding } from "./objects/keyFinding";

import { siteSettings } from "./singletons/siteSettings";
import { header } from "./singletons/header";
import { footer } from "./singletons/footer";
import { aboutPage } from "./singletons/aboutPage";
import { takeawaysPage } from "./singletons/takeawaysPage";
import { methodologyPage } from "./singletons/methodologyPage";
import { homePage } from "./singletons/homePage";
import { indicatorsPage } from "./singletons/indicatorsPage";
import { evidencePage } from "./singletons/evidencePage";
import { regionsPage } from "./singletons/regionsPage";
import { countriesPage } from "./singletons/countriesPage";
import { downloadModal } from "./singletons/downloadModal";
import { reportDownload } from "./singletons/reportDownload";
import { keyFindings } from "./singletons/keyFindings";

import { pillar } from "./documents/pillar";
import { dimensionCopy } from "./documents/dimensionCopy";
import { indicatorPage } from "./documents/indicatorPage";
import { evidencePathway } from "./documents/evidencePathway";
import { regionPage } from "./documents/regionPage";
import { updatePost } from "./documents/updatePost";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  ctaLink,
  contentImage,
  funderLogo,
  titledCard,
  partnerItem,
  committeeMember,
  statItem,
  paragraph,
  editionChange,
  definitionItem,
  blockContent,
  richText,
  findingChart,
  findingTable,
  findingBody,
  keyFinding,
  // Singletons
  siteSettings,
  header,
  footer,
  homePage,
  aboutPage,
  methodologyPage,
  takeawaysPage,
  indicatorsPage,
  evidencePage,
  regionsPage,
  countriesPage,
  downloadModal,
  reportDownload,
  keyFindings,
  // Fixed collections (one document per entity)
  pillar,
  dimensionCopy,
  indicatorPage,
  evidencePathway,
  regionPage,
  // Free collections (editors create/edit/delete)
  updatePost,
];

/** Document types that are edited as a single, fixed document (no create/delete). */
export const singletonTypes = new Set([
  "siteSettings",
  "header",
  "footer",
  "homePage",
  "aboutPage",
  "methodologyPage",
  "takeawaysPage",
  "indicatorsPage",
  "evidencePage",
  "regionsPage",
  "countriesPage",
  "downloadModal",
  "reportDownload",
  "keyFindings",
  // Fixed collections: a known set seeded with stable ids, edited in place.
  // Treated like singletons so Studio hides create/delete for them.
  "pillar",
  "dimensionCopy",
  "indicatorPage",
  "evidencePathway",
  "regionPage",
]);
