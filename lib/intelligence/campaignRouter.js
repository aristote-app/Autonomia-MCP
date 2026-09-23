function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const TRACKS = [
  {
    id: "staffing",
    label: "Staffing / freelance IA",
    match: /staffing|freelance|mission|consultant|consulting|esn|talent/,
    campaignKeywords: ["staffing","freelance","mission","consultant","esn","talent","ia","ai"]
  },
  {
    id: "training",
    label: "Formation & adoption IA",
    match: /formation|adoption|academy|learning|copilot|acculturation|training/,
    campaignKeywords: ["formation","training","academy","learning","copilot","adoption","acculturation","ia","ai"]
  },
  {
    id: "delivery",
    label: "Prestation / automatisation IA",
    match: /prestation|automatisation|automation|agentic|agent|rag|llm|genai|data|ia|ai/,
    campaignKeywords: ["ia","ai","automation","automatisation","agent","agentic","genai","rag","llm","data","prestation"]
  }
];

export function inferOutreachTrack(account = {}) {
  const haystack = normalize([
    account.recommended_offer,
    ...(account.offers || []),
    account.primary_decision_role?.label,
    account.playbook?.trigger,
    ...(account.timeline || []).slice(0, 5).map((item) => item.title)
  ].filter(Boolean).join(" "));

  const hit = TRACKS.find((track) => track.match.test(haystack));
  return hit || {
    id: "general",
    label: "Approche IA générale",
    campaignKeywords: ["ia","ai","autonomia"]
  };
}

function tokenMatch(haystack, token) {
  return (" " + haystack + " ").includes(" " + token + " ");
}

function scoreCampaign(name, track, account = {}) {
  const normalizedName = normalize(name);
  if (!normalizedName) return { score: 0, matched: [] };

  let score = 0;
  const matched = [];

  for (const keyword of track.campaignKeywords || []) {
    const token = normalize(keyword);
    if (!token) continue;
    if (tokenMatch(normalizedName, token)) {
      score += ["ia","ai"].includes(token) ? 1 : 3;
      matched.push(keyword);
    }
  }

  const role = normalize(account.primary_decision_role?.label);
  if (/formation|learning|rh|talent/.test(role) && /formation|training|academy|learning|rh/.test(normalizedName)) {
    score += 4;
    matched.push("rôle cible");
  }
  if (/head of ai|data|cto|dsi|tech/.test(role) && /ai|ia|data|tech|cto|dsi/.test(normalizedName)) {
    score += 3;
    matched.push("rôle cible");
  }

  return { score, matched: [...new Set(matched)] };
}

export function rankWaalaxyCampaigns({ account = {}, campaigns = [] } = {}) {
  const track = inferOutreachTrack(account);

  const ranked = (campaigns || [])
    .map((campaign) => {
      const result = scoreCampaign(campaign?.name, track, account);
      return {
        ...campaign,
        autonomia_score: result.score,
        autonomia_track: track.id,
        autonomia_reason: result.matched.length
          ? "Correspondance : " + result.matched.join(", ")
          : "Aucune correspondance forte détectée"
      };
    })
    .sort((a, b) =>
      b.autonomia_score - a.autonomia_score ||
      String(a.name || "").localeCompare(String(b.name || ""))
    );

  const recommended = ranked[0]?.autonomia_score >= 3 ? ranked[0] : null;

  return {
    track,
    recommended,
    ranked
  };
}
