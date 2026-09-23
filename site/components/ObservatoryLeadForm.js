"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent, trackLeadConversion } from "@/lib/clientTracking";
import { getClientAttribution } from "@/lib/clientAttribution";

export default function ObservatoryLeadForm({ topic, compact = false }) {
  const [data, setData] = useState({ name: "", company: "", email: "", need: "", marketingConsent: false });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [labContext, setLabContext] = useState(null);
  const formStarted = useRef(false);

  const set = (key, value) => setData((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    function prefill(event) {
      const need = event.detail?.need;
      if (!need) return;
      const moduleName = event.detail?.moduleName || null;
      const moduleIndex = event.detail?.moduleIndex || null;
      setLabContext({ moduleName, moduleIndex });
      setData((current) => current.need ? current : { ...current, need });
      trackEvent("observatory_lead_prefill", {
        landing_page_topic: topic.slug,
        source_surface: "autonomia_lab",
        module_name: moduleName,
        module_index: moduleIndex
      });
    }
    window.addEventListener("autonomia:prefill-observatory-lead", prefill);
    return () => window.removeEventListener("autonomia:prefill-observatory-lead", prefill);
  }, [topic.slug]);

  function markFormStart() {
    if (formStarted.current) return;
    formStarted.current = true;
    trackEvent("observatory_form_start", {
      landing_page_topic: topic.slug,
      module_name: labContext?.moduleName || null,
      module_index: labContext?.moduleIndex || null
    });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!data.name || !data.company || !data.email) {
      setError("Merci de renseigner votre nom, votre organisation et votre e-mail.");
      return;
    }

    setStatus("sending");
    trackEvent("observatory_lead_submit", {
      form_id: "observatoire-landing-" + topic.slug,
      requested_service: "OBSERVATOIRE IA - " + topic.title,
      landing_page_topic: topic.slug
    });

    const payload = {
      external_lead_id: crypto.randomUUID(),
      source_channel: "website",
      source_platform: "autonomia_public_site",
      received_at: new Date().toISOString(),
      first_name: data.name,
      email: data.email,
      company_name: data.company,
      requested_service: "OBSERVATOIRE IA - " + topic.title,
      message: [
        "Page : " + topic.title,
        "Besoin exprimé : " + (data.need || "À préciser")
      ].join("\n"),
      form_id: "observatoire-landing-" + topic.slug,
      landing_page_topic: topic.slug,
      lab_module_name: labContext?.moduleName || null,
      lab_module_index: labContext?.moduleIndex || null,
      ...getClientAttribution(),
      marketing_consent: Boolean(data.marketingConsent),
      consent_timestamp: new Date().toISOString(),
      privacy_notice_version: "2026-09-20-v1",
      consent_source: "observatoire-landing-" + topic.slug
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("failed");
      trackLeadConversion({
        form_id: payload.form_id,
        requested_service: payload.requested_service,
        landing_page_topic: topic.slug
      });
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("La demande n’a pas pu être transmise. Merci de réessayer.");
    }
  }

  if (status === "sent") {
    return (
      <div className="obsLeadSuccess">
        <strong>Demande reçue.</strong>
        <p>Nous avons bien enregistré votre besoin sur « {topic.title} ».</p>
      </div>
    );
  }

  return (
    <form className={compact ? "obsLeadForm compact" : "obsLeadForm"} onSubmit={submit} onFocusCapture={markFormStart}>
      <p className="eyebrow">PARLONS DE VOTRE CAS</p>
      <h2>Quel temps voulez-vous rendre à vos équipes ?</h2>

      <label>
        <span>Nom / fonction *</span>
        <input value={data.name} onChange={(e) => set("name", e.target.value)} />
      </label>
      <label>
        <span>Organisation *</span>
        <input value={data.company} onChange={(e) => set("company", e.target.value)} />
      </label>
      <label>
        <span>E-mail professionnel *</span>
        <input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} />
      </label>
      <label>
        <span>Décrivez l’irritant avec vos mots</span>
        <textarea rows="4" placeholder={topic.prompt} value={data.need} onChange={(e) => set("need", e.target.value)} />
      </label>

      <label className="consentLine">
        <input type="checkbox" checked={data.marketingConsent} onChange={(e) => set("marketingConsent", e.target.checked)} />
        <span>J’accepte de recevoir des informations commerciales d’Autonomia. Facultatif.</span>
      </label>
      <p className="privacyNote">Les informations envoyées sont utilisées pour répondre à votre demande. Le consentement marketing est facultatif.</p>

      {error && <p className="formError">{error}</p>}

      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Envoi…" : "Recevoir un diagnostic"}
      </button>
      <small>Pas besoin de cahier des charges. Décrivez simplement ce qui vous fait perdre du temps.</small>
    </form>
  );
}
