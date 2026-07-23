# GIRAI Assistant — Accuracy Improvements & Benchmark

*Prepared for the team · July 2026 · deployed to `development`*

## In one minute

We put the GIRAI chatbot through a structured accuracy test and fixed everything that made it give wrong or incomplete answers. The assistant now answers **every question in our test set correctly (16/16, checked three times each)** — up from roughly half before.

Along the way we found that our **manual test spreadsheet itself contained four factual mistakes**, and we caught a bug that could have made the bot confidently present wrong data to real users. Both are now fixed.

Everything is live on the `staging` website. Nothing touches the production site until the team promotes to `live website`.

---

## What was wrong, and what we fixed

The work happened in two phases. The earlier phase (already reviewed and merged) closed gaps where the bot simply couldn't reach parts of our data. The latest phase (this update) added regional depth and caught a hidden bug.

### 1. The bot couldn't answer questions about sub-regions

Our dataset labels every country with a **sub-region** — East Asia, West Africa, South America, the Caribbean, and so on. But the chatbot had no way to use that label. Ask it *"Which Asian sub-region performs best?"* or *"Does Central America beat the global average?"* and it had no reliable way to answer.

**Fixed.** The assistant now understands sub-regions fully — it can rank them, average them, list their countries, and compare them to the global average. It also understands the everyday names people actually use (e.g. someone types "South Asia" and it maps to the dataset's label for that group), so users don't need to know our internal naming.

### 2. A hidden bug that could show wrong data as if it were right

This is the most important find. When a user asked about a group the bot didn't recognise as an official region — for example **"Which country leads LATAM?"** — the bot quietly ignored the filter and pulled from the *entire* index instead of the countries asked about. The result: it once answered "LATAM" with **Norway** at the top.

The dangerous part wasn't the wrong answer — it's that the bot had **no idea it was wrong** and presented it with full confidence.

**Fixed.** The bot now recognises when a place-name doesn't match and says so, rather than silently substituting the whole dataset. If the name is actually a sub-region, it corrects course automatically.

### 3. Earlier fixes already merged (recap for context)

These landed just before this update and are worth noting since they're part of the same accuracy push:

- **"Which countries have [type of] evidence?"** — the bot used to stop halfway through the alphabet and imply that was the full list, or wrongly claim no such evidence existed. It now returns the complete, correct set every time.
- **"List all countries ranked"** — the bot would return the top 50 and present it as if it were all 135. It now always states the true total and flags when it's showing a partial list.
- **Several "how many countries score above X" style questions** — a broken filter meant these silently returned nothing. Fixed, so the bot answers instead of saying "no data available."
- **Deeper data reach** — the bot can now answer more specialised questions (e.g. where a country's AI *policy* is strong but *implementation* lags, or which topic area has the most documented evidence).

---

## The test spreadsheet had four errors of its own

While building an automated version of our manual test sheet, we re-checked every "correct answer" against the actual dataset the website serves. **Four of the sheet's expected answers were wrong** — meaning the bot was previously being marked down for giving the *right* answer.

| Question | Sheet said | Actually correct | What happened |
|---|---|---|---|
| How many African countries score above the global average? | **Six** | **Seven** | The sheet missed Côte d'Ivoire (35.18), which does clear the average. |
| What is the global average score? | 34.99 | **35.02** | The sheet's own notes column already said 35.02 — the two columns contradicted each other. |
| Nigeria's score and rank | 45.87, rank 39 | **45.93, rank 38** | The sheet even listed "rank 38" as a *warning sign* while its answer said 39. |
| Africa's average score | 21.81 | **21.79** | Minor rounding difference. |

**Why the gap exists:** these figures appear to come from the published regional briefs, while the website and the chatbot both serve the live dataset. Where the two disagree, we treated the dataset as the source of truth, since that's what users actually see. **Worth a team decision:** if the briefs are the "official" published numbers, we may want to reconcile the two so the website, the briefs, and the bot all agree.

---

## How we tested — and a benchmark of other models

We built an automated test that runs all 16 questions against the real assistant, three times each, and grades the answers automatically. This replaces the slow manual spreadsheet process and can be re-run any time — before a release, or when we consider changing the underlying AI model.

We used it to benchmark our current model (**GPT-5.1**) against two cheaper, faster alternatives:

| Model | Accuracy (3 runs) | Speed | Notes |
|---|---|---|---|
| **GPT-5.1** (in production) | **100%** | ~6 sec | No wrong answers |
| GPT-5-nano | 94% | ~27 sec | Occasional misreads; also much slower |
| GPT-5.4-nano | 90% | ~7 sec | A few confident mistakes |

**Takeaway:** the model we're running is both the most accurate *and* competitively fast. The cheaper options save cost but give up correctness on exactly the kind of nuanced regional questions this index is about — not a good trade for a research tool.

### Full per-question results

Each cell shows how many of **3 runs** the model got fully right. Green = perfect, anything less is where that model slipped.

| # | Question | GPT-5.1 | GPT-5-nano | GPT-5.4-nano |
|---|---|:---:|:---:|:---:|
| 1 | Nigeria's GIRAI score | 3/3 | 3/3 | 3/3 |
| 2 | Highest-scoring African country | 3/3 | 3/3 | 2/3 |
| 3 | Country leading LATAM | 3/3 | 3/3 | 3/3 |
| 4 | Japan's score and Asia rank | 3/3 | 3/3 | 3/3 |
| 5 | 2nd in the Middle East | 3/3 | 3/3 | 3/3 |
| 6 | Global average score | 3/3 | 3/3 | 3/3 |
| 7 | Lowest-scoring region | 3/3 | 3/3 | 2/3 |
| 8 | Chile's score and rank | 3/3 | 3/3 | 3/3 |
| 9 | Dominican Republic score, rank, standout | 3/3 | 3/3 | 3/3 |
| 10 | Lowest performer in Asia | 3/3 | **1/3** | 3/3 |
| 11 | African countries above global average | 3/3 | 3/3 | **1/3** |
| 12 | Egypt's score and rank | 3/3 | 3/3 | 3/3 |
| 13 | Best-performing Asian sub-region | 3/3 | **2/3** | **2/3** |
| 14 | LATAM sub-region above global average | 3/3 | 3/3 | 3/3 |
| 15 | Brazil's GIRAI score | 3/3 | 3/3 | 3/3 |
| 16 | Brazil's overall performance | 3/3 | 3/3 | 3/3 |
| | **Total (perfect runs)** | **48/48** | **45/48** | **43/48** |

Where the cheaper models slip, it's on the harder reasoning questions — counting which countries clear the average, identifying the true lowest performer, or naming the best sub-region (where one of them keeps mistaking Australia/New Zealand for an "Asian" sub-region). The current model got all sixteen right, every time. The raw run-by-run data is in `results/benchmark-comparison.csv`.

---

## Bottom line

- **The assistant now answers our full test set with 100% accuracy**, up from ~50%.
- A **silent-failure bug** that could show wrong data confidently is fixed.
- The bot now handles **regional and sub-regional questions** the index is really about.
- Our **test sheet's own errors are corrected**, so future testing measures the bot fairly.
- We have a **repeatable accuracy test** to guard against regressions and to vet model changes.
- One open question for the team: **reconcile the regional-brief figures with the live dataset**, so all our published numbers agree.

*All changes are on the `staging` environment and do not affect the live site until promoted.*
