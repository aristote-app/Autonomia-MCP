import Link from "next/link";
import LiveJobSignals from "@/components/LiveJobSignals";
import { trainingBacklog } from "@/content/editorial-backlog";
import { publishedTrainingArticles } from "@/content/published-articles";

export const metadata = {
  title: "Cas d’usage de formation IA en entreprise",
  description:
    "200 scénarios de formation IA par métier, outil et compétence : ChatGPT, Copilot, automatisation no-code, agents IA, management, RH, vente et plus.",
  alternates: { canonical: "/formation-ia/cas-usage" }
};

export default function TrainingUseCaseHub() {
  const publishedSlugs = new Set(publishedTrainingArticles.map((article) => article.slug));
  const clusters = [...new Set(trainingBacklog.map((item) => item.cluster))];

  return (
    <main className="contentHub trainingHub">
      <section className="contentHubHero">
        <p className="eyebrow">AUTONOMIA ACADEMY — BIBLIOTHÈQUE</p>
        <h1>Ce que vos équipes peuvent apprendre à faire avec l’IA.</h1>
        <p>
          Des scénarios de formation construits autour d’un usage professionnel précis,
          pas autour d’une démonstration générique d’outil.
        </p>
      </section>

      <section className="contentHubIntro">
        <p className="sectionIndex">200 SCÉNARIOS</p>
        <div>
          <h2>Un besoin métier = une compétence à transférer.</h2>
          <p>
            Chaque page explique la situation de travail, les objectifs pédagogiques,
            le niveau requis, l’atelier pratique, les garde-fous et ce que le participant
            doit être capable de refaire seul.
          </p>
        </div>
      </section>

      <LiveJobSignals tags={["automation", "agents", "rag", "copilot", "n8n", "governance", "change_adoption"]} />

      <section className="clusterGrid">
        {clusters.map((cluster) => {
          const items = trainingBacklog.filter((item) => item.cluster === cluster);
          return (
            <article key={cluster}>
              <p className="sectionIndex">{cluster}</p>
              <h2><Link href={`/formation-ia/cas-usage/${items[0]?.clusterSlug}`}>{items[0]?.pillar}</Link></h2>
              <ul>
                {items.map((item) => (
                  <li key={item.slug}>
                    {publishedSlugs.has(item.slug) ? (
                      <Link href={`/formation-ia/cas-usage/${item.slug}`}>{item.title}</Link>
                    ) : (
                      <span>{item.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>
    </main>
  );
}
