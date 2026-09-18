import { searchBoamp } from "../collectors/boamp.js";
import { searchTed } from "../collectors/ted.js";

export async function refreshPublicMarket({ query = "intelligence artificielle", limit = 20 }) {
  const [boamp, ted] = await Promise.allSettled([
    searchBoamp({ query, limit }),
    searchTed({ query, limit })
  ]);
  return {
    query,
    sources: {
      boamp: boamp.status === "fulfilled" ? { ok: true, ...boamp.value } : { ok: false, error: boamp.reason?.message || String(boamp.reason) },
      ted: ted.status === "fulfilled" ? { ok: true, ...ted.value } : { ok: false, error: ted.reason?.message || String(ted.reason) }
    },
    refreshedAt: new Date().toISOString()
  };
}
