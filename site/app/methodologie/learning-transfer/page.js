import Link from "next/link";
import MethodologyFramework from "@/components/MethodologyFramework";

export const metadata = {
  title: "Matrice Autonomia de transfert de compétences IA",
  description: "Une méthode en quatre couches — tâche, méthode, garde-fous, transfert — pour transformer une formation IA en capacité réutilisable au travail.",
  alternates: { canonical: "/methodologie/learning-transfer" }
};

export default function LearningTransferPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const url = `${base}/methodologie/learning-transfer`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Matrice Autonomia de transfert de compétences IA",
        description: "Tâche, méthode, garde-fous et transfert : quatre couches pour construire une formation IA qui modifie réellement le travail.",
        author: { "@type": "Organization", name: "Autonomia Academy" },
        publisher: { "@type": "Organization", name: "Autonomia" },
        mainEntityOfPage: url
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Autonomia", item: base },
          { "@type": "ListItem", position: 2, name: "Méthodologie", item: url }
        ]
      }
    ]
  };

  return (
    <main className="methodologyPage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="contentHubHero">
        <p className="eyebrow">AUTONOMIA ACADEMY / MÉTHODOLOGIE</p>
        <h1>La Matrice Autonomia de transfert de compétences IA.</h1>
        <p>
          Une formation IA devient utile lorsque le participant sait refaire une méthode dans son travail,
          avec les bons garde-fous, puis l’adapter à une situation nouvelle.
        </p>
      </section>

      <section className="contentHubIntro">
        <p className="sectionIndex">EN BREF</p>
        <div>
          <h2>Une démonstration impressionne. Une compétence se reproduit.</h2>
          <p>
            La matrice relie quatre niveaux : la tâche réelle, la méthode à répéter, les règles à appliquer
            et la capacité à transférer l’apprentissage. Elle évite de confondre satisfaction, prise en main
            d’un outil et véritable autonomie professionnelle.
          </p>
        </div>
      </section>

      <MethodologyFramework mode="learning" />

      <section className="pillarMethod">
        <p className="sectionIndex">COMMENT L’UTILISER</p>
        <div>
          <h2>Un exemple : apprendre à produire une synthèse fiable avec l’IA.</h2>
          <ol>
            <li><span>01</span><div><strong>Tâche</strong><p>Le participant doit synthétiser un dossier long pour un manager, avec un niveau de précision défini.</p></div></li>
            <li><span>02</span><div><strong>Méthode</strong><p>Il apprend à cadrer l’objectif, fournir le bon contexte, demander un format, contrôler les points importants et corriger.</p></div></li>
            <li><span>03</span><div><strong>Garde-fous</strong><p>Il sait identifier les données sensibles, vérifier les faits, distinguer résumé et interprétation et documenter ses sources.</p></div></li>
            <li><span>04</span><div><strong>Transfert</strong><p>Il doit ensuite appliquer la même logique à un compte rendu, une veille ou une note d’aide à la décision.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="pillarBridge">
        <p className="sectionIndex">POUR ALLER PLUS LOIN</p>
        <div>
          <h2>Voir la matrice appliquée à des situations d’apprentissage concrètes.</h2>
          <div className="closingActions">
            <Link className="primaryButton" href="/formation-ia/cas-usage">Explorer les cas de formation</Link>
            <Link className="secondaryButton" href="/academy">Explorer Autonomia Academy</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
