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
  const matchedSkills = consultantSkillMatches(consultant, corpus);
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
    suitable_for_proactive_outreach:
      matchedSkills.length > 0 &&
      score >= 55 &&
      !account.intermediary_risk
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
