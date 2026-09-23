import { fetchJson } from "./http.js";

const CACHE_SYMBOL = Symbol.for("autonomia.brave.search.cache");

function store() {
  if (!globalThis[CACHE_SYMBOL]) globalThis[CACHE_SYMBOL] = new Map();
  return globalThis[CACHE_SYMBOL];
}

function positiveMs(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function fetchBraveCached(
  url,
  {
    apiKey,
    ttlMs = positiveMs(process.env.AUTONOMIA_BRAVE_CACHE_TTL_MS, 6 * 60 * 60 * 1000)
  } = {}
) {
  if (!apiKey) throw new Error("BRAVE_SEARCH_API_KEY is not configured");

  const key = String(url);
  const cache = store();
  const now = Date.now();
  const existing = cache.get(key);

  if (existing && existing.expiresAt > now) {
    return {
      payload: existing.payload,
      cache_hit: true,
      cached_at: existing.cachedAt
    };
  }

  const payload = await fetchJson(key, {
    headers: { "x-subscription-token": apiKey }
  });

  cache.set(key, {
    payload,
    cachedAt: new Date(now).toISOString(),
    expiresAt: now + ttlMs
  });

  if (cache.size > 500) {
    for (const [entryKey, entry] of cache) {
      if (entry.expiresAt <= now) cache.delete(entryKey);
    }
  }

  return {
    payload,
    cache_hit: false,
    cached_at: null
  };
}

export function clearBraveCacheForTests() {
  store().clear();
}
