import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Global Index on Responsible AI (GIRAI)",
    template: "%s | GIRAI",
  },
  description:
    "The Global Index on Responsible AI (GIRAI) measures and compares how countries around the world are developing, deploying, and governing artificial intelligence responsibly.",
  keywords: [
    "Responsible AI",
    "AI governance",
    "Global Index",
    "GIRAI",
    "AI policy",
    "AI rankings",
    "artificial intelligence",
  ],
  openGraph: {
    title: "Global Index on Responsible AI (GIRAI)",
    description:
      "Measuring and comparing responsible AI development, deployment, and governance across countries worldwide.",
    type: "website",
    locale: "en_US",
    siteName: "GIRAI - Global Index on Responsible AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Index on Responsible AI (GIRAI)",
    description:
      "Measuring and comparing responsible AI development, deployment, and governance across countries worldwide.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
