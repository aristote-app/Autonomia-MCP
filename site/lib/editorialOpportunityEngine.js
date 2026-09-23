import {
  executionBacklog,
  trainingBacklog
} from "../content/editorial-backlog.js";
import { territoryBacklog } from "../content/territory-editorial.js";
import {
  publishedExecutionArticles,
  publishedTrainingArticles,
  publishedTerritoryArticles
} from "../content/published-articles.js";

const STOPWORDS = new Set([
  "avec","dans","pour","sans","une","des","les","aux","sur","par","du","de","la","le","et",
  "ia","ai","un","en","a","d","l","au","ou","plus","comment","creer","former","formation",
  "automatiser","apprendre","entreprise"
]);

function normalize(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tokens(value = "") {
  return new Set(
    normalize(value)
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOPWORDS.has(word))
  );
}

function similarity(leftValue, rightValue) {
  const left = tokens(leftValue);
  const right = tokens(rightValue);
  if (!left.size || !right.size) return 0;

  let overlap = 0;
  for (const token of left) if (right.has(token)) overlap += 1;
  return overlap / new Set([...left, ...right]).size;
}

function number(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizeSignal(signal) {
  return {
    query: signal.query || signal.term || "",
    cluster: signal.cluster || "",
    family: signal.family || null,
    search_impressions: number(signal.search_impressions ?? signal.impressions),
    search_clicks: number(signal.search_clicks ?? signal.clicks),
    paid_search_conversions: number(signal.paid_search_conversions),
    inbound_mentions: number(signal.inbound_mentions),
    job_mentions: number(signal.job_mentions),
    public_procurement_mentions: number(signal.public_procurement_mentions),
    territory_mentions: number(signal.territory_mentions),
    ai_citations: number(signal.ai_citations ?? signal.citations),
    revenue: number(signal.revenue)
  };
}

function matchStrength(topic, signal) {
  if (signal.family && signal.family !== topic.type) return 0;

  const querySimilarity = similarity(topic.title, signal.query);
  const clusterSimilarity = signal.cluster
    ? Math.max(
        similarity(topic.cluster, signal.cluster),
        normalize(topic.cluster) === normalize(signal.cluster) ? 1 : 0
      )
    : 0;

  return Math.max(querySimilarity, clusterSimilarity * 0.85);
}

function signalValue(signal) {
  const impressions = Math.log10(1 + signal.search_impressions);
  const clicks = Math.log10(1 + signal.search_clicks);
  const paid = Math.log10(1 + signal.paid_search_conversions);
  const inbound = Math.log10(1 + signal.inbound_mentions);
  const jobs = Math.log10(1 + signal.job_mentions);
  const procurement = Math.log10(1 + signal.public_procurement_mentions);
  const territory = Math.log10(1 + signal.territory_mentions);
  const citations = Math.log10(1 + signal.ai_citations);
  const revenue = Math.log10(1 + Math.max(0, signal.revenue) / 100);

  return (
    impressions * 1.2 +
    clicks * 1.4 +
    paid * 2.2 +
    inbound * 2 +
    jobs * 1.05 +
    procurement * 1.7 +
    territory * 1.5 +
    citations * 1.2 +
    revenue * 2.6
  );
}

function publishedFor(topic) {
  if (topic.type === "execution-use-case") return publishedExecutionArticles;
  if (topic.type === "training-use-case") return publishedTrainingArticles;
  if (topic.type === "territory-use-case") return publishedTerritoryArticles;
  return [];
}

function familyKey(topic) {
  if (topic.type === "execution-use-case") return "execution";
  if (topic.type === "training-use-case") return "training";
  return "territory";
}

function publishedClusterCount(topic) {
  return publishedFor(topic).filter((article) => article.cluster === topic.cluster).length;
}

function closestPublished(topic) {
  return publishedFor(topic)
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      similarity: similarity(topic.title, article.title)
    }))
    .sort((a, b) => b.similarity - a.similarity)[0] || null;
}

export function prioritizeEditorialBacklog(rawSignals = [], options = {}) {
  const signals = rawSignals.map(normalizeSignal);
  const maxResults = Math.max(1, Math.min(number(options.max_results) || 30, 100));
  const backlog = [...executionBacklog, ...trainingBacklog, ...territoryBacklog];

  const publishedSlugs = new Set([
    ...publishedExecutionArticles.map((article) => article.slug),
    ...publishedTrainingArticles.map((article) => article.slug),
    ...publishedTerritoryArticles.map((article) => article.slug)
  ]);

  const candidates = backlog
    .filter((topic) => !publishedSlugs.has(topic.slug))
    .map((topic) => {
      const matches = signals
        .map((signal) => ({
          signal,
          strength: matchStrength(topic, signal)
        }))
        .filter((match) => match.strength >= 0.12);

      const evidenceScore = matches.reduce(
        (sum, match) => sum + signalValue(match.signal) * match.strength,
        0
      );

      const closest = closestPublished(topic);
      const overlap = closest?.similarity || 0;
      const clusterCoverage = publishedClusterCount(topic);

      const diversityBonus = clusterCoverage === 0 ? 2.2 : clusterCoverage === 1 ? 0.8 : 0;
      const overlapPenalty = overlap >= 0.72 ? 5 : overlap >= 0.52 ? 2 : 0;
      const noEvidencePenalty = matches.length === 0 ? 1.5 : 0;

      const score = evidenceScore + diversityBonus - overlapPenalty - noEvidencePenalty;

      const evidence = {
        search_impressions: matches.reduce((sum, match) => sum + match.signal.search_impressions, 0),
        search_clicks: matches.reduce((sum, match) => sum + match.signal.search_clicks, 0),
        paid_search_conversions: matches.reduce((sum, match) => sum + match.signal.paid_search_conversions, 0),
        inbound_mentions: matches.reduce((sum, match) => sum + match.signal.inbound_mentions, 0),
        job_mentions: matches.reduce((sum, match) => sum + match.signal.job_mentions, 0),
        public_procurement_mentions: matches.reduce((sum, match) => sum + match.signal.public_procurement_mentions, 0),
        territory_mentions: matches.reduce((sum, match) => sum + match.signal.territory_mentions, 0),
        ai_citations: matches.reduce((sum, match) => sum + match.signal.ai_citations, 0),
        revenue: matches.reduce((sum, match) => sum + match.signal.revenue, 0),
        matched_signals: matches.length
      };

      let action = "research";
      if (overlap >= 0.72) action = "review_overlap";
      else if (score >= 4 && matches.length > 0) action = "promote";
      else if (clusterCoverage === 0 && matches.length > 0) action = "research_priority";

      return {
        family: familyKey(topic),
        slug: topic.slug,
        cluster: topic.cluster,
        pillar: topic.pillar,
        title: topic.title,
        action,
        score: Number(score.toFixed(3)),
        cluster_published_guides: clusterCoverage,
        closest_published: closest,
        evidence
      };
    })
    .sort((a, b) => {
      if (a.action === "review_overlap" && b.action !== "review_overlap") return 1;
      if (b.action === "review_overlap" && a.action !== "review_overlap") return -1;
      return b.score - a.score;
    });

  return {
    generated_at: new Date().toISOString(),
    signals_received: signals.length,
    remaining_candidates: candidates.length,
    recommendations: candidates.slice(0, maxResults),
    rules: {
      evidence_first: true,
      cluster_diversity_bonus: true,
      cannibalization_penalty: true,
      no_signal_auto_publish: false,
      output_is_recommendation_not_publication: true
    }
  };
}
