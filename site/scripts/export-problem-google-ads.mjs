import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { problemSolutions } from "../content/problem-solutions.js";
import { problemPaidSearch } from "../content/problem-paid-search.js";
import { problemPaidCreatives } from "../content/problem-paid-creatives.js";

const here = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(here, "../generated/google-ads");
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://build-autonomia.com";
const campaign = process.env.AUTONOMIA_GOOGLE_ADS_CAMPAIGN || "Autonomia | Search | Solutions IA";

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"','""')}"` : text;
}

function csv(headers, rows) {
  return [
    headers.join(","),
    ...rows.map((row)=>headers.map((header)=>csvEscape(row[header])).join(","))
  ].join("\n") + "\n";
}

const priorityOne = problemSolutions.filter((item)=>item.wave === 1);
const rsaRows = [];
const keywordRows = [];
const negativeRows = [];

for (const problem of priorityOne) {
  const search = problemPaidSearch[problem.slug];
  const creative = problemPaidCreatives[problem.slug];
  if (!search || !creative) {
    throw new Error(`Missing paid-search data for ${problem.slug}`);
  }

  const adGroup = `${problem.cluster} | ${problem.title}`;
  const finalUrl = `${baseUrl}/solutions-ia/${problem.slug}`;

  rsaRows.push({
    Campaign: campaign,
    "Campaign type": "Search",
    "Ad group": adGroup,
    "Ad type": "Responsive search ad",
    "Final URL": finalUrl,
    "Path 1": creative.path1,
    "Path 2": creative.path2,
    "Headline 1": creative.headlines[0],
    "Headline 2": creative.headlines[1],
    "Headline 3": creative.headlines[2],
    "Headline 4": creative.headlines[3],
    "Headline 5": creative.headlines[4],
    "Headline 6": creative.headlines[5],
    "Description 1": creative.descriptions[0],
    "Description 2": creative.descriptions[1]
  });

  for (const keyword of [search.primaryKeyword, ...search.secondaryKeywords]) {
    for (const matchType of ["Phrase", "Exact"]) {
      keywordRows.push({
        Campaign: campaign,
        "Campaign type": "Search",
        "Ad group": adGroup,
        Keyword: keyword,
        "Match type": matchType,
        "Final URL": finalUrl
      });
    }
  }

  for (const keyword of search.negativeKeywords) {
    negativeRows.push({
      Campaign: campaign,
      "Campaign type": "Search",
      "Ad group": adGroup,
      Keyword: keyword,
      "Match type": "Negative broad"
    });
  }
}

mkdirSync(outputDir, { recursive: true });

writeFileSync(
  resolve(outputDir, "priority-1-responsive-search-ads.csv"),
  csv(
    [
      "Campaign","Campaign type","Ad group","Ad type","Final URL","Path 1","Path 2",
      "Headline 1","Headline 2","Headline 3","Headline 4","Headline 5","Headline 6",
      "Description 1","Description 2"
    ],
    rsaRows
  ),
  "utf8"
);

writeFileSync(
  resolve(outputDir, "priority-1-keywords.csv"),
  csv(["Campaign","Campaign type","Ad group","Keyword","Match type","Final URL"], keywordRows),
  "utf8"
);

writeFileSync(
  resolve(outputDir, "priority-1-negative-keywords.csv"),
  csv(["Campaign","Campaign type","Ad group","Keyword","Match type"], negativeRows),
  "utf8"
);

console.log(
  `Google Ads Priority 1 pack generated: ${rsaRows.length} ads, ${keywordRows.length} keyword rows, ${negativeRows.length} negative keyword rows in ${outputDir}`
);
