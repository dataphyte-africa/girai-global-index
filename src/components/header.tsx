"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import { YearSwitcher } from "./year-switcher";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const menuItems = [
  { label: "Research", href: "/" },
  { label: "Methodology", href: "/methodology" },
  { label: "About", href: "/about" },
  { label: "DataVIZ Challenge", href: "/dataviz-challenge" },
];

export const Header = () => {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-1000 flex flex-row items-center justify-between gap-4 py-5 px-4 sm:px-6 md:px-8 w-full bg-background/60 backdrop-blur-xl border-b border-border/40">
      <Link href="/" className="shrink-0" aria-label="Home">
        <Image
          src="/girai-logo.png"
          alt="Girai logo"
          width={230}
          height={40}
          className="block dark:hidden h-8 w-auto max-w-[180px] sm:max-w-[230px]"
        />
        <Image
          src="/girai-logo-white.png"
          alt="Girai logo"
          width={230}
          height={40}
          className="hidden dark:block h-8 w-auto max-w-[180px] sm:max-w-[230px]"
        />
      </Link>

      {/* Desktop nav + switchers */}
      <nav className="hidden md:flex flex-row gap-8 items-center mx-auto">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="relative z-1001 flex flex-row gap-4 items-center">
        {/* Desktop: Year + Theme switchers */}
        <div className="hidden md:flex flex-row gap-4 items-center">
          <YearSwitcher />
          <ThemeSwitcher />
        </div>

        {/* Mobile: hamburger → sheet with menu + Year + Theme */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden shrink-0"
              aria-label="Open menu"
            >
              <Menu className="size-5 text-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col w-[min(100vw-2rem,320px)]">
            <SheetHeader>
              <SheetTitle className="sr-only">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 pt-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSheetOpen(false)}
                  className="rounded-md px-3 py-2.5 text-base font-medium text-foreground/90 hover:bg-muted hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 pt-6 border-t border-border flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3">
                  Year
                </span>
                <YearSwitcher />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3">
                  Theme
                </span>
                <ThemeSwitcher />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
