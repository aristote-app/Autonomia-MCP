import * as cheerio from "cheerio";
import { fetchText } from "./http.js";
import { assertRobotsAllowed } from "./robots.js";

const URL = "https://www.lehibou.com/freelance/data-intelligence-artificielle";

function compact(value) {
  return String(value || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function numberFrom(text) {
  const value = String(text || "").replace(/\s/g, "");
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function matchNumber(text, pattern) {
  const match = text.match(pattern);
  return match ? numberFrom(match[1]) : null;
}

export function parseLeHibouMarketHtml(html) {
  const $ = cheerio.load(html);
  const text = compact($("body").text());

  const activeMissions = matchNumber(
    text,
    /(\d[\d\s]*)\+?\s*missions actives/i
  );
  const averageDurationMonths = matchNumber(
    text,
    /(\d+)\s*mois\s+dur[eé]e moyenne/i
  );
  const registeredFreelancers = matchNumber(
    text,
    /(\d[\d\s]*)\+?\s*freelances inscrits/i
  );
  const partnerCompanies = matchNumber(
    text,
    /(\d[\d\s]*)\+?\s*entreprises partenaires/i
  );

  const tjmMatch = text.match(
    /TJM[^.]{0,80}?varient? de\s*([\d\s]+)\s*€?\s*[àa]\s*([\d\s]+)\s*€/i
  );

  return {
    source: "lehibou",
    segment: "data_intelligence_artificielle",
    metrics: {
      activeMissions,
      averageDurationMonths,
      registeredFreelancers,
      partnerCompanies,
      tjmMinClaim: tjmMatch ? numberFrom(tjmMatch[1]) : null,
      tjmMaxClaim: tjmMatch ? numberFrom(tjmMatch[2]) : null
    },
    evidenceKind: "publisher_claim",
    note:
      "These are figures stated on LeHibou's public Data & IA page. They are publisher claims, not independently verified market totals."
  };
}

export async function getLeHibouMarketSignal() {
  const robots = await assertRobotsAllowed(URL);
  const response = await fetchText(URL, { timeoutMs: 20000 });
  return {
    ...parseLeHibouMarketHtml(response.text),
    sourceUrl: response.finalUrl,
    fetchedAt: new Date().toISOString(),
    robots
  };
}
