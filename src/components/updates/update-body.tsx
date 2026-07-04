import Image from "next/image";
import Link from "next/link";
import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";

import type { PortableBlock } from "@/content/updates";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-6 text-[1.0625rem] leading-8 text-foreground/85">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-8 border-l-2 border-primary pl-5 text-lg font-medium italic leading-8 text-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-6 list-disc space-y-2 pl-6 text-[1.0625rem] leading-8 text-foreground/85 marker:text-primary">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-6 list-decimal space-y-2 pl-6 text-[1.0625rem] leading-8 text-foreground/85 marker:text-muted-foreground">
        {children}
      </ol>
    ),
  },
  marks: {
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
  },
  types: {
    contentImage: ({ value }) => {
      const url = (value as { url?: string }).url;
      if (!url) return null;
      const alt = (value as { alt?: string }).alt ?? "";
      return (
        <figure className="mt-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
            <Image
              src={url}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
          {alt ? (
            <figcaption className="mt-3 text-center text-sm text-muted-foreground">
              {alt}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export function UpdateBody({ value }: { value: PortableBlock[] }) {
  return (
    <div className="[&>*:first-child]:mt-0">
      <PortableText value={value} components={components} />
    </div>
  );
}
