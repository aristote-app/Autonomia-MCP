# Autonomia Content Factory — SEO / GEO operating model

## Objective

Build a durable organic acquisition library around two content families:

1. **Execution use cases** — 200 distinct scenarios showing what a company can realistically automate, augment or orchestrate with AI.
2. **Training use cases** — 200 distinct scenarios showing what an employee, team or function can learn to do with AI.

The content library is not a generic blog. It is a structured product surface that connects search intent to Autonomia Experts or Autonomia Academy.

## Brand promise for content

Every page must answer one of these questions:

- **Execution:** “Can AI really do this in my company, and what would the system look like?”
- **Training:** “Can my team learn to do this, and what should the training actually teach?”

The page must make the reader imagine the future state while staying technically credible.

## Search-demand rule

Never invent search volume.

A keyword can enter the roadmap through one or more of these evidence levels:

- "serp_observed": the query / concept is visibly represented in current search results.
- "search_console_observed": the site has impressions / clicks for the query or a close semantic variant.
- "keyword_planner_observed": Google Ads Keyword Planner data was reviewed.
- "seo_tool_observed": a connected SEO database supplied volume or difficulty data.
- "customer_language": wording appears in real inbound questions, sales calls, forms or support requests.
- "adjacent_demand": the exact phrase has weak evidence but belongs to a proven intent cluster.

For V2, live SERP observation can prioritize initial topics. Exact monthly volume must remain unknown unless a tool that exposes it has actually been queried.

## Topic selection

A page must have:
- one primary job-to-be-done;
- one primary intent;
- one canonical URL;
- one title that describes the useful outcome;
- one distinct workflow or learning objective;
- a clear relationship to Experts or Academy.

Do not create pages that differ only by:
- city;
- company size;
- synonym;
- one tool name where the workflow is otherwise identical;
- one job title where the substance is identical.

## Long-form quality gate

Published long-form pages must contain at least 2,000 words in the V2 program.

Word count is a floor, not a ranking tactic. A page also needs:
- at least six substantial sections;
- a concrete scenario;
- technical architecture or pedagogical architecture;
- failure cases / limitations;
- human-control decisions;
- a practical MVP or exercise;
- at least one verifiable source;
- useful FAQ;
- internal links to related concepts;
- a CTA consistent with the intent.

A CI check blocks pages that do not meet the mechanical minimums.

## Execution page template

Recommended structure:

1. **The story** — a vivid but explicitly hypothetical workday situation.
2. **The problem** — what manual coordination exists today.
3. **Architecture** — trigger → data → AI interpretation → rules → actions → audit.
4. **No-code / low-code implementation** — what a tool such as n8n, Make or Zapier would do.
5. **Role of AI** — where a model adds value and where deterministic logic is better.
6. **Human control** — approvals, reversibility and exception handling.
7. **Security / data** — permissions, minimization and ownership.
8. **MVP** — how to test on a small set before scaling.
9. **Extensions** — adjacent workflows, agents or knowledge systems.
10. **FAQ + sources + CTA**.

## Training page template

Recommended structure:

1. **Work situation** — what task the learner must improve.
2. **Target competency** — what they should be able to repeat alone.
3. **Hands-on workshop** — one real workflow or deliverable.
4. **Concepts learned** — not only button-clicking.
5. **Progression** — guided steps from simple to robust.
6. **Errors / debugging** — intentionally make the system fail.
7. **Data / governance** — permissions and safe usage.
8. **Assessment** — evaluate observable capability.
9. **Transfer** — how to apply the method to another business process.
10. **FAQ + sources + CTA**.

## GEO / LLM readability

Google’s public guidance for AI features states that standard SEO foundations still apply and that no special AI markup is required. Therefore pages should prioritize:
- clear headings that state the question being answered;
- direct summary paragraphs;
- visible textual explanations, not key information hidden only in visuals;
- crawlable internal links;
- explicit entities and tool names when materially relevant;
- sources and verification notes;
- author / publisher responsibility;
- concise definitions before deeper explanation;
- tables or structured steps when they genuinely improve comprehension.

Do not create machine-only text files or schema solely because they are marketed as a shortcut to AI visibility.

## Anti-scaled-content rule

Backlog size does not equal publication volume.

The repository may hold 400 topic concepts, but pages become indexable only after editorial completion and validation. Generation at scale is allowed only as a drafting aid; it is not a reason to publish.

Avoid:
- 400 pages created from one paragraph template;
- paraphrasing competitors;
- stuffing keyword variants;
- claiming fictitious ROI or time savings;
- invented case studies;
- invented client stories;
- invented tool capabilities;
- fake author expertise.

## Internal linking model

Execution article links to:
- its cluster hub;
- 2–5 adjacent use cases;
- relevant expert role pages;
- relevant training use case where useful.

Training article links to:
- its training cluster;
- prerequisite / advanced scenarios;
- relevant Academy landing page;
- the matching execution scenario when it helps learners understand why the skill matters.

This creates a semantic graph around jobs-to-be-done rather than a flat blog archive.

## Publishing cadence

Do not publish all 400 pages at once.

Recommended operational sequence:
1. establish 10–20 flagship pages across several clusters;
2. verify crawl / indexation / query impressions;
3. improve template and internal linking from real data;
4. expand winning clusters;
5. refresh pages when tools or platform capabilities change.

The exact cadence should respond to Search Console evidence and editorial capacity, not a fixed “freshness” target.

## Current V2 seed topics

The first validated execution story:
- Gmail → Google Drive → AI classification → structured routing → optional human validation.

The first training story:
- teach a non-developer team to build and debug the Gmail → AI → Drive workflow.

These two pages establish the depth standard for the remaining library.
