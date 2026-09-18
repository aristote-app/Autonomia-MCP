const TYPES = Object.freeze({
  hiring_ai: {
    label: "Hiring / People",
    patterns: [
      /\brecrut(e|ement|ons|e)\b.{0,50}\b(ia|ai|data|llm|machine learning)\b/i,
      /\bhiring\b.{0,50}\b(ai|data|llm|machine learning)\b/i,
      /\b(ia|ai|data|llm|machine learning)\b.{0,50}\b(poste|job|role|recrutement|hiring)\b/i
    ]
  },
  ai_transformation: {
    label: "Technology / Transformation",
    patterns: [
      /\b(d[eé]ploiement|deploy|rollout|transformation)\b.{0,60}\b(ia|ai|genai|llm|copilot|agent)\b/i,
      /\b(ia|ai|genai|llm|copilot|agent)\b.{0,60}\b(d[eé]ploiement|transformation|industrialisation)\b/i
    ]
  },
  ai_training_intent: {
    label: "Training / Upskilling",
    patterns: [
      /\b(formation|acculturation|sensibilisation|upskilling|reskilling)\b.{0,60}\b(ia|ai|chatgpt|copilot|genai)\b/i,
      /\b(ia|ai|chatgpt|copilot|genai)\b.{0,60}\b(formation|acculturation|sensibilisation)\b/i
    ]
  },
  ai_governance_compliance: {
    label: "Governance / Compliance",
    patterns: [
      /\b(ai act|gouvernance ia|gouvernance ai|responsible ai|ia responsable)\b/i,
      /\b(conformit[eé]|compliance|risque|risk)\b.{0,50}\b(ia|ai)\b/i
    ]
  },
  ai_product_launch: {
    label: "Product / Launch",
    patterns: [
      /\b(lance|lancement|launch|nouveau produit|new product)\b.{0,60}\b(ia|ai|genai|llm|agent)\b/i,
      /\b(ia|ai|genai|llm|agent)\b.{0,60}\b(lance|lancement|launch|produit|product)\b/i
    ]
  },
  ai_partnership: {
    label: "Partnership / Ecosystem",
    patterns: [
      /\b(partenariat|partnership|collaboration|alliance)\b.{0,70}\b(ia|ai|cloud|data|genai)\b/i
    ]
  },
  expansion_investment: {
    label: "Expansion / Investment",
    patterns: [
      /\b(investit|investissement|investment|expansion|ouvre|opening)\b.{0,80}\b(ia|ai|data|num[eé]rique|digital)\b/i
    ]
  }
});

export const PRIVATE_SIGNAL_TYPES = TYPES;

function clean(value) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return text || null;
}

function sourceId(record, index) {
  return clean(
    record.id ??
    record.sourceId ??
    record.externalId ??
    record.url ??
    record.sourceUrl
  ) || `row-${index + 1}`;
}

export function classifyPrivateDemandSignal(record) {
  const text = [
    record.title,
    record.description,
    record.text,
    record.body,
    record.summary
  ].filter(Boolean).join(" ");

  const matches = [];

  for (const [id, config] of Object.entries(TYPES)) {
    const evidence = config.patterns
      .filter((pattern) => pattern.test(text))
      .map((pattern) => pattern.source);

    if (evidence.length) {
      matches.push({
        signalType: id,
        label: config.label,
        evidence,
        classificationKind: "deterministic_inference"
      });
    }
  }

  return {
    matches,
    unclassified: matches.length === 0
  };
}

export function normalizePrivateDemandSignals({
  source = "manual",
  records = []
} = {}) {
  return records.flatMap((record, index) => {
    const classification = classifyPrivateDemandSignal(record);
    const organizationName = clean(
      record.organizationName ??
      record.companyName ??
      record.company ??
      record.organization
    );

    const base = {
      source,
      sourceRecordId: sourceId(record, index),
      sourceUrl: clean(record.url ?? record.sourceUrl),
      organization: {
        name: organizationName,
        siren: clean(record.siren),
        siret: clean(record.siret),
        website: clean(record.website)
      },
      title: clean(record.title) || "Signal privé IA",
      description: clean(
        record.description ??
        record.text ??
        record.body ??
        record.summary
      ),
      occurredAt: clean(
        record.occurredAt ??
        record.publishedAt ??
        record.date
      ),
      raw: record
    };

    if (!classification.matches.length) {
      return [{
        ...base,
        signalType: "unclassified_ai_signal",
        evidenceKind: "source_fact",
        confidence: null,
        classification: {
          classificationKind: "none",
          note: "Source text retained without an inferred signal category."
        }
      }];
    }

    return classification.matches.map((match) => ({
      ...base,
      signalType: match.signalType,
      evidenceKind: "inferred",
      confidence: 1,
      classification: match
    }));
  });
}
