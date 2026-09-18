import * as cheerio from "cheerio";
import { fetchText } from "./http.js";
import { assertRobotsAllowed } from "./robots.js";

const ORIGIN = "https://www.free-work.com";
const CATEGORIES = new Set(["ia", "ia-generative", "machine-learning", "data-science", "copilot"]);

function clean(value) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text || null;
}

function parseVisibleDate(text) {
  const match = String(text || "").match(/\b(\d{2})\/(\d{2})\/(\d{4})\b/);
  if (!match) return { iso: null, label: null };

  const a = Number(match[1]);
  const b = Number(match[2]);
  const year = Number(match[3]);

  let month = null;
  let day = null;
  if (a <= 12 && b > 12) {
    month = a;
    day = b;
  } else if (a > 12 && b <= 12) {
    day = a;
    month = b;
  }

  if (!month || !day) return { iso: null, label: match[0] };

  const date = new Date(Date.UTC(year, month - 1, day));
  return { iso: date.toISOString(), label: match[0] };
}

function parseTjm(text) {
  const value = String(text || "").replace(/\u00a0/g, " ");
  const match = value.match(/TJM\s*([\d\s]+)(?:\s*[-–]\s*([\d\s]+))?\s*€\s*(?:\/|⁄)?\s*j/i);
  if (!match) return { min: null, max: null, label: null };

  const min = Number(match[1].replace(/\s/g, ""));
  const max = Number((match[2] || match[1]).replace(/\s/g, ""));

  return {
    min: Number.isFinite(min) ? min : null,
    max: Number.isFinite(max) ? max : null,
    label: clean(match[0])
  };
}

function labeled(text, label, nextLabels) {
  const start = String(text || "").toLowerCase().indexOf(label.toLowerCase());
  if (start < 0) return null;

  const after = String(text).slice(start + label.length);
  let end = after.length;

  for (const next of nextLabels) {
    const idx = after.toLowerCase().indexOf(next.toLowerCase());
    if (idx >= 0 && idx < end) end = idx;
  }

  return clean(after.slice(0, end));
}

function containerFor($, link) {
  const candidates = [
    $(link).closest("article"),
    $(link).closest("li"),
    $(link).closest('[class*="job"]'),
    $(link).closest('[class*="offer"]'),
    $(link).parent().parent()
  ];

  for (const candidate of candidates) {
    if (candidate.length && (clean(candidate.text())?.length || 0) > 40) return candidate;
  }
  return $(link).parent();
}

export function parseFreeWorkHtml(html, pageUrl) {
  const $ = cheerio.load(html);
  const found = new Map();

  $('a[href*="/fr/tech-it/job-mission/"]').each((_, link) => {
    const href = $(link).attr("href");
    if (!href) return;

    const sourceUrl = new URL(href, pageUrl).toString();
    if (found.has(sourceUrl)) return;

    const container = containerFor($, link);
    const text = clean(container.text()) || "";
    const title =
      clean(container.find("h1,h2,h3,h4").first().text()) ||
      clean($(link).text());

    if (!title) return;

    const tjm = parseTjm(text);
    const date = parseVisibleDate(text);
    const description = container
      .find("p")
      .map((__, el) => clean($(el).text()))
      .get()
      .filter(Boolean)
      .sort((a, b) => b.length - a.length)[0] || null;

    found.set(sourceUrl, {
      source: "freework",
      sourceId: new URL(sourceUrl).pathname,
      sourceUrl,
      opportunityType: "freelance_ai",
      title,
      description,
      companyName: null,
      publishedAt: date.iso,
      publishedLabel: date.label,
      duration: labeled(text, "Durée", ["TJM", "Télétravail", "Lieu", "Salaire", "Démarrage"]),
      location: labeled(text, "Lieu", ["TJM", "Télétravail", "Salaire", "Durée", "Démarrage"]),
      remoteMode: labeled(text, "Télétravail", ["Lieu", "TJM", "Salaire", "Durée", "Démarrage"]),
      contractType: /\bfreelance\b/i.test(text) ? "Freelance" : null,
      tjmMin: tjm.min,
      tjmMax: tjm.max,
      tjmLabel: tjm.label,
      raw: {
        extraction: "public_listing_html",
        text
      }
    });
  });

  return [...found.values()];
}

export async function searchFreeWork({ category = "ia", page = 1, limit = 50 } = {}) {
  if (!CATEGORIES.has(category)) {
    throw new Error(`Unsupported Free-Work category: ${category}`);
  }

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);

  const url = new URL(`${ORIGIN}/fr/tech-it/jobs/${category}`);
  url.searchParams.set("page", String(safePage));

  const robots = await assertRobotsAllowed(url.toString());
  const response = await fetchText(url.toString(), { timeoutMs: 20000 });
  const items = parseFreeWorkHtml(response.text, response.finalUrl).slice(0, safeLimit);

  return {
    source: "freework",
    category,
    page: safePage,
    fetchedAt: new Date().toISOString(),
    sourceUrl: response.finalUrl,
    robots,
    count: items.length,
    items
  };
}
