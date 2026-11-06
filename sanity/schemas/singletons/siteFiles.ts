import { defineArrayMember, defineField, defineType } from "sanity";
import { DownloadIcon } from "@sanity/icons";

const PDF = ".pdf,application/pdf";
const XLSX =
  ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/** One replaceable download slot: an optional uploaded file plus metadata. */
function fileSlot(name: string, title: string, accept: string, description: string) {
  return defineField({
    name,
    title,
    type: "object",
    description,
    options: { collapsible: true, collapsed: false },
    fields: [
      defineField({
        name: "file",
        title: "File",
        type: "file",
        options: { accept },
        description:
          "Upload a new file to replace the one on the site. Leave empty to keep serving the built-in file. Remember to Publish.",
      }),
      defineField({
        name: "filename",
        title: "Download filename (optional)",
        type: "string",
        description:
          "Name users get when they save the file, e.g. GIRAI-2026-methodology.pdf. Leave empty to keep the current name.",
      }),
      defineField({
        name: "note",
        title: "Internal note (optional)",
        type: "text",
        rows: 2,
        description: "Not shown on the site. E.g. who sent this version and when.",
      }),
    ],
  });
}

/**
 * Replaceable downloadable files. Each slot falls back to the hosting override
 * (DOWNLOAD_*_PATH) and then the file in public/downloads when nothing is uploaded.
 */
export const siteFiles = defineType({
  name: "siteFiles",
  title: "Site Files & Downloads",
  type: "document",
  icon: DownloadIcon,
  groups: [
    { name: "y2026", title: "2026 edition", default: true },
    { name: "y2024", title: "2024 edition" },
    { name: "other", title: "Other files" },
  ],
  fields: [
    { ...fileSlot("report2026", "2026 Report – English (PDF)", PDF, "The full 2026 GIRAI report / book in English (the default download). Repo fallback: Global-Index-on-Responsible-AI-2026.pdf."), group: "y2026" },
    { ...fileSlot("report2026Es", "2026 Report – Español (PDF)", PDF, "Spanish edition, served when a visitor picks Español in the download form. Repo fallback: Indice-Global-de-IA-Responsable-2026.pdf."), group: "y2026" },
    { ...fileSlot("report2026Fr", "2026 Report – Français (PDF)", PDF, "French edition, served when a visitor picks Français in the download form. Repo fallback: Indice-mondial-de-l-IA-responsable-2026.pdf."), group: "y2026" },
    { ...fileSlot("methodology2026", "2026 Methodology (PDF)", PDF, "Linked from the Methodology page buttons and citations."), group: "y2026" },
    {
      ...fileSlot(
        "dataset2026",
        "2026 Dataset (Excel)",
        XLSX,
        "⚠️ The scores and rankings on the site are built from the copy in the code repository (src/data/2026/GIRAI_dataset.xlsx), not from this upload. An uploaded file only changes what users download, so it MUST contain exactly the same data as the repo copy. If the data itself changes, ask the developers to update the repo too."
      ),
      group: "y2026",
    },
    { ...fileSlot("report2024", "2024 Report (PDF)", PDF, "The 2024 GIRAI report."), group: "y2024" },
    { ...fileSlot("methodology2024", "2024 Methodology (PDF)", PDF, "The 2024 methodology document."), group: "y2024" },
    { ...fileSlot("dataset2024", "2024 Dataset (Excel)", XLSX, "The 2024 dataset download."), group: "y2024" },
    defineField({
      name: "additionalFiles",
      title: "Additional files",
      group: "other",
      type: "array",
      description:
        "Reserved for future files such as country or region reports. Not shown on the site yet.",
      of: [
        defineArrayMember({
          type: "object",
          name: "additionalFile",
          fields: [
            defineField({ name: "key", title: "Key", type: "string", description: "e.g. ISO3 country code (NGA) or region slug.", validation: (r) => r.required() }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "file", title: "File", type: "file", validation: (r) => r.required() }),
            defineField({ name: "filename", title: "Download filename (optional)", type: "string" }),
          ],
          preview: { select: { title: "title", subtitle: "key" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Files & Downloads" }),
  },
});
