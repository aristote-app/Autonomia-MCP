import Link from "next/link";

export const metadata = {
  title: "À propos — Le groupement Autonomia",
  description:
    "AUTONOMIA est un groupement de compétences réunissant IA, transformation, marchés publics et formation professionnelle pour transformer les usages en performance.",
  alternates: { canonical: "/a-propos" }
};

const refs = {
  entreprises: [
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
    "TILLI",
    "OROLIA",
    "Spectracom"
  ],
  public: [
    "CNFPT",
    "Ville de Bobigny",
    "Ville de Clichy",
    "Roumois Seine",
    "Grand Dole",
    "CCI Essonne"
  ],
  education: ["UPEC", "EDC Paris", "ESCG", "Pigier", "Efrei"]
};

export default function AboutPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://build-autonomia.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}#organization`,
    name: "Autonomia",
    url: base,
    description:
      "Groupement de compétences réunissant intelligence artificielle, transformation, marchés publics et formation professionnelle."
  };

  return (
    <main className="aboutMarketing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="aboutMarketingHero">
        <div className="aboutMarketingTopline">
          <span>AUTONOMIA</span>
          <span>GROUPEMENT DE COMPÉTENCES · AI EXECUTION PARTNER</span>
        </div>

        <div className="aboutMarketingHeroGrid">
          <div>
            <p className="eyebrow">À PROPOS</p>
            <h1>
              Un groupement de compétences
              <span> pour transformer l’IA en résultats.</span>
            </h1>
          </div>

          <div className="aboutMarketingHeroCopy">
            <p className="aboutMarketingLead">
              AUTONOMIA réunit <strong>DDG GROUPE, ODEXIS et MAJY ME</strong> sous une même marque
              pour combiner transformation, intelligence artificielle, commande publique et formation.
            </p>
            <p>
              L’intérêt du groupement est simple : mobiliser la bonne compétence au bon moment,
              sans multiplier les interlocuteurs, puis aller jusqu’à l’exécution et à l’adoption.
            </p>
            <div className="aboutMarketingActions">
              <Link className="primaryButton" href="/contact">Parler de votre projet IA</Link>
              <Link className="secondaryButton" href="/solutions-ia">Voir les solutions IA</Link>
            </div>
          </div>
        </div>

        <div className="aboutMarketingProof">
          <article>
            <strong>20+ ans</strong>
            <span>d’expérience chacun pour les deux dirigeants</span>
          </article>
          <article>
            <strong>3 structures</strong>
            <span>réunies pour croiser les expertises</span>
          </article>
          <article>
            <strong>1 interlocuteur</strong>
            <span>pour cadrer, construire, trouver et former</span>
          </article>
        </div>
      </section>

      <section className="aboutMarketingAlliance">
        <div className="aboutMarketingHeading">
          <p className="sectionIndex">POURQUOI UN GROUPEMENT ?</p>
          <div>
            <h2>Parce qu’un projet IA dépasse largement la technologie.</h2>
            <p>
              Une solution utile doit comprendre le métier, tenir compte des contraintes de l’organisation,
              trouver les bonnes compétences, s’intégrer aux outils existants et être adoptée par les équipes.
              AUTONOMIA rassemble ces capacités dans un même dispositif.
            </p>
          </div>
        </div>

        <div className="aboutMarketingPillars">
          <article>
            <small>DDG GROUPE</small>
            <h3>Transformer & construire</h3>
            <p>
              Stratégie, IA, automatisation, SEO/GEO, digital, cadrage métier et pilotage de projets.
            </p>
          </article>
          <article>
            <small>ODEXIS</small>
            <h3>Comprendre le public & sécuriser</h3>
            <p>
              Commande publique, marchés publics, conseil, AMO et compréhension des environnements institutionnels.
            </p>
          </article>
          <article>
            <small>MAJY ME</small>
            <h3>Former & faire adopter</h3>
            <p>
              Formation professionnelle IA, montée en compétences et accompagnement à l’appropriation des nouveaux usages.
            </p>
          </article>
        </div>

        <p className="aboutMarketingLegal">
          AUTONOMIA est une marque commune portée par plusieurs structures juridiquement indépendantes.
          La structure contractante est identifiée sur chaque proposition et chaque mission.
        </p>
      </section>

      <section className="aboutMarketingValue">
        <div className="aboutMarketingValueCopy">
          <p className="sectionIndex">CE QUE ÇA CHANGE POUR VOUS</p>
          <h2>Un seul partenaire pour passer du besoin métier à l’usage réel.</h2>
        </div>

        <div className="aboutMarketingValueGrid">
          <article>
            <span>01</span>
            <small>TROUVER</small>
            <h3>Les bonnes compétences IA</h3>
            <p>
              Nous identifions les profils capables de cadrer, construire, intégrer ou accélérer votre projet.
            </p>
          </article>
          <article>
            <span>02</span>
            <small>CONSTRUIRE</small>
            <h3>La solution utile</h3>
            <p>
              Agents IA, automatisations, assistants, RAG, mini-apps et workflows reliés à un vrai problème métier.
            </p>
          </article>
          <article>
            <span>03</span>
            <small>FORMER</small>
            <h3>Les équipes qui l’utiliseront</h3>
            <p>
              Nous transformons le déploiement en compétence durable : prise en main, méthodes, gouvernance et autonomie.
            </p>
          </article>
        </div>
      </section>

      <section className="aboutMarketingPeople">
        <div className="aboutMarketingHeading">
          <p className="sectionIndex">20+ ANS D’EXPÉRIENCE CHACUN</p>
          <div>
            <h2>Deux parcours complémentaires derrière le groupement.</h2>
            <p>
              L’un apporte une culture transformation, business, digital et formation.
              L’autre une expertise profonde de la commande publique, du conseil et de l’accompagnement des organisations.
            </p>
          </div>
        </div>

        <div className="aboutMarketingPeopleGrid">
          <article>
            <div className="aboutMarketingPersonTop">
              <small>DÉBORAH DIAN GOLDCHER</small>
              <span>TRANSFORMATION · IA · DIGITAL · FORMATION</span>
            </div>
            <h3>Transformer les usages en performance.</h3>
            <p>
              Plus de 20 ans d’expérience entre acquisition digitale, SEO/SEA, pilotage,
              entrepreneuriat, formation professionnelle et transformation des organisations.
              Une approche orientée business : partir du besoin, construire le bon dispositif et mesurer l’utilité réelle.
            </p>
            <div className="aboutMarketingTags">
              <span>IA & automatisation</span>
              <span>SEO / GEO</span>
              <span>Transformation</span>
              <span>Formation</span>
              <span>Pilotage</span>
            </div>
          </article>

          <article>
            <div className="aboutMarketingPersonTop">
              <small>SYLVAIN LE TURCQ</small>
              <span>MARCHÉS PUBLICS · CONSEIL · AMO · FORMATION</span>
            </div>
            <h3>Faire avancer les projets dans des environnements exigeants.</h3>
            <p>
              Plus de 20 ans d’expérience dans l’accompagnement des entreprises et acteurs publics,
              les marchés publics, le conseil et la formation. Une expertise particulièrement forte pour les projets
              IA destinés aux collectivités, organismes publics et entreprises qui travaillent avec eux.
            </p>
            <div className="aboutMarketingTags">
              <span>Commande publique</span>
              <span>Appels d’offres</span>
              <span>AMO</span>
              <span>Conseil</span>
              <span>Secteur public</span>
            </div>
          </article>
        </div>
      </section>

      <section className="aboutMarketingReferences">
        <div className="aboutMarketingReferencesHead">
          <div>
            <p className="sectionIndex">RÉFÉRENCES</p>
            <h2>Une expérience construite auprès d’organisations de premier plan.</h2>
          </div>
          <p>
            Ces références ont été acquises par les dirigeants et les structures qui portent aujourd’hui AUTONOMIA,
            dans leur contexte contractuel d’origine.
          </p>
        </div>

        <div className="aboutMarketingReferenceRows">
          <div>
            <small>ENTREPRISES & MARQUES</small>
            <p>{refs.entreprises.join(" · ")}</p>
          </div>
          <div>
            <small>COLLECTIVITÉS & INSTITUTIONS</small>
            <p>{refs.public.join(" · ")}</p>
          </div>
          <div>
            <small>ÉCOLES & UNIVERSITÉS</small>
            <p>{refs.education.join(" · ")}</p>
          </div>
        </div>
      </section>

      <section className="aboutMarketingClosing">
        <div>
          <p className="sectionIndex">AUTONOMIA</p>
          <h2>Plus de compétences réunies. Moins de complexité pour vous.</h2>
          <p>
            Un problème métier, un besoin de compétences, une solution à construire ou des équipes à former :
            nous mobilisons le bon assemblage d’expertises pour avancer.
          </p>
        </div>
        <div className="aboutMarketingClosingActions">
          <Link className="primaryButton" href="/contact">Nous parler de votre besoin</Link>
          <Link className="secondaryButton" href="/experts">Voir les experts IA</Link>
          <Link className="secondaryButton" href="/academy">Voir les formations IA</Link>
        </div>
      </section>
    </main>
  );
}
