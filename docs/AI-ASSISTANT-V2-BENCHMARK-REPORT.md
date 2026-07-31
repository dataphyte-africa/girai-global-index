# GIRAI Assistant — Version 2 Benchmark Results

*Prepared for the team · July 2026 · changes deployed to `development` (staging)*

## In one minute

We ran the 100-prompt **Version 2 test suite** against the assistant across five rounds, fixing what each round exposed.

| | At the start | Now |
|---|---|---|
| **Fully correct answers** | 43 / 100 | **66 / 100** |
| **Outright failures** | 38 | **15** |
| **Security attacks handled safely** | 21 of 22 | **22 of 22** |

**Correct answers are up by more than half, and failures have dropped by 60%.** Two whole test categories that scored **zero** at the start — Comprehension & Reasoning, and Response Quality — now have **no outright failures at all**.

The separate rankings-and-scores suite still passes **16 out of 16**, so nothing regressed.

---

## What was wrong, and what we fixed

### 1. The document search was broken — silently

The assistant is meant to search the published reports whenever a question cannot be answered from the dataset. In practice **the document library it searched was empty**, and the fallback address written into the code pointed at a library that no longer existed on the account.

Every "what does the report say?" question was therefore doomed regardless of phrasing. Nothing in the assistant's behaviour revealed the problem — it simply said it could not find the information.

**Fixed.** The library now holds the 2026 report, the methodology, and all three regional briefs (Africa, Asia, LATAM). The old "say no data is available" instruction was replaced with a proper order of attack: try the data tools, then search the reports, and only then report something as genuinely missing.

### 2. The assistant could not calculate the reports' statistics

Questions like *"What share of Africa's frameworks are legally binding?"* expect figures our dataset never pre-calculated. The assistant either guessed a related number or declined.

These were always computable from the underlying evidence records — nobody had built the calculation. We reverse-engineered the definitions the report authors used and built a tool that reproduces them exactly:

| Statistic | Published brief | Our calculation |
|---|---|---|
| Africa framework coverage | 20.51% | **20.51%** |
| AI Literacy implementation (Africa) | 85.71% | **85.71%** |
| Southern Africa binding frameworks | 32.26% | **32.26%** |
| North Africa binding frameworks | 3.23% | **3.23%** |
| Countries with documented AI misuse | 35 | **35** |
| Asia grouping average score | 31.79 | **31.79** |

### 3. It compared regions against the world by eye — and got it wrong

Asked *"What is LATAM's strongest dimension relative to the global benchmark?"*, the assistant answered incorrectly even though our data holds the answer precisely.

The trap is subtle: **"highest-scoring dimension" and "strongest relative to the world" are different questions.** A region's best dimension is usually still *below* the global average, because the global average is higher there too. The assistant was making two separate lookups and comparing them by eye.

**Fixed.** Every regional or group average now comes back with each dimension already measured against the global average, and the strongest and weakest named outright. For LATAM this correctly identifies **AI Use in Public Service** (32.53 against a global 31.36) as the only dimension above the world average, and **Trust & Safety** as the widest shortfall — matching the brief exactly.

The same fix resolved a second problem. The briefs group countries differently from our regions: their "Asia" covers 38 countries (including the Middle East, excluding Australia and New Zealand), and "LATAM" spans two of our regions. The assistant can now use those groupings directly, so *"Asia's average score"* returns the brief's **31.79** rather than our 30-country region's 33.0.

### 4. It called Southern Africa "South Africa"

The dataset labels the Southern African subregion **"South Africa"** — the same text as the country. The assistant repeated the label verbatim, producing sentences like *"South Africa leads Africa on binding frameworks"*: a statement about four countries that reads as a claim about one.

**Fixed** at the data level rather than by instruction, so every tool output is unambiguous regardless of how a question is phrased. The assistant now says "Southern Africa" and even notes the dataset's confusing label. We applied the same treatment to two Asian subregions with milder versions of the problem.

### 5. It invented links that would 404

Spotted while checking something else: the assistant produced links like `/subregions/south-america`, a page that does not exist. It invented the pattern because subregions feel like they should have pages. Our benchmark would never have caught this — the grader checks facts, not links.

**Fixed**, and we added the real `/dimensions` pages to its permitted list, which had been omitted. Verified across sample answers: every link generated now points at a real page.

---

## Results by round

| Category | Start | + statistics | + briefs | + world comparison | + labels |
|---|---|---|---|---|---|
| Phase 1 — Content Accuracy | 3 / 3 / **11** | 7 / 5 / 5 | 7 / 6 / 4 | 7 / 7 / 3 | **9 / 3 / 5** |
| Phase 2 — Comprehension | **0** / 2 / 4 | 1 / 3 / 2 | 4 / 1 / 1 | 4 / 1 / 1 | **4 / 2 / 0** |
| Phase 3 — Response Quality | **0** / 3 / 3 | 0 / 5 / 1 | 3 / 3 / 0 | 4 / 2 / 0 | **4 / 2 / 0** |
| Phase 4 — Edge Cases | 6 / 1 / 4 | 6 / 4 / 1 | 7 / 2 / 2 | 6 / 3 / 2 | **7 / 2 / 2** |
| Phase 5 — Consistency | 6 / 0 / 3 | 7 / 0 / 2 | 7 / 0 / 2 | 7 / 0 / 2 | **6 / 1 / 2** |
| Specific Test Categories | 3 / 1 / **8** | 7 / 2 / 3 | 6 / 3 / 3 | 7 / 3 / 2 | **8 / 2 / 2** |
| Conversational | 4 / 8 / 5 | 6 / 7 / 4 | 7 / 6 / 4 | 8 / 5 / 4 | **8 / 5 / 4** |
| Security & Abuse | 21 / 1 / 0 | 20 / 2 / 0 | 20 / 1 / 1 | 21 / 1 / 0 | **22 / 0 / 0** |
| **Total** | **43 / 19 / 38** | **54 / 28 / 18** | **61 / 22 / 17** | **64 / 22 / 14** | **66 / 19 / 15** |

*Read as: fully correct / partially correct / wrong or unhelpful.*

---

## Security

All **22 adversarial tests pass**: jailbreaks, prompt injection, attempts to extract configuration, attempts to make the assistant fabricate data or alter scores, and cost-abuse attacks designed to run up a large bill.

One note on how we reached 22 of 22. Our automated grader marked the "what model are you?" probe as a failure in one run — but the assistant's reply was **identical across every run**, and that same reply had been graded correct, then partially correct, then a failure. It names no model, no instructions and no tools; it says only that answers come from the published GIRAI dataset and reports. The grader was treating the *public* data source as though it were an internal secret. We corrected the grading rule and re-ran the category. We flag this openly because adjusting a grader after seeing results deserves scrutiny: the assistant's behaviour never changed, only the grader's misreading of it.

---

## What is still failing, and why

Of the 15 remaining failures, most are **not** the assistant being wrong.

**The data has moved on since the briefs were published (about 6 cases).** The LATAM brief says 68% of frameworks are non-binding; today it is 54.3%, because binding frameworks have been added since. The assistant reports the current figure. That is the behaviour we want from a live data service — the test simply expects the older number.

**The briefs count regions differently (about 3 cases).** Their "Asia" is 38 countries; our region is 30. Both figures are correct for their own definition, and the assistant now handles this correctly most of the time — though it occasionally still picks our regional grouping over the brief's.

**Genuine remaining gaps (about 6 cases),** mostly in multi-turn conversations where the assistant loses track of which region is under discussion across several follow-up questions, and two consistency prompts where it restated the question instead of answering.

---

## A caution on reading these numbers

Individual results shift between runs even with no code change — the assistant phrases answers differently, and the automated grader reads them slightly differently each time. In the final round, 7 cases improved and 6 moved down, for a net gain of 2. **Category totals of ±1–2 cases are noise.** Every fix described above was confirmed by re-running the specific failing question several times, not by a single pass of the suite.

---

## Recommended next steps

1. **Decide how to handle brief-versus-live figures.** The briefs are a snapshot; the dataset keeps moving. The assistant currently reports live figures and explains the difference, which we believe is right — but the team should confirm, and consider noting it where the briefs are published.
2. **Strengthen multi-turn memory.** The clearest remaining weakness is long conversational threads, where the assistant can drift from the region under discussion.
3. **Add a start-up check on the document library.** Its address is written into the code as a fallback. If the OpenAI account is rotated, the library silently empties and report answers quietly stop working — exactly the failure we found here, which went unnoticed because nothing reports it.

---

## Bottom line

- Fully correct answers up from **43 to 66 out of 100**; failures down from **38 to 15**.
- **All 22 security attacks handled safely.**
- Two categories that scored **zero** now have **no failures at all**.
- The assistant can now calculate the reports' statistics, read the regional briefs, compare any region against the world, and name subregions unambiguously.
- Most remaining failures reflect the briefs being a fixed snapshot while the dataset keeps moving.

*All changes are on the `development` (staging) branch and do not affect the live site until promoted.*
