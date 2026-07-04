import type { StructureResolver } from "sanity/structure";
import { ComposeIcon, DocumentsIcon } from "@sanity/icons";

import { DIMENSIONS, INDICATORS } from "../src/data/2026/taxonomy";
import { REGION_COPY, regionToSlug } from "../src/lib/regions";

const SINGLETONS: { id: string; type: string; title: string }[] = [
  { id: "siteSettings", type: "siteSettings", title: "Site Settings & SEO" },
  { id: "header", type: "header", title: "Header / Navigation" },
  { id: "footer", type: "footer", title: "Footer" },
  { id: "downloadModal", type: "downloadModal", title: "Download Modal" },
  { id: "reportDownload", type: "reportDownload", title: "Report Download Section" },
  { id: "keyFindings", type: "keyFindings", title: "Key Findings (Accordion)" },
  { id: "homePage", type: "homePage", title: "Home Page" },
  { id: "aboutPage", type: "aboutPage", title: "About Page" },
  { id: "methodologyPage", type: "methodologyPage", title: "Methodology Page" },
  { id: "takeawaysPage", type: "takeawaysPage", title: "Takeaways Page" },
  { id: "indicatorsPage", type: "indicatorsPage", title: "Indicators Page" },
  { id: "evidencePage", type: "evidencePage", title: "Evidence Explorer Page" },
  { id: "regionsPage", type: "regionsPage", title: "Regions Page" },
  { id: "countriesPage", type: "countriesPage", title: "Countries Page" },
];

/**
 * Fixed collections: a known set of documents (one per entity) with stable ids,
 * seeded from code defaults and edited in place. Ids MUST match scripts/seed-sanity.ts.
 */
const COLLECTIONS: {
  title: string;
  type: string;
  docs: { id: string; title: string }[];
}[] = [
  {
    title: "Pillars",
    type: "pillar",
    docs: [
      { id: "pillar-ai-policy", title: "AI Policy" },
      { id: "pillar-cso-engagement", title: "Civil Society Engagement" },
      { id: "pillar-enabling-conditions", title: "Enabling Conditions" },
    ],
  },
  {
    title: "Dimensions",
    type: "dimensionCopy",
    docs: [
      { id: "dimension-inclusion-diversity", title: "Inclusion & Diversity" },
      { id: "dimension-ethics-sustainability", title: "Ethics & Sustainability" },
      { id: "dimension-labour-skills", title: "Labour & Skills" },
      { id: "dimension-trust-safety", title: "Trust & Safety" },
      { id: "dimension-ai-use-public-service", title: "AI Use in Public Service" },
    ],
  },
  {
    title: "Evidence Pathways",
    type: "evidencePathway",
    docs: [
      { id: "pathway-frameworks", title: "Government Frameworks" },
      { id: "pathway-initiatives", title: "Government-led Initiatives" },
      { id: "pathway-nonGov", title: "CSO Engagement" },
      { id: "pathway-misuse", title: "Government Misuse of AI" },
    ],
  },
  {
    title: "Regions",
    type: "regionPage",
    // One doc per canonical region. Ids MUST match scripts/seed-sanity.ts.
    docs: Object.keys(REGION_COPY).map((name) => ({
      id: `region-${regionToSlug(name)}`,
      title: name,
    })),
  },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Website Content")
    .items([
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items(
              SINGLETONS.filter((s) => s.type.endsWith("Page")).map((s) =>
                S.listItem()
                  .title(s.title)
                  .id(s.id)
                  .child(S.document().schemaType(s.type).documentId(s.id))
              )
            )
        ),
      S.listItem()
        .title("Content Library")
        .child(
          S.list()
            .title("Content Library")
            .items(
              COLLECTIONS.map((c) =>
                S.listItem()
                  .title(c.title)
                  .id(c.type)
                  .child(
                    S.list()
                      .title(c.title)
                      .items(
                        c.docs.map((d) =>
                          S.listItem()
                            .title(d.title)
                            .id(d.id)
                            .child(
                              S.document().schemaType(c.type).documentId(d.id)
                            )
                        )
                      )
                  )
              )
            )
        ),
      S.listItem()
        .title("Indicator Pages")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Indicator Pages")
            .items(
              DIMENSIONS.map((dim) =>
                S.listItem()
                  .title(dim.name)
                  .id(dim.slug)
                  .child(
                    S.list()
                      .title(dim.name)
                      .items(
                        INDICATORS.filter((i) => i.dimension === dim.slug).map(
                          (i) =>
                            S.listItem()
                              .title(i.name)
                              .id(`indicator-${i.slug}`)
                              .child(
                                S.document()
                                  .schemaType("indicatorPage")
                                  .documentId(`indicator-${i.slug}`)
                              )
                        )
                      )
                  )
              )
            )
        ),
      S.listItem()
        .title("Updates")
        .icon(ComposeIcon)
        .child(
          S.documentTypeList("updatePost")
            .title("Updates")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
        ),
      S.divider(),
      ...SINGLETONS.filter((s) => !s.type.endsWith("Page")).map((s) =>
        S.listItem()
          .title(s.title)
          .id(s.id)
          .child(S.document().schemaType(s.type).documentId(s.id))
      ),
    ]);
