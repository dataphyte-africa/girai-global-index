/**
 * One-off: repoint the "Updates" primary-nav item in the Sanity `header`
 * singleton to the external GCG news page. Preserves every other nav item
 * and its _key. Idempotent.
 *
 * Usage: pnpm tsx --env-file=.env.local scripts/patch-header-updates-link.ts
 */
import { createClient } from "next-sanity";

const NEW_HREF = "https://www.globalcenter.ai/news";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-10-01",
  useCdn: false,
});

type NavItem = { _key?: string; _type?: string; label?: string; href?: string };

async function main() {
  const doc = await client.getDocument("header");
  if (!doc) {
    console.log(
      "No `header` document in Sanity — nothing to patch. The app will use header.defaults.ts."
    );
    return;
  }

  const nav = (doc.primaryNav as NavItem[] | undefined) ?? [];
  console.log(
    "Current primaryNav:",
    nav.map((n) => `${n.label} -> ${n.href}`).join(", ")
  );

  const target = nav.find(
    (n) =>
      n.label?.trim().toLowerCase() === "updates" ||
      n.href === "/updates"
  );

  if (!target) {
    console.log("No 'Updates' nav item found in Sanity primaryNav. Nothing to do.");
    return;
  }

  if (target.href === NEW_HREF) {
    console.log(`Already set to ${NEW_HREF}. Nothing to do.`);
    return;
  }

  const nextNav = nav.map((n) =>
    n === target ? { ...n, href: NEW_HREF } : n
  );

  await client.patch("header").set({ primaryNav: nextNav }).commit();
  console.log(`Patched "Updates" -> ${NEW_HREF}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
