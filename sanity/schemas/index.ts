import type { SchemaTypeDefinition } from "sanity";

import { ctaLink } from "./objects/ctaLink";
import { contentImage } from "./objects/contentImage";
import { titledCard } from "./objects/titledCard";
import { partnerItem } from "./objects/partnerItem";
import { statItem } from "./objects/statItem";
import { paragraph } from "./objects/paragraph";
import { editionChange } from "./objects/editionChange";
import { definitionItem } from "./objects/definitionItem";

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

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  ctaLink,
  contentImage,
  titledCard,
  partnerItem,
  statItem,
  paragraph,
  editionChange,
  definitionItem,
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
]);
