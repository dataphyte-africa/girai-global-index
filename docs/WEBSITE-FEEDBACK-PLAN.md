# GIRAI Website Feedback Plan & Checklist

**Feedback Date:** 9 February  
**Feedback From:** Nico, Shyline, Fiona, Selam, Daphine, Mark, Leah  
**Versions Reviewed:** Figma & Web

---

## Table of Contents

1. [Layout & Website Structure](#1-layout--website-structure)
2. [Missing Pages & Sections](#2-missing-pages--sections)
3. [Home Page](#3-home-page)
4. [Dimension Page](#4-dimension-page)
5. [Region Page](#5-region-page)
6. [Country Page](#6-country-page)
7. [Methodology Page](#7-methodology-page)
8. [About Page](#8-about-page)
9. [Content & Messaging](#9-content--messaging)

---

## 1. Layout & Website Structure

### Header & Navigation

- [ ] **Clarify header menu structure** - Document and implement clear navigation paths to region, dimension, and country pages directly from the header
- [ ] **Add menu-level access** to core sections (regions, dimensions, countries)
- [ ] **Review overall site architecture** and document user navigation flows

### Visual & Technical Issues

- [ ] **Fix globe stretching bug** - When clicking "Research" tab, the globe stretches horizontally (glitch)
- [ ] **Review map leaflet customization** - Investigate ability to add/customize leaflets for specific countries
- [ ] **Reduce country border thickness** on globe/map (Figma version has borders that appear too thick)

### Branding & Identity

- [ ] **Review stock images** - Ensure images:
  - [ ] Reflect concepts being illustrated accurately
  - [ ] Maintain thematic consistency across the site
- [ ] **Add GCG branding** - Make it clear upfront that this is a project of GCG
- [ ] **Revisit tagline** - Current: "Shaping Responsible Intelligence" vs Previous: "Igniting global action on responsible AI, with local evidence"
  - [ ] Discuss and confirm final tagline
  - [ ] Address concern about "responsible intelligence" terminology

---

## 2. Missing Pages & Sections

### Open Data Page

- [ ] **Create dedicated data download page**
- [ ] **Retain gated access logic** - Users complete form before downloading (for tracking purposes)
- [ ] **Move from hidden location** in methods page to prominent standalone page

### Evidence Explorer

- [ ] **Design improved evidence explorer** - Show:
  - [ ] Which laws/policies support a given score
  - [ ] How many countries have a framework on a specific topic
  - [ ] Which countries in a region show implementation activity
- [ ] **Add filters and aggregated metrics**
- [ ] **Integrate into relevant pages** (thematic areas, country pages)
- [ ] **Consider standalone page** with comprehensive filtering capabilities

### Updates / News Page

- [ ] **Create news/updates page** for:
  - [ ] Project updates
  - [ ] Media appearances
  - [ ] Country-level research highlights
  - [ ] General relevant news
- [ ] **Spotlight 2024 media activity**
- [ ] **Add visualizations** showing how different audience groups use GIRAI
- [ ] **Feature key news articles** where GIRAI is mentioned (analysis pieces, OpEds, press releases)
- [ ] **Create different briefs** for researchers, media, and policymakers

### Comparison Tools

- [ ] **Add indicator comparison tool** - Compare GIRAI with:
  - [ ] Human Development Index
  - [ ] GDP
  - [ ] Other relevant indicators
- [ ] **Add temporal comparison** - Compare current scores with previous edition scores to show country improvement

### Indicators Consideration

- [ ] **Decide on indicator pages** - Currently no dedicated pages for indicators (focus is dimension level)
- [ ] **Document what might be lost** without indicator-specific pages

---

## 3. Home Page

**References:**
- Figma: `https://www.figma.com/proto/MlXc1IzWmYurwt2MeCxNJX/GIRAI?page-id=0%3A1&node-id=780-37768`
- Web: `https://girai--girai-global-index.europe-west4.hosted.app/`

### Positives to Retain ✓

- Strong focus on dimensions (aligns with AI governance agendas)
- Globe element is well-liked
- Information is more readable than existing website
- User-friendly display choices for results/findings

### Content Hierarchy Changes

- [ ] **Increase prominence of Flagship Report** - Make easily accessible from all pages
- [ ] **Elevate Top 10 Takeaways / Key Findings** - Move higher on page (currently at bottom)
- [ ] **Move "Three Categories of Responsible AI Indicators"** lower on the page
- [ ] **Consider moving "Five Dimensions of Responsible AI"** before the interactive map
  - Rationale: Users need to understand framework before exploring country performance

### Map Section ("Explore the Global Index Scores")

- [ ] **Add disclaimer about map boundaries** - Note explaining which map is used and why (acknowledge contentiousness of borders)
- [ ] **Add alternative navigation methods** for country insights (map disadvantages small countries)
- [ ] **Make globe clickable** - Clicking on scores should link to country pages

### Charts & Visualizations

- [ ] **"Responsible AI Across Regions"** - Add clear links to each region page
- [ ] **"Country-Level Comparison"** - Add direct links to country pages
- [ ] **"Country-Level Comparison"** - Make default selection randomly generated (similar to atlas display)
- [ ] **"Three Categories"** - Explore horizontal side-by-side layout to reduce scroll time

### Global Performance Overview

- [ ] **Remove "Bottom 10 Countries" display**
- [ ] **Replace with "Progress Stories"** - Countries that made significant leaps in responsible AI efforts
  - Focus on countries that scored low previously and progressed to "emerging" category

### New Sections to Add

- [ ] **Add "What makes GIRAI different" section** - Framed as question-response, accessible language
  - [ ] What perspectives it seeks to capture
  - [ ] Who can use it and how
  - [ ] What can be done with these insights
  - [ ] "What motivated us to do this" framing
- [ ] **Add slide-format basics** (similar to UNDP Human Development Index):
  - [ ] What the index measures
  - [ ] How scoring works
  - [ ] Visual alternative to text-heavy explanations
- [ ] **Add "Limitations" section** showing reflexivity:
  - [ ] Acknowledge what numbers can and cannot convey
  - [ ] Note that indexing can reproduce power dynamics
  - [ ] Explain how it can challenge power dynamics when complemented by nuanced insights
  - [ ] Critical framing of "responsible AI" (contested, contextual, political)
- [ ] **Add qualitative counterparts** to quantitative insights
  - [ ] Enable narration
  - [ ] Highlight thematic insights
  - [ ] Point towards tensions/contradictions
- [ ] **Link takeaways to recommendations** and bright spots
  - Example: "AI governance doesn't translate to responsible AI" → link to Netherlands work

### Content Updates Pending

- [ ] **"Why GIRAI Matters"** - Awaiting further content-level feedback

---

## 4. Dimension Page

**Reference:** Figma: `https://www.figma.com/proto/MlXc1IzWmYurwt2MeCxNJX/GIRAI?page-id=0%3A1&node-id=696-23180`

### Map Improvements

- [ ] **Address same map concerns** as homepage (boundaries, small countries)
- [ ] **Add alternative data visualization options** to complement map

### New Sections to Add

- [ ] **Add global aggregate statistics section**:
  - [ ] Number of frameworks identified (e.g., "25 frameworks identified")
  - [ ] Number of implementation activities (e.g., "55 implementation activities")
  - [ ] Number of civil society organizations working on responsible AI
- [ ] **Integrate evidence explorer** or similar tool on this page

---

## 5. Region Page

**Reference:** Figma: `https://www.figma.com/proto/MlXc1IzWmYurwt2MeCxNJX/GIRAI?page-id=0%3A1&node-id=712-25652`

### Layout Considerations

- [ ] **Review opening view** - Should page open with cross-region comparison?
- [ ] **Highlight/prioritize selected region** in comparison view

### Data Handling

- [ ] **Define regional patterns and trends** section
- [ ] **Address data comparability issue** - Scores from first edition not directly comparable
- [ ] **Document approach** for handling/displaying historical data

---

## 6. Country Page

**Reference:** Web: `https://girai--girai-global-index.europe-west4.hosted.app/country/CAN`

### Features to Add

- [ ] **Add evidence explorer** or similar functionality
- [ ] **Show score breakdown** - Which dimensions or indicator types explain the score:
  - [ ] Government frameworks contribution
  - [ ] Government actions contribution
  - [ ] Contextual indicators contribution
- [ ] **Add country-specific articles** section (if available)

### Content Development

- [ ] **Document narrative text development process** - How will these be created?
- [ ] **Create content workflow** for country pages

---

## 7. Methodology Page

**Reference:** Figma: `https://www.figma.com/proto/MlXc1IzWmYurwt2MeCxNJX/GIRAI?page-id=0%3A1&node-id=817-11115`

### Positives to Retain ✓

- Provides snapshot of core GIRAI research elements
- Download banner is appreciated
- Immersive research process presentation

### Structure Improvements

- [ ] **Add early "Download Full Methodology" CTA** - Currently takes too long to reach download option
- [ ] **Add methodology changes section** - Explain what changed since last edition and why:
  - [ ] New dimensions introduced
  - [ ] New pillars introduced
  - [ ] Other key methodology changes
- [ ] **Reduce scroll time** - Page is information-light but scroll-heavy

### Content to Add/Improve

- [ ] **Replicate definitions section** from old website (using carousels or dropdowns)
- [ ] **Add prominent data download option** - Currently less prominent than old website
- [ ] **Add multiple reminders** to download report and data throughout page
- [ ] **Explain indicators and weighing logic** in accessible, simple language:
  - [ ] How we arrived at decisions
  - [ ] Trade-offs that influence outcomes
  - [ ] Ensure non-experts can understand

### Research Process Section

- [ ] **Create infographic** for research and review process
  - [ ] Visualize effort (e.g., "150 researchers...")
  - [ ] Better convey the work behind GIRAI than current story format

### Comparability Section

- [ ] **Add comparability explanation** - What has changed in methodology and why

---

## 8. About Page

### Positives to Retain ✓

- "Shaping responsible intelligence" graphic is well-received

### Items to Review

- [ ] **Review and finalize About page content** (no specific issues raised)

---

## 9. Content & Messaging

### Accessibility & Language

- [ ] **Use simple, accessible language** throughout
- [ ] **Frame information as question-response** where appropriate
- [ ] **Ensure non-experts can understand** methodology and data

### Qualitative-Quantitative Balance

- [ ] **Pair quantitative insights with qualitative counterparts**
- [ ] **Enable narration** of data stories
- [ ] **Highlight tensions and contradictions** in findings

### Critical Framing

- [ ] **Add critical framing of "responsible AI"**:
  - [ ] Not neutral but contested
  - [ ] Very contextual
  - [ ] Highly political

---

## Pages NOT Needed

- [x] ~~Dataviz Challenge Page~~ - Confirmed not needed for development

---

## Priority Matrix

### High Priority (Core Functionality)

1. Header navigation structure
2. Globe bug fix (Research tab)
3. Evidence explorer design
4. Open data page
5. Score breakdown on country pages
6. Homepage content hierarchy

### Medium Priority (User Experience)

1. Map boundary disclaimer
2. Alternative country navigation
3. Regional comparison tools
4. Methodology improvements
5. News/updates page

### Lower Priority (Enhancements)

1. Stock image review
2. Comparison with other indexes
3. Temporal comparison tools
4. Infographics for methodology

---

## Next Steps

1. [ ] Review and prioritize items with development team
2. [ ] Create technical specifications for evidence explorer
3. [ ] Finalize content for "Why GIRAI Matters" section
4. [ ] Confirm tagline decision
5. [ ] Design review for map alternatives
6. [ ] Content development workflow for country pages

---

*Last Updated: [DATE]*  
*Document Owner: [OWNER]*
