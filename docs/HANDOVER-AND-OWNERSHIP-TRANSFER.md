# GIRAI Global Index — Handover & Ownership Transfer

**Project:** GIRAI Global Index website
**Repository:** `github.com/dataphyte-africa/girai-global-index`
**Prepared for:** Client / GIRAI operations team
**Date:** July 2026

This document is the single reference for taking full ownership of the GIRAI Global Index website: every account, service, key, and domain that keeps the site running, and what you need to do to move each one into your own name.

> **Read this first.** Nothing on this site works long-term until the accounts below are owned by *you* (the client), not by the developer. The step-by-step checklist in **Section 9** is the actual handover — the rest of the document explains what each item is and why it matters.

---

## 1. What the site is (in one paragraph)

The GIRAI Global Index is a **Next.js 16 / React 19** web application. Most of the site is **pre-rendered static pages** built from Excel datasets, so it is fast and cheap to host. On top of that it runs a few live services: a **Sanity CMS** for editable content, an **AI research assistant** (OpenAI), a **newsletter signup** (Mailchimp), a **data-download form** (Google Sheets), and **downloadable reports/datasets** served from Google Cloud Storage. There is **no traditional database** — the index data lives in the code repository as compiled JSON.

---

## 2. Infrastructure & hosting — the big picture

| Layer | Provider | What it does | Cost model |
|-------|----------|--------------|-----------|
| **Web hosting** | **Any Next.js-compatible host** *(currently Firebase App Hosting)* | Runs and serves the live website | Usage-based |
| **Source code** | **GitHub** (`dataphyte-africa/girai-global-index`) | Stores the code; deploys trigger from here | Free / GitHub plan |
| **Content CMS** | **Sanity** | Editable text, images, blog/updates | Free tier likely sufficient |
| **AI assistant** | **OpenAI** (API + vector store) | Powers the “ask GIRAI” chat assistant | Pay-per-use API key |
| **Report/data downloads** | **Object storage** *(currently a Google Cloud Storage bucket)* | Hosts large PDF reports & Excel datasets | Usage-based |
| **Newsletter** | **Mailchimp** | Footer email subscription | Mailchimp plan |
| **Form capture** | **Google Sheets** (service account) | Stores data-download request submissions | Free |
| **Domain / DNS** | *(see Section 8)* | Public web address | Registrar fee |

### The site is host-portable

The website is a **standard Next.js 16 Node application**. It is **not locked to any single hosting provider** — it can run on any platform that supports Next.js (SSR/SSG) and Node.js 20+. What each host needs is the same: run `pnpm build`, then serve the app, with the environment variables from Section 4 configured.

**Recommended / compatible hosts:**

| Platform | Fit | Notes |
|----------|-----|-------|
| **Vercel** | ★ Easiest | Made by the Next.js team; connect the GitHub repo and it deploys automatically. Best default choice. |
| **Firebase App Hosting** | Current setup | Google Cloud Run under the hood; already configured (see below). |
| **Netlify** | ★ Easy | Native Next.js support; connect GitHub and deploy. |
| **Railway / Render / Fly.io** | Good | `pnpm build` + `pnpm start`; simple managed Node hosting. |
| **AWS (Amplify / ECS / Lambda)** | Advanced | For teams already on AWS. |
| **Docker (self-hosted)** | Advanced | Build a container and run anywhere. |

Whichever host you choose, the moving parts that must exist are: (a) the Node build/run, (b) the environment variables/secrets, (c) the object storage for large downloads, and (d) the DNS pointing your domain at the host.

### Current setup (Firebase App Hosting)

Today the site is deployed on **Firebase App Hosting** (backend ID **`girai`**, Google Cloud project **`girai-global-index`**). The Google Cloud Storage download bucket and the Google Sheets integration also live inside that same Google Cloud project, so transferring that one project moves most of the current infrastructure at once.

**How a deploy works today:**
1. Code is pushed to the `main` branch on GitHub.
2. Firebase App Hosting automatically builds and deploys it.
3. Build settings and environment variables are defined in [`apphosting.yaml`](../apphosting.yaml).

You do **not** need to run any manual deploy commands for normal content updates — content is edited in Sanity and published live without a code deploy.

> **If you migrate to another host:** point that host at the same GitHub repo, copy every environment variable from Section 4 into that host’s settings/secrets manager, keep the download files in some object storage (or move them), and update DNS. No code changes are required.

---

## 3. Accounts you must own

These are the accounts that must be transferred to (or recreated under) the client’s ownership. **Until this is done, the developer still controls the site.**

| # | Account | Where | Why it’s critical | Current owner → target |
|---|---------|-------|-------------------|------------------------|
| 1 | **Hosting account** *(currently Google Cloud / Firebase project `girai-global-index`; or Vercel/Netlify/etc.)* | host’s console | Runs & serves the live site | Developer → **Client** |
| 2 | **GitHub** repo `dataphyte-africa/girai-global-index` | github.com | Owns the source code | Dataphyte org → **Client / agreed owner** |
| 3 | **Sanity** project (ID `wwnfg3le`) | sanity.io/manage | Owns all editable content | Developer → **Client** |
| 4 | **OpenAI** account + API key | platform.openai.com | Powers AI assistant, billed per use | Developer → **Client** |
| 5 | **Mailchimp** account | mailchimp.com | Owns newsletter list | Developer/Client |
| 6 | **Object storage** for report/dataset downloads *(currently a Google Cloud Storage bucket)* | host’s console | Hosts large downloadable files | Developer → **Client** |
| 7 | **Domain registrar** account | *(Section 8)* | Owns the web address | *(confirm)* |
| 8 | **Billing / payment account** for the hosting & storage provider | provider billing console | Pays for hosting & storage | Developer → **Client** |

> Items 1, 6, and 8 are provider-specific. On the **current Firebase setup** they are all the same **Google Cloud project + billing account**, so transferring that one project covers all three. If you migrate hosts, they may become separate accounts (e.g. a Vercel account for hosting + a separate storage/billing account).

---

## 4. Environment variables & secrets

The application is configured entirely through environment variables. There are **no passwords hard-coded** in the site — everything sensitive is an environment variable or a secret stored in the host’s secrets manager.

### 4.1 Where they live
Every host has a place to set environment variables and secrets (Vercel/Netlify: project settings; Firebase: Secret Manager + `apphosting.yaml`; Docker: env file / orchestrator secrets). The **values** below are the same regardless of host — only *where you paste them* changes.

In the **current Firebase setup**:
- **Public config & non-secret values:** defined directly in [`apphosting.yaml`](../apphosting.yaml) (committed to the repo).
- **Secrets (API keys, tokens):** stored in **Google Cloud Secret Manager**, referenced by name from `apphosting.yaml`. They are **never** committed to the repo.
- **Local development:** a `.env.local` file on the developer machine (template provided as [`.env.local.example`](../.env.local.example)).

### 4.2 Full variable reference

| Variable | Type | Purpose | Where set |
|----------|------|---------|-----------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public | Sanity project id (`wwnfg3le`) | apphosting.yaml |
| `NEXT_PUBLIC_SANITY_DATASET` | Public | Sanity dataset (`production`) | apphosting.yaml |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Public | Sanity API date (`2024-10-01`) | apphosting.yaml |
| `SANITY_API_READ_TOKEN` | **Secret** | Reads draft/preview content | Secret Manager |
| `SANITY_API_WRITE_TOKEN` | **Secret** | Seeding content from scripts (local only) | `.env.local` |
| `SANITY_REVALIDATE_SECRET` | **Secret** | Verifies Sanity → site “content changed” webhook | Secret Manager |
| `OPENAI_API_KEY` | **Secret** | Authenticates the AI assistant to OpenAI | Secret Manager |
| `OPENAI_VECTOR_STORE_ID` | Config | The knowledge base the assistant searches (`vs_6a3a…`) | apphosting.yaml |
| `GIRAI_ASSISTANT_MODEL` | Optional | Overrides the AI model (default `gpt-4.1`) | optional |
| `MAILCHIMP_API_KEY` | **Secret** | Newsletter subscribe | Secret Manager / `.env.local` |
| `MAILCHIMP_AUDIENCE_ID` | Config | Mailchimp list id (`77f7ced742`) | apphosting.yaml / env |
| `MAILCHIMP_SERVER_PREFIX` | Config | Mailchimp datacenter (`us17`) | env |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Config | Sheet that stores form submissions | env |
| `GOOGLE_SHEETS_SHEET_NAME` | Config | Tab name (`Submissions`) | apphosting.yaml |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | **Secret** | Google Sheets write access | Secret Manager / `.env.local` |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | **Secret** | Google Sheets write access | Secret Manager / `.env.local` |
| `DOWNLOAD_FIRST_REPORT_PATH` etc. | Config | Public URLs of report/dataset downloads (GCS) | apphosting.yaml |
| `NEXT_PUBLIC_SITE_URL` | Config | Canonical site URL (for citations/SEO) | env |

> **Action required:** After the OpenAI, Mailchimp, and Sanity accounts are transferred, **all their keys must be regenerated** and updated in Secret Manager (see Section 9). The developer’s old keys should be revoked.

---

## 5. OpenAI API key & the AI assistant

The “ask GIRAI” assistant uses the **OpenAI API** with a **vector store** (a pre-built knowledge base of the GIRAI reports and data).

| Item | Value / detail |
|------|----------------|
| Service | OpenAI Platform (`platform.openai.com`) |
| Secret | `OPENAI_API_KEY` — stored in Google Cloud Secret Manager |
| Vector store id | `vs_6a3a6e41c3548191b72539d24aa60b0b` |
| Default model | `gpt-4.1` (overridable via `GIRAI_ASSISTANT_MODEL`) |
| Billing | **Pay-as-you-go** — every question costs a small amount |

**What you must do:**
1. Create or confirm a client-owned OpenAI account and **add a payment method** — the assistant stops working the moment the key’s billing is invalid.
2. Generate a **new** `OPENAI_API_KEY` under the client account.
3. Update the secret in Firebase (Section 9).
4. Recreate/confirm the **vector store** under the client’s OpenAI account and update `OPENAI_VECTOR_STORE_ID` if it changes. *The current vector store belongs to whichever OpenAI account created it — if that is the developer’s account, it must be rebuilt under yours.*
5. **Set a monthly spending limit** in the OpenAI dashboard to avoid surprises.

---

## 6. Sanity CMS (already integrated)

Sanity is **fully integrated and live** — this is where non-technical editors change site content without touching code.

| Item | Value |
|------|-------|
| Project ID | `wwnfg3le` |
| Dataset | `production` |
| Studio (editor) URL | `https://<your-domain>/studio` |
| Manage/admin | `https://sanity.io/manage` |

**How editing works:**
- Editors log in at **`/studio`** on the live site.
- They edit text, images, and the “Updates” blog, then click **Publish**.
- A **webhook** notifies the site and the changed pages refresh automatically (no code deploy needed). The webhook is secured by `SANITY_REVALIDATE_SECRET`.

**What you must do:**
1. Have the client accept ownership / admin role on the Sanity project (`sanity.io/manage` → Members).
2. Invite your editorial team as members.
3. Regenerate the `SANITY_API_READ_TOKEN` and `SANITY_API_WRITE_TOKEN` under the client account if the developer is removed.

> ⚠️ **Important content-safety note:** Running the developer script `pnpm seed:sanity` **re-seeds every document from the code defaults and overwrites Studio edits.** This script is for initial setup only — it must **not** be run against `production` after editors have started working, or their changes will be lost.

---

## 7. Report & dataset downloads (Google Cloud Storage)

The large downloadable files (PDF reports and Excel datasets) are **not** in the website code — they are hosted in a **Google Cloud Storage bucket** because they exceed Firebase’s deploy size limit.

| File | Public URL |
|------|-----------|
| 2024 report (PDF) | `storage.googleapis.com/girai-global-index-downloads/GIRAI-2024-report.pdf` |
| 2026 report (PDF) | `storage.googleapis.com/girai-global-index-downloads/GIRAI-2026-report.pdf` |
| 2024 dataset (XLSX) | `storage.googleapis.com/girai-global-index-downloads/GIRAI_2024_dataset.xlsx` |
| 2026 dataset (XLSX) | `storage.googleapis.com/girai-global-index-downloads/GIRAI_2026_dataset.xlsx` |

- Bucket name: **`girai-global-index-downloads`** (inside the `girai-global-index` Google Cloud project).
- To update a report, upload a new file to the bucket (same filename) — no code change needed.
- The download URLs are wired into the site via the `DOWNLOAD_*` variables in `apphosting.yaml`.

---

## 8. Domain name & DNS

> **⚠️ Confirm before sign-off — this section needs the client’s input.**

The custom domain (e.g. the public `girai...` address) is connected to Firebase App Hosting via a **custom domain mapping** and DNS records at the registrar.

**What you must confirm and own:**
1. **Registrar account** — where the domain was purchased (e.g. Namecheap, GoDaddy, Google Domains/Squarespace, Cloudflare). This must be in the **client’s** name with auto-renew and a valid payment method.
2. **DNS records** — the domain points to Firebase Hosting via `A`/`CNAME`/`TXT` records added in Firebase Console → App Hosting → Custom domains.
3. **SSL certificate** — Firebase provisions HTTPS automatically once DNS verifies; nothing to buy.

**Action:** If the domain is currently registered under the developer’s account, initiate a **domain transfer** to the client’s registrar account, or at minimum add the client as an owner and update billing. **A lapsed domain renewal takes the whole site offline** — put it on auto-renew.

*(Fill in the exact domain and registrar here once confirmed: `______________________`)*

---

## 9. Ownership transfer checklist (do these in order)

- [ ] **1. Hosting account** — Transfer ownership of the hosting to the client. *If staying on the current Firebase setup:* transfer the `girai-global-index` Google Cloud project — Firebase Console → Project Settings → Users & Permissions → add client as **Owner**; move it to the client’s **billing account**; remove the developer. *If migrating to another host (e.g. Vercel/Netlify):* create the account under the client, connect the GitHub repo, and set the environment variables from Section 4.
- [ ] **2. GitHub repository** — Transfer the repo (or fork) to the client’s GitHub organization, or add the client as an admin. Confirm the Firebase ↔ GitHub deploy connection still works after transfer.
- [ ] **3. Sanity** — Add client as admin on project `wwnfg3le` (`sanity.io/manage`); invite editors; regenerate API tokens; remove developer.
- [ ] **4. OpenAI** — Create/confirm client-owned account, add billing + spend limit, generate a **new** API key, rebuild the vector store under the client account if needed.
- [ ] **5. Mailchimp** — Transfer or recreate the account; confirm audience `77f7ced742`; regenerate API key.
- [ ] **6. Google Sheets** — Confirm the submissions spreadsheet and service account are owned by the client; regenerate the service-account key if the developer is removed.
- [ ] **7. Domain & DNS** — Confirm registrar ownership, enable auto-renew, verify DNS still points to Firebase.
- [ ] **8. Regenerate & update all secrets** — After each account transfer, generate fresh keys and update them in your host’s secrets/environment settings. On the **current Firebase setup**:
  ```bash
  firebase apphosting:secrets:set OPENAI_API_KEY
  firebase apphosting:secrets:set SANITY_API_READ_TOKEN
  firebase apphosting:secrets:set SANITY_REVALIDATE_SECRET
  # …and any others that changed
  ```
  On Vercel/Netlify, set the same variables in the project’s Environment Variables settings instead.
- [ ] **9. Revoke all developer keys** — Once the site is confirmed working on the client’s keys, revoke every old key/token the developer held.
- [ ] **10. Final verification** — Load the live site and confirm: pages load, `/studio` editing works, AI assistant answers, newsletter signup works, and report downloads work.

---

## 10. Running & maintaining the site (for a future developer)

```bash
# Prerequisites: Node.js 20+, pnpm
pnpm install          # install dependencies
pnpm dev              # run locally at http://localhost:3000
pnpm build            # production build (auto-compiles the Excel data first)
pnpm start            # run the production build locally
pnpm lint             # code linting
```

- **Content edits:** done in Sanity Studio (`/studio`) — no developer needed.
- **Report/data file updates:** upload to the `girai-global-index-downloads` GCS bucket.
- **Index data updates (new edition):** replace the Excel workbooks in `src/data/2026/`, run `pnpm build:data`, commit, and push — Firebase redeploys automatically.
- **Deploys:** automatic on push to `main` via Firebase App Hosting.

---

## 11. Reference documents in this repo

| Document | What it covers |
|----------|----------------|
| [`docs/tech-stack-and-infrastructure.md`](tech-stack-and-infrastructure.md) | Full technical architecture |
| [`docs/SANITY-CMS-INTEGRATION.md`](SANITY-CMS-INTEGRATION.md) | How the CMS is wired up |
| [`docs/AI-ASSISTANT-TECH-STACK.md`](AI-ASSISTANT-TECH-STACK.md) | AI assistant design & OpenAI setup |
| [`apphosting.yaml`](../apphosting.yaml) | Live hosting config & environment variables |
| [`.env.local.example`](../.env.local.example) | Template of all required env variables |
| `docs/adr/` | Architectural decision records |

---

## 12. Handover sign-off

| Item | Confirmed by client | Date |
|------|:---:|:---:|
| Google Cloud / Firebase project owned by client | ☐ | |
| GitHub repository access transferred | ☐ | |
| Sanity CMS admin access transferred | ☐ | |
| OpenAI account + key owned & billed by client | ☐ | |
| Mailchimp account owned by client | ☐ | |
| Domain & DNS owned by client (auto-renew on) | ☐ | |
| All secrets regenerated; developer keys revoked | ☐ | |
| Live site fully verified | ☐ | |

**Handed over by:** ______________________  **Date:** __________

**Accepted by (client):** ______________________  **Date:** __________
