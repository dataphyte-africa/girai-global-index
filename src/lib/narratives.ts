/**
 * Narrative generation utilities for GIRAI country stories.
 * Generates dynamic text based on score ranges for index and indicators.
 */

export type ScoreTier = "leader" | "advanced" | "developing" | "emerging" | "nascent";

export interface NarrativeResult {
  tier: ScoreTier;
  label: string;
  narrative: string;
  color: string;
}

// Score tier thresholds
function getScoreTier(score: number): ScoreTier {
  if (score >= 80) return "leader";
  if (score >= 60) return "advanced";
  if (score >= 40) return "developing";
  if (score >= 20) return "emerging";
  return "nascent";
}

// Tier colors for visual consistency
const tierColors: Record<ScoreTier, string> = {
  leader: "#10b981",    // emerald-500
  advanced: "#3b82f6",  // blue-500
  developing: "#f59e0b", // amber-500
  emerging: "#f97316",  // orange-500
  nascent: "#ef4444",   // red-500
};

const tierLabels: Record<ScoreTier, string> = {
  leader: "Global Leader",
  advanced: "Advanced",
  developing: "Developing",
  emerging: "Emerging",
  nascent: "Nascent",
};

// ============================================================
// INDEX SCORE NARRATIVES
// ============================================================

const indexNarratives: Record<ScoreTier, (country: string) => string> = {
  leader: (country) =>
    `${country} stands as a global leader in responsible AI governance, demonstrating exceptional commitment across all dimensions of the GIRAI Index. With robust government frameworks, proactive policy actions, and strong engagement from non-state actors, ${country} sets the benchmark for AI governance excellence worldwide.`,
  advanced: (country) =>
    `${country} demonstrates advanced capabilities in AI governance, with well-established frameworks and meaningful progress across multiple dimensions. The country shows strong foundations that position it among the top performers globally, with opportunities to further strengthen specific areas.`,
  developing: (country) =>
    `${country} is making significant progress in establishing AI governance frameworks and building institutional capacity. While foundational elements are in place, continued investment in policy implementation and stakeholder engagement will help accelerate the country's trajectory toward AI governance maturity.`,
  emerging: (country) =>
    `${country} is in the early stages of developing AI governance frameworks and building necessary institutional capacity. The country has begun to recognize the importance of responsible AI governance, with initial steps taken that provide a foundation for future development.`,
  nascent: (country) =>
    `${country} has significant opportunities to develop AI governance capabilities and frameworks. While current indicators show limited formal governance structures, this represents an opportunity for the country to learn from global best practices and leapfrog in its approach to responsible AI governance.`,
};

export function getIndexNarrative(country: string, score: number): NarrativeResult {
  const tier = getScoreTier(score);
  return {
    tier,
    label: tierLabels[tier],
    narrative: indexNarratives[tier](country),
    color: tierColors[tier],
  };
}

// ============================================================
// PILLAR SCORE NARRATIVES
// ============================================================

// Government Frameworks
const govFrameworksNarratives: Record<ScoreTier, (country: string, score: number) => string> = {
  leader: (country, score) =>
    `With a score of ${score.toFixed(1)}, ${country} has established comprehensive legal and regulatory frameworks for AI governance. The country demonstrates excellence in codifying AI principles into law, creating clear accountability structures, and establishing robust oversight mechanisms.`,
  advanced: (country, score) =>
    `Scoring ${score.toFixed(1)} in Government Frameworks, ${country} has developed strong regulatory foundations for AI governance. Key legislation and policies are in place, providing clear guidance for AI development and deployment across sectors.`,
  developing: (country, score) =>
    `${country}'s Government Frameworks score of ${score.toFixed(1)} reflects ongoing efforts to establish formal AI governance structures. While progress has been made in policy development, there remain opportunities to strengthen legal frameworks and accountability mechanisms.`,
  emerging: (country, score) =>
    `With a score of ${score.toFixed(1)}, ${country} is beginning to develop formal AI governance frameworks. Initial policy discussions and preliminary regulatory approaches indicate growing awareness of the need for structured AI governance.`,
  nascent: (country, score) =>
    `${country}'s Government Frameworks score of ${score.toFixed(1)} indicates significant opportunity for development. Establishing foundational legal and regulatory structures for AI governance could help the country better manage AI risks and opportunities.`,
};

// Government Actions
const govActionsNarratives: Record<ScoreTier, (country: string, score: number) => string> = {
  leader: (country, score) =>
    `${country} achieves an exceptional ${score.toFixed(1)} in Government Actions, demonstrating proactive implementation of AI governance policies. The government actively invests in AI capacity building, enforces regulations effectively, and leads by example in responsible AI adoption within public services.`,
  advanced: (country, score) =>
    `With a Government Actions score of ${score.toFixed(1)}, ${country} shows strong implementation of AI governance measures. Government initiatives actively promote responsible AI development, with visible progress in public sector AI adoption and oversight.`,
  developing: (country, score) =>
    `${country}'s score of ${score.toFixed(1)} in Government Actions reflects meaningful steps toward implementing AI governance policies. While implementation is underway, scaling these efforts and ensuring consistent enforcement across agencies remains an opportunity.`,
  emerging: (country, score) =>
    `Scoring ${score.toFixed(1)} in Government Actions, ${country} is beginning to translate AI governance policies into practice. Initial implementation efforts are visible, though comprehensive government-wide action is still developing.`,
  nascent: (country, score) =>
    `${country}'s Government Actions score of ${score.toFixed(1)} suggests limited active implementation of AI governance measures. Strengthening government capacity and commitment to AI governance implementation could accelerate progress.`,
};

// Non-State Actors
const nonStateActorsNarratives: Record<ScoreTier, (country: string, score: number) => string> = {
  leader: (country, score) =>
    `${country} excels with a ${score.toFixed(1)} score in Non-State Actors engagement, reflecting vibrant participation from civil society, academia, and the private sector in AI governance. Strong multi-stakeholder collaboration drives innovation while ensuring accountability.`,
  advanced: (country, score) =>
    `With ${score.toFixed(1)} in Non-State Actors, ${country} benefits from active engagement of diverse stakeholders in AI governance. Academic institutions, civil society organizations, and businesses contribute meaningfully to shaping responsible AI practices.`,
  developing: (country, score) =>
    `${country}'s Non-State Actors score of ${score.toFixed(1)} indicates growing engagement from civil society, academia, and industry. Expanding these partnerships and creating more structured channels for stakeholder input could strengthen AI governance outcomes.`,
  emerging: (country, score) =>
    `Scoring ${score.toFixed(1)} in Non-State Actors, ${country} shows early signs of stakeholder engagement in AI governance discussions. Building stronger bridges between government and non-state actors could enhance AI governance effectiveness.`,
  nascent: (country, score) =>
    `${country}'s score of ${score.toFixed(1)} in Non-State Actors highlights an opportunity to strengthen engagement with civil society, academia, and the private sector. Multi-stakeholder approaches are essential for effective AI governance.`,
};

// ============================================================
// DIMENSION SCORE NARRATIVES
// ============================================================

// Human Rights and AI
const humanRightsAINarratives: Record<ScoreTier, (country: string, score: number) => string> = {
  leader: (country, score) =>
    `${country} leads with ${score.toFixed(1)} in Human Rights and AI, demonstrating exceptional commitment to protecting fundamental rights in the context of AI development. Strong safeguards against discrimination, robust privacy protections, and meaningful transparency measures set the standard for rights-respecting AI governance.`,
  advanced: (country, score) =>
    `With a score of ${score.toFixed(1)} in Human Rights and AI, ${country} has established strong protections for fundamental rights in AI applications. Privacy frameworks, anti-discrimination measures, and transparency requirements reflect a serious commitment to human-centered AI.`,
  developing: (country, score) =>
    `${country}'s Human Rights and AI score of ${score.toFixed(1)} shows meaningful progress in addressing human rights considerations in AI governance. Continued focus on strengthening protections against algorithmic bias and enhancing transparency could further improve outcomes.`,
  emerging: (country, score) =>
    `Scoring ${score.toFixed(1)} in Human Rights and AI, ${country} is beginning to address the intersection of AI and fundamental rights. Building awareness and developing specific protections for AI-related human rights impacts represents an important opportunity.`,
  nascent: (country, score) =>
    `${country}'s score of ${score.toFixed(1)} in Human Rights and AI indicates significant room for development in protecting fundamental rights in AI contexts. Establishing baseline protections for privacy, non-discrimination, and transparency in AI systems is essential.`,
};

// Responsible AI Governance
const responsibleAIGovNarratives: Record<ScoreTier, (country: string, score: number) => string> = {
  leader: (country, score) =>
    `${country} achieves ${score.toFixed(1)} in Responsible AI Governance, exemplifying best practices in ethical AI oversight. Comprehensive accountability mechanisms, risk assessment frameworks, and adaptive governance approaches position the country at the forefront of responsible AI leadership.`,
  advanced: (country, score) =>
    `With ${score.toFixed(1)} in Responsible AI Governance, ${country} demonstrates strong commitment to ethical AI development and deployment. Well-defined accountability structures and risk management approaches support responsible innovation.`,
  developing: (country, score) =>
    `${country}'s Responsible AI Governance score of ${score.toFixed(1)} reflects ongoing efforts to establish accountability and oversight mechanisms for AI systems. Strengthening risk assessment practices and expanding governance frameworks could accelerate progress.`,
  emerging: (country, score) =>
    `Scoring ${score.toFixed(1)} in Responsible AI Governance, ${country} is developing initial approaches to AI accountability and oversight. Building institutional capacity for AI governance and establishing clear accountability mechanisms are key priorities.`,
  nascent: (country, score) =>
    `${country}'s score of ${score.toFixed(1)} in Responsible AI Governance highlights opportunities to establish foundational governance mechanisms. Developing risk assessment frameworks and accountability structures for AI systems would strengthen overall governance.`,
};

// Responsible AI Capacities
const responsibleAICapNarratives: Record<ScoreTier, (country: string, score: number) => string> = {
  leader: (country, score) =>
    `${country} leads with ${score.toFixed(1)} in Responsible AI Capacities, demonstrating exceptional human and institutional capacity for AI governance. Strong technical expertise, well-resourced institutions, and robust training programs ensure effective implementation of AI governance measures.`,
  advanced: (country, score) =>
    `With ${score.toFixed(1)} in Responsible AI Capacities, ${country} has built substantial capacity for AI governance. Skilled workforce development, research capabilities, and institutional resources support effective governance implementation.`,
  developing: (country, score) =>
    `${country}'s Responsible AI Capacities score of ${score.toFixed(1)} reflects growing investment in building AI governance expertise. Continued focus on workforce development, research infrastructure, and institutional capacity building will strengthen governance effectiveness.`,
  emerging: (country, score) =>
    `Scoring ${score.toFixed(1)} in Responsible AI Capacities, ${country} is beginning to build the human and institutional foundations for AI governance. Investing in education, training, and research capabilities represents an important priority.`,
  nascent: (country, score) =>
    `${country}'s score of ${score.toFixed(1)} in Responsible AI Capacities indicates significant opportunity to build AI governance expertise. Developing technical skills, institutional knowledge, and research capabilities is essential for effective AI governance.`,
};

// ============================================================
// UNIFIED INDICATOR NARRATIVE FUNCTION
// ============================================================

export type IndicatorType =
  | "governmentFrameworks"
  | "governmentActions"
  | "nonStateActors"
  | "humanRightsAI"
  | "responsibleAIGovernance"
  | "responsibleAICapacities";

const indicatorNarrativeFunctions: Record<
  IndicatorType,
  Record<ScoreTier, (country: string, score: number) => string>
> = {
  governmentFrameworks: govFrameworksNarratives,
  governmentActions: govActionsNarratives,
  nonStateActors: nonStateActorsNarratives,
  humanRightsAI: humanRightsAINarratives,
  responsibleAIGovernance: responsibleAIGovNarratives,
  responsibleAICapacities: responsibleAICapNarratives,
};

export const indicatorLabels: Record<IndicatorType, string> = {
  governmentFrameworks: "Government Frameworks",
  governmentActions: "Government Actions",
  nonStateActors: "Non-State Actors",
  humanRightsAI: "Human Rights and AI",
  responsibleAIGovernance: "Responsible AI Governance",
  responsibleAICapacities: "Responsible AI Capacities",
};

export const indicatorColors: Record<IndicatorType, string> = {
  governmentFrameworks: "#6366f1", // indigo
  governmentActions: "#8b5cf6",    // violet
  nonStateActors: "#a855f7",       // purple
  humanRightsAI: "#ec4899",        // pink
  responsibleAIGovernance: "#f97316", // orange
  responsibleAICapacities: "#10b981", // emerald
};

export const indicatorGradients: Record<IndicatorType, string> = {
  governmentFrameworks: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
  governmentActions: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
  nonStateActors: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
  humanRightsAI: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
  responsibleAIGovernance: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
  responsibleAICapacities: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
};

export function getIndicatorNarrative(
  indicator: IndicatorType,
  country: string,
  score: number
): NarrativeResult {
  const tier = getScoreTier(score);
  const narrativeFn = indicatorNarrativeFunctions[indicator][tier];
  return {
    tier,
    label: tierLabels[tier],
    narrative: narrativeFn(country, score),
    color: indicatorColors[indicator],
  };
}

// ============================================================
// HELPER: Get ordinal suffix for ranking
// ============================================================

export function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ============================================================
// COMPARISON NARRATIVES
// ============================================================

export function getRegionalComparisonNarrative(
  country: string,
  region: string,
  regionalRank: number,
  totalInRegion: number
): string {
  const position = regionalRank / totalInRegion;
  
  if (position <= 0.25) {
    return `${country} ranks ${getOrdinalSuffix(regionalRank)} out of ${totalInRegion} countries in ${region}, placing it among the top performers in the region.`;
  } else if (position <= 0.5) {
    return `${country} ranks ${getOrdinalSuffix(regionalRank)} out of ${totalInRegion} countries in ${region}, performing above the regional median.`;
  } else if (position <= 0.75) {
    return `${country} ranks ${getOrdinalSuffix(regionalRank)} out of ${totalInRegion} countries in ${region}, with opportunities to learn from regional leaders.`;
  } else {
    return `${country} ranks ${getOrdinalSuffix(regionalRank)} out of ${totalInRegion} countries in ${region}, representing significant potential for improvement through regional collaboration.`;
  }
}
