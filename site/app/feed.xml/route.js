import {
  publishedExecutionArticles,
  publishedTrainingArticles
} from "@/content/published-articles";

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function href(article, base) {
  return article.type === "training"
    ? `${base}/formation-ia/cas-usage/${article.slug}`
    : `${base}/cas-usage-ia/${article.slug}`;
}

export async function GET() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr").replace(/\/$/, "");
  const articles = [...publishedExecutionArticles, ...publishedTrainingArticles]
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));

  const latest = articles
    .map((article) => article.modifiedAt || article.publishedAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  const items = articles.map((article) => {
    const link = href(article, base);
    return `
      <item>
        <title>${escapeXml(article.title)}</title>
        <link>${escapeXml(link)}</link>
        <guid isPermaLink="true">${escapeXml(link)}</guid>
        <description>${escapeXml(article.dek)}</description>
        <category>${escapeXml(article.cluster)}</category>
        <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      </item>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Autonomia — Cas d’usage IA et formation</title>
        <link>${escapeXml(base)}</link>
        <description>Guides Autonomia sur l’exécution IA, l’automatisation, les agents, le knowledge management et la montée en compétences.</description>
        <language>fr-fr</language>
        <lastBuildDate>${latest ? new Date(latest).toUTCString() : new Date().toUTCString()}</lastBuildDate>
        ${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600"
    }
  });
}
