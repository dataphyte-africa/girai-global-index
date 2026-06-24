"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function InsightCard({
  title,
  subtitle,
  badge,
  children,
  footer,
  className,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_8px_32px_-12px_rgba(0,0,0,0.12)]",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-48 rounded-full bg-primary/5 blur-3xl"
      />
      <header className="relative border-b border-border/60 px-4 py-3.5 md:px-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 space-y-0.5">
            <h4 className="font-semibold text-foreground text-sm tracking-tight md:text-[0.9375rem]">
              {title}
            </h4>
            {subtitle && (
              <p className="text-muted-foreground text-xs leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {badge && (
            <span className="shrink-0 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-0.5 font-medium text-[10px] text-primary uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
      </header>
      <div className="relative px-4 py-4 md:px-5">{children}</div>
      {footer && (
        <footer className="relative border-t border-border/50 bg-muted/20 px-4 py-3 md:px-5">
          {footer}
        </footer>
      )}
    </article>
  );
}
