"use client";

import * as React from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import {
  countdownModalDefaults,
  type CountdownModalContent,
} from "@/content/countdownModal.defaults";
import { cn } from "@/lib/utils";

type TimeParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function partsFrom(remainingMs: number): TimeParts {
  const clamped = Math.max(0, remainingMs);
  const totalSeconds = Math.floor(clamped / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const UNITS: { key: keyof TimeParts; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function CountdownModal({
  content = countdownModalDefaults,
}: {
  content?: CountdownModalContent;
}) {
  const targetMs = React.useMemo(
    () => Date.parse(content.targetDate),
    [content.targetDate]
  );

  const reduceMotion = useReducedMotion();
  // `remaining === null` until the first client tick, which keeps SSR and first
  // paint identical (placeholder digits) so the numbers never cause a hydration
  // mismatch.
  const [remaining, setRemaining] = React.useState<number | null>(null);

  // Tick every second on the client only.
  React.useEffect(() => {
    if (!content.enabled || Number.isNaN(targetMs)) return;

    const update = () => setRemaining(targetMs - Date.now());
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [content.enabled, targetMs]);

  const active =
    content.enabled &&
    !Number.isNaN(targetMs) &&
    // Before mount we optimistically render the shell (SSR uses the server
    // clock); after mount the live `remaining` decides.
    (remaining === null ? true : remaining > 0);

  // Lock the page scroll while the gate blocks the site.
  React.useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);

  if (!active) return null;

  const parts = remaining !== null ? partsFrom(remaining) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${content.heading} ${content.headingAccent}`.trim()}
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#05060f] text-white"
    >
      {/* Background image with a slow, subtle drift for life. */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        initial={reduceMotion ? undefined : { scale: 1.08 }}
        animate={reduceMotion ? undefined : { scale: 1 }}
        transition={{ duration: 24, ease: "easeOut" }}
      >
        <Image
          src="/count-down/countdown-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Scrims: radial focus + vertical legibility gradient. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,6,15,0.55)_70%,rgba(5,6,15,0.9)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#05060f]/70 via-transparent to-[#05060f]/85"
      />
      {/* Grain overlay for texture over the flat PNG. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Content */}
      <div className="relative flex h-full w-full items-center justify-center px-5 py-10">
        <motion.div
          variants={reduceMotion ? undefined : container}
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : "show"}
          className="mx-auto flex w-full max-w-3xl flex-col items-center text-center"
        >
          <motion.span
            variants={reduceMotion ? undefined : rise}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.25em] text-white/70 backdrop-blur-sm"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-teal-300" />
            Launching soon
          </motion.span>

          <motion.h1
            variants={reduceMotion ? undefined : rise}
            className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl"
          >
            {content.heading}{" "}
            <span className="bg-gradient-to-r from-teal-200 via-teal-300 to-teal-400 bg-clip-text text-transparent">
              {content.headingAccent}
            </span>
          </motion.h1>

          <motion.p
            variants={reduceMotion ? undefined : rise}
            className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/65 md:text-lg"
          >
            {content.description}
          </motion.p>

          <motion.div
            variants={reduceMotion ? undefined : rise}
            className="mt-11 w-full"
          >
            <div className="mx-auto grid max-w-md grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-4 sm:gap-4">
              {UNITS.map((unit) => (
                <TimeBox
                  key={unit.key}
                  label={unit.label}
                  value={parts ? parts[unit.key] : null}
                  reduceMotion={!!reduceMotion}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function TimeBox({
  label,
  value,
  reduceMotion,
}: {
  label: string;
  value: number | null;
  reduceMotion: boolean;
}) {
  const display = value === null ? "––" : String(value).padStart(2, "0");

  return (
    <div
      className={cn(
        "group relative flex flex-col items-center justify-center gap-2 rounded-2xl px-4 py-5 sm:py-7",
        "border border-white/[0.12] bg-white/[0.05] backdrop-blur-md",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_20px_60px_-30px_rgba(45,212,191,0.55)]"
      )}
    >
      {/* Soft brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-teal-300/[0.06] to-primary/[0.06]"
      />
      <div className="relative flex h-[1.1em] items-center overflow-hidden text-5xl font-semibold tabular-nums slashed-zero leading-none tracking-tight md:text-7xl">
        {reduceMotion || value === null ? (
          <span>{display}</span>
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={display}
              initial={{ y: "0.5em", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-0.5em", opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {display}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
      <span className="relative text-[0.68rem] font-medium uppercase tracking-[0.22em] text-white/45">
        {label}
      </span>
    </div>
  );
}
