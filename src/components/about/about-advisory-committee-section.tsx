"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { aboutDefaults, type AboutContent, type CommitteeMember } from "@/content/about.defaults";

function SectionAccent({
  className,
  color,
}: {
  className?: string;
  color: "blue" | "pink";
}) {
  const bg = color === "blue" ? "bg-[#3B82F6]" : "bg-[#EC4899]";
  return (
    <span
      aria-hidden
      className={`block h-0.5 w-10 rounded-full ${bg} ${className ?? ""}`}
    />
  );
}

const grid: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

// Shared dark-mode violet mesh, matching the Key Findings section.
const DARK_MESH = [
  "radial-gradient(60% 55% at 5% 55%, rgba(56, 189, 248, 0.16) 0%, rgba(56, 189, 248, 0) 70%)",
  "radial-gradient(35% 80% at 28% 60%, rgba(167, 139, 250, 0.18) 0%, rgba(167, 139, 250, 0) 70%)",
  "radial-gradient(40% 35% at 55% 10%, rgba(139, 92, 246, 0.22) 0%, rgba(139, 92, 246, 0) 70%)",
  "radial-gradient(55% 70% at 95% 40%, rgba(129, 140, 248, 0.18) 0%, rgba(129, 140, 248, 0) 70%)",
  "radial-gradient(50% 50% at 80% 95%, rgba(96, 165, 250, 0.12) 0%, rgba(96, 165, 250, 0) 70%)",
  "radial-gradient(45% 40% at 45% 50%, rgba(168, 85, 247, 0.14) 0%, rgba(168, 85, 247, 0) 70%)",
].join(", ");

function MemberCard({ member }: { member: CommitteeMember }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={card}
      whileHover={reduce ? undefined : { y: -5 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="group flex h-full flex-col rounded-2xl border border-[#E5E7EB] bg-white/90 p-6 shadow-[0_1px_2px_rgba(26,26,46,0.04)] backdrop-blur-sm transition-[border-color,box-shadow] duration-200 ease-out hover:border-[#7150F4]/45 hover:shadow-[0_18px_40px_-16px_rgba(113,80,244,0.4)] dark:border-border dark:bg-card/80 dark:shadow-none dark:hover:border-primary/55"
    >
      <h3 className="text-base font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover:text-[#7150F4] dark:group-hover:text-primary md:text-lg">
        {member.name}
      </h3>
      {member.affiliation ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {member.affiliation}
        </p>
      ) : null}
    </motion.div>
  );
}

/**
 * Scientific Advisory Committee — centered header with a responsive grid of
 * member cards over the Key Findings violet mesh. Cards stagger in and lift
 * toward the brand accent on hover.
 */
export function AboutAdvisoryCommitteeSection({
  content = aboutDefaults,
}: {
  content?: AboutContent;
}) {
  return (
    <section className="relative isolate w-full overflow-hidden px-4 py-16 md:px-6 md:py-24 lg:py-28">
      {/* Light: theme background + Figma mesh image; Dark: violet radial mesh —
          shared with the Key Findings (Top Takeaways) section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-background"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat dark:hidden"
        style={{ backgroundImage: "url('/takeaways/takeaways-mesh-bg.jpg')" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden dark:block"
        style={{ backgroundImage: DARK_MESH }}
      />

      <div className="mx-auto max-w-5xl">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto flex max-w-2xl flex-col items-center text-center"
        >
          <SectionAccent color="blue" className="mb-5" />

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground lg:leading-[1.12]">
            {content.committeeHeading}
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base md:leading-[1.65]">
            {content.committeeSubtitle}
          </p>

          <SectionAccent color="pink" className="mt-5" />
        </motion.header>

        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-3"
        >
          {content.committeeMembers.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
