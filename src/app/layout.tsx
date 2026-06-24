import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { DataDownloadProvider } from "@/components/data-download/data-download-provider";
import { AiAssistantProvider } from "@/components/ai-assistant/ai-assistant-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSiteSettings } from "@/content/siteSettings";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: settings.defaultTitle,
      template: settings.titleTemplate,
    },
    description: settings.description,
    keywords: settings.keywords,
    openGraph: {
      title: settings.ogTitle,
      description: settings.ogDescription,
      type: "website",
      locale: "en_US",
      siteName: "GIRAI - Global Index on Responsible AI",
      ...(settings.ogImage.url
        ? { images: [{ url: settings.ogImage.url, alt: settings.ogImage.alt ?? undefined }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: settings.ogTitle,
      description: settings.ogDescription,
      ...(settings.ogImage.url ? { images: [settings.ogImage.url] } : {}),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DataDownloadProvider>
            <AiAssistantProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </AiAssistantProvider>
          </DataDownloadProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
