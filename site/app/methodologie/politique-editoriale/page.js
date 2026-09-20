import Link from "next/link";

export const metadata = {
  title: "Politique éditoriale et méthode de vérification",
  description: "Comment Autonomia sélectionne, produit, vérifie, met à jour et publie ses contenus SEO/GEO sur l’IA en entreprise.",
  alternates: { canonical: "/methodologie/politique-editoriale" }
};

export default function EditorialPolicyPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const url = `${base}/methodologie/politique-editoriale`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Politique éditoriale et méthode de vérification Autonomia",
    author: {
      "@type": "Organization",
      name: "Autonomia",
      url: `${base}/a-propos`
    },
    publisher: {
      "@type": "Organization",
      name: "Autonomia",
      url: base
    },
    mainEntityOfPage: url,
    datePublished: "2026-09-20",
    dateModified: "2026-09-20"
  };

  return (
    <main className="methodologyPage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="contentHubHero">
        <p className="eyebrow">AUTONOMIA / ÉDITORIAL</p>
        <h1>Comment nos contenus sont sélectionnés, produits et vérifiés.</h1>
        <p>
          L’objectif n’est pas de publier le plus de pages possible. Il est de créer des contenus
          assez précis pour aider une entreprise à comprendre ce qu’elle peut construire, apprendre
          ou décider — et assez transparents pour distinguer les faits vérifiés des scénarios proposés.
        </p>
      </section>

      <section className="pillarMethod">
        <p className="sectionIndex">MÉTHODE</p>
        <div>
          <h2>Une page passe plusieurs filtres avant de devenir indexable.</h2>
          <ol>
            <li><span>01</span><div><strong>Intention réelle</strong><p>Le sujet doit correspondre à une tâche, une question, une demande marché ou une capacité métier identifiable.</p></div></li>
            <li><span>02</span><div><strong>Recherche</strong><p>Les capacités d’outils, standards, pratiques ou plateformes citées sont vérifiées à partir de sources publiques appropriées.</p></div></li>
            <li><span>03</span><div><strong>Écriture structurée</strong><p>Le guide doit expliquer le système, la méthode, les limites, les garde-fous et la prochaine action utile — pas seulement répéter une définition.</p></div></li>
            <li><span>04</span><div><strong>Contrôle qualité</strong><p>Le CI bloque les pages qui ne respectent pas les minima éditoriaux, les sources, la profondeur, la structure ou les règles d’indexation.</p></div></li>
            <li><span>05</span><div><strong>Publication</strong><p>Seuls les guides promus dans le registre éditorial deviennent des URL longues indexables et entrent dans le sitemap.</p></div></li>
            <li><span>06</span><div><strong>Mesure et mise à jour</strong><p>Les impressions, citations IA, clics, leads et changements de marché servent à décider quelles pages renforcer, fusionner, actualiser ou laisser en backlog.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="contentHubIntro">
        <p className="sectionIndex">ASSISTANCE IA</p>
        <div>
          <h2>Des outils d’IA peuvent assister la production. Ils ne remplacent pas la responsabilité éditoriale.</h2>
          <p>
            Autonomia peut utiliser des outils d’IA pour aider à structurer une recherche, générer une première
            trame, comparer des formulations, repérer des liens sémantiques ou accélérer une partie de la rédaction.
            Une page n’est cependant publiée que si sa structure, ses sources, ses affirmations et sa place dans
            l’architecture éditoriale passent les contrôles prévus.
          </p>
        </div>
      </section>

      <section className="pillarBridge">
        <p className="sectionIndex">TRANSPARENCE</p>
        <div>
          <h2>Ce que nous ne voulons pas publier.</h2>
          <p>
            Faux cas clients, chiffres non mesurés, délais inventés, volumes d’experts non vérifiés,
            pages clonées par ville ou synonymes, faux auteurs, recommandations d’outils sans source,
            ou 400 pages créées uniquement pour occuper 400 requêtes.
          </p>
          <div className="closingActions">
            <Link className="primaryButton" href="/a-propos">À propos d’Autonomia</Link>
            <Link className="secondaryButton" href="/cas-usage-ia">Explorer les cas d’usage</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
