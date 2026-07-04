import { groq } from "next-sanity";

const imageProjection = `{ "url": asset->url, alt }`;

export const aboutPageQuery = groq`
*[_type == "aboutPage"][0]{
  heroTitleLead, heroTitleAccent, heroLead,
  "heroImage": heroImage${imageProjection},

  introHeadingLead, introHeadingMuted, introBody,

  whyHeadingLead, whyHeadingAccent, whyHeadingTail, whySubtitle,
  whyCards[]{ title, description },

  gcgBadge, gcgHeading, gcgBody,
  gcgCta{ label, href },
  "gcgImage": gcgImage${imageProjection},

  measuresBadge, measuresHeadingLead, measuresHeadingAccent, measuresBody,
  "measuresImage": measuresImage${imageProjection},

  contributorsHeading, contributorsSubtitle,
  partners[]{ name, "logo": logo${imageProjection} },

  whoForHeadingLead, whoForHeadingAccent, whoForSubtitle,
  audiences[]{ title, description },
  "whoForImage": whoForImage${imageProjection},
  whoForSummary,

  peopleHeadingLead, peopleHeadingAccent, peopleHeadingTail, peopleSubtitle,
  people,

  committeeHeading, committeeSubtitle,
  committeeMembers[]{ name, affiliation },

  impactHeadingLead, impactHeadingAccent, impactSubtitle,
  impactCards[]{ title, description },
  impactCtaLabel, impactCtaHref,

  footerHeading, footerBody,
  footerCta{ label, href },
  "footerImage": footerImage${imageProjection}
}`;

export const takeawaysPageQuery = groq`
*[_type == "takeawaysPage"][0]{
  heroTitleLead, heroTitleAccent, heroLead,
  heroStats[]{ label, value },
  "heroImage": heroImage${imageProjection},
  introHeadingLead, introHeadingMuted,
  keyInsightsHeadingAccent, keyInsightsHeadingTail, keyInsightsSubtitle,
  insights[]{ title, description }
}`;

export const keyFindingsQuery = groq`
*[_type == "keyFindings"][0]{
  headingAccent, headingTail, subtitle,
  findings[]{
    _key,
    title,
    summary,
    body[]{
      ...,
      _type == "findingChart" => {
        ...,
        "url": asset->url,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height,
        alt,
        caption
      }
    },
    brightSpotCountry,
    brightSpotBody
  }
}`;

export const methodologyPageQuery = groq`
*[_type == "methodologyPage"][0]{
  heroTitleLine1Lead, heroTitleLine1Accent, heroTitleLine2Accent, heroTitleLine2Tail,
  heroLead, heroCtaLabel,
  "heroImage": heroImage${imageProjection},

  introHeadingLead, introHeadingMuted,

  principlesBadge, principlesHeadingLead, principlesHeadingTail, principlesIntro,
  "principlesImage": principlesImage${imageProjection},
  principles[]{ title, description },

  measuresHeadingLead, measuresHeadingAccent, measuresHeadingTail, measuresSubtitle,
  dimensions[]{ title, description },

  evolutionBadge, evolutionHeadingLead, evolutionHeadingAccent,
  "evolutionParagraphs": evolutionParagraphs[].text,
  evolutionQuoteText, evolutionQuoteAttribution,

  refinedHeadingLead, refinedHeadingAccent, refinedSubtitle,
  refinements[]{ title, description },

  editionHeadingAccent, editionHeadingTail, editionSubtitle,
  changes[]{ dimension, before, now },

  keyTermsHeadingAccent, keyTermsHeadingTail, keyTermsSubtitle,
  terms[]{ title, definition },

  evidenceHeadingAccent, evidenceHeadingTail, evidenceSubtitle,
  evidenceRules[]{ title, description },
  "evidenceImage": evidenceImage${imageProjection},

  accessBadge, accessHeadingLead, accessHeadingTail, accessBody,
  accessCta{ label, href },
  "accessImage": accessImage${imageProjection},

  processStats[]{ label, value },
  processHeadingLead, processHeadingAccent, processSubtitle,
  processBadge, processStagesHeadingAccent, processStagesHeadingTail, processStagesIntro,
  processSteps[]{ title, description },

  footerHeadingLine1, footerHeadingLine2, footerBody, footerCtaLabel,
  "footerImage": footerImage${imageProjection}
}`;

export const homePageQuery = groq`
*[_type == "homePage"][0]{
  heroHeadlineLead, heroHeadlineAccent, heroHeadlineTail, heroSubtext,

  whyHeading, whySubtitle, whyCtaLabel,
  "whyParagraphs": whyParagraphs[].text,

  dimensionsHeadingLead, dimensionsHeadingAccent, dimensionsSubtitle,

  takeawaysBadge, takeawaysHeadingAccent, takeawaysHeadingTail,
  takeawaysSubtitle, takeawaysViewAllLabel,
  takeawaysCards[]{ category, title, description, stat, statCaption },

  evidenceBadge, evidenceHeading, evidenceBody, evidenceCtaLabel, evidenceNote,

  performanceHeadingLead, performanceHeadingAccent, performanceHeadingTail, performanceSubtitle,

  compareHeadingLead, compareHeadingAccent, compareSubheading,

  indicatorsHeadingAccent, indicatorsHeadingTail, indicatorsSubtitle,

  limitsHeadingLead, limitsHeadingAccent, limitsSubtitle,
  limitsCards[]{ title, description },

  impactHeadingLead, impactHeadingAccent, impactSubtitle,
  impactCards[]{ title, description },
  impactCtaLabel, impactCtaHref,

  usedByHeading, usedBySubtitle,
  usedByPartners[]{ name, "logo": logo${imageProjection} },

  shapingHeadingLines
}`;

export const headerQuery = groq`
*[_type == "header"][0]{
  primaryNav[]{ label, href },
  exploreLinks[]{ label, href },
  downloadCta{ label, href }
}`;

export const footerQuery = groq`
*[_type == "footer"][0]{
  subscribeHeading, subscribeBody, namePlaceholder, emailPlaceholder, submitLabel,
  resultsLinks[]{ label, href },
  regionLinks[]{ label, href },
  otherProjectsLinks[]{ label, href },
  socialLinks[]{ label, href },
  funderNoteText,
  funderLogos[]{ name, url, "logo": logo${imageProjection} },
  "funderLogo": funderLogo${imageProjection},
  funderLink
}`;

export const siteSettingsQuery = groq`
*[_type == "siteSettings"][0]{
  defaultTitle, titleTemplate, description, keywords,
  ogTitle, ogDescription,
  "ogImage": ogImage${imageProjection}
}`;

export const indicatorsPageQuery = groq`
*[_type == "indicatorsPage"][0]{
  heroTitleAccent, heroTitleTail, heroLead,
  "heroImage": heroImage${imageProjection},
  seoTitle, seoDescription
}`;

export const evidencePageQuery = groq`
*[_type == "evidencePage"][0]{
  heroTitleLead, heroTitleAccent, heroSubtitle,
  heroStatLabels,
  pathwayHeading, pathwaySubtitle,
  seoTitle, seoDescription
}`;

export const regionsPageQuery = groq`
*[_type == "regionsPage"][0]{
  heroTitleLine1, heroTitleAccent, heroSubtitle,
  overviewHeading, overviewSubtitle,
  compareHeadingLead, compareHeadingAccent, compareSubheading,
  seoTitle, seoDescription
}`;

export const countriesPageQuery = groq`
*[_type == "countriesPage"][0]{
  heroTitleLine1, heroTitleAccent, heroSubtitle,
  performanceHeadingLead, performanceHeadingAccent, performanceHeadingTail, performanceSubtitle,
  compareHeadingLead, compareHeadingAccent, compareSubheading,
  takeawaysHeadingAccent, takeawaysHeadingTail, takeawaysSubtitle,
  seoTitle, seoDescription
}`;

export const regionPagesQuery = groq`
*[_type == "regionPage"]{ slug, adjective, blurb, footerBlurb }`;

export const pillarsQuery = groq`
*[_type == "pillar"]{ slug, heading, body, driversDescription, "image": image${imageProjection} }`;

export const dimensionsCopyQuery = groq`
*[_type == "dimensionCopy"]{
  slug, subtitle, description, eyebrow, heroLead, rankingSubtitle
}`;

export const pathwaysCopyQuery = groq`
*[_type == "evidencePathway"]{ pathwayId, title, tableTitle, description, itemNoun }`;

export const indicatorPageBySlugQuery = groq`
*[_type == "indicatorPage" && slug == $slug][0]{
  heroLead, introPrimary, introSecondary, background, relevance
}`;

export const downloadModalQuery = groq`
*[_type == "downloadModal"][0]{
  title, description,
  editionFirstLabel, editionSecondLabel,
  "formImage": formImage${imageProjection},
  fullNameLabel, fullNamePlaceholder,
  emailLabel, emailPlaceholder,
  organizationLabel, organizationPlaceholder,
  roleLabel, rolePlaceholder,
  reasonLabel, reasonPlaceholder,
  reasons[]{ value, label },
  licenseTextBefore, licenseLinkLabel, licenseLinkHref,
  submitLabel, submittingLabel, imageAlt,
  citationHeadingTemplate, citationBody, methodologyHeading, methodologyBody
}`;

export const reportDownloadQuery = groq`
*[_type == "reportDownload"][0]{
  badge, headingLead, headingAccent, body,
  "coverImage": coverImage${imageProjection},
  primaryCtaLabel, secondaryCtaLabel
}`;

// --- Updates (blog) ---------------------------------------------------------

/** Card-level fields shared by the list, featured and sidebar views. */
const updateCardProjection = `
  _id, title, "slug": slug.current, category, publishedAt, author, featured, excerpt,
  "coverImage": coverImage${imageProjection}
`;

export const updatesListQuery = groq`
*[_type == "updatePost" && defined(slug.current)] | order(publishedAt desc){
  ${updateCardProjection}
}`;

export const updateBySlugQuery = groq`
*[_type == "updatePost" && slug.current == $slug][0]{
  ${updateCardProjection},
  body[]{
    ...,
    _type == "contentImage" => { "url": asset->url, alt }
  }
}`;

export const updateSlugsQuery = groq`
*[_type == "updatePost" && defined(slug.current)].slug.current`;
