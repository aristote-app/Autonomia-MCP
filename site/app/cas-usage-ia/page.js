import Link from "next/link";
import LiveJobSignals from "@/components/LiveJobSignals";
import { executionBacklog } from "@/content/editorial-backlog";
import { publishedExecutionArticles } from "@/content/published-articles";

export const metadata = {
  title: "Cas d’usage IA en entreprise — scénarios concrets",
  description:
    "Découvrez des scénarios d’IA et d’automatisation concrets pour les e-mails, documents, ventes, opérations, support, reporting et knowledge management.",
  alternates: { canonical: "/cas-usage-ia" }
};

export default function UseCaseHub() {
  const publishedSlugs = new Set(publishedExecutionArticles.map((article) => article.slug));
  const clusters = [...new Set(executionBacklog.map((item) => item.cluster))];

  return (
    <main className="contentHub">
      <section className="contentHubHero">
        <p className="eyebrow">BIBLIOTHÈQUE AUTONOMIA</p>
        <h1>Ce que l’IA peut réellement faire dans votre entreprise.</h1>
        <p>
          Des scénarios concrets, techniques sans être réservés aux développeurs,
          conçus pour partir d’un travail réel et montrer comment l’IA, les automatisations
          et les outils déjà présents dans l’entreprise peuvent être assemblés.
        </p>
      </section>

      <section className="contentHubIntro">
        <p className="sectionIndex">200 SCÉNARIOS</p>
        <div>
          <h2>Pas des idées abstraites. Des systèmes imaginables.</h2>
          <p>
            Chaque scénario a vocation à expliquer le workflow, les outils possibles,
            les données nécessaires, les validations humaines, les risques et ce qu’il faut
            réellement savoir construire.
          </p>
        </div>
      </section>

      <LiveJobSignals tags={["automation", "agents", "rag", "n8n", "workflow_orchestration", "process_integration", "knowledge_management"]} />
      <div className="hubObservatoryLink">
        <Link href="/observatoire-ia">Explorer l’Observatoire Autonomia de la demande IA →</Link>
      </div>

      <section className="clusterGrid">
        {clusters.map((cluster) => {
          const items = executionBacklog.filter((item) => item.cluster === cluster);
          return (
            <article key={cluster}>
              <p className="sectionIndex">{cluster}</p>
              <h2><Link href={`/cas-usage-ia/${items[0]?.clusterSlug}`}>{items[0]?.pillar}</Link></h2>
              <ul>
                {items.map((item) => (
                  <li key={item.slug}>
                    {publishedSlugs.has(item.slug) ? (
                      <Link href={`/cas-usage-ia/${item.slug}`}>{item.title}</Link>
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
