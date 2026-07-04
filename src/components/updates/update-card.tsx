import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { formatUpdateDate, updateHref } from "@/lib/updates";
import type { UpdatePost } from "@/content/updates";

/** Category pill + hairline + date row shared across the Updates surfaces. */
export function UpdateMeta({
  category,
  publishedAt,
  className,
}: {
  category: string;
  publishedAt: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/80">
        {category}
      </span>
      <span className="h-px w-5 shrink-0 bg-border" aria-hidden />
      <span className="whitespace-nowrap text-sm text-muted-foreground">
        {formatUpdateDate(publishedAt)}
      </span>
    </div>
  );
}

/** Cover image with a branded gradient fallback when no image is set. */
export function UpdateThumb({
  post,
  sizes,
  className,
  priority,
}: {
  post: Pick<UpdatePost, "coverImage" | "category" | "title">;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const url = post.coverImage?.url;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-muted",
        className
      )}
    >
      {url ? (
        <Image
          src={url}
          alt={post.coverImage?.alt ?? post.title}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 flex items-end bg-[linear-gradient(135deg,var(--primary)_0%,#1a1145_100%)] p-5">
          <span className="text-sm font-medium uppercase tracking-wider text-white/85">
            {post.category}
          </span>
        </div>
      )}
    </div>
  );
}

/** Standard grid card: image on top, meta + title below. */
export function UpdateCard({ post }: { post: UpdatePost }) {
  return (
    <Link href={updateHref(post.slug)} className="group flex flex-col">
      <UpdateThumb
        post={post}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="aspect-[16/10]"
      />
      <div className="mt-4 flex flex-1 flex-col">
        <UpdateMeta category={post.category} publishedAt={post.publishedAt} />
        <h3 className="mt-3 text-[1.0625rem] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}
