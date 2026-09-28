import Link from "next/link";
import { publishedExecutionArticles } from "@/content/published-articles";
import { articlesForJourney } from "@/content/use-case-discovery";

const HUBS = [
  { href: "/cas-usage-ia/par-probleme", label: "Par problème" },
  { href: "/cas-usage-ia/par-metier", label: "Par métier" },
  { href: "/cas-usage-ia/par-secteur", label: "Par secteur" }
];

export default function UseCaseDiscoveryHub({
  eyebrow,
  title,
  intro,
  journeys,
  currentPath
}) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://build-autonomia.com";
  const itemList = journeys.flatMap((journey) =>
    articlesForJourney(journey, publishedExecutionArticles, 6).map((article) => ({
      journey,
      article
    }))
  );

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${base}${currentPath}#collection`,
        url: `${base}${currentPath}`,
        name: title,
        description: intro,
        isPartOf: {
          "@type": "CollectionPage",
          "@id": `${base}/cas-usage-ia#collection`
        }
      },
      {
        "@type": "ItemList",
        itemListElement: itemList.slice(0, 40).map(({ article }, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: article.title,
          url: `${base}/cas-usage-ia/${article.slug}`
        }))
      }
    ]
  };

  return (
    <main className="discoveryHub">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="discoveryHero">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>

        <nav className="discoveryNav" aria-label="Explorer les cas d’usage IA">
          {HUBS.map((hub) => (
            <Link
              key={hub.href}
              className={hub.href === currentPath ? "active" : ""}
              href={hub.href}
            >
              {hub.label}
            </Link>
          ))}
        </nav>
      </section>

      <section className="discoveryIntro">
        <p className="sectionIndex">NAVIGATION PAR INTENTION</p>
        <div>
          <h2>Partir de votre réalité, pas d’une technologie.</h2>
          <p>
            Chaque parcours regroupe des guides Autonomia déjà publiés autour d’un même
            besoin. L’objectif est de passer rapidement du problème concret au workflow,
            aux garde-fous, aux compétences et au métier expert pertinent.
          </p>
        </div>
      </section>

      <section className="discoveryJourneyGrid">
        {journeys.map((journey, journeyIndex) => {
          const articles = articlesForJourney(journey, publishedExecutionArticles, 6);

          return (
            <article className="discoveryJourney" key={journey.slug}>
              <div className="discoveryJourneyHead">
                <span>{String(journeyIndex + 1).padStart(2, "0")}</span>
                <div>
                  <p className="sectionIndex">{journey.title}</p>
                  <h2>{journey.title}</h2>
                  <p>{journey.description}</p>
                </div>
              </div>

              <div className="discoveryClusterTags">
                {journey.clusters.map((cluster) => (
                  <span key={cluster}>{cluster}</span>
                ))}
              </div>

              {articles.length > 0 && (
                <div className="discoveryArticleList">
                  {articles.map((article) => (
                    <Link href={"/cas-usage-ia/" + article.slug} key={article.slug}>
                      <span>{article.cluster}</span>
                      <strong>{article.title}</strong>
                      <b>→</b>
                    </Link>
                  ))}
                </div>
              )}

              <div className="discoveryJourneyFooter">
                {journey.href ? (
                  <Link href={journey.href}>Explorer l’univers dédié →</Link>
                ) : (
                  <Link href="/#solution-finder">Décrire mon besoin à AI Match →</Link>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <section className="discoveryClosing">
        <p className="sectionIndex">AUTONOMIA AI MATCH</p>
        <h2>Votre besoin ne rentre pas dans une case ?</h2>
        <p>
          Décrivez-le en langage naturel. Autonomia vous oriente vers le métier expert,
          la formation ou le cadrage adapté, à partir du travail que vous cherchez
          réellement à transformer.
        </p>
        <Link href="/#solution-finder">Trouver ma solution →</Link>
      </section>
    </main>
  );
}
