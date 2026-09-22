import Link from "next/link";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Autonomia Territoires — IA pour agents et entreprises du territoire",
  description:
    "Autonomia accompagne les communautés de communes et communautés d’agglomération pour former les agents, automatiser des processus et accélérer l’adoption de l’IA par les entreprises du territoire.",
  alternates: { canonical: "/territoires" }
};

const doors = [
  {
    index: "01",
    title: "IA pour les agents",
    text:
      "Identifier les tâches répétitives, sélectionner les cas d’usage réalistes et déployer quelques workflows utiles sans refondre tout le système d’information.",
    bullets: [
      "Diagnostic des tâches et irritants",
      "3 à 5 cas d’usage prioritaires",
      "Automatisations ou assistants ciblés",
      "Règles de contrôle et validation humaine"
    ]
  },
  {
    index: "02",
    title: "Academy collectivités",
    text:
      "Former les agents et managers à des usages adaptés à leur quotidien : rédaction, recherche, réunions, documents, communication, reporting, gouvernance et bonnes pratiques.",
    bullets: [
      "Direction & managers",
      "Services support et métiers",
      "ChatGPT / Copilot / IA générative",
      "Adoption, gouvernance et AI literacy"
    ]
  },
  {
    index: "03",
    title: "Accélérateur IA des entreprises du territoire",
    text:
      "Donner aux TPE et PME du territoire une méthode pour passer de l’intérêt pour l’IA à un workflow réellement utile dans leur activité.",
    bullets: [
      "Sensibilisation collective",
      "Diagnostic court par entreprise",
      "Ateliers par cas d’usage",
      "Accompagnement vers un premier workflow opérationnel"
    ]
  }
];

const contacts = [
  "Direction générale / DGS",
  "DSI / direction numérique",
  "DRH / formation",
  "Direction développement économique",
  "Direction transformation / innovation",
  "Communication / services métiers"
];

const valueLayers = [
  {
    index: "01",
    title: "Mieux travailler en interne",
    text: "Repérer les tâches répétitives, la recherche d’information, les documents, réunions ou reportings qui peuvent être simplifiés sans engager une refonte globale du SI."
  },
  {
    index: "02",
    title: "Faire monter les agents en compétence",
    text: "Former par usages réels, avec des règles de confidentialité, de contrôle et de validation adaptées au contexte de la collectivité."
  },
  {
    index: "03",
    title: "Accélérer les entreprises du territoire",
    text: "Créer un programme collectif pour aider les TPE/PME à identifier un cas d’usage, construire un premier workflow et gagner en autonomie."
  }
];

const deliverables = [
  "Cartographie des usages et irritants prioritaires",
  "Plan d’action Agents / Academy / Entreprises",
  "Ateliers et parcours conçus autour des métiers",
  "Premier workflow ou démonstrateur lorsque le besoin s’y prête",
  "Garde-fous, validation humaine et règles d’usage",
  "Bilan de programme et prochaines étapes"
];

const faq = [
  {
    question: "À quels territoires s’adresse Autonomia Territoires ?",
    answer: "L’offre est conçue pour les communautés de communes et les communautés d’agglomération, partout en France."
  },
  {
    question: "Faut-il déjà avoir une stratégie IA ?",
    answer: "Non. Le point de départ peut être un besoin très concret : gagner du temps sur certaines tâches, former des agents ou accompagner les entreprises locales. Le diagnostic sert justement à qualifier la bonne porte d’entrée."
  },
  {
    question: "Peut-on commencer uniquement par de la formation ?",
    answer: "Oui. Le programme peut commencer par une Academy agents ou managers, puis évoluer vers des workflows ciblés si des cas d’usage pertinents émergent."
  },
  {
    question: "L’accélérateur entreprises est-il une formation standard ?",
    answer: "Non. L’objectif est d’amener chaque entreprise à travailler sur une tâche réelle, à tester un workflow utile et à repartir avec une méthode transférable."
  },
  {
    question: "Autonomia intervient-il sur les données sensibles ?",
    answer: "Le cadrage inclut la nature des données, les outils autorisés, les droits d’accès et les validations humaines nécessaires. Une automatisation n’est proposée que si le contexte permet de la cadrer proprement."
  }
];

export default function TerritoriesPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const url = `${base}/territoires`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Autonomia Territoires",
        provider: {
          "@type": "Organization",
          name: "Autonomia",
          url: base
        },
        areaServed: {
          "@type": "Country",
          name: "France"
        },
        audience: {
          "@type": "Audience",
          audienceType: "Communautés de communes et communautés d’agglomération"
        },
        serviceType:
          "Accompagnement IA, formation des agents, automatisation et programme d’accélération IA pour les entreprises du territoire",
        url
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      }
    ]
  };

  return (
    <main className="territoryOfferPage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="territoryOfferHero" id="top">
        <div>
          <p className="eyebrow">AUTONOMIA TERRITOIRES</p>
          <h1>
            Faire de l’IA un outil concret
            <span>pour les agents et les entreprises du territoire.</span>
          </h1>
          <p>
            Une offre pensée pour les communautés de communes et communautés d’agglomération :
            moderniser certains usages internes, faire monter les équipes en compétences et créer
            des programmes IA utiles aux entreprises locales.
          </p>
          <div className="heroActions">
            <Link className="primaryButton" href="#territory-contact">Parler de votre territoire</Link>
            <Link className="secondaryButton" href="#programmes">Voir les 3 programmes</Link>
          </div>
        </div>

        <aside className="territoryOfferPanel">
          <span>AUTONOMIA / TERRITOIRES</span>
          <strong>3 portes d’entrée.</strong>
          <ol>
            <li><b>01</b><span>Agents</span></li>
            <li><b>02</b><span>Academy collectivités</span></li>
            <li><b>03</b><span>Entreprises du territoire</span></li>
          </ol>
        </aside>
      </section>

      <section className="territoryOfferIntro">
        <p className="sectionIndex">01 — LE PRINCIPE</p>
        <div>
          <h2>Ne pas vendre “de l’IA”. Partir du travail à améliorer.</h2>
          <p>
            Autonomia commence par les tâches, processus, publics et contraintes réels. L’objectif
            est de déterminer où une assistance IA, une automatisation ou une montée en compétences
            apporte quelque chose de concret — et où il vaut mieux ne rien automatiser.
          </p>
        </div>
      </section>

      <section className="territoryOfferDoors" id="programmes">
        {doors.map((door) => (
          <article key={door.index}>
            <span>{door.index}</span>
            <h2>{door.title}</h2>
            <p>{door.text}</p>
            <ul>
              {door.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
          </article>
        ))}
      </section>

      <section className="territoryValueLayers">
        <div className="territoryValueIntro">
          <p className="sectionIndex">02 — TROIS LEVIERS D’IMPACT</p>
          <div>
            <h2>Une seule relation peut activer trois niveaux de transformation.</h2>
            <p>
              Autonomia Territoires n’est pas limité à une session de sensibilisation. Le programme peut
              agir sur le fonctionnement interne de l’intercommunalité, sur les compétences des agents
              et sur l’accompagnement économique des entreprises locales.
            </p>
          </div>
        </div>
        <div className="territoryValueGrid">
          {valueLayers.map((item) => (
            <article key={item.index}>
              <span>{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="territoryProgram">
        <p className="sectionIndex">03 — PROGRAMME ENTREPRISES</p>
        <div>
          <h2>Un accélérateur IA territorial, sans transformer l’accompagnement en catalogue de formations.</h2>
          <p>
            Le programme peut être conçu comme une progression : sensibiliser, qualifier les besoins,
            faire travailler les entreprises sur leurs propres cas d’usage, puis accompagner celles
            qui sont prêtes vers un premier workflow reproductible.
          </p>

          <ol className="territoryJourney">
            <li><span>01</span><div><strong>Sensibiliser</strong><p>Une session commune centrée sur des usages métier concrets.</p></div></li>
            <li><span>02</span><div><strong>Diagnostiquer</strong><p>Chaque entreprise identifie une tâche ou un processus à améliorer.</p></div></li>
            <li><span>03</span><div><strong>Construire</strong><p>Atelier pratique pour transformer le besoin en workflow testable.</p></div></li>
            <li><span>04</span><div><strong>Transférer</strong><p>L’entreprise repart avec une méthode qu’elle peut reprendre sur d’autres tâches.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="territoryBuyers">
        <p className="sectionIndex">04 — QUI MOBILISER</p>
        <div>
          <h2>Une offre qui peut être portée par plusieurs directions.</h2>
          <div className="territoryBuyerGrid">
            {contacts.map((contact, index) => (
              <article key={contact}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{contact}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="territoryDiagnostic">
        <p className="sectionIndex">05 — PORTE D’ENTRÉE</p>
        <div>
          <h2>Commencer petit : un diagnostic court pour sélectionner les priorités.</h2>
          <p>
            Le premier engagement peut rester simple : comprendre les tâches les plus consommatrices
            de temps, les populations concernées, les outils déjà utilisés, les contraintes de données
            et les décisions qui doivent rester humaines. À partir de là, Autonomia peut proposer un
            plan Agents / Academy / Entreprises du territoire adapté au contexte.
          </p>
        </div>
      </section>

      <section className="territoryDeliverables">
        <p className="sectionIndex">06 — LIVRABLES</p>
        <div>
          <h2>Un programme doit produire autre chose qu’une présentation sur l’IA.</h2>
          <div className="territoryDeliverableGrid">
            {deliverables.map((item, index) => (
              <article key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>


      <section className="territoryResources">
        <p className="sectionIndex">07 — RESSOURCES</p>
        <div>
          <h2>Approfondir selon votre point d’entrée.</h2>
          <div className="territoryResourceGrid">
            <Link href="/territoires/ia-agents-collectivite">
              <span>AGENTS</span>
              <strong>IA pour les agents de collectivité</strong>
              <p>12 cas d’usage, garde-fous, AI literacy et méthode pour choisir les premiers workflows.</p>
              <b>Lire le guide →</b>
            </Link>
            <Link href="/territoires/accelerateur-ia-tpe-pme">
              <span>ENTREPRISES</span>
              <strong>Accélérateur IA territorial pour TPE/PME</strong>
              <p>Une méthode de cohorte pour passer de la sensibilisation à un workflow testé et documenté.</p>
              <b>Lire le guide →</b>
            </Link>
          </div>
        </div>
      </section>

      <section className="territoryFaq">
        <p className="sectionIndex">08 — QUESTIONS</p>
        <div>
          <h2>Questions fréquentes des intercommunalités.</h2>
          <div className="faqList">
            {faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="territoryLeadSection" id="territory-contact">
        <div className="territoryLeadIntro">
          <p className="sectionIndex">09 — ÉCHANGE</p>
          <div>
            <h2>Quel programme voulez-vous activer sur votre territoire ?</h2>
            <p>
              Indiquez le point de départ. Le formulaire transmet directement le besoin au cockpit Autonomia.
            </p>
          </div>
        </div>
        <LeadForm
          mode="territories"
          formId="territories-main"
          requestedService="autonomia-territoires"
        />
      </section>
    </main>
  );
}
