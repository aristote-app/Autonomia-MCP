"use client";

import { useState } from "react";

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

export default function TerritoryLeadCard({ variant = "general", title = "Réserver mon diagnostic offert" }) {
  const [data, setData] = useState({ name: "", function: "", collectivity: "", email: "", need: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const set = (key, value) => setData((current) => ({ ...current, [key]: value }));

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!data.name || !data.collectivity || !data.email) {
      setError("Merci de renseigner votre nom, votre collectivité et votre e-mail.");
      return;
    }

    setStatus("sending");

    const payload = {
      external_lead_id: crypto.randomUUID(),
      source_channel: "website",
      source_platform: "autonomia_public_site",
      received_at: new Date().toISOString(),
      first_name: data.name,
      email: data.email,
      company_name: data.collectivity,
      requested_service: "AUTONOMIA TERRITOIRES - " + variant,
      message: [
        "Fonction : " + (data.function || "Non renseignée"),
        "Besoin : " + (data.need || "À préciser")
      ].join("\n"),
      form_id: "territories-top-" + variant,
      ...attribution()
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("failed");
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("La demande n’a pas pu être envoyée. Merci de réessayer.");
    }
  }

  if (status === "sent") {
    return (
      <div className="territoryLeadCard success">
        <span>✓</span>
        <strong>Demande reçue.</strong>
        <p>Nous avons bien enregistré votre demande de diagnostic Territoires.</p>
      </div>
    );
  }

  return (
    <form className="territoryLeadCard" onSubmit={submit}>
      <p className="eyebrow">DIAGNOSTIC FLASH OFFERT</p>
      <h2>{title}</h2>
      <label><span>Nom et fonction *</span><input value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="Nom" /></label>
      <label><span>Fonction</span><input value={data.function} onChange={(e) => set("function", e.target.value)} placeholder="DGS, DGA, direction…" /></label>
      <label><span>Collectivité *</span><input value={data.collectivity} onChange={(e) => set("collectivity", e.target.value)} placeholder="Nom de la collectivité" /></label>
      <label><span>E-mail professionnel *</span><input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} /></label>
      <label><span>Votre irritant principal</span><textarea rows="3" value={data.need} onChange={(e) => set("need", e.target.value)} placeholder="Ex. nos inscriptions au conservatoire prennent deux semaines…" /></label>
      {error && <p className="formError">{error}</p>}
      <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Envoi…" : "Réserver mon diagnostic offert"}</button>
      <small>Formulaire court. Pas de cahier des charges nécessaire.</small>
    </form>
  );
}
