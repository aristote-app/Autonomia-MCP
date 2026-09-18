import { canonicalOpportunityKey } from "../dedupe.js";

const SUPPORTED = new Set(["linkedin", "datasales", "indeed", "malt", "manual"]);

function first(record, keys) {
  for (const key of keys) {
    const value = record?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return null;
}

function numeric(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const normalized = String(value)
    .replace(/\s/g, "")
    .replace(",", ".")
    .replace(/[^0-9.-]/g, "");
  const result = Number(normalized);
  return Number.isFinite(result) ? result : null;
}

function stringArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(/[,;|]/).map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export function normalizeAuthorizedImportRecord(source, record) {
  if (!SUPPORTED.has(source)) {
    throw new Error(`Unsupported authorized import source: ${source}`);
  }

  const item = {
    source,
    sourceId: first(record, ["id", "job_id", "mission_id", "external_id", "urn"]),
    sourceUrl: first(record, ["url", "job_url", "mission_url", "link", "linkedin_url"]),
    opportunityType: "freelance_ai",
    title: first(record, ["title", "job_title", "mission_title", "poste", "role"]),
    companyName: first(record, ["company", "company_name", "client", "client_name", "organization"]),
    description: first(record, ["description", "job_description", "mission_description", "text", "content"]),
    location: first(record, ["location", "city", "lieu", "workplace"]),
    remoteMode: first(record, ["remote", "remote_mode", "teletravail", "work_mode"]),
    publishedAt: first(record, ["published_at", "publication_date", "date", "posted_at", "created_at"]),
    tjmMin: numeric(first(record, ["tjm_min", "day_rate_min", "rate_min"])),
    tjmMax: numeric(first(record, ["tjm_max", "day_rate_max", "rate_max"])),
    duration: first(record, ["duration", "duree", "mission_duration"]),
    contractType: first(record, ["contract_type", "contract", "type_contrat"]),
    skills: stringArray(first(record, ["skills", "competences", "keywords", "tags"])),
    importMetadata: {
      importedAt: new Date().toISOString(),
      authorizedImport: true
    },
    raw: record
  };

  const fingerprint = canonicalOpportunityKey(item);

  return {
    ...item,
    dedupe: fingerprint
  };
}

export function normalizeAuthorizedImport({ source, records }) {
  if (!Array.isArray(records)) throw new Error("records must be an array");
  if (records.length > 1000) throw new Error("Maximum 1000 records per normalization call");

  const items = records.map((record) => normalizeAuthorizedImportRecord(source, record));
  const completeness = items.map((item) => {
    const fields = ["title", "companyName", "description", "sourceUrl", "publishedAt"];
    const present = fields.filter((field) => Boolean(item[field])).length;
    return Math.round((present / fields.length) * 100);
  });

  return {
    source,
    count: items.length,
    normalizedAt: new Date().toISOString(),
    persisted: false,
    averageCompleteness: completeness.length
      ? Math.round(completeness.reduce((a, b) => a + b, 0) / completeness.length)
      : 0,
    items
  };
}

export { SUPPORTED as AUTHORIZED_IMPORT_SOURCES };
