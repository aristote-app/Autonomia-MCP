"use client";

import { useMemo, useState } from "react";

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

const PLANS = {
  experts: {
    eyebrow: "AUTONOMIA EXPERTS",
    title: "Votre prochain levier est une capacité d’exécution externe.",
    description:
      "Le besoin pointe vers une expertise à ajouter rapidement au projet : cadrage du rôle, compétences critiques, niveau de séniorité puis sélection de profils.",
    actions: ["Reformuler le besoin", "Définir le rôle", "Sélectionner les expertises", "Staffer"]
  },
  academy: {
    eyebrow: "AUTONOMIA ACADEMY",
    title: "Votre prochain levier est une capacité interne.",
    description:
      "Le besoin pointe vers l’adoption, la montée en compétences ou la gouvernance. Le parcours doit partir des tâches et décisions réelles des équipes.",
    actions: ["Segmenter les publics", "Identifier les usages", "Construire le parcours", "Mesurer l’adoption"]
  },
  hybrid: {
    eyebrow: "AUTONOMIA / EXECUTION PLAN",
    title: "Votre besoin combine delivery immédiat et transfert de compétences.",
    description:
      "Le meilleur chemin combine une expertise externe pour faire avancer le projet et un dispositif interne pour rendre l’organisation progressivement autonome.",
    actions: ["Cadrer le besoin", "Activer l’expertise", "Transférer les méthodes", "Industrialiser"]
  }
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

function track(event, detail = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...detail });
}

export default function AutonomiaScan() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const done = step >= QUESTIONS.length;

  const planKey = useMemo(() => choosePlan(answers), [answers]);
  const plan = PLANS[planKey];

  function choose(id, value) {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    track("autonomia_scan_answer", { scan_step: id, scan_value: value });
    setTimeout(() => setStep((current) => Math.min(current + 1, QUESTIONS.length)), 110);
  }

  function handoffToLead() {
    const payload = {
      plan: planKey,
      answers,
      created_at: new Date().toISOString()
    };

    try {
      window.sessionStorage.setItem("autonomia_scan_context", JSON.stringify(payload));
    } catch {}

    window.dispatchEvent(new CustomEvent("autonomia-scan-complete", { detail: payload }));
    track("autonomia_scan_cta", { scan_plan: planKey, ...answers });
  }

  function restart() {
    setAnswers({});
    setStep(0);
    track("autonomia_scan_restart");
  }

  return (
    <div className="scanShell">
      <div className="scanTopline">
        <div>
          <span className="scanLiveDot" />
          <strong>AUTONOMIA SCAN</strong>
        </div>
        <span>{done ? "EXECUTION PLAN" : `0${step + 1} / 03`}</span>
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
        </div>
      ) : (
        <div className="scanResult">
          <div className="scanResultIntro">
            <p>{plan.eyebrow}</p>
            <h3>{plan.title}</h3>
            <div className="scanSignal">PLAN GÉNÉRÉ À PARTIR DE VOS 3 RÉPONSES</div>
            <p className="scanResultText">{plan.description}</p>
          </div>

          <ol className="scanPlan">
            {plan.actions.map((action, index) => (
              <li key={action}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{action}</strong>
              </li>
            ))}
          </ol>

          <div className="scanResultActions">
            <a
              className="scanPrimary"
              href="#contact"
              onClick={handoffToLead}
            >
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
