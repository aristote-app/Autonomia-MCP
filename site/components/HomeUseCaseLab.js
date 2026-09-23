"use client";

import { useMemo, useState } from "react";

const USE_CASES = [
  {
    id: "emails",
    number: "01",
    title: "Trop d’e-mails et de demandes à traiter",
    short: "Trier, comprendre, prioriser, répondre.",
    pain: "Vos équipes passent une partie importante de leur journée à ouvrir des messages, identifier l’objet de la demande, chercher le bon contexte et décider qui doit agir.",
    build: [
      "Trier et catégoriser les messages entrants",
      "Extraire les informations utiles",
      "Préparer une réponse ou une action à valider",
      "Orienter automatiquement vers la bonne équipe"
    ],
    checks: [
      "Nous recevons beaucoup de demandes répétitives",
      "La qualification dépend encore d’une lecture manuelle",
      "Des informations sont recopiées dans un autre outil"
    ]
  },
  {
    id: "meetings",
    number: "02",
    title: "Des réunions qui créent encore du travail après la réunion",
    short: "Compte rendu, décisions, actions, relances.",
    pain: "Après chaque réunion, il faut encore produire le compte rendu, retrouver les décisions, affecter les actions puis relancer les personnes concernées.",
    build: [
      "Synthétiser les échanges",
      "Identifier décisions, actions et responsables",
      "Préparer les comptes rendus dans votre format",
      "Créer les tâches et rappels à valider"
    ],
    checks: [
      "Les comptes rendus prennent du temps",
      "Des actions se perdent entre deux réunions",
      "Les relances sont réalisées manuellement"
    ]
  },
  {
    id: "knowledge",
    number: "03",
    title: "L’information existe, mais personne ne la retrouve vite",
    short: "Drive, SharePoint, dossiers, procédures, PDF.",
    pain: "La connaissance est dispersée entre documents, dossiers, espaces partagés et outils métier. Les équipes savent que l’information existe sans toujours savoir où la chercher.",
    build: [
      "Un assistant de recherche documentaire",
      "Des réponses sourcées à partir de vos contenus",
      "Une recherche transverse sur plusieurs espaces",
      "Des accès adaptés aux droits des utilisateurs"
    ],
    checks: [
      "Nous perdons du temps à chercher des documents",
      "Les mêmes questions reviennent souvent",
      "La connaissance dépend de quelques personnes"
    ]
  },
  {
    id: "copy",
    number: "04",
    title: "Vous recopiez les mêmes informations entre plusieurs outils",
    short: "CRM, tableurs, formulaires, logiciels métier.",
    pain: "Une donnée reçue par e-mail ou formulaire doit encore être ressaisie dans un CRM, un fichier, un logiciel métier ou un outil de suivi.",
    build: [
      "Extraire les données depuis les sources entrantes",
      "Structurer et contrôler les champs",
      "Alimenter les outils concernés",
      "Signaler les cas ambigus à un humain"
    ],
    checks: [
      "Nous faisons régulièrement du copier-coller",
      "Une même information existe à plusieurs endroits",
      "Les erreurs de saisie nécessitent des vérifications"
    ]
  },
  {
    id: "reporting",
    number: "05",
    title: "Vos reportings sont encore assemblés à la main",
    short: "Collecter, consolider, commenter, présenter.",
    pain: "Les équipes récupèrent des données dans plusieurs sources, les consolident puis rédigent manuellement une synthèse pour la direction ou les clients.",
    build: [
      "Collecter des données depuis plusieurs sources",
      "Préparer une synthèse structurée",
      "Détecter les écarts ou éléments à commenter",
      "Générer un premier reporting à contrôler"
    ],
    checks: [
      "La collecte prend plus de temps que l’analyse",
      "Le même reporting revient chaque semaine ou chaque mois",
      "La mise en forme est largement répétitive"
    ]
  },
  {
    id: "documents",
    number: "06",
    title: "Vous produisez souvent les mêmes documents",
    short: "Propositions, réponses, dossiers, courriers.",
    pain: "De nombreux documents repartent des mêmes informations, des mêmes paragraphes et des mêmes sources, mais sont encore reconstruits manuellement à chaque fois.",
    build: [
      "Préparer des premières versions à partir de vos données",
      "Réutiliser une base documentaire validée",
      "Adapter la structure au contexte",
      "Soumettre le document final à validation humaine"
    ],
    checks: [
      "Nous réutilisons souvent les mêmes contenus",
      "La préparation d’un document exige plusieurs recherches",
      "Les équipes passent beaucoup de temps à reformater"
    ]
  },
  {
    id: "support",
    number: "07",
    title: "Vos équipes répondent sans cesse aux mêmes questions",
    short: "Clients, usagers, collaborateurs, partenaires.",
    pain: "Une part importante des demandes porte sur des informations déjà disponibles : procédures, délais, documents, fonctionnement ou questions fréquentes.",
    build: [
      "Un assistant de premier niveau",
      "Des réponses préparées à partir de sources validées",
      "Une orientation vers un humain quand nécessaire",
      "Une analyse des questions qui reviennent le plus"
    ],
    checks: [
      "Les mêmes questions reviennent chaque semaine",
      "Les réponses sont dispersées dans plusieurs documents",
      "Les équipes doivent souvent chercher avant de répondre"
    ]
  },
  {
    id: "sales",
    number: "08",
    title: "Des opportunités commerciales se perdent faute de suivi",
    short: "Qualifier, enrichir, préparer, relancer.",
    pain: "Les demandes entrantes, signaux commerciaux ou prospects nécessitent encore beaucoup de recherche, de qualification et de préparation avant qu’un commercial puisse agir.",
    build: [
      "Qualifier les demandes entrantes",
      "Préparer une fiche de contexte",
      "Prioriser les opportunités selon vos critères",
      "Préparer des relances à valider"
    ],
    checks: [
      "Des leads restent sans traitement assez rapide",
      "La qualification demande plusieurs recherches",
      "Le suivi dépend de tâches manuelles"
    ]
  },
  {
    id: "onboarding",
    number: "09",
    title: "L’onboarding dépend trop des personnes disponibles",
    short: "Procédures, outils, réponses internes.",
    pain: "Les nouveaux collaborateurs sollicitent les mêmes personnes pour comprendre les processus, retrouver les documents et savoir comment utiliser les outils internes.",
    build: [
      "Un assistant interne d’onboarding",
      "Des parcours guidés par rôle",
      "Des réponses fondées sur les procédures internes",
      "Une remontée des questions sans réponse"
    ],
    checks: [
      "Les mêmes explications sont répétées à chaque arrivée",
      "Les procédures sont difficiles à retrouver",
      "L’onboarding mobilise fortement les équipes"
    ]
  },
  {
    id: "control",
    number: "10",
    title: "Vous contrôlez manuellement des dossiers ou documents",
    short: "Complétude, cohérence, règles, pièces manquantes.",
    pain: "Avant traitement, vos équipes doivent vérifier qu’un dossier contient les bonnes pièces, que certaines données concordent et que les règles attendues sont respectées.",
    build: [
      "Contrôler la présence des pièces attendues",
      "Extraire et comparer certaines informations",
      "Signaler les incohérences ou éléments manquants",
      "Laisser la décision finale aux personnes responsables"
    ],
    checks: [
      "Nous vérifions souvent les mêmes critères",
      "Les dossiers incomplets ralentissent le traitement",
      "La vérification mobilise du temps qualifié"
    ]
  }
];

export default function HomeUseCaseLab() {
  const [activeId, setActiveId] = useState(USE_CASES[0].id);
  const [answers, setAnswers] = useState({});

  const active = useMemo(
    () => USE_CASES.find((item) => item.id === activeId) || USE_CASES[0],
    [activeId]
  );

  const selected = answers[active.id] || [];
  const score = selected.length;

  function toggleCheck(index) {
    setAnswers((current) => {
      const existing = current[active.id] || [];
      return {
        ...current,
        [active.id]: existing.includes(index)
          ? existing.filter((item) => item !== index)
          : [...existing, index]
      };
    });
  }

  return (
    <section className="useCaseLab" id="cas-usage-test">
      <div className="useCaseLabIntro">
        <p className="sectionIndex">02 — VOTRE QUOTIDIEN</p>
        <div>
          <h2>Quel problème vous ressemble le plus ?</h2>
          <p>
            Choisissez une situation. En quelques secondes, voyez ce qu’Autonomia pourrait étudier
            ou construire avec vous. Aucun formulaire et aucune sortie de page.
          </p>
        </div>
      </div>

      <div className="useCaseLabShell">
        <div className="useCaseTabs" aria-label="Cas d’usage fréquents">
          {USE_CASES.map((item) => (
            <button
              type="button"
              key={item.id}
              className={item.id === active.id ? "useCaseTab active" : "useCaseTab"}
              onClick={() => setActiveId(item.id)}
              aria-pressed={item.id === active.id}
            >
              <span>{item.number}</span>
              <strong>{item.title}</strong>
              <small>{item.short}</small>
            </button>
          ))}
        </div>

        <div className="useCasePanel" key={active.id}>
          <div className="useCasePanelHead">
            <span>CAS {active.number}</span>
            <h3>{active.title}</h3>
            <p>{active.pain}</p>
          </div>

          <div className="useCaseBuild">
            <p>CE QU’ON POURRAIT CONSTRUIRE</p>
            <ul>
              {active.build.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="useCaseMiniTest">
            <p>EST-CE VOTRE CAS ?</p>
            <div className="miniTestChecks">
              {active.checks.map((label, index) => (
                <button
                  type="button"
                  key={label}
                  className={selected.includes(index) ? "checked" : ""}
                  onClick={() => toggleCheck(index)}
                  aria-pressed={selected.includes(index)}
                >
                  <span aria-hidden="true">{selected.includes(index) ? "✓" : "+"}</span>
                  {label}
                </button>
              ))}
            </div>

            <div className="miniTestResult" aria-live="polite">
              {score === 0 && <p>Cochez ce qui correspond à votre situation.</p>}
              {score === 1 && <p><strong>Piste à explorer.</strong> Un audit permettrait de vérifier si l’automatisation est réellement pertinente.</p>}
              {score === 2 && <p><strong>Cas d’usage à cadrer.</strong> Plusieurs signaux indiquent qu’un workflow assisté ou automatisé mérite d’être étudié.</p>}
              {score === 3 && <p><strong>Bon candidat pour l’audit.</strong> Nous pouvons cartographier le processus, les données, les outils et les contrôles humains nécessaires.</p>}
            </div>
          </div>

          <a className="useCaseAuditLink" href="#audit-ia">
            Inclure ce cas dans mon audit offert <span>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
