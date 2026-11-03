/**
 * Country-specific clarification notes shown at the top of the evidence
 * section on a country page. Keyed by uppercase ISO3.
 *
 * A note is a list of segments: plain text strings, or link segments. External
 * links open in a new tab; internal links are site routes opened in the same
 * tab.
 */

export type CountryNoteLink = { text: string; href: string; external?: boolean };

export type CountryNoteSegment = string | CountryNoteLink;

export type CountryNote = CountryNoteSegment[];

const EU_FRAMEWORKS_DOC_URL =
  "https://drive.google.com/file/d/13qQBKD-XsnljqGDCrwGIqe08GM-dAZ-o/view?usp=sharing";

export const COUNTRY_NOTES: Readonly<Record<string, CountryNote>> = {
  NOR: [
    "Norway’s assessment includes the EU AI Act and the EU Digital Services Act (DSA) on the basis of documented preparation for their implementation under the EEA Agreement. This EEA-specific interpretive decision will be reassessed in the next edition. For more information, see Note 1 in ",
    {
      text: "Application of the European Union (EU) Frameworks in the GIRAI",
      href: EU_FRAMEWORKS_DOC_URL,
      external: true,
    },
    " and the ",
    { text: "GIRAI Methodology", href: "/methodology" },
    ".",
  ],
};

export function getCountryNote(iso3: string): CountryNote | undefined {
  const key = iso3.trim().toUpperCase();
  return Object.hasOwn(COUNTRY_NOTES, key) ? COUNTRY_NOTES[key] : undefined;
}
