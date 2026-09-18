import { getLatestDecpResource } from "../lib/collectors/decp.js";
import { getMcfTrainingSources } from "../lib/collectors/monCompteFormation.js";
import { canonicalOpportunityKey } from "../lib/dedupe.js";

async function main() {
  const latest = await getLatestDecpResource({ format: "json" });
  console.log("DECP", latest);
  if (!latest.resource?.url) throw new Error("DECP latest JSON resource not resolved");

  const mcf = await getMcfTrainingSources({ format: "json" });
  console.log("MCF", {
    offer: mcf.datasets.offer?.resource?.url || null,
    engaged: mcf.datasets.engaged?.resource?.url || null,
    flows: mcf.datasets.flows?.resource?.url || null
  });

  for (const key of ["offer", "engaged", "flows"]) {
    if (!mcf.datasets[key]?.resource?.url) {
      throw new Error(`MCF ${key} JSON resource not resolved`);
    }
  }

  const a = canonicalOpportunityKey({
    source: "boamp",
    sourceId: "24-12345",
    title: "Mission IA",
    buyerName: "Ville Exemple"
  });
  const b = canonicalOpportunityKey({
    source: "boamp",
    sourceId: "24-12345",
    title: "Titre différent"
  });

  if (a.key !== b.key) throw new Error("Exact source ID deduplication is unstable");
  console.log("DEDUPE", a);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
