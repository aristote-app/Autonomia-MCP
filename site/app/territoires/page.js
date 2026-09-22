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

export default function TerritoriesPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const url = `${base}/territoires`;

  const schema = {
    "@context": "https://schema.org",
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

      <section className="territoryProgram">
        <p className="sectionIndex">02 — PROGRAMME ENTREPRISES</p>
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
        <p className="sectionIndex">03 — QUI MOBILISER</p>
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
        <p className="sectionIndex">04 — PORTE D’ENTRÉE</p>
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

      <section className="territoryLeadSection" id="territory-contact">
        <div className="territoryLeadIntro">
          <p className="sectionIndex">05 — ÉCHANGE</p>
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
