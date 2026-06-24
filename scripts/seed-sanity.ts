/**
 * Seeds Sanity with the initial website copy and content images from /public.
 *
 * Usage:
 *   pnpm seed:sanity
 *
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and
 * SANITY_API_WRITE_TOKEN (loaded from .env.local).
 *
 * Idempotent: uses fixed singleton _ids with createOrReplace. Images are
 * uploaded once per public path (cached) using stable source ids.
 */
import { createClient } from "next-sanity";

import { aboutDefaults } from "../src/content/about.defaults";
import { homeDefaults } from "../src/content/home.defaults";
import { methodologyDefaults } from "../src/content/methodology.defaults";
import { takeawaysDefaults } from "../src/content/takeaways.defaults";
import { indicatorsDefaults } from "../src/content/indicators.defaults";
import { evidenceDefaults } from "../src/content/evidence.defaults";
import { regionsDefaults } from "../src/content/regions.defaults";
import { countriesDefaults } from "../src/content/countries.defaults";
import { headerDefaults } from "../src/content/header.defaults";
import { footerDefaults } from "../src/content/footer.defaults";
import { siteSettingsDefaults } from "../src/content/siteSettings.defaults";
import { uploadPublicImage } from "./seed-sanity-images";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-10-01",
  useCdn: false,
});

let keySeq = 0;
const key = () => `k${(keySeq++).toString(36)}`;

const cards = (items: { title: string; description: string }[]) =>
  items.map((c) => ({ _key: key(), _type: "titledCard", ...c }));

const ctas = (items: { label: string; href: string }[]) =>
  items.map((c) => ({ _key: key(), _type: "ctaLink", ...c }));

const paragraphs = (items: string[]) =>
  items.map((text) => ({ _key: key(), _type: "paragraph", text }));

const stats = (items: { label: string; value: string }[]) =>
  items.map((s) => ({ _key: key(), _type: "statItem", ...s }));

const editionChanges = (items: { dimension: string; before: string; now: string }[]) =>
  items.map((c) => ({ _key: key(), _type: "editionChange", ...c }));

const terms = (items: { title: string; definition: string }[]) =>
  items.map((t) => ({ _key: key(), _type: "definitionItem", ...t }));

const img = (field: Awaited<ReturnType<typeof uploadPublicImage>>) =>
  field ?? undefined;

async function buildAboutDoc() {
  console.log("Uploading About page images...");
  const [heroImage, gcgImage, measuresImage, whoForImage, footerImage] = await Promise.all([
    uploadPublicImage(client, aboutDefaults.heroImage),
    uploadPublicImage(client, aboutDefaults.gcgImage),
    uploadPublicImage(client, aboutDefaults.measuresImage),
    uploadPublicImage(client, aboutDefaults.whoForImage),
    uploadPublicImage(client, aboutDefaults.footerImage),
  ]);

  return {
    _id: "aboutPage",
    _type: "aboutPage",
    heroTitleLead: aboutDefaults.heroTitleLead,
    heroTitleAccent: aboutDefaults.heroTitleAccent,
    heroLead: aboutDefaults.heroLead,
    heroImage: img(heroImage),
    introHeadingLead: aboutDefaults.introHeadingLead,
    introHeadingMuted: aboutDefaults.introHeadingMuted,
    introBody: aboutDefaults.introBody,
    whyHeadingLead: aboutDefaults.whyHeadingLead,
    whyHeadingAccent: aboutDefaults.whyHeadingAccent,
    whyHeadingTail: aboutDefaults.whyHeadingTail,
    whySubtitle: aboutDefaults.whySubtitle,
    whyCards: cards(aboutDefaults.whyCards),
    gcgBadge: aboutDefaults.gcgBadge,
    gcgHeading: aboutDefaults.gcgHeading,
    gcgBody: aboutDefaults.gcgBody,
    gcgCta: { _type: "ctaLink", ...aboutDefaults.gcgCta },
    gcgImage: img(gcgImage),
    measuresBadge: aboutDefaults.measuresBadge,
    measuresHeadingLead: aboutDefaults.measuresHeadingLead,
    measuresHeadingAccent: aboutDefaults.measuresHeadingAccent,
    measuresBody: aboutDefaults.measuresBody,
    measuresImage: img(measuresImage),
    contributorsHeading: aboutDefaults.contributorsHeading,
    contributorsSubtitle: aboutDefaults.contributorsSubtitle,
    partners: aboutDefaults.partners.map((p) => ({
      _key: key(),
      _type: "partnerItem",
      name: p.name,
    })),
    whoForHeadingLead: aboutDefaults.whoForHeadingLead,
    whoForHeadingAccent: aboutDefaults.whoForHeadingAccent,
    whoForSubtitle: aboutDefaults.whoForSubtitle,
    audiences: cards(aboutDefaults.audiences),
    whoForImage: img(whoForImage),
    whoForSummary: aboutDefaults.whoForSummary,
    peopleHeadingLead: aboutDefaults.peopleHeadingLead,
    peopleHeadingAccent: aboutDefaults.peopleHeadingAccent,
    peopleHeadingTail: aboutDefaults.peopleHeadingTail,
    peopleSubtitle: aboutDefaults.peopleSubtitle,
    people: aboutDefaults.people,
    footerHeading: aboutDefaults.footerHeading,
    footerBody: aboutDefaults.footerBody,
    footerCta: { _type: "ctaLink", ...aboutDefaults.footerCta },
    footerImage: img(footerImage),
  };
}

async function buildMethodologyDoc() {
  console.log("Uploading Methodology page images...");
  const [heroImage, principlesImage, evidenceImage, accessImage, footerImage] =
    await Promise.all([
      uploadPublicImage(client, methodologyDefaults.heroImage),
      uploadPublicImage(client, methodologyDefaults.principlesImage),
      uploadPublicImage(client, methodologyDefaults.evidenceImage),
      uploadPublicImage(client, methodologyDefaults.accessImage),
      uploadPublicImage(client, methodologyDefaults.footerImage),
    ]);

  return {
    _id: "methodologyPage",
    _type: "methodologyPage",
    heroTitleLine1Lead: methodologyDefaults.heroTitleLine1Lead,
    heroTitleLine1Accent: methodologyDefaults.heroTitleLine1Accent,
    heroTitleLine2Accent: methodologyDefaults.heroTitleLine2Accent,
    heroTitleLine2Tail: methodologyDefaults.heroTitleLine2Tail,
    heroLead: methodologyDefaults.heroLead,
    heroCtaLabel: methodologyDefaults.heroCtaLabel,
    heroImage: img(heroImage),
    introHeadingLead: methodologyDefaults.introHeadingLead,
    introHeadingMuted: methodologyDefaults.introHeadingMuted,
    principlesBadge: methodologyDefaults.principlesBadge,
    principlesHeadingLead: methodologyDefaults.principlesHeadingLead,
    principlesHeadingTail: methodologyDefaults.principlesHeadingTail,
    principlesIntro: methodologyDefaults.principlesIntro,
    principlesImage: img(principlesImage),
    principles: cards(methodologyDefaults.principles),
    measuresHeadingLead: methodologyDefaults.measuresHeadingLead,
    measuresHeadingAccent: methodologyDefaults.measuresHeadingAccent,
    measuresHeadingTail: methodologyDefaults.measuresHeadingTail,
    measuresSubtitle: methodologyDefaults.measuresSubtitle,
    dimensions: cards(methodologyDefaults.dimensions),
    evolutionBadge: methodologyDefaults.evolutionBadge,
    evolutionHeadingLead: methodologyDefaults.evolutionHeadingLead,
    evolutionHeadingAccent: methodologyDefaults.evolutionHeadingAccent,
    evolutionParagraphs: paragraphs(methodologyDefaults.evolutionParagraphs),
    evolutionQuoteText: methodologyDefaults.evolutionQuoteText,
    evolutionQuoteAttribution: methodologyDefaults.evolutionQuoteAttribution,
    refinedHeadingLead: methodologyDefaults.refinedHeadingLead,
    refinedHeadingAccent: methodologyDefaults.refinedHeadingAccent,
    refinedSubtitle: methodologyDefaults.refinedSubtitle,
    refinements: cards(methodologyDefaults.refinements),
    editionHeadingAccent: methodologyDefaults.editionHeadingAccent,
    editionHeadingTail: methodologyDefaults.editionHeadingTail,
    editionSubtitle: methodologyDefaults.editionSubtitle,
    changes: editionChanges(methodologyDefaults.changes),
    keyTermsHeadingAccent: methodologyDefaults.keyTermsHeadingAccent,
    keyTermsHeadingTail: methodologyDefaults.keyTermsHeadingTail,
    keyTermsSubtitle: methodologyDefaults.keyTermsSubtitle,
    terms: terms(methodologyDefaults.terms),
    evidenceHeadingAccent: methodologyDefaults.evidenceHeadingAccent,
    evidenceHeadingTail: methodologyDefaults.evidenceHeadingTail,
    evidenceSubtitle: methodologyDefaults.evidenceSubtitle,
    evidenceRules: cards(methodologyDefaults.evidenceRules),
    evidenceImage: img(evidenceImage),
    accessBadge: methodologyDefaults.accessBadge,
    accessHeadingLead: methodologyDefaults.accessHeadingLead,
    accessHeadingTail: methodologyDefaults.accessHeadingTail,
    accessBody: methodologyDefaults.accessBody,
    accessCta: { _type: "ctaLink", ...methodologyDefaults.accessCta },
    accessImage: img(accessImage),
    processStats: stats(methodologyDefaults.processStats),
    processHeadingLead: methodologyDefaults.processHeadingLead,
    processHeadingAccent: methodologyDefaults.processHeadingAccent,
    processSubtitle: methodologyDefaults.processSubtitle,
    processBadge: methodologyDefaults.processBadge,
    processStagesHeadingAccent: methodologyDefaults.processStagesHeadingAccent,
    processStagesHeadingTail: methodologyDefaults.processStagesHeadingTail,
    processStagesIntro: methodologyDefaults.processStagesIntro,
    processSteps: cards(methodologyDefaults.processSteps),
    footerHeadingLine1: methodologyDefaults.footerHeadingLine1,
    footerHeadingLine2: methodologyDefaults.footerHeadingLine2,
    footerBody: methodologyDefaults.footerBody,
    footerCtaLabel: methodologyDefaults.footerCtaLabel,
    footerImage: img(footerImage),
  };
}

async function buildTakeawaysDoc() {
  console.log("Uploading Takeaways page images...");
  const heroImage = await uploadPublicImage(client, takeawaysDefaults.heroImage);

  return {
    _id: "takeawaysPage",
    _type: "takeawaysPage",
    heroTitleLead: takeawaysDefaults.heroTitleLead,
    heroTitleAccent: takeawaysDefaults.heroTitleAccent,
    heroLead: takeawaysDefaults.heroLead,
    heroStats: stats(takeawaysDefaults.heroStats),
    heroImage: img(heroImage),
    introHeadingLead: takeawaysDefaults.introHeadingLead,
    introHeadingMuted: takeawaysDefaults.introHeadingMuted,
    keyInsightsHeadingAccent: takeawaysDefaults.keyInsightsHeadingAccent,
    keyInsightsHeadingTail: takeawaysDefaults.keyInsightsHeadingTail,
    keyInsightsSubtitle: takeawaysDefaults.keyInsightsSubtitle,
    insights: cards(takeawaysDefaults.insights),
  };
}

async function buildSiteSettingsDoc() {
  console.log("Uploading Site Settings images...");
  const ogImage = await uploadPublicImage(client, {
    url: "/report-image.png",
    alt: "Global Index on Responsible AI 2026 Report cover",
  });

  return {
    _id: "siteSettings",
    _type: "siteSettings",
    defaultTitle: siteSettingsDefaults.defaultTitle,
    titleTemplate: siteSettingsDefaults.titleTemplate,
    description: siteSettingsDefaults.description,
    keywords: siteSettingsDefaults.keywords,
    ogTitle: siteSettingsDefaults.ogTitle,
    ogDescription: siteSettingsDefaults.ogDescription,
    ogImage: img(ogImage),
  };
}

function buildHomeDoc() {
  return {
    _id: "homePage",
    _type: "homePage",
    heroHeadlineLead: homeDefaults.heroHeadlineLead,
    heroHeadlineAccent: homeDefaults.heroHeadlineAccent,
    heroHeadlineTail: homeDefaults.heroHeadlineTail,
    heroSubtext: homeDefaults.heroSubtext,
    whyHeading: homeDefaults.whyHeading,
    whySubtitle: homeDefaults.whySubtitle,
    whyCtaLabel: homeDefaults.whyCtaLabel,
    whyParagraphs: paragraphs(homeDefaults.whyParagraphs),
    dimensionsHeadingLead: homeDefaults.dimensionsHeadingLead,
    dimensionsHeadingAccent: homeDefaults.dimensionsHeadingAccent,
    dimensionsSubtitle: homeDefaults.dimensionsSubtitle,
    reportBadge: homeDefaults.reportBadge,
    reportHeadingLead: homeDefaults.reportHeadingLead,
    reportHeadingAccent: homeDefaults.reportHeadingAccent,
    reportBody: homeDefaults.reportBody,
    reportPrimaryCtaLabel: homeDefaults.reportPrimaryCtaLabel,
    reportSecondaryCtaLabel: homeDefaults.reportSecondaryCtaLabel,
    takeawaysBadge: homeDefaults.takeawaysBadge,
    takeawaysHeadingAccent: homeDefaults.takeawaysHeadingAccent,
    takeawaysHeadingTail: homeDefaults.takeawaysHeadingTail,
    takeawaysSubtitle: homeDefaults.takeawaysSubtitle,
    takeawaysViewAllLabel: homeDefaults.takeawaysViewAllLabel,
    evidenceBadge: homeDefaults.evidenceBadge,
    evidenceHeading: homeDefaults.evidenceHeading,
    evidenceBody: homeDefaults.evidenceBody,
    evidenceCtaLabel: homeDefaults.evidenceCtaLabel,
    evidenceNote: homeDefaults.evidenceNote,
    indicatorsHeadingAccent: homeDefaults.indicatorsHeadingAccent,
    indicatorsHeadingTail: homeDefaults.indicatorsHeadingTail,
    indicatorsSubtitle: homeDefaults.indicatorsSubtitle,
    limitsHeadingLead: homeDefaults.limitsHeadingLead,
    limitsHeadingAccent: homeDefaults.limitsHeadingAccent,
    limitsSubtitle: homeDefaults.limitsSubtitle,
    limitsCards: cards(homeDefaults.limitsCards),
    impactHeadingLead: homeDefaults.impactHeadingLead,
    impactHeadingAccent: homeDefaults.impactHeadingAccent,
    impactSubtitle: homeDefaults.impactSubtitle,
    impactCards: cards(homeDefaults.impactCards),
    shapingHeadingLines: homeDefaults.shapingHeadingLines,
  };
}

function buildHeaderDoc() {
  return {
    _id: "header",
    _type: "header",
    primaryNav: ctas(headerDefaults.primaryNav),
    exploreLinks: ctas(headerDefaults.exploreLinks),
    downloadCta: { _type: "ctaLink", ...headerDefaults.downloadCta },
  };
}

function buildFooterDoc() {
  return {
    _id: "footer",
    _type: "footer",
    subscribeHeading: footerDefaults.subscribeHeading,
    subscribeBody: footerDefaults.subscribeBody,
    namePlaceholder: footerDefaults.namePlaceholder,
    emailPlaceholder: footerDefaults.emailPlaceholder,
    submitLabel: footerDefaults.submitLabel,
    resultsLinks: ctas(footerDefaults.resultsLinks),
    regionLinks: ctas(footerDefaults.regionLinks),
    otherProjectsLinks: ctas(footerDefaults.otherProjectsLinks),
    socialLinks: ctas(footerDefaults.socialLinks),
  };
}

async function buildIndicatorsDoc() {
  console.log("Uploading Indicators page images...");
  const heroImage = await uploadPublicImage(client, indicatorsDefaults.heroImage);

  return {
    _id: "indicatorsPage",
    _type: "indicatorsPage",
    heroTitleAccent: indicatorsDefaults.heroTitleAccent,
    heroTitleTail: indicatorsDefaults.heroTitleTail,
    heroLead: indicatorsDefaults.heroLead,
    heroImage: img(heroImage),
    seoTitle: indicatorsDefaults.seoTitle,
    seoDescription: indicatorsDefaults.seoDescription,
  };
}

function buildEvidenceDoc() {
  return {
    _id: "evidencePage",
    _type: "evidencePage",
    heroTitleLead: evidenceDefaults.heroTitleLead,
    heroTitleAccent: evidenceDefaults.heroTitleAccent,
    heroSubtitle: evidenceDefaults.heroSubtitle,
    heroStatLabels: evidenceDefaults.heroStatLabels,
    pathwayHeading: evidenceDefaults.pathwayHeading,
    pathwaySubtitle: evidenceDefaults.pathwaySubtitle,
    seoTitle: evidenceDefaults.seoTitle,
    seoDescription: evidenceDefaults.seoDescription,
  };
}

function buildRegionsDoc() {
  return {
    _id: "regionsPage",
    _type: "regionsPage",
    heroTitleLine1: regionsDefaults.heroTitleLine1,
    heroTitleAccent: regionsDefaults.heroTitleAccent,
    heroSubtitle: regionsDefaults.heroSubtitle,
    overviewHeading: regionsDefaults.overviewHeading,
    overviewSubtitle: regionsDefaults.overviewSubtitle,
    compareHeadingLead: regionsDefaults.compareHeadingLead,
    compareHeadingAccent: regionsDefaults.compareHeadingAccent,
    compareSubheading: regionsDefaults.compareSubheading,
    seoTitle: regionsDefaults.seoTitle,
    seoDescription: regionsDefaults.seoDescription,
  };
}

function buildCountriesDoc() {
  return {
    _id: "countriesPage",
    _type: "countriesPage",
    heroTitleLine1: countriesDefaults.heroTitleLine1,
    heroTitleAccent: countriesDefaults.heroTitleAccent,
    heroSubtitle: countriesDefaults.heroSubtitle,
    compareHeadingLead: countriesDefaults.compareHeadingLead,
    compareHeadingAccent: countriesDefaults.compareHeadingAccent,
    compareSubheading: countriesDefaults.compareSubheading,
    takeawaysHeadingAccent: countriesDefaults.takeawaysHeadingAccent,
    takeawaysHeadingTail: countriesDefaults.takeawaysHeadingTail,
    takeawaysSubtitle: countriesDefaults.takeawaysSubtitle,
    seoTitle: countriesDefaults.seoTitle,
    seoDescription: countriesDefaults.seoDescription,
  };
}

async function main() {
  console.log(`Seeding "${dataset}" (project ${projectId})...`);

  const docs = [
    { label: "siteSettings", doc: await buildSiteSettingsDoc() },
    { label: "header", doc: buildHeaderDoc() },
    { label: "footer", doc: buildFooterDoc() },
    { label: "homePage", doc: buildHomeDoc() },
    { label: "aboutPage", doc: await buildAboutDoc() },
    { label: "methodologyPage", doc: await buildMethodologyDoc() },
    { label: "takeawaysPage", doc: await buildTakeawaysDoc() },
    { label: "indicatorsPage", doc: await buildIndicatorsDoc() },
    { label: "evidencePage", doc: buildEvidenceDoc() },
    { label: "regionsPage", doc: buildRegionsDoc() },
    { label: "countriesPage", doc: buildCountriesDoc() },
  ];

  for (const { label, doc } of docs) {
    await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0]);
    console.log(`✓ ${label} seeded`);
  }

  console.log("Done. Open /studio to review and publish.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
