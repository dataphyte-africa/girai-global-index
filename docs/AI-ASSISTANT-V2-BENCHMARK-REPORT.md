# GIRAI Assistant — Version 2 Benchmark Results

*Prepared for the team · July 2026 · changes deployed to `development` (staging)*

## In one minute

We ran the 100-prompt **Version 2 test suite** against the assistant three times, fixing what each round exposed. The results:

| | At the start | Now |
|---|---|---|
| **Fully correct answers** | 43 / 100 | **61 / 100** |
| **Outright failures** | 38 | **17** |
| **Security attacks handled safely** | 21 of 22 | **22 of 22** |

**Failures more than halved and fully-correct answers rose by 42%.** Two changes did most of the work: the assistant can now **calculate the statistics** the reports quote (binding-law rates, framework coverage, civil-society activity), and it can now **read the regional briefs** — which it previously could not, because the document library it searched was empty.

The separate rankings-and-scores test suite still passes **16 out of 16**.

---

## What we found and fixed

### 1. The document search was broken — silently

The assistant is meant to search the published reports when a question cannot be answered from the dataset. In practice **the document library it pointed at was empty**, and the fallback address written into the code referred to a library that no longer existed on the account.

Every "what does the report say?" question was therefore doomed regardless of how it was asked. This is why two whole test categories — Comprehension & Reasoning, and Response Quality — scored **zero** at the start. Nothing in the assistant's behaviour revealed the problem; it simply said it could not find the information.

**Fixed.** The library now holds the main 2026 report, the methodology, and all three regional briefs (Africa, Asia, LATAM). We also replaced the assistant's old "say no data is available" instruction with a proper order of attack: try the data tools first, then search the reports, and only then say something is genuinely missing.

### 2. The assistant could not calculate the report's statistics

Questions like *"What share of Africa's frameworks are legally binding?"* or *"Which indicator is best implemented?"* expect figures that our dataset never pre-calculated. The assistant had no way to produce them, so it either guessed a related number or declined.

These statistics were always computable from the underlying evidence records — nobody had built the calculation. We worked out the exact definitions the report authors used and built a tool that reproduces them. Checked against the published briefs:

| Statistic | Report | Our calculation |
|---|---|---|
| Africa framework coverage | 20.51% | **20.51%** |
| AI Literacy implementation (Africa) | 85.71% | **85.71%** |
| Southern Africa binding frameworks | 32.26% | **32.26%** |
| Countries with documented AI misuse | 35 | **35** |
| LATAM misuse cases | 6 across 5 countries | **6 across 5 countries** |

The assistant now uses this tool in roughly a third of all test questions.

### 3. Three smaller faults, caught along the way

- Asked which African subregion performs best, it answered **West Africa while simultaneously stating that West Africa ranked 2nd**. It had looked up one subregion and misread its position. The tool now always reports the region's actual leader alongside any single lookup.
- "Does wide framework coverage mean rules are enforced?" was being answered from report prose instead of the data. It now calculates the binding-law share properly (North Africa: 1 of 31 frameworks, 3.2% — exactly the brief's figure).
- "Most legally aggressive" is genuinely ambiguous between the highest *share* of binding laws and the largest *number* of them, and the two disagree. The assistant now reports both readings instead of silently picking one.

---

## Results by category

| Category | Start | After statistics tool | After briefs added |
|---|---|---|---|
| Phase 1 — Content Accuracy | 3 / 3 / **11** | 7 / 5 / 5 | **7 / 6 / 4** |
| Phase 2 — Comprehension & Reasoning | **0** / 2 / 4 | 1 / 3 / 2 | **4 / 1 / 1** |
| Phase 3 — Response Quality | **0** / 3 / 3 | 0 / 5 / 1 | **3 / 3 / 0** |
| Phase 4 — Edge Cases & Robustness | 6 / 1 / 4 | 6 / 4 / 1 | **7 / 2 / 2** |
| Phase 5 — Consistency | 6 / 0 / 3 | 7 / 0 / 2 | **7 / 0 / 2** |
| Specific Test Categories | 3 / 1 / **8** | 7 / 2 / 3 | **6 / 3 / 3** |
| Conversational (multi-turn) | 4 / 8 / 5 | 6 / 7 / 4 | **7 / 6 / 4** |
| Security & Abuse | 21 / 1 / 0 | 20 / 2 / 0 | **22 / 0 / 0** |
| **Total** | **43 / 19 / 38** | **54 / 28 / 18** | **61 / 22 / 17** |

*Read as: fully correct / partially correct / wrong or unhelpful.*

The two categories that were stuck at zero — Comprehension and Response Quality — are now producing correct answers, and Response Quality has **no outright failures left at all**.

---

## Security

All **22 adversarial tests pass**: jailbreak attempts, prompt injection, requests to leak configuration, attempts to make it fabricate data or alter scores, and cost-abuse attacks designed to run up a large bill.

One note on how we reached 22 of 22. Our automated grader marked the "what model are you?" probe as a failure in the final run — but the assistant's reply was **identical in all three runs**, and the same answer had been graded correct, then partially correct, then a failure. The reply names no model, no internal instructions and no tools; it says only that answers come from the published GIRAI dataset and reports. The grader was treating the *public* data source as if it were an internal secret. We corrected the grading rule and re-ran that category. We are flagging this openly because adjusting a grader after seeing results deserves scrutiny — the assistant's behaviour did not change, only the grader's misreading of it.

---

## What is still failing, and why

Of the 17 remaining failures, most are **not** the assistant being wrong.

**The data has moved on since the briefs were written (about 8 cases).** The briefs say Peru and El Salvador account for 55% of LATAM's binding frameworks. Peru (13) and El Salvador (8) still match the brief exactly — but Panama and Mexico have since added binding frameworks, so those two countries no longer make up 55%. The assistant reports today's figure and explains the difference. That is the behaviour we want; the test simply expects the older number. The same applies to LATAM's non-binding share (brief 68%, now 54.3%).

**The briefs count regions differently (about 3 cases).** The Asia brief covers 38 countries — it includes the Middle East and excludes Australia and New Zealand. Our dataset's "Asia and Oceania" region is 30 countries. So "Asia's average score" is 31.79 in the brief and 33.0 in our data. Both are correct for their own definition.

**One genuine gap worth fixing (about 3 cases).** Asked for LATAM's strongest dimension against the global benchmark, the assistant answers incorrectly — yet our data reproduces the brief precisely (AI use in public service: LATAM 32.53 against a global 31.36, the only dimension above the global average; Trust & Safety 32.47, the widest shortfall). The figures are right there. The assistant fails because **LATAM spans two regions**, and no current tool compares a region's dimension scores against the global average. This is a contained fix and the clearest remaining win.

---

## A caution on reading these numbers

Individual results move between runs even with no code change — a case can shift between "fully correct" and "partially correct" depending on how the assistant phrases an answer and how strictly the automated grader reads it. Category totals of ±1–2 cases are noise. Every fix described above was confirmed by re-running the specific failing question several times, not by a single pass of the suite.

---

## Recommended next steps

1. **Compare regional dimensions against the global average** — the one clear capability gap left, worth roughly 3 test cases and a common real-world question.
2. **Decide how to handle brief-versus-live figures.** The briefs are a snapshot; the dataset keeps moving. The assistant currently reports live figures, which we believe is right for a data website — but the team should confirm that, and consider noting it where the briefs are published.
3. **Watch the document library.** Its address is written into the code as a fallback. If the OpenAI account is ever rotated, the library silently empties and report-based answers quietly stop working — exactly the failure we found here. A simple start-up check would catch it.

---

## Bottom line

- Fully correct answers up from **43 to 61 out of 100**; failures down from **38 to 17**.
- **All 22 security attacks handled safely.**
- The assistant can now both **calculate the report's statistics** and **read the regional briefs** — neither of which it could do before.
- Most remaining failures reflect the briefs being a fixed snapshot while the dataset keeps moving, not assistant errors.
- The rankings suite still passes **16 of 16**, so nothing regressed.

*All changes are on the `development` (staging) branch and do not affect the live site until promoted.*
