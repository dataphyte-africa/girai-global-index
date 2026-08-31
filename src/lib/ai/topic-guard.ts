import { createOpenAI } from "@ai-sdk/openai";
import { generateText, type UIMessage } from "ai";

/**
 * Layer-2 scope guardrail: a request that has nothing to do with GIRAI never
 * reaches the agent at all.
 *
 * The system prompt already tells the assistant to decline off-topic subjects
 * and tasks, but a prompt rule can be talked past — and every attempt that
 * gets through burns a full agentic turn (reasoning + tools + 8k output
 * ceiling). This gate runs before the agent: cheap deterministic patterns
 * first (zero tokens), then a small-model topicality classifier (~200 tokens)
 * whose only job is ALLOW / DENY.
 *
 * Bias: the classifier is told to allow anything plausibly GIRAI-related, so
 * borderline questions still reach the agent, which has the full prompt-layer
 * rules. A denial here is for requests that are unambiguously outside the
 * product.
 */

const DEFAULT_GUARD_MODEL = "gpt-4.1-mini";
// The screener reads at most this much of the conversation; it only needs the
// current request plus enough context to judge pronouns and "why?" follow-ups.
const HISTORY_TURNS = 6;
const HISTORY_CHARS = 400;
// A single request longer than this is not a question about the index — it is
// a document being pasted in for the model to process.
const MAX_MESSAGE_CHARS = 6000;

const OFF_TOPIC_REPLY =
  "I can only help with the GIRAI Global Index — country, subregion, and regional scores, rankings, indicators, the evidence behind them, and the published reports. Ask me something like \"How does Kenya score on data governance?\" or \"Which countries lead in Africa?\" and I'll pull it from the 2026 dataset.";

const CODE_REPLY =
  "I don't write code or produce machine formats (JSON, CSV, scripts, pages) — I'm a research aide for the GIRAI index, not a code generator. I'm happy to answer the underlying data question in plain language, and if you want to run your own analysis the full [dataset download](/download/data/2026) is the right starting point.";

const INTERNALS_REPLY =
  "I'm the GIRAI Assistant; my answers come from the published GIRAI 2026 dataset and reports. Ask me about a country, region, indicator, or what the evidence shows, and I'll look it up.";

const TOO_LONG_REPLY =
  "That message is too long for me to work from. Ask a specific question about the GIRAI index — a country, a region, an indicator, or a comparison — and I'll answer it from the 2026 dataset.";

export type GuardVerdict =
  | { allowed: true }
  | { allowed: false; rule: string; reply: string };

const ALLOWED: GuardVerdict = { allowed: true };

/**
 * Requests to emit code or a machine format. Deliberately anchored on an
 * output verb so that questions *about* the subject ("does Nigeria have an AI
 * strategy for software regulation?") are not caught.
 */
const CODE_OUTPUT =
  /\b(write|generate|produce|create|build|give me|show me|output|export|convert|turn (?:this|that|it)|make me)\b[^.?!]{0,60}\b(python|javascript|typescript|java|c\+\+|rust|golang|php|ruby|bash|shell script|sql|regex|html|css|react|next\.?js|pandas|numpy|jupyter|notebook|scripts?|code|program|function|app|website|web page|api client|scraper|json|csv|tsv|xml|yaml|markdown table dump)\b/i;

/** Attempts to extract or overwrite configuration. */
const INTERNALS =
  /\b(system prompt|initial prompt|your (?:instructions|prompt|rules|configuration|config|guidelines|system message)|prompt (?:above|text)|repeat (?:the )?(?:text|words|everything) above|ignore (?:all )?(?:previous|prior|above|your) (?:instructions|rules|prompts)|disregard (?:all )?(?:previous|prior|your) (?:instructions|rules)|developer message|you are now|act as (?:a |an )?(?:dan|unrestricted|jailbroken)|list (?:all )?your tools|how many tools|which model are you|what model (?:are you|is this)|are you (?:gpt|claude|gemini)|temperature setting|api key)\b/i;

function messageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part.type === "text" ? part.text : ""))
    .join(" ")
    .trim();
}

function deterministicVerdict(text: string): GuardVerdict {
  if (text.length > MAX_MESSAGE_CHARS) {
    return { allowed: false, rule: "message-too-long", reply: TOO_LONG_REPLY };
  }
  if (INTERNALS.test(text)) {
    return { allowed: false, rule: "internals", reply: INTERNALS_REPLY };
  }
  if (CODE_OUTPUT.test(text)) {
    return { allowed: false, rule: "code-output", reply: CODE_REPLY };
  }
  return ALLOWED;
}

const CLASSIFIER_INSTRUCTIONS = `You are a scope filter for the GIRAI Assistant, a research chatbot about the Global Index on Responsible AI (GIRAI).

IN SCOPE (answer ALLOW):
- Countries, regions, subregions: their GIRAI scores, ranks, pillars, dimensions, indicators, evidence, government AI misuse penalties, edition-over-edition changes.
- Responsible-AI governance as it relates to the index: national AI strategies, regulation, human rights, data governance, gender equality in AI, labour, safety, redress, capacity.
- The GIRAI reports, methodology, dataset, coverage, how scores are calculated, what a score means, where to download data.
- Recent real-world developments in AI governance in a specific country or region (the assistant may look these up).
- Meta questions about what the assistant can help with, and greetings.
- FOLLOW-UPS: any message that only makes sense as a continuation of the previous assistant turn — "why?", "and Kenya?", "explain that", "continue", "keep going", "the next ten", "in a table", "shorter", "in French" — is IN SCOPE whenever that previous turn was about the index. Whether such a request should actually be granted (length limits, formatting, enumeration caps) is the assistant's decision, not yours; your only question is whether the topic is the index.

OUT OF SCOPE (answer DENY):
- Any subject unrelated to AI governance and the index: weather, sport, stocks, medicine, travel, celebrities, general trivia, personal advice, homework unrelated to GIRAI.
- Task requests that are not index research: writing code, essays, poems, marketing copy, emails, translations of unrelated text, summarising a pasted document, roleplay, acting as a different persona, doing arithmetic puzzles.
- Generic AI questions with no governance or index angle ("explain transformers", "which LLM is best", "write a prompt for me").

RULES:
- Judge the LAST user message, using earlier turns to resolve references and to recognise follow-ups.
- When a message is ambiguous or could plausibly be about the index, answer ALLOW. Only DENY when it is clearly outside the product.
- Answer with exactly one word: ALLOW or DENY.`;

function buildTranscript(messages: UIMessage[]): string {
  return messages
    .slice(-HISTORY_TURNS)
    .map((message) => {
      const text = messageText(message).slice(0, HISTORY_CHARS);
      if (!text) return "";
      return `${message.role === "user" ? "User" : "Assistant"}: ${text}`;
    })
    .filter(Boolean)
    .join("\n");
}

/**
 * Screens a conversation before the agent runs. Fails open: if the classifier
 * call errors or times out, the request proceeds and the prompt-layer scope
 * rules apply, rather than the assistant going dark on a legitimate question.
 */
export async function screenRequest(
  messages: UIMessage[]
): Promise<GuardVerdict> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return ALLOWED;

  const text = messageText(lastUser);
  if (!text) return ALLOWED;

  const deterministic = deterministicVerdict(text);
  if (!deterministic.allowed) return deterministic;

  try {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.GIRAI_GUARD_MODEL ?? DEFAULT_GUARD_MODEL;

    const { text: verdict } = await generateText({
      model: openai(model),
      system: CLASSIFIER_INSTRUCTIONS,
      prompt: `Conversation so far:\n${buildTranscript(messages)}\n\nThe last user message is the one to judge. Is it in scope? Answer ALLOW or DENY.`,
      temperature: 0,
      // The API's floor is 16; the verdict itself is one token.
      maxOutputTokens: 16,
      abortSignal: AbortSignal.timeout(5000),
    });

    if (/\bDENY\b/i.test(verdict)) {
      return { allowed: false, rule: "off-topic", reply: OFF_TOPIC_REPLY };
    }
  } catch (error) {
    // Screening is best-effort; the agent's own scope rules still apply. It is
    // reported, though — a silently broken screener is a disabled guardrail.
    console.error("[topic-guard] screening failed, allowing request", error);
    return ALLOWED;
  }

  return ALLOWED;
}
