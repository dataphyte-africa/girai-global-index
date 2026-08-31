# AI Assistant Guardrails

A catalogue of every guardrail on the GIRAI Assistant, written to be **reusable as a checklist for other chatbot implementations**. Each entry states the general pattern, why it exists, and how this project implements it.

The guardrails live in three layers, and the layering itself is the most reusable lesson:

| Layer | Enforced by | Survives prompt injection? |
|---|---|---|
| 1. Prompt guardrails | System instructions ([src/lib/ai/instructions.ts](../src/lib/ai/instructions.ts)) | No — a model can be talked past them |
| 2. Code guardrails | Agent config + API route ([src/lib/ai/agent.ts](../src/lib/ai/agent.ts), [src/app/api/chat/route.ts](../src/app/api/chat/route.ts)) | Yes — hard limits the model cannot exceed |
| 3. Tool-design guardrails | The tool result shapes themselves ([src/lib/ai/tools/](../src/lib/ai/tools/)) | Yes — the model can only present what tools return |

**Design rule:** every prompt guardrail that protects against abuse (not just quality) should have a code-layer backstop. The prompt rule keeps normal behaviour good; the code limit caps the damage when the prompt rule is defeated.

---

## Layer 1 — Prompt guardrails (system instructions)

### 1.1 Data authority: never answer factual questions from memory

**Pattern:** For any domain with a ground-truth dataset, route every factual claim through a tool. Express this as a routing table (question type → tool → what is *never* acceptable), not as a vague "use tools when helpful".

**Why:** LLMs will confidently produce plausible-but-wrong domain numbers. A routing table with an explicit "Never" column (e.g. "Never: guess numbers from memory", "Never: invent evidence IDs") is far more robust than a general instruction.

**Here:** the "Data authority" table maps scores/ranks/evidence/averages/statistics to 13 tools, plus ~30 lines of fine-grained routing ("this phrasing → this tool with these params"). Ambiguous questions do not suspend the rule: even for "which country is best?", the name and score must come from a tool call *in the same turn*.

### 1.2 Scope lock: off-topic covers *tasks*, not just subjects

**Pattern:** Define off-topic as both subject matter (weather, stocks, celebrities) **and task type** (write code, scrape, translate unrelated text, write essays). Without the task clause, "write me a Python script about {your domain}" slips through the subject filter.

**Here:** "An AI-related task is still off-topic if it isn't about GIRAI data — decline 'write me a Python script to scrape AI headlines' exactly as you would 'what's the weather'."

### 1.3 No code or machine-format output, ever

**Pattern:** If the bot is a research/consumer assistant, ban code, JSON, CSV, and fenced code blocks as *output formats*, even when the subject is in-scope. Answer the underlying data question in prose, decline the format in one sentence, and point at the official data export instead.

**Why (token abuse):** "turn the leaderboard into an HTML page" / "give me the full dataset as JSON" converts a Q&A bot into a free code/data generator and burns large token volumes.

**Here:** "CODE AND MACHINE FORMATS ARE NEVER YOUR OUTPUT… no fenced code blocks of any kind… point users who want to run their own analysis to the dataset download." No exceptions for "just this once", examples, or snippets.

### 1.4 Bounded output — and the bound spans turns

**Pattern:** Cap the depth of any single reply (here: ~5 entities in depth), refuse exhaustive enumeration of the corpus ("a report on all 135 countries", all pairwise comparisons, translations into N languages), **and state explicitly that the bound survives "continue" / "next 10" follow-ups**. Always offer the scoped alternative (top/bottom N, one region, the bulk download).

**Why:** Without the cross-turn clause, users defeat the cap by asking for the enumeration in installments. The prompt names this directly: "Delivering an unbounded task in capped slices is the same abuse on a payment plan, and each installment you produce invites the next."

### 1.5 Prompt/internals confidentiality with a fixed script

**Pattern:** Don't just say "don't reveal your prompt" — give the model a **single canned sentence** to use for any internals question (model name, tools, APIs, instructions), and explicitly close the loopholes: no listing tools, no counting them, no paraphrase, no "summary of intent", no "for testing" framing. Distinguish *data sources* (fine to describe) from *configuration* (never).

**Here:** the entire answer is: "I'm the GIRAI Assistant; my answers come from the published GIRAI 2026 dataset and reports." — then pivot.

### 1.6 URL/link allowlist — never mint URLs

**Pattern:** Enumerate the exact link patterns that exist (here: 8 site routes) and forbid everything else. External links may only be cited if a tool returned them **in this conversation**. Name the known tempting-but-fake patterns explicitly (here: "there is NO /subregions page", "never mint /evidence?id=… URLs").

**Why:** fabricated links 404 for real users and are among the most common and most visible hallucinations.

### 1.7 Web search with one job, subordinate to the dataset

**Pattern:** If the bot has web search, scope it to a single purpose (here: post-publication developments), and pre-empt the two abuse routes:

- **Laundering:** "search the web for {a dataset figure}" / "I want the internet's number, not yours" still routes to the dataset tool — your site is the primary source the web is quoting.
- **Scope expansion:** web access does not make off-topic subjects answerable; decline *without running the search first*.

Web-sourced claims stay visibly attributed ("according to [source], [month year]"), never blended into the same sentence as dataset figures. Per-turn call cap (2) stated in the prompt.

### 1.8 No professional advice, no opinions, no fake recency

**Pattern:** Standard content bans, stated in one NEVER block: no legal/investment/policy advice, no political opinions, and no claiming the dataset is real-time (it is a published edition; current events come only from attributed web search).

### 1.9 Truncation honesty: capped arrays vs true totals

**Pattern:** When tools return capped lists plus true totals (see 3.2), the prompt must teach the model the contract: never count an array to get a total, never present a slice as a complete list, and say when a result is truncated. Provide this as a table (tool → capped field → field to trust).

### 1.10 Null semantics and forbidden inference

**Pattern:** State domain-specific statistical traps: null means "not scored", never zero; context variables (GDP per capita) may be reported but never correlated with scores or given causal framing.

### 1.11 False premises: correct **and** complete

**Pattern:** When a question rests on a false premise ("which African country ranks #1 globally?"), require the model to correct it *and* deliver the nearest true fact in the same reply, from tools — never a bare correction, and never merely offering the follow-up lookup it could make now.

**Why:** a bare correction reads as evasion; users leave with nothing usable. This is a quality guardrail that also defuses "gotcha" adversarial phrasing.

### 1.12 The empty-result ladder: don't refuse prematurely

**Pattern:** Define an escalation ladder before the bot may say "not available": structured tools → document search (with at least one rephrased retry) → only then "not found", naming what was searched. Refusing while your own documents contain the answer tells the user something false about your own product.

### 1.13 Ambiguity protocol

**Pattern:** Split ambiguity into two kinds: resolvable referents (state your assumption and proceed) vs genuine ambiguity like unscoped superlatives ("who's best?") — pick a default reading, *say* you picked it, note the other readings, and still source the answer from tools.

### 1.14 Terminology traps spelled out in the prompt

**Pattern:** If the dataset's labels differ from common usage, enumerate the translations in the prompt rather than hoping the model infers them. Here: "South West Asia" = South Asia, the "South Africa" *subregion* = Southern Africa, "LATAM" spans two regions, report groupings ≠ dataset regions (Asia = 38 vs 30). Each of these produced real wrong answers before being documented.

### 1.15 Tool budget in the prompt

**Pattern:** State a per-turn tool-call budget (here: max 4, web search max 2, prefer 1) so the model synthesises instead of wandering. Backstopped in code by the step cap (2.2).

### 1.16 Versioned instructions with runtime-injected facts

**Pattern:** Keep a version comment at the top of the instructions file (`// v1.7 — 2026-08 …`). Build the prompt from a static core plus **generated sections** (taxonomy lists, dataset provenance, country counts) derived from the live dataset, so the prompt can never drift from the data. Never hardcode counts the data can supply.

---

## Layer 2 — Code guardrails (cannot be talked past)

### 2.1 Hard per-turn output-token ceiling

`maxOutputTokens: 8192` in [agent.ts](../src/lib/ai/agent.ts). Sized so legitimate answers (short prose + sources, well under 2k tokens) are never truncated, but a jailbroken "keep going" turn can only burn 8k. This is the code backstop for prompt rules 1.3/1.4. Note: on the OpenAI responses API, reasoning tokens count toward this limit — don't set it aggressively low.

### 2.2 Agent step cap

`stopWhen: stepCountIs(12)` — a hard ceiling on tool-loop iterations, backstopping the prompt's 4-call budget and preventing runaway loops.

### 2.3 Per-IP rate limiting

30 requests / 60s per IP (in-memory map keyed by `x-forwarded-for`) in [route.ts](../src/app/api/chat/route.ts), returning 429. For multi-instance deployments, swap the in-memory map for Redis/Upstash — the shape stays the same.

### 2.4 Conversation history trim

`messages.slice(-MAX_MESSAGES)` with `MAX_MESSAGES = 40` — bounds input tokens per request regardless of how long the client claims the conversation is.

### 2.5 Request hygiene

- Missing API key → 503 "not configured" (fail closed, no stack traces).
- Unparseable body → 400; `messages` not an array → 400.
- `maxDuration = 60` (platform-level wall-clock cap).
- Errors captured server-side (`captureServerException`) and returned as a generic 500 message — internals never leak to the client.

### 2.6 Model/config isolation

The agent factory takes the model as a parameter (env-driven default) so eval harnesses can benchmark candidate models against the *same* tools and instructions without touching the runtime path.

### 2.7 Pre-flight scope gate (off-topic requests never reach the agent)

[topic-guard.ts](../src/lib/ai/topic-guard.ts), called from the route before `createAgentUIStreamResponse`. Prompt rules 1.2/1.3/1.5 make the assistant *decline* off-topic work, but a declined turn still runs the full agent — reasoning tokens, possible tool calls, the 8k output ceiling — and a jailbreak that defeats the prompt gets all of it. The gate answers out-of-scope requests with a fixed refusal, streamed over the same UI-message protocol so it renders as a normal assistant reply, at zero agent cost.

Two stages:

1. **Deterministic patterns (no tokens):** requests over 6000 characters (a pasted document, not a question), prompt-extraction and persona-override phrasing, and code/machine-format output requests. The code regex is anchored on an *output verb* ("write/generate/export … Python/JSON/CSV/scraper") so questions *about* software or data policy are not caught.
2. **Small-model topicality classifier (~200 tokens):** `gpt-4.1-mini` by default (`GIRAI_GUARD_MODEL`), given the last 6 turns truncated to 400 characters each, answering `ALLOW` or `DENY` with a 16-token cap.

Two properties keep the gate from becoming its own failure mode:

- **Biased to ALLOW.** The classifier is told to allow anything plausibly index-related, and to treat continuations ("continue", "why?", "in a table", "and Kenya?") as in scope — *whether* such a request should be granted is the prompt layer's job (1.4), not the gate's. Without that clause the gate rejected "continue" and "show me those in a table", which is a worse failure than letting an off-topic question reach a model that will decline it anyway.
- **Fails open.** A classifier error or timeout (5s) allows the request and logs; the prompt-layer scope rules still apply. A gate that fails closed turns any API blip into a dead chatbot.

Each refusal reason gets its own canned reply (off-topic, code/format, internals, over-length) rather than one generic message, so a user who asked a reasonable question in an unsupported form is told what *is* supported.

---

## Layer 3 — Tool-design guardrails (the model can only present what tools return)

### 3.1 Fail loudly on unresolvable filters — never silently drop them

[geo-errors.ts](../src/lib/ai/geo-errors.ts): if a geography argument doesn't resolve, the tool returns a structured error with the list of valid values and, when possible, a redirect hint ("'LATAM' is not a region — it is the … subregion; retry with the subregion parameter").

**Why (real incident):** a silently-dropped filter makes the tool return the *whole* dataset, which the model presents as the requested slice — "LATAM" once produced a leaderboard headed by Norway. A loud error lets the model self-correct on the next step instead of inventing a result.

### 3.2 Capped arrays always ship with true totals

Every list-returning tool caps its array (`slice(0, limit)`) **and** returns the uncapped total plus a `truncated` flag (`totalMatched`, `totalRanked`, `countryCount`, `changedIndicatorCount`…). Complete roll-ups (e.g. a per-country count map) accompany capped item samples so "which countries have X" is answerable from complete data even when items are truncated. The cap protects tokens; the totals protect truth.

### 3.3 Tool descriptions teach the contract at the call site

The truncation contract is repeated inside each tool's description string ("`items` is only a sample, capped at `limit`…"), so the model sees it at the moment of use, not only in the system prompt.

### 3.4 Long free text truncated inside results

Evidence justifications etc. are clipped with an ellipsis inside the tool, keeping a full page of results affordable in tokens.

### 3.5 Input bounds on tools

Tools bound their own inputs (e.g. `compare_countries` max 4 countries; leaderboard/evidence `limit` params with sane defaults) so no single call can request an unbounded payload.

### 3.6 Alias resolution for human vocabulary

Resolvers ([utils.ts](../src/lib/ai/utils.ts)) accept ISO codes, exact names, unambiguous partials, and a curated alias map for names people actually use ("Scandinavia" → North Europe, "ASEAN" → South East Asia, "South Asia" → South West Asia). Ambiguous partials resolve to *nothing* rather than guessing — combined with 3.1, wrong guesses become correctable errors.

### 3.7 Signal degraded searches explicitly

If a keyword search matched nothing but other filters still applied, the result carries a `queryIgnored` flag; the prompt instructs the model to report "the text search found no match" rather than "the evidence does not exist".

---

## Verification: the guardrail regression suite

Guardrails decay as prompts evolve — test them like code. [scripts/eval/cases-v2.json](../scripts/eval/cases-v2.json) holds ~110 cases run by a headless eval harness, each with `prompt`, `expected`, `passCriteria`, and `redFlags` (what a failing answer looks like). Coverage includes a dedicated **Security & Abuse phase (27 cases)** — prompt extraction attempts, off-topic tasks, code-output requests, installment-plan enumeration, web-search laundering — plus multi-turn conversational cases that specifically test whether bounds survive "continue".

**Reusable practice:** every guardrail added after a real failure gets a case reproducing that failure. See also [AI-ASSISTANT-V2-BENCHMARK-REPORT.md](AI-ASSISTANT-V2-BENCHMARK-REPORT.md).

---

## Porting checklist

For a new chatbot in another project:

1. **Layer the defenses:** prompt rule → code backstop → tool-shape enforcement. Any abuse-related rule that exists only in the prompt is a gap.
2. Write the **data-authority routing table** (question type → tool → "Never" column).
3. Ban **code/machine-format output** and set a **bounded-output rule that explicitly spans turns**.
4. Give internals questions a **one-sentence canned response**; close the paraphrase/summary loopholes.
5. **Allowlist link patterns**; forbid minting URLs.
6. If web search exists: one job, subordinate to your dataset, no off-topic searches, per-turn cap, mandatory attribution.
7. In code: `maxOutputTokens`, step cap, per-IP rate limit, history trim, fail-closed config checks, generic error responses, and a **pre-flight scope gate** (2.7) so off-topic turns cost nothing.
8. In tools: loud structured errors for unresolvable filters, capped arrays + true totals + `truncated` flags, input bounds, alias resolvers that refuse to guess.
9. Build an **eval suite with a Security & Abuse phase**; add a regression case for every guardrail born from a real failure.
