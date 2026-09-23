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

export default function NeedBriefQuestionnaire() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [briefReady, setBriefReady] = useState(false);
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
    email: "",
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
      setBriefReady(false);
    }

    try {
      const stored = JSON.parse(window.sessionStorage.getItem("autonomia_selected_usecase") || "null");
      if (stored) applyUseCase(stored);
    } catch {}

    function onUseCase(event) {
      applyUseCase(event.detail);
    }

    window.addEventListener("autonomia-usecase-selected", onUseCase);
    return () => window.removeEventListener("autonomia-usecase-selected", onUseCase);
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
    if (step === 1 && data.areas.length === 0 && !data.organizationContext.trim()) {
      setError("Cochez au moins une zone concernée ou décrivez brièvement votre contexte.");
      return;
    }
    if (step === 2 && data.pains.length === 0 && !data.processToday.trim()) {
      setError("Cochez au moins un irritant ou décrivez le processus qui vous pose problème.");
      return;
    }
    trackEvent("need_brief_step", { form_id: "home-need-brief", step: nextStep });
    setStep(nextStep);
  }

  function prepareBrief() {
    if (data.outcomes.length === 0 && !data.desiredResult.trim()) {
      setError("Cochez au moins un résultat attendu ou décrivez ce que vous aimeriez obtenir.");
      return;
    }
    setError("");
    setBriefReady(true);
    trackEvent("need_brief_ready", { form_id: "home-need-brief", pain_count: data.pains.length });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!briefReady) {
      prepareBrief();
      return;
    }

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
      requested_service: "audit_ia_offert",
      message,
      desired_timeline: data.timeline || null,
      company_size: data.companySize || null,
      form_id: "home-need-brief",
      need_brief: brief,
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
        mode: "audit",
        requested_service: "audit_ia_offert"
      });
    } catch {
      setStatus("error");
      setError("La fiche n’a pas pu être envoyée. Merci de réessayer.");
    }
  }

  if (status === "sent") {
    return (
      <section className="needBriefSection" id="fiche-besoin">
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
    <section className="needBriefSection" id="fiche-besoin">
      <div className="needBriefIntro">
        <p className="sectionIndex">04 — PRÉCISER VOTRE BESOIN</p>
        <div>
          <h2>Construisons votre fiche besoin en trois volets.</h2>
          <p>
            Pas besoin de cahier des charges. Cochez ce qui vous ressemble, ajoutez ce qui manque,
            puis vérifiez la fiche avant de nous l’envoyer.
          </p>
        </div>
      </div>

      <form className="needBriefForm" onSubmit={submit}>
        <div className="needBriefProgress" aria-label={`Étape ${step} sur 3`}>
          {[1, 2, 3].map((item) => (
            <button
              key={item}
              type="button"
              className={item === step ? "active" : item < step ? "done" : ""}
              onClick={() => item < step && setStep(item)}
              disabled={item > step}
            >
              <span>0{item}</span>
              <strong>{item === 1 ? "Organisation" : item === 2 ? "Irritants" : "Résultat"}</strong>
            </button>
          ))}
        </div>

        {step === 1 && (
          <fieldset className="needBriefPane">
            <legend>1. Où le besoin se situe-t-il dans votre organisation ?</legend>
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
            <div className="needBriefFields twoCols">
              <label>
                <span>Taille approximative de l’organisation</span>
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
                <span>Votre contexte en quelques mots</span>
                <textarea
                  rows="4"
                  value={data.organizationContext}
                  onChange={(e) => set("organizationContext", e.target.value)}
                  placeholder="Équipe concernée, activité, situation..."
                />
              </label>
            </div>
            {error && <p className="formError" role="alert">{error}</p>}
            <button className="briefNext" type="button" onClick={() => go(2)}>Continuer vers les irritants →</button>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="needBriefPane">
            <legend>2. Qu’est-ce qui vous ralentit aujourd’hui ?</legend>
            <p className="paneHelp">Cochez les problèmes concernés, même s’ils ne sont pas encore parfaitement définis.</p>
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
            <div className="needBriefFields twoCols">
              <label>
                <span>Décrivez le processus aujourd’hui</span>
                <textarea
                  rows="5"
                  value={data.processToday}
                  onChange={(e) => set("processToday", e.target.value)}
                  placeholder="Qui fait quoi, à quel moment, où ça bloque..."
                />
              </label>
              <label>
                <span>Quels outils utilisez-vous déjà ?</span>
                <textarea
                  rows="5"
                  value={data.toolsToday}
                  onChange={(e) => set("toolsToday", e.target.value)}
                  placeholder="Ex. Outlook, Excel, CRM, Drive, logiciel métier..."
                />
              </label>
            </div>
            {error && <p className="formError" role="alert">{error}</p>}
            <div className="briefActions">
              <button type="button" className="briefBack" onClick={() => setStep(1)}>← Retour</button>
              <button type="button" className="briefNext" onClick={() => go(3)}>Continuer vers le résultat →</button>
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset className="needBriefPane">
            <legend>3. Où voulez-vous arriver ?</legend>
            <p className="paneHelp">Nous utiliserons ces éléments pour préparer la première lecture du besoin.</p>
            <div className="needCheckGrid outcomes">
              {OUTCOMES.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={data.outcomes.includes(item) ? "selected" : ""}
                  onClick={() => { set("outcomes", toggle(data.outcomes, item)); setBriefReady(false); }}
                >
                  <span>{data.outcomes.includes(item) ? "✓" : "+"}</span>{item}
                </button>
              ))}
            </div>

            <div className="needBriefFields">
              <label>
                <span>À quoi ressemblerait un bon résultat pour vous ?</span>
                <textarea
                  rows="4"
                  value={data.desiredResult}
                  onChange={(e) => { set("desiredResult", e.target.value); setBriefReady(false); }}
                  placeholder="Ex. traiter une demande en 5 minutes au lieu de 30..."
                />
              </label>
              <label>
                <span>Contraintes, données sensibles ou points de vigilance</span>
                <textarea
                  rows="4"
                  value={data.constraints}
                  onChange={(e) => { set("constraints", e.target.value); setBriefReady(false); }}
                  placeholder="Sécurité, validation humaine, outils imposés, données..."
                />
              </label>
              <label>
                <span>Quand souhaitez-vous avancer ?</span>
                <select value={data.timeline} onChange={(e) => { set("timeline", e.target.value); setBriefReady(false); }}>
                  <option value="">À préciser</option>
                  {TIMELINES.map((item) => <option value={item} key={item}>{item}</option>)}
                </select>
              </label>
            </div>

            {!briefReady && (
              <>
                {error && <p className="formError" role="alert">{error}</p>}
                <div className="briefActions">
                  <button type="button" className="briefBack" onClick={() => setStep(2)}>← Retour</button>
                  <button type="button" className="briefNext" onClick={prepareBrief}>Préparer ma fiche besoin</button>
                </div>
              </>
            )}

            {briefReady && (
              <div className="needBriefPreview">
                <div className="needBriefPreviewHead">
                  <div>
                    <p className="sectionIndex">FICHE BESOIN AUTONOMIA</p>
                    <h3>Voici ce que nous recevrons.</h3>
                  </div>
                  <button type="button" onClick={() => setBriefReady(false)}>Modifier</button>
                </div>

                <dl>
                  <div><dt>Zone concernée</dt><dd>{data.areas.join(", ") || "À préciser"}</dd></div>
                  <div><dt>Contexte</dt><dd>{data.organizationContext || "À préciser pendant l’audit"}</dd></div>
                  <div><dt>Irritants</dt><dd>{data.pains.join(" · ") || data.processToday || "À préciser"}</dd></div>
                  <div><dt>Processus actuel</dt><dd>{data.processToday || "À préciser pendant l’audit"}</dd></div>
                  <div><dt>Outils</dt><dd>{data.toolsToday || "À préciser"}</dd></div>
                  <div><dt>Résultat attendu</dt><dd>{data.outcomes.join(" · ") || data.desiredResult || "À préciser"}</dd></div>
                  <div><dt>Contraintes</dt><dd>{data.constraints || "Aucune indiquée à ce stade"}</dd></div>
                  <div><dt>Timing</dt><dd>{data.timeline || "À définir"}</dd></div>
                </dl>

                <div className="briefContact">
                  <h3>Où pouvons-nous vous répondre ?</h3>
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
                  <p className="privacyNote">Les informations envoyées servent à analyser votre demande et à vous recontacter. Le consentement marketing est facultatif.</p>
                  {error && <p className="formError" role="alert">{error}</p>}
                  <button className="briefSubmit" type="submit" disabled={status === "sending"}>
                    {status === "sending" ? "Envoi de la fiche…" : "Envoyer ma fiche besoin à Autonomia →"}
                  </button>
                </div>
              </div>
            )}
          </fieldset>
        )}
      </form>
    </section>
  );
}
