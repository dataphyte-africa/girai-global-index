# Sanity CMS Integration Plan

This document outlines how to connect the GIRAI Global Index website to Sanity CMS so that clients can change and update copy across different sections without code changes.

---

## 1. Requirements

### Sanity side
- **Sanity account** and a **project** + **dataset** (e.g. `production`).
- **Sanity Studio** (separate app or embedded) for the client to edit content.
- **API token** (optional for public read-only content; needed for draft/preview or if Studio and site have different origins).

### In this repo
- **Packages**: `next-sanity`, `@sanity/client`, `@sanity/image-url`. Optionally `sanity` (CLI) if Studio and schemas live in this repo.
- **Environment variables**: e.g. `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and optionally `SANITY_API_READ_TOKEN`.
- **Next.js**: Keep using **server components** where data is already fetched (e.g. `page.tsx`); fetch Sanity there and pass content as props into section components.

### Content to move to Sanity (inventory)

| Section / area | Current location | Editable in Sanity |
|----------------|------------------|--------------------|
| Hero | `hero-section.tsx` | Headline, highlight word, subtext, CTA label |
| Header | `header.tsx` | Nav items (label + href) |
| Choropleth | `choropleth-map-heading.tsx` | Title, description |
| Dimensions | `dimensions-section.tsx` + `src/data/dimensions-data.ts` | Section title/subtitle; per-dimension name, subtitle, description, indicators, image |
| Indicator categories | `indicator-category-section.tsx` | Category title + long description (and image path if desired) |
| Why GIRAI matters | `why-girai-matters-section.tsx` | Section title, subtitle; per card: title, description, image |
| Shaping Intelligence | `shaping-intelligence-section.tsx` | Headline lines |
| Footer | `footer-section.tsx` | Subscribe heading/description, form placeholders, CTA, link groups (Results, Explore regions, Other projects) |

Start with a subset (e.g. Hero, Why GIRAI, Footer) and expand.

---

## 2. Implementation steps

### Step 1: Sanity project and Studio
- Create a project at [sanity.io](https://sanity.io) and note **Project ID** and **Dataset** (e.g. `production`).
- Either:
  - **Option A**: Create a separate Sanity Studio repo and deploy it (e.g. `yourstudio.sanity.studio`), or
  - **Option B**: Add Studio inside this repo under e.g. `/studio` and deploy it with the same app (Next.js route or separate build).

### Step 2: Install and config
```bash
npm i next-sanity @sanity/client @sanity/image-url
# If Studio lives in this repo:
npm i -D sanity
```

- Add a shared Sanity client used by the app (and optionally by Studio):
  - **`src/lib/sanity.ts`** (or `sanity.config.ts` if Studio is in-repo): use `createClient` from `next-sanity` with `projectId`, `dataset`, `apiVersion` (e.g. `'2024-01-01'`), and `useCdn: true` for reads. If you use a token for draft content, add it only in server-side config and never expose it to the client.

### Step 3: Define schemas
In the Sanity project (or in this repo under e.g. `sanity/schemas/` if Studio lives here), define document and object types that mirror the sections you want editable, for example:

- **Hero**: object with `headline`, `highlight`, `subtext`, `ctaLabel`, `ctaHref`.
- **Header**: object or document with `navItems` (array of `{ label, href }`).
- **Choropleth heading**: object with `title`, `description`.
- **Dimensions**: document with section `title`/`subtitle` and an array of dimension objects: `id`, `name`, `subtitle`, `description`, `indicators` (array of strings), `image` (Sanity image).
- **Why GIRAI matters**: object with section `title`/`subtitle` and array of cards: `title`, `description`, `image` (Sanity image).
- **Shaping Intelligence**: object with e.g. `lines` (array of strings) or one rich text field.
- **Footer**: object with subscribe block (heading, body, placeholders, CTA label) and arrays of link groups (e.g. Results, Regions, Other projects) with `label` and `href`.

Use a single “Site settings” or “Home page” document that references these objects so the client has one place to edit (or one document per section if you prefer). Add **portable text** only where you need rich text (e.g. long descriptions); keep simple fields as string/array of strings for simplicity.

### Step 4: Fetch content in Next.js
- In **`src/app/page.tsx`** (and any other page that needs this copy), call your Sanity client and fetch the document(s) that hold the hero, header, choropleth heading, dimensions, indicator categories, why GIRAI, shaping intelligence, and footer.
- Use **GROQ** to request only the fields you need. Example pattern:

```groq
*[_type == "homePage"][0]{
  hero { headline, highlight, subtext, ctaLabel, ctaHref },
  headerNav[] { label, href },
  choroplethHeading { title, description },
  dimensionsSection { title, subtitle, dimensions[] { ... } },
  whyGiraiMatters { title, subtitle, cards[] { title, description, image } },
  shapingIntelligence { lines },
  footer { subscribe { ... }, linkGroups[] { ... } }
}
```

- Pass the result as props into your existing components (e.g. `<HeroSection content={homeContent.hero} ... />`, `<Header navItems={homeContent.headerNav} />`, etc.).

### Step 5: Refactor components to use props
- Replace hardcoded copy with props coming from Sanity.
- Keep layout and styling as-is; only the copy (and optionally image URLs) should come from Sanity.
- For **images**, use `@sanity/image-url` to build URLs from Sanity image refs and pass those into `next/image` (or keep external URLs in Sanity if you prefer).
- For **indicator-category-section**, you can either store only title + long text in Sanity and keep a single image path per category in Sanity, or move the image to Sanity assets.

### Step 6: Client workflow
- Give the client the URL of Sanity Studio (separate or `/studio`).
- They edit content there; when they publish, the dataset is updated.
- Your Next.js app reads from the same dataset (and optionally from drafts if you use a token and show a “Preview” mode).

### Step 7: Caching and revalidation
- Use Next.js **caching** for Sanity fetches (e.g. `fetch(..., { next: { revalidate: 60 } })` or the equivalent in `next-sanity`) so the site doesn’t hit Sanity on every request.
- Optionally add **on-demand revalidation** (e.g. Sanity webhook calling a Next.js API route) so updates go live quickly after publish.

---

## 3. Suggested order of work

1. Create Sanity project and Studio (separate or in-repo).
2. Add `src/lib/sanity.ts` and env vars.
3. Define schemas for **Hero**, **Why GIRAI matters**, and **Footer** (and optionally **Header**).
4. Fetch that content in `page.tsx` and refactor those components to accept props.
5. Add remaining sections (Choropleth, Dimensions, Indicator categories, Shaping Intelligence) and `dimensions-data`-equivalent content in Sanity.
6. Add image assets in Sanity where needed (e.g. Why GIRAI cards, dimensions, categories).
7. Add webhook + revalidate if you want instant updates after publish.

---

## 4. Considerations

- **Client components**: Sections that are `"use client"` (e.g. `WhyGIRAIMattersSection`, `ShapingIntelligenceSection`) don’t fetch Sanity themselves; the parent server component should fetch and pass content as props.
- **Dimensions and categories**: Moving `DIMENSIONS` and indicator category copy into Sanity gives one source of truth and editable descriptions without code changes.
- **Drafts**: If the client should preview unpublished changes, use a token and draft-aware queries and a preview route (e.g. with `perspective: 'previewDrafts'` and optionally a secret for the preview URL).

---

## 5. Environment variables (reference)

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
# Optional, for drafts/preview or private content:
# SANITY_API_READ_TOKEN=your_token
```

---

*Last updated: February 2025*
