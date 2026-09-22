import Link from "next/link";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Formation IA collectivités : Academy agents, managers et directions",
  description:
    "Construire une Academy IA pour une communauté de communes ou d’agglomération : socle commun, parcours métier, AI literacy, gouvernance et ateliers sur les vrais processus des agents.",
  alternates: { canonical: "/territoires/academy-ia-collectivites" }
};

const audiences = [
  ["Agents", "Utiliser les outils autorisés, vérifier les réponses, protéger les données et appliquer l’IA à des tâches concrètes."],
  ["Managers", "Encadrer les usages, choisir les bons cas d’usage, organiser la validation et faire remonter les incidents ou limites."],
  ["Directions", "Décider des priorités, du cadre d’usage, des moyens, des responsabilités et des critères de déploiement."],
  ["RH / formation", "Construire des parcours adaptés aux rôles, documenter les actions de montée en compétence et suivre l’adoption."],
  ["Numérique / DSI", "Cadrer les outils, comptes, accès, données, connecteurs, sécurité et conditions d’intégration."],
  ["Développement économique", "Savoir accompagner les entreprises locales vers des usages IA concrets et responsables."]
];

const modules = [
  ["Socle IA", "Comprendre les capacités, limites, hallucinations, données d’entrée et mécanismes de vérification."],
  ["ChatGPT / Copilot", "Travailler sur les outils réellement autorisés dans l’environnement de la collectivité."],
  ["Usages métier", "E-mails, synthèse, réunions, procédures, recherche documentaire, reporting, communication et préparation de contenus."],
  ["Automatisation", "Distinguer ce qui relève d’une règle, d’une étape IA, d’une intégration et d’une validation humaine."],
  ["Données & sécurité", "Identifier ce qui peut être transmis, les informations sensibles, les droits d’accès et les risques liés aux connecteurs."],
  ["Gouvernance", "Définir les règles internes, responsabilités, processus de validation, documentation et procédure de reprise."],
  ["AI literacy", "Adapter la montée en compétence au rôle, à l’expérience, au contexte et aux systèmes réellement utilisés."],
  ["Atelier workflow", "Transformer un cas d’usage réel en procédure testable avec critères de qualité et points de contrôle."]
];

const method = [
  ["01", "Observer", "Recueillir les tâches, irritants, outils et règles existantes auprès des équipes concernées."],
  ["02", "Segmenter", "Construire des parcours différents selon les rôles, les outils utilisés et le niveau de risque."],
  ["03", "Former", "Apprendre à partir de situations de travail réelles plutôt qu’avec des démonstrations génériques."],
  ["04", "Pratiquer", "Faire produire, tester et corriger des prompts, assistants ou workflows directement liés aux métiers."],
  ["05", "Documenter", "Formaliser les règles d’usage, les sources, les limites, les validations et les traces de formation."],
  ["06", "Transférer", "Donner aux référents internes une méthode pour poursuivre l’accompagnement après le programme."]
];

const sources = [
  {
    label: "Commission européenne — AI literacy, article 4",
    href: "https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers",
    note: "La Commission précise que les mesures doivent tenir compte des connaissances, de l’expérience, de la formation et du contexte d’usage ; aucun niveau individuel spécifique n’est imposé."
  },
  {
    label: "CNIL — IA : comment se mettre en conformité ?",
    href: "https://www.cnil.fr/fr/ia-comment-se-mettre-en-conformite",
    note: "Ressources officielles sur la protection des données et le déploiement de systèmes d’IA."
  },
  {
    label: "ANSSI — Recommandations de sécurité pour un système d’IA générative",
    href: "https://messervices.cyber.gouv.fr/guides/recommandations-de-securite-pour-un-systeme-dia-generative",
    note: "Repères de sécurité pour l’architecture, les accès, les données et l’intégration des systèmes d’IA générative."
  }
];

const faq = [
  ["Une sensibilisation de deux heures suffit-elle ?", "Elle peut constituer un point de départ, mais une Academy utile relie ensuite les règles et les outils aux métiers réels, avec pratique, vérification et transfert."],
  ["Tous les agents doivent-ils suivre le même parcours ?", "Non. Un socle commun peut être partagé, puis les exercices, outils et garde-fous doivent varier selon les rôles et les usages."],
  ["Faut-il choisir ChatGPT ou Copilot avant de former ?", "Le choix dépend de l’environnement déjà en place, des outils autorisés, des données, des usages et des règles de sécurité. La formation doit suivre ce cadrage."],
  ["Comment documenter l’AI literacy ?", "La Commission indique qu’aucun certificat spécifique n’est requis ; une organisation peut conserver des traces internes de ses formations et autres initiatives."],
  ["Peut-on intégrer un atelier d’automatisation ?", "Oui, si le processus est suffisamment clair. L’atelier peut aider à distinguer règles, étape IA, intégrations et validation humaine avant de construire un pilote."]
];

export default function AcademyCollectivitesPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const url = `${base}/territoires/academy-ia-collectivites`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Academy IA collectivités",
        provider: { "@type": "Organization", name: "Autonomia", url: base },
        audience: {
          "@type": "Audience",
          audienceType: "Communautés de communes et communautés d’agglomération"
        },
        serviceType: "Formation IA des agents, managers, directions et fonctions support",
        url
      },
      {
        "@type": "WebPage",
        name: metadata.title,
        description: metadata.description,
        url,
        isPartOf: { "@type": "WebSite", name: "Autonomia", url: base }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Autonomia", item: base },
          { "@type": "ListItem", position: 2, name: "Territoires", item: `${base}/territoires` },
          { "@type": "ListItem", position: 3, name: "Academy collectivités", item: url }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer }
        }))
      }
    ]
  };

  return (
    <main className="territoryInsightPage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="territoryInsightHero">
        <div>
          <p className="eyebrow">AUTONOMIA TERRITOIRES / ACADEMY</p>
          <h1>Former les agents à l’IA sur leur travail réel.</h1>
          <p>
            Une Academy collectivités ne doit pas être un catalogue de prompts. Autonomia part des
            outils autorisés, des tâches des agents, des responsabilités et des données pour construire
            des parcours différenciés — puis faire pratiquer sur de vrais processus.
          </p>
          <div className="heroActions">
            <Link className="primaryButton" href="/territoires#territory-contact">Construire un parcours</Link>
            <Link className="secondaryButton" href="/territoires">Voir Autonomia Territoires</Link>
          </div>
        </div>
        <aside className="territoryInsightAside">
          <span>PRINCIPE</span>
          <strong>1 socle. Plusieurs parcours.</strong>
          <p>Agents, managers, directions, RH, numérique et développement économique n’ont ni les mêmes usages ni les mêmes responsabilités.</p>
        </aside>
      </section>

      <section className="territoryInsightSection">
        <p className="sectionIndex">01 — PUBLICS</p>
        <div>
          <h2>Former selon le rôle et le contexte d’usage.</h2>
          <div className="territoryInsightGrid">
            {audiences.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="territoryInsightSection dark">
        <p className="sectionIndex">02 — MODULES</p>
        <div>
          <h2>Un programme relié aux usages, aux outils et aux garde-fous.</h2>
          <div className="territoryGuardrailList">
            {modules.map(([title, text]) => (
              <article key={title}>
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="territoryInsightSection">
        <p className="sectionIndex">03 — MÉTHODE</p>
        <div>
          <h2>De la cartographie des usages au transfert interne.</h2>
          <ol className="territoryInsightSteps">
            {method.map(([index, title, text]) => (
              <li key={index}><b>{index}</b><div><strong>{title}</strong><p>{text}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="territoryInsightSection">
        <p className="sectionIndex">04 — AI LITERACY</p>
        <div>
          <h2>Une obligation de montée en compétence à adapter aux usages réels.</h2>
          <p className="territoryInsightLead">
            L’article 4 de l’AI Act impose aux fournisseurs et déployeurs de systèmes d’IA de prendre
            des mesures pour soutenir le développement de l’AI literacy des personnes qui les utilisent
            pour leur compte. Depuis la modification entrée en vigueur à la mi-juillet 2026, aucun niveau
            individuel spécifique n’est imposé ; la Commission demande de tenir compte des connaissances,
            de l’expérience, de la formation et du contexte d’usage.
          </p>
          <div className="territoryDecisionGrid">
            <article><span>COMPRENDRE</span><strong>Capacités & limites</strong><p>Ce que l’outil sait faire, ce qu’il peut inventer et comment vérifier.</p></article>
            <article><span>APPLIQUER</span><strong>Règles internes</strong><p>Outils autorisés, données, confidentialité, validation et traçabilité.</p></article>
            <article><span>PRATIQUER</span><strong>Usages métier</strong><p>Exercices construits à partir des tâches et documents réellement rencontrés.</p></article>
          </div>
        </div>
      </section>

      <section className="territoryInsightSection sources">
        <p className="sectionIndex">05 — SOURCES</p>
        <div>
          <h2>Références publiques pour cadrer le programme.</h2>
          <div className="territorySourceGrid">
            {sources.map((source) => (
              <a key={source.href} href={source.href} target="_blank" rel="noreferrer">
                <strong>{source.label}</strong>
                <p>{source.note}</p>
                <span>Source officielle ↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="territoryFaq">
        <p className="sectionIndex">06 — QUESTIONS</p>
        <div>
          <h2>Questions avant de lancer une Academy IA.</h2>
          <div className="faqList">
            {faq.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="territoryLeadSection">
        <div className="territoryLeadIntro">
          <p className="sectionIndex">07 — PARCOURS</p>
          <div>
            <h2>Construire une Academy à partir des métiers et outils de votre intercommunalité.</h2>
            <p>Autonomia peut cartographier les usages, segmenter les publics puis concevoir un parcours pratique et documenté.</p>
          </div>
        </div>
        <LeadForm mode="territories" formId="territories-academy-ai" requestedService="territories-academy-collectivites" />
      </section>
    </main>
  );
}
