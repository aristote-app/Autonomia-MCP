import { searchBoamp } from "../lib/collectors/boamp.js";
import { searchTed } from "../lib/collectors/ted.js";

async function main() {
  const boamp = await searchBoamp({ query: "intelligence artificielle", limit: 1 });
  console.log("BOAMP", { total: boamp.total, sample: boamp.items[0]?.title ?? null });

  const ted = await searchTed({ query: "artificial intelligence", limit: 1 });
  console.log("TED", { total: ted.total, sample: ted.items[0]?.title ?? null });

  if (!Array.isArray(boamp.items) || !Array.isArray(ted.items)) {
    throw new Error("Collector response shape invalid");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
