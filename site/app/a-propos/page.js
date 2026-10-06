import Link from "next/link";

export const metadata = {
  title: "À propos — L’expérience derrière Autonomia",
  description:
    "Découvrez l’expérience, les expertises et les références des équipes qui portent Autonomia : IA, transformation, digital, formation professionnelle et marchés publics.",
  alternates: { canonical: "/a-propos" }
};

const referenceGroups = [
  {
    label: "ENTREPRISES & MARQUES",
    items: [
      "Air France Industries",
      "BNP Paribas Personal Finance",
      "Symrise",
      "KRYS",
      "Wesco",
      "Westcon",
      "ATLAND",
      "OZITEM",
      "Mercure",
      "Novotel",
      "Franprix",
      "TILLI"
    ]
  },
  {
    label: "TECH & SERVICES",
    items: [
      "OROLIA",
      "Spectracom",
      "Garantme",
      "Equinoxe IT",
      "Fuzzy Logic Robotics",
      "Active International",
      "Potel & Chabot",
      "Cinéville"
    ]
  },
  {
    label: "COLLECTIVITÉS & INSTITUTIONS",
    items: [
      "CNFPT",
      "Ville de Bobigny",
      "Ville de Clichy",
      "Roumois Seine",
      "Grand Dole",
      "CCI Essonne"
    ]
  },
  {
    label: "ÉCOLES & UNIVERSITÉS",
    items: ["UPEC", "EDC Paris", "ESCG", "Pigier", "Efrei"]
  }
];

export default function AboutPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://build-autonomia.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}#organization`,
    name: "Autonomia",
    url: base,
    description:
      "AI Execution Partner réunissant des expertises en intelligence artificielle, transformation, formation professionnelle et marchés publics."
  };

  return (
    <main className="aboutPremium">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="aboutHeroPremium">
        <div className="aboutHeroEyebrow">
          <span>AUTONOMIA</span>
          <span>AI EXECUTION PARTNER</span>
        </div>

        <div className="aboutHeroGrid">
          <div>
            <h1>
              L’IA avec
              <span> l’expérience du terrain.</span>
            </h1>
          </div>

          <div className="aboutHeroSide">
            <p>
              AUTONOMIA réunit des parcours construits dans le digital, la transformation,
              la formation professionnelle, les marchés publics et l’accompagnement des organisations.
            </p>
            <p>
              Cette expérience sert une ambition simple : transformer l’intelligence artificielle
              en solutions réellement utilisables, déployables et adoptées par les équipes.
            </p>
            <div className="aboutHeroActions">
              <Link className="primaryButton" href="/contact">Parler de votre projet IA</Link>
              <Link className="secondaryButton" href="/solutions-ia">Voir ce que nous construisons</Link>
            </div>
          </div>
        </div>

        <div className="aboutHeroProof">
          <article><strong>18+</strong><span>années d’expertise marchés publics via ODEXIS</span></article>
          <article><strong>20</strong><span>ans environ de parcours digital, transformation et formation</span></article>
          <article><strong>3</strong><span>structures réunies sous une même marque opérationnelle</span></article>
          <article><strong>1</strong><span>point d’entrée pour trouver, construire et former</span></article>
        </div>
      </section>

      <section className="aboutWhy">
        <p className="sectionIndex">POURQUOI AUTONOMIA</p>
        <div className="aboutWhyLead">
          <h2>Une solution IA sérieuse commence bien avant le choix d’un outil.</h2>
          <p>
            Nous partons du métier, du processus, des responsabilités et du résultat attendu.
            Puis nous déterminons ce qui mérite d’être automatisé, assisté, sécurisé, confié à un agent
            ou simplement mieux outillé.
          </p>
        </div>

        <div className="aboutWhyGrid">
          <article>
            <span>01</span>
            <h3>Comprendre le travail réel</h3>
            <p>
              Les irritants, les étapes manuelles, les dépendances, les données disponibles,
              les validations humaines et les contraintes opérationnelles.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Construire ce qui sera utilisé</h3>
            <p>
              Agents IA, automatisations, assistants, RAG, mini-apps et workflows conçus autour
              des usages quotidiens plutôt qu’autour d’une démonstration technologique.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Déployer avec méthode</h3>
            <p>
              Gouvernance, droits d’accès, contrôle humain, documentation, conduite du changement
              et articulation avec les outils déjà présents dans l’organisation.
            </p>
          </article>
          <article>
            <span>04</span>
            <h3>Rendre les équipes autonomes</h3>
            <p>
              La formation intervient au bon moment : pour comprendre, prendre en main, faire évoluer
              et sécuriser les nouveaux usages.
            </p>
          </article>
        </div>
      </section>

      <section className="aboutBridge">
        <div className="aboutBridgeCopy">
          <p className="sectionIndex">NOTRE DIFFÉRENCE</p>
          <h2>Notre expérience permet de relier l’IA à la réalité de l’organisation.</h2>
        </div>

        <div className="aboutBridgeFlow">
          <div><small>01</small><strong>Besoin métier</strong><span>Ce qui bloque, coûte du temps ou limite la qualité.</span></div>
          <b>→</b>
          <div><small>02</small><strong>Architecture de solution</strong><span>Processus, données, outils, IA, contrôles.</span></div>
          <b>→</b>
          <div><small>03</small><strong>Exécution</strong><span>Expert, build, automatisation ou intégration.</span></div>
          <b>→</b>
          <div><small>04</small><strong>Adoption</strong><span>Formation, transfert, documentation et autonomie.</span></div>
        </div>
      </section>

      <section className="aboutCollectivePremium">
        <div className="aboutSectionIntro">
          <p className="sectionIndex">LE COLLECTIF</p>
          <div>
            <h2>Trois structures. Des expertises complémentaires. Une même exigence.</h2>
            <p>
              AUTONOMIA fonctionne comme une marque commune et un point d’entrée unique.
              Chaque mission s’appuie sur la structure et les compétences les plus adaptées au besoin.
            </p>
          </div>
        </div>

        <div className="aboutEntityGrid">
          <article>
            <div className="aboutEntityTop"><span>01</span><small>TRANSFORMATION & IA</small></div>
            <h3>DDG GROUPE</h3>
            <p>
              Pilotage, transformation, acquisition digitale, SEO/GEO, IA, automatisation,
              structuration d’offres et conduite de projets.
            </p>
            <ul>
              <li>Compréhension des enjeux business et métiers</li>
              <li>Cadrage des cas d’usage IA</li>
              <li>Pilotage de solutions et de partenaires</li>
              <li>Adoption et transformation des usages</li>
            </ul>
          </article>

          <article>
            <div className="aboutEntityTop"><span>02</span><small>SECTEUR PUBLIC & COMMANDE PUBLIQUE</small></div>
            <h3>ODEXIS</h3>
            <p>
              Conseil, accompagnement et formation en marchés publics depuis 2008,
              avec une connaissance concrète des contraintes des acteurs publics et des entreprises.
            </p>
            <ul>
              <li>Marchés publics et appels d’offres</li>
              <li>Assistance et conseil</li>
              <li>Formation et transmission</li>
              <li>Compréhension des environnements publics</li>
            </ul>
          </article>

          <article>
            <div className="aboutEntityTop"><span>03</span><small>FORMATION & COMPÉTENCES</small></div>
            <h3>MAJY ME</h3>
            <p>
              Formation professionnelle et montée en compétences autour de l’IA,
              avec certification Qualiopi et accompagnement des dispositifs de financement lorsque les critères sont réunis.
            </p>
            <ul>
              <li>Formations IA orientées usages</li>
              <li>Parcours intra-entreprise</li>
              <li>Accompagnement à l’adoption</li>
              <li>Montée en compétences des équipes</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="aboutFoundersPremium">
        <div className="aboutSectionIntro">
          <p className="sectionIndex">LES PARCOURS</p>
          <div>
            <h2>Une marque récente portée par des expériences déjà établies.</h2>
            <p>
              AUTONOMIA concentre des compétences construites sur des années de missions,
              de direction, de conseil, de formation et d’enseignement.
            </p>
          </div>
        </div>

        <div className="aboutFounderCards">
          <article>
            <div className="aboutFounderHead">
              <small>DÉBORAH DIAN GOLDCHER</small>
              <span>TRANSFORMATION · IA · DIGITAL · FORMATION</span>
            </div>
            <h3>Relier technologie, usages et performance.</h3>
            <p>
              Un parcours d’environ vingt ans entre acquisition digitale, SEO/SEA, pilotage,
              entrepreneuriat et formation professionnelle. Cette double culture business et transmission
              permet d’aborder l’IA par ce qu’elle change concrètement dans le travail.
            </p>
            <div className="aboutFounderTags">
              <span>IA & automatisation</span><span>SEO / GEO</span><span>Transformation</span>
              <span>Formation</span><span>Acquisition</span><span>Pilotage</span>
            </div>
            <div className="aboutFounderFoot">
              Interventions et expériences auprès de grands comptes, collectivités,
              écoles de commerce et universités.
            </div>
          </article>

          <article>
            <div className="aboutFounderHead">
              <small>SYLVAIN LE TURCQ</small>
              <span>MARCHÉS PUBLICS · AMO · FORMATION</span>
            </div>
            <h3>Comprendre les organisations publiques et leurs contraintes.</h3>
            <p>
              Fondateur d’ODEXIS, Sylvain accompagne depuis 2008 les entreprises et acteurs publics
              sur la commande publique, le conseil et la formation. Cette expertise apporte à AUTONOMIA
              une lecture particulièrement utile des projets IA destinés aux collectivités et organismes publics.
            </p>
            <div className="aboutFounderTags">
              <span>Commande publique</span><span>Appels d’offres</span><span>AMO</span>
              <span>Conseil</span><span>Formation</span><span>Secteur public</span>
            </div>
            <div className="aboutFounderFoot">
              Intervenant identifié notamment par la CCI Essonne comme consultant expert/formateur en marchés publics.
            </div>
          </article>
        </div>
      </section>

      <section className="aboutReferencesPremium">
        <div className="aboutSectionIntro">
          <p className="sectionIndex">RÉFÉRENCES</p>
          <div>
            <h2>Des expériences acquises auprès d’organisations très différentes.</h2>
            <p>
              Les références ci-dessous ont été acquises par les dirigeants et structures qui portent aujourd’hui AUTONOMIA,
              dans leur contexte contractuel d’origine.
            </p>
          </div>
        </div>

        <div className="aboutReferenceMatrix">
          {referenceGroups.map((group) => (
            <article key={group.label}>
              <small>{group.label}</small>
              <div>
                {group.items.map((item) => <span key={item}>{item}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="aboutSerious">
        <div className="aboutSeriousCopy">
          <p className="sectionIndex">EXIGENCE</p>
          <h2>La crédibilité d’un projet IA se joue dans l’exécution.</h2>
          <p>
            Nous privilégions les solutions explicables, documentées, testables et reliées à une responsabilité humaine claire.
            L’objectif est de construire des usages qui puissent être repris, contrôlés et améliorés dans le temps.
          </p>
        </div>

        <div className="aboutSeriousList">
          <div><span>01</span><strong>Pas de démonstration déconnectée du métier.</strong></div>
          <div><span>02</span><strong>Un périmètre, des responsabilités et des critères de réussite explicites.</strong></div>
          <div><span>03</span><strong>Des contrôles humains aux endroits où ils apportent de la valeur.</strong></div>
          <div><span>04</span><strong>Une documentation qui permet de maintenir et transmettre la solution.</strong></div>
          <div><span>05</span><strong>Une formation reliée aux usages réellement déployés.</strong></div>
        </div>
      </section>

      <section className="aboutFinalCta">
        <div>
          <p className="sectionIndex">TRAVAILLER AVEC AUTONOMIA</p>
          <h2>Vous avez un problème métier. Nous construisons le chemin vers la bonne solution IA.</h2>
        </div>
        <div className="aboutFinalActions">
          <Link className="primaryButton" href="/contact">Nous parler de votre besoin</Link>
          <Link className="secondaryButton" href="/experts">Trouver un expert IA</Link>
          <Link className="secondaryButton" href="/academy">Former vos équipes</Link>
        </div>
      </section>
    </main>
  );
}
