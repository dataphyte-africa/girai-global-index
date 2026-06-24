"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import {
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import type { GiraiSource } from "@/lib/ai/types";

export function SourcesFooter({ sources }: { sources: GiraiSource[] }) {
  if (sources.length === 0) return null;

  return (
    <Sources className="mb-0">
      <SourcesTrigger count={sources.length} />
      <SourcesContent>
        {sources.map((source) => (
          <Link
            key={`${source.kind}-${source.href}`}
            className="flex items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 font-medium transition-colors hover:border-border/60 hover:bg-muted/30"
            href={source.href}
          >
            <BookOpen className="size-3.5 shrink-0 text-primary/70" />
            <span className="text-xs">{source.label}</span>
          </Link>
        ))}
      </SourcesContent>
    </Sources>
  );
}

export function extractSourcesFromOutput(output: unknown): GiraiSource[] {
  if (!output || typeof output !== "object") return [];
  const maybe = output as { sources?: GiraiSource[] };
  return Array.isArray(maybe.sources) ? maybe.sources : [];
}
