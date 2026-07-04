import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { UpdateBody } from "@/components/updates/update-body";
import { formatUpdateDate } from "@/lib/updates";
import { getUpdateBySlug } from "@/content/updates";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getUpdateBySlug(slug);
  if (!post) return { title: "Update | GIRAI Global Index" };
  return {
    title: `${post.title} | GIRAI Global Index`,
    description: post.excerpt ?? undefined,
  };
}

export default async function UpdateDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getUpdateBySlug(slug);

  if (!post) notFound();

  const coverUrl = post.coverImage?.url;

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <SiteHeader />

      <main className="flex-1">
        <article className="w-full px-4 pt-10 pb-20 md:px-6 md:pt-14 md:pb-28">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/updates"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to Updates
            </Link>

            <header className="mt-8">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/80">
                  {post.category}
                </span>
                <span className="h-px w-5 shrink-0 bg-border" aria-hidden />
                <span className="whitespace-nowrap text-sm text-muted-foreground">
                  {formatUpdateDate(post.publishedAt)}
                </span>
              </div>

              <h1 className="mt-5 text-[2rem] font-semibold leading-[1.15] tracking-tight text-foreground md:text-[2.75rem]">
                {post.title}
              </h1>

              {post.excerpt ? (
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
              ) : null}

              {post.author ? (
                <p className="mt-6 text-sm font-medium text-foreground/70">
                  By {post.author}
                </p>
              ) : null}
            </header>
          </div>

          {coverUrl ? (
            <div className="mx-auto mt-10 max-w-4xl">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[24px] bg-muted">
                <Image
                  src={coverUrl}
                  alt={post.coverImage?.alt ?? post.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}

          <div className="mx-auto mt-12 max-w-3xl">
            {post.body && post.body.length > 0 ? (
              <UpdateBody value={post.body} />
            ) : (
              <p className="text-[1.0625rem] leading-8 text-foreground/85">
                {post.excerpt}
              </p>
            )}

            <div className="mt-16 border-t border-border pt-8">
              <Link
                href="/updates"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                All updates
              </Link>
            </div>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
