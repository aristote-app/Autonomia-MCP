import Link from "next/link";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "IA pour les agents de collectivité : cas d’usage, garde-fous et méthode",
  description:
    "Guide opérationnel pour les communautés de communes et communautés d’agglomération : usages IA des agents, sécurité, données, AI literacy et méthode de déploiement.",
  alternates: { canonical: "/territoires/ia-agents-collectivite" }
};

const useCases = [
  ["Courriers et e-mails", "Préparer une réponse, résumer un échange ou classer une demande, avec validation de l’agent avant envoi."],
  ["Comptes rendus", "Transformer des notes ou une transcription autorisée en projet de compte rendu, décisions et actions à relire."],
  ["Recherche documentaire", "Retrouver plus vite une procédure, une délibération ou une information dans un corpus maîtrisé."],
  ["Synthèse de documents", "Produire une première synthèse de dossiers longs pour faciliter la lecture et la préparation d’une décision."],
  ["Communication", "Décliner un contenu validé en versions site, newsletter ou réseaux sociaux sans automatiser la publication par défaut."],
  ["Ressources humaines", "Aider à structurer des fiches, trames ou FAQ internes sur un corpus autorisé, sans déléguer les décisions RH."],
  ["Développement économique", "Préparer des synthèses d’entreprises, d’événements ou de dispositifs à partir de sources identifiées."],
  ["Reporting", "Générer un commentaire de tableau de bord à partir de chiffres déjà calculés et contrôlés."],
  ["Procédures internes", "Transformer une procédure validée en checklist ou assistant de recherche pour les agents."],
  ["Marchés et achats", "Aider à lire, comparer ou résumer des pièces ; les arbitrages et validations restent humains."],
  ["Accueil et orientation", "Préparer des réponses de premier niveau à partir d’informations publiques et maintenues."],
  ["Automatisation", "Relier une tâche répétitive à des règles, des outils et, lorsque c’est utile, une étape IA avec reprise manuelle."]
];

const guardrails = [
  ["Données", "Identifier ce qui peut être transmis à l’outil et ce qui doit rester hors du système ; limiter les données au strict nécessaire."],
  ["Outils autorisés", "Définir les services et comptes utilisables, leurs paramètres, leurs droits et les conditions de conservation."],
  ["Validation humaine", "Placer une relecture avant les décisions, publications, envois ou actions qui peuvent produire un effet réel."],
  ["Traçabilité", "Documenter le cas d’usage, le propriétaire, les sources, les tests, les limites et la procédure de reprise."],
  ["Formation", "Former différemment selon les rôles, les outils réellement utilisés et le niveau de risque des usages."],
  ["Sécurité", "Traiter l’IA comme un composant du SI : accès, secrets, connecteurs, dépendances et risques d’injection doivent être cadrés."]
];

const sources = [
  {
    label: "Commission européenne — AI literacy, article 4",
    href: "https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers",
    note: "Repères officiels sur les mesures de littératie IA à mettre en place pour les personnes utilisant des systèmes d’IA."
  },
  {
    label: "CNIL — IA : comment se mettre en conformité ?",
    href: "https://www.cnil.fr/fr/ia-comment-se-mettre-en-conformite",
    note: "Rappels sur la protection des données personnelles et ressources CNIL relatives aux systèmes d’IA."
  },
  {
    label: "ANSSI — Recommandations de sécurité pour un système d’IA générative",
    href: "https://messervices.cyber.gouv.fr/guides/recommandations-de-securite-pour-un-systeme-dia-generative",
    note: "Recommandations de sécurité couvrant notamment architecture, accès, données et intégration des systèmes d’IA générative."
  }
];

const faq = [
  ["Faut-il commencer par ChatGPT ou Copilot ?", "Le choix de l’outil vient après le besoin, les données, l’environnement Microsoft ou Google déjà en place, les règles de sécurité et les usages autorisés."],
  ["Tous les agents doivent-ils suivre la même formation ?", "Non. Un socle commun peut être utile, puis les exercices et garde-fous doivent être adaptés aux métiers, aux outils et aux responsabilités."],
  ["Peut-on automatiser directement l’envoi de réponses ?", "Ce n’est pas le bon point de départ pour la plupart des cas. On peut d’abord produire un brouillon ou une recommandation puis conserver la validation humaine."],
  ["Comment choisir les premiers cas d’usage ?", "Chercher des tâches fréquentes, répétitives, documentables, avec une donnée disponible et un risque maîtrisable. Tester sur un périmètre réduit avant d’élargir."],
  ["L’AI Act impose-t-il un certificat de formation ?", "La Commission européenne indique qu’aucun certificat spécifique n’est requis pour documenter les actions de littératie IA. L’organisation peut conserver une trace interne de ses formations et initiatives."]
];

export default function TerritoryAgentsAIPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const url = `${base}/territoires/ia-agents-collectivite`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "IA pour les agents de collectivité : cas d’usage, garde-fous et méthode",
        description: metadata.description,
        url,
        isPartOf: { "@type": "WebSite", name: "Autonomia", url: base },
        about: ["intelligence artificielle", "agents territoriaux", "collectivités territoriales", "automatisation"]
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Autonomia", item: base },
          { "@type": "ListItem", position: 2, name: "Territoires", item: `${base}/territoires` },
          { "@type": "ListItem", position: 3, name: "IA pour les agents", item: url }
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
          <p className="eyebrow">AUTONOMIA TERRITOIRES / AGENTS</p>
          <h1>L’IA pour les agents : partir du travail réel, pas de la démonstration.</h1>
          <p>
            Pour une communauté de communes ou une communauté d’agglomération, le sujet n’est pas de
            « mettre de l’IA partout ». Il est d’identifier quelques tâches où l’assistance est utile,
            de choisir un niveau d’autonomie raisonnable et de donner aux agents les règles pour travailler
            avec l’outil sans perdre le contrôle.
          </p>
          <div className="heroActions">
            <Link className="primaryButton" href="/territoires#territory-contact">Demander un diagnostic</Link>
            <Link className="secondaryButton" href="/territoires">Voir Autonomia Territoires</Link>
          </div>
        </div>
        <aside className="territoryInsightAside">
          <span>POINT DE DÉPART</span>
          <strong>1 processus.</strong>
          <p>Une tâche fréquente, une donnée identifiée, un responsable, un test limité et une validation humaine claire.</p>
        </aside>
      </section>

      <section className="territoryInsightSection">
        <p className="sectionIndex">01 — CAS D’USAGE</p>
        <div>
          <h2>12 terrains de test qui peuvent être étudiés sans refondre le SI.</h2>
          <p className="territoryInsightLead">
            La pertinence dépend du contexte local, des outils autorisés et des données. La liste sert à ouvrir
            le diagnostic, pas à présumer qu’un cas d’usage doit être automatisé.
          </p>
          <div className="territoryInsightGrid">
            {useCases.map(([title, text], index) => (
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
        <p className="sectionIndex">02 — GARDE-FOUS</p>
        <div>
          <h2>Le workflow utile est celui dont on sait expliquer les limites.</h2>
          <div className="territoryGuardrailList">
            {guardrails.map(([title, text]) => (
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
          <h2>Du diagnostic au premier workflow en six décisions.</h2>
          <ol className="territoryInsightSteps">
            <li><b>01</b><div><strong>Observer</strong><p>Choisir une tâche réelle et décrire comment elle est faite aujourd’hui, exceptions comprises.</p></div></li>
            <li><b>02</b><div><strong>Qualifier</strong><p>Identifier données, fréquence, acteurs, outils, décisions et risques.</p></div></li>
            <li><b>03</b><div><strong>Découper</strong><p>Distinguer règle déterministe, étape IA et action qui nécessite une validation.</p></div></li>
            <li><b>04</b><div><strong>Tester</strong><p>Travailler dans un périmètre réduit avec des cas normaux, ambigus et en erreur.</p></div></li>
            <li><b>05</b><div><strong>Documenter</strong><p>Écrire les sources, permissions, limites, tests et procédure de reprise.</p></div></li>
            <li><b>06</b><div><strong>Transférer</strong><p>Former les agents concernés sur le workflow et la méthode afin qu’ils sachent contrôler le système.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="territoryInsightSection">
        <p className="sectionIndex">04 — AI LITERACY</p>
        <div>
          <h2>La formation doit être reliée aux systèmes réellement utilisés.</h2>
          <p className="territoryInsightLead">
            L’article 4 de l’AI Act prévoit des mesures de littératie IA pour les personnes qui utilisent
            des systèmes d’IA pour le compte d’une organisation. Depuis la modification entrée en vigueur
            à la mi-juillet 2026, la Commission précise qu’aucun niveau individuel spécifique n’est imposé
            et que l’approche doit tenir compte des connaissances, de l’expérience, de la formation et du
            contexte d’usage. Aucun certificat spécifique n’est requis. Pour une intercommunalité, cela pousse vers des parcours
            concrets : règles internes, outils autorisés, risques, vérification des sorties et cas d’usage métier.
          </p>
          <div className="territoryDecisionGrid">
            <article><span>AGENTS</span><strong>Utiliser et vérifier</strong><p>Prompts, sources, confidentialité, contrôle, limites, exercices métier.</p></article>
            <article><span>MANAGERS</span><strong>Encadrer les usages</strong><p>Règles d’équipe, arbitrages, qualité, responsabilité, remontée des incidents.</p></article>
            <article><span>NUMÉRIQUE / DSI</span><strong>Maîtriser l’environnement</strong><p>Accès, intégrations, permissions, données, sécurité, architecture et exploitation.</p></article>
          </div>
        </div>
      </section>

      <section className="territoryInsightSection sources">
        <p className="sectionIndex">05 — SOURCES</p>
        <div>
          <h2>Références publiques utilisées pour cadrer le sujet.</h2>
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
          <h2>Questions avant de lancer un pilote.</h2>
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
          <p className="sectionIndex">07 — DIAGNOSTIC</p>
          <div>
            <h2>Choisir les 3 à 5 workflows qui méritent réellement un test.</h2>
            <p>Autonomia peut partir des tâches des agents, qualifier les contraintes puis construire un premier plan de déploiement.</p>
          </div>
        </div>
        <LeadForm mode="territories" formId="territories-agents-ai" requestedService="territories-ia-agents" />
      </section>
    </main>
  );
}
