"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const CategoryStickScroll = ({
  content,
  contentClassName,
  backgroundColors:bgColors,
  cardLinearGradients:cardLinearGradients,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
  backgroundColors?: string[];
  cardLinearGradients?: string[];
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
    // target: ref
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = bgColors || [
    "#0f172a", // slate-900
    "#000000", // black
    "#171717", // neutral-900
  ];
  const linearGradients = cardLinearGradients || [
    "linear-gradient(to bottom right, #06b6d4, #10b981)", // cyan-500 to emerald-500
    "linear-gradient(to bottom right, #ec4899, #6366f1)", // pink-500 to indigo-500
    "linear-gradient(to bottom right, #f97316, #eab308)", // orange-500 to yellow-500
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0],
  );

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
    <motion.div
      
      className="relative flex h-[50rem] justify-center space-x-10 overflow-y-auto rounded-md p-10"
      ref={ref}
    >
      <div
       
        className={cn(
          "sticky top-10 hidden h-[300px] w-80 overflow-hidden rounded-m lg:block",
          contentClassName,
        )}
      >
         <div className="flex flex-col gap-2">
            <h3 className="text-4xl font-bold">Three Categories of <motion.span className="" style={{ color: backgroundColors[activeCard % backgroundColors.length] }} >Responsible AI</motion.span> Indicators</h3>
            <p className="text-sm text-muted-foreground">To provide a comprehensive picture, the indicators for the Global Index of Responsible AI are grouped into three categories</p>
         </div>
      </div>
      <div className="div relative flex items-start md:px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className={cn("my-20 sticky top-0", index === content.length - 1 ? "mb-40" : "")}>
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index || (activeCard >= content.length - 1) ? 1 : 0.3,
                }}
               //  className="text-2xl font-bold "
              >
                {item.content}
              </motion.div>
              
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      
    </motion.div>
  );
};
