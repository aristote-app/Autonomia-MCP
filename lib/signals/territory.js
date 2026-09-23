export const TERRITORY_SIGNAL_QUERIES = Object.freeze([
  "intelligence artificielle",
  "IA générative",
  "Microsoft Copilot",
  "automatisation",
  "transformation numérique",
  "dématérialisation",
  "formation intelligence artificielle",
  "TPE PME numérique",
  "communauté de communes intelligence artificielle",
  "communauté d'agglomération intelligence artificielle",
  "collectivité intelligence artificielle",
  "agents territoriaux intelligence artificielle",
  "automatisation processus administratifs collectivité",
  "assistant usagers intelligence artificielle",
  "accompagnement TPE PME intelligence artificielle"
]);

const SIGNAL_RULES = Object.freeze([
  {
    id: "territory_ai_training",
    importance: 5,
    patterns: [
      /\b(formation|acculturation|sensibilisation|comp[eé]tences?)\b.{0,80}\b(ia|intelligence artificielle|chatgpt|copilot|genai)\b/i,
      /\b(ia|intelligence artificielle|chatgpt|copilot|genai)\b.{0,80}\b(formation|acculturation|sensibilisation|comp[eé]tences?)\b/i
    ]
  },
  {
    id: "territory_copilot_m365",
    importance: 5,
    patterns: [
      /\b(copilot|microsoft 365|m365)\b.{0,80}\b(ia|intelligence artificielle|d[eé]ploiement|formation|accompagnement)\b/i,
      /\b(ia|intelligence artificielle|d[eé]ploiement|formation|accompagnement)\b.{0,80}\b(copilot|microsoft 365|m365)\b/i
    ]
  },
  {
    id: "territory_sme_ai_program",
    importance: 4,
    patterns: [
      /\b(tpe|pme|entreprises?|commer[cç]ants?|artisans?)\b.{0,100}\b(ia|intelligence artificielle|num[eé]rique|digital|automatisation)\b/i,
      /\b(ia|intelligence artificielle|num[eé]rique|digital|automatisation)\b.{0,100}\b(tpe|pme|entreprises?|commer[cç]ants?|artisans?)\b/i
    ]
  },
  {
    id: "territory_ai_project",
    importance: 5,
    patterns: [
      /\b(intelligence artificielle|ia g[eé]n[eé]rative|genai|agent(?:s)? ia|llm)\b/i
    ]
  },
  {
    id: "territory_automation",
    importance: 4,
    patterns: [
      /\b(automatisation|automatiser|workflow|robotisation)\b/i
    ]
  },
  {
    id: "territory_digital_transformation",
    importance: 3,
    patterns: [
      /\b(transformation num[eé]rique|transformation digitale|plan num[eé]rique|modernisation num[eé]rique|d[eé]mat[eé]rialisation)\b/i
    ]
  }
]);

function clean(value) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return text || null;
}

export function classifyTerritoryMarketSignal(item = {}) {
  const text = [
    item.title,
    item.procedure,
    item.contractType,
    item.raw?.objet,
    item.raw?.description,
    item.raw?.nomacheteur
  ].filter(Boolean).join(" ");

  for (const rule of SIGNAL_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(text))) {
      return {
        signalType: rule.id,
        importance: rule.importance,
        classificationKind: "deterministic_keyword",
        matchedText: clean(text)
      };
    }
  }

  return null;
}

export function normalizeTerritoryMarketSignal(
  item,
  territory,
  query,
  { matchKind = "siren" } = {}
) {
  const classification = classifyTerritoryMarketSignal(item);
  if (!classification || !territory?.id) return null;

  const resolvedBuyerSiren = clean(item?.buyerSiren) || clean(territory?.siren);

  return {
    territoryId: territory.id,
    signalType: classification.signalType,
    signalSource: item.source || "boamp",
    title: clean(item.title) || "Signal marché public territorial",
    evidenceUrl: clean(item.sourceUrl),
    detectedAt: clean(item.publishedAt) || new Date().toISOString(),
    importance: classification.importance,
    payload: {
      source_record_id: clean(item.sourceId),
      query: clean(query),
      buyer_name: clean(item.buyerName),
      buyer_siren: resolvedBuyerSiren,
      territory_match_kind: matchKind,
      procedure: clean(item.procedure),
      contract_type: clean(item.contractType),
      classification_kind: classification.classificationKind
    }
  };
}
