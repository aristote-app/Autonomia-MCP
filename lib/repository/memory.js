import { canonicalKey, sourceFingerprint } from "../dedupe.js";

export class MemoryRepository {
  constructor() {
    this.items = new Map();
  }

  upsert(normalized) {
    const key = canonicalKey(normalized);
    const fingerprint = sourceFingerprint(normalized);
    const previous = this.items.get(key);

    const next = {
      ...previous,
      ...normalized,
      canonicalKey: key,
      fingerprint,
      firstSeenAt: previous?.firstSeenAt || new Date().toISOString(),
      lastSeenAt: new Date().toISOString()
    };

    this.items.set(key, next);

    return {
      action: previous ? "updated" : "created",
      item: next
    };
  }

  search({ type, query } = {}) {
    const q = String(query || "").toLowerCase();
    return [...this.items.values()].filter((item) => {
      if (type && item.opportunityType !== type) return false;
      if (q && !JSON.stringify(item).toLowerCase().includes(q)) return false;
      return true;
    });
  }
}
