import { searchBoamp } from "../lib/collectors/boamp.js";
import { searchTedExpert } from "../lib/collectors/ted.js";

async function main() {
  const boamp = await searchBoamp({ query: "intelligence artificielle", limit: 1 });
  console.log("BOAMP", { total: boamp.total, sample: boamp.items[0]?.title ?? null });

  const ted = await searchTedExpert({ expertQuery: "OJ = ()", limit: 1, scope: "ALL" });
  console.log("TED", {
    total: ted.total,
    sample: ted.items[0]?.title ?? null,
    responseKeys: ted.meta.responseKeys
  });

  if (!boamp.items.length) throw new Error("BOAMP smoke test returned no notice");
  if (!ted.items.length) throw new Error("TED smoke test returned no notice");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
