"use client";

import { useEffect, useMemo, useState } from "react";

const QUESTIONS = [
  {
    id: "objective",
    label: "Qu’est-ce que vous voulez réellement faire avancer ?",
    options: [
      ["automate", "Automatiser un processus"],
      ["build", "Construire un produit ou une fonctionnalité IA"],
      ["agents", "Déployer des agents IA"],
      ["copilot", "Déployer Copilot / ChatGPT"],
      ["skills", "Faire monter les équipes en compétences"],
      ["governance", "Cadrer gouvernance / AI Act"]
    ]
  },
  {
    id: "stage",
    label: "Où en êtes-vous aujourd’hui ?",
    options: [
      ["idea", "Idée / besoin à clarifier"],
      ["scoped", "Projet déjà cadré"],
      ["pilot", "Pilote en cours"],
      ["scale", "Déploiement / industrialisation"]
    ]
  },
  {
    id: "gap",
    label: "Quel est le principal blocage ?",
    options: [
      ["expertise", "Il manque une expertise rare"],
      ["delivery", "Il manque de capacité pour livrer"],
      ["adoption", "Les équipes n’adoptent pas assez"],
      ["skills", "Les compétences internes sont insuffisantes"],
      ["governance", "Les règles / risques ne sont pas assez cadrés"],
      ["unknown", "Je ne sais pas encore"]
    ]
  }
];

const FOCUS_CONTEXTS = {
  "diagnostic-maturite-ia": {
    label: "Maturité IA",
    action: "Vérifier si le frein vient du choix des usages, du delivery, des compétences ou du cadre de gouvernance."
  },
  "diagnostic-competences-ia": {
    label: "Compétences IA",
    action: "Distinguer ce qui doit être staffé ponctuellement de ce qui doit devenir une capacité interne."
  },
  "diagnostic-projet-ia": {
    label: "Projet IA",
    action: "Confronter le besoin à la valeur attendue, aux données, aux risques et à la capacité de delivery."
  },
  "audit-besoins-formation-ia": {
    label: "Besoins de formation",
    action: "Segmenter les publics et les usages avant de construire un programme commun."
  },
  "quel-profil-ia": {
    label: "Profil IA",
    action: "Définir le travail à accomplir et le niveau d’autonomie avant de figer un intitulé de rôle."
  },
  "diagnostic-copilot": {
    label: "Adoption Copilot",
    action: "Identifier les populations et tâches où Copilot doit produire un changement de pratique observable."
  },
  "quiz-ia-entreprise": {
    label: "Exécution IA",
    action: "Identifier le goulot d’étranglement principal avant de lancer une nouvelle initiative."
  }
};

const OBJECTIVE_BLUEPRINTS = {
  automate: {
    mission: "Passer d’un processus manuel à un workflow automatisé, contrôlable et maintenable.",
    skills: ["Cartographie de processus", "Automatisation", "Intégration API", "Agents / orchestration"],
    profiles: ["Automation Engineer", "AI Project Manager", "Agentic AI Engineer"],
    academy: ["Automatisation métier", "Supervision des workflows", "Bonnes pratiques IA"]
  },
  build: {
    mission: "Transformer un besoin métier en produit ou fonctionnalité IA exploitable.",
    skills: ["Product discovery", "GenAI / LLM", "Architecture", "Évaluation"],
    profiles: ["AI Product Manager", "GenAI Engineer", "LLM Engineer"],
    academy: ["Acculturation produit IA", "Prompting métier", "Adoption"]
  },
  agents: {
    mission: "Concevoir des agents capables d’agir dans un cadre défini, avec contrôles et escalades.",
    skills: ["Agentic AI", "Tool calling", "Orchestration", "Évaluation / guardrails"],
    profiles: ["Agentic AI Engineer", "AI Agent Engineer", "LLM Engineer"],
    academy: ["Agents IA pour métiers", "Supervision humaine", "Risques et gouvernance"]
  },
  copilot: {
    mission: "Faire de Copilot / ChatGPT un usage métier réel plutôt qu’une licence sous-utilisée.",
    skills: ["Cas d’usage", "Adoption", "Gouvernance", "Conduite du changement"],
    profiles: ["AI Adoption Lead", "AI Project Manager", "AI Governance Consultant"],
    academy: ["Microsoft Copilot", "ChatGPT entreprise", "Prompt engineering"]
  },
  skills: {
    mission: "Créer une montée en compétences directement reliée aux tâches des équipes.",
    skills: ["Cartographie des usages", "Ingénierie pédagogique", "Adoption", "Mesure"],
    profiles: ["AI Learning Lead", "AI Adoption Consultant", "AI Governance Consultant"],
    academy: ["IA générative", "IA métiers", "Managers + IA"]
  },
  governance: {
    mission: "Mettre en place le cadre qui permet d’utiliser et déployer l’IA avec des règles explicites.",
    skills: ["AI Governance", "AI Act", "Risk mapping", "Politiques d’usage"],
    profiles: ["AI Governance Consultant", "Responsible AI Expert", "AI Project Manager"],
    academy: ["AI Act", "Responsible AI", "Gouvernance pour managers"]
  }
};

const STAGE_PRIORITIES = {
  idea: ["Clarifier le résultat business attendu", "Qualifier faisabilité, données et risques", "Définir un premier périmètre testable"],
  scoped: ["Valider l’architecture et les rôles", "Sécuriser les dépendances critiques", "Organiser le delivery"],
  pilot: ["Mesurer ce qui fonctionne réellement", "Corriger les points de friction", "Préparer le passage à l’échelle"],
  scale: ["Industrialiser le delivery", "Renforcer gouvernance et monitoring", "Transférer les compétences aux équipes"]
};

const CONVERSATION_QUESTIONS = {
  experts: [
    "Quel livrable ou résultat doit être obtenu par l’expert ?",
    "Dans quel environnement technique et organisationnel devra-t-il intervenir ?",
    "Quel niveau d’autonomie et de séniorité est réellement nécessaire ?"
  ],
  academy: [
    "Quelles populations doivent changer leur façon de travailler ?",
    "Quels usages doivent être maîtrisés en priorité ?",
    "Quels outils, règles internes et contraintes doivent être intégrés au parcours ?"
  ],
  hybrid: [
    "Quelle partie du besoin doit avancer immédiatement avec une expertise externe ?",
    "Quelles compétences doivent rester durablement dans l’organisation ?",
    "Quels risques, dépendances ou règles doivent être cadrés avant le déploiement ?"
  ]
};

function choosePlan(answers) {
  const { objective, gap } = answers;

  if (objective === "skills" || objective === "copilot" || gap === "adoption" || gap === "skills") {
    return "academy";
  }

  if (objective === "governance" || gap === "governance") {
    return "hybrid";
  }

  if (gap === "expertise" || gap === "delivery" || ["build", "agents", "automate"].includes(objective)) {
    return "experts";
  }

  return "hybrid";
}

function buildDiagnosis(answers, focus) {
  const blueprint = OBJECTIVE_BLUEPRINTS[answers.objective] || OBJECTIVE_BLUEPRINTS.build;
  const stagePriorities = STAGE_PRIORITIES[answers.stage] || STAGE_PRIORITIES.idea;
  const plan = choosePlan(answers);
  const focusContext = FOCUS_CONTEXTS[focus] || null;

  const gapAction = {
    expertise: "Identifier l’expertise rare qui manque avant de chercher un intitulé de poste.",
    delivery: "Ajouter de la capacité d’exécution sans recréer une équipe complète.",
    adoption: "Traiter l’usage réel, les routines et le management du changement.",
    skills: "Former les bons publics sur les tâches qu’ils doivent réellement réaliser.",
    governance: "Poser les règles, responsabilités et contrôles avant l’extension des usages.",
    unknown: "Qualifier le blocage avant d’engager budget, recrutement ou formation."
  }[answers.gap];

  const priorities = focusContext
    ? [...stagePriorities.slice(0, 2), gapAction, focusContext.action].filter(Boolean)
    : [...stagePriorities, gapAction].filter(Boolean).slice(0, 4);

  return {
    plan,
    mission: blueprint.mission,
    skills: blueprint.skills,
    profiles: blueprint.profiles,
    academy: blueprint.academy,
    priorities,
    focusLabel: focusContext?.label || null,
    conversationQuestions: CONVERSATION_QUESTIONS[plan]
  };
}

function track(event, detail = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...detail });
}

export default function AutonomiaScan() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [focus, setFocus] = useState(null);
  const done = step >= QUESTIONS.length;

  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const requestedFocus = params.get("focus");
    setFocus(FOCUS_CONTEXTS[requestedFocus] ? requestedFocus : null);
  }, []);

  const diagnosis = useMemo(() => buildDiagnosis(answers, focus), [answers, focus]);

  function choose(id, value) {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    track("autonomia_scan_answer", {
      scan_step: id,
      scan_value: value,
      scan_focus: focus
    });
    setTimeout(() => setStep((currentStep) => Math.min(currentStep + 1, QUESTIONS.length)), 110);
  }

  function buildPayload() {
    return {
      plan: diagnosis.plan,
      source_diagnostic: focus,
      source_diagnostic_label: diagnosis.focusLabel,
      answers,
      mission: diagnosis.mission,
      skills_needed: diagnosis.skills,
      suggested_profiles: diagnosis.profiles,
      training_needs: diagnosis.academy,
      priorities: diagnosis.priorities,
      commercial_handoff: {
        route: diagnosis.plan,
        questions_to_qualify_next: diagnosis.conversationQuestions
      },
      orientation_disclaimer: "Première orientation basée uniquement sur les réponses fournies au Scan.",
      created_at: new Date().toISOString()
    };
  }

  function handoffToLead() {
    const payload = buildPayload();

    try {
      window.sessionStorage.setItem("autonomia_scan_context", JSON.stringify(payload));
    } catch {}

    window.dispatchEvent(new CustomEvent("autonomia-scan-complete", { detail: payload }));
    track("autonomia_scan_cta", {
      scan_plan: diagnosis.plan,
      scan_objective: answers.objective,
      scan_stage: answers.stage,
      scan_gap: answers.gap,
      scan_focus: focus
    });
  }

  function restart() {
    setAnswers({});
    setStep(0);
    track("autonomia_scan_restart", { scan_focus: focus });
  }

  return (
    <div className="scanShell">
      <div className="scanTopline">
        <div>
          <span className="scanLiveDot" />
          <strong>AUTONOMIA SCAN</strong>
        </div>
        <span>{done ? "AI EXECUTION PLAN" : `0${step + 1} / 03`}</span>
      </div>

      {!done ? (
        <div className="scanQuestion">
          <p>DIAGNOSTIC D’EXÉCUTION IA</p>
          {diagnosis.focusLabel && (
            <div className="scanFocus">ANGLE D’ENTRÉE · {diagnosis.focusLabel}</div>
          )}
          <h3>{QUESTIONS[step].label}</h3>
          <div className="scanChoices">
            {QUESTIONS[step].options.map(([value, label], index) => (
              <button key={value} type="button" onClick={() => choose(QUESTIONS[step].id, value)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{label}</strong>
                <b>→</b>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="scanResult">
          <div className="scanResultIntro">
            <p>AUTONOMIA / PREMIÈRE ORIENTATION</p>
            {diagnosis.focusLabel && (
              <div className="scanFocus">CONTEXTE CONSERVÉ · {diagnosis.focusLabel}</div>
            )}
            <h3>{diagnosis.mission}</h3>
            <div className="scanSignal">PLAN GÉNÉRÉ À PARTIR DE VOS 3 RÉPONSES</div>
            <p className="scanResultText">
              Ce résultat n’est pas une analyse scientifique : c’est une première orientation structurée
              pour identifier les capacités à mobiliser avant un cadrage plus détaillé.
            </p>
          </div>

          <div className="scanDiagnosisGrid">
            <article>
              <span>COMPÉTENCES À MOBILISER</span>
              <ul>{diagnosis.skills.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article>
              <span>PROFILS À ÉVALUER</span>
              <ul>{diagnosis.profiles.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article>
              <span>COMPÉTENCES INTERNES</span>
              <ul>{diagnosis.academy.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </div>

          <div className="scanPriorityBlock">
            <span>PROCHAINES ÉTAPES</span>
            <ol className="scanPlan">
              {diagnosis.priorities.map((action, index) => (
                <li key={action}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{action}</strong>
                </li>
              ))}
            </ol>
          </div>

          <div className="scanResultActions">
            <a className="scanPrimary" href="#contact" onClick={handoffToLead}>
              Transformer ce plan en action
            </a>
            <button type="button" onClick={restart}>Recommencer</button>
          </div>
        </div>
      )}

      <div className="scanFooter">
        <span>OBJECTIF</span>
        <i className={answers.objective ? "active" : ""} />
        <span>MATURITÉ</span>
        <i className={answers.stage ? "active" : ""} />
        <span>BLOCAGE</span>
        <i className={answers.gap ? "active" : ""} />
        <span>PLAN</span>
      </div>
    </div>
  );
}
