import { createHash } from "node:crypto";

function clean(value) {
  if (value == null) return "";
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function day(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return clean(value);
  return date.toISOString().slice(0, 10);
}

function digest(parts) {
  return createHash("sha256").update(parts.join("|")).digest("hex");
}

export function canonicalOpportunityKey(item) {
  const exactId = clean(item.sourceId);
  const source = clean(item.source);

  if (source && exactId) {
    return {
      key: digest(["exact", source, exactId]),
      method: "exact_source_id",
      confidence: 1
    };
  }

  const actor = clean(item.buyerName || item.companyName);
  const title = clean(item.title);
  const published = day(item.publishedAt || item.detectedAt);

  if (actor && title) {
    return {
      key: digest(["semantic", actor, title, published]),
      method: "normalized_actor_title_date",
      confidence: published ? 0.94 : 0.86
    };
  }

  return {
    key: digest(["fallback", source, title, actor, published, clean(item.sourceUrl)]),
    method: "fallback_fingerprint",
    confidence: 0.65
  };
}

export function groupExactDuplicates(items) {
  const groups = new Map();

  for (const item of items) {
    const fingerprint = canonicalOpportunityKey(item);
    const bucket = groups.get(fingerprint.key) || {
      fingerprint,
      items: []
    };
    bucket.items.push(item);
    groups.set(fingerprint.key, bucket);
  }

  return [...groups.values()];
}
