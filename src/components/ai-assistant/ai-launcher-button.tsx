"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AiLauncherButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <motion.div
      animate={{ scale: 1 }}
      className={cn("fixed right-5 bottom-5 z-[999]", className)}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
    >
      <motion.div
        animate={{ opacity: [0.35, 0.7, 0.35] }}
        className="absolute inset-0 rounded-full bg-primary/30 blur-md"
        transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
      />
      <Button
        aria-label="Open GIRAI Assistant"
        className="relative size-14 rounded-full border border-primary/20 bg-gradient-to-br from-primary to-primary/85 shadow-lg shadow-primary/25"
        onClick={onClick}
        size="icon"
      >
        <Sparkles className="size-5 text-primary-foreground" />
      </Button>
    </motion.div>
  );
}
