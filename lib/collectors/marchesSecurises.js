import * as cheerio from "cheerio";
import { fetchText } from "./http.js";
import { assertRobotsAllowed } from "./robots.js";

const ORIGIN = "https://www.marches-securises.fr";

function clean(value) {
  const text = String(value || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  return text || null;
}

function parseFrenchDate(value) {
  const months = {
    janvier: 1, février: 2, fevrier: 2, mars: 3, avril: 4, mai: 5, juin: 6,
    juillet: 7, août: 8, aout: 8, septembre: 9, octobre: 10, novembre: 11, décembre: 12, decembre: 12
  };

  const m = String(value || "").toLowerCase().match(
    /(\d{1,2})\s+(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)\s+(\d{4})(?:\s*-\s*(\d{1,2}):(\d{2}))?/
  );
  if (!m) return null;

  const day = Number(m[1]);
  const month = months[m[2]];
  const year = Number(m[3]);
  const hour = Number(m[4] || 0);
  const minute = Number(m[5] || 0);

  return new Date(Date.UTC(year, month - 1, day, hour, minute)).toISOString();
}

function extractReference(text) {
  return clean(
    String(text || "").match(
      /Référence(?!\s+interne)\s*(?:\|)?\s*([^|]+?)(?=Type de marché|Référence interne|Procédure|Zone\(s\)|Date de publication|$)/i
    )?.[1]
  );
}

function splitListings(text) {
  const markers = [...String(text || "").matchAll(/Référence(?!\s+interne)\s*(?:\|)?/gi)];
  if (!markers.length) return [];

  const chunks = [];
  let start = 0;
  for (let i = 0; i < markers.length; i++) {
    const markerIndex = markers[i].index;
    const next = markers[i + 1]?.index ?? text.length;

    let blockStart = text.lastIndexOf("\n", Math.max(0, markerIndex - 500));
    if (blockStart < start) blockStart = start;
    chunks.push(text.slice(blockStart, next));
    start = next;
  }
  return chunks;
}

function parseChunk(chunk) {
  const text = clean(chunk);
  if (!text) return null;

  const ref = extractReference(text);
  const publicationLabel = text.match(/Date de publication sur le serveur\s*\|?\s*([^|]+?)(?=Date de clôture|Télécharger|Accéder|$)/i)?.[1];
  const deadlineLabel = text.match(/Date de clôture\s*\|?\s*([^|]+?)(?=Télécharger|Accéder|Questions|Répondre|$)/i)?.[1];
  const procedure = clean(
    text.match(/Procédure(?:\s*\/\s*Nombre de lots)?\s*\|?\s*([^|]+?)(?=Zone\(s\)|Date de publication|$)/i)?.[1]
  );
  const zone = clean(
    text.match(/Zone\(s\) géo\. de la prestation\s*\|?\s*([^|]+?)(?=Date de publication|$)/i)?.[1]
  );
  const internal = clean(
    text.match(/Référence interne\s*\|?\s*([^|]+?)(?=Procédure|Zone\(s\)|Date de publication|$)/i)?.[1]
  );

  const beforeRef = text.split(/Référence(?!\s+interne)\s*(?:\|)?/i)[0] || "";
  const lines = beforeRef.split(/\s{2,}|\n/).map(clean).filter(Boolean);
  const buyerName = lines[0] || null;
  const title = lines.slice(1).join(" ") || null;

  if (!ref && !title) return null;

  return {
    source: "marches_securises",
    sourceId: ref || internal || title,
    sourceUrl: null,
    opportunityType: "public_ai",
    title,
    buyerName,
    publishedAt: parseFrenchDate(publicationLabel),
    publishedLabel: clean(publicationLabel),
    deadlineAt: parseFrenchDate(deadlineLabel),
    deadlineLabel: clean(deadlineLabel),
    procedure,
    location: zone,
    contractReference: internal || ref,
    raw: {
      extraction: "public_search_html",
      text
    }
  };
}

export function parseMarchesSecurisesHtml(html) {
  const $ = cheerio.load(html);
  const bodyText = $("body").text().replace(/\r/g, "");
  const chunks = splitListings(bodyText);

  const items = [];
  const seen = new Set();

  for (const chunk of chunks) {
    const item = parseChunk(chunk);
    if (!item?.sourceId || seen.has(item.sourceId)) continue;
    seen.add(item.sourceId);
    items.push(item);
  }

  return items;
}

export async function searchMarchesSecurises({
  query = "intelligence artificielle",
  page = 1,
  limit = 50
} = {}) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);

  const url = new URL("/entreprise/", ORIGIN);
  url.searchParams.set("module", "liste_consultations");
  url.searchParams.set("r", query);
  url.searchParams.set("page", String(safePage));
  url.searchParams.set("date_cloture", "");
  url.searchParams.set("date_cloture_type", "");
  url.searchParams.set("liste_dept", "");
  url.searchParams.set("mps", "");
  url.searchParams.set("pa", "");
  url.searchParams.set("presta", "");
  url.searchParams.set("type_marche", "");

  const robots = await assertRobotsAllowed(url.toString());
  const response = await fetchText(url.toString(), { timeoutMs: 20000 });
  const items = parseMarchesSecurisesHtml(response.text).slice(0, safeLimit);

  return {
    source: "marches_securises",
    query,
    page: safePage,
    sourceUrl: response.finalUrl,
    fetchedAt: new Date().toISOString(),
    robots,
    count: items.length,
    items
  };
}
