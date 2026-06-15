import type { CountryFactBundle, CountryNarratives } from "../../src/lib/country-narratives/types";
import { allowedProperNouns } from "../../src/lib/country-narratives/facts";
import { DIMENSIONS, PILLARS } from "../../src/data/2026/taxonomy";

const OPENAI_MODEL = "gpt-4o-mini";

const SYSTEM_PROMPT = `You write factual editorial copy for the GIRAI Global Index country pages.
Rules:
- Use ONLY facts from the provided JSON fact bundle.
- UK English. No invented laws, programmes, or statistics.
- Rank-based framing only (cite ranks and scores). Never use tier labels like "Advanced", "Developing", or "Global Leader".
- Hero: 2–3 sentences, max 90 words. Mention URAI penalty when uraiCount > 0.
- Each dimension: 2 sentences, max 70 words.
- Each pillar: 1–2 sentences synthesising checklist bullets and contribution %, max 65 words.
- For evidence: quote short unique titles exactly when listed in allowedTitles; use generic phrasing for long or repetitive titles.
- Return valid JSON only, no markdown fences.`;

export interface LlmCountryNarratives extends CountryNarratives {}

export async function generateCountryNarrativesWithLlm(
  bundle: CountryFactBundle,
  apiKey: string
): Promise<LlmCountryNarratives> {
  const allowed = allowedProperNouns(bundle);
  const userPayload = {
    countryName: bundle.countryName,
    iso3: bundle.iso3,
    allowedTitles: allowed,
    facts: {
      hero: bundle.hero,
      dimensions: bundle.dimensions,
      pillars: bundle.pillars,
    },
    outputShape: {
      hero: "string",
      dimensions: Object.fromEntries(DIMENSIONS.map((d) => [d.slug, "string"])),
      pillars: Object.fromEntries(PILLARS.map((p) => [p.slug, "string"])),
    },
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.25,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: JSON.stringify(userPayload),
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${body.slice(0, 500)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned empty content");

  const parsed = JSON.parse(content) as LlmCountryNarratives;
  return parsed;
}

const TIER_WORDS = /\b(global leader|advanced|developing|emerging|nascent)\b/i;

export function validateLlmNarratives(
  bundle: CountryFactBundle,
  narratives: LlmCountryNarratives
): string[] {
  const errors: string[] = [];
  const allowed = new Set(allowedProperNouns(bundle).map((s) => s.toLowerCase()));

  const checkText = (label: string, text: string, maxWords: number) => {
    if (!text?.trim()) {
      errors.push(`${label}: empty`);
      return;
    }
    const words = text.trim().split(/\s+/).length;
    if (words > maxWords) errors.push(`${label}: ${words} words (max ${maxWords})`);
    if (TIER_WORDS.test(text)) errors.push(`${label}: contains tier label`);
    if (!text.includes(bundle.countryName) && label === "hero") {
      errors.push("hero: missing country name");
    }
    if (bundle.hero.girai !== null) {
      const scoreStr = bundle.hero.girai.toFixed(1);
      if (!text.includes(scoreStr) && !text.includes(bundle.hero.girai.toFixed(2))) {
        if (label === "hero") errors.push(`hero: missing score ${scoreStr}`);
      }
    }
    // Quoted strings must be from allowed titles
    const quotes = [...text.matchAll(/"([^"]+)"/g)].map((m) => m[1]!);
    for (const q of quotes) {
      if (q.length > 80) continue;
      const allowedMatch = [...allowed].some(
        (a) => a.toLowerCase() === q.toLowerCase() || q.toLowerCase().includes(a.toLowerCase())
      );
      if (!allowedMatch) {
        errors.push(`${label}: unknown quoted title "${q.slice(0, 48)}${q.length > 48 ? "…" : ""}"`);
      }
    }
  };

  checkText("hero", narratives.hero, 95);
  for (const d of DIMENSIONS) {
    checkText(`dimension:${d.slug}`, narratives.dimensions[d.slug], 75);
  }
  for (const p of PILLARS) {
    checkText(`pillar:${p.slug}`, narratives.pillars[p.slug], 70);
  }

  return errors;
}

export function getOpenAiModel(): string {
  return OPENAI_MODEL;
}
