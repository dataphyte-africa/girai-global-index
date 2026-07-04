import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { updateHref } from "@/lib/updates";
import type { UpdatePost } from "@/content/updates";
import { UpdateMeta, UpdateThumb } from "./update-card";

function SidebarItem({ post }: { post: UpdatePost }) {
  return (
    <Link
      href={updateHref(post.slug)}
      className="group flex items-start gap-4"
    >
      <UpdateThumb
        post={post}
        sizes="80px"
        className="size-[76px] shrink-0 rounded-xl"
      />
      <div className="min-w-0 flex-1">
        <UpdateMeta category={post.category} publishedAt={post.publishedAt} />
        <h3 className="mt-2 line-clamp-2 text-[0.9375rem] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

export function FeaturedUpdatesSection({
  featured,
  sidebar,
}: {
  featured: UpdatePost;
  sidebar: UpdatePost[];
}) {
  return (
    <section className="w-full px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem]">
            Featured Update
          </h2>
          <Link
            href="#all-updates"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
          >
            See all
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          {/* Large featured card */}
          <Link
            href={updateHref(featured.slug)}
            className="group flex flex-col"
          >
            <UpdateThumb
              post={featured}
              sizes="(max-width: 1024px) 100vw, 640px"
              className="aspect-[16/10]"
              priority
            />
            <div className="mt-6">
              <UpdateMeta
                category={featured.category}
                publishedAt={featured.publishedAt}
              />
              <h3 className="mt-4 text-2xl font-semibold leading-[1.2] tracking-tight text-foreground transition-colors group-hover:text-primary md:text-[1.875rem]">
                {featured.title}
              </h3>
            </div>
          </Link>

          {/* Sidebar list */}
          <div className="flex flex-col gap-6">
            {sidebar.map((post) => (
              <SidebarItem key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
