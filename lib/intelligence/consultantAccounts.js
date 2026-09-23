function clean(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const DOMAIN_CLUSTERS = Object.freeze([
  {
    id: "genai",
    terms: ["llm", "genai", "generative ai", "gpt", "openai", "chatgpt", "rag", "langchain", "langgraph", "agentic", "copilot"]
  },
  {
    id: "data_ml",
    terms: ["machine learning", "data science", "data scientist", "dataiku", "spark", "python", "mlops", "databricks"]
  },
  {
    id: "automation",
    terms: ["automation", "automatisation", "workflow", "n8n", "make", "power automate", "rpa"]
  },
  {
    id: "product_project",
    terms: ["product owner", "product manager", "chef de projet", "project manager", "program manager", "ai product", "ai program"]
  },
  {
    id: "training_change",
    terms: ["formation", "training", "adoption", "change", "acculturation", "academy", "learning"]
  },
  {
    id: "governance",
    terms: ["governance", "gouvernance", "ai act", "compliance", "conformite", "risk"]
  }
]);

const CLUSTER_LABELS = Object.freeze({
  genai: "GenAI / agents / RAG",
  data_ml: "Data / ML",
  automation: "Automatisation / workflows",
  product_project: "Pilotage produit / projet IA",
  training_change: "Formation / adoption / change",
  governance: "Gouvernance / conformité IA"
});

function corpusForAccount(account = {}) {
  const values = [
    account.name,
    account.recommended_offer,
    ...(account.offers || []),
    ...(account.decision_roles || []).flatMap((role) => [role.label, role.reason]),
    ...(account.timeline || []).flatMap((event) => [
      event.title,
      event.kind,
      ...(event.signal_keys || []),
      ...(event.tags || [])
    ])
  ];
  return clean(values.filter(Boolean).join(" "));
}

function clusterIds(corpus) {
  const out = new Set();
  for (const cluster of DOMAIN_CLUSTERS) {
    if (cluster.terms.some((term) => corpus.includes(clean(term)))) out.add(cluster.id);
  }
  return out;
}

function consultantSkillMatches(consultant = {}, corpus = "") {
  const skills = [...new Set((consultant.skills || []).map((skill) => String(skill || "").trim()).filter(Boolean))];
  const accountClusters = clusterIds(corpus);
  const matches = [];

  for (const skill of skills) {
    const normalized = clean(skill);
    if (!normalized) continue;

    if (corpus.includes(normalized)) {
      matches.push(skill);
      continue;
    }

    const skillClusters = clusterIds(normalized);
    if ([...skillClusters].some((id) => accountClusters.has(id))) {
      matches.push(skill);
    }
  }

  return [...new Set(matches)];
}

function recencyScore(account = {}) {
  if (Number(account.recent_7d) > 0) return 100;
  if (Number(account.recent_30d) > 0) return 70;
  return 35;
}

function explanation(account, matchedSkills) {
  if (matchedSkills.length >= 3) {
    return "Plusieurs compétences du consultant convergent avec les signaux récents du compte.";
  }
  if (matchedSkills.length === 2) {
    return "Deux compétences du consultant convergent avec les besoins observés.";
  }
  if (matchedSkills.length === 1) {
    return "Une compétence du consultant converge avec un besoin observé ; qualification nécessaire.";
  }
  return "Aucune convergence de compétence suffisamment explicite.";
}

export function matchConsultantToAccount({ consultant = {}, account = {} } = {}) {
  const corpus = corpusForAccount(account);
  let matchedSkills = consultantSkillMatches(consultant, corpus);

  const offers = (account.offers || []).map((value) => clean(value)).filter(Boolean);
  const trainingOnly =
    offers.length > 0 &&
    offers.every((value) => /formation|adoption|training|academy/.test(value));
  const consultantClusters = clusterIds(clean((consultant.skills || []).join(" ")));
  const accountClusters = clusterIds(corpus);
  const missingDomains = [...accountClusters]
    .filter((id) => !consultantClusters.has(id))
    .map((id) => CLUSTER_LABELS[id] || id);

  if (trainingOnly && !consultantClusters.has("training_change")) {
    matchedSkills = matchedSkills.filter((skill) => corpus.includes(clean(skill)));
  }

  const heat = Math.max(0, Math.min(100, Number(account.heat_score) || 0));
  const recency = recencyScore(account);
  const skillStrength = Math.min(100, matchedSkills.length * 28);

  let score = Math.round(
    skillStrength * 0.5 +
    heat * 0.35 +
    recency * 0.15
  );

  if (account.intermediary_risk) score = Math.max(0, score - 20);

  const evidence = (account.timeline || []).find((event) => {
    const text = clean([
      event.title,
      ...(event.signal_keys || []),
      ...(event.tags || [])
    ].join(" "));
    return matchedSkills.some((skill) => text.includes(clean(skill))) ||
      [...clusterIds(text)].some((id) => clusterIds(clean(matchedSkills.join(" "))).has(id));
  }) || (account.timeline || [])[0] || null;

  return {
    consultant_id: consultant.id || null,
    consultant_name: consultant.display_name || consultant.name || null,
    account_slug: account.slug || null,
    account_name: account.name || null,
    score,
    matched_skills: matchedSkills,
    account_heat: heat,
    intermediary_risk: Boolean(account.intermediary_risk),
    trigger: evidence?.title || null,
    proof_url: evidence?.source_url || null,
    reason: explanation(account, matchedSkills),
    available_from: consultant.available_from || null,
    tjm: consultant.tjm ?? null,
    currency: consultant.currency || "EUR",
    remote: Boolean(consultant.remote),
    locations: Array.isArray(consultant.locations) ? consultant.locations : [],
    years_experience: consultant.years_experience ?? null,
    gaps: missingDomains,
    suitable_for_proactive_outreach:
      matchedSkills.length > 0 &&
      score >= 55 &&
      !account.intermediary_risk &&
      !account.dormant
  };
}

export function rankConsultantsForAccount({
  account = {},
  consultants = [],
  limit = 5
} = {}) {
  const matches = (consultants || [])
    .map((consultant) => matchConsultantToAccount({ consultant, account }))
    .filter((match) => match.matched_skills.length > 0)
    .sort((a, b) => {
      if (a.suitable_for_proactive_outreach !== b.suitable_for_proactive_outreach) {
        return a.suitable_for_proactive_outreach ? -1 : 1;
      }
      return b.score - a.score;
    })
    .slice(0, Math.min(Math.max(Number(limit) || 5, 1), 50));

  return {
    account: {
      slug: account.slug || null,
      name: account.name || null,
      heat_score: Number(account.heat_score) || 0,
      dormant: Boolean(account.dormant)
    },
    count: matches.length,
    matches,
    note:
      "Le score rapproche uniquement les compétences déclarées des consultants et les signaux sourcés du compte. Les gaps sont des domaines détectés dans les signaux mais absents des compétences déclarées. Ce n'est ni une promesse de staffing ni une probabilité de conversion."
  };
}

export function rankAccountsForConsultant({
  consultant = {},
  accounts = [],
  limit = 8
} = {}) {
  const matches = (accounts || [])
    .map((account) => matchConsultantToAccount({ consultant, account }))
    .filter((match) => match.matched_skills.length > 0)
    .sort((a, b) => {
      if (a.intermediary_risk !== b.intermediary_risk) {
        return a.intermediary_risk ? 1 : -1;
      }
      return b.score - a.score || b.account_heat - a.account_heat;
    })
    .slice(0, Math.min(Math.max(Number(limit) || 8, 1), 50));

  return {
    consultant: {
      id: consultant.id || null,
      name: consultant.display_name || consultant.name || null,
      skills: consultant.skills || []
    },
    count: matches.length,
    matches,
    note:
      "Le score rapproche uniquement les compétences déclarées du consultant et les signaux sourcés du compte. Il ne constitue ni une promesse de mission ni une probabilité de conversion."
  };
}
