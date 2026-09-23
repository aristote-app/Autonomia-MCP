import Link from "next/link";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Accélérateur IA territorial pour TPE/PME : méthode et programme",
  description:
    "Comment une communauté de communes ou d’agglomération peut structurer un programme IA utile aux TPE/PME : diagnostic, ateliers, workflows, accompagnement et mesure.",
  alternates: { canonical: "/territoires/accelerateur-ia-tpe-pme" }
};

const programme = [
  ["Mobiliser", "Réunir les entreprises autour de problèmes de travail concrets plutôt que d’un catalogue d’outils."],
  ["Diagnostiquer", "Faire choisir à chaque entreprise une tâche ou un processus suffisamment précis pour être travaillé."],
  ["Prioriser", "Comparer valeur attendue, fréquence, données disponibles, complexité et risque avant de construire."],
  ["Construire", "Transformer le cas retenu en workflow testable : règles, étape IA éventuelle, outils, contrôle humain."],
  ["Tester", "Exécuter sur de vrais exemples préparés, mesurer les erreurs et documenter les limites."],
  ["Transférer", "Faire repartir l’entreprise avec le workflow, sa méthode, sa documentation et la prochaine action."]
];

const tracks = [
  {
    title: "Dirigeants / fonctions support",
    examples: "E-mails, préparation de rendez-vous, synthèse, reporting, documents, tâches administratives."
  },
  {
    title: "Commerce / relation client",
    examples: "Qualification, comptes rendus, préparation de propositions, suivi CRM, recherche d’information."
  },
  {
    title: "Opérations",
    examples: "Documents, contrôle de complétude, procédures, extraction d’informations, alertes et coordination."
  },
  {
    title: "Communication",
    examples: "Réutilisation de contenus validés, briefs, déclinaisons, calendriers, contrôle de cohérence."
  }
];

const sources = [
  {
    label: "France Num — Intelligence artificielle",
    href: "https://www.francenum.gouv.fr/guides-et-conseils/intelligence-artificielle",
    note: "Ressources publiques destinées à aider les TPE/PME à comprendre et adopter l’IA."
  },
  {
    label: "France Num — Aides et accompagnements IA pour TPE/PME",
    href: "https://www.francenum.gouv.fr/aides-financieres/guides-et-conseils-financiers/quelles-sont-les-aides-financieres-pour-aider-les",
    note: "Panorama mis à jour des aides et dispositifs mentionnés par France Num ; l’éligibilité doit être vérifiée dispositif par dispositif."
  },
  {
    label: "CNIL — IA : comment se mettre en conformité ?",
    href: "https://www.cnil.fr/fr/ia-comment-se-mettre-en-conformite",
    note: "Ressources officielles relatives aux données personnelles et à l’usage de systèmes d’IA."
  }
];

const faq = [
  ["Le programme doit-il être une formation collective unique ?", "Non. Le collectif peut servir à poser les bases, puis des diagnostics ou ateliers en petits groupes permettent de travailler sur les processus réels de chaque entreprise."],
  ["Faut-il sélectionner uniquement des entreprises déjà avancées ?", "Pas nécessairement. Il est plus utile de sélectionner des entreprises capables de formuler un problème concret, de mobiliser une personne référente et de consacrer du temps au test."],
  ["Que doit livrer chaque entreprise ?", "Au minimum : un cas d’usage cadré, un schéma de workflow, des règles de contrôle, des tests, une documentation courte et une décision sur la suite."],
  ["Peut-on promettre un financement public ?", "Non. Les dispositifs, critères et enveloppes évoluent. Le montage financier doit être vérifié pour le territoire et le programme concernés avant toute annonce."],
  ["Comment éviter un atelier qui reste théorique ?", "Faire venir les participants avec une tâche, un exemple et les outils réellement utilisés. Le programme doit produire un prototype, une méthode ou une décision, pas seulement une sensibilisation."]
];

export default function TerritorySMEAcceleratorPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const url = `${base}/territoires/accelerateur-ia-tpe-pme`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Accélérateur IA des entreprises du territoire",
        serviceType: "Programme d’accompagnement IA pour TPE et PME",
        provider: { "@type": "Organization", name: "Autonomia", url: base },
        areaServed: { "@type": "Country", name: "France" },
        audience: { "@type": "Audience", audienceType: "Communautés de communes, communautés d’agglomération, TPE et PME" },
        url
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Autonomia", item: base },
          { "@type": "ListItem", position: 2, name: "Territoires", item: `${base}/territoires` },
          { "@type": "ListItem", position: 3, name: "Accélérateur IA TPE/PME", item: url }
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
          <p className="eyebrow">AUTONOMIA TERRITOIRES / ENTREPRISES</p>
          <h1>Faire passer les TPE/PME du “j’essaie l’IA” à un workflow utile.</h1>
          <p>
            Une intercommunalité peut structurer un programme d’accompagnement autour d’un objectif simple :
            chaque entreprise travaille sur un problème réel, apprend à le décomposer et décide, preuves à
            l’appui, si un premier workflow mérite d’être déployé.
          </p>
          <div className="heroActions">
            <Link className="primaryButton" href="/territoires#territory-contact">Construire un programme</Link>
            <Link className="secondaryButton" href="/territoires">Voir Autonomia Territoires</Link>
          </div>
        </div>
        <aside className="territoryInsightAside">
          <span>UNITÉ DE VALEUR</span>
          <strong>1 workflow.</strong>
          <p>Pas un nombre de prompts appris : un processus compris, testé et documenté par l’entreprise.</p>
        </aside>
      </section>

      <section className="territoryInsightSection">
        <p className="sectionIndex">01 — PARCOURS</p>
        <div>
          <h2>Six étapes pour transformer une sensibilisation en capacité d’action.</h2>
          <ol className="territoryInsightSteps">
            {programme.map(([title, text], index) => (
              <li key={title}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <div><strong>{title}</strong><p>{text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="territoryInsightSection dark">
        <p className="sectionIndex">02 — COHORTE</p>
        <div>
          <h2>Un programme commun, des cas d’usage différents.</h2>
          <p className="territoryInsightLead">
            La valeur du collectif vient de la méthode partagée. Les entreprises n’ont pas besoin d’automatiser
            la même chose : elles doivent apprendre à décrire un processus, limiter les données, choisir les
            règles, décider où l’IA intervient et conserver une reprise humaine.
          </p>
          <div className="territoryDecisionGrid">
            {tracks.map((track) => (
              <article key={track.title}>
                <span>PISTE</span>
                <strong>{track.title}</strong>
                <p>{track.examples}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="territoryInsightSection">
        <p className="sectionIndex">03 — FORMAT</p>
        <div>
          <h2>Assembler le dispositif selon le rôle que veut jouer le territoire.</h2>
          <div className="territoryInsightGrid compact">
            <article><span>01</span><h3>Conférence / webinar</h3><p>Créer un langage commun et montrer des cas d’usage sans confondre démonstration et déploiement.</p></article>
            <article><span>02</span><h3>Diagnostic court</h3><p>Faire émerger une tâche précise, les données nécessaires, la valeur attendue et les risques.</p></article>
            <article><span>03</span><h3>Atelier collectif</h3><p>Apprendre la méthode sur des cas réels, avec un cadre commun de test et de documentation.</p></article>
            <article><span>04</span><h3>Accompagnement individuel</h3><p>Aider les entreprises prêtes à construire et éprouver un premier workflow dans leur contexte.</p></article>
            <article><span>05</span><h3>Restitution</h3><p>Comparer ce qui a été testé, ce qui est abandonné, les risques identifiés et les suites décidées.</p></article>
            <article><span>06</span><h3>Suite optionnelle</h3><p>Orienter les entreprises qui veulent industrialiser vers l’expertise, la formation ou l’intégration adaptées.</p></article>
          </div>
        </div>
      </section>

      <section className="territoryInsightSection">
        <p className="sectionIndex">04 — MESURE</p>
        <div>
          <h2>Mesurer le programme sans inventer des gains.</h2>
          <p className="territoryInsightLead">
            Le bilan peut distinguer ce qui est objectivement observable de ce qui reste une hypothèse.
            On peut compter les diagnostics terminés, les workflows testés, les cas abandonnés après test,
            les entreprises ayant documenté leurs règles ou poursuivi un déploiement. Les gains de temps ou
            d’argent ne devraient être présentés comme des résultats que lorsqu’ils ont été réellement mesurés.
          </p>
          <div className="territoryDecisionGrid">
            <article><span>ACTIVITÉ</span><strong>Participation réelle</strong><p>Diagnostics, ateliers, cas travaillés et livrables produits.</p></article>
            <article><span>QUALITÉ</span><strong>Workflows testés</strong><p>Cas normaux, erreurs, exceptions, contrôle humain et documentation.</p></article>
            <article><span>SUITE</span><strong>Décisions prises</strong><p>Déployer, approfondir, former, changer d’outil ou abandonner un cas non pertinent.</p></article>
          </div>
        </div>
      </section>

      <section className="territoryInsightSection">
        <p className="sectionIndex">05 — MONTAGE</p>
        <div>
          <h2>Financement : vérifier avant de promettre.</h2>
          <p className="territoryInsightLead">
            France Num recense des aides et dispositifs d’accompagnement à l’IA pour les TPE/PME et indique
            que l’État comme des collectivités territoriales peuvent proposer des dispositifs. Cela ne signifie
            pas qu’un programme donné est automatiquement éligible. Le bon réflexe est de vérifier le cadre
            juridique, les compétences du porteur, le budget, le public visé et les critères du dispositif au
            moment du montage.
          </p>
        </div>
      </section>

      <section className="territoryInsightSection sources">
        <p className="sectionIndex">06 — SOURCES</p>
        <div>
          <h2>Références publiques pour cadrer l’accompagnement.</h2>
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
        <p className="sectionIndex">07 — QUESTIONS</p>
        <div>
          <h2>Questions pour concevoir une cohorte utile.</h2>
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
          <p className="sectionIndex">08 — PROGRAMME</p>
          <div>
            <h2>Construire l’accélérateur autour des entreprises de votre territoire.</h2>
            <p>Le point de départ peut être une cohorte, un événement économique ou un besoin déjà identifié par la direction développement économique.</p>
          </div>
        </div>
        <LeadForm mode="territories" formId="territories-sme-accelerator" requestedService="territories-accelerateur-ia-tpe-pme" />
      </section>
    </main>
  );
}
