import Link from "next/link";
import MethodologyFramework from "@/components/MethodologyFramework";

export const metadata = {
  title: "Matrice Autonomia d’exécution IA",
  description: "Une méthode en quatre couches — processus, interprétation, action, contrôle — pour cadrer une automatisation, un agent ou un produit IA.",
  alternates: { canonical: "/methodologie/execution-matrix" }
};

export default function ExecutionMatrixPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const url = `${base}/methodologie/execution-matrix`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Matrice Autonomia d’exécution IA",
        description: "Processus, interprétation, action et contrôle : quatre couches pour cadrer l’exécution IA sans choisir l’outil avant le problème.",
        author: { "@type": "Organization", name: "Autonomia" },
        publisher: { "@type": "Organization", name: "Autonomia" },
        mainEntityOfPage: url
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Autonomia", item: base },
          { "@type": "ListItem", position: 2, name: "Méthodologie", item: `${base}/methodologie/execution-matrix` }
        ]
      }
    ]
  };

  return (
    <main className="methodologyPage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="contentHubHero">
        <p className="eyebrow">AUTONOMIA / MÉTHODOLOGIE</p>
        <h1>La Matrice Autonomia d’exécution IA.</h1>
        <p>
          Un projet IA devient beaucoup plus lisible lorsqu’on sépare quatre questions :
          quel processus existe, où l’IA interprète, quelles actions sont autorisées et où
          le contrôle humain doit intervenir.
        </p>
      </section>

      <section className="contentHubIntro">
        <p className="sectionIndex">EN BREF</p>
        <div>
          <h2>Ne commencez pas par “quel modèle ?”. Commencez par “quel travail doit changer ?”.</h2>
          <p>
            La matrice n’est pas un score de maturité et ne prétend pas valider un projet à elle seule.
            Elle sert à rendre le besoin discutable : distinguer logique déterministe et interprétation IA,
            définir les droits d’action, prévoir les exceptions et rendre les responsabilités visibles.
          </p>
        </div>
      </section>

      <MethodologyFramework mode="execution" />

      <section className="pillarMethod">
        <p className="sectionIndex">COMMENT L’UTILISER</p>
        <div>
          <h2>Un exemple : automatiser une demande reçue par e-mail.</h2>
          <ol>
            <li><span>01</span><div><strong>Processus</strong><p>Un e-mail arrive, contient une demande et parfois une pièce jointe. Aujourd’hui une personne lit, classe, crée une tâche et répond.</p></div></li>
            <li><span>02</span><div><strong>Interprétation</strong><p>L’IA peut extraire le type de demande, le dossier concerné et l’action attendue lorsque le texte n’est pas structuré.</p></div></li>
            <li><span>03</span><div><strong>Action</strong><p>Le workflow peut classer le document, créer une tâche et préparer un brouillon ; il n’a pas besoin d’envoyer automatiquement une réponse.</p></div></li>
            <li><span>04</span><div><strong>Contrôle</strong><p>Si le dossier est ambigu, si une donnée manque ou si l’action est sensible, le système bascule vers une validation humaine.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="pillarBridge">
        <p className="sectionIndex">POUR ALLER PLUS LOIN</p>
        <div>
          <h2>Voir la matrice appliquée à des situations réelles.</h2>
          <div className="closingActions">
            <Link className="primaryButton" href="/cas-usage-ia">Explorer les cas d’usage</Link>
            <Link className="secondaryButton" href="/experts">Explorer Autonomia Experts</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
