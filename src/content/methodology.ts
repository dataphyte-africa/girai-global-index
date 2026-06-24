import { sanityFetch } from "../../sanity/lib/fetch";
import { methodologyPageQuery } from "../../sanity/lib/queries";
import {
  methodologyDefaults,
  type Definition,
  type EditionChange,
  type MethodologyContent,
} from "./methodology.defaults";
import { cards, cta, img, stats, str, strings, type DeepPartial } from "./_merge";

export const METHODOLOGY_TAG = "methodologyPage";

function changes(
  value: DeepPartial<EditionChange[]> | undefined,
  fallback: EditionChange[]
): EditionChange[] {
  return Array.isArray(value) && value.length > 0
    ? value.map((c, i) => ({
        dimension: str(c?.dimension, fallback[i]?.dimension ?? ""),
        before: str(c?.before, fallback[i]?.before ?? ""),
        now: str(c?.now, fallback[i]?.now ?? ""),
      }))
    : fallback;
}

function terms(
  value: DeepPartial<Definition[]> | undefined,
  fallback: Definition[]
): Definition[] {
  return Array.isArray(value) && value.length > 0
    ? value.map((t, i) => ({
        title: str(t?.title, fallback[i]?.title ?? ""),
        definition: str(t?.definition, fallback[i]?.definition ?? ""),
      }))
    : fallback;
}

export async function getMethodologyContent(): Promise<MethodologyContent> {
  let data: DeepPartial<MethodologyContent> | null = null;
  try {
    data = await sanityFetch<DeepPartial<MethodologyContent> | null>({
      query: methodologyPageQuery,
      tags: [METHODOLOGY_TAG],
    });
  } catch {
    data = null;
  }

  const d = methodologyDefaults;
  if (!data) return d;

  return {
    heroTitleLine1Lead: str(data.heroTitleLine1Lead, d.heroTitleLine1Lead),
    heroTitleLine1Accent: str(data.heroTitleLine1Accent, d.heroTitleLine1Accent),
    heroTitleLine2Accent: str(data.heroTitleLine2Accent, d.heroTitleLine2Accent),
    heroTitleLine2Tail: str(data.heroTitleLine2Tail, d.heroTitleLine2Tail),
    heroLead: str(data.heroLead, d.heroLead),
    heroCtaLabel: str(data.heroCtaLabel, d.heroCtaLabel),
    heroImage: img(data.heroImage, d.heroImage),

    introHeadingLead: str(data.introHeadingLead, d.introHeadingLead),
    introHeadingMuted: str(data.introHeadingMuted, d.introHeadingMuted),

    principlesBadge: str(data.principlesBadge, d.principlesBadge),
    principlesHeadingLead: str(data.principlesHeadingLead, d.principlesHeadingLead),
    principlesHeadingTail: str(data.principlesHeadingTail, d.principlesHeadingTail),
    principlesIntro: str(data.principlesIntro, d.principlesIntro),
    principlesImage: img(data.principlesImage, d.principlesImage),
    principles: cards(data.principles, d.principles),

    measuresHeadingLead: str(data.measuresHeadingLead, d.measuresHeadingLead),
    measuresHeadingAccent: str(data.measuresHeadingAccent, d.measuresHeadingAccent),
    measuresHeadingTail: str(data.measuresHeadingTail, d.measuresHeadingTail),
    measuresSubtitle: str(data.measuresSubtitle, d.measuresSubtitle),
    dimensions: cards(data.dimensions, d.dimensions),

    evolutionBadge: str(data.evolutionBadge, d.evolutionBadge),
    evolutionHeadingLead: str(data.evolutionHeadingLead, d.evolutionHeadingLead),
    evolutionHeadingAccent: str(data.evolutionHeadingAccent, d.evolutionHeadingAccent),
    evolutionParagraphs: strings(data.evolutionParagraphs, d.evolutionParagraphs),
    evolutionQuoteText: str(data.evolutionQuoteText, d.evolutionQuoteText),
    evolutionQuoteAttribution: str(data.evolutionQuoteAttribution, d.evolutionQuoteAttribution),

    refinedHeadingLead: str(data.refinedHeadingLead, d.refinedHeadingLead),
    refinedHeadingAccent: str(data.refinedHeadingAccent, d.refinedHeadingAccent),
    refinedSubtitle: str(data.refinedSubtitle, d.refinedSubtitle),
    refinements: cards(data.refinements, d.refinements),

    editionHeadingAccent: str(data.editionHeadingAccent, d.editionHeadingAccent),
    editionHeadingTail: str(data.editionHeadingTail, d.editionHeadingTail),
    editionSubtitle: str(data.editionSubtitle, d.editionSubtitle),
    changes: changes(data.changes, d.changes),

    keyTermsHeadingAccent: str(data.keyTermsHeadingAccent, d.keyTermsHeadingAccent),
    keyTermsHeadingTail: str(data.keyTermsHeadingTail, d.keyTermsHeadingTail),
    keyTermsSubtitle: str(data.keyTermsSubtitle, d.keyTermsSubtitle),
    terms: terms(data.terms, d.terms),

    evidenceHeadingAccent: str(data.evidenceHeadingAccent, d.evidenceHeadingAccent),
    evidenceHeadingTail: str(data.evidenceHeadingTail, d.evidenceHeadingTail),
    evidenceSubtitle: str(data.evidenceSubtitle, d.evidenceSubtitle),
    evidenceRules: cards(data.evidenceRules, d.evidenceRules),
    evidenceImage: img(data.evidenceImage, d.evidenceImage),

    accessBadge: str(data.accessBadge, d.accessBadge),
    accessHeadingLead: str(data.accessHeadingLead, d.accessHeadingLead),
    accessHeadingTail: str(data.accessHeadingTail, d.accessHeadingTail),
    accessBody: str(data.accessBody, d.accessBody),
    accessCta: cta(data.accessCta, d.accessCta),
    accessImage: img(data.accessImage, d.accessImage),

    processStats: stats(data.processStats, d.processStats),
    processHeadingLead: str(data.processHeadingLead, d.processHeadingLead),
    processHeadingAccent: str(data.processHeadingAccent, d.processHeadingAccent),
    processSubtitle: str(data.processSubtitle, d.processSubtitle),
    processBadge: str(data.processBadge, d.processBadge),
    processStagesHeadingAccent: str(data.processStagesHeadingAccent, d.processStagesHeadingAccent),
    processStagesHeadingTail: str(data.processStagesHeadingTail, d.processStagesHeadingTail),
    processStagesIntro: str(data.processStagesIntro, d.processStagesIntro),
    processSteps: cards(data.processSteps, d.processSteps),

    footerHeadingLine1: str(data.footerHeadingLine1, d.footerHeadingLine1),
    footerHeadingLine2: str(data.footerHeadingLine2, d.footerHeadingLine2),
    footerBody: str(data.footerBody, d.footerBody),
    footerCtaLabel: str(data.footerCtaLabel, d.footerCtaLabel),
    footerImage: img(data.footerImage, d.footerImage),
  };
}
