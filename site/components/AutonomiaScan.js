"use client";

import { useMemo, useState } from "react";
import LeadForm from "@/components/LeadForm";
import { trackEvent } from "@/lib/clientTracking";

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

const LABELS = Object.fromEntries(
  QUESTIONS.map((question) => [
    question.id,
    Object.fromEntries(question.options)
  ])
);

const EXECUTION_MAP = {
  automate: {
    roles: ["Automation / AI Agent Engineer", "AI Project Manager"],
    capabilities: ["Process mapping", "n8n / Make / Power Automate", "Agents IA", "Human-in-the-loop"],
    academy: ["Automatisation métier", "Supervision des agents", "Gouvernance des usages"]
  },
  build: {
    roles: ["AI Product Manager", "GenAI / LLM Engineer", "AI Project Manager"],
    capabilities: ["Product discovery", "LLM", "Évaluation", "API / intégration"],
    academy: ["IA pour Product / métiers", "Méthodes de cadrage IA"]
  },
  agents: {
    roles: ["AI Agent Engineer", "LLM Engineer", "AI Project Manager"],
    capabilities: ["Agentic workflows", "Tool use", "RAG", "Évaluation", "Observability"],
    academy: ["Agents IA", "Supervision humaine", "Risques et permissions"]
  },
  copilot: {
    roles: ["AI Adoption Lead", "AI Project Manager"],
    capabilities: ["Cas d’usage", "Microsoft 365", "Change", "Governance"],
    academy: ["Microsoft Copilot", "Prompt engineering", "Adoption par métier"]
  },
  skills: {
    roles: ["AI Learning Lead", "Formateur IA métier"],
    capabilities: ["Skills mapping", "Cas d’usage", "Learning design", "Adoption"],
    academy: ["IA générative", "Managers", "Métiers", "Parcours sur mesure"]
  },
  governance: {
    roles: ["AI Governance Consultant", "AI Project Manager"],
    capabilities: ["AI Act", "Responsible AI", "Risk mapping", "Human oversight"],
    academy: ["AI Act", "Gouvernance IA", "Sensibilisation des équipes"]
  }
};

const PLAN_COPY = {
  experts: {
    eyebrow: "AUTONOMIA EXPERTS",
    title: "Le premier levier à examiner est une capacité d’exécution externe.",
    description:
      "Vos réponses orientent vers une compétence à mobiliser sur le projet avant d’élargir le dispositif."
  },
  academy: {
    eyebrow: "AUTONOMIA ACADEMY",
    title: "Le premier levier à examiner est la capacité interne des équipes.",
    description:
      "Vos réponses orientent vers l’adoption, la montée en compétences ou la diffusion de pratiques réutilisables."
  },
  hybrid: {
    eyebrow: "AUTONOMIA / EXECUTION PLAN",
    title: "Votre besoin semble combiner exécution immédiate et capacité interne.",
    description:
      "Vos réponses indiquent qu’un seul levier risque d’être insuffisant : expertise ciblée et montée en compétences doivent être cadrées ensemble."
  }
};

const STAGE_GUIDANCE = {
  idea: {
    priority: "Transformer l’objectif en cas d’usage priorisé avant de choisir la solution.",
    next: ["Définir le résultat attendu", "Choisir un cas d’usage", "Lister données, outils et contraintes", "Valider le rôle réellement nécessaire"],
    watchout: "Risque principal à ce stade : choisir un outil ou un profil avant d’avoir défini le travail à accomplir."
  },
  scoped: {
    priority: "Valider que le cadrage se traduit bien en compétences, responsabilités et critères de réussite.",
    next: ["Relire le périmètre", "Identifier les compétences critiques", "Fixer les responsabilités", "Préparer le démarrage"],
    watchout: "Risque principal à ce stade : un projet cadré fonctionnellement mais sans propriétaire clair de l’exécution."
  },
  pilot: {
    priority: "Identifier ce qui empêche le pilote de devenir un système fiable et réutilisable.",
    next: ["Mesurer les écarts du pilote", "Prioriser les blocages", "Renforcer les compétences manquantes", "Préparer le passage à l’échelle"],
    watchout: "Risque principal à ce stade : prolonger le pilote sans traiter l’intégration, l’évaluation, la gouvernance ou l’adoption."
  },
  scale: {
    priority: "Sécuriser l’industrialisation, l’adoption et la capacité à maintenir le dispositif.",
    next: ["Clarifier ownership et run", "Renforcer l’industrialisation", "Former les utilisateurs clés", "Mettre en place gouvernance et suivi"],
    watchout: "Risque principal à ce stade : augmenter le volume avant d’avoir stabilisé les responsabilités, les contrôles et l’adoption."
  }
};

const GAP_GUIDANCE = {
  expertise: "Le frein déclaré est une compétence spécialisée absente du dispositif actuel.",
  delivery: "Le frein déclaré est moins l’idée que la capacité disponible pour la livrer.",
  adoption: "Le frein déclaré se situe après la technologie : les usages ne se diffusent pas suffisamment.",
  skills: "Le frein déclaré est la capacité des équipes à reproduire les usages de façon autonome.",
  governance: "Le frein déclaré concerne les règles, les risques ou les responsabilités autour des usages IA.",
  unknown: "Le blocage reste à qualifier ; le prochain échange doit d’abord isoler le vrai point de friction."
};

const COMMERCIAL_HANDOFF = {
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
    "Quelle partie doit avancer immédiatement avec une expertise externe ?",
    "Quelles compétences doivent rester durablement dans l’organisation ?",
    "Quels risques ou dépendances doivent être cadrés avant le déploiement ?"
  ]
};

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function choosePlan(answers) {
  const { objective, gap, stage } = answers;

  if (objective === "skills" || objective === "copilot" || gap === "adoption" || gap === "skills") {
    return stage === "scale" && gap === "delivery" ? "hybrid" : "academy";
  }

  if (objective === "governance" || gap === "governance") {
    return "hybrid";
  }

  if (gap === "expertise" || gap === "delivery" || ["build", "agents", "automate"].includes(objective)) {
    return stage === "scale" && gap === "adoption" ? "hybrid" : "experts";
  }

  return "hybrid";
}

function buildExecution(answers) {
  const base = EXECUTION_MAP[answers.objective] || EXECUTION_MAP.build;
  const roles = [...base.roles];
  const capabilities = [...base.capabilities];
  const academy = [...base.academy];

  if (answers.stage === "idea" && !roles.includes("AI Product Manager")) {
    roles.unshift("AI Product / Project Manager");
  }

  if (answers.stage === "scale" && ["build", "agents"].includes(answers.objective)) {
    roles.push("MLOps / LLMOps");
    capabilities.push("Observability", "Run / industrialisation");
  }

  if (answers.gap === "governance") {
    roles.push("AI Governance Consultant");
    capabilities.push("Risk mapping", "Human oversight");
    academy.push("Gouvernance IA");
  }

  if (answers.gap === "adoption" || answers.gap === "skills") {
    roles.push("AI Adoption / Learning Lead");
    capabilities.push("Change management", "Skills mapping");
  }

  return {
    roles: unique(roles).slice(0, 4),
    capabilities: unique(capabilities).slice(0, 6),
    academy: unique(academy).slice(0, 4)
  };
}

function buildRecommendation(answers) {
  const plan = choosePlan(answers);
  const stage = STAGE_GUIDANCE[answers.stage] || STAGE_GUIDANCE.idea;
  const execution = buildExecution(answers);
  const objectiveLabel = LABELS.objective[answers.objective] || "Objectif IA à préciser";
  const stageLabel = LABELS.stage[answers.stage] || "Stade à préciser";
  const gapLabel = LABELS.gap[answers.gap] || "Blocage à préciser";

  return {
    plan,
    execution,
    objectiveLabel,
    stageLabel,
    gapLabel,
    diagnosis: `${objectiveLabel}. Vous êtes au stade « ${stageLabel} ». ${GAP_GUIDANCE[answers.gap] || GAP_GUIDANCE.unknown}`,
    priority: stage.priority,
    watchout: stage.watchout,
    nextSteps: stage.next
  };
}

export default function AutonomiaScan({
  captureLead = false,
  source = "autonomia_scan",
  leadFormId = "scan-inline",
  requestedService = null
} = {}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [leadContext, setLeadContext] = useState(null);
  const done = step >= QUESTIONS.length;

  const recommendation = useMemo(() => buildRecommendation(answers), [answers]);
  const plan = PLAN_COPY[recommendation.plan];

  function choose(id, value) {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    trackEvent("autonomia_scan_answer", { scan_step: id, scan_value: value, scan_source: source });
    setTimeout(() => setStep((current) => Math.min(current + 1, QUESTIONS.length)), 110);
  }

  function back() {
    setStep((current) => Math.max(0, current - 1));
    trackEvent("autonomia_scan_back", { scan_source: source });
  }

  function buildPayload() {
    return {
      source,
      scan_version: "2.0",
      plan: recommendation.plan,
      answers,
      answer_labels: {
        objective: recommendation.objectiveLabel,
        stage: recommendation.stageLabel,
        gap: recommendation.gapLabel
      },
      orientation: {
        diagnosis: recommendation.diagnosis,
        priority: recommendation.priority,
        watchout: recommendation.watchout,
        next_steps: recommendation.nextSteps
      },
      execution: {
        roles: recommendation.execution.roles,
        capabilities: recommendation.execution.capabilities,
        academy: recommendation.execution.academy
      },
      commercial_handoff: {
        route: recommendation.plan,
        questions_to_qualify_next: COMMERCIAL_HANDOFF[recommendation.plan]
      },
      created_at: new Date().toISOString()
    };
  }

  function handoffToLead() {
    const payload = buildPayload();

    try {
      window.sessionStorage.setItem("autonomia_scan_context", JSON.stringify(payload));
    } catch {}

    if (captureLead) {
      setLeadContext(payload);
    } else {
      window.dispatchEvent(new CustomEvent("autonomia-scan-complete", { detail: payload }));
    }

    trackEvent("autonomia_scan_cta", {
      scan_plan: recommendation.plan,
      scan_version: payload.scan_version,
      scan_capture_mode: captureLead ? "inline" : "handoff",
      scan_source: source,
      ...answers
    });
  }

  function restart() {
    setAnswers({});
    setLeadContext(null);
    setStep(0);
    trackEvent("autonomia_scan_restart", { scan_source: source });
  }

  return (
    <div className="scanShell">
      <div className="scanTopline">
        <div>
          <span className="scanLiveDot" />
          <strong>AUTONOMIA SCAN</strong>
        </div>
        <span>{done ? "PREMIER EXECUTION PLAN" : `0${step + 1} / 03`}</span>
      </div>

      {!done ? (
        <div className="scanQuestion">
          <p>DIAGNOSTIC D’EXÉCUTION IA</p>
          <h3>{QUESTIONS[step].label}</h3>
          <div className="scanChoices">
            {QUESTIONS[step].options.map(([value, label], index) => (
              <button
                key={value}
                type="button"
                onClick={() => choose(QUESTIONS[step].id, value)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{label}</strong>
                <b>→</b>
              </button>
            ))}
          </div>
          {step > 0 && (
            <button className="scanBack" type="button" onClick={back}>
              ← Modifier la réponse précédente
            </button>
          )}
        </div>
      ) : (
        <div className="scanResult">
          <div className="scanResultIntro">
            <p>{plan.eyebrow}</p>
            <h3>{plan.title}</h3>
            <div className="scanSignal">ORIENTATION CONSTRUITE À PARTIR DE VOS 3 RÉPONSES</div>
            <p className="scanResultText">{plan.description}</p>

            <div className="scanInterpretation">
              <div>
                <span>LECTURE DU BESOIN</span>
                <strong>{recommendation.diagnosis}</strong>
              </div>
              <div className="signal">
                <span>PRIORITÉ IMMÉDIATE</span>
                <strong>{recommendation.priority}</strong>
              </div>
            </div>

            <div className="scanBlueprint">
              <div>
                <span>PROFILS À EXAMINER</span>
                <strong>{recommendation.execution.roles.join(" · ")}</strong>
              </div>
              <div>
                <span>COMPÉTENCES À MOBILISER</span>
                <strong>{recommendation.execution.capabilities.join(" · ")}</strong>
              </div>
              <div>
                <span>COMPÉTENCES INTERNES À RENFORCER</span>
                <strong>{recommendation.execution.academy.join(" · ")}</strong>
              </div>
            </div>
          </div>

          <div className="scanResultSide">
            <div className="scanPlanLabel">PROCHAINES ÉTAPES</div>
            <ol className="scanPlan">
              {recommendation.nextSteps.map((action, index) => (
                <li key={action}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{action}</strong>
                </li>
              ))}
            </ol>
            <div className="scanWatchout">
              <span>POINT DE VIGILANCE</span>
              <p>{recommendation.watchout}</p>
            </div>
          </div>

          <div className="scanResultActions">
            {captureLead ? (
              <button
                type="button"
                className="scanPrimary"
                onClick={handoffToLead}
              >
                Continuer avec ce plan
              </button>
            ) : (
              <a
                className="scanPrimary"
                href="#contact"
                onClick={handoffToLead}
              >
                Transmettre ce plan à Autonomia
              </a>
            )}
            <button type="button" onClick={restart}>Recommencer</button>
          </div>

          <p className="scanDisclaimer">
            Première orientation fondée uniquement sur vos réponses au Scan. Le cadrage final doit confirmer le contexte, les contraintes et les compétences réellement nécessaires.
          </p>

          {captureLead && leadContext && (
            <div className="scanInlineLead" id="scan-contact">
              <div className="scanInlineLeadCopy">
                <span>VOTRE PLAN EST PRÉREMPLI</span>
                <strong>Ajoutez uniquement vos coordonnées pour transmettre cette orientation.</strong>
              </div>
              <LeadForm
                mode="diagnostic"
                formId={leadFormId}
                requestedService={requestedService || `scan_${recommendation.plan}`}
                scanContext={leadContext}
              />
            </div>
          )}
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
