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
            <div className="aboutEntityLogo aboutEntityLogoDdg"><img src="/brand/ddg-groupe.webp" alt="DDG GROUPE" /></div>
            <h3>Transformer & construire</h3>
            <p>
              Stratégie, IA, automatisation, SEO/GEO, digital, cadrage métier et pilotage de projets.
            </p>
          </article>
          <article>
            <div className="aboutEntityLogo aboutEntityLogoOdexis"><img src="/brand/odexis.webp" alt="ODEXIS" /></div>
            <h3>Comprendre le public & sécuriser</h3>
            <p>
              Commande publique, marchés publics, conseil, AMO et compréhension des environnements institutionnels.
            </p>
          </article>
          <article>
            <div className="aboutEntityLogo aboutEntityLogoMajy"><img src="/brand/majy-me.webp" alt="MAJY ME" /></div>
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
          <p className="sectionIndex">LES EXPERTISES DIRIGEANTES</p>
          <div>
            <h2>Deux experts. Plus de 20 ans d’expérience chacun. Des compétences qui se complètent.</h2>
            <p>
              AUTONOMIA associe une expertise forte de la transformation digitale, du marketing, de l’IA et de la formation
              à une expertise reconnue de la commande publique, du conseil et de l’accompagnement des organisations.
            </p>
          </div>
        </div>

        <div className="aboutMarketingPeopleGrid aboutMarketingPeopleGridExpert">
          <article className="aboutExpertCard">
            <div className="aboutMarketingPersonTop">
              <div>
                <small className="aboutExpertName">DÉBORAH DIAN GOLDCHER</small>
                <span>DIGITAL · MARKETING · TRANSFORMATION · IA · FORMATION</span>
              </div>
              <a
                className="aboutLinkedIn"
                href="https://fr.linkedin.com/in/deborahdiangoldcher"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Voir le profil LinkedIn de Déborah Dian Goldcher"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.93v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.54 9H7.1v11.45H3.54V9Z"/>
                </svg>
                
              </a>
            </div>

            <h3>Du digital à l’IA : transformer les usages en performance.</h3>
            <p className="aboutExpertIntro">
              Plus de 20 ans d’expérience au croisement du marketing digital, de la technologie,
              de la gestion de projet et de la formation. Déborah a d’abord construit son expertise
              sur l’acquisition, le SEO/SEA, l’analytics, l’UX et les projets web en interface avec les DSI,
              avant de diriger des organismes de formation. Aujourd’hui, ce parcours converge naturellement
              vers la transformation IA des organisations.
            </p>

            <div className="aboutExpertSplit">
              <div>
                <small>EXPERTISES</small>
                <ul>
                  <li><strong>Marketing digital</strong><span>SEO/GEO, SEA, webmarketing multicanal, analytics, UX, contenus et pilotage des KPI.</span></li>
                  <li><strong>Digital & Tech</strong><span>Cahiers des charges fonctionnels, expression des besoins, coordination avec les DSI, recette et évolution d’outils digitaux.</span></li>
                  <li><strong>Transformation IA</strong><span>Identification de cas d’usage, automatisation, agents IA, adoption et évolution des processus métier.</span></li>
                  <li><strong>Formation & L&D</strong><span>Ingénierie pédagogique, co-construction de programmes, animation, qualité et montée en compétences.</span></li>
                  <li><strong>Pilotage opérationnel</strong><span>Direction de structures, staffing, recrutement, réponses aux appels d’offres, CRM et conduite de projets de bout en bout.</span></li>
                </ul>
              </div>

              <div className="aboutExpertMarkers aboutExpertTimeline">
                <small>DU DIGITAL À L’IA</small>
                <p className="aboutExpertNow"><strong>Aujourd’hui · Transformation IA</strong><span>Mettre cette culture digitale, métier et pédagogique au service de l’adoption de l’IA dans les organisations.</span></p>
                <p><strong>2018–2026 · Direction & formation</strong><span>Direction d’organismes de formation, ingénierie pédagogique, recrutement, staffing, qualité et pilotage opérationnel.</span></p>
                <p><strong>2016–2018 · Enseignement</strong><span>SEO/SEM, webmarketing et e-commerce à l’UPEC, EDC, EfreiTech, Pigier et ESCG.</span></p>
                <p><strong>2011–2016 · ADLPartner</strong><span>Responsable Acquisition : SEO, Google Ads, analytics, UX, refonte d’outils et coordination avec la DSI.</span></p>
                <p><strong>2006–2011 · Effiliation / Effinity</strong><span>Search, acquisition B2B, stratégies webmarketing multicanal et premiers projets d’outils digitaux.</span></p>
              </div>
            </div>
          </article>

          <article className="aboutExpertCard">
            <div className="aboutMarketingPersonTop">
              <div>
                <small className="aboutExpertName">SYLVAIN LE TURCQ</small>
                <span>COMMANDE PUBLIQUE · CONSEIL · AMO · FORMATION</span>
              </div>
              <a
                className="aboutLinkedIn"
                href="https://fr.linkedin.com/in/sylvain-le-turcq-424700b1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Voir le profil LinkedIn de Sylvain Le Turcq"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.93v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.54 9H7.1v11.45H3.54V9Z"/>
                </svg>
                
              </a>
            </div>

            <h3>Faire avancer des projets dans des environnements publics exigeants.</h3>
            <p className="aboutExpertIntro">
              Plus de 20 ans d’expérience professionnelle, dont près de deux décennies consacrées aux marchés publics.
              Fondateur d’ODEXIS, Sylvain accompagne entreprises et acteurs publics en conseil, formation et assistance,
              avec une maîtrise approfondie des procédures et des attentes des acheteurs.
            </p>

            <div className="aboutExpertSplit">
              <div>
                <small>EXPERTISES</small>
                <ul>
                  <li><strong>Commande publique</strong><span>Lecture des consultations, compréhension des procédures, stratégie de réponse et sécurisation.</span></li>
                  <li><strong>Marchés publics</strong><span>Accompagnement des entreprises, groupements, réponses aux appels d’offres et développement sur le secteur public.</span></li>
                  <li><strong>AMO & conseil</strong><span>Analyse des besoins, cadrage, méthode, assistance et accompagnement des organisations.</span></li>
                  <li><strong>Formation</strong><span>Transmission des pratiques de la commande publique à des entreprises et acteurs institutionnels.</span></li>
                  <li><strong>Culture acheteur</strong><span>Compréhension des critères, des usages de la commande publique et de la logique de valeur attendue.</span></li>
                </ul>
              </div>

              <div className="aboutExpertMarkers">
                <small>REPÈRES DE PARCOURS</small>
                <p><strong>ODEXIS</strong> fondée en 2008, spécialisée en Conseil, Formation et AMO marchés publics.</p>
                <p><strong>Université Paris X Nanterre</strong> : mémoire consacré à la notion d’offre économiquement la plus avantageuse dans les marchés publics.</p>
                <p><strong>Interventions</strong> auprès d’acteurs comme la CCI Essonne, le CNFPT et des réseaux d’entreprises.</p>
                <p><strong>Double lecture</strong> : besoins des entreprises et exigences des acheteurs publics.</p>
              </div>
            </div>
          </article>
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
