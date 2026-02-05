"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { CategoryStickScroll } from "./category-stick-scroll";


const content = [
  {
    title: "Three Categories of Responsible AI",
    description:
      "",

    content: (
      <div className="flex flex-col h-full w-full items-center justify-center p-4 bg-muted rounded-md">
        <img src="/categories/government.png" className="w-full h-[300px] object-cover rounded-sm" alt="Government" />
        <div className="flex flex-col gap-2 mt-2">
        <h2 className="text-2xl font-bold">Government Practices & frameworks</h2>
        <p className="text-sm text-muted-foreground">This category assesses whether governments have established policies, laws, strategies, and institutional mechanisms to guide the responsible development and use of AI. It examines not only the existence of these frameworks, but also how they are implemented in practice, including oversight arrangements, resourcing, and concrete government-led actions shaping AI use in the public sector. </p>
        </div>
      </div>
    ),
  },
  {
    title: "Civil Society Engagement",
    description:
      "This category examines how civil society organisations, academic institutions, and other non-state actors contribute to AI governance through policy input, advocacy, research, oversight, and public engagement. \n\n It focuses on whether participation is meaningful, ongoing, and influential, rather than limited to one-off or symbolic consultations",
    content: (
      <div className="flex flex-col h-full w-full items-center justify-center p-4 bg-muted rounded-md">
        <img src="/categories/cso-engagement.png" className="w-full h-[300px] object-cover" alt="Civil Society" />
        <div className="flex flex-col gap-2 mt-2">
        <h2 className="text-2xl font-bold">Civil Society Engagement</h2>
        <p className="text-sm text-muted-foreground">This category examines how civil society organisations, academic institutions, and other non-state actors contribute to AI governance through policy input, advocacy, research, oversight, and public engagement.  It focuses on whether participation is meaningful, ongoing, and influential, rather than limited to one-off or symbolic consultations</p>
        </div>
      </div>
    ),
  },
  {
    title: "Country Context Indicators",
    description:
      "This category reflects the broader national conditions that influence how AI is developed and governed, including institutional capacity, rule of law, labour protections, digital skills, and data governance. \n\n These contextual factors help explain why countries differ in their ability to implement responsible AI practices.",
    content: (
      <div className="flex flex-col h-full w-full items-center justify-center p-4 bg-muted rounded-md">
        <img src="/categories/country-context.png" className="w-full h-[300px] object-cover" alt="Country Context" />
        <div className="flex flex-col gap-2 mt-2">
        <h2 className="text-2xl font-bold">Country Context Indicators</h2>
        <p className="text-sm text-muted-foreground">This category reflects the broader national conditions that influence how AI is developed and governed, including institutional capacity, rule of law, labour protections, digital skills, and data governance. These contextual factors help explain why countries differ in their ability to implement responsible AI practices.</p>
        </div>
      </div>
    ),
  },
  {
   title: "The Categories of Indicators That make responsible AI governance possible",
   description: ""
  }
];
export function IndicatorCategorySection() {
  return (
    <div className="w-full py-4">
      <CategoryStickScroll content={content} backgroundColors={["#C8DBFF", "#D6FBC6", "#D8C7E4" ]}  />
    </div>
  );
}
