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

      <section className="collectiveSection">
        <div className="sectionHeading">
          <p className="sectionIndex">LE COLLECTIF</p>
          <div>
            <h2>Trois structures. Une même capacité d’exécution.</h2>
            <p>
              AUTONOMIA est une marque commune qui réunit des expertises complémentaires en intelligence
              artificielle, transformation, marchés publics et formation professionnelle.
            </p>
          </div>
        </div>

        <div className="collectiveGrid">
          <article>
            <span>01</span>
            <h3>DDG GROUPE</h3>
            <p>IA, transformation, conseil, pilotage de projets et développement des offres AUTONOMIA.</p>
          </article>
          <article>
            <span>02</span>
            <h3>ODEXIS</h3>
            <p>Marchés publics, secteur public, conseil, formation et assistance à maîtrise d’ouvrage depuis 2008.</p>
          </article>
          <article>
            <span>03</span>
            <h3>MAJY ME</h3>
            <p>Formation professionnelle, IA et développement des compétences, avec certification Qualiopi.</p>
          </article>
        </div>
      </section>

      <section className="foundersSection">
        <div className="sectionHeading">
          <p className="sectionIndex">EXPÉRIENCE</p>
          <div>
            <h2>Des parcours construits avant AUTONOMIA.</h2>
            <p>
              La marque est récente. Les compétences, les références et l’expérience réunies derrière elle
              ont été construites au fil de missions, d’entreprises, de collectivités et d’établissements
              d’enseignement supérieur.
            </p>
          </div>
        </div>

        <div className="founderGrid">
          <article>
            <small>DÉBORAH DIAN GOLDCHER</small>
            <h3>Transformation · IA · Digital · Formation</h3>
            <p>
              Près de 20 ans de parcours professionnel entre acquisition digitale, SEO/SEA, transformation,
              entrepreneuriat et formation. Interventions auprès d’entreprises, collectivités, écoles de commerce
              et universités.
            </p>
          </article>
          <article>
            <small>SYLVAIN LE TURCQ</small>
            <h3>Commande publique · Marchés publics · AMO</h3>
            <p>
              Fondateur d’ODEXIS, structure créée en 2008 et spécialisée dans l’accompagnement, le conseil
              et la formation autour des marchés publics et de la commande publique.
            </p>
          </article>
        </div>
      </section>

      <section className="aboutReferences">
        <div className="sectionHeading">
          <p className="sectionIndex">RÉFÉRENCES</p>
          <div>
            <h2>Des expériences auprès d’organisations de premier plan.</h2>
            <p>
              Ces références ont été acquises par les dirigeants et les structures qui portent aujourd’hui
              AUTONOMIA. Elles sont rattachées à leur contexte contractuel d’origine.
            </p>
          </div>
        </div>

        <div className="referenceFamilies">
          <article>
            <small>GRANDS GROUPES & MARQUES</small>
            <p>Air France Industries · BNP Paribas Personal Finance · Symrise · KRYS · Wesco · Westcon · Mercure · Novotel · Franprix</p>
          </article>
          <article>
            <small>TECH & SERVICES</small>
            <p>OROLIA · Spectracom · OZITEM · Garantme · Equinoxe IT · Fuzzy Logic Robotics · TILLI · Active International</p>
          </article>
          <article>
            <small>SECTEUR PUBLIC</small>
            <p>Ville de Bobigny · Ville de Clichy · Roumoiseine · CNFPT</p>
          </article>
          <article>
            <small>ENSEIGNEMENT SUPÉRIEUR</small>
            <p>Université Paris-Est Créteil · EDC Paris · ESCG · Pigier · EfreiTech</p>
          </article>
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
