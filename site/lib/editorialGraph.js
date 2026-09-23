import {
  executionPillars,
  trainingPillars
} from "@/content/editorial-backlog";
import {
  publishedExecutionArticles,
  publishedTrainingArticles
} from "@/content/published-articles";

const STOPWORDS = new Set([
  "avec","dans","pour","sans","une","des","les","aux","sur","par","du","de","la","le","et",
  "ia","ai","un","en","a","d","l","au","ou","plus","comment","creer","former","formation",
  "automatiser","apprendre","entreprise"
]);

function tokens(value = "") {
  return new Set(
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOPWORDS.has(word))
  );
}

function similarity(a, b) {
  const left = tokens(`${a.title} ${a.cluster || ""}`);
  const right = tokens(`${b.title} ${b.cluster || ""}`);
  if (!left.size || !right.size) return 0;

  let intersection = 0;
  for (const token of left) if (right.has(token)) intersection += 1;
  return intersection / new Set([...left, ...right]).size;
}

function articleHref(article) {
  return article.type === "training"
    ? `/formation-ia/cas-usage/${article.slug}`
    : `/cas-usage-ia/${article.slug}`;
}

function pillarCollection(article) {
  return article.type === "training" ? trainingPillars : executionPillars;
}

function articleCollection(article) {
  return article.type === "training" ? publishedTrainingArticles : publishedExecutionArticles;
}

function oppositeCollection(article) {
  return article.type === "training" ? publishedExecutionArticles : publishedTrainingArticles;
}

export function getEditorialGraph(article) {
  const pillars = pillarCollection(article);
  const currentPillar = pillars.find((pillar) => pillar.cluster === article.cluster) || null;
  const currentIndex = currentPillar ? pillars.findIndex((pillar) => pillar.slug === currentPillar.slug) : -1;

  const siblings = articleCollection(article)
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate) => ({
      candidate,
      score: candidate.cluster === article.cluster ? 10 + similarity(article, candidate) : similarity(article, candidate)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ candidate }) => ({
      kicker: candidate.cluster,
      label: candidate.title,
      href: articleHref(candidate)
    }));

  const mirrorCandidate = oppositeCollection(article)
    .map((candidate) => ({ candidate, score: similarity(article, candidate) }))
    .sort((a, b) => b.score - a.score)[0];

  const adjacentPillars = currentIndex >= 0
    ? [pillars[currentIndex - 1], pillars[currentIndex + 1]].filter(Boolean).map((pillar) => ({
        kicker: "PILIER",
        label: pillar.title,
        href: article.type === "training"
          ? `/formation-ia/cas-usage/${pillar.slug}`
          : `/cas-usage-ia/${pillar.slug}`
      }))
    : [];

  return {
    pillar: currentPillar
      ? {
          kicker: "PILIER",
          label: currentPillar.title,
          href: article.type === "training"
            ? `/formation-ia/cas-usage/${currentPillar.slug}`
            : `/cas-usage-ia/${currentPillar.slug}`
        }
      : null,
    related: siblings,
    mirror: mirrorCandidate && mirrorCandidate.score > 0
      ? {
          kicker: article.type === "training" ? "VOIR LE SYSTÈME" : "VOIR LA COMPÉTENCE",
          label: mirrorCandidate.candidate.title,
          href: articleHref(mirrorCandidate.candidate)
        }
      : null,
    adjacentPillars
  };
}
