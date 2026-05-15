"use client";
import React from "react";
import { CategoryStickScroll } from "./category-stick-scroll";
import { PILLARS } from "@/data/2026/taxonomy";

/**
 * High-level summary copy for each of the three GIRAI pillars. The labels
 * track `taxonomy.PILLARS` so renames flow through; the editorial body
 * stays in this file until Sanity authoring lands (ADR 0004).
 */
const PILLAR_COPY: Record<string, { heading: string; body: string; image: string }> = {
  "ai-policy": {
    heading: "AI Policy",
    body: "This pillar assesses whether governments have established laws, strategies, guidelines, and other formal frameworks to guide the responsible development and use of AI. It looks not only at the existence of those frameworks, but also how they are implemented in practice — through designated bodies, plans, budgets, monitoring, and concrete initiatives.",
    image: "/categories/government.png",
  },
  "cso-engagement": {
    heading: "CSO Engagement",
    body: "This pillar examines how civil society organisations, academic institutions, and other non-state actors contribute to AI governance through policy input, advocacy, research, oversight, and public engagement. It also captures the government mechanisms that make CSO participation meaningful, ongoing, and influential rather than one-off or symbolic.",
    image: "/categories/cso-engagement.png",
  },
  "enabling-conditions": {
    heading: "Enabling Conditions",
    body: "This pillar reflects the broader national conditions that shape how AI is developed and governed — institutional integrity, rule of law, data protection, cybersecurity, digital readiness, and labour rights. These contextual indicators (drawn from established external data sources) help explain why countries differ in their ability to implement responsible AI practices.",
    image: "/categories/country-context.png",
  },
};

const content = PILLARS.map((pillar) => {
  const copy = PILLAR_COPY[pillar.slug];
  return {
    title: copy.heading,
    description: "",
    content: (
      <div className="flex flex-col h-full w-full items-center justify-center p-4 bg-muted rounded-md">
        <img
          src={copy.image}
          className="w-full h-[300px] object-cover rounded-sm"
          alt={copy.heading}
        />
        <div className="flex flex-col gap-2 mt-2">
          <h2 className="text-2xl font-bold">{copy.heading}</h2>
          <p className="text-sm text-muted-foreground">{copy.body}</p>
        </div>
      </div>
    ),
  };
});

export function IndicatorCategorySection() {
  return (
    <section id="indicators" className="w-full">
      <CategoryStickScroll
        content={content}
        backgroundColors={["#C8DBFF", "#D6FBC6", "#D8C7E4"]}
      />
    </section>
  );
}
