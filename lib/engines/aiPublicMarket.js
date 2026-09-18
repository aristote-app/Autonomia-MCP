import { searchBoamp } from "../collectors/boamp.js";
import { searchTed } from "../collectors/ted.js";
import { topicQueryPlan, classifyAiText } from "../taxonomy/ai.js";

function itemKey(item) {
  if (item.source && item.sourceId) return `${item.source}:${item.sourceId}`;
  return `${item.source || "unknown"}:${item.sourceUrl || item.title || JSON.stringify(item)}`;
}

export async function searchAiPublicMarket({
  topic = "all",
  query,
  sources = ["boamp", "ted"],
  limitPerQuery = 5
}) {
  const queries = topicQueryPlan(topic, query);
  const safeLimit = Math.min(Math.max(Number(limitPerQuery) || 5, 1), 20);
  const collected = [];
  const errors = [];

  for (const term of queries) {
    const tasks = [];
    if (sources.includes("boamp")) tasks.push(searchBoamp({ query: term, limit: safeLimit }));
    if (sources.includes("ted")) tasks.push(searchTed({ query: term, limit: safeLimit, scope: "ACTIVE" }));

    const results = await Promise.allSettled(tasks);

    for (const result of results) {
      if (result.status === "rejected") {
        errors.push({
          query: term,
          error: result.reason instanceof Error ? result.reason.message : String(result.reason)
        });
        continue;
      }

      for (const item of result.value.items || []) {
        const combinedText = [item.title, item.description, item.buyerName, item.procedure]
          .filter(Boolean)
          .join(" ");
        collected.push({
          ...item,
          matchedQuery: term,
          aiClassification: classifyAiText(combinedText)
        });
      }
    }
  }

  const unique = new Map();
  for (const item of collected) {
    const key = itemKey(item);
    const existing = unique.get(key);
    if (!existing) {
      unique.set(key, { ...item, matchedQueries: [item.matchedQuery] });
      continue;
    }
    existing.matchedQueries = [...new Set([...existing.matchedQueries, item.matchedQuery])];
    existing.aiClassification = {
      isAiRelated: existing.aiClassification.isAiRelated || item.aiClassification.isAiRelated,
      tags: [...new Set([...existing.aiClassification.tags, ...item.aiClassification.tags])]
    };
  }

  return {
    topic,
    customQuery: query || null,
    queryPlan: queries,
    refreshedAt: new Date().toISOString(),
    persisted: false,
    rawMatches: collected.length,
    uniqueMatches: unique.size,
    items: [...unique.values()],
    errors
  };
}
