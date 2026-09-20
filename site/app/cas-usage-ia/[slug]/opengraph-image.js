import { ImageResponse } from "next/og";
import { getPublishedExecutionArticle } from "@/content/published-articles";
import { getExecutionPillar } from "@/content/editorial-backlog";

export const alt = "Autonomia — scénario IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;
  const article = getPublishedExecutionArticle(slug);
  const pillar = getExecutionPillar(slug);

  const title = article?.title || pillar?.title || "Autonomia";
  const kicker = article ? article.cluster : pillar ? `PILIER · ${pillar.cluster}` : "EXECUTION IA";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "#121313",
          color: "#F3F1E9",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}>
          <span>AUTONOMIA</span>
          <span style={{ color: "#C9FF55" }}>AI EXECUTION PARTNER</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ color: "#C9FF55", fontSize: 24, letterSpacing: 2 }}>{kicker}</div>
          <div style={{ fontSize: 58, lineHeight: 1.02, letterSpacing: -2, maxWidth: 1040 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, opacity: .7 }}>
          <span>Tester. Cadrer. Exécuter.</span>
          <span>studio-autonomia.com</span>
        </div>
      </div>
    ),
    size
  );
}
