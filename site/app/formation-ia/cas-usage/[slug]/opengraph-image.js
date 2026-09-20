import { ImageResponse } from "next/og";
import { getPublishedTrainingArticle } from "@/content/published-articles";
import { getTrainingPillar } from "@/content/editorial-backlog";

export const alt = "Autonomia Academy — scénario de formation IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;
  const article = getPublishedTrainingArticle(slug);
  const pillar = getTrainingPillar(slug);

  const title = article?.title || pillar?.title || "Autonomia Academy";
  const kicker = article ? article.cluster : pillar ? `PILIER · ${pillar.cluster}` : "FORMATION IA";

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
          background: "#F3F1E9",
          color: "#121313",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}>
          <span>AUTONOMIA ACADEMY</span>
          <span style={{ background: "#C9FF55", padding: "8px 12px" }}>CAPACITÉ INTERNE</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 24, letterSpacing: 2 }}>{kicker}</div>
          <div style={{ fontSize: 58, lineHeight: 1.02, letterSpacing: -2, maxWidth: 1040 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, opacity: .65 }}>
          <span>Comprendre. Pratiquer. Transférer.</span>
          <span>studio-autonomia.com</span>
        </div>
      </div>
    ),
    size
  );
}
