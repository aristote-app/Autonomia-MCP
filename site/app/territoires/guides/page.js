import Link from "next/link";
import { territoryPillars } from "@/content/territory-editorial";
import { publishedTerritoryArticles } from "@/content/published-articles";

export const metadata = {
  title: "Guides IA pour communautés de communes et agglomérations",
  description: "Guides de fond Autonomia pour construire une stratégie IA territoriale, former les agents, sécuriser les usages et accompagner les TPE-PME locales.",
  alternates: { canonical: "/territoires/guides" }
};

export default function TerritoryGuidesPage() {
  const published = new Map(publishedTerritoryArticles.map((article) => [article.slug, article]));
  return (
    <main className="contentHub territoryHub">
      <section className="contentHubHero">
        <p className="eyebrow">AUTONOMIA TERRITOIRES · BASE DE CONNAISSANCES</p>
        <h1>IA territoriale : guides de fond pour passer des intentions aux usages.</h1>
        <p>
          Feuille de route, agents, gouvernance, formation et développement économique :
          les contenus sont organisés autour des décisions concrètes que doivent prendre les
          communautés de communes et communautés d’agglomération.
        </p>
        <div className="articleEditorialMeta">
          <span>{publishedTerritoryArticles.length} guide(s) complet(s) publié(s)</span>
          <span>{territoryPillars.length} piliers territoriaux suivis</span>
          <Link href="/methodologie/politique-editoriale">Méthode éditoriale</Link>
        </div>
      </section>

      <section className="pillarScenarioGrid">
        <p className="sectionIndex">PILIERS</p>
        <div>
          <h2>Explorer par enjeu territorial.</h2>
          <div className="pillarTopicList">
            {territoryPillars.map((pillar, index) => (
              <Link key={pillar.slug} href={`/territoires/guides/${pillar.slug}`} className="pillarTopic published">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{pillar.title}</strong>
                <b>Voir le pilier →</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="articleRelated">
        <p className="sectionIndex">DERNIERS GUIDES</p>
        <h2>Contenus déjà vérifiés et publiés.</h2>
        <div className="articleRelatedGrid">
          {publishedTerritoryArticles.map((article) => (
            <Link key={article.slug} href={`/territoires/guides/${article.slug}`} className="articleRelatedCard">
              <small>{article.cluster}</small>
              <strong>{article.title}</strong>
              <span>Lire le guide →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
