import assert from "node:assert/strict";
import { searchBoamp } from "../lib/collectors/boamp.js";
import { searchTedExpert } from "../lib/collectors/ted.js";
import { normalizeTed } from "../lib/collectors/normalize.js";

const tedDateFixture = normalizeTed({
  "publication-number": "1-2026",
  "publication-date": "2026-04-01+02:00",
  "notice-title": { fra: "Marché IA de test" },
  "buyer-name": { fra: ["Acheteur test"] }
});

assert.equal(
  tedDateFixture.publishedAt,
  "2026-04-01T00:00:00Z",
  "TED date-with-offset values must preserve the published calendar day"
);

async function main() {
  const boamp = await searchBoamp({ query: "intelligence artificielle", limit: 1 });
  console.log("BOAMP", { total: boamp.total, sample: boamp.items[0]?.title ?? null });

  let ted = null;
  try {
    ted = await searchTedExpert({ expertQuery: "ND = 291298-2024", limit: 1, scope: "ALL" });
    console.log("TED", {
      total: ted.total,
      sample: ted.items[0]?.title ?? null,
      publishedAt: ted.items[0]?.publishedAt ?? null,
      responseKeys: ted.meta.responseKeys
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/HTTP (429|502|503|504)\b/.test(message)) {
      console.warn("TED live smoke temporarily unavailable:", message.split("\n")[0]);
    } else {
      throw error;
    }
  }

  if (!boamp.items.length) throw new Error("BOAMP smoke test returned no notice");
  if (ted && !ted.items.length) throw new Error("TED smoke test returned no notice");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
