import { classifyAiText } from "../taxonomy/ai.js";
import { scoreAutonomiaFit } from "../scoring/autonomia.js";

function numeric(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function economicValue(item) {
  const budget = Math.max(
    numeric(item?.budgetMin) || 0,
    numeric(item?.budgetMax) || 0
  );
  if (!budget) return null;
  if (budget >= 1_000_000) return 100;
  if (budget >= 250_000) return 90;
  if (budget >= 100_000) return 80;
  return 65;
}

function buyerHistoryScore(rows) {
  const n = Number(rows) || 0;
  if (n >= 5) return 95;
  if (n >= 3) return 85;
  if (n >= 1) return 70;
  return null;
}

function deadlineReadiness(deadlineAt, now = new Date()) {
  if (!deadlineAt) return null;
  const deadline = new Date(deadlineAt);
  if (Number.isNaN(deadline.getTime())) return null;
  const days = (deadline.getTime() - now.getTime()) / 86400000;
  if (days < 0) return 0;
  if (days >= 30) return 100;
  if (days >= 14) return 85;
  if (days >= 7) return 65;
  return 35;
}

function capabilityFit(tags, opportunityType) {
  const strategic = new Set([
    "agents","rag","genai","governance","ai_act","automation","training"
  ]);
  if (tags.some((tag) => strategic.has(tag))) return 95;
  if (tags.includes("data_ml")) return 82;
  if (["public_ai","training_ai","freelance_ai","private_ai"].includes(opportunityType)) return 45;
  return 40;
}

function strategicValue(tags) {
  if (tags.includes("training")) return 95;
  if (tags.some((tag) =>
    ["agents","rag","genai","governance","ai_act","automation"].includes(tag)
  )) return 90;
  if (tags.includes("data_ml")) return 75;
  return 40;
}

function commercialAccess(type) {
  if (["public_ai","training_ai"].includes(type)) return 85;
  if (type === "freelance_ai") return 75;
  if (type === "private_ai") return 55;
  return null;
}

export function staffingRolesFromTags(tags = [], opportunityType) {
  const roles = [];
  if (["public_ai","training_ai"].includes(opportunityType)) {
    roles.push("Chef de projet IA / Delivery Lead");
  }
  if (tags.includes("agents")) roles.push("Architecte / Engineer Agentic AI");
  if (tags.includes("rag")) roles.push("Engineer RAG / LLM");
  if (tags.includes("genai")) roles.push("Engineer GenAI / LLM");
  if (tags.includes("data_ml")) roles.push("Data Scientist / ML Engineer");
  if (tags.includes("automation")) roles.push("Automation / Integration Engineer");
  if (tags.includes("governance") || tags.includes("ai_act")) {
    roles.push("Consultant gouvernance / conformité IA");
  }
  if (tags.includes("training")) {
    roles.push("Formateur / Consultant adoption IA");
  }
  return [...new Set(roles)];
}

export function buildOpportunityIntelligence({
  item,
  rawPayload,
  buyerAwardRows = 0,
  now = new Date()
}) {
  const evidenceText = [
    item?.title,
    item?.description,
    rawPayload ? JSON.stringify(rawPayload) : null
  ].filter(Boolean).join(" ");

  const classification = classifyAiText(evidenceText);
  const tags = classification.tags;
  const historyScore = buyerHistoryScore(buyerAwardRows);

  const fit = scoreAutonomiaFit({
    capabilityFit: {
      score: capabilityFit(tags, item?.opportunityType),
      evidence: tags,
      note: "V2 deterministic AI topic alignment"
    },
    economicValue: economicValue(item),
    staffingReadiness: null,
    recurrencePotential: historyScore == null ? null : {
      score: historyScore,
      evidence: [`${buyerAwardRows} observed award row(s) for buyer`]
    },
    commercialAccess: commercialAccess(item?.opportunityType),
    buyerKnowledge: historyScore == null ? null : {
      score: historyScore,
      evidence: [`${buyerAwardRows} observed award row(s) for buyer`]
    },
    competitionPosition: null,
    deadlineReadiness: deadlineReadiness(item?.deadlineAt, now),
    strategicValue: strategicValue(tags)
  });

  const deadline = item?.deadlineAt ? new Date(item.deadlineAt) : null;
  const actionability = !deadline || Number.isNaN(deadline.getTime())
    ? { state: "unknown", deadlineAt: item?.deadlineAt || null }
    : {
        state: deadline < now ? "closed_by_deadline" : "open_by_deadline",
        deadlineAt: deadline.toISOString()
      };

  const roles = staffingRolesFromTags(tags, item?.opportunityType);

  return {
    classification: {
      kind: "deterministic_inference",
      isAiRelated: classification.isAiRelated,
      tags,
      evidenceScope: "title + description + raw source payload",
      methodology:
        "V2 word-boundary taxonomy. Source facts are not modified."
    },
    fit: {
      ...fit,
      buyerAwardRowsObserved: Number(buyerAwardRows) || 0,
      actionability,
      safeguards: [
        "Fit is not probability of winning.",
        "Unknown criteria remain unknown and reduce coverage.",
        "Mandatory DCE eligibility is not evaluated here."
      ]
    },
    staffing: {
      kind: "deterministic_inference",
      roles,
      roleCount: roles.length,
      methodology: "Role families inferred from V2 AI topic tags.",
      requiresHumanValidation: true
    }
  };
}
