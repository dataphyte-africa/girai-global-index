"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FILTER_CATEGORIES,
  availableYears,
  updateYear,
} from "@/lib/updates";
import type { UpdatePost } from "@/content/updates";
import { UpdateCard } from "./update-card";

const ALL = "All";
const ALL_YEARS = "all";

export function UpdatesExplorer({ posts }: { posts: UpdatePost[] }) {
  const [category, setCategory] = useState<string>(ALL);
  const [year, setYear] = useState<string>(ALL_YEARS);

  const years = useMemo(() => availableYears(posts), [posts]);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = category === ALL || post.category === category;
      const matchesYear =
        year === ALL_YEARS || updateYear(post.publishedAt) === Number(year);
      return matchesCategory && matchesYear;
    });
  }, [posts, category, year]);

  const pills = [ALL, ...FILTER_CATEGORIES];

  return (
    <section id="all-updates" className="w-full px-4 pb-20 md:px-6 md:pb-28">
      <div className="mx-auto max-w-7xl">
        {/* Filter controls */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible">
            {pills.map((pill) => {
              const active = pill === category;
              return (
                <button
                  key={pill}
                  type="button"
                  onClick={() => setCategory(pill)}
                  aria-pressed={active}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-foreground/70 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {pill}
                </button>
              );
            })}
          </div>

          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="h-10 w-[150px] shrink-0 rounded-full border-border bg-background px-5 text-sm font-medium shadow-none">

              <SelectValue placeholder="All years" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value={ALL_YEARS}>All years</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <UpdateCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-16 rounded-2xl border border-dashed border-border py-20 text-center">
            <p className="text-base font-medium text-foreground">
              No updates found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different category or year.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
