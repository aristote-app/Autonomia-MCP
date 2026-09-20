import {
  executionBacklog,
  trainingBacklog
} from "@/content/editorial-backlog";
import {
  publishedExecutionArticles,
  publishedTrainingArticles
} from "@/content/published-articles";
import { analyzeOrganicRecords } from "@/lib/organicDecisionEngine";

function slugFromUrl(url) {
  try {
    return new URL(url).pathname.split("/").filter(Boolean).at(-1) || "";
  } catch {
    return "";
  }
}

function publishedLookup(url) {
  const slug = slugFromUrl(url);
  const execution = publishedExecutionArticles.find((article) => article.slug === slug);
  if (execution) return { family: "execution", article: execution };

  const training = publishedTrainingArticles.find((article) => article.slug === slug);
  if (training) return { family: "training", article: training };

  return null;
}

function backlogFor(family) {
  return family === "training" ? trainingBacklog : executionBacklog;
}

function publishedSlugs(family) {
  return new Set(
    (family === "training" ? publishedTrainingArticles : publishedExecutionArticles)
      .map((article) => article.slug)
  );
}

export function buildOrganicWavePlan(records) {
  const analysis = analyzeOrganicRecords(records);
  const candidateMap = new Map();
  const refreshQueue = [];
  const snippetQueue = [];

  for (const recommendation of analysis.recommendations) {
    const match = publishedLookup(recommendation.url);

    if (["refresh_content", "investigate_decay"].includes(recommendation.action)) {
      refreshQueue.push(recommendation);
    }

    if (recommendation.action === "improve_search_snippet") {
      snippetQueue.push(recommendation);
    }

    if (recommendation.action !== "expand_winner" || !match) continue;

    const { family, article } = match;
    const done = publishedSlugs(family);

    const candidates = backlogFor(family)
      .filter((topic) => topic.cluster === article.cluster && !done.has(topic.slug))
      .slice(0, 5);

    for (const topic of candidates) {
      const key = `${family}:${topic.slug}`;
      if (!candidateMap.has(key)) {
        candidateMap.set(key, {
          family,
          slug: topic.slug,
          title: topic.title,
          cluster: topic.cluster,
          reason:
            "Sujet du même cluster qu’une URL ayant déjà généré au moins une conversion observée.",
          evidence_source_url: recommendation.url,
          evidence: recommendation.evidence,
          next_step:
            "Générer le brief éditorial, vérifier la demande de recherche, rechercher les sources, puis publier uniquement si le guide passe les gates."
        });
      }
    }
  }

  return {
    expansion_candidates: [...candidateMap.values()],
    refresh_queue: refreshQueue,
    snippet_queue: snippetQueue,
    cannibalization_queue: analysis.cannibalization,
    rule:
      "Aucune expansion n’est recommandée uniquement parce qu’un sujet existe dans le backlog. Les candidats proviennent ici d’un cluster ayant déjà une conversion observée."
  };
}
