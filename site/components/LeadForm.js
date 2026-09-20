"use client";

import { useState } from "react";

const OPTIONS = {
  experts: ["GenAI / LLM", "RAG", "Agents IA", "AI Project Manager", "Data / ML", "MLOps / LLMOps", "Automatisation", "Gouvernance / AI Act", "Je ne sais pas encore"],
  academy: ["IA générative / ChatGPT", "Microsoft Copilot", "Prompt engineering", "Agents IA", "Automatisation", "IA pour managers", "Gouvernance / AI Act", "Formation sur mesure", "Je veux cadrer le besoin"],
  diagnostic: ["Évaluer notre maturité IA", "Identifier les compétences manquantes", "Cadrer un projet IA", "Identifier le bon profil IA", "Construire un plan de formation", "Évaluer notre usage de Copilot"]
};

function attribution() {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const get = (key) => url.searchParams.get(key);
  let firstTouch = null;
  let history = [];

  try {
    firstTouch = JSON.parse(window.localStorage.getItem("autonomia_first_touch") || "null");
    history = JSON.parse(window.localStorage.getItem("autonomia_attribution_history") || "[]");
  } catch {
    firstTouch = null;
    history = [];
  }

  return {
    landing_page_url: url.href,
    landing_page_topic: window.location.pathname,
    referrer_url: document.referrer || null,
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_content: get("utm_content"),
    utm_term: get("utm_term"),
    campaign_id: get("campaign_id") || get("meta_campaign_id"),
    adset_id: get("adset_id"),
    ad_id: get("ad_id"),
    creative_id: get("creative_id"),
    gclid: get("gclid"),
    fbclid: get("fbclid"),
    first_touch: firstTouch,
    attribution_history: history
  };
}

function track(event, detail = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...detail });
}

const SCAN_LABELS = {
  objective: {
    automate: "Automatiser un processus",
    build: "Construire un produit ou une fonctionnalité IA",
    agents: "Déployer des agents IA",
    copilot: "Déployer Copilot / ChatGPT",
    skills: "Faire monter les équipes en compétences",
    governance: "Cadrer gouvernance / AI Act"
  },
  stage: {
    idea: "Idée / besoin à clarifier",
    scoped: "Projet déjà cadré",
    pilot: "Pilote en cours",
    scale: "Déploiement / industrialisation"
  },
  gap: {
    expertise: "Il manque une expertise rare",
    delivery: "Il manque de capacité pour livrer",
    adoption: "Les équipes n’adoptent pas assez",
    skills: "Les compétences internes sont insuffisantes",
    governance: "Les règles / risques ne sont pas assez cadrés",
    unknown: "Blocage encore à qualifier"
  }
};

function scanMessage(scanContext) {
  if (!scanContext?.answers) return null;
  const { objective, stage, gap } = scanContext.answers;
  return [
    "Autonomia Scan",
    SCAN_LABELS.objective[objective],
    SCAN_LABELS.stage[stage],
    SCAN_LABELS.gap[gap]
  ].filter(Boolean).join(" · ");
}

export default function LeadForm({ mode = "experts", formId = "site-main", requestedService, scanContext = null }) {
  const [step, setStep] = useState(scanContext ? 3 : 1);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [data, setData] = useState({
    need: "",
    qualifier: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    marketingConsent: false
  });

  const labels = mode === "academy"
    ? ["Que souhaitez-vous faire progresser ?", "Combien de collaborateurs sont concernés ?"]
    : mode === "diagnostic"
      ? ["Que voulez-vous clarifier en priorité ?", "À quel stade en êtes-vous ?"]
      : ["De quelle expertise avez-vous besoin ?", "Quand souhaitez-vous démarrer ?"];

  const qualifiers = mode === "academy"
    ? ["1–10", "11–50", "51–200", "201+", "À définir"]
    : mode === "diagnostic"
      ? ["Réflexion", "Projet cadré", "Pilote en cours", "Déploiement", "Je ne sais pas"]
      : ["Dès que possible", "< 1 mois", "1–3 mois", "> 3 mois", "À définir"];

  const set = (key, value) => setData((current) => ({ ...current, [key]: value }));

  function next() {
    if (step === 1 && !data.need) return;
    if (step === 2 && !data.qualifier) return;
    track("form_step", { form_id: formId, step: step + 1, mode });
    setStep((value) => Math.min(3, value + 1));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!data.firstName || !data.email || !data.company) {
      setError("Merci de renseigner votre prénom, votre entreprise et votre e-mail.");
      return;
    }

    setStatus("sending");

    const payload = {
      external_lead_id: crypto.randomUUID(),
      source_channel: "website",
      source_platform: "autonomia_public_site",
      received_at: new Date().toISOString(),
      first_name: data.firstName,
      last_name: data.lastName || null,
      email: data.email,
      phone: data.phone || null,
      company_name: data.company,
      requested_service: requestedService || mode,
      message: scanMessage(scanContext) || data.need,
      desired_timeline: mode === "experts" ? data.qualifier : null,
      company_size: mode === "academy" ? data.qualifier : null,
      form_id: formId,
      scan_context: scanContext
        ? {
            version: scanContext.scan_version || null,
            source: scanContext.source || "autonomia_scan",
            plan: scanContext.plan,
            objective: scanContext.answers?.objective || null,
            objective_label: scanContext.answer_labels?.objective || null,
            stage: scanContext.answers?.stage || null,
            stage_label: scanContext.answer_labels?.stage || null,
            gap: scanContext.answers?.gap || null,
            gap_label: scanContext.answer_labels?.gap || null,
            diagnosis: scanContext.orientation?.diagnosis || null,
            priority: scanContext.orientation?.priority || null,
            watchout: scanContext.orientation?.watchout || null,
            next_steps: scanContext.orientation?.next_steps || [],
            recommended_roles: scanContext.execution?.roles || [],
            recommended_capabilities: scanContext.execution?.capabilities || [],
            recommended_training: scanContext.execution?.academy || [],
            completed_at: scanContext.created_at || null
          }
        : null,
      ...attribution(),
      marketing_consent: Boolean(data.marketingConsent),
      consent_timestamp: new Date().toISOString(),
      privacy_notice_version: "2026-09-20-v1",
      consent_source: formId
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("submission_failed");
      setStatus("sent");
      track("generate_lead", { form_id: formId, mode, requested_service: requestedService || mode });
    } catch {
      setStatus("error");
      setError("Le formulaire n’a pas pu être envoyé. Merci de réessayer.");
    }
  }

  if (status === "sent") {
    return (
      <div className="formSuccess" role="status">
        <span className="successIndex">✓</span>
        <div>
          <strong>Demande reçue.</strong>
          <p>Votre besoin a bien été transmis à Autonomia.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="leadForm" onSubmit={submit}>
      {scanContext && (
        <div className="scanContextSummary">
          <span>PLAN D’EXÉCUTION REPRIS</span>
          <strong>{scanMessage(scanContext)}</strong>
        </div>
      )}
      <div className="formTopline">
        <span>0{step}</span>
        <div className="progressTrack"><i style={{ width: `${(step / 3) * 100}%` }} /></div>
        <small>03</small>
      </div>

      {step === 1 && (
        <fieldset>
          <legend>{labels[0]}</legend>
          <div className="choiceGrid">
            {OPTIONS[mode].map((option) => (
              <button
                key={option}
                type="button"
                className={data.need === option ? "choice active" : "choice"}
                onClick={() => { set("need", option); track("form_start", { form_id: formId, mode }); }}
              >
                {option}
              </button>
            ))}
          </div>
          <button className="formNext" type="button" disabled={!data.need} onClick={next}>Continuer</button>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset>
          <legend>{labels[1]}</legend>
          <div className="choiceGrid">
            {qualifiers.map((option) => (
              <button
                key={option}
                type="button"
                className={data.qualifier === option ? "choice active" : "choice"}
                onClick={() => set("qualifier", option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="formActions">
            <button className="formBack" type="button" onClick={() => setStep(1)}>Retour</button>
            <button className="formNext" type="button" disabled={!data.qualifier} onClick={next}>Continuer</button>
          </div>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset>
          <legend>Où pouvons-nous vous répondre ?</legend>
          <div className="fieldGrid">
            <label><span>Prénom *</span><input value={data.firstName} onChange={(e) => set("firstName", e.target.value)} autoComplete="given-name" /></label>
            <label><span>Nom</span><input value={data.lastName} onChange={(e) => set("lastName", e.target.value)} autoComplete="family-name" /></label>
            <label><span>Entreprise *</span><input value={data.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" /></label>
            <label><span>E-mail professionnel *</span><input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" /></label>
            <label className="fullField"><span>Téléphone</span><input type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" /></label>
          </div>

          <label className="consentLine">
            <input type="checkbox" checked={data.marketingConsent} onChange={(e) => set("marketingConsent", e.target.checked)} />
            <span>J’accepte de recevoir des informations commerciales d’Autonomia. Facultatif.</span>
          </label>

          <p className="privacyNote">
            Les informations envoyées sont utilisées pour répondre à votre demande. Les mentions légales et la politique de confidentialité définitives seront reliées avant publication.
          </p>

          {error && <p className="formError" role="alert">{error}</p>}

          <div className="formActions">
            <button className="formBack" type="button" onClick={() => setStep(2)}>Retour</button>
            <button className="formNext" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Envoi…" : "Envoyer ma demande"}
            </button>
          </div>
        </fieldset>
      )}
    </form>
  );
}
