import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  UpdatesHero,
  FeaturedUpdatesSection,
  UpdatesExplorer,
} from "@/components/updates";
import { getUpdates } from "@/content/updates";

export const metadata = {
  title: "Updates | GIRAI Global Index",
  description:
    "Exploring governance patterns, reforms, and debates shaping AI oversight globally — research, press releases, media coverage and methodology updates from GIRAI.",
};

export default async function UpdatesPage() {
  const posts = await getUpdates();

  const featured = posts.find((post) => post.featured) ?? posts[0] ?? null;
  const sidebar = featured
    ? posts.filter((post) => post._id !== featured._id).slice(0, 4)
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <SiteHeader />

      <main className="flex-1">
        <UpdatesHero />

        {featured ? (
          <>
            <FeaturedUpdatesSection featured={featured} sidebar={sidebar} />
            <UpdatesExplorer posts={posts} />
          </>
        ) : (
          <section className="w-full px-4 py-24 md:px-6">
            <div className="mx-auto max-w-7xl rounded-2xl border border-dashed border-border py-24 text-center">
              <p className="text-lg font-semibold text-foreground">
                No updates yet
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Publish an update in the Studio and it will appear here.
              </p>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
