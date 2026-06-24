"use client";

import { motion } from "motion/react";
import {
  BarChart3,
  BookOpen,
  GitCompare,
  Globe2,
  History,
  Search,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SuggestionItem = {
  text: string;
  category: string;
  icon: LucideIcon;
  accent: string;
};

const STARTER_SUGGESTIONS: SuggestionItem[] = [
  {
    text: "Compare Nigeria and Kenya on Labour and Skills",
    category: "Compare",
    icon: GitCompare,
    accent: "from-violet-500/15 to-primary/5",
  },
  {
    text: "Which countries rank highest on Trust and Safety?",
    category: "Rankings",
    icon: BarChart3,
    accent: "from-emerald-500/15 to-hero-accent/10",
  },
  {
    text: "Show framework evidence for gender equality in Africa",
    category: "Evidence",
    icon: Search,
    accent: "from-sky-500/15 to-chart-2/10",
  },
  {
    text: "What changed for Brazil between the 2024 and 2026 editions?",
    category: "Editions",
    icon: History,
    accent: "from-amber-500/15 to-chart-4/10",
  },
  {
    text: "How is Europe performing compared to Africa?",
    category: "Regions",
    icon: Globe2,
    accent: "from-rose-500/12 to-chart-5/10",
  },
  {
    text: "What does the report say about CSO engagement?",
    category: "Reports",
    icon: BookOpen,
    accent: "from-primary/15 to-violet-400/10",
  },
];

export function AiSuggestions({
  onSelect,
  disabled,
}: {
  onSelect: (text: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="text-center">
        <p className="font-medium text-foreground/90 text-sm">
          Start with a research question
        </p>
        <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
          Rankings, evidence trails, regional patterns, and edition changes
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {STARTER_SUGGESTIONS.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.text}
              type="button"
              disabled={disabled}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(item.text)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-4 text-left shadow-sm transition-shadow hover:border-primary/25 hover:shadow-md disabled:pointer-events-none disabled:opacity-50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              )}
            >
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80 transition-opacity group-hover:opacity-100",
                  item.accent
                )}
              />
              <div className="relative flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-background/60 shadow-sm backdrop-blur-sm">
                  <Icon className="size-4 text-primary" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <span className="inline-block rounded-md bg-background/50 px-1.5 py-0.5 font-semibold text-[10px] text-primary uppercase tracking-widest">
                    {item.category}
                  </span>
                  <p className="text-foreground/90 text-sm leading-snug">
                    {item.text}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
