"use client";

import { useState } from "react";
import { trackEvent, trackLeadConversion } from "@/lib/clientTracking";

function attribution() {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const get = (key) => url.searchParams.get(key);
  return {
    landing_page_url: url.href,
    landing_page_topic: window.location.pathname,
    referrer_url: document.referrer || null,
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_content: get("utm_content"),
    utm_term: get("utm_term"),
    gclid: get("gclid"),
    fbclid: get("fbclid")
  };
}

export default function ProblemLeadForm({ problem }) {
  const [data, setData] = useState({ name: "", company: "", email: "", need: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const set = (key, value) => setData((current) => ({ ...current, [key]: value }));

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (!data.name || !data.company || !data.email) {
      setError("Merci de renseigner votre nom, votre organisation et votre e-mail.");
      return;
    }

    setStatus("sending");
    const formId = "problem-lp-" + problem.slug;
    const requestedService = "SOLUTION IA - " + problem.title;
    trackEvent("problem_lp_lead_submit", {
      form_id: formId,
      requested_service: requestedService,
      problem_slug: problem.slug,
      problem_cluster: problem.cluster
    });

    const payload = {
      external_lead_id: crypto.randomUUID(),
      source_channel: "website",
      source_platform: "autonomia_public_site",
      received_at: new Date().toISOString(),
      first_name: data.name,
      email: data.email,
      company_name: data.company,
      requested_service: requestedService,
      message: ["Problème : " + problem.title, "Besoin : " + (data.need || "À préciser")].join("\n"),
      form_id: formId,
      problem_slug: problem.slug,
      problem_cluster: problem.cluster,
      ...attribution()
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("failed");
      trackLeadConversion({
        form_id: formId,
        requested_service: requestedService,
        problem_slug: problem.slug,
        problem_cluster: problem.cluster
      });
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("La demande n’a pas pu être transmise. Merci de réessayer.");
    }
  }

  if (status === "sent") {
    return <div className="problemLeadSuccess"><strong>Demande reçue.</strong><p>Votre cas est enregistré. Nous repartirons de votre flux réel, pas d’un scénario générique.</p></div>;
  }

  return (
    <form className="problemLeadForm" onSubmit={submit}>
      <p className="eyebrow">PROTOTYPE SUR VOTRE FLUX</p>
      <h2>{problem.cta}</h2>
      <label><span>Nom / fonction *</span><input value={data.name} onChange={(e)=>set("name",e.target.value)} /></label>
      <label><span>Organisation *</span><input value={data.company} onChange={(e)=>set("company",e.target.value)} /></label>
      <label><span>E-mail professionnel *</span><input type="email" value={data.email} onChange={(e)=>set("email",e.target.value)} /></label>
      <label><span>Votre irritant</span><textarea rows="3" placeholder={problem.prompt} value={data.need} onChange={(e)=>set("need",e.target.value)} /></label>
      {error && <p className="formError">{error}</p>}
      <button type="submit" disabled={status==="sending"}>{status==="sending"?"Envoi…":"Voir ce qu’on peut construire"}</button>
      <small>Pas besoin de cahier des charges. Quelques phrases suffisent pour commencer.</small>
    </form>
  );
}
