export const AI_ROLE_CLUSTERS = Object.freeze({
  ai_product: {
    label: "Product IA",
    patterns: [
      /\b(ai|ia)\s+product\s+(manager|owner)\b/i,
      /\bproduct\s+(manager|owner).{0,30}(ai|ia|genai|llm)\b/i,
      /\bchef de produit.{0,25}(ia|intelligence artificielle)\b/i
    ]
  },
  ai_program_project: {
    label: "Program / Project IA",
    patterns: [
      /\b(program|programme)\s+manager.{0,30}(ai|ia|data)\b/i,
      /\b(project|projet)\s+manager.{0,30}(ai|ia|data)\b/i,
      /\bchef de projet.{0,30}(ia|intelligence artificielle|data|genai)\b/i,
      /\bpmo.{0,30}(ia|ai|data)\b/i
    ]
  },
  forward_deployment: {
    label: "Forward Deployment / AI Solutions",
    patterns: [
      /\bforward deployment (engineer|lead|manager)\b/i,
      /\bforward deployed (engineer|lead)\b/i,
      /\bai solutions? engineer\b/i,
      /\bsolutions? architect.{0,25}(ai|ia|llm|genai)\b/i
    ]
  },
  agentic_llm: {
    label: "Agentic / LLM / RAG",
    patterns: [
      /\b(agentic|agent ia|agents ia|multi[- ]?agent)\b/i,
      /\b(llm|large language model|rag|retrieval augmented generation)\b/i,
      /\b(ia g[eé]n[eé]rative|generative ai|genai)\b/i
    ]
  },
  data_ml: {
    label: "Data / ML",
    patterns: [
      /\b(data scientist|data engineer|ml engineer|machine learning engineer)\b/i,
      /\b(machine learning|deep learning|mlops|data science)\b/i
    ]
  },
  governance_ai_act: {
    label: "Gouvernance / AI Act",
    patterns: [
      /\b(ai act|gouvernance ia|ia responsable|responsible ai)\b/i,
      /\b(conformit[eé]|compliance).{0,20}(ia|ai)\b/i,
      /\b(ethics|[eé]thique).{0,20}(ia|ai)\b/i
    ]
  },
  ai_training_change: {
    label: "Formation / Change IA",
    patterns: [
      /\b(formation|formateur|trainer).{0,30}(ia|ai|chatgpt|genai)\b/i,
      /\b(acculturation|sensibilisation).{0,25}(ia|ai)\b/i,
      /\b(change management|conduite du changement).{0,30}(ia|ai)\b/i
    ]
  }
});

export function classifyAiRole(input) {
  const text = [
    input?.title,
    input?.description,
    input?.skills,
    input?.tags
  ]
    .flat()
    .filter(Boolean)
    .join(" ");

  const matches = [];

  for (const [id, cluster] of Object.entries(AI_ROLE_CLUSTERS)) {
    const evidence = cluster.patterns
      .filter((pattern) => pattern.test(text))
      .map((pattern) => pattern.source);

    if (evidence.length) {
      matches.push({
        id,
        label: cluster.label,
        evidence
      });
    }
  }

  return {
    matches,
    primary: matches[0] || null,
    unclassified: matches.length === 0
  };
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function compareRoleRecords(records, clusterIds) {
  const selected = clusterIds?.length
    ? clusterIds
    : Object.keys(AI_ROLE_CLUSTERS);

  const groups = Object.fromEntries(
    selected.map((id) => [
      id,
      {
        id,
        label: AI_ROLE_CLUSTERS[id]?.label || id,
        missions: 0,
        tjmValues: [],
        remoteKnown: 0,
        remotePositive: 0,
        sources: {}
      }
    ])
  );

  let unclassified = 0;

  for (const record of records || []) {
    const classification = classifyAiRole(record);
    const matching = classification.matches
      .map((match) => match.id)
      .filter((id) => groups[id]);

    if (!matching.length) {
      unclassified += 1;
      continue;
    }

    for (const id of matching) {
      const group = groups[id];
      group.missions += 1;

      const tjmCandidates = [record.tjmMin, record.tjmMax, record.tjmAmount]
        .map(Number)
        .filter(Number.isFinite);
      if (tjmCandidates.length) {
        group.tjmValues.push(
          tjmCandidates.reduce((sum, value) => sum + value, 0) / tjmCandidates.length
        );
      }

      const remote = String(record.remoteMode || record.workMode || "").toLowerCase();
      if (remote) {
        group.remoteKnown += 1;
        if (/remote|t[eé]l[eé]travail|hybride|hybrid/.test(remote)) {
          group.remotePositive += 1;
        }
      }

      const source = record.source || "persisted";
      group.sources[source] = (group.sources[source] || 0) + 1;
    }
  }

  const items = Object.values(groups).map((group) => {
    const avg = group.tjmValues.length
      ? group.tjmValues.reduce((sum, value) => sum + value, 0) / group.tjmValues.length
      : null;

    return {
      id: group.id,
      label: group.label,
      missions: group.missions,
      tjm: {
        known: group.tjmValues.length,
        average: avg,
        median: median(group.tjmValues),
        min: group.tjmValues.length ? Math.min(...group.tjmValues) : null,
        max: group.tjmValues.length ? Math.max(...group.tjmValues) : null
      },
      remote: {
        known: group.remoteKnown,
        positive: group.remotePositive,
        share: group.remoteKnown ? group.remotePositive / group.remoteKnown : null
      },
      sources: group.sources
    };
  });

  return {
    recordCount: records?.length || 0,
    unclassified,
    note:
      "One mission can belong to multiple clusters. Counts therefore must not be summed as a deduplicated market total.",
    items
  };
}
