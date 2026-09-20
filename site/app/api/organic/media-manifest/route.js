import { NextResponse } from "next/server";
import {
  publishedExecutionArticles,
  publishedTrainingArticles
} from "@/content/published-articles";

function authorized(request) {
  const token = process.env.AUTONOMIA_ORGANIC_TOKEN;
  return Boolean(token && request.headers.get("authorization") === `Bearer ${token}`);
}

function brief(article, base) {
  const training = article.type === "training";
  const path = training
    ? `/formation-ia/cas-usage/${article.slug}`
    : `/cas-usage-ia/${article.slug}`;

  const sectionHeadings = article.sections.slice(0, 5).map((section) => section.heading);

  return {
    type: article.type,
    slug: article.slug,
    canonical_url: `${base}${path}`,
    title: article.title,
    cluster: article.cluster,
    social_image_url: `${base}${path}/opengraph-image`,
    short_video_brief: {
      hook: article.title,
      promise: article.summary,
      scenes: sectionHeadings,
      closing: training
        ? "Montrer ce que le participant doit être capable de refaire seul."
        : "Montrer où l’IA agit, où les règles décident et où l’humain garde le contrôle.",
      cta: training
        ? `${base}/formation-ia-entreprise`
        : `${base}/expert-ia`
    }
  };
}

export async function GET(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr").replace(/\/$/, "");
  const articles = [...publishedExecutionArticles, ...publishedTrainingArticles];

  return NextResponse.json({
    generated_at: new Date().toISOString(),
    count: articles.length,
    items: articles.map((article) => brief(article, base))
  });
}
