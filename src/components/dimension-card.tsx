"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Share2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Dimension } from "@/data/dimensions-data";

interface DimensionCardProps {
  dimension: Dimension | null;
}

export function DimensionCard({ dimension }: DimensionCardProps) {
  return (
    <AnimatePresence mode="wait">
      {dimension ? (
        <motion.div
          key={dimension.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden border-0 shadow-lg pt-0">
            <CardHeader className="relative overflow-hidden rounded-t-xl py-10 text-white">
              {dimension.image && (
                <div
                  className="absolute inset-0  bg-cover bg-center"
                  style={{ backgroundImage: `url(${dimension.image})` }}
                />
              )}
              {
                dimension.image && (
                  <div className="absolute inset-0 bg-black/50" />
                )
              }
              <div className="relative z-10 space-y-1">
                <CardTitle className="text-xl font-bold">{dimension.name}</CardTitle>
                <CardDescription className="text-white/90">
                  {dimension.subtitle}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {dimension.description}
              </p>
            </CardContent>
            <CardFooter className="flex gap-3 pt-2">
              <Link href={`/dimensions/${dimension.id}`}>
                <Button variant="default" size="sm">
                  <BookOpen className="size-4" />
                  View dimension
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Share2 className="size-4" />
                Share
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/20 bg-muted/30 px-8 py-16 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Click a dimension on the chart to view details
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
