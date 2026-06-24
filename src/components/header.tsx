"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Download, Menu, Orbit } from "lucide-react";
import { DIMENSIONS } from "@/data/dimensions-data";
import { INDICATORS } from "@/data/2026/taxonomy";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";
import { DataDownloadTrigger } from "./data-download/data-download-trigger";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { headerDefaults, type HeaderContent } from "@/content/header.defaults";

const desktopNavLinkClass = cn(
  navigationMenuTriggerStyle(),
  "h-10 rounded-full bg-transparent px-3 text-[15px] font-medium text-foreground/80 shadow-none hover:bg-muted/70 hover:text-foreground focus:bg-muted/70 focus:text-foreground data-[active=true]:bg-muted/70 data-[active=true]:text-foreground"
);

const regionLinks = [
  { label: "Africa", href: "/regions/africa" },
  { label: "Asia and Oceania", href: "/regions/asia-and-oceania" },
  { label: "The Caribbean", href: "/regions/caribbean" },
  { label: "Europe", href: "/regions/europe" },
  { label: "Middle East", href: "/regions/middle-east" },
  { label: "North America", href: "/regions/northern-america" },
  {
    label: "South and Central America",
    href: "/regions/south-and-central-america",
  },
];

const dimensionLinks = DIMENSIONS.map((dimension) => ({
  label: dimension.name,
  href: `/dimensions/${dimension.id}`,
}));

const featuredNavIndicators: Array<{ slug: string; label?: string }> = [
  { slug: "gender-equality", label: "Gender equality" },
  { slug: "childrens-rights", label: "Children's rights" },
  {
    slug: "government-mechanisms-cso-inclusion",
    label: "Public participation & inclusion",
  },
  { slug: "safety-security", label: "Protection of vulnerable groups" },
  {
    slug: "fairness-non-discrimination",
    label: "Bias & unfair discrimination",
  },
  {
    slug: "cultural-linguistic-diversity",
    label: "Cultural & linguistic diversity",
  },
  {
    slug: "human-oversight-determination",
    label: "Ethical AI principles & frameworks",
  },
];

const indicatorLinks = featuredNavIndicators.map(({ slug, label }) => {
  const indicator = INDICATORS.find((item) => item.slug === slug);
  return {
    label: label ?? indicator?.name ?? slug,
    href: `/indicators/${slug}`,
  };
});

export const Header = ({ content = headerDefaults }: { content?: HeaderContent }) => {
  const { primaryNav, exploreLinks, downloadCta } = content;
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0" aria-label="Home">
          <Image
            src="/girai-logo.png"
            alt="GIRAI logo"
            width={230}
            height={40}
            className="block h-8 w-auto max-w-[180px] dark:hidden sm:max-w-[230px]"
          />
          <Image
            src="/girai-logo-white.png"
            alt="GIRAI logo"
            width={230}
            height={40}
            className="hidden h-8 w-auto max-w-[180px] dark:block sm:max-w-[230px]"
          />
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
          <NavigationMenu viewport={false} className="max-w-full">
            <NavigationMenuList className="gap-1.5">
              <NavigationMenuItem>
                <NavigationMenuTrigger className={desktopNavLinkClass}>
                  Explore
                </NavigationMenuTrigger>
                <NavigationMenuContent className="fixed! left-1/2! top-[calc(var(--header-height,4rem)+0.5rem)]! mt-0! w-[75vw]! max-w-[90rem]! -translate-x-1/2 rounded-[1.75rem] border-border/60 bg-background/95 p-6 shadow-[0_32px_90px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                  <div className="grid gap-8 md:grid-cols-[0.9fr_1fr_1.15fr_1.35fr]">
                    <MenuColumn title="Explore" links={exploreLinks} />
                    <MenuColumn title="Regions" links={regionLinks} />
                    <MenuColumn title="Dimensions" links={dimensionLinks} />
                    <MenuColumn
                      title="Indicators"
                      links={indicatorLinks}
                      footerLink={{
                        label: "View all",
                        href: "/indicators",
                      }}
                    />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {primaryNav.map((item) => (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuLink asChild className={desktopNavLinkClass}>
                    <Link href={item.href}>{item.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="relative z-50 flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="hidden items-center gap-3 text-left transition-colors hover:bg-muted/60 xl:flex"
          >
            <Image
              src="/gcg-logo.png"
              alt="GCG logo"
              width={230}
              height={30}
              className="h-[30px] w-auto dark:brightness-0 dark:invert"
            />
          </Link>

          <div className="hidden lg:block">
            <ThemeSwitcher />
          </div>

          <DataDownloadTrigger
            assetType="data"
            edition="second"
            source="header-desktop"
            className="hidden px-5 shadow-sm sm:inline-flex"
          >
            <Download data-icon="inline-start" />
            {downloadCta.label}
          </DataDownloadTrigger>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5 text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(100vw-1.25rem,360px)] overflow-y-auto"
            >
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-6 pt-6">
                <nav className="flex flex-col gap-2">
                  {primaryNav.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setSheetOpen(false)}
                      className="rounded-xl px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <MobileMenuGroup
                  title="Explore"
                  links={exploreLinks}
                  onNavigate={() => setSheetOpen(false)}
                />
                <MobileMenuGroup
                  title="Regions"
                  links={regionLinks}
                  onNavigate={() => setSheetOpen(false)}
                />
                <MobileMenuGroup
                  title="Dimensions"
                  links={dimensionLinks}
                  onNavigate={() => setSheetOpen(false)}
                />
                <MobileMenuGroup
                  title="Indicators"
                  links={[
                    ...indicatorLinks,
                    { label: "View all", href: "/indicators" },
                  ]}
                
                  onNavigate={() => setSheetOpen(false)}
                />

                <div className="flex flex-col gap-4 border-t border-border pt-6">
                  <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-4 py-3">
                    <span className="text-sm font-medium text-foreground/80">
                      Theme
                    </span>
                    <ThemeSwitcher />
                  </div>

                  <DataDownloadTrigger
                    assetType="data"
                    edition="second"
                    source="header-mobile"
                    className="w-full"
                    onClick={() => setSheetOpen(false)}
                  >
                    <Download data-icon="inline-start" />
                    {downloadCta.label}
                  </DataDownloadTrigger>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

function MenuColumn({
  title,
  links,
  footerLink,
}: {
  title: string;
  links: { label: string; href: string }[];
  footerLink?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>
      <ul className="flex flex-col gap-1.5">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <NavigationMenuLink asChild>
              <Link
                href={link.href}
                className="block rounded-xl px-3 py-2 text-sm text-foreground/78 transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            </NavigationMenuLink>
          </li>
        ))}
      </ul>
      {footerLink ? (
        <NavigationMenuLink asChild>
          <Link
            href={footerLink.href}
            className="inline-flex flex-row  items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            {footerLink.label}
            <ChevronRight className="size-4" />
          </Link>
        </NavigationMenuLink>
      ) : null}
    </div>
  );
}

function MobileMenuGroup({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: { label: string; href: string }[];
  onNavigate: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/25 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={`${title}-${link.label}`}
            href={link.href}
            onClick={onNavigate}
            className="rounded-xl px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-background hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
