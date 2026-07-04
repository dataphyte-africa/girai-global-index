"use client";

import Image from "next/image";
import Link from "next/link";
import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";

import type { PortableBlock } from "@/content/keyFindings";

/** Inline marks shared by every finding rich-text block. */
const inlineMarks: PortableTextComponents["marks"] = {
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  link: ({ children, value }) => {
    const href = (value as { href?: string })?.href ?? "#";
    const external = /^https?:\/\//.test(href);
    return (
      <Link
        href={href}
        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </Link>
    );
  },
};

/** Summary: the styled one-liner at the top of the panel. */
const summaryComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-sm font-medium leading-relaxed text-foreground/90">
        {children}
      </p>
    ),
  },
  marks: inlineMarks,
};

/** Bright Spot: muted callout body. */
const brightSpotComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {children}
      </p>
    ),
  },
  marks: inlineMarks,
};

/** A chart/figure image embedded in the finding body. */
function FindingChart({
  value,
}: {
  value: {
    url?: string;
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
  };
}) {
  if (!value.url) return null;
  return (
    <figure className="mt-5">
      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/5 dark:ring-white/10">
        <Image
          src={value.url}
          alt={value.alt ?? ""}
          width={value.width ?? 900}
          height={value.height ?? 540}
          sizes="(max-width: 768px) 100vw, 720px"
          className="h-auto w-full"
        />
      </div>
      {value.caption ? (
        <figcaption className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {value.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** A simple data table embedded in the finding body. */
function FindingTable({
  value,
}: {
  value: {
    columns?: string[];
    rows?: { cells?: string[] }[];
    caption?: string;
    emphasizeLastRow?: boolean;
  };
}) {
  const columns = value.columns ?? [];
  const rows = (value.rows ?? []).map((r) => r.cells ?? []);
  if (columns.length === 0 && rows.length === 0) return null;

  return (
    <figure className="mt-5">
      <div className="overflow-x-auto rounded-xl bg-white/70 p-3 ring-1 ring-black/5 dark:bg-card/40 dark:ring-white/10">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-border">
              {columns.map((c, i) => (
                <th
                  key={i}
                  className={`px-2 py-1.5 font-semibold text-foreground/80 ${
                    i === 0 ? "text-left" : "text-right"
                  }`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const last =
                value.emphasizeLastRow && ri === rows.length - 1;
              return (
                <tr
                  key={ri}
                  className={`border-b border-border/40 ${
                    last ? "font-semibold text-foreground" : ""
                  }`}
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-2 py-1.5 tabular-nums ${
                        ci === 0
                          ? "text-left text-foreground/80"
                          : "text-right text-muted-foreground"
                      } ${last ? "text-foreground" : ""}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {value.caption ? (
        <figcaption className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {value.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Body: rich Key Evidence — text, lists, charts and tables. */
const bodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </p>
    ),
    h3: ({ children }) => (
      <h3 className="mt-5 text-base font-semibold text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-4 text-sm font-semibold text-foreground">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-4 border-l-2 border-primary/40 pl-4 text-sm italic leading-relaxed text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-3 space-y-2">{children}</ul>,
    number: ({ children }) => (
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-muted-foreground">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
        <span
          aria-hidden
          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/50"
        />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="text-sm leading-relaxed text-muted-foreground">
        {children}
      </li>
    ),
  },
  marks: inlineMarks,
  types: {
    findingChart: ({ value }) => <FindingChart value={value} />,
    findingTable: ({ value }) => <FindingTable value={value} />,
  },
};

export function FindingSummary({ value }: { value: PortableBlock[] }) {
  return (
    <div className="pt-4">
      <PortableText value={value} components={summaryComponents} />
    </div>
  );
}

export function FindingBody({ value }: { value: PortableBlock[] }) {
  return <PortableText value={value} components={bodyComponents} />;
}

export function FindingBrightSpotBody({ value }: { value: PortableBlock[] }) {
  return <PortableText value={value} components={brightSpotComponents} />;
}
