function number(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function daysSince(date, now = new Date()) {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.floor((now.getTime() - parsed.getTime()) / 86400000);
}

function groupBy(records, keyFn) {
  const map = new Map();
  for (const record of records) {
    const key = keyFn(record);
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(record);
  }
  return map;
}

function summarizeUrl(records) {
  const impressions = records.reduce((sum, row) => sum + number(row.impressions), 0);
  const clicks = records.reduce((sum, row) => sum + number(row.clicks), 0);
  const citations = records.reduce((sum, row) => sum + number(row.citations), 0);
  const conversions = records.reduce((sum, row) => sum + number(row.conversions), 0);
  const previousImpressions = records.reduce((sum, row) => sum + number(row.previous_impressions), 0);
  const latestModified = records
    .map((row) => row.modified_at)
    .filter(Boolean)
    .sort()
    .at(-1) || null;
  const publishedAt = records
    .map((row) => row.published_at)
    .filter(Boolean)
    .sort()[0] || null;

  return {
    impressions,
    clicks,
    citations,
    conversions,
    previousImpressions,
    ctr: impressions > 0 ? clicks / impressions : 0,
    latestModified,
    publishedAt
  };
}

export function detectCannibalization(records) {
  const queryGroups = groupBy(
    records.filter((row) => row.query && number(row.impressions) > 0),
    (row) => row.query.trim().toLowerCase()
  );

  const findings = [];

  for (const [query, rows] of queryGroups) {
    const byUrl = groupBy(rows, (row) => row.url);
    if (byUrl.size < 2) continue;

    const pages = [...byUrl.entries()]
      .map(([url, pageRows]) => ({
        url,
        impressions: pageRows.reduce((sum, row) => sum + number(row.impressions), 0),
        clicks: pageRows.reduce((sum, row) => sum + number(row.clicks), 0)
      }))
      .filter((page) => page.impressions >= 20)
      .sort((a, b) => b.impressions - a.impressions);

    if (pages.length < 2) continue;

    const total = pages.reduce((sum, page) => sum + page.impressions, 0);
    const dominantShare = total > 0 ? pages[0].impressions / total : 1;

    if (dominantShare < 0.75) {
      findings.push({
        type: "possible_cannibalization",
        query,
        total_impressions: total,
        dominant_share: Number(dominantShare.toFixed(3)),
        pages,
        action:
          "Comparer les intentions et contenus. Si deux pages répondent à la même question, fusionner ou redéfinir clairement leur rôle et leur maillage."
      });
    }
  }

  return findings;
}

export function analyzeOrganicRecords(records, now = new Date()) {
  const urlGroups = groupBy(records, (row) => row.url);
  const recommendations = [];

  for (const [url, rows] of urlGroups) {
    const metrics = summarizeUrl(rows);
    const age = daysSince(metrics.latestModified || metrics.publishedAt, now);
    const decline =
      metrics.previousImpressions > 0
        ? (metrics.impressions - metrics.previousImpressions) / metrics.previousImpressions
        : null;

    if (metrics.conversions > 0) {
      recommendations.push({
        url,
        action: "expand_winner",
        priority: "high",
        evidence: {
          conversions: metrics.conversions,
          impressions: metrics.impressions,
          citations: metrics.citations
        },
        reason:
          "Cette URL a déjà généré une conversion observée. Renforcer son cluster et ses sujets adjacents est plus défendable que créer du contenu sans signal business."
      });
    }

    if (metrics.impressions >= 100 && metrics.ctr < 0.01) {
      recommendations.push({
        url,
        action: "improve_search_snippet",
        priority: "medium",
        evidence: {
          impressions: metrics.impressions,
          clicks: metrics.clicks,
          ctr: Number(metrics.ctr.toFixed(4))
        },
        reason:
          "La page est visible mais attire peu de clics. Vérifier title, description, adéquation à l’intention et promesse de la page."
      });
    }

    if (metrics.citations > 0 && metrics.clicks === 0) {
      recommendations.push({
        url,
        action: "strengthen_citable_answer",
        priority: "medium",
        evidence: {
          citations: metrics.citations,
          impressions: metrics.impressions
        },
        reason:
          "La page est citée dans une expérience IA mais ne génère pas encore de clic observé. Renforcer résumé direct, actifs originaux, définitions et prochaine action."
      });
    }

    if (age !== null && age >= 120 && (metrics.impressions >= 50 || metrics.citations > 0)) {
      recommendations.push({
        url,
        action: "refresh_content",
        priority: age >= 240 ? "high" : "medium",
        evidence: {
          days_since_update: age,
          impressions: metrics.impressions,
          citations: metrics.citations
        },
        reason:
          "Le contenu continue d’être visible alors que sa dernière modification est ancienne. Revalider les sources, outils, exemples et liens."
      });
    }

    if (decline !== null && decline <= -0.3 && metrics.previousImpressions >= 100) {
      recommendations.push({
        url,
        action: "investigate_decay",
        priority: "high",
        evidence: {
          impressions: metrics.impressions,
          previous_impressions: metrics.previousImpressions,
          change: Number(decline.toFixed(3))
        },
        reason:
          "Les impressions observées baissent fortement par rapport à la période précédente. Vérifier fraîcheur, concurrence d’intention, indexation et évolution de la SERP."
      });
    }

    if (
      age !== null &&
      age >= 45 &&
      metrics.impressions === 0 &&
      metrics.citations === 0 &&
      metrics.clicks === 0
    ) {
      recommendations.push({
        url,
        action: "inspect_discovery",
        priority: "medium",
        evidence: { days_since_publish_or_update: age },
        reason:
          "Aucun signal de découverte n’est remonté après plusieurs semaines. Vérifier indexation, maillage interne, sitemap, canonical et valeur distincte de la page."
      });
    }
  }

  return {
    recommendations,
    cannibalization: detectCannibalization(records)
  };
}
