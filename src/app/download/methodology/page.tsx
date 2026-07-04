import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { DownloadCitationLauncher } from "@/components/data-download/download-citation-launcher";
import { getDownloadModalContent } from "@/content/downloadModal";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: "Download Methodology",
  description: "Download the GIRAI methodology document.",
};

export default async function MethodologyDownloadPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const content = await getDownloadModalContent();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="max-w-lg text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {content.methodologyHeading}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {content.methodologyBody}
          </p>
        </div>
      </main>

      <DownloadCitationLauncher
        assetType="methodology"
        searchParams={resolvedSearchParams}
      />

      <SiteFooter />
    </div>
  );
}
