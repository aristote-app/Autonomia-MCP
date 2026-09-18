import { searchAiPublicMarket } from "../engines/aiPublicMarket.js";

export const OPCOS = Object.freeze([
  {
    id: "atlas",
    name: "Opco Atlas",
    aliases: ["opco atlas", "atlas"],
    officialCallsUrl: "https://www.opco-atlas.fr/appels-d-offres/",
    directPageVerified: true
  },
  {
    id: "akto",
    name: "AKTO",
    aliases: ["akto"],
    officialCallsUrl: "https://www.akto.fr/appels-d-offres/",
    directPageVerified: true
  },
  {
    id: "opco2i",
    name: "OPCO 2i",
    aliases: ["opco 2i", "opco2i"],
    officialCallsUrl: "https://www.opco2i.fr/marches-publics/",
    directPageVerified: true
  },
  {
    id: "opcommerce",
    name: "L'Opcommerce",
    aliases: ["l'opcommerce", "opcommerce"],
    officialCallsUrl: "https://www.lopcommerce.com/prestataire-de-formation/marches-publics/consulter-nos-appels-doffres/",
    directPageVerified: true
  },
  {
    id: "ocapiat",
    name: "OCAPIAT",
    aliases: ["ocapiat"],
    officialCallsUrl: "https://www.ocapiat.fr/procedures-de-marches-publics-ami/",
    directPageVerified: true
  },
  {
    id: "afdas",
    name: "Afdas",
    aliases: ["afdas"],
    officialCallsUrl: "https://www.afdas.com/lafdas/nos-appels-doffres.html",
    directPageVerified: true
  },
  {
    id: "opco_sante",
    name: "OPCO Santé",
    aliases: ["opco santé", "opco sante"],
    officialCallsUrl: "https://www.opco-sante.fr/prestataire/demarche-d-habilitation/",
    directPageVerified: true
  },
  {
    id: "constructys",
    name: "Constructys",
    aliases: ["constructys"],
    officialCallsUrl: null,
    directPageVerified: false
  },
  {
    id: "uniformation",
    name: "Uniformation",
    aliases: ["uniformation"],
    officialCallsUrl: null,
    directPageVerified: false
  },
  {
    id: "opco_ep",
    name: "OPCO EP",
    aliases: ["opco ep", "opérateur de compétences des entreprises de proximité", "operateur de competences des entreprises de proximite"],
    officialCallsUrl: null,
    directPageVerified: false
  },
  {
    id: "opco_mobilites",
    name: "OPCO Mobilités",
    aliases: ["opco mobilités", "opco mobilites", "opcomobilités", "opcomobilites"],
    officialCallsUrl: null,
    directPageVerified: false
  }
]);

function norm(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function matchOpco(item, selectedIds) {
  const selected = selectedIds?.length
    ? OPCOS.filter((opco) => selectedIds.includes(opco.id))
    : [...OPCOS];

  const haystack = norm(
    [
      item?.buyerName,
      item?.title,
      item?.description,
      item?.raw?.nomacheteur,
      item?.raw?.["buyer-name"]
    ]
      .flat()
      .filter(Boolean)
      .join(" ")
  );

  const matches = selected.filter((opco) =>
    opco.aliases.some((alias) => haystack.includes(norm(alias)))
  );

  return matches;
}

export async function searchOpcoAiTrainingMarket({
  query,
  opcos,
  sources = ["boamp", "ted"],
  limitPerQuery = 20
} = {}) {
  const selected = opcos?.length
    ? OPCOS.filter((opco) => opcos.includes(opco.id))
    : [...OPCOS];

  const market = await searchAiPublicMarket({
    topic: "training",
    query,
    sources,
    limitPerQuery
  });

  const items = [];
  for (const item of market.items || []) {
    const matches = matchOpco(item, selected.map((opco) => opco.id));
    if (!matches.length) continue;

    items.push({
      ...item,
      opportunityType: "training_ai",
      matchedOpcos: matches.map((opco) => ({
        id: opco.id,
        name: opco.name
      }))
    });
  }

  return {
    query: query || null,
    refreshedAt: market.refreshedAt,
    selectedOpcos: selected.map((opco) => ({
      id: opco.id,
      name: opco.name,
      officialCallsUrl: opco.officialCallsUrl,
      directPageVerified: opco.directPageVerified
    })),
    sourceQueryPlan: market.queryPlan,
    rawAiTrainingMatches: market.uniqueMatches,
    opcoMatches: items.length,
    items,
    errors: market.errors,
    coverageNote:
      "Live opportunity matches come from BOAMP/TED AI-training searches filtered by OPCO buyer aliases. Official OPCO pages are listed as complementary sources; not every page has a direct parser yet."
  };
}
