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
import { downloadModalDefaults } from "../src/content/downloadModal.defaults";
import { reportDownloadDefaults } from "../src/content/reportDownload.defaults";
import { PILLAR_COPY } from "../src/lib/pillar-copy";
import { REGION_COPY, regionToSlug } from "../src/lib/regions";
import { DIMENSIONS as DIMENSIONS_UI } from "../src/data/dimensions-data";
import { INDICATORS } from "../src/data/2026/taxonomy";
import {
  getIndicatorPageCopy,
  getIndicatorBackgroundRelevance,
  type IndicatorParagraph,
} from "../src/lib/indicator-copy";
import { PATHWAYS } from "../src/components/evidence-hub/pathway-config";
import { headerDefaults } from "../src/content/header.defaults";
import { footerDefaults } from "../src/content/footer.defaults";
import { siteSettingsDefaults } from "../src/content/siteSettings.defaults";
import { updatesSeed } from "../src/content/updates.defaults";
import { TAKEAWAYS } from "../src/components/takeaways/takeaways-data";
import type {
  Takeaway,
  TakeawayVisual,
} from "../src/components/takeaways/types";
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

const takeawayCards = (
  items: {
    category: string;
    title: string;
    description: string;
    stat: string;
    statCaption: string;
  }[]
) => items.map((c) => ({ _key: key(), _type: "object", ...c }));

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

/** Turn plain paragraphs into Portable Text `block` nodes. */
const blockBody = (items: string[]) =>
  items.map((text) => ({
    _key: key(),
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [{ _key: key(), _type: "span", text, marks: [] }],
  }));

/** Turn plain strings into Portable Text bullet-list `block` nodes. */
const bulletList = (items: string[]) =>
  items.map((text) => ({
    _key: key(),
    _type: "block",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [{ _key: key(), _type: "span", text, marks: [] }],
  }));

/** A `findingTable` block for the Key Findings body. */
const findingTableNode = (
  columns: string[],
  rows: string[][],
  caption?: string,
  emphasizeLastRow?: boolean
) => ({
  _key: key(),
  _type: "findingTable",
  columns,
  rows: rows.map((cells) => ({ _key: key(), _type: "row", cells })),
  ...(caption ? { caption } : {}),
  ...(emphasizeLastRow ? { emphasizeLastRow: true } : {}),
});

/** Upload a chart image and return a `findingChart` block, or null on failure. */
async function findingChartNode(
  src: string,
  alt: string,
  caption?: string
) {
  const uploaded = await uploadPublicImage(client, { url: src, alt });
  if (!uploaded) return null;
  return {
    _key: key(),
    ...uploaded,
    _type: "findingChart",
    ...(caption ? { caption } : {}),
  };
}

/**
 * Convert one report visual into body block(s). Visuals with an exported chart
 * image become inline `findingChart` images; data-only visuals become
 * `findingTable`s so no numbers are lost. Hidden visuals are skipped.
 */
async function visualToBlocks(v: TakeawayVisual) {
  if (v.hidden) return [];

  if (v.image) {
    const node = await findingChartNode(
      v.image.src,
      v.image.alt,
      v.caption ?? v.title
    );
    return node ? [node] : [];
  }

  switch (v.kind) {
    case "table":
      return [
        findingTableNode(v.columns, v.rows, v.caption ?? v.title, v.emphasizeLastRow),
      ];
    case "indicatorRankBar":
      return [
        findingTableNode(
          ["Indicator", "Value"],
          v.data.map((d) => [d.label, `${d.value}%`]),
          v.caption ?? v.title
        ),
      ];
    case "regionalBar":
      return [
        findingTableNode(
          ["Region", "Value", "Regional avg", "Deviation (pp)"],
          v.data.map((d) => [
            d.region,
            `${d.value}%`,
            `${d.regionalAvg}%`,
            `${d.deviationPp > 0 ? "+" : ""}${d.deviationPp}`,
          ]),
          v.caption ?? v.title
        ),
      ];
    case "ratioBar":
      return [
        findingTableNode(
          ["Indicator", "Framework", "Implementation", "Ratio"],
          v.data.map((d) => [
            d.label,
            String(d.framework),
            String(d.implementation),
            `${d.ratio}%`,
          ]),
          v.caption ?? v.title
        ),
      ];
    case "groupedBar": {
      const unit = v.unit === "count" ? "" : "%";
      return [
        findingTableNode(
          ["Group", ...v.series.map((s) => s.label)],
          v.categories.map((c) => [
            c.category,
            ...v.series.map((s) => {
              const bar = c.bars.find((b) => b.seriesKey === s.key);
              return bar ? `${bar.value}${unit}` : "—";
            }),
          ]),
          v.caption ?? v.title
        ),
      ];
    }
    default:
      // comparisonColumns / heatmap / bubbleMap always ship with an image in the
      // report data and are handled by the `v.image` branch above.
      return [];
  }
}

/** Build the Portable Text `findingBody` for one takeaway. */
async function buildFindingBody(t: Takeaway) {
  const body: unknown[] = [...bulletList(t.narrative)];
  for (const v of t.visuals) {
    body.push(...(await visualToBlocks(v)));
  }
  return body;
}

async function buildKeyFindingsDoc() {
  console.log("Uploading Key Findings chart images...");
  const findings = [];
  for (const t of TAKEAWAYS) {
    findings.push({
      _key: key(),
      _type: "keyFinding",
      title: t.title,
      summary: blockBody([t.summary]),
      body: await buildFindingBody(t),
      ...(t.brightSpot
        ? {
            brightSpotCountry: t.brightSpot.country,
            brightSpotBody: blockBody([t.brightSpot.body]),
          }
        : {}),
    });
  }

  return {
    _id: "keyFindings",
    _type: "keyFindings",
    headingAccent: "Key",
    headingTail: "Findings",
    subtitle:
      "Strengthening Clarity, Comparability, and Implementation Focus",
    findings,
  };
}

/**
 * Turn inline text/link segment paragraphs (indicator Background / Relevance
 * defaults) into Portable Text `block` nodes with `link` annotations.
 */
const richTextBody = (paragraphs: IndicatorParagraph[]) =>
  paragraphs.map((segments) => {
    const markDefs: { _key: string; _type: "link"; href: string }[] = [];
    const children = segments.map((seg) => {
      const marks: string[] = [];
      if (seg.href) {
        const linkKey = key();
        markDefs.push({ _key: linkKey, _type: "link", href: seg.href });
        marks.push(linkKey);
      }
      return { _key: key(), _type: "span", text: seg.text, marks };
    });
    return { _key: key(), _type: "block", style: "normal", markDefs, children };
  });

async function buildAboutDoc() {
  console.log("Uploading About page images...");
  const [heroImage, gcgImage, measuresImage, whoForImage, footerImage] = await Promise.all([
    uploadPublicImage(client, aboutDefaults.heroImage),
    uploadPublicImage(client, aboutDefaults.gcgImage),
    uploadPublicImage(client, aboutDefaults.measuresImage),
    uploadPublicImage(client, aboutDefaults.whoForImage),
    uploadPublicImage(client, aboutDefaults.footerImage),
  ]);

  const partners = await Promise.all(
    aboutDefaults.partners.map(async (p) => {
      const logo = await uploadPublicImage(client, p.logo);
      return {
        _key: key(),
        _type: "partnerItem",
        name: p.name,
        ...(logo ? { logo } : {}),
      };
    })
  );

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
    partners,
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
    committeeHeading: aboutDefaults.committeeHeading,
    committeeSubtitle: aboutDefaults.committeeSubtitle,
    committeeMembers: aboutDefaults.committeeMembers.map((m) => ({
      _key: key(),
      _type: "committeeMember",
      name: m.name,
      affiliation: m.affiliation,
    })),
    impactHeadingLead: aboutDefaults.impactHeadingLead,
    impactHeadingAccent: aboutDefaults.impactHeadingAccent,
    impactSubtitle: aboutDefaults.impactSubtitle,
    impactCards: cards(aboutDefaults.impactCards),
    impactCtaLabel: aboutDefaults.impactCtaLabel,
    impactCtaHref: aboutDefaults.impactCtaHref,
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
    url: "/report-image.jpg",
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

async function buildHomeDoc() {
  console.log("Uploading Home 'trusted by' partner logos...");
  const usedByPartners = await Promise.all(
    homeDefaults.usedByPartners.map(async (p) => {
      const logo = await uploadPublicImage(client, p.logo);
      return {
        _key: key(),
        _type: "partnerItem",
        name: p.name,
        ...(logo ? { logo } : {}),
      };
    })
  );

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
    takeawaysBadge: homeDefaults.takeawaysBadge,
    takeawaysHeadingAccent: homeDefaults.takeawaysHeadingAccent,
    takeawaysHeadingTail: homeDefaults.takeawaysHeadingTail,
    takeawaysSubtitle: homeDefaults.takeawaysSubtitle,
    takeawaysViewAllLabel: homeDefaults.takeawaysViewAllLabel,
    takeawaysCards: takeawayCards(homeDefaults.takeawaysCards),
    evidenceBadge: homeDefaults.evidenceBadge,
    evidenceHeading: homeDefaults.evidenceHeading,
    evidenceBody: homeDefaults.evidenceBody,
    evidenceCtaLabel: homeDefaults.evidenceCtaLabel,
    evidenceNote: homeDefaults.evidenceNote,
    evidenceStats: stats(homeDefaults.evidenceStats),
    performanceHeadingLead: homeDefaults.performanceHeadingLead,
    performanceHeadingAccent: homeDefaults.performanceHeadingAccent,
    performanceHeadingTail: homeDefaults.performanceHeadingTail,
    performanceSubtitle: homeDefaults.performanceSubtitle,
    compareHeadingLead: homeDefaults.compareHeadingLead,
    compareHeadingAccent: homeDefaults.compareHeadingAccent,
    compareSubheading: homeDefaults.compareSubheading,
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
    impactCtaLabel: homeDefaults.impactCtaLabel,
    ...(homeDefaults.impactCtaHref
      ? { impactCtaHref: homeDefaults.impactCtaHref }
      : {}),
    usedByHeading: homeDefaults.usedByHeading,
    usedBySubtitle: homeDefaults.usedBySubtitle,
    usedByPartners,
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

async function buildFooterDoc() {
  console.log("Uploading Footer funder logos...");
  const funderLogos = (
    await Promise.all(
      footerDefaults.funderLogos.map(async (f) => {
        const logo = await uploadPublicImage(client, f.logo);
        if (!logo) return null;
        return {
          _key: key(),
          _type: "funderLogo",
          name: f.name,
          logo,
          ...(f.url ? { url: f.url } : {}),
        };
      })
    )
  ).filter((f): f is NonNullable<typeof f> => f !== null);

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
    funderNoteText: footerDefaults.funderNoteText,
    funderLogos,
    ...(footerDefaults.funderLink
      ? { funderLink: footerDefaults.funderLink }
      : {}),
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
    performanceHeadingLead: countriesDefaults.performanceHeadingLead,
    performanceHeadingAccent: countriesDefaults.performanceHeadingAccent,
    performanceHeadingTail: countriesDefaults.performanceHeadingTail,
    performanceSubtitle: countriesDefaults.performanceSubtitle,
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

async function buildDownloadModalDoc() {
  console.log("Uploading Download Modal image...");
  const formImage = await uploadPublicImage(client, downloadModalDefaults.formImage);
  return {
    _id: "downloadModal",
    _type: "downloadModal",
    title: downloadModalDefaults.title,
    description: downloadModalDefaults.description,
    editionFirstLabel: downloadModalDefaults.editionFirstLabel,
    editionSecondLabel: downloadModalDefaults.editionSecondLabel,
    formImage: img(formImage),
    fullNameLabel: downloadModalDefaults.fullNameLabel,
    fullNamePlaceholder: downloadModalDefaults.fullNamePlaceholder,
    emailLabel: downloadModalDefaults.emailLabel,
    emailPlaceholder: downloadModalDefaults.emailPlaceholder,
    organizationLabel: downloadModalDefaults.organizationLabel,
    organizationPlaceholder: downloadModalDefaults.organizationPlaceholder,
    roleLabel: downloadModalDefaults.roleLabel,
    rolePlaceholder: downloadModalDefaults.rolePlaceholder,
    reasonLabel: downloadModalDefaults.reasonLabel,
    reasonPlaceholder: downloadModalDefaults.reasonPlaceholder,
    reasons: downloadModalDefaults.reasons.map((r) => ({ _key: key(), ...r })),
    licenseTextBefore: downloadModalDefaults.licenseTextBefore,
    licenseLinkLabel: downloadModalDefaults.licenseLinkLabel,
    licenseLinkHref: downloadModalDefaults.licenseLinkHref,
    consentTextBefore: downloadModalDefaults.consentTextBefore,
    consentLinkLabel: downloadModalDefaults.consentLinkLabel,
    consentLinkHref: downloadModalDefaults.consentLinkHref,
    consentTextAfter: downloadModalDefaults.consentTextAfter,
    consentErrorText: downloadModalDefaults.consentErrorText,
    submitLabel: downloadModalDefaults.submitLabel,
    submittingLabel: downloadModalDefaults.submittingLabel,
    imageAlt: downloadModalDefaults.imageAlt,
    citationHeadingTemplate: downloadModalDefaults.citationHeadingTemplate,
    citationBody: downloadModalDefaults.citationBody,
    methodologyHeading: downloadModalDefaults.methodologyHeading,
    methodologyBody: downloadModalDefaults.methodologyBody,
  };
}

async function buildReportDownloadDoc() {
  console.log("Uploading Report Download cover image...");
  const coverImage = await uploadPublicImage(client, reportDownloadDefaults.coverImage);
  return {
    _id: "reportDownload",
    _type: "reportDownload",
    badge: reportDownloadDefaults.badge,
    headingLead: reportDownloadDefaults.headingLead,
    headingAccent: reportDownloadDefaults.headingAccent,
    body: reportDownloadDefaults.body,
    coverImage: img(coverImage),
    primaryCtaLabel: reportDownloadDefaults.primaryCtaLabel,
    secondaryCtaLabel: reportDownloadDefaults.secondaryCtaLabel,
  };
}

/** Fixed collections — stable ids must match sanity/structure.ts. */
async function buildPillarDocs() {
  console.log("Uploading Pillar card images...");
  const slugs = Object.keys(PILLAR_COPY) as (keyof typeof PILLAR_COPY)[];
  return Promise.all(
    slugs.map(async (slug) => {
      const c = PILLAR_COPY[slug];
      const image = await uploadPublicImage(client, { url: c.image, alt: c.heading });
      return {
        _id: `pillar-${slug}`,
        _type: "pillar",
        slug,
        heading: c.heading,
        body: c.body,
        image: img(image),
        driversDescription: c.driversDescription,
      };
    })
  );
}

function buildDimensionDocs() {
  return DIMENSIONS_UI.map((d) => ({
    _id: `dimension-${d.id}`,
    _type: "dimensionCopy",
    slug: d.id,
    subtitle: d.subtitle,
    description: d.description,
    eyebrow: d.eyebrow,
    heroLead: d.heroLead,
    rankingSubtitle: d.rankingSubtitle,
  }));
}

async function buildUpdateDocs() {
  console.log("Uploading Update images...");
  return Promise.all(
    updatesSeed.map(async (u) => {
      const cover = await uploadPublicImage(client, u.image);
      return {
        _id: `update-${u.slug}`,
        _type: "updatePost",
        title: u.title,
        slug: { _type: "slug", current: u.slug },
        category: u.category,
        publishedAt: u.publishedAt,
        ...(u.author ? { author: u.author } : {}),
        featured: Boolean(u.featured),
        coverImage: img(cover),
        excerpt: u.excerpt,
        body: blockBody(u.body),
      };
    })
  );
}

function buildIndicatorPageDocs() {
  return INDICATORS.map((ind) => {
    const copy = getIndicatorPageCopy(ind.slug);
    const { background, relevance } = getIndicatorBackgroundRelevance(
      ind.slug,
      ind.name
    );
    return {
      _id: `indicator-${ind.slug}`,
      _type: "indicatorPage",
      title: ind.name,
      slug: ind.slug,
      heroLead: copy.heroLead,
      introPrimary: copy.introPrimary,
      introSecondary: copy.introSecondary,
      background: richTextBody(background),
      relevance: richTextBody(relevance),
    };
  });
}

/**
 * Hero banner for each indicator detail page, seeded onto the existing
 * `indicatorPage` docs. Written with `setIfMissing` (see main()) so it only adds
 * an image where none exists — never clobbering copy or an editor's upload.
 * Each indicator defaults to the shared banner; override via
 * `IndicatorCopy.heroImage` in src/lib/indicator-copy.ts.
 */
async function buildIndicatorHeroImagePatches() {
  console.log("Uploading Indicator hero images...");
  return Promise.all(
    INDICATORS.map(async (ind) => {
      const { heroImage } = getIndicatorPageCopy(ind.slug);
      const image = await uploadPublicImage(client, {
        url: heroImage,
        alt: ind.name,
      });
      return {
        label: `indicator-image/${ind.slug}`,
        id: `indicator-${ind.slug}`,
        heroImage: img(image),
      };
    })
  );
}

/**
 * Seed each indicator's display name onto its `indicatorPage` doc without
 * clobbering an editor's rename. Written with `setIfMissing` (see main()) so it
 * only adds a `title` where none exists — a full re-seed or a scoped
 * `pnpm seed:sanity indicator-title` run leaves an existing (possibly edited)
 * name untouched. The canonical fallback lives in src/data/2026/taxonomy.ts.
 */
function buildIndicatorTitlePatches() {
  return INDICATORS.map((ind) => ({
    label: `indicator-title/${ind.slug}`,
    id: `indicator-${ind.slug}`,
    title: ind.name,
  }));
}

/**
 * Slugs whose display name changed in the taxonomy and whose Sanity `title`
 * must be force-synced to match. Unlike buildIndicatorTitlePatches
 * (`setIfMissing`), the rename pass OVERWRITES an existing title — but only the
 * `title`, on only these docs, leaving all editorial copy and hero images
 * untouched. Run with `pnpm seed:sanity indicator-rename`. Extend this list the
 * next time an indicator is renamed in src/data/2026/taxonomy.ts.
 */
const RENAMED_INDICATOR_SLUGS = [
  "socioeconomic-inclusion-connectivity", // → Device Affordability
  "gender-inclusion-connectivity", // → Gender Gap in Mobile Internet
  "environmental-performance", // → Low-Carbon Energy Share
  "population-digital-readiness", // → Skills & Literacy
  "labour-rights", // → Labour Rights & Compliance
  "civil-society-oversight", // → Civil Society Accountability
  "right-to-information", // → Access to Public Information
];

function buildIndicatorRenamePatches() {
  return RENAMED_INDICATOR_SLUGS.map((slug) => {
    const ind = INDICATORS.find((i) => i.slug === slug);
    if (!ind) throw new Error(`Unknown indicator slug in rename list: ${slug}`);
    return {
      label: `indicator-rename/${slug}`,
      id: `indicator-${slug}`,
      title: ind.name,
    };
  });
}

function buildPathwayDocs() {
  return PATHWAYS.map((p) => ({
    _id: `pathway-${p.id}`,
    _type: "evidencePathway",
    pathwayId: p.id,
    title: p.title,
    tableTitle: p.tableTitle,
    description: p.description,
    itemNoun: p.itemNoun,
  }));
}

function buildRegionPageDocs() {
  return Object.entries(REGION_COPY).map(([name, c]) => ({
    _id: `region-${regionToSlug(name)}`,
    _type: "regionPage",
    title: name,
    slug: regionToSlug(name),
    blurb: c.blurb,
    footerBlurb: c.footerBlurb,
    adjective: c.adjective,
  }));
}

async function main() {
  // Optional label filters: `tsx scripts/seed-sanity.ts keyFindings` seeds only
  // documents whose label equals or is nested under a given prefix. Without
  // filters every document is (re)seeded. Filtering avoids clobbering unrelated
  // Studio edits when you only need to seed one section.
  const filters = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const matches = (label: string) =>
    filters.length === 0 ||
    filters.some((f) => label === f || label.startsWith(`${f}/`));

  console.log(
    `Seeding "${dataset}" (project ${projectId})${
      filters.length ? ` — only [${filters.join(", ")}]` : ""
    }...`
  );

  const docs = [
    { label: "siteSettings", doc: await buildSiteSettingsDoc() },
    { label: "header", doc: buildHeaderDoc() },
    { label: "footer", doc: await buildFooterDoc() },
    { label: "homePage", doc: await buildHomeDoc() },
    { label: "aboutPage", doc: await buildAboutDoc() },
    { label: "methodologyPage", doc: await buildMethodologyDoc() },
    { label: "takeawaysPage", doc: await buildTakeawaysDoc() },
    { label: "indicatorsPage", doc: await buildIndicatorsDoc() },
    { label: "evidencePage", doc: buildEvidenceDoc() },
    { label: "regionsPage", doc: buildRegionsDoc() },
    { label: "countriesPage", doc: buildCountriesDoc() },
    { label: "downloadModal", doc: await buildDownloadModalDoc() },
    { label: "reportDownload", doc: await buildReportDownloadDoc() },
    { label: "keyFindings", doc: await buildKeyFindingsDoc() },
    ...(await buildPillarDocs()).map((doc) => ({ label: `pillar/${doc.slug}`, doc })),
    ...buildDimensionDocs().map((doc) => ({ label: `dimension/${doc.slug}`, doc })),
    ...buildIndicatorPageDocs().map((doc) => ({ label: `indicator/${doc.slug}`, doc })),
    ...buildPathwayDocs().map((doc) => ({ label: `pathway/${doc.pathwayId}`, doc })),
    ...buildRegionPageDocs().map((doc) => ({ label: `region/${doc.slug}`, doc })),
    ...(await buildUpdateDocs()).map((doc) => ({ label: `update/${doc._id}`, doc })),
  ];

  let seeded = 0;
  for (const { label, doc } of docs) {
    if (!matches(label)) continue;
    await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0]);
    console.log(`✓ ${label} seeded`);
    seeded += 1;
  }

  // Non-destructive pass: add each indicator's hero image only where the
  // `indicatorPage` doc has none yet. `setIfMissing` leaves existing copy and
  // any editor-uploaded image untouched. Seed images alone (without touching
  // copy) with `pnpm seed:sanity indicator-image`.
  const heroImagePatches = await buildIndicatorHeroImagePatches();
  for (const { label, id, heroImage } of heroImagePatches) {
    if (!matches(label)) continue;
    if (!heroImage) continue;
    await client.patch(id).setIfMissing({ heroImage }).commit();
    console.log(`✓ ${label} hero image set (if missing)`);
    seeded += 1;
  }

  // Non-destructive pass: add each indicator's display name only where the
  // `indicatorPage` doc has none yet. `setIfMissing` leaves an editor's rename
  // untouched. Backfill names alone (without touching copy) with
  // `pnpm seed:sanity indicator-title`.
  const titlePatches = buildIndicatorTitlePatches();
  for (const { label, id, title } of titlePatches) {
    if (!matches(label)) continue;
    await client.patch(id).setIfMissing({ title }).commit();
    console.log(`✓ ${label} name set (if missing)`);
    seeded += 1;
  }

  // Renames: force-sync the `title` of specific indicator docs to the current
  // taxonomy name (overwrites the title only, on only these docs — copy and
  // images are left untouched). Scoped run: `pnpm seed:sanity indicator-rename`.
  const renamePatches = buildIndicatorRenamePatches();
  for (const { label, id, title } of renamePatches) {
    if (!matches(label)) continue;
    await client.patch(id).set({ title }).commit();
    console.log(`✓ ${label} title synced → "${title}"`);
    seeded += 1;
  }

  // Non-destructive pass: add the Evidence Explorer stat cards only where the
  // `homePage` doc has none yet. `setIfMissing` leaves an editor's existing
  // stat cards (and the rest of the doc) untouched, so this is safe to run
  // against production without clobbering Studio edits. Backfill the stat cards
  // alone with `pnpm seed:sanity home-evidence-stats`.
  if (matches("home-evidence-stats")) {
    await client
      .patch("homePage")
      .setIfMissing({ evidenceStats: stats(homeDefaults.evidenceStats) })
      .commit();
    console.log("✓ home-evidence-stats set (if missing)");
    seeded += 1;
  }

  // Scoped copy update: overwrite ONLY the Shaping section heading on the
  // `homePage` doc, leaving every other field (and all other docs) untouched.
  // Uses `.set` — not `setIfMissing` — because this is a deliberate copy change
  // that must replace the previously seeded value. Non-destructive in that it
  // never re-seeds the whole doc; run it alone with
  // `pnpm seed:sanity home-shaping-heading`.
  if (matches("home-shaping-heading")) {
    await client
      .patch("homePage")
      .set({ shapingHeadingLines: homeDefaults.shapingHeadingLines })
      .commit();
    console.log("✓ home-shaping-heading set");
    seeded += 1;
  }

  if (seeded === 0) {
    console.warn(
      `No documents matched [${filters.join(", ")}]. Nothing was written.`
    );
  }
  console.log("Done. Open /studio to review and publish.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
