import type { StructureResolver } from "sanity/structure";

const SINGLETONS: { id: string; type: string; title: string }[] = [
  { id: "siteSettings", type: "siteSettings", title: "Site Settings & SEO" },
  { id: "header", type: "header", title: "Header / Navigation" },
  { id: "footer", type: "footer", title: "Footer" },
  { id: "homePage", type: "homePage", title: "Home Page" },
  { id: "aboutPage", type: "aboutPage", title: "About Page" },
  { id: "methodologyPage", type: "methodologyPage", title: "Methodology Page" },
  { id: "takeawaysPage", type: "takeawaysPage", title: "Takeaways Page" },
  { id: "indicatorsPage", type: "indicatorsPage", title: "Indicators Page" },
  { id: "evidencePage", type: "evidencePage", title: "Evidence Explorer Page" },
  { id: "regionsPage", type: "regionsPage", title: "Regions Page" },
  { id: "countriesPage", type: "countriesPage", title: "Countries Page" },
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
      S.divider(),
      ...SINGLETONS.filter((s) => !s.type.endsWith("Page")).map((s) =>
        S.listItem()
          .title(s.title)
          .id(s.id)
          .child(S.document().schemaType(s.type).documentId(s.id))
      ),
    ]);
