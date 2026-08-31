import {
  createAgentUIStreamResponse,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { giraiAgent } from "@/lib/ai/agent";
import { screenRequest } from "@/lib/ai/topic-guard";
import { captureServerException } from "@/lib/analytics/server";

export const maxDuration = 60;

const MAX_MESSAGES = 40;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "AI assistant is not configured." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { messages?: UIMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages = body.messages;
  if (!Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: "messages must be an array." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const trimmed = messages.slice(-MAX_MESSAGES);

  // Hard scope gate: an out-of-scope request is answered with a fixed refusal
  // and never reaches the agent, so it cannot spend tool calls or output
  // tokens. The prompt-layer scope rules remain as the second line of defence
  // for anything the gate lets through.
  const verdict = await screenRequest(trimmed);
  if (!verdict.allowed) {
    return refusalResponse(verdict.reply);
  }

  try {
    return createAgentUIStreamResponse({
      agent: giraiAgent,
      uiMessages: trimmed,
      sendSources: true,
    });
  } catch (error) {
    await captureServerException(error, undefined, { route: "/api/chat" });
    return new Response(
      JSON.stringify({ error: "The AI assistant failed to respond." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * Streams a canned refusal back over the same UI message protocol the client
 * already speaks, so it renders as a normal assistant reply rather than as a
 * failed request.
 */
function refusalResponse(text: string): Response {
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const id = "refusal";
      writer.write({ type: "start" });
      writer.write({ type: "text-start", id });
      writer.write({ type: "text-delta", id, delta: text });
      writer.write({ type: "text-end", id });
      writer.write({ type: "finish" });
    },
  });

  return createUIMessageStreamResponse({ stream });
}
