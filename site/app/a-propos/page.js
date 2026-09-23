import Link from "next/link";

export const metadata = {
  title: "À propos d’Autonomia",
  description: "Autonomia est un AI Execution Partner qui relie besoins métier, expertise externe, montée en compétences et exécution IA.",
  alternates: { canonical: "/a-propos" }
};

export default function AboutPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const url = `${base}/a-propos`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}#organization`,
    name: "Autonomia",
    url: base,
    description:
      "AI Execution Partner : expertise IA externe, formation IA en entreprise, diagnostic d’exécution et contenus pratiques autour du déploiement de l’IA."
  };

  return (
    <main className="methodologyPage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="contentHubHero">
        <p className="eyebrow">AUTONOMIA / À PROPOS</p>
        <h1>La force d’exécution IA.</h1>
        <p>
          Autonomia aide les entreprises à transformer un besoin IA en capacité d’exécution :
          compétences externes lorsqu’il faut construire ou accélérer, montée en compétences
          lorsqu’il faut rendre l’organisation autonome.
        </p>
      </section>

      <section className="contentHubIntro">
        <p className="sectionIndex">POSITIONNEMENT</p>
        <div>
          <h2>Ni marketplace de CV, ni catalogue de formations.</h2>
          <p>
            Le point de départ est le travail à accomplir : résultat attendu, processus, données,
            contraintes, niveau d’autonomie, risques et compétences nécessaires. L’objectif est
            ensuite de déterminer s’il faut mobiliser un expert, former une équipe, combiner les deux
            ou commencer par clarifier le besoin.
          </p>
        </div>
      </section>

      <section className="pillarMethod">
        <p className="sectionIndex">RESPONSABILITÉ ÉDITORIALE</p>
        <div>
          <h2>Les contenus sont publiés sous la responsabilité d’Autonomia.</h2>
          <ol>
            <li><span>01</span><div><strong>Sources</strong><p>Les guides publiés comportent des sources vérifiables lorsque des capacités, outils ou pratiques externes sont décrits.</p></div></li>
            <li><span>02</span><div><strong>Distinction faits / scénarios</strong><p>Les scénarios Autonomia sont explicitement présentés comme des architectures ou méthodes proposées, pas comme des cas clients inventés.</p></div></li>
            <li><span>03</span><div><strong>Contrôle humain</strong><p>Les pages traitant d’automatisation ou d’agents précisent les validations, limites et exceptions lorsque cela est pertinent.</p></div></li>
            <li><span>04</span><div><strong>Mise à jour</strong><p>Les pages publiées portent une date de publication et une date de modification pour rendre la fraîcheur éditoriale visible.</p></div></li>
          </ol>
          <div className="closingActions">
            <Link className="primaryButton" href="/methodologie/politique-editoriale">Lire la politique éditoriale</Link>
            <Link className="secondaryButton" href="/methodologie/execution-matrix">Voir la méthode d’exécution</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
