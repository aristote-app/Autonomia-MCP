"use client";

import { useEffect, useMemo, useState } from "react";
import { trackEvent, trackLeadConversion } from "@/lib/clientTracking";

const AREAS = [
  "Direction / stratégie",
  "Commercial / marketing",
  "Relation client / support",
  "Administration / finance",
  "RH / formation",
  "Opérations / production",
  "IT / Data / DSI",
  "Autre"
];

const PAINS = [
  "Trop d’e-mails ou de demandes à traiter",
  "Information difficile à retrouver",
  "Copier-coller / doubles saisies",
  "Comptes rendus et relances après réunion",
  "Reporting ou consolidation manuelle",
  "Documents répétitifs à produire",
  "Questions récurrentes à traiter",
  "Qualification et suivi commercial",
  "Onboarding / procédures internes",
  "Contrôle de dossiers ou de pièces"
];

const OUTCOMES = [
  "Gagner du temps",
  "Réduire les tâches répétitives",
  "Réduire les erreurs",
  "Accélérer les délais de traitement",
  "Mieux exploiter nos documents / données",
  "Créer un assistant ou un agent IA",
  "Automatiser un processus de bout en bout",
  "Faire monter les équipes en compétences",
  "Je veux être conseillé"
];

const TIMELINES = ["Dès que possible", "< 1 mois", "1–3 mois", "3–6 mois", "À définir"];

const STEP_LABELS = [
  ["01", "Zone"],
  ["02", "Irritants"],
  ["03", "Contexte"],
  ["04", "Résultat"],
  ["05", "Détails"],
  ["06", "Contact"]
];

function toggle(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

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

export default function NeedBriefQuestionnaire({ initialEmail = "" }) {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [solutionContext, setSolutionContext] = useState(null);
  const [data, setData] = useState({
    areas: [],
    companySize: "",
    organizationContext: "",
    pains: [],
    processToday: "",
    toolsToday: "",
    outcomes: [],
    desiredResult: "",
    constraints: "",
    timeline: "",
    firstName: "",
    lastName: "",
    company: "",
    email: initialEmail,
    phone: "",
    marketingConsent: false
  });

  const set = (key, value) => setData((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    function applyUseCase(detail) {
      if (!detail?.title) return;
      setData((current) => ({
        ...current,
        pains: current.pains.includes(detail.title) ? current.pains : [...current.pains, detail.title],
        processToday: current.processToday || detail.pain || ""
      }));
      setStep(2);
    }

    try {
      const stored = JSON.parse(window.sessionStorage.getItem("autonomia_selected_usecase") || "null");
      if (stored) applyUseCase(stored);
    } catch {}

    function onUseCase(event) {
      applyUseCase(event.detail);
    }

    function onSolution(event) {
      const detail = event.detail;
      if (!detail?.original_query) return;

      const roles = (detail.roles || []).map((item) => item.label).filter(Boolean);
      const trainings = (detail.trainings || []).map((item) => item.title).filter(Boolean);

      setSolutionContext(detail);
      setData((current) => ({
        ...current,
        processToday: current.processToday || detail.original_query,
        desiredResult: current.desiredResult || detail.summary || "",
        constraints: current.constraints || [
          roles.length ? `Métiers proposés : ${roles.join(", ")}` : null,
          trainings.length ? `Formations proposées : ${trainings.join(", ")}` : null
        ].filter(Boolean).join("\n")
      }));
      setStep(4);
    }

    window.addEventListener("autonomia-usecase-selected", onUseCase);
    window.addEventListener("autonomia-solution-complete", onSolution);
    return () => {
      window.removeEventListener("autonomia-usecase-selected", onUseCase);
      window.removeEventListener("autonomia-solution-complete", onSolution);
    };
  }, []);

  const brief = useMemo(() => ({
    areas: data.areas,
    company_size: data.companySize || null,
    organization_context: data.organizationContext || null,
    pains: data.pains,
    current_process: data.processToday || null,
    current_tools: data.toolsToday || null,
    expected_outcomes: data.outcomes,
    desired_result: data.desiredResult || null,
    constraints: data.constraints || null,
    timeline: data.timeline || null
  }), [data]);

  function go(nextStep) {
    setError("");

    if (step === 1 && data.areas.length === 0) {
      setError("Choisissez au moins une zone concernée.");
      return;
    }

    if (step === 2 && data.pains.length === 0) {
      setError("Choisissez au moins un irritant.");
      return;
    }

    if (step === 4 && data.outcomes.length === 0) {
      setError("Choisissez au moins un résultat attendu.");
      return;
    }

    trackEvent("need_brief_step", { form_id: "home-need-brief", step: nextStep });
    setStep(nextStep);
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!data.firstName || !data.company || !data.email) {
      setError("Merci de renseigner votre prénom, votre entreprise et votre e-mail professionnel.");
      return;
    }

    setStatus("sending");

    const message = [
      "FICHE BESOIN AUTONOMIA",
      data.areas.length ? `Zone(s) : ${data.areas.join(", ")}` : null,
      data.companySize ? `Taille : ${data.companySize}` : null,
      data.organizationContext ? `Contexte : ${data.organizationContext}` : null,
      data.pains.length ? `Irritants : ${data.pains.join(" | ")}` : null,
      data.processToday ? `Processus actuel : ${data.processToday}` : null,
      data.toolsToday ? `Outils actuels : ${data.toolsToday}` : null,
      data.outcomes.length ? `Résultats attendus : ${data.outcomes.join(" | ")}` : null,
      data.desiredResult ? `Résultat souhaité : ${data.desiredResult}` : null,
      data.constraints ? `Contraintes / données : ${data.constraints}` : null,
      data.timeline ? `Timing : ${data.timeline}` : null
    ].filter(Boolean).join("\n");

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
      requested_service: solutionContext ? `solution_${solutionContext.route || "hybrid"}` : "diagnostic_ia",
      message,
      desired_timeline: data.timeline || null,
      company_size: data.companySize || null,
      form_id: "home-need-brief",
      need_brief: brief,
      solution_context: solutionContext
        ? {
            source: solutionContext.source || "solution_finder",
            original_query: solutionContext.original_query || null,
            summary: solutionContext.summary || null,
            route: solutionContext.route || null,
            recommended_roles: solutionContext.roles || [],
            recommended_training: solutionContext.trainings || [],
            completed_at: solutionContext.created_at || null
          }
        : null,
      ...attribution(),
      marketing_consent: Boolean(data.marketingConsent),
      consent_timestamp: new Date().toISOString(),
      privacy_notice_version: "2026-09-20-v1",
      consent_source: "home-need-brief"
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("submission_failed");
      setStatus("sent");
      trackLeadConversion({
        form_id: "home-need-brief",
        mode: "diagnostic",
        requested_service: solutionContext ? `solution_${solutionContext.route || "hybrid"}` : "diagnostic_ia"
      });
    } catch {
      setStatus("error");
      setError("La fiche n’a pas pu être envoyée. Merci de réessayer.");
    }
  }

  if (status === "sent") {
    return (
      <section className="needBriefSection needBriefSuccessScreen" id="fiche-besoin">
        <div className="needBriefSuccess" role="status">
          <span>✓</span>
          <div>
            <p className="sectionIndex">FICHE BESOIN TRANSMISE</p>
            <h2>Votre besoin est arrivé chez Autonomia déjà structuré.</h2>
            <p>Nous disposons du contexte, des irritants, du résultat attendu et de vos coordonnées pour préparer l’échange.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`needBriefSection needBriefStep${step}`} id="fiche-besoin">
      <form className="needBriefForm" onSubmit={submit}>
        <div className="needBriefProgress needBriefProgressSix" aria-label={`Étape ${step} sur 6`}>
          {STEP_LABELS.map(([number, label], index) => {
            const item = index + 1;
            return (
              <button
                key={number}
                type="button"
                className={item === step ? "active" : item < step ? "done" : ""}
                onClick={() => item < step && setStep(item)}
                disabled={item > step}
              >
                <span>{number}</span>
                <strong>{label}</strong>
              </button>
            );
          })}
        </div>

        {step === 1 && (
          <fieldset className="needBriefPane">
            <legend>Où se situe le besoin dans votre organisation ?</legend>
            <p className="paneHelp">Plusieurs réponses possibles.</p>
            <div className="needCheckGrid">
              {AREAS.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={data.areas.includes(item) ? "selected" : ""}
                  onClick={() => set("areas", toggle(data.areas, item))}
                >
                  <span>{data.areas.includes(item) ? "✓" : "+"}</span>{item}
                </button>
              ))}
            </div>
            {error && <p className="formError" role="alert">{error}</p>}
            <button className="briefNext" type="button" onClick={() => go(2)}>Continuer →</button>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="needBriefPane">
            <legend>Qu’est-ce qui vous ralentit aujourd’hui ?</legend>
            <p className="paneHelp">Choisissez les irritants les plus proches de votre situation.</p>
            <div className="needCheckGrid">
              {PAINS.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={data.pains.includes(item) ? "selected" : ""}
                  onClick={() => set("pains", toggle(data.pains, item))}
                >
                  <span>{data.pains.includes(item) ? "✓" : "+"}</span>{item}
                </button>
              ))}
            </div>
            {error && <p className="formError" role="alert">{error}</p>}
            <div className="briefActions">
              <button type="button" className="briefBack" onClick={() => setStep(1)}>← Retour</button>
              <button type="button" className="briefNext" onClick={() => go(3)}>Continuer →</button>
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset className="needBriefPane">
            <legend>Quel est votre contexte actuel ?</legend>
            <p className="paneHelp">Quelques informations suffisent pour comprendre le terrain.</p>
            <div className="needBriefFields twoCols">
              <label>
                <span>Taille de l’organisation</span>
                <select value={data.companySize} onChange={(e) => set("companySize", e.target.value)}>
                  <option value="">À préciser</option>
                  <option value="1–10">1–10</option>
                  <option value="11–50">11–50</option>
                  <option value="51–200">51–200</option>
                  <option value="201–1000">201–1000</option>
                  <option value="1000+">1000+</option>
                </select>
              </label>
              <label>
                <span>Votre contexte</span>
                <textarea
                  rows="3"
                  value={data.organizationContext}
                  onChange={(e) => set("organizationContext", e.target.value)}
                  placeholder="Équipe concernée, activité, situation..."
                />
              </label>
              <label>
                <span>Processus aujourd’hui</span>
                <textarea
                  rows="3"
                  value={data.processToday}
                  onChange={(e) => set("processToday", e.target.value)}
                  placeholder="Qui fait quoi, à quel moment, où ça bloque..."
                />
              </label>
              <label>
                <span>Outils déjà utilisés</span>
                <textarea
                  rows="3"
                  value={data.toolsToday}
                  onChange={(e) => set("toolsToday", e.target.value)}
                  placeholder="Outlook, Excel, CRM, Drive, logiciel métier..."
                />
              </label>
            </div>
            <div className="briefActions">
              <button type="button" className="briefBack" onClick={() => setStep(2)}>← Retour</button>
              <button type="button" className="briefNext" onClick={() => go(4)}>Continuer →</button>
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <fieldset className="needBriefPane">
            <legend>Quel résultat voulez-vous obtenir ?</legend>
            <p className="paneHelp">Choisissez un ou plusieurs objectifs.</p>
            <div className="needCheckGrid outcomes">
              {OUTCOMES.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={data.outcomes.includes(item) ? "selected" : ""}
                  onClick={() => set("outcomes", toggle(data.outcomes, item))}
                >
                  <span>{data.outcomes.includes(item) ? "✓" : "+"}</span>{item}
                </button>
              ))}
            </div>
            {error && <p className="formError" role="alert">{error}</p>}
            <div className="briefActions">
              <button type="button" className="briefBack" onClick={() => setStep(3)}>← Retour</button>
              <button type="button" className="briefNext" onClick={() => go(5)}>Continuer →</button>
            </div>
          </fieldset>
        )}

        {step === 5 && (
          <fieldset className="needBriefPane">
            <legend>Précisez le résultat attendu.</legend>
            <p className="paneHelp">Ces détails sont facultatifs mais améliorent la première lecture du besoin.</p>
            <div className="needBriefFields">
              <label>
                <span>À quoi ressemblerait un bon résultat ?</span>
                <textarea
                  rows="3"
                  value={data.desiredResult}
                  onChange={(e) => set("desiredResult", e.target.value)}
                  placeholder="Ex. traiter une demande en 5 minutes au lieu de 30..."
                />
              </label>
              <label>
                <span>Contraintes ou points de vigilance</span>
                <textarea
                  rows="3"
                  value={data.constraints}
                  onChange={(e) => set("constraints", e.target.value)}
                  placeholder="Sécurité, validation humaine, outils imposés, données..."
                />
              </label>
              <label>
                <span>Quand souhaitez-vous avancer ?</span>
                <select value={data.timeline} onChange={(e) => set("timeline", e.target.value)}>
                  <option value="">À préciser</option>
                  {TIMELINES.map((item) => <option value={item} key={item}>{item}</option>)}
                </select>
              </label>
            </div>
            <div className="briefActions">
              <button type="button" className="briefBack" onClick={() => setStep(4)}>← Retour</button>
              <button type="button" className="briefNext" onClick={() => go(6)}>Continuer →</button>
            </div>
          </fieldset>
        )}

        {step === 6 && (
          <fieldset className="needBriefPane">
            <legend>Où pouvons-nous vous répondre ?</legend>
            <p className="paneHelp">Les champs marqués * sont nécessaires pour vous recontacter.</p>

            <div className="fieldGrid fieldGridCompact">
              <label><span>Prénom *</span><input value={data.firstName} onChange={(e) => set("firstName", e.target.value)} autoComplete="given-name" /></label>
              <label><span>Nom</span><input value={data.lastName} onChange={(e) => set("lastName", e.target.value)} autoComplete="family-name" /></label>
              <label><span>Entreprise *</span><input value={data.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" /></label>
              <label><span>E-mail professionnel *</span><input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" /></label>
              <label className="fullField"><span>Téléphone</span><input type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" /></label>
            </div>

            <label className="consentLine consentLineCompact">
              <input type="checkbox" checked={data.marketingConsent} onChange={(e) => set("marketingConsent", e.target.checked)} />
              <span>J’accepte de recevoir des informations commerciales d’Autonomia. Facultatif.</span>
            </label>

            {error && <p className="formError" role="alert">{error}</p>}

            <div className="briefActions">
              <button type="button" className="briefBack" onClick={() => setStep(5)}>← Retour</button>
              <button className="briefSubmit" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Envoi…" : "Envoyer ma demande →"}
              </button>
            </div>
          </fieldset>
        )}
      </form>
    </section>
  );
}
