import type { HeatColumn, HeatRow, Takeaway } from "./types";

/**
 * The 10 GIRAI takeaways with expanded Key Evidence (from the 2026 Flagship
 * Report, Part 3), Bright Spot callouts, and the exact chart/table datasets
 * shown in the report. Values are hardcoded from the report.
 *
 * Note: where the Executive Summary and Part 3 give slightly different figures
 * (the report is a work-in-progress draft), `summary` keeps the Exec-Summary
 * one-liner and `narrative` uses the fuller Part 3 figures.
 */

/* T10 indicator × region deviation matrix (shared by the numeric heatmap and
   the prioritised/deprioritised dot-matrix). */
const T10_COLUMNS: HeatColumn[] = [
  { key: "af", label: "Africa", avg: 21, n: 39 },
  { key: "ao", label: "Asia & Oceania", avg: 40, n: 31 },
  { key: "eu", label: "Europe", avg: 72, n: 31 },
  { key: "lac", label: "Lat. Am. & Carib.", avg: 32, n: 22 },
  { key: "me", label: "Middle East", avg: 49, n: 10 },
  { key: "na", label: "N. America*", avg: 79, n: 2 },
];

const T10_ROWS: HeatRow[] = [
  { group: "AI Use in Public Service", label: "Public Disclosure", cells: [-21, -21, -40, -10, -39, 21] },
  { group: "AI Use in Public Service", label: "Public Procurement", cells: [-10, -11, -33, -10, -19, 21] },
  { group: "AI Use in Public Service", label: "Public Sector Skills", cells: [8, 8, 2, -1, 31, 21] },
  { group: "Ethics & Sustainability", label: "Environmental Impact", cells: [-10, -11, -33, -5, -19, -29] },
  { group: "Ethics & Sustainability", label: "Fairness & Non-discrim.", cells: [13, 5, 12, 13, 21, -29] },
  { group: "Ethics & Sustainability", label: "Human Oversight", cells: [18, 5, 12, 4, 21, 21] },
  { group: "Ethics & Sustainability", label: "Transparency", cells: [10, 18, 18, 13, 31, 21] },
  { group: "Inclusion & Diversity", label: "Children's Rights", cells: [-5, 5, 9, -5, -19, -29] },
  { group: "Inclusion & Diversity", label: "Cultural & Linguistic", cells: [-5, -5, -11, -10, 1, -29] },
  { group: "Inclusion & Diversity", label: "Gender Equality", cells: [-8, -5, 2, 9, -9, 21] },
  { group: "Labour & Skills", label: "AI Literacy", cells: [15, 21, 9, 4, -9, -29] },
  { group: "Labour & Skills", label: "Labour Protections", cells: [-15, -28, 9, -5, -39, -29] },
  { group: "Labour & Skills", label: "Reskilling / Upskilling", cells: [13, 14, 9, 4, 21, -29] },
  { group: "Trust & Safety", label: "AI Misinformation", cells: [-13, -5, 5, -1, -29, 21] },
  { group: "Trust & Safety", label: "Access to Redress", cells: [13, -8, 5, -14, 1, 21] },
  { group: "Trust & Safety", label: "Impact Assessments", cells: [-3, 5, 15, 4, 31, 21] },
  { group: "Trust & Safety", label: "Safety & Security", cells: [0, 14, 12, 9, 21, 21] },
];

export const TAKEAWAYS: Takeaway[] = [
  /* ---------------------------------------------------------------- T1 */
  {
    title:
      "AI is accelerating faster than governments can govern it in the public interest",
    summary:
      "Diffusion of AI is expanding, with 53% of the global population having used generative AI tools. Yet average GIRAI scores remain low, at roughly 35 out of 100, and evidence of implementation exists in only 55% of cases where frameworks are active, falling to 45% in Global South countries.",
    narrative: [
      "The weakest-performing dimension of the Index is AI Use in Public Service — countries have frameworks addressing its indicators in just 31% of cases, against a 42% global average across all dimensions.",
      "The two worst-performing indicators of the entire Index sit in this dimension: only 26% of countries have frameworks for fair, accountable Public Procurement of AI, and only 18% require Public Disclosure of Government Algorithmic Systems.",
      "This reveals an asymmetry: AI is increasingly treated as something the state must regulate in the market, but not as something the state must account for in its own exercise of power — even though public-sector AI directly affects rights, entitlements, and access to welfare, healthcare, and education.",
      "Procurement leaders include Brazil, Chile (Public Procurement Directive No. 44), and Australia (National Framework for the Assurance of AI in Government, with a dedicated procurement section guarding against vendor lock-in).",
      "Overall, responsible AI governance is expanding, but the institutions, systems, and infrastructure needed to govern AI in the public interest remain underdeveloped and outpaced by AI's rapid diffusion.",
    ],
    brightSpot: {
      country: "Brazil",
      body: "Brazil is one of only 15 of 135 countries with both a policy and a government-led initiative on AI public procurement (the Brazilian AI Strategy plus InovaCPIN, a multi-agency procurement platform). It is also among the 7 Global South countries with environmental-impact frameworks plus implementation, 1 of only 12 of 98 showing labour-protection activity, and 1 of just 13 with frameworks mandating disclosure of government AI systems (its Generative AI Handbook for Public Service).",
    },
    visuals: [
      {
        kind: "image",
        title: "Most frequent types of implementation activities",
        caption:
          "Number of countries whose implementation of active frameworks includes each activity type (Flagship Report, Part 3, Finding 1).",
        image: {
          src: "/takeaways/charts/finding-1a.jpg",
          alt: "Horizontal bar chart of the most frequent implementation activity types by number of countries: training courses and workshops 70, operational programs 50, independent oversight bodies 28, research reports 27, standards certifications 23, monitoring and evaluation 22, formal education 18, multistakeholder consultations 16, grants subsidies 12, research centers 11.",
          width: 900,
          height: 486,
        },
      },
      {
        kind: "table",
        title: "Framework coverage by GIRAI dimension",
        caption: "% of country–indicator cases with an active framework, by dimension.",
        columns: ["Dimension", "Has framework", "No framework"],
        emphasizeLastRow: true,
        rows: [
          ["AI Use in Public Service", "30.86%", "69.14%"],
          ["Ethics and Sustainability", "47.59%", "52.41%"],
          ["Inclusion and Diversity", "38.77%", "61.23%"],
          ["Labour and Skills", "44.94%", "55.06%"],
          ["Trust and Safety", "44.81%", "55.19%"],
          ["Total", "41.96%", "58.04%"],
        ],
      },
      {
        kind: "ratioBar",
        title: "Framework vs implementation per indicator",
        image: {
          src: "/takeaways/charts/finding-1c.jpg",
          alt: "Diverging bar chart of the number of countries with a framework vs implementation evidence per indicator, with each bar's implementation-to-framework ratio; global average ratio 55%. Ranges from AI Literacy 79% down to Human Oversight & Determination 35%.",
          width: 900,
          height: 683,
        },
        average: 55,
        caption:
          "Implementation-to-framework ratio across 17 indicators (global average 55%). Bar width = countries with a framework; solid segment = countries with implementation evidence.",
        data: [
          { label: "AI Literacy", framework: 71, implementation: 56, ratio: 79 },
          { label: "Cultural & Linguistic Div.", framework: 47, implementation: 36, ratio: 77 },
          { label: "Public Sector Skills Dev.", framework: 66, implementation: 49, ratio: 74 },
          { label: "Reskilling & Upskilling", framework: 72, implementation: 53, ratio: 74 },
          { label: "AI-facilitated Misinformation", framework: 49, implementation: 29, ratio: 59 },
          { label: "Environmental Impact", framework: 36, implementation: 21, ratio: 58 },
          { label: "Safety & Security", framework: 69, implementation: 39, ratio: 57 },
          { label: "Fairness & Non-discrimination", framework: 71, implementation: 36, ratio: 51 },
          { label: "Children's Rights", framework: 55, implementation: 27, ratio: 49 },
          { label: "Impact Assessments", framework: 66, implementation: 32, ratio: 48 },
          { label: "Access to Redress & Remedy", framework: 58, implementation: 28, ratio: 48 },
          { label: "Labour Protections", framework: 39, implementation: 18, ratio: 46 },
          { label: "Gender Equality", framework: 55, implementation: 24, ratio: 44 },
          { label: "Public Procurement", framework: 35, implementation: 15, ratio: 43 },
          { label: "Transparency & Explainability", framework: 78, implementation: 31, ratio: 40 },
          { label: "Human Oversight & Determination", framework: 72, implementation: 25, ratio: 35 },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- T2 */
  {
    title:
      "Responsible AI governance is expanding in Global South countries, but binding protections remain scarce",
    summary:
      "Since the 1st Edition, Global South countries substantially broadened the responsible AI content of their national frameworks. On average, the number of GIRAI topics covered rose from 2.5 to 4.7, an 88% increase. In Global North countries, the number rose from 8.2 to 11.1, a 35% increase. Despite this progress, 78% of responsible AI framework cases in Global South countries are non-binding, compared with 42% in the North.",
    narrative: [
      "Global South countries drove much of the expansion: between editions, average framework coverage rose 88% (from 2.5 to 4.7 key areas), versus 35% in the Global North (8.2 to 11.1).",
      "But the growth is overwhelmingly soft law. In the Global South, 78% of cases where an active framework covered a reviewed area were non-binding, compared with 42% in the Global North.",
      "The Global North accounts for 67 of the 76 (88%) enforceability gains recorded between editions; the Global South accounts for only nine (12%). The EU AI Act alone drives 51 of those gains, across 21 EU countries and 10 indicators.",
      "Important exceptions exist: Peru's Supreme Decree 115-2025-PCM; the Kyrgyz Republic's Digital Code 2025 (right to object to and appeal automated decisions, plus AI risk and environmental assessment); and Ethiopia's Proclamation 1321/2024 (right to contest solely-automated decisions).",
      "Without enforceable foundations, responsible AI risks becoming a field of soft commitments precisely where governance capacity is most constrained and external technological dependence is greatest.",
    ],
    brightSpot: {
      country: "Peru",
      body: "Peru's binding Supreme Decree 115-2025-PCM establishes enforceable obligations across 13 GIRAI indicators — the widest adopted coverage of any Global South country. It sets guiding principles (non-discrimination, human oversight, sustainability, transparency), requires human review of AI decisions, prohibits manipulative or subliminal AI, mandates that AI-supported services consider the differentiated needs of children, adolescents, women, and girls (Art. 12), and triggers mandatory prior human-rights impact assessments for high-risk uses such as employment, education, and essential services (Arts. 22, 24).",
    },
    visuals: [
      {
        kind: "groupedBar",
        title: "Average indicators covered by frameworks, 2024 vs 2026",
        image: {
          src: "/takeaways/charts/finding-2.jpg",
          alt: "Stacked bars comparing average indicators covered by frameworks in 2024 vs 2026, split into binding and non-binding, for Global North (8.2 to 11.1, +35%) and Global South (2.5 to 4.7, +88%).",
          width: 900,
          height: 584,
        },
        unit: "count",
        max: 14,
        caption:
          "Average number of indicators with an adopted (active) framework per country, out of 14 comparable indicators (draft frameworks excluded). ▲ = relative growth.",
        globalRefLines: [{ label: "max (14)", value: 14, colorKey: "neutral" }],
        series: [
          { key: "2024", label: "2024", colorKey: "series2024" },
          { key: "2026", label: "2026", colorKey: "series2026" },
        ],
        categories: [
          {
            category: "Global North (n=35)",
            delta: "+34%",
            bars: [
              { seriesKey: "2024", value: 8.2 },
              { seriesKey: "2026", value: 11.0 },
            ],
          },
          {
            category: "Global South (n=95)",
            delta: "+88%",
            bars: [
              { seriesKey: "2024", value: 2.5 },
              { seriesKey: "2026", value: 4.7 },
            ],
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- T3 */
  {
    title:
      "AI safety is being governed as a technical problem, while human harms remain under-addressed",
    summary:
      "AI safety and security is one of the fastest-growing areas of governance, but much of it focuses on technical safeguards. Meanwhile, the Index found credible evidence of government use of unacceptable-risk AI systems in 35 of 135 countries, and only 49 countries (36%) have frameworks addressing AI-facilitated misinformation and violence.",
    narrative: [
      "Safety & Security is one of the fastest-growing areas: about 30 countries gained a framework since the 1st Edition (10 in Europe — 9 via the EU AI Act, 6 in Asia & Oceania, 6 in South & Central America, 5 in Africa, 3 in the Middle East).",
      "But much of this governance covers technical safeguards (robustness, reliability, resilience) rather than the material harms people experience.",
      "Researchers found credible evidence of government use of unacceptable-risk AI in 35 of 135 countries — more than half involving mass biometric surveillance.",
      "Frameworks addressing AI-facilitated misinformation and violence exist in only 36% of countries, and just 59% of those show implementation — meaning only 29 countries have active, implemented measures.",
      "Beyond technical safety, examples include Bangladesh's Cyber Security Ordinance 2025 (criminalising AI-enabled harmful content, harassment, and CSAM) and Australia's Criminal Code Amendment (Deepfake Sexual Material) Act 2024.",
    ],
    brightSpot: {
      country: "The Gambia",
      body: "The Gambia's National Child and Vulnerable Groups Online Protection Policy is its first framework specifically protecting children and vulnerable people from online harms, including those facilitated by AI — assigning obligations to ISPs, mobile operators, developers, and law enforcement. It is complemented by a nationwide anti-misinformation campaign (January 2025) and the launch of a National Misinformation and Disinformation Response Centre.",
    },
    visuals: [
      {
        kind: "regionalBar",
        title: "AI-facilitated misinformation & violence: framework adoption by region",
        image: {
          src: "/takeaways/charts/finding-3b.jpg",
          alt: "Bar chart of the percentage of countries with a framework on AI-facilitated misinformation and violence by region, against each region's average across all indicators: Middle East 20%, Africa 8%, Asia & Oceania 37%, South & Central America 43%, Caribbean 13%, Europe 75%, Northern America 100%.",
          width: 900,
          height: 584,
        },
        caption:
          "% of countries with an adopted framework, vs each region's average across all 17 indicators (dashed).",
        data: [
          { region: "Africa", value: 8, regionalAvg: 21, deviationPp: -13, n: 39 },
          { region: "Asia & Oceania", value: 35, regionalAvg: 40, deviationPp: -5, n: 31 },
          { region: "Europe", value: 77, regionalAvg: 72, deviationPp: 5, n: 31 },
          { region: "Lat. Am. & Carib.", value: 32, regionalAvg: 32, deviationPp: -1, n: 22 },
          { region: "Middle East", value: 20, regionalAvg: 49, deviationPp: -29, n: 10 },
          { region: "N. America*", value: 100, regionalAvg: 79, deviationPp: 21, n: 2 },
        ],
      },
      {
        kind: "bubbleMap",
        title: "Government use of unacceptable-risk AI (URAI)",
        image: {
          src: "/takeaways/charts/finding-3c.jpg",
          alt: "World map with proportional bubbles showing credible evidence of government use of unacceptable-risk AI across 35 of 135 countries, more than half involving mass biometric surveillance.",
          width: 900,
          height: 683,
        },
        caption:
          "Credible evidence of government URAI use was found in 35 of 135 countries — more than half involving mass biometric surveillance. Bubbles illustrate the report's mapped distribution.",
        points: [
          { name: "United States", lon: -98, lat: 39, cases: 1 },
          { name: "Mexico", lon: -102, lat: 23, cases: 1 },
          { name: "Brazil", lon: -51, lat: -10, cases: 4 },
          { name: "Argentina", lon: -64, lat: -34, cases: 1 },
          { name: "Chile", lon: -71, lat: -30, cases: 1 },
          { name: "United Kingdom", lon: -1, lat: 53, cases: 2 },
          { name: "France", lon: 2, lat: 47, cases: 2 },
          { name: "Spain", lon: -4, lat: 40, cases: 1 },
          { name: "Germany", lon: 10, lat: 51, cases: 2 },
          { name: "Italy", lon: 12, lat: 42, cases: 1 },
          { name: "Netherlands", lon: 5, lat: 52, cases: 1 },
          { name: "Poland", lon: 19, lat: 52, cases: 2 },
          { name: "Serbia", lon: 21, lat: 44, cases: 2 },
          { name: "Russia", lon: 45, lat: 56, cases: 4 },
          { name: "Türkiye", lon: 35, lat: 39, cases: 2 },
          { name: "Saudi Arabia", lon: 45, lat: 24, cases: 4 },
          { name: "Egypt", lon: 30, lat: 27, cases: 1 },
          { name: "Nigeria", lon: 8, lat: 9, cases: 1 },
          { name: "Kenya", lon: 38, lat: 0, cases: 1 },
          { name: "Ethiopia", lon: 40, lat: 9, cases: 1 },
          { name: "India", lon: 78, lat: 22, cases: 2 },
          { name: "China", lon: 104, lat: 35, cases: 4 },
          { name: "South Korea", lon: 127, lat: 37, cases: 1 },
          { name: "Japan", lon: 138, lat: 37, cases: 1 },
          { name: "Indonesia", lon: 113, lat: -2, cases: 1 },
          { name: "Australia", lon: 134, lat: -25, cases: 1 },
        ],
      },
      {
        kind: "table",
        title: "Growth of Safety & Security coverage, 2024 → 2026",
        image: {
          src: "/takeaways/charts/finding-3a.jpg",
          alt: "Stacked bar chart of Safety & Security framework coverage growth from 2024 to 2026 by region, showing existing vs new frameworks and the growth multiple: South & Central America 2→8 (4.0x), Africa 3→8 (2.7x), Middle East 3→6 (2.0x), Europe 16→26 (1.6x), Asia & Oceania 10→16 (1.6x), Caribbean 1→1, Northern America 2→2.",
          width: 900,
          height: 431,
        },
        caption: "Number of countries · growth = new in 2026 / had in 2024 · Oceania n=2*.",
        columns: ["Region", "Had (2024)", "New 2026", "Growth", "No framework", "Total"],
        emphasizeLastRow: true,
        rows: [
          ["Africa", "3 (8%)", "5 (14%)", "+167%", "29 (78%)", "n=37"],
          ["Americas", "5 (21%)", "6 (25%)", "+120%", "13 (54%)", "n=24"],
          ["Asia", "13 (35%)", "8 (22%)", "+62%", "16 (43%)", "n=37"],
          ["Europe", "15 (50%)", "10 (33%)", "+67%", "5 (17%)", "n=30"],
          ["Oceania*", "1 (50%)", "1 (50%)", "+100%", "0 (0%)", "n=2"],
          ["Total", "37", "30", "+81%", "63", "n=130"],
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- T4 */
  {
    title:
      "Governments are regulating AI transparency but not disclosing their own use of AI",
    summary:
      "Transparency and Explainability is the strongest-performing indicator, with 58% of countries having some form of framework. Yet implementation lags. For government use of AI, Public Disclosure of Government Algorithmic Systems is the weakest-performing indicator, with only 18% of countries requiring disclosure of government AI systems.",
    narrative: [
      "Transparency and Explainability is the strongest indicator — 58% of countries have some framework — but it also has one of the largest implementation gaps: in 60% of cases there is no evidence of meaningful operationalisation.",
      "Public Disclosure of Government Algorithmic Systems is the lowest-performing indicator of the entire Index, with only 18% of countries requiring disclosure of their own AI systems.",
      "Stronger examples include Canada's Directive on Automated Decision-Making (mandatory algorithmic impact assessments plus the public Government of Canada AI Register), Colombia's Joint Directive 007 of 2025, and the Netherlands' Open Government Act backed by the Dutch Algorithm Register and FRAIA.",
      "The result is a transparency gap: AI in public services, policing, migration, and welfare remains largely hidden — so people may not know when AI is used, how it affects decisions, or how to challenge harmful outcomes.",
    ],
    brightSpot: {
      country: "Colombia",
      body: "Colombia's binding Joint Directive 007 of 2025 (Office of the Attorney General and Office of the Ombudsman) establishes active disclosure obligations (Arts. 8–9) requiring minimum public content — purpose, data used, and developer. It also mandates enhanced transparency for high-impact systems (Art. 13), algorithmic impact analysis (Art. 14), and access to source code or a meaningful explanation (Art. 17).",
    },
    visuals: [
      {
        kind: "indicatorRankBar",
        title: "Countries with an active framework, by indicator",
        image: {
          src: "/takeaways/charts/finding-4.jpg",
          alt: "Ranked horizontal bar chart of the percentage of 135 countries with an active framework by indicator, from Transparency & Explainability 58% (highlighted, strongest) down to Public Disclosure of Government Algorithmic Systems 18% (highlighted, weakest); global average 42%.",
          width: 900,
          height: 683,
        },
        caption: "% of 135 countries with a framework. Strongest (top) and weakest (bottom) indicators highlighted.",
        highlightTop: "Transparency & Explainability",
        highlightBottom: "Public Disclosure of Gov. AI Systems",
        data: [
          { label: "Transparency & Explainability", value: 58 },
          { label: "Reskilling & Upskilling", value: 53 },
          { label: "Human Oversight & Determination", value: 53 },
          { label: "Fairness & Non-discrimination", value: 53 },
          { label: "AI Literacy", value: 53 },
          { label: "Safety & Security", value: 51 },
          { label: "Public Sector Skills Dev.", value: 49 },
          { label: "Impact Assessments", value: 49 },
          { label: "Access to Redress & Remedy", value: 43 },
          { label: "Gender Equality", value: 41 },
          { label: "Children's Rights", value: 41 },
          { label: "AI-facilitated Misinformation", value: 36 },
          { label: "Cultural & Linguistic Diversity", value: 35 },
          { label: "Labour Protections", value: 29 },
          { label: "Environmental Impact", value: 27 },
          { label: "Public Procurement", value: 26 },
          { label: "Public Disclosure of Gov. AI Systems", value: 18 },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- T5 */
  {
    title:
      "Gender is increasingly recognised in AI governance, but protection from gendered harms remains weak",
    summary:
      "Gender equality is gaining visibility, with 29 new countries addressing gender and AI since the 1st Edition, but only 24 of 55 countries with gender-related frameworks show evidence of implementation. Protection from gendered AI harms remains limited.",
    narrative: [
      "Gender equality is becoming more visible — 29 new countries addressed it since the 1st Edition, one of the biggest-growth areas — yet it continues to rank low and remains structurally deprioritised.",
      "It has one of the widest implementation gaps: while 55 countries have gender-and-AI frameworks, only 24 show evidence of implementation.",
      "AI-facilitated gender harms are already widespread: 38% of women report having experienced online violence and 85% report having witnessed it, with deepfake content heavily targeting women and girls.",
      "Targeted provisions exist — Chile's National AI Policy (2024), Colombia's CONPES 4144, Australia's Deepfake Sexual Material Act 2024, and the Dominican Republic's SARA chatbot, a government AI first point of contact for women and girls facing gender-based violence.",
      "Compounding marginalisation (LGBTQAI+, race, class, migration status, disability) raises risks further, and the governance response remains partial and inadequate.",
    ],
    brightSpot: {
      country: "Chile",
      body: "Chile's updated National Policy on Artificial Intelligence (2024) goes beyond encouraging women into AI research and industry — it tackles the risk that automation widens gender gaps. It sets specific measures to stop AI from reinforcing gender bias: bias and non-discrimination assessments across the full AI lifecycle, requirements that training data draw on diverse social groups, and active support for underrepresented groups.",
    },
    visuals: [
      {
        kind: "regionalBar",
        title: "Gender Equality framework adoption by region",
        image: {
          src: "/takeaways/charts/finding-5.jpg",
          alt: "Bar chart of the percentage of countries with a Gender Equality framework by region, against each region's average across all indicators: Middle East 40%, Africa 13%, Asia & Oceania 37%, Caribbean 13%, Europe 75%, South & Central America 57%, Northern America 100%.",
          width: 900,
          height: 584,
        },
        caption:
          "% of countries with an adopted framework, vs each region's average across all 17 indicators (dashed).",
        data: [
          { region: "Africa", value: 13, regionalAvg: 21, deviationPp: -8, n: 39 },
          { region: "Asia & Oceania", value: 35, regionalAvg: 40, deviationPp: -5, n: 31 },
          { region: "Europe", value: 74, regionalAvg: 72, deviationPp: 2, n: 31 },
          { region: "Lat. Am. & Carib.", value: 41, regionalAvg: 32, deviationPp: 9, n: 22 },
          { region: "Middle East", value: 40, regionalAvg: 49, deviationPp: -9, n: 10 },
          { region: "N. America*", value: 100, regionalAvg: 79, deviationPp: 21, n: 2 },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- T6 */
  {
    title:
      "Future generations are being prepared for the AI economy but not protected from AI-related harms",
    summary:
      "AI Literacy is one of the strongest-performing indicators, with 71 countries (53%) having some framework in place and 106 countries showing evidence of some activity. By contrast, only 55 countries (41%) have frameworks addressing Children's Rights in AI, and only 27 of them show evidence of implementation.",
    narrative: [
      "Governments are investing heavily in AI literacy: 71 countries (53%) have a framework, and combining frameworks with government-led initiatives makes AI Literacy the strongest-performing indicator, with 106 countries showing activity.",
      "But literacy does not protect children. Children's Rights remains one of the weakest and slowest-growing indicators: frameworks exist in only 55 countries, and just 27 show implementation — so 51% of countries with a children's-rights framework show no evidence of practice.",
      "Children face specific risks: profiling, targeted manipulation, unsafe recommender systems, AI-facilitated misinformation, image-based abuse, and deepfake sexual content.",
      "The Internet Watch Foundation assessed 8,029 AI-generated images and videos as showing realistic child sexual abuse in 2025.",
      "Combined-approach examples include Kazakhstan's 2025–2029 education framework and the Kyrgyz Republic's Digital Code 2025.",
    ],
    brightSpot: {
      country: "Nigeria",
      body: "Nigeria pairs skills with protection. On literacy, its National AI Strategy 2025 mandates a comprehensive AI skills programme including teacher training, backed by the 3 Million Technical Talent (3MTT) programme. On protection, the binding Nigeria Data Protection Act requires parental consent to process children's data and prohibits decisions based solely on automated processing, operationalised via the General Application and Implementation Directive (GAID) 2025 with enhanced safeguards for minors and vulnerable groups.",
    },
    visuals: [
      {
        kind: "groupedBar",
        title: "Children's Rights: frameworks vs government-led initiatives, by region",
        image: {
          src: "/takeaways/charts/finding-6.jpg",
          alt: "Paired bar chart comparing frameworks vs government-led initiatives: AI Literacy has 71 frameworks and 86 initiatives, while Children's Rights has 55 frameworks and only 37 initiatives.",
          width: 900,
          height: 654,
        },
        unit: "%",
        caption:
          "% of countries with a framework adopted vs with a government-led initiative. Dashed lines = global averages.",
        globalRefLines: [
          { label: "avg frameworks 41%", value: 41, colorKey: "frameworks" },
          { label: "avg initiatives 30%", value: 30, colorKey: "initiatives" },
        ],
        series: [
          { key: "frameworks", label: "Frameworks adopted", colorKey: "frameworks" },
          { key: "initiatives", label: "Government-led initiatives", colorKey: "initiatives" },
        ],
        categories: [
          { category: "Africa", bars: [{ seriesKey: "frameworks", value: 15 }, { seriesKey: "initiatives", value: 8 }] },
          { category: "Asia & Oceania", bars: [{ seriesKey: "frameworks", value: 45 }, { seriesKey: "initiatives", value: 42 }] },
          { category: "Europe", bars: [{ seriesKey: "frameworks", value: 81 }, { seriesKey: "initiatives", value: 48 }] },
          { category: "Lat. Am. & Carib.", bars: [{ seriesKey: "frameworks", value: 27 }, { seriesKey: "initiatives", value: 14 }] },
          { category: "Middle East", bars: [{ seriesKey: "frameworks", value: 30 }, { seriesKey: "initiatives", value: 20 }] },
          { category: "N. America*", bars: [{ seriesKey: "frameworks", value: 50 }, { seriesKey: "initiatives", value: 50 }] },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- T7 */
  {
    title: "AI's environmental footprint remains a blind spot in responsible AI governance",
    summary:
      "Only 27% of countries have frameworks addressing AI's environmental effects, and 83% of those frameworks are non-binding. Very few governments require disclosure of AI's energy use, water use, or environmental impact, making it a global blind spot.",
    narrative: [
      "Environmental impact is one of the least-regulated areas: only 27% of countries have frameworks, and 83% of those are non-binding. Only 6 of the 36 existing frameworks have any legal force.",
      "It is critically unprioritised in the Global North in particular.",
      "The stakes are large: a UK Government Digital Sustainability Alliance working group warns AI-related water demand could rise from 1.1 billion to 6.6 billion cubic metres by 2027; Kenya discontinued a major geothermal data-centre partnership whose projected energy need approached one-third of national power capacity.",
      "Operators do not disclose the data needed to separate AI-specific workloads, hiding AI's precise footprint.",
      "Emerging action includes Panama's proposed Bill 413 (developer environmental obligations) and Viet Nam's Decision 36/QD-TTg (green data-centre standards requiring a Power Usage Effectiveness below 1.4).",
    ],
    brightSpot: {
      country: "Spain",
      body: "Spain's 2024 Artificial Intelligence Strategy integrates sustainability into AI infrastructure and model development — reducing the energy, water, and carbon footprint of data centres and of training and inference — and promotes 'Green AI' through standards and certification. Its National Plan for Green Algorithms standardises how energy use is measured across the AI lifecycle, funds tools to quantify and cut consumption, and creates two academic chairs for Green AI.",
    },
    visuals: [
      {
        kind: "comparisonColumns",
        title: "Environmental Impact vs other indicators: high-income vs LMICs",
        image: {
          src: "/takeaways/charts/finding-7.jpg",
          alt: "Dumbbell chart comparing framework adoption in the Global South vs Global North across all indicators, with Environmental Impact highlighted at the bottom (Global South ~20%, Global North ~43%) as one of the least-covered indicators in both groups.",
          width: 900,
          height: 683,
        },
        caption: "% of countries with an adopted framework, sorted within each group. Environmental Impact highlighted.",
        highlightLabel: "Environmental Impact",
        left: {
          title: "High-income (n=37)",
          items: [
            { label: "Transparency", value: 95 },
            { label: "Impact Assessments", value: 92 },
            { label: "Safety & Security", value: 89 },
            { label: "Human Oversight", value: 89 },
            { label: "Reskilling & Upskilling", value: 86 },
            { label: "Fairness & Non-discrim.", value: 86 },
            { label: "AI Literacy", value: 84 },
            { label: "Children's Rights", value: 81 },
            { label: "AI-facilitated Misinfo.", value: 78 },
            { label: "Public Sector Skills", value: 76 },
            { label: "Gender Equality", value: 76 },
            { label: "Access to Redress", value: 76 },
            { label: "Labour Protections", value: 70 },
            { label: "Cultural & Linguistic", value: 65 },
            { label: "Public Procurement", value: 49 },
            { label: "Public Disclosure", value: 46 },
            { label: "Environmental Impact", value: 43 },
          ],
        },
        right: {
          title: "LMICs (n=98)",
          items: [
            { label: "Transparency", value: 44 },
            { label: "Reskilling & Upskilling", value: 41 },
            { label: "AI Literacy", value: 41 },
            { label: "Human Oversight", value: 40 },
            { label: "Fairness & Non-discrim.", value: 40 },
            { label: "Public Sector Skills", value: 39 },
            { label: "Safety & Security", value: 37 },
            { label: "Impact Assessments", value: 33 },
            { label: "Access to Redress", value: 31 },
            { label: "Gender Equality", value: 28 },
            { label: "Children's Rights", value: 26 },
            { label: "Cultural & Linguistic", value: 23 },
            { label: "Environmental Impact", value: 20 },
            { label: "AI-facilitated Misinfo.", value: 20 },
            { label: "Public Procurement", value: 17 },
            { label: "Labour Protections", value: 13 },
            { label: "Public Disclosure", value: 7 },
          ],
        },
      },
      {
        kind: "indicatorRankBar",
        title: "Environmental Impact's share of civil-society (CSO) activity",
        caption: "% of total CSO activity by indicator. Environmental Impact highlighted.",
        valueDigits: 1,
        highlight: ["Environmental Impact"],
        data: [
          { label: "Transparency & Explainability", value: 10.5 },
          { label: "Fairness & Non-discrimination", value: 9.2 },
          { label: "Safety & Security", value: 8.9 },
          { label: "Data Protection & Privacy", value: 8.4 },
          { label: "AI-facilitated Misinformation", value: 7.4 },
          { label: "Human Oversight & Determination", value: 7.1 },
          { label: "Gender Equality", value: 6.8 },
          { label: "Reskilling & Upskilling", value: 6.1 },
          { label: "AI Literacy", value: 6.1 },
          { label: "Labour Protections", value: 5.8 },
          { label: "Cultural & Linguistic Diversity", value: 3.9 },
          { label: "Children's Rights", value: 3.6 },
          { label: "Impact Assessments", value: 3.4 },
          { label: "Rights of Persons w/ Disabilities", value: 3.0 },
          { label: "Consumer Protection", value: 2.8 },
          { label: "Environmental Impact", value: 2.7 },
          { label: "Data Sharing & Access", value: 2.4 },
          { label: "Access to Redress & Remedy", value: 2.2 },
        ],
      },
      {
        kind: "groupedBar",
        title: "Environmental Impact: frameworks vs initiatives, Global North vs South",
        unit: "%",
        caption: "% of countries. Dashed lines = average frameworks / initiatives across all indicators for each group.",
        series: [
          { key: "frameworks", label: "Frameworks adopted", colorKey: "frameworks" },
          { key: "initiatives", label: "Government-led initiatives", colorKey: "initiatives" },
        ],
        categories: [
          {
            category: "Global North (n=37)",
            bars: [{ seriesKey: "frameworks", value: 41 }, { seriesKey: "initiatives", value: 41 }],
            refLines: [
              { value: 75, colorKey: "frameworks" },
              { value: 58, colorKey: "initiatives" },
            ],
          },
          {
            category: "Global South (n=98)",
            bars: [{ seriesKey: "frameworks", value: 20 }, { seriesKey: "initiatives", value: 13 }],
            refLines: [
              { value: 29, colorKey: "frameworks" },
              { value: 24, colorKey: "initiatives" },
            ],
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- T8 */
  {
    title:
      "Governments recognise the need for local-language AI but do not require developers to deliver it",
    summary:
      "Governments are investing in local-language technologies and cultural inclusion, with 52 countries (39%) showing government-led initiatives. Only 47 countries (35%) have frameworks addressing Cultural and Linguistic Diversity, and few require developers to use diverse datasets or adapt systems to local contexts.",
    narrative: [
      "Governments increasingly recognise cultural and linguistic diversity as central to whether AI is locally appropriate and accessible — but it remains one of the least-covered and slowest-growing indicators.",
      "52 countries have government-led initiatives (local-language technologies, multilingual datasets, NLP tools, national language models); a noteworthy example is the German-backed AI Language Proficiency Monitor, tracking LLM performance across up to 200 languages.",
      "Only 47 countries have frameworks, and most promote these values rather than mandating them; few require developers to train on diverse datasets or adapt to local contexts.",
      "This matters because the world's poorest populations increasingly use AI to access essential services, so linguistic inclusion directly affects livelihoods and access.",
      "Examples include New Zealand's Responsible AI Guidance (Māori data sovereignty, consultation with iwi Māori) and Kenya's National AI Strategy 2025-2030 (NLP for linguistic diversity).",
    ],
    brightSpot: {
      country: "Singapore",
      body: "Singapore's National Multimodal LLM Programme (SGD 70 million) supports models attuned to Southeast Asia's cultures and languages, building on SEA-LION, which covers 13 regional languages. Its AI Safety Red Teaming Challenge tested systems across 10 Asia-Pacific languages and nine countries, finding that safety guardrails were weaker in regional languages than in English.",
    },
    visuals: [
      {
        kind: "regionalBar",
        title: "Cultural & Linguistic Diversity: government-led initiatives by region",
        image: {
          src: "/takeaways/charts/finding-8.jpg",
          alt: "Scatter quadrant chart of frameworks (x-axis) vs government-led initiatives (y-axis) across indicators, with mean lines at 58 and 38. Cultural and Linguistic Diversity is highlighted just below the framework mean and above the initiatives mean.",
          width: 900,
          height: 722,
        },
        caption:
          "% of countries with at least one government-led initiative, vs each region's average across all 17 indicators (dashed).",
        data: [
          { region: "Africa", value: 18, regionalAvg: 15, deviationPp: 3, n: 39 },
          { region: "Asia & Oceania", value: 52, regionalAvg: 39, deviationPp: 13, n: 31 },
          { region: "Europe", value: 68, regionalAvg: 54, deviationPp: 14, n: 31 },
          { region: "Lat. Am. & Carib.", value: 18, regionalAvg: 27, deviationPp: -9, n: 22 },
          { region: "Middle East", value: 30, regionalAvg: 28, deviationPp: 2, n: 10 },
          { region: "N. America*", value: 50, regionalAvg: 74, deviationPp: -24, n: 2 },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- T9 */
  {
    title: "Governments are investing in AI skills but neglecting workers' rights",
    summary:
      "Labour protection frameworks exist in only 39 countries (29%), compared with 72 countries (53%) with frameworks on reskilling and upskilling. Few countries address workers' rights to organise and collectively bargain in response to AI-driven workplace change.",
    narrative: [
      "Governments are far more likely to invest in reskilling than to protect workers: labour-protection frameworks exist in only 39 countries (29%), versus 72 (53%) for reskilling and upskilling.",
      "Growth has been minimal — only 15 countries added labour-protection coverage since the 1st Edition, one of the slowest-growing and worst-performing indicators (implementation in just 46% of frameworks).",
      "Only Mexico, Singapore, Uruguay, and Chile address workers' rights to organise and collectively bargain in response to AI-driven workplace change, focused on platform workers.",
      "The World Bank estimates 154–435 million online gig workers globally (4.4–12.5% of the labour force), with demand up 41% between 2016 and early 2023.",
      "Coverage is starkly uneven: Europe 78%, but Africa just 5%, the Caribbean 0%, Asia & Oceania 13% — and only 13% of Global South countries have an operational labour framework.",
    ],
    brightSpot: {
      country: "Uruguay",
      body: "Uruguay's Law 20.396/2025 sets minimum remuneration, working-time limits, occupational-accident coverage, and social-security access for digital-platform workers, including those in autonomous relationships. It requires disclosure of automated monitoring and decision-making systems and their key parameters, entitles workers to a written explanation of any automated decision affecting their conditions (including suspension and termination), and explicitly guarantees freedom of association and collective bargaining.",
    },
    visuals: [
      {
        kind: "regionalBar",
        title: "Labour Protections coverage by region",
        showDeviation: true,
        valueDigits: 1,
        caption:
          "% of countries with a framework, vs each region's average across all indicators (dashed). Lower panel shows deviation in percentage points.",
        data: [
          { region: "Africa", value: 5.1, regionalAvg: 20.5, deviationPp: -15.4 },
          { region: "Asia & Oceania", value: 12.9, regionalAvg: 40.4, deviationPp: -27.5 },
          { region: "Europe", value: 80.7, regionalAvg: 72.2, deviationPp: 8.5 },
          { region: "Latin America", value: 27.3, regionalAvg: 32.4, deviationPp: -5.1 },
          { region: "Middle East", value: 10.0, regionalAvg: 48.8, deviationPp: -38.8 },
          { region: "N. America", value: 50.0, regionalAvg: 79.4, deviationPp: -29.4 },
        ],
      },
      {
        kind: "groupedBar",
        title: "Frameworks vs government-led initiatives: labour vs skills",
        image: {
          src: "/takeaways/charts/finding-9.jpg",
          alt: "Paired bar chart comparing frameworks vs government-led initiatives: Reskilling and Upskilling has 72 frameworks and 77 initiatives, while Labour Protections has only 39 frameworks and 30 initiatives.",
          width: 900,
          height: 654,
        },
        unit: "count",
        max: 100,
        caption: "Number of countries. Government-led initiatives counted independently of framework adoption.",
        series: [
          { key: "frameworks", label: "Frameworks adopted", colorKey: "frameworks" },
          { key: "initiatives", label: "Government-led initiatives", colorKey: "initiatives" },
        ],
        categories: [
          { category: "Labour Protections", bars: [{ seriesKey: "frameworks", value: 39 }, { seriesKey: "initiatives", value: 30 }] },
          { category: "Reskilling / Upskilling", bars: [{ seriesKey: "frameworks", value: 71 }, { seriesKey: "initiatives", value: 77 }] },
          { category: "AI Literacy", bars: [{ seriesKey: "frameworks", value: 71 }, { seriesKey: "initiatives", value: 87 }] },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- T10 */
  {
    title:
      "Global AI governance is fragmenting before a shared floor of protection has been established",
    summary:
      "Average GIRAI scores range from 55 in Global North countries to 27 in Global South countries. Available evidence shows that 164 of 215 recent AI-related frameworks are non-binding, and multi-stakeholder consultations appear only 31 times in the global implementation record. Without a shared rights-based floor, interoperability risks serving markets before it protects people.",
    narrative: [
      "Responsible AI governance is expanding but not converging, fragmenting in four directions.",
      "Vertical divide: average GIRAI scores range from 55 (Global North) to 27 (Global South); implementation evidence is available in 66% of Northern cases vs 45% in the South.",
      "Horizontal fragmentation: only three indicators are consistent cross-region priorities — Safety & Security, Human Oversight & Determination, and Transparency & Explainability — suggesting consensus on the machinery of governance, but not its purpose.",
      "Enforceability: of 197 AI-related frameworks approved between November 2023 and September 2025, 150 are non-binding; most enforceability growth is in Europe via the EU AI Act (21 countries).",
      "Participation: 73 of 135 countries have a national AI policy, but CSOs were consulted in drafting in only 37 cases, just 25 policies provide for ongoing CSO participation, and only 40 countries have any operational CSO mechanism.",
      "Without a shared rights-based floor, systems may become interoperable before protections do — data, models, and standards crossing borders faster than rights, remedies, and safeguards — deepening global inequality.",
    ],
    visuals: [
      {
        kind: "heatmap",
        mode: "numeric",
        title: "Deviation from regional average framework coverage",
        image: {
          src: "/takeaways/charts/finding-10.jpg",
          alt: "Dot-strip chart showing, for each indicator, the percentage-point deviation of each region from its regional average framework coverage, sorted by spread (σ). Indicators with the widest regional divergence (e.g. Public Disclosure σ=20, AI Literacy σ=18) appear at the top; the most consistent (e.g. Transparency & Explainability σ=7) at the bottom.",
          width: 900,
          height: 635,
        },
        caption:
          "Percentage-point deviation of each region from its average framework coverage across all indicators, per indicator, sorted by spread (σ). Each dot is a region.",
        columns: T10_COLUMNS,
        rows: T10_ROWS,
      },
      {
        // Preserved for later use; superseded by the finding-10 image above.
        hidden: true,
        kind: "heatmap",
        mode: "dots",
        title: "Prioritised vs deprioritised indicators across regions",
        caption:
          "Amber = prioritised (>+5pp above the regional average), blue = deprioritised (<−5pp), grey = neutral. # = regions prioritising the indicator.",
        columns: T10_COLUMNS,
        rows: T10_ROWS,
      },
    ],
  },
];
