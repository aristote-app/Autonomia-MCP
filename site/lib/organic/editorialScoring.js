import {
  executionBacklog,
  trainingBacklog
} from "../../content/editorial-backlog.js";

function normalize(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tokens(value = "") {
  return new Set(
    normalize(value)
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length >= 4)
  );
}

function overlapScore(a, b) {
  const left = tokens(a);
  const right = tokens(b);
  let common = 0;

  for (const token of left) {
    if (right.has(token)) common += 1;
  }

  return common;
}

function scoreSignal(signal, topic) {
  const query = signal.query || "";
  const overlap = overlapScore(
    query,
    [topic.title, topic.cluster, topic.pillar].filter(Boolean).join(" ")
  );

  if (!overlap) return null;

  const searchImpressions = Number(signal.search_impressions || 0);
  const searchClicks = Number(signal.search_clicks || 0);
  const jobMentions = Number(signal.job_mentions || 0);
  const procurementMentions = Number(
    signal.public_procurement_mentions || 0
  );
  const territoryMentions = Number(signal.territory_mentions || 0);
  const inboundMentions = Number(signal.inbound_mentions || 0);

  const score =
    overlap * 8 +
    Math.min(25, Math.log10(searchImpressions + 1) * 8) +
    Math.min(12, searchClicks * 2) +
    Math.min(14, jobMentions * 7) +
    Math.min(18, procurementMentions * 9) +
    Math.min(16, territoryMentions * 8) +
    Math.min(18, inboundMentions * 9);

  return {
    score,
    searchImpressions,
    searchClicks,
    jobMentions,
    procurementMentions,
    territoryMentions,
    inboundMentions
  };
}

export function rankEditorialOpportunities(
  signals = [],
  maxResults = 25
) {
  const backlog = [...executionBacklog, ...trainingBacklog];

  return backlog
    .map((topic) => {
      const evidence = {
        matched_signals: 0,
        search_impressions: 0,
        search_clicks: 0,
        job_mentions: 0,
        public_procurement_mentions: 0,
        territory_mentions: 0,
        inbound_mentions: 0
      };

      let raw = 0;

      for (const signal of signals) {
        const match = scoreSignal(signal, topic);
        if (!match) continue;

        evidence.matched_signals += 1;
        evidence.search_impressions += match.searchImpressions;
        evidence.search_clicks += match.searchClicks;
        evidence.job_mentions += match.jobMentions;
        evidence.public_procurement_mentions +=
          match.procurementMentions;
        evidence.territory_mentions += match.territoryMentions;
        evidence.inbound_mentions += match.inboundMentions;
        raw += match.score;
      }

      const score = Math.min(100, Math.round(raw));

      return {
        slug: topic.slug,
        title: topic.title,
        cluster: topic.cluster,
        pillar: topic.pillar,
        family: topic.family,
        score,
        action:
          score >= 70
            ? "Rédiger / mettre à jour maintenant"
            : score >= 40
              ? "Préparer le brief éditorial"
              : score > 0
                ? "Surveiller la demande"
                : "Backlog",
        evidence
      };
    })
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.evidence.search_impressions -
          a.evidence.search_impressions
    )
    .slice(
      0,
      Math.max(1, Math.min(Number(maxResults) || 25, 100))
    );
}
