import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { DownloadCitationLauncher } from "@/components/data-download/download-citation-launcher";
import {
  editionToYear,
  parseDownloadRoute,
} from "@/lib/data-download/citation-links";
import type { DownloadAssetType } from "@/lib/data-download/types";
import { getDownloadModalContent } from "@/content/downloadModal";

type PageProps = {
  params: Promise<{ assetType: string; year: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const ASSET_LABELS: Record<DownloadAssetType, string> = {
  report: "Report",
  data: "Dataset",
  methodology: "Methodology",
};

export async function generateMetadata({ params }: PageProps) {
  const { assetType, year } = await params;
  const target = parseDownloadRoute(assetType, year);

  if (!target) {
    return { title: "Download not found" };
  }

  const editionLabel =
    target.edition != null ? `${editionToYear(target.edition)} ` : "";
  const assetLabel = ASSET_LABELS[target.assetType];

  return {
    title: `Download ${editionLabel}${assetLabel}`,
    description: `Download the GIRAI ${editionLabel}${assetLabel.toLowerCase()}.`,
  };
}

export default async function CitationDownloadPage({
  params,
  searchParams,
}: PageProps) {
  const { assetType, year } = await params;
  const target = parseDownloadRoute(assetType, year);

  if (!target) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const content = await getDownloadModalContent();
  const editionLabel =
    target.edition != null ? `${editionToYear(target.edition)} ` : "";
  const assetLabel = ASSET_LABELS[target.assetType];
  const heading = content.citationHeadingTemplate.replace(
    "{asset}",
    `${editionLabel}${assetLabel}`
  );
  const body = content.citationBody.replace(
    "{asset}",
    `${editionLabel}${assetLabel.toLowerCase()}`
  );

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="max-w-lg text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {heading}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {body}
          </p>
        </div>
      </main>

      <DownloadCitationLauncher
        assetType={target.assetType}
        edition={target.edition}
        searchParams={resolvedSearchParams}
      />

      <SiteFooter />
    </div>
  );
}
